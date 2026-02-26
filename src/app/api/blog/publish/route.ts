import { NextResponse } from "next/server";
import { createMdxFile } from "@/lib/pipeline/publish";
import { postMessage } from "@/lib/pipeline/slack";

const PIPELINE_SECRET = process.env.PIPELINE_SECRET;

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (PIPELINE_SECRET && authHeader !== `Bearer ${PIPELINE_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, category, keywords, content, slug } = body;

    if (!title || !description || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the MDX file in content/blog/
    const finalSlug = createMdxFile({
      slug,
      title,
      description,
      date: new Date().toISOString().split("T")[0],
      author: "Amp Team",
      category: category || "efficiency",
      keywords: keywords || [],
      content,
    });

    const liveUrl = `https://www.ampenergy.ae/blog/${finalSlug}`;

    // Post confirmation to Slack
    await postMessage(`✅ Blog post published!`, [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*✅ Published:* <${liveUrl}|${title}>\n\nThe post is now live. Vercel will deploy automatically once the changes are committed.`,
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      slug: finalSlug,
      url: liveUrl,
    });
  } catch (error) {
    console.error("Publish error:", error);
    return NextResponse.json(
      {
        error: "Failed to publish",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
