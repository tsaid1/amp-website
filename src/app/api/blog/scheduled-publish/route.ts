import { NextRequest, NextResponse } from "next/server";
import matter from "gray-matter";
import {
  listApprovedPosts,
  publishApprovedPost,
} from "@/lib/pipeline/publish";
import { postMessage } from "@/lib/pipeline/slack";

const PIPELINE_SECRET = process.env.PIPELINE_SECRET;

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (PIPELINE_SECRET && authHeader !== `Bearer ${PIPELINE_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const slugs = await listApprovedPosts();

    if (slugs.length === 0) {
      return NextResponse.json({ published: [] });
    }

    const published: { slug: string; title: string }[] = [];

    for (const slug of slugs) {
      try {
        const mdxContent = await publishApprovedPost(slug);

        // Extract title from frontmatter
        let title = slug;
        try {
          const { data } = matter(mdxContent);
          if (data.title) title = data.title;
        } catch {
          // Keep slug as fallback title
        }

        published.push({ slug, title });

        await postMessage(
          `🚀 Published: *${title}* — Live at: https://www.ampenergy.ae/blog/${slug}`
        ).catch((err) => {
          console.error(`Failed to post Slack message for ${slug}:`, err);
        });
      } catch (err) {
        console.error(`Failed to publish ${slug}:`, err);
      }
    }

    return NextResponse.json({ published });
  } catch (err) {
    console.error("Scheduled publish error:", err);
    return NextResponse.json(
      { error: "Failed to run scheduled publish", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
