"use client";

import { useMemo } from "react";

// Lightweight markdown-to-HTML renderer
// Handles: headings, paragraphs, bold, italic, links, lists, blockquotes, code, hr
function markdownToHtml(md: string): string {
  let html = md;

  // Code blocks (fenced)
  html = html.replace(
    /```(\w*)\n([\s\S]*?)```/g,
    '<pre class="blog-code-block"><code class="language-$1">$2</code></pre>'
  );

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="blog-inline-code">$1</code>');

  // Headings
  html = html.replace(/^#### (.+)$/gm, '<h4 class="blog-h4">$1</h4>');
  html = html.replace(/^### (.+)$/gm, '<h3 class="blog-h3">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="blog-h2">$1</h2>');

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr class="blog-hr" />');

  // Blockquotes
  html = html.replace(
    /^> (.+)$/gm,
    '<blockquote class="blog-blockquote">$1</blockquote>'
  );

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="blog-link">$1</a>'
  );

  // Unordered lists
  html = html.replace(
    /(?:^|\n)((?:- .+\n?)+)/g,
    (match, listBlock: string) => {
      const items = listBlock
        .trim()
        .split("\n")
        .map((line: string) => `<li>${line.replace(/^- /, "")}</li>`)
        .join("\n");
      return `\n<ul class="blog-ul">${items}</ul>\n`;
    }
  );

  // Ordered lists
  html = html.replace(
    /(?:^|\n)((?:\d+\. .+\n?)+)/g,
    (match, listBlock: string) => {
      const items = listBlock
        .trim()
        .split("\n")
        .map((line: string) => `<li>${line.replace(/^\d+\. /, "")}</li>`)
        .join("\n");
      return `\n<ol class="blog-ol">${items}</ol>\n`;
    }
  );

  // Paragraphs (lines not already wrapped in HTML tags)
  const lines = html.split("\n");
  const processed = lines.map((line) => {
    const trimmed = line.trim();
    if (!trimmed) return "";
    if (
      trimmed.startsWith("<h") ||
      trimmed.startsWith("<ul") ||
      trimmed.startsWith("<ol") ||
      trimmed.startsWith("<li") ||
      trimmed.startsWith("</") ||
      trimmed.startsWith("<pre") ||
      trimmed.startsWith("<blockquote") ||
      trimmed.startsWith("<hr")
    ) {
      return line;
    }
    return `<p class="blog-p">${trimmed}</p>`;
  });

  return processed.join("\n");
}

export function MarkdownRenderer({ content }: { content: string }) {
  const html = useMemo(() => markdownToHtml(content), [content]);

  return (
    <div
      className="blog-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
