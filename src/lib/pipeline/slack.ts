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

export function formatTopicProposal(topics: TopicProposal[]) {
  const blocks: SlackBlock[] = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "📝 Blog Topic Proposals — This Week",
        emoji: true,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "React with ✅ on *2 topics* to approve them (one for Tuesday, one for Thursday). Reply in a thread to suggest edits.",
      },
    },
    { type: "divider" },
  ];

  topics.forEach((topic, i) => {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${i + 1}. ${topic.title}*\n${topic.brief}`,
      },
    });
    blocks.push({
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*Keyword:* ${topic.keyword}`,
        },
        {
          type: "mrkdwn",
          text: `*Persona:* ${topic.persona}`,
        },
        {
          type: "mrkdwn",
          text: `*Pillar:* ${topic.pillar}`,
        },
        {
          type: "mrkdwn",
          text: `*Timeliness:* ${topic.timeliness}`,
        },
      ],
    });
    blocks.push({ type: "divider" });
  });

  return blocks;
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
