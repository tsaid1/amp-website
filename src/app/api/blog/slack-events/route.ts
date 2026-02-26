import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import {
  getMessage,
  getThreadReplies,
  postThreadReply,
} from "@/lib/pipeline/slack";

const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET;
const SLACK_CHANNEL_ID = process.env.SLACK_CHANNEL_ID;
const PIPELINE_SECRET = process.env.PIPELINE_SECRET;

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
  // Match the metadata line: 📊 _Title: ... | Keyword: ... | Persona: ... | Pillar: ... | Brief: ..._
  const match = text.match(
    /📊\s*_Title:\s*(.+?)\s*\|\s*Keyword:\s*(.+?)\s*\|\s*Persona:\s*(.+?)\s*\|\s*Pillar:\s*(.+?)\s*\|\s*Brief:\s*(.+?)_/
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

// --- Trigger draft generation asynchronously ---

function triggerDraftGeneration(
  topic: TopicData,
  publishDay: string,
  threadTs: string
) {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Fire-and-forget — don't await
  fetch(`${baseUrl}/api/blog/generate-post`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${PIPELINE_SECRET}`,
    },
    body: JSON.stringify({
      title: topic.title,
      keyword: topic.keyword,
      persona: topic.persona,
      pillar: topic.pillar,
      brief: topic.brief,
      publishDay,
    }),
  }).catch((err) => {
    console.error("Failed to trigger draft generation:", err);
    postThreadReply(threadTs, `❌ Failed to trigger draft generation: ${err.message}`).catch(
      () => {}
    );
  });
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

  console.log("Slack event received:", JSON.stringify(body, null, 2));

  // Handle URL verification challenge
  if (body.type === "url_verification") {
    return NextResponse.json({ challenge: body.challenge });
  }

  // Handle event callbacks
  if (body.type === "event_callback") {
    const event = body.event as Record<string, unknown>;
    console.log("Event type:", event.type, "Reaction:", event.reaction);

    if (
      event.type === "reaction_added" &&
      event.reaction === "white_check_mark"
    ) {
      const item = event.item as { channel: string; ts: string; type: string };
      console.log("Channel match:", item.channel, "Expected:", SLACK_CHANNEL_ID);

      // Only handle reactions in the blog pipeline channel
      if (item.channel !== SLACK_CHANNEL_ID) {
        console.log("Ignoring: channel mismatch");
        return NextResponse.json({ ok: true });
      }

      // Only handle reactions on messages
      if (item.type !== "message") {
        console.log("Ignoring: item type is", item.type, "not message");
        return NextResponse.json({ ok: true });
      }

      // Process async — respond to Slack immediately
      (async () => {
        try {
          // Fetch the reacted-to message to get topic data
          console.log("Fetching message:", item.channel, item.ts);
          const message = await getMessage(item.channel, item.ts);
          console.log("Fetched message text:", message?.text?.slice(0, 200));
          if (!message?.text) {
            console.log("Ignoring: message has no text");
            return;
          }

          const topic = parseTopicMetadata(message.text);
          console.log("Parsed topic metadata:", topic);
          if (!topic) {
            console.log("Ignoring: no topic metadata found in message");
            return;
          }

          // This message is a thread reply. Get the parent thread_ts.
          const threadTs = message.thread_ts;
          console.log("Thread ts:", threadTs);
          if (!threadTs) {
            console.log("Ignoring: message is not in a thread");
            return;
          }

          // Count total ✅ across the thread to determine Tuesday vs Thursday
          console.log("Fetching thread replies for:", item.channel, threadTs);
          const totalCheckmarks = await countCheckmarksInThread(
            item.channel,
            threadTs
          );
          console.log("Total ✅ reactions in thread:", totalCheckmarks);

          if (totalCheckmarks > 2) {
            console.log("Ignoring: already processed both slots");
            return;
          }

          const publishDay = totalCheckmarks <= 1 ? "Tuesday" : "Thursday";

          // Post confirmation in thread
          console.log("Posting thread confirmation for:", publishDay, topic.title);
          await postThreadReply(
            threadTs,
            `⏳ Generating ${publishDay}'s draft: *${topic.title}*...`
          );
          console.log("Thread confirmation posted");

          console.log("Triggering draft generation for:", publishDay, topic.title);
          // Fire off draft generation
          triggerDraftGeneration(topic, publishDay, threadTs);
        } catch (err) {
          console.error("Error at async reaction handler:", err);
        }
      })();

      return NextResponse.json({ ok: true });
    }
  }

  return NextResponse.json({ ok: true });
}
