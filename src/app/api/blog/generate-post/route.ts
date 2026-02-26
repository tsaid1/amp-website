import { NextResponse } from "next/server";
import { generateBlogPost } from "@/lib/pipeline/generate";
import {
  postMessage,
  formatDraftPreview,
  type DraftPreview,
} from "@/lib/pipeline/slack";
import { generateSlug } from "@/lib/pipeline/publish";
import readingTime from "reading-time";

const PIPELINE_SECRET = process.env.PIPELINE_SECRET;

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (PIPELINE_SECRET && authHeader !== `Bearer ${PIPELINE_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, keyword, persona, pillar, brief, publishDay } = body;

    if (!title || !keyword || !persona || !pillar || !brief) {
      return NextResponse.json(
        { error: "Missing required fields: title, keyword, persona, pillar, brief" },
        { status: 400 }
      );
    }

    // Generate the full blog post
    const result = await generateBlogPost(title, keyword, persona, pillar, brief);

    const slug = generateSlug(title);
    const stats = readingTime(result.content);
    const wordCount = result.content.split(/\s+/).length;

    // Prepare draft preview for Slack
    const draft: DraftPreview = {
      title,
      description: result.description,
      keyword,
      readingTime: stats.text,
      wordCount,
      contentPreview: result.content.slice(0, 500).replace(/\n/g, " ") + "...",
      publishDay: publishDay || "Next scheduled day",
      slug,
      fullContent: result.content,
    };

    // Post to Slack for approval
    const blocks = formatDraftPreview(draft);
    const slackResponse = await postMessage(
      `📄 Draft ready for review: "${title}"`,
      blocks
    );

    return NextResponse.json({
      success: true,
      slug,
      slackTs: slackResponse.ts,
      draft: {
        title,
        description: result.description,
        keywords: result.keywords,
        content: result.content,
        readingTime: stats.text,
        wordCount,
      },
    });
  } catch (error) {
    console.error("Post generation error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate blog post",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
