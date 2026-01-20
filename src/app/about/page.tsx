"use client";

import Link from "next/link";
import { Button, FadeIn, FadeInStagger, FadeInStaggerItem } from "@/components/ui";

const values = [
  {
    title: "Radical Simplicity",
    desc: "Complex problems deserve elegant solutions. We obsess over making energy data easy to understand, not complicated.",
  },
  {
    title: "Speed Matters",
    desc: "24 hours from install to live data. We move fast because climate change won't wait.",
  },
  {
    title: "Data Enables Action",
    desc: "You can't fix what you can't see. We show you exactly where energy is being wasted so you can do something about it.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Section 1: Hero - Asymmetric, dramatic */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-[var(--background)]">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--color-primary-light)]/20 via-transparent to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <FadeIn direction="up">
            <div className="max-w-3xl">
              <span className="inline-block rounded-full bg-[var(--color-primary)]/10 px-4 py-1.5 text-sm font-medium text-[var(--color-primary-dark)]">
                Our Story
              </span>
              <h1 className="mt-6 font-display text-[clamp(2.5rem,5vw+1rem,4.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-[var(--foreground-heading)]">
                Making building energy{" "}
                <span className="text-[var(--color-primary)]">visible</span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-[var(--muted)] sm:text-xl lg:max-w-2xl">
                Buildings account for 40% of global emissions, yet most operators have no idea where their energy goes. We&apos;re changing that—one building at a time.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Section 2: Mission - Left aligned with dramatic stat */}
      <section className="bg-[var(--background-subtle)] py-[var(--space-section-lg)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Stat */}
            <FadeIn direction="right" className="lg:col-span-4">
              <div>
                <span className="stat-giant text-[var(--color-primary)]">40%</span>
                <p className="mt-4 text-lg text-[var(--muted)]">
                  of global greenhouse gas emissions come from buildings—yet most operators can&apos;t see where their energy is being used.
                </p>
              </div>
            </FadeIn>

            {/* Mission text */}
            <FadeIn direction="left" delay={0.2} className="lg:col-span-8">
              <div>
                <p className="text-sm font-medium uppercase tracking-wider text-[var(--color-primary)]">
                  Our Mission
                </p>
                <h2 className="mt-4 font-display text-[var(--text-3xl)] font-bold tracking-tight text-[var(--foreground-heading)]">
                  Making energy visible at scale
                </h2>
                <p className="mt-6 text-lg leading-relaxed text-[var(--muted)]">
                  We give building operators the same level of energy insight that was previously only available to the largest enterprises. When you can see exactly what each piece of equipment uses, you can finally take action.
                </p>
                <p className="mt-4 text-lg leading-relaxed text-[var(--muted)]">
                  No more guessing. No more waiting for monthly bills. Real data, in real time, from every chiller, pump, and light in your building.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Section 3: Values - Simple rows, not cards */}
      <section className="bg-[var(--background)] py-[var(--space-section-lg)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="max-w-3xl">
              <h2 className="font-display text-[var(--text-4xl)] font-bold tracking-tight text-[var(--foreground-heading)]">
                What drives us
              </h2>
            </div>
          </FadeIn>

          <FadeInStagger staggerDelay={0.15}>
            <div className="mt-16 grid gap-12 lg:grid-cols-3 lg:gap-16">
              {values.map((value, index) => (
                <FadeInStaggerItem key={value.title} index={index}>
                  <div className="relative">
                    {/* Big number background */}
                    <span className="font-display text-[5rem] font-bold leading-none text-[var(--color-primary)]/10 lg:text-[6rem]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="-mt-12 lg:-mt-16">
                      <h3 className="font-display text-xl font-semibold text-[var(--foreground)]">
                        {value.title}
                      </h3>
                      <p className="mt-2 text-[var(--muted)]">{value.desc}</p>
                    </div>
                  </div>
                </FadeInStaggerItem>
              ))}
            </div>
          </FadeInStagger>
        </div>
      </section>

      {/* Section 4: Team - Simple, confident */}
      <section className="bg-[var(--background-subtle)] py-[var(--space-section-lg)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <FadeIn direction="right" className="lg:col-span-5">
              <div>
                <p className="text-sm font-medium uppercase tracking-wider text-[var(--color-primary)]">
                  The Team
                </p>
                <h2 className="mt-4 font-display text-[var(--text-3xl)] font-bold tracking-tight text-[var(--foreground-heading)]">
                  Engineers, designers, and problem-solvers
                </h2>
              </div>
            </FadeIn>

            <FadeIn direction="left" delay={0.2} className="lg:col-span-7">
              <p className="text-lg leading-relaxed text-[var(--muted)]">
                Our team combines hardware engineering, energy systems expertise, and software development to build solutions that just work. We&apos;re obsessed with making energy visible—because you can&apos;t fix what you can&apos;t see.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-[var(--muted)]">
                Based in Dubai, we work with forward-thinking companies across the region to transform how buildings understand and manage their energy use.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Section 5: CTA - Dark, consistent with other pages */}
      <section className="relative overflow-hidden bg-[var(--color-primary-dark)] py-[var(--space-section-lg)]">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/20 to-transparent" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <FadeIn>
            <h2
              className="font-display text-[var(--text-4xl)] font-bold tracking-tight lg:text-[var(--text-5xl)]"
              style={{ color: "white" }}
            >
              Ready to work with us?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--color-primary-light)]">
              Get in touch to see how Amp can transform your building&apos;s energy visibility.
            </p>
            <div className="mt-10">
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="btn-lift border-0"
                style={{ backgroundColor: "white", color: "var(--color-primary-dark)" }}
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
