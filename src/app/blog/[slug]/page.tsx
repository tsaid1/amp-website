import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getAllSlugs, getCategoryLabel, getAllPosts } from "@/lib/blog";
import { MarkdownRenderer } from "@/components/blog/MarkdownRenderer";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://www.ampenergy.ae/blog/${slug}`,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: post.keywords,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

const CATEGORY_COLORS: Record<string, string> = {
  compliance: "bg-amber-50 text-amber-700 border-amber-200",
  efficiency: "bg-emerald-50 text-emerald-700 border-emerald-200",
  technology: "bg-sky-50 text-sky-700 border-sky-200",
  "thought-leadership": "bg-violet-50 text-violet-700 border-violet-200",
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const allPosts = getAllPosts();
  const relatedPosts = allPosts
    .filter((p) => p.slug !== slug)
    .filter((p) => p.category === post.category || p.keywords.some((k) => post.keywords.includes(k)))
    .slice(0, 2);

  const colorClass =
    CATEGORY_COLORS[post.category] ||
    "bg-teal-50 text-teal-700 border-teal-200";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      "@type": "Organization",
      name: "Amp Energy",
      url: "https://www.ampenergy.ae",
    },
    publisher: {
      "@type": "Organization",
      name: "Amp Energy",
      url: "https://www.ampenergy.ae",
      logo: {
        "@type": "ImageObject",
        url: "https://www.ampenergy.ae/images/amp-logo.svg",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.ampenergy.ae/blog/${slug}`,
    },
  };

  return (
    <div className="min-h-screen bg-[#F7F9F8]">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Article Header — compact dark hero */}
      <header className="relative overflow-hidden bg-[var(--section-dark-bg)] pb-10 pt-24 sm:pb-12 sm:pt-28">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--glow-teal)] blur-3xl" />

        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-[var(--section-dark-text-muted)]">
            <Link
              href="/blog"
              className="transition-colors hover:text-[var(--color-primary)]"
            >
              Blog
            </Link>
            <svg className="h-4 w-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="truncate">{post.title}</span>
          </nav>

          {/* Meta */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${colorClass}`}
            >
              {getCategoryLabel(post.category)}
            </span>
            <span className="text-sm text-[var(--section-dark-text-muted)]">
              {post.readingTime}
            </span>
            <span className="text-[var(--section-dark-text-muted)] opacity-40">·</span>
            <time
              dateTime={post.date}
              className="text-sm text-[var(--section-dark-text-muted)]"
            >
              {formatDate(post.date)}
            </time>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-[var(--section-dark-heading)] sm:text-4xl lg:text-[2.75rem]">
            {post.title}
          </h1>
        </div>
      </header>

      {/* Article Body — white background */}
      <div className="bg-white">
        {/* Author + Description bar */}
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4 border-b border-gray-100 py-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F0FAF7] text-[#1DB9A0]">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 0h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900">
                {post.author}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-gray-500">
                {post.description}
              </p>
            </div>
          </div>
        </div>

        {/* Article content */}
        <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <MarkdownRenderer content={post.content} />
        </article>

        {/* Keywords / Tags */}
        {post.keywords.length > 0 && (
          <div className="mx-auto max-w-3xl border-t border-gray-100 px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-2">
              {post.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full border border-gray-200 bg-[#F7F9F8] px-3 py-1 text-xs text-gray-500"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Related Posts — subtle gray background */}
      {relatedPosts.length > 0 && (
        <section className="bg-[#F7F9F8]">
          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <h2 className="mb-6 text-xl font-semibold text-gray-900">
              Related Articles
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {relatedPosts.map((rp) => {
                const rpColor =
                  CATEGORY_COLORS[rp.category] ||
                  "bg-teal-50 text-teal-700 border-teal-200";
                return (
                  <Link
                    key={rp.slug}
                    href={`/blog/${rp.slug}`}
                    className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${rpColor}`}>
                        {getCategoryLabel(rp.category)}
                      </span>
                      <span className="text-xs text-gray-400">{rp.readingTime}</span>
                    </div>
                    <h3 className="text-sm font-semibold leading-snug text-gray-900 transition-colors group-hover:text-[#1DB9A0]">
                      {rp.title}
                    </h3>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA — light background with teal accent */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="rounded-2xl border border-gray-200 bg-[#F7F9F8] p-8 text-center sm:p-12">
            <h2 className="mb-3 text-2xl font-bold text-gray-900">
              See your building&apos;s energy data
            </h2>
            <p className="mb-6 text-gray-500">
              Equipment-level visibility in 24 hours. No BMS required.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a
                href="https://calendly.com/tariq-amp/intro-call"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-lift inline-flex h-11 items-center justify-center rounded-full bg-[var(--color-btn-primary)] px-7 text-sm font-medium text-white transition-colors hover:bg-[var(--color-btn-primary-hover)]"
              >
                Book a Demo
              </a>
              <Link
                href="/contact"
                className="inline-flex h-11 items-center justify-center rounded-full border border-gray-300 px-7 text-sm font-medium text-gray-700 transition-colors hover:border-[#1DB9A0] hover:text-[#1DB9A0]"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
