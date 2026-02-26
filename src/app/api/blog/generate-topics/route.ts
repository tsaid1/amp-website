import { NextResponse } from "next/server";
import { generateTopics } from "@/lib/pipeline/generate";
import {
  postMessage,
  formatTopicProposal,
  type TopicProposal,
} from "@/lib/pipeline/slack";

// Protect with a simple secret to prevent unauthorized triggers
const PIPELINE_SECRET = process.env.PIPELINE_SECRET;

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

    // Post to Slack
    const blocks = formatTopicProposal(topics);
    const slackResponse = await postMessage(
      `📝 ${topics.length} blog topic proposals ready for review`,
      blocks
    );

    return NextResponse.json({
      success: true,
      topicCount: topics.length,
      slackTs: slackResponse.ts,
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
