import fs from "fs";
import path from "path";
import { getAllPosts } from "@/lib/blog";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_API = "https://api.anthropic.com/v1/messages";

// Load context files from the repo
function loadContext(filename: string): string {
  const filePath = path.join(process.cwd(), "context/blog", filename);
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, "utf-8");
  }
  return "";
}

function getPublishedPostsIndex(): string {
  const posts = getAllPosts();
  if (posts.length === 0) return "No blog posts published yet.";
  return posts
    .map(
      (p) =>
        `- "${p.title}" (${p.category}, keyword focus: ${p.keywords.join(", ")}, slug: ${p.slug})`
    )
    .join("\n");
}

async function callClaude(
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  const res = await fetch(ANTHROPIC_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Claude API error: ${res.status} - ${error}`);
  }

  const data = await res.json();
  return data.content[0]?.text || "";
}

async function callClaudeWithSearch(
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  const res = await fetch(ANTHROPIC_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: systemPrompt,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Claude API error: ${res.status} - ${error}`);
  }

  const data = await res.json();
  // Extract text from potentially multiple content blocks (search results + text)
  const textBlocks = data.content?.filter(
    (block: { type: string }) => block.type === "text"
  );
  return textBlocks?.map((b: { text: string }) => b.text).join("\n") || "";
}

export async function generateTopics(): Promise<string> {
  const brandVoice = loadContext("brand-voice.md");
  const seoKeywords = loadContext("seo-keywords.md");
  const publishedPosts = getPublishedPostsIndex();

  const systemPrompt = `You are the content strategist for Amp Energy, a building energy intelligence platform based in Dubai, UAE. You generate blog topic proposals that serve SEO goals, speak to specific buyer personas, and leverage timely industry news.

## Brand & Voice Context
${brandVoice}

## SEO Keyword Targets
${seoKeywords}

## Already Published Posts (avoid repeating topics)
${publishedPosts}

## Your Task
Generate exactly 5 blog topic proposals. Each must target a DIFFERENT keyword cluster from the SEO map and a different primary persona.

For each topic, use web search to find relevant recent news, regulatory updates, or industry developments from the UAE/GCC energy and buildings sector that can make the topic timely and newsworthy.

## Output Format
Return a valid JSON array with exactly 5 objects, each with these fields:
- "title": Proposed blog post title (under 60 chars, contains primary keyword naturally)
- "brief": 2-3 sentence description of the angle, what makes it timely, and the value to the reader
- "keyword": The primary SEO keyword being targeted
- "persona": The primary buyer persona (Facility Champion, Sustainability Strategist, Executive Sponsor, Procurement Gatekeeper, or Channel Multiplier)
- "pillar": Content pillar (compliance, efficiency, technology, or thought-leadership)
- "timeliness": Why this topic is relevant right now (news hook, regulatory deadline, seasonal factor)

Return ONLY the JSON array. No markdown, no code fences, no explanation.`;

  const userMessage = `Today's date is ${new Date().toISOString().split("T")[0]}. Search for the latest news about UAE energy policy, GCC building energy efficiency, sustainability regulations in the Middle East, and commercial building technology trends. Then generate 5 blog topic proposals based on what you find combined with our SEO keyword targets.`;

  return callClaudeWithSearch(systemPrompt, userMessage);
}

export async function generateBlogPost(
  title: string,
  keyword: string,
  persona: string,
  pillar: string,
  brief: string
): Promise<{ content: string; description: string; keywords: string[] }> {
  const brandVoice = loadContext("brand-voice.md");
  const seoKeywords = loadContext("seo-keywords.md");
  const publishedPosts = getPublishedPostsIndex();

  const systemPrompt = `You are a senior content writer for Amp Energy, a building energy intelligence platform in Dubai, UAE. You write expert blog posts that rank for SEO, establish thought leadership, and resonate with specific buyer personas.

## Brand & Voice Context
${brandVoice}

## SEO Keyword Targets
${seoKeywords}

## Already Published Posts (link to these where natural)
${publishedPosts}

## Amp Product Facts (weave in naturally, never forced)
- Equipment-level energy monitoring with clamp-on sensors
- No BMS required, works on any building
- 24-hour deployment, zero downtime
- 10–20% energy savings typically identified
- <1 year payback period
- 0.2% margin of error
- Clients include IKEA, Chalhoub Group, Buro Happold, Amazon, Masdar
- UAE Federal Decree-Law No. 11 compliance — Scope 2 data collection
- AI-powered savings recommendations
- Building energy rating system (A to F)
- Portfolio-wide multi-site visibility

## Your Task
Write a complete blog post with the specifications below.

**Target:**
- Title: ${title}
- Primary keyword: ${keyword}
- Target persona: ${persona}
- Content pillar: ${pillar}
- Brief: ${brief}

## Output Format
Return a JSON object with these fields:
- "description": Meta description (150-160 chars, includes primary keyword)
- "keywords": Array of 5-8 relevant keywords/phrases
- "content": The full blog post in Markdown format following the structure in the brand voice guide (Hook → Context → Insight → Amp Connection → Conclusion + CTA → FAQ). 800-1200 words excluding FAQ. Include 2-3 FAQ items at the end under a "## Frequently Asked Questions" heading with ### for each question.

Return ONLY the JSON object. No markdown code fences, no explanation.`;

  const userMessage = `Write the blog post now. Use web search if you need current data, statistics, or recent news to support the article. Make it genuinely insightful and useful — not generic filler.`;

  const response = await callClaudeWithSearch(systemPrompt, userMessage);

  let parsed: { content: string; description: string; keywords: string[] };
  try {
    // Try to parse the response as JSON
    const cleaned = response.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    parsed = JSON.parse(cleaned);
  } catch {
    // If JSON parsing fails, try to extract JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error("Failed to parse blog post response as JSON");
    }
  }

  // Strip citation tags that Claude's web search may inject
  parsed.content = parsed.content
    .replace(/(<cite[^>]*>|<\/cite>)/g, "")
    .replace(/(<source[^>]*>|<\/source>)/g, "");

  return parsed;
}
