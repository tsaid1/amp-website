"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { Badge, Button, FadeIn, FadeInStagger, FadeInStaggerItem } from "@/components/ui";
import {
  PlugIcon,
  ChartIcon,
  BuildingIcon,
  CircuitIcon,
  SavingsIcon,
  RatingIcon,
  AlertIcon,
  ReportIcon,
  ApiIcon,
} from "@/components/icons";

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse tracking for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      setMousePosition({ x: x * 20, y: y * 20 });
    };

    const hero = heroRef.current;
    if (hero) {
      hero.addEventListener("mousemove", handleMouseMove);
      return () => hero.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  return (
    <>
      {/* Section 1: DARK HERO */}
      <section
        ref={heroRef}
        className="section-dark-hero relative min-h-screen flex items-center overflow-hidden"
        aria-labelledby="hero-heading"
      >
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-30 bg-grid-dark" />

        {/* Gradient orbs for ambient lighting */}
        <div
          className="pointer-events-none absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-[120px]"
          style={{ background: "var(--glow-teal)" }}
        />
        <div
          className="pointer-events-none absolute bottom-1/4 -right-32 w-96 h-96 rounded-full blur-[120px]"
          style={{ background: "var(--glow-blue)" }}
        />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text content */}
            <FadeIn direction="up" delay={0}>
              <div className="max-w-2xl">
                {/* Badge */}
                <Badge variant="dark">No BMS required</Badge>

                {/* Headline */}
                <h1
                  id="hero-heading"
                  className="mt-8 font-display hero-headline text-dark-heading"
                >
                  See where your energy{" "}
                  <span className="gradient-text">actually</span>{" "}
                  goes
                </h1>

                <p className="mt-8 text-xl leading-relaxed lg:max-w-lg text-dark-muted">
                  Equipment-level visibility for any building. Data online in hours.
                </p>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                  <Button asChild size="lg" className="btn-lift">
                    <a
                      href="https://calendly.com/tariq-amp/intro-call"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Book a Demo
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="secondary"
                    size="lg"
                    className="btn-lift"
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid var(--section-dark-border)",
                      color: "var(--section-dark-heading)"
                    }}
                  >
                    <Link href="/product">See How It Works</Link>
                  </Button>
                </div>
              </div>
            </FadeIn>

            {/* Right: Floating 3D Dashboard Stack - Desktop with parallax */}
            <FadeIn direction="left" delay={0.3} className="relative hidden lg:block">
              <div
                className="relative"
                style={{
                  transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
                  transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                  perspective: "1000px",
                }}
              >
                {/* Glow behind */}
                <div
                  className="absolute -inset-8 rounded-3xl blur-[60px]"
                  style={{
                    background: "radial-gradient(ellipse at center, var(--glow-teal-strong) 0%, var(--glow-blue) 50%, transparent 70%)"
                  }}
                />

                {/* Stacked Dashboard Screenshots */}
                <div className="relative" style={{ transformStyle: "preserve-3d" }}>
                  {/* Back layer - Zones dashboard */}
                  <div
                    className="absolute"
                    style={{
                      transform: "translateZ(-80px) translateX(60px) translateY(-30px) rotateY(-8deg) rotateX(4deg)",
                      transformOrigin: "center center",
                    }}
                  >
                    <Image
                      src="/images/dashboard/dashboard-zones.png"
                      alt="Zones dashboard view"
                      width={520}
                      height={360}
                      className="rounded-xl shadow-2xl"
                      style={{
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                      }}
                    />
                  </div>

                  {/* Middle layer - Equipment dashboard */}
                  <div
                    className="absolute"
                    style={{
                      transform: "translateZ(-40px) translateX(30px) translateY(-15px) rotateY(-4deg) rotateX(2deg)",
                      transformOrigin: "center center",
                    }}
                  >
                    <Image
                      src="/images/dashboard/dashboard-equipment.png"
                      alt="Equipment monitoring dashboard"
                      width={540}
                      height={375}
                      className="rounded-xl shadow-2xl"
                      style={{
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
                      }}
                    />
                  </div>

                  {/* Front layer - Main dashboard (primary focus) */}
                  <div
                    className="relative"
                    style={{
                      transform: "translateZ(0) rotateY(-2deg) rotateX(1deg)",
                      transformOrigin: "center center",
                    }}
                  >
                    <Image
                      src="/images/dashboard/dashboard-main.png"
                      alt="Amp Dashboard showing real-time energy monitoring"
                      width={580}
                      height={400}
                      className="rounded-xl shadow-2xl"
                      style={{
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)",
                      }}
                      priority
                      sizes="(max-width: 1024px) 100vw, 580px"
                      quality={90}
                    />
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Mobile/Tablet Dashboard - Single image, simplified */}
            <FadeIn direction="up" delay={0.3} className="relative mt-8 lg:hidden">
              <div className="relative mx-auto max-w-md">
                <div
                  className="absolute -inset-4 rounded-2xl blur-[40px] opacity-50"
                  style={{
                    background: "radial-gradient(ellipse at center, var(--glow-teal-strong) 0%, transparent 70%)"
                  }}
                />
                <div className="relative">
                  <Image
                    src="/images/dashboard/dashboard-main.png"
                    alt="Amp Dashboard showing real-time energy monitoring"
                    width={400}
                    height={280}
                    className="w-full h-auto rounded-xl shadow-lg"
                    sizes="(max-width: 640px) 90vw, 400px"
                    quality={85}
                  />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Bottom gradient fade to next section */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32"
          style={{ background: "linear-gradient(to top, var(--background), transparent)" }}
        />
      </section>

      {/* Section 2: Trusted By - Infinite Carousel */}
      <section
        className="relative bg-[var(--background)] py-12 border-b border-[var(--border)]"
        aria-labelledby="trusted-heading"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn direction="none" threshold={0.5}>
            <p
              id="trusted-heading"
              className="text-center text-sm font-medium uppercase tracking-wider text-[var(--muted)] mb-8"
            >
              Trusted by industry leaders
            </p>
          </FadeIn>
        </div>

        {/* Logo Carousel */}
        <LogoCarousel />
      </section>

      {/* Section 3: Value Props */}
      <section
        className="bg-[var(--background)] py-[var(--space-section-lg)]"
        aria-labelledby="value-heading"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto">
              <h2
                id="value-heading"
                className="font-display text-[var(--text-4xl)] font-bold tracking-tight text-[var(--foreground-heading)]"
              >
                Stop guessing.{" "}
                <span className="gradient-text">Start knowing.</span>
              </h2>
              <p className="mt-4 text-lg text-[var(--muted)]">
                Most buildings rely on monthly utility bills for insight. Amp shows you which equipment uses the most energy—and what&apos;s being wasted.
              </p>
            </div>
          </FadeIn>

          {/* Feature cards with gradient borders */}
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {[
              { icon: <PlugIcon className="h-6 w-6" />, title: "Plug & Play Hardware", desc: "Our devices mount on existing electrical panels in hours—no building shutdown, no IT approval, no building management system required." },
              { icon: <ChartIcon className="h-6 w-6" />, title: "See Every Piece of Equipment", desc: "Know exactly how much energy each chiller, pump, and light uses. No more guessing which assets are driving your bill." },
              { icon: <BuildingIcon className="h-6 w-6" />, title: "Works With Any Building", desc: "Old building? No existing systems? No problem. We bring our own network and work with any infrastructure." },
            ].map((feature, i) => (
              <FadeIn key={feature.title} delay={i * 0.1}>
                <div className="gradient-border p-8 h-full">
                  <div className="icon-glow inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                    {feature.icon}
                  </div>
                  <h3 className="mt-6 font-display text-xl font-semibold text-[var(--foreground)]">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-[var(--muted)]">
                    {feature.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: How It Works - DARK */}
      <section
        className="section-dark py-[var(--space-section-lg)] relative overflow-hidden"
        aria-labelledby="how-heading"
      >
        {/* Dot pattern */}
        <div className="absolute inset-0 opacity-20 bg-dots-dark" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2
              id="how-heading"
              className="text-center font-display text-[var(--text-4xl)] font-bold tracking-tight text-dark-heading"
            >
              How It Works
            </h2>
          </FadeIn>

          <FadeInStagger staggerDelay={0.2}>
            <div className="mt-16 grid gap-12 sm:grid-cols-3">
              {[
                { number: "01", title: "Install", desc: "Our hardware mounts on existing panels in hours. No shutdown required." },
                { number: "02", title: "Connect", desc: "Devices sync to our cloud automatically. No IT approvals needed." },
                { number: "03", title: "Optimize", desc: "See real-time data and AI recommendations to cut waste." },
              ].map((step, i) => (
                <FadeInStaggerItem key={step.number} index={i}>
                  <div className="text-center">
                    <span className="font-display font-bold leading-none stat-glow text-[clamp(4rem,10vw,6rem)] text-[var(--color-primary)]">
                      {step.number}
                    </span>
                    <h3 className="mt-4 font-display text-2xl font-semibold text-dark-heading">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-dark-muted">
                      {step.desc}
                    </p>
                  </div>
                </FadeInStaggerItem>
              ))}
            </div>
          </FadeInStagger>
        </div>
      </section>

      {/* Section 5: Features Grid */}
      <section
        className="bg-[var(--background-subtle)] py-[var(--space-section-lg)]"
        aria-labelledby="features-heading"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center">
              <h2
                id="features-heading"
                className="font-display text-[var(--text-4xl)] font-bold tracking-tight text-[var(--foreground-heading)]"
              >
                Everything you need
              </h2>
            </div>
          </FadeIn>

          <FadeInStagger staggerDelay={0.1}>
            <div className="mt-16 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: <CircuitIcon />, title: "Circuit-Level Monitoring", desc: "Measure every circuit in your building, down to individual breakers." },
                { icon: <SavingsIcon />, title: "Find Savings Opportunities", desc: "Our AI spots waste and shows you exactly how much you'll save by fixing it." },
                { icon: <RatingIcon />, title: "Building Energy Rating", desc: "Get an A-F efficiency grade to see how your building compares to others." },
                { icon: <AlertIcon />, title: "Real-Time Alerts", desc: "Get notified instantly when equipment behaves unusually—by email, SMS, or in-app." },
                { icon: <ReportIcon />, title: "Automated Reports", desc: "Monthly reports delivered automatically, with clear breakdowns by equipment." },
                { icon: <ApiIcon />, title: "Full API Access", desc: "Connect your energy data to any system—business intelligence, facilities management, or ESG reporting." },
              ].map((feature, i) => (
                <FadeInStaggerItem key={feature.title} index={i}>
                  <div className="flex gap-4">
                    <div className="icon-glow flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                      {feature.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-lg font-semibold text-[var(--foreground)]">{feature.title}</h3>
                      <p className="mt-1 text-[var(--muted)]">{feature.desc}</p>
                    </div>
                  </div>
                </FadeInStaggerItem>
              ))}
            </div>
          </FadeInStagger>
        </div>
      </section>

      {/* Section 6: Stats - DARK */}
      <section
        className="section-dark py-[var(--space-section-lg)] relative overflow-hidden"
        aria-labelledby="stats-heading"
      >
        {/* Gradient orbs */}
        <div
          className="pointer-events-none absolute top-0 left-1/4 w-64 h-64 rounded-full blur-[100px]"
          style={{ background: "var(--glow-teal-strong)" }}
        />
        <div
          className="pointer-events-none absolute bottom-0 right-1/4 w-64 h-64 rounded-full blur-[100px]"
          style={{ background: "var(--glow-blue)" }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p
              className="text-sm font-medium uppercase tracking-wider"
              style={{ color: "var(--color-primary)" }}
            >
              Proven Results
            </p>
            <h2
              id="stats-heading"
              className="mt-4 font-display text-[var(--text-3xl)] font-bold text-dark-heading"
            >
              What our customers achieve
            </h2>
          </FadeIn>

          <dl className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { value: "10-20%", label: "energy savings identified" },
              { value: "<1 Year", label: "typical payback period" },
              { value: "24h", label: "to live data" },
              { value: "0.2%", label: "margin of error" },
            ].map((stat, i) => (
              <FadeIn key={stat.label} delay={i * 0.1}>
                <div className="text-center lg:text-left">
                  <dt className="font-display font-bold stat-glow text-dark-heading text-[clamp(2.5rem,5vw,4rem)] leading-none tracking-tight">
                    {stat.value}
                  </dt>
                  <dd className="mt-2 text-dark-muted">
                    {stat.label}
                  </dd>
                </div>
              </FadeIn>
            ))}
          </dl>
        </div>
      </section>

      {/* Section 7: Final CTA */}
      <section
        className="bg-[var(--background)] py-[var(--space-section-lg)]"
        aria-labelledby="cta-heading"
      >
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <FadeIn>
            <h2
              id="cta-heading"
              className="font-display text-[var(--text-4xl)] font-bold tracking-tight text-[var(--foreground-heading)] lg:text-[var(--text-5xl)]"
            >
              Ready to see your{" "}
              <span className="gradient-text">building&apos;s data?</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-[var(--muted)]">
              Book a demo and get equipment-level visibility in 24 hours.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="btn-lift">
                <a
                  href="https://calendly.com/tariq-amp/intro-call"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book a Demo
                </a>
              </Button>
              <Button asChild variant="secondary" size="lg" className="btn-lift">
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}

