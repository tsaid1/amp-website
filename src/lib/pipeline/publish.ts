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

// --- GitHub Contents API helpers ---

async function putGitHubFile(
  filePath: string,
  content: string,
  commitMessage: string
): Promise<void> {
  if (!GITHUB_PAT) {
    throw new Error("GITHUB_PAT environment variable is not set");
  }

  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`;
  const contentBase64 = Buffer.from(content).toString("base64");

  // Check if file already exists (need its SHA to update)
  let existingSha: string | undefined;
  const getRes = await fetch(url, {
    headers: { Authorization: `Bearer ${GITHUB_PAT}` },
  });
  if (getRes.ok) {
    const existing = await getRes.json();
    existingSha = existing.sha;
  }

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${GITHUB_PAT}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: commitMessage,
      content: contentBase64,
      ...(existingSha ? { sha: existingSha } : {}),
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`GitHub API error (${res.status}): ${error}`);
  }
}

async function getGitHubFile(filePath: string): Promise<string> {
  if (!GITHUB_PAT) {
    throw new Error("GITHUB_PAT environment variable is not set");
  }

  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${GITHUB_PAT}` },
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`GitHub API error (${res.status}): ${error}`);
  }

  const data = await res.json();
  return Buffer.from(data.content, "base64").toString("utf-8");
}

async function deleteGitHubFile(
  filePath: string,
  commitMessage: string
): Promise<void> {
  if (!GITHUB_PAT) {
    throw new Error("GITHUB_PAT environment variable is not set");
  }

  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`;

  // Get current SHA
  const getRes = await fetch(url, {
    headers: { Authorization: `Bearer ${GITHUB_PAT}` },
  });
  if (!getRes.ok) return; // File doesn't exist, nothing to delete

  const existing = await getRes.json();

  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${GITHUB_PAT}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: commitMessage,
      sha: existing.sha,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`GitHub API delete error (${res.status}): ${error}`);
  }
}

// --- Public API ---

export async function publishToGitHub(input: PublishInput): Promise<void> {
  const slug = input.slug || generateSlug(input.title);
  await putGitHubFile(
    `content/blog/${slug}.mdx`,
    buildMdxContent(input),
    `blog: publish ${input.title} [automated]`
  );
}

export async function saveDraftToGitHub(input: PublishInput): Promise<void> {
  const slug = input.slug || generateSlug(input.title);
  await putGitHubFile(
    `drafts/${slug}.mdx`,
    buildMdxContent(input),
    `blog: save draft ${input.title} [automated]`
  );
}

export async function publishDraftFromGitHub(slug: string, title: string): Promise<void> {
  const draftPath = `drafts/${slug}.mdx`;
  const publishPath = `content/blog/${slug}.mdx`;

  const content = await getGitHubFile(draftPath);
  await putGitHubFile(publishPath, content, `blog: publish ${title} [automated]`);
  await deleteGitHubFile(draftPath, `blog: remove draft ${slug} [automated]`);
}

export async function moveDraftToApproved(slug: string): Promise<void> {
  const draftPath = `drafts/${slug}.mdx`;
  const approvedPath = `approved/${slug}.mdx`;

  const content = await getGitHubFile(draftPath);
  await putGitHubFile(approvedPath, content, `blog: approve ${slug} [automated]`);
  await deleteGitHubFile(draftPath, `blog: remove draft ${slug} after approval [automated]`);
}

export async function listApprovedPosts(): Promise<string[]> {
  if (!GITHUB_PAT) {
    throw new Error("GITHUB_PAT environment variable is not set");
  }

  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/approved`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${GITHUB_PAT}` },
  });

  if (res.status === 404) return [];
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`GitHub API error (${res.status}): ${error}`);
  }

  const files: { name: string }[] = await res.json();
  return files
    .filter((f) => f.name.endsWith(".mdx"))
    .map((f) => f.name.replace(/\.mdx$/, ""));
}

export async function publishApprovedPost(slug: string): Promise<string> {
  const approvedPath = `approved/${slug}.mdx`;
  const publishPath = `content/blog/${slug}.mdx`;

  const content = await getGitHubFile(approvedPath);
  await putGitHubFile(publishPath, content, `blog: publish ${slug} [scheduled]`);
  await deleteGitHubFile(approvedPath, `blog: remove approved ${slug} after publish [automated]`);

  return content;
}

export { generateSlug };
