import { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, getCategoryLabel, type BlogPostMeta } from "@/lib/blog";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Blog | Energy Intelligence Insights",
  description:
    "Expert insights on building energy monitoring, UAE climate compliance, HVAC optimization, and sustainability for commercial buildings in the GCC.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog | Amp Energy",
    description:
      "Expert insights on building energy monitoring, UAE climate compliance, and sustainability.",
    url: "https://www.ampenergy.ae/blog",
  },
};

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

function BlogCard({ post }: { post: BlogPostMeta }) {
  const colorClass =
    CATEGORY_COLORS[post.category] ||
    "bg-teal-50 text-teal-700 border-teal-200";

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="relative flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md">
        {/* Category + Reading Time */}
        <div className="mb-4 flex items-center gap-3">
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${colorClass}`}
          >
            {getCategoryLabel(post.category)}
          </span>
          <span className="text-xs text-gray-400">
            {post.readingTime}
          </span>
        </div>

        {/* Title */}
        <h2 className="mb-3 text-lg font-semibold leading-snug text-gray-900 transition-colors duration-200 group-hover:text-[#1DB9A0]">
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="mb-5 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-600">
          {post.description}
        </p>

        {/* Date + Read more */}
        <div className="flex items-center justify-between">
          <time
            dateTime={post.date}
            className="text-xs text-gray-400"
          >
            {formatDate(post.date)}
          </time>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-[#1DB9A0] opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2">
            Read
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </span>
        </div>
      </article>
    </Link>
  );
}

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-[#F7F9F8]">
      {/* Hero — dark branded header */}
      <section className="relative overflow-hidden bg-[var(--section-dark-bg)] pb-16 pt-24 sm:pb-20 sm:pt-32">
        {/* Background grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        {/* Radial glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--glow-teal)] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--border-accent)] bg-[var(--glow-teal)] px-4 py-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)] animate-pulse" />
              <span className="text-xs font-medium tracking-wide text-[var(--color-primary)]">
                ENERGY INTELLIGENCE INSIGHTS
              </span>
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-[var(--section-dark-heading)] sm:text-5xl">
              The Amp Blog
            </h1>
            <p className="text-lg leading-relaxed text-[var(--section-dark-text-muted)]">
              Expert insights on building energy monitoring, UAE climate
              compliance, and the future of energy intelligence for commercial
              buildings.
            </p>
          </div>
        </div>
      </section>

      {/* Posts Grid — light background */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-200 bg-white">
                <svg
                  className="h-8 w-8 text-[#1DB9A0]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                  />
                </svg>
              </div>
              <h2 className="mb-2 text-xl font-semibold text-gray-900">
                Coming Soon
              </h2>
              <p className="max-w-md text-gray-500">
                We&apos;re preparing expert insights on building energy intelligence,
                compliance, and sustainability. Check back soon.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner — dark for contrast */}
      <section className="border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl border border-[var(--border-accent)] bg-gradient-to-br from-[var(--section-dark-bg-accent)] to-[var(--section-dark-bg-subtle)] p-8 sm:p-12">
            <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[var(--glow-teal)] blur-3xl" />
            <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="mb-2 text-2xl font-bold text-[var(--section-dark-heading)]">
                  Ready to see your building&apos;s data?
                </h2>
                <p className="text-[var(--section-dark-text-muted)]">
                  Book a demo and get equipment-level visibility in 24 hours.
                </p>
              </div>
              <a
                href="https://calendly.com/tariq-amp/intro-call"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-lift inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-btn-primary)] px-7 text-sm font-medium text-white transition-colors hover:bg-[var(--color-btn-primary-hover)]"
              >
                Book a Demo
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
