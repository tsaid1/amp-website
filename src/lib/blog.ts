import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  category: "compliance" | "efficiency" | "technology" | "thought-leadership";
  keywords: string[];
  readingTime: string;
  content: string;
  image?: string;
  featured?: boolean;
}

export interface BlogPostMeta
  extends Omit<BlogPost, "content"> {}

const CATEGORY_LABELS: Record<BlogPost["category"], string> = {
  compliance: "Compliance & Regulation",
  efficiency: "Operational Efficiency",
  technology: "Technology & Innovation",
  "thought-leadership": "Industry Insights",
};

export function getCategoryLabel(category: BlogPost["category"]): string {
  return CATEGORY_LABELS[category] || category;
}

export function getAllPosts(): BlogPostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.mdx?$/, "");
    const filePath = path.join(BLOG_DIR, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);
    const stats = readingTime(content);

    return {
      slug,
      title: data.title || "",
      description: data.description || "",
      date: data.date || "",
      author: data.author || "Amp Team",
      category: data.category || "efficiency",
      keywords: data.keywords || [],
      readingTime: stats.text,
      image: data.image || undefined,
      featured: data.featured || false,
    } as BlogPostMeta;
  });

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | null {
  const mdxPath = path.join(BLOG_DIR, `${slug}.mdx`);
  const mdPath = path.join(BLOG_DIR, `${slug}.md`);

  const filePath = fs.existsSync(mdxPath)
    ? mdxPath
    : fs.existsSync(mdPath)
    ? mdPath
    : null;

  if (!filePath) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  const stats = readingTime(content);

  return {
    slug,
    title: data.title || "",
    description: data.description || "",
    date: data.date || "",
    author: data.author || "Amp Team",
    category: data.category || "efficiency",
    keywords: data.keywords || [],
    readingTime: stats.text,
    content,
    image: data.image || undefined,
    featured: data.featured || false,
  };
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => f.replace(/\.mdx?$/, ""));
}
