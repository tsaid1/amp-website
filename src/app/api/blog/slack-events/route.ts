import { NextRequest, NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import crypto from "crypto";
import {
  getMessage,
  getThreadReplies,
  postThreadReply,
  postMessage,
  addReaction,
  formatDraftPreview,
  type DraftPreview,
} from "@/lib/pipeline/slack";
import { generateBlogPost } from "@/lib/pipeline/generate";
import {
  generateSlug,
  saveDraftToGitHub,
  moveDraftToApproved,
} from "@/lib/pipeline/publish";
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

// --- Draft metadata parsing (slug + title only, content lives in GitHub) ---

interface DraftMeta {
  slug: string;
  title: string;
}

function parseDraftMeta(text: string): DraftMeta | null {
  const match = text.match(/_DRAFT_META:([\s\S]*?)_$/);
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

async function findDraftMetaInThread(
  channelId: string,
  threadTs: string
): Promise<DraftMeta | null> {
  const messages = await getThreadReplies(channelId, threadTs);
  for (const msg of messages) {
    if (msg.text) {
      const data = parseDraftMeta(msg.text);
      if (data) return data;
    }
  }
  return null;
}

// --- Message type detection ---

function isDraftPreviewMessage(text: string): boolean {
  return text.includes("Draft ready for review") || text.includes("Draft Ready:");
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

// --- Generate draft: create content, save to GitHub drafts/, post preview to Slack ---

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

  // Save full MDX to GitHub drafts/ directory
  await saveDraftToGitHub({
    slug,
    title: topic.title,
    description: result.description,
    date: new Date().toISOString().split("T")[0],
    author: "Amp Energy",
    category: topic.pillar,
    keywords: result.keywords || [topic.keyword],
    content: result.content,
  });

  // Post draft preview to Slack
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
  const draftMessage = await postMessage(
    `📄 Draft ready for review: "${topic.title}"`,
    blocks
  );

  // Post lightweight metadata reply (no content — it's in GitHub)
  const draftMeta: DraftMeta = { slug, title: topic.title };
  await postThreadReply(
    draftMessage.ts,
    `📦 _DRAFT_META:${JSON.stringify(draftMeta)}_`
  );

  // Confirm in the original topic thread
  await postThreadReply(threadTs, `✅ Draft generated and posted for review: *${topic.title}*`);
}

// --- Next publish date calculation (Tue/Thu 9AM GST) ---

function getNextPublishDate(): string {
  // GST is UTC+4
  const now = new Date();
  const gstOffset = 4 * 60 * 60 * 1000;
  const gstNow = new Date(now.getTime() + gstOffset);
  const dayOfWeek = gstNow.getUTCDay(); // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat

  let daysUntilPublish: number;
  if (dayOfWeek <= 1) {
    // Sun(0) or Mon(1) → next Tuesday
    daysUntilPublish = 2 - dayOfWeek;
  } else if (dayOfWeek <= 3) {
    // Tue(2) or Wed(3) → next Thursday
    daysUntilPublish = 4 - dayOfWeek;
  } else {
    // Thu(4), Fri(5), Sat(6) → next Tuesday
    daysUntilPublish = (7 - dayOfWeek) + 2;
  }

  const publishDate = new Date(gstNow);
  publishDate.setUTCDate(publishDate.getUTCDate() + daysUntilPublish);

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  const dayName = dayNames[publishDate.getUTCDay()];
  const month = monthNames[publishDate.getUTCMonth()];
  const date = publishDate.getUTCDate();

  return `${dayName}, ${month} ${date}`;
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

      if (item.channel !== SLACK_CHANNEL_ID) {
        return NextResponse.json({ ok: true });
      }

      if (item.type !== "message") {
        return NextResponse.json({ ok: true });
      }

      async function handleReaction() {
        try {
          const message = await getMessage(item.channel, item.ts);
          if (!message?.text) return;

          // --- Path 1: Topic proposal → generate draft ---
          const topic = parseTopicMetadata(message.text);
          if (topic) {
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
            return;
          }

          // --- Path 2: Draft preview → approve for scheduled publish ---
          if (isDraftPreviewMessage(message.text)) {
            const draftThreadTs = message.ts;

            const draftMeta = await findDraftMetaInThread(
              item.channel,
              draftThreadTs
            );
            if (!draftMeta) {
              await postThreadReply(
                draftThreadTs,
                "❌ Could not find draft metadata. Was the metadata reply deleted?"
              );
              return;
            }

            await postThreadReply(draftThreadTs, `⏳ Approving: *${draftMeta.title}*...`);

            // Move from drafts/ to approved/ via GitHub API
            await moveDraftToApproved(draftMeta.slug);

            const publishDate = getNextPublishDate();
            await postThreadReply(
              draftThreadTs,
              `✅ Approved! Scheduled for publish on ${publishDate} at 9:00 AM GST`
            );

            await addReaction(item.channel, item.ts, "calendar").catch(() => {});
            return;
          }
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
