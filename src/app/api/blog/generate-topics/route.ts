import { NextResponse } from "next/server";
import { generateTopics } from "@/lib/pipeline/generate";
import {
  postMessage,
  postThreadReply,
  type TopicProposal,
} from "@/lib/pipeline/slack";

// Protect with a simple secret to prevent unauthorized triggers
const PIPELINE_SECRET = process.env.PIPELINE_SECRET;

function formatTopicReply(topic: TopicProposal, index: number): string {
  return [
    `*${index + 1}. ${topic.title}*`,
    topic.brief,
    "",
    `*Keyword:* ${topic.keyword} | *Persona:* ${topic.persona}`,
    `*Pillar:* ${topic.pillar} | *Timeliness:* ${topic.timeliness}`,
    "",
    `📊 _Title: ${topic.title} | Keyword: ${topic.keyword} | Persona: ${topic.persona} | Pillar: ${topic.pillar} | Brief: ${topic.brief}_`,
  ].join("\n");
}

export async function POST(request: Request) {
  try {
    // Auth check
    const authHeader = request.headers.get("authorization");
    if (PIPELINE_SECRET && authHeader !== `Bearer ${PIPELINE_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generate topics using Claude + web search
    const rawTopics = await generateTopics();

    let topics: TopicProposal[];
    try {
      topics = JSON.parse(rawTopics);
    } catch {
      // Try to extract JSON array
      const match = rawTopics.match(/\[[\s\S]*\]/);
      if (match) {
        topics = JSON.parse(match[0]);
      } else {
        throw new Error("Failed to parse topics response");
      }
    }

    // Post header message to Slack
    const headerResponse = await postMessage(
      "📝 Blog Topic Proposals — This Week",
      [
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
            text: "React with ✅ on a topic to approve it (first ✅ = Tuesday, second ✅ = Thursday)",
          },
        },
      ]
    );

    // Post each topic as a threaded reply
    for (let i = 0; i < topics.length; i++) {
      await postThreadReply(
        headerResponse.ts,
        formatTopicReply(topics[i], i)
      );
    }

    return NextResponse.json({
      success: true,
      topicCount: topics.length,
      slackTs: headerResponse.ts,
      topics,
    });
  } catch (error) {
    console.error("Topic generation error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate topics",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
