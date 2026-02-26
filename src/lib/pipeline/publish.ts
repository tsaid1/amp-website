import fs from "fs";
import path from "path";

const BLOG_DIR = path.join(process.cwd(), "content/blog");
const GITHUB_PAT = process.env.GITHUB_PAT;
const GITHUB_REPO = "tsaid1/amp-website";

export interface PublishInput {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  keywords: string[];
  content: string;
  featured?: boolean;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export function buildMdxContent(input: PublishInput): string {
  const frontmatter = `---
title: "${input.title.replace(/"/g, '\\"')}"
description: "${input.description.replace(/"/g, '\\"')}"
date: "${input.date}"
author: "${input.author}"
category: "${input.category}"
keywords:
${input.keywords.map((k) => `  - ${k}`).join("\n")}
featured: ${input.featured || false}
---`;

  return `${frontmatter}\n\n${input.content}`;
}

export function createMdxFile(input: PublishInput): string {
  const slug = input.slug || generateSlug(input.title);
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);

  if (!fs.existsSync(BLOG_DIR)) {
    fs.mkdirSync(BLOG_DIR, { recursive: true });
  }

  fs.writeFileSync(filePath, buildMdxContent(input), "utf-8");
  return slug;
}

export async function publishToGitHub(input: PublishInput): Promise<void> {
  if (!GITHUB_PAT) {
    throw new Error("GITHUB_PAT environment variable is not set");
  }

  const slug = input.slug || generateSlug(input.title);
  const filePath = `content/blog/${slug}.mdx`;
  const fileContent = buildMdxContent(input);
  const contentBase64 = Buffer.from(fileContent).toString("base64");

  // Check if file already exists (need its SHA to update)
  let existingSha: string | undefined;
  const getRes = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`,
    { headers: { Authorization: `Bearer ${GITHUB_PAT}` } }
  );
  if (getRes.ok) {
    const existing = await getRes.json();
    existingSha = existing.sha;
  }

  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${GITHUB_PAT}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `blog: publish ${input.title} [automated]`,
        content: contentBase64,
        ...(existingSha ? { sha: existingSha } : {}),
      }),
    }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`GitHub API error (${res.status}): ${error}`);
  }
}

export { generateSlug };