// Logo data - paths must match exact filenames in public/images/logos/
const logos = [
  { src: "/images/logos/logo-chalhoub.webp", alt: "Chalhoub Group", width: 200 },
  { src: "/images/logos/logo-amazon.webp", alt: "Amazon", width: 160 },
  { src: "/images/logos/logo-ikea.webp", alt: "IKEA", width: 140 },
  { src: "/images/logos/logo-burohappold.webp", alt: "Buro Happold", width: 180 },
  { src: "/images/logos/masdar.png", alt: "Masdar", width: 180 },
  { src: "/images/logos/fam.png", alt: "FAM House of Recycling", width: 160 },
  { src: "/images/logos/musanadah.png", alt: "Musanadah", width: 180 },
];

function LogoCarousel() {
  return (
    <div className="logo-carousel">
      <div className="logo-carousel-track">
        {/* First set of logos */}
        {logos.map((logo) => (
          <div
            key={logo.alt}
            className="flex-shrink-0 grayscale opacity-60 transition-all duration-300 hover:grayscale-0 hover:opacity-100"
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width}
              height={48}
              className="h-10 w-auto object-contain sm:h-12"
            />
          </div>
        ))}
        {/* Duplicate set for seamless infinite loop */}
        {logos.map((logo, i) => (
          <div
            key={`${logo.alt}-dup-${i}`}
            className="flex-shrink-0 grayscale opacity-60 transition-all duration-300 hover:grayscale-0 hover:opacity-100"
            aria-hidden="true"
          >
            <Image
              src={logo.src}
              alt=""
              width={logo.width}
              height={48}
              className="h-10 w-auto object-contain sm:h-12"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

