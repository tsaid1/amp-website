const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const SLACK_CHANNEL_ID = process.env.SLACK_CHANNEL_ID;

const SLACK_API = "https://slack.com/api";

interface SlackBlock {
  type: string;
  text?: { type: string; text: string; emoji?: boolean };
  elements?: { type: string; text: string }[];
  fields?: { type: string; text: string }[];
}

async function slackFetch(method: string, body: Record<string, unknown>) {
  const res = await fetch(`${SLACK_API}/${method}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!data.ok) {
    throw new Error(`Slack API error (${method}): ${data.error}`);
  }
  return data;
}

export async function postMessage(text: string, blocks?: SlackBlock[]) {
  return slackFetch("chat.postMessage", {
    channel: SLACK_CHANNEL_ID,
    text,
    blocks,
  });
}

export async function postThreadReply(
  threadTs: string,
  text: string,
  blocks?: SlackBlock[]
) {
  return slackFetch("chat.postMessage", {
    channel: SLACK_CHANNEL_ID,
    thread_ts: threadTs,
    text,
    blocks,
  });
}

export async function addReaction(
  channelId: string,
  messageTs: string,
  reaction: string
) {
  return slackFetch("reactions.add", {
    channel: channelId,
    timestamp: messageTs,
    name: reaction,
  });
}

export async function getReactions(messageTs: string) {
  const res = await fetch(
    `${SLACK_API}/reactions.get?channel=${SLACK_CHANNEL_ID}&timestamp=${messageTs}`,
    {
      headers: { Authorization: `Bearer ${SLACK_BOT_TOKEN}` },
    }
  );
  const data = await res.json();
  if (!data.ok) return [];
  return data.message?.reactions || [];
}

export async function getMessage(channelId: string, messageTs: string) {
  // Use conversations.replies — works for both threaded and non-threaded messages.
  // conversations.history only returns top-level messages, missing thread replies.
  const res = await fetch(
    `${SLACK_API}/conversations.replies?channel=${channelId}&ts=${messageTs}&latest=${messageTs}&inclusive=true&limit=1`,
    {
      headers: { Authorization: `Bearer ${SLACK_BOT_TOKEN}` },
    }
  );
  const data = await res.json();
  if (!data.ok) throw new Error(`Slack API error (conversations.replies): ${data.error}`);
  // Find the exact message matching the requested timestamp
  const match = data.messages?.find((m: { ts: string }) => m.ts === messageTs);
  return match || data.messages?.[0] || null;
}

export async function getThreadReplies(channelId: string, threadTs: string) {
  const res = await fetch(
    `${SLACK_API}/conversations.replies?channel=${channelId}&ts=${threadTs}`,
    {
      headers: { Authorization: `Bearer ${SLACK_BOT_TOKEN}` },
    }
  );
  const data = await res.json();
  if (!data.ok) throw new Error(`Slack API error (conversations.replies): ${data.error}`);
  return data.messages || [];
}

export function formatDraftPreview(draft: DraftPreview) {
  const blocks: SlackBlock[] = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: `📄 Draft Ready: ${draft.publishDay}`,
        emoji: true,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${draft.title}*\n\n${draft.description}\n\n*Keyword:* ${draft.keyword} | *Reading time:* ${draft.readingTime} | *Words:* ${draft.wordCount}`,
      },
    },
    { type: "divider" },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Preview (first 500 chars):*\n\`\`\`${draft.contentPreview}\`\`\``,
      },
    },
    { type: "divider" },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "✅ React with checkmark to *publish*\n✏️ Reply in thread with *edit requests*\n❌ React with X to *reject*",
      },
    },
  ];

  return blocks;
}

export interface TopicProposal {
  title: string;
  brief: string;
  keyword: string;
  persona: string;
  pillar: string;
  timeliness: string;
}

export interface DraftPreview {
  title: string;
  description: string;
  keyword: string;
  readingTime: string;
  wordCount: number;
  contentPreview: string;
  publishDay: string;
  slug: string;
  fullContent: string;
}
