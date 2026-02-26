import fs from "fs";
import path from "path";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

interface PublishInput {
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

export function createMdxFile(input: PublishInput): string {
  const slug = input.slug || generateSlug(input.title);
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);

  // Ensure directory exists
  if (!fs.existsSync(BLOG_DIR)) {
    fs.mkdirSync(BLOG_DIR, { recursive: true });
  }

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

  const fileContent = `${frontmatter}\n\n${input.content}`;
  fs.writeFileSync(filePath, fileContent, "utf-8");

  return slug;
}

export { generateSlug };
