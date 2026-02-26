import { NextRequest, NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import crypto from "crypto";
import {
  getMessage,
  getThreadReplies,
  postThreadReply,
  postMessage,
  formatDraftPreview,
  type DraftPreview,
} from "@/lib/pipeline/slack";
import { generateBlogPost } from "@/lib/pipeline/generate";
import { generateSlug } from "@/lib/pipeline/publish";
import readingTime from "reading-time";

const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET;
const SLACK_CHANNEL_ID = process.env.SLACK_CHANNEL_ID;

// --- Slack request signature verification ---

async function verifySlackSignature(
  req: NextRequest,
  rawBody: string
): Promise<boolean> {
  if (!SLACK_SIGNING_SECRET) {
    console.warn("SLACK_SIGNING_SECRET not set — skipping verification");
    return true;
  }

  const timestamp = req.headers.get("x-slack-request-timestamp");
  const slackSignature = req.headers.get("x-slack-signature");
  if (!timestamp || !slackSignature) return false;

  // Reject requests older than 5 minutes to prevent replay attacks
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - Number(timestamp)) > 300) return false;

  const sigBasestring = `v0:${timestamp}:${rawBody}`;
  const hmac = crypto.createHmac("sha256", SLACK_SIGNING_SECRET);
  hmac.update(sigBasestring);
  const computedSignature = `v0=${hmac.digest("hex")}`;

  try {
    return crypto.timingSafeEqual(
      Buffer.from(computedSignature),
      Buffer.from(slackSignature)
    );
  } catch {
    return false;
  }
}

// --- Topic metadata parsing ---

interface TopicData {
  title: string;
  keyword: string;
  persona: string;
  pillar: string;
  brief: string;
}

function parseTopicMetadata(text: string): TopicData | null {
  // Match the metadata line — Slack returns emoji as :bar_chart: not 📊
  const match = text.match(
    /:bar_chart:\s*_Title:\s*(.+?)\s*\|\s*Keyword:\s*(.+?)\s*\|\s*Persona:\s*(.+?)\s*\|\s*Pillar:\s*(.+?)\s*\|\s*Brief:\s*(.+?)_/
  );
  if (!match) return null;

  return {
    title: match[1].trim(),
    keyword: match[2].trim(),
    persona: match[3].trim(),
    pillar: match[4].trim(),
    brief: match[5].trim(),
  };
}

// --- Count total ✅ reactions across all messages in a thread ---

async function countCheckmarksInThread(
  channelId: string,
  threadTs: string
): Promise<number> {
  const messages = await getThreadReplies(channelId, threadTs);
  let total = 0;
  for (const msg of messages) {
    const reactions: { name: string; count: number }[] = msg.reactions || [];
    const checkmark = reactions.find((r) => r.name === "white_check_mark");
    if (checkmark) total += checkmark.count;
  }
  return total;
}

// --- Generate draft directly (no HTTP self-call) ---

async function generateDraft(
  topic: TopicData,
  publishDay: string,
  threadTs: string
) {
  const result = await generateBlogPost(
    topic.title,
    topic.keyword,
    topic.persona,
    topic.pillar,
    topic.brief
  );

  const slug = generateSlug(topic.title);
  const stats = readingTime(result.content);
  const wordCount = result.content.split(/\s+/).length;

  const draft: DraftPreview = {
    title: topic.title,
    description: result.description,
    keyword: topic.keyword,
    readingTime: stats.text,
    wordCount,
    contentPreview: result.content.slice(0, 500).replace(/\n/g, " ") + "...",
    publishDay,
    slug,
    fullContent: result.content,
  };

  const blocks = formatDraftPreview(draft);
  await postMessage(
    `📄 Draft ready for review: "${topic.title}"`,
    blocks
  );

  await postThreadReply(threadTs, `✅ Draft generated and posted for review: *${topic.title}*`);
}

// --- Route handler ---

export async function POST(req: NextRequest) {
  // Immediately return 200 for Slack retries
  const retryNum = req.headers.get("x-slack-retry-num");
  if (retryNum) {
    return NextResponse.json({ ok: true });
  }

  const rawBody = await req.text();

  // Verify Slack signature
  if (!(await verifySlackSignature(req, rawBody))) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Handle URL verification challenge
  if (body.type === "url_verification") {
    return NextResponse.json({ challenge: body.challenge });
  }

  // Handle event callbacks
  if (body.type === "event_callback") {
    const event = body.event as Record<string, unknown>;

    if (
      event.type === "reaction_added" &&
      event.reaction === "white_check_mark"
    ) {
      const item = event.item as { channel: string; ts: string; type: string };

      // Only handle reactions in the blog pipeline channel
      if (item.channel !== SLACK_CHANNEL_ID) {
        return NextResponse.json({ ok: true });
      }

      // Only handle reactions on messages
      if (item.type !== "message") {
        return NextResponse.json({ ok: true });
      }

      // Process async — waitUntil keeps the function alive after returning 200
      async function handleReaction() {
        try {
          const message = await getMessage(item.channel, item.ts);
          if (!message?.text) return;

          const topic = parseTopicMetadata(message.text);
          if (!topic) return;

          const threadTs = message.thread_ts;
          if (!threadTs) return;

          const totalCheckmarks = await countCheckmarksInThread(
            item.channel,
            threadTs
          );
          if (totalCheckmarks > 2) return;

          const publishDay = totalCheckmarks <= 1 ? "Tuesday" : "Thursday";

          await postThreadReply(
            threadTs,
            `⏳ Generating ${publishDay}'s draft: *${topic.title}*...`
          );

          await generateDraft(topic, publishDay, threadTs);
        } catch (err) {
          console.error("Slack reaction handler error:", err);
        }
      }

      waitUntil(handleReaction());

      return NextResponse.json({ ok: true });
    }
  }

  return NextResponse.json({ ok: true });
}
