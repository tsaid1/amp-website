"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import * as Tabs from "@radix-ui/react-tabs";
import { Badge, Button, FadeIn, FadeInStagger, FadeInStaggerItem } from "@/components/ui";
import { CheckIcon, CircuitIcon, SparklesIcon, BellIcon, StarIcon, CodeIcon } from "@/components/icons";
import { VizAmpHub } from "@/components/VizAmpHub";

// Hardware specs for tabs
const hubSpecs = {
  name: "Amp Hub",
  tagline: "Edge Gateway",
  image: "/images/hardware/amp-hub.png",
  description: "The brain of your energy monitoring system. Connects sensors to cloud, processes data locally, and runs on our own network—no IT integration required.",
  specs: [
    { label: "Connectivity", value: "4G/WiFi", desc: "Built-in" },
    { label: "Protocols", value: "Multi-protocol", desc: "RS485, Modbus, ZigBee, LoRaWAN" },
    { label: "Storage", value: "Local backup", desc: "No data loss" },
    { label: "Updates", value: "OTA", desc: "Automatic firmware" },
  ],
  features: [
    "Built-in 4G & WiFi connectivity",
    "Works independently of building IT",
    "Local data processing & storage",
    "Automatic firmware updates",
    "5+ year lifespan",
  ],
};

const meterSpecs = {
  name: "PowerlinkGO",
  tagline: "Energy Meters",
  image: "/images/hardware/powerlink-go.png",
  description: "Circuit-level monitoring with revenue-grade accuracy. Scales from small panels to large industrial installations.",
  specs: [
    { label: "Circuits", value: "Up to 54", desc: "Per installation" },
    { label: "Current", value: "Up to 3000A", desc: "Per circuit" },
    { label: "Accuracy", value: "±0.2%", desc: "Revenue-grade" },
    { label: "Resolution", value: "1 min", desc: "Real-time data" },
  ],
  features: [
    "Revenue-grade accuracy (±0.2%)",
    "Scales to any panel size",
    "Zero downtime installation",
    "Din-rail or wall mounting",
    "8,000 samples/second",
  ],
};

// Platform features for bento grid
const platformFeatures = [
  {
    id: "circuit-monitoring",
    title: "Circuit-Level Monitoring",
    description: "See exactly what each piece of equipment uses. Track chillers, pumps, lights, and more—down to individual breakers.",
    icon: CircuitIcon,
    large: true,
    visualization: VizCircuitMonitoring,
  },
  {
    id: "ai-savings",
    title: "AI-Powered Savings",
    description: "Our AI spots waste patterns and shows projected ROI for every recommendation.",
    icon: SparklesIcon,
    large: false,
    visualization: VizAiSavings,
  },
  {
    id: "real-time-alerts",
    title: "Real-Time Alerts",
    description: "Get notified instantly when equipment behaves unusually—email, SMS, or in-app.",
    icon: BellIcon,
    large: false,
    visualization: VizAlerts,
  },
  {
    id: "building-rating",
    title: "Building Energy Rating",
    description: "Get an A-F efficiency grade to benchmark against similar buildings.",
    icon: StarIcon,
    large: false,
    visualization: VizRating,
  },
  {
    id: "api-access",
    title: "Full API Access",
    description: "Connect to any system—BI tools, facilities management, or ESG reporting.",
    icon: CodeIcon,
    large: false,
    visualization: VizApi,
  },
];

// How It Works steps
const steps = [
  {
    number: "01",
    title: "Install",
    description: "Our hardware mounts on existing panels in hours. Your building stays fully operational—no shutdown required.",
  },
  {
    number: "02",
    title: "Connect",
    description: "Devices sync to our cloud automatically using built-in 4G. No IT approvals, no network configuration.",
  },
  {
    number: "03",
    title: "Optimize",
    description: "See real-time data within 24 hours. Our AI identifies savings opportunities with projected ROI.",
  },
];

// Pricing tiers
const pricingTiers = [
  {
    name: "PowerlinkGO",
    tagline: "Most Popular",
    description: "Everything you need to get started with equipment-level visibility.",
    price: "From $500",
    period: "Hardware + 1 Year SaaS",
    features: [
      "Up to 12 circuits monitored",
      "Real-time 1-minute data",
      "AI savings recommendations",
      "Email & SMS alerts",
      "Monthly automated reports",
      "Unlimited users",
      "Unlimited data retention",
      "Email support",
    ],
    cta: "Get Started",
    highlighted: true,
  },
  {
    name: "Enterprise",
    tagline: "For Portfolios",
    description: "Advanced features for organizations managing multiple buildings.",
    price: "Custom",
    period: "contact for pricing",
    features: [
      "Unlimited circuits",
      "Portfolio-wide analytics",
      "Custom integrations & API",
      "Push data to third-party platforms",
      "Additional sensors (IAQ, Occupancy, Water)",
      "Dedicated account manager",
      "Unlimited users",
      "Unlimited data retention",
      "24/7 priority support",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

function ProductPageContent() {
  const heroRef = useRef<HTMLElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get initial tab from URL or default to "hub"
  const urlTab = searchParams.get("tab") || "hub";
  // Use local state for immediate UI updates
  const [currentTab, setCurrentTab] = useState(urlTab);
  const activeHardware = currentTab === "meters" ? meterSpecs : hubSpecs;

  // Sync tab state when URL changes (e.g., browser back/forward)
  useEffect(() => {
    const newTab = searchParams.get("tab") || "hub";
    if (newTab !== currentTab) {
      setCurrentTab(newTab);
    }
  }, [searchParams, currentTab]);

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

  const handleTabChange = (value: string) => {
    // Update local state immediately for instant UI feedback
    setCurrentTab(value);
    // Update URL for bookmarking/sharing (won't cause re-render since state already updated)
    router.push(`/product?tab=${value}`, { scroll: false });
  };

  return (
    <>
      {/* ============================================
          SECTION 1: DARK HERO - Gradient Mesh
          ============================================ */}
      <section
        ref={heroRef}
        className="section-dark-hero relative min-h-[90vh] flex items-center overflow-hidden"
        aria-labelledby="product-hero-heading"
      >
        {/* Smooth gradient background - #0a1a1a at top to #f8faf9 at bottom */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg,
              #0a1a1a 0%,
              #0b1f1f 10%,
              #0c2424 20%,
              #0d2929 30%,
              #0d2d2d 40%,
              #1a4a4a 50%,
              #3d7a7a 60%,
              #6aabab 70%,
              #a8d4d4 80%,
              #d4ecec 90%,
              #f8faf9 100%
            )`
          }}
        >
          {/* Subtle grid texture - top half only */}
          <div
            className="absolute inset-0 opacity-15 bg-grid-dark"
            style={{ maskImage: "linear-gradient(to bottom, black 0%, black 40%, transparent 70%)" }}
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Text content */}
            <FadeIn direction="up" delay={0}>
              <div className="max-w-2xl">
                <Badge variant="dark">Full-Stack Solution</Badge>

                <h1
                  id="product-hero-heading"
                  className="mt-8 font-display text-[clamp(2.5rem,5vw+1rem,4.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-dark-heading"
                >
                  The Complete Energy{" "}
                  <span className="gradient-text">Intelligence</span>{" "}
                  Platform
                </h1>

                <p className="mt-8 text-xl leading-relaxed lg:max-w-lg text-dark-muted">
                  Hardware that installs in hours. Software that finds savings automatically.
                  See exactly what each piece of equipment uses—from chillers to lights.
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
                    <a href="#pricing">View Pricing</a>
                  </Button>
                </div>
              </div>
            </FadeIn>

            {/* Right: Device (foreground) + Dashboard (background) composition */}
            <FadeIn direction="left" delay={0.3} className="relative hidden lg:block">
              <div
                className="relative h-[400px] w-full"
                style={{
                  transform: `translate(${mousePosition.x * 0.2}px, ${mousePosition.y * 0.2}px)`,
                  transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)"
                }}
              >
                {/* Dashboard screenshot - BACKGROUND, behind and to the right */}
                <div
                  className="absolute top-0 right-[-60px] rounded-xl overflow-hidden"
                  style={{
                    transform: "perspective(1000px) rotateY(-5deg) rotateX(2deg)",
                    boxShadow: "0 30px 60px -15px rgba(0, 0, 0, 0.35)"
                  }}
                >
                  <Image
                    src="/images/dashboard/dashboard-main.png"
                    alt="Amp Dashboard showing real-time energy data"
                    width={480}
                    height={300}
                    className="w-[480px] h-auto"
                  />
                </div>

                {/* Hardware device - FOREGROUND, lower-left, overlapping dashboard */}
                <div className="absolute bottom-0 left-0 z-10">
                  {/* Teal glow behind device */}
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full blur-[80px] opacity-30"
                    style={{ background: "radial-gradient(circle, #1db9a0 0%, transparent 70%)" }}
                  />
                  <Image
                    src="/images/hardware/powerlink-go.png"
                    alt="PowerlinkGO energy monitoring device"
                    width={300}
                    height={300}
                    className="relative h-auto w-[300px] drop-shadow-2xl"
                    style={{ filter: "drop-shadow(0 25px 40px rgba(0, 0, 0, 0.3))" }}
                    priority
                  />
                </div>
              </div>
            </FadeIn>

            {/* Mobile: Device (foreground) + Dashboard (background) */}
            <FadeIn direction="up" delay={0.3} className="relative lg:hidden">
              <div className="relative h-[280px] mx-auto max-w-[340px]">
                {/* Dashboard screenshot - BACKGROUND */}
                <div
                  className="absolute top-0 right-0 rounded-lg overflow-hidden"
                  style={{
                    transform: "perspective(800px) rotateY(-4deg)",
                    boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.3)"
                  }}
                >
                  <Image
                    src="/images/dashboard/dashboard-main.png"
                    alt="Amp Dashboard"
                    width={240}
                    height={150}
                    className="w-[240px] h-auto"
                  />
                </div>

                {/* Hardware device - FOREGROUND */}
                <div className="absolute bottom-0 left-0 z-10">
                  <Image
                    src="/images/hardware/powerlink-go.png"
                    alt="PowerlinkGO device"
                    width={180}
                    height={180}
                    className="h-auto w-[180px] drop-shadow-xl"
                  />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40"
          style={{ background: "linear-gradient(to top, var(--background-subtle), transparent)" }}
        />
      </section>

      {/* ============================================
          SECTION 2: HARDWARE TABS - Light Background
          ============================================ */}
      <section
        id="hardware"
        className="scroll-mt-20 bg-[var(--background-subtle)] py-[var(--space-section-lg)] overflow-x-hidden"
        aria-labelledby="hardware-heading"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto">
              <Badge variant="primary">Plug & Play Hardware</Badge>
              <h2
                id="hardware-heading"
                className="mt-6 font-display text-[var(--text-4xl)] font-bold tracking-tight text-[var(--foreground-heading)]"
              >
                Hardware that{" "}
                <span className="gradient-text">just works</span>
              </h2>
              <p className="mt-4 text-lg text-[var(--muted)]">
                Zero shutdown installation. No building management system required.
                Revenue-grade accuracy from day one.
              </p>
            </div>
          </FadeIn>

          {/* Tabs */}
          <FadeIn delay={0.2}>
            <Tabs.Root
              value={currentTab}
              onValueChange={handleTabChange}
              className="mt-12"
            >
              <Tabs.List
                className="flex justify-center gap-2 p-1.5 rounded-full bg-[var(--background)] border border-[var(--border)] w-fit mx-auto"
                aria-label="Hardware options"
              >
                <Tabs.Trigger
                  value="hub"
                  className="cursor-pointer px-6 py-2.5 rounded-full text-sm font-medium transition-all data-[state=active]:bg-[var(--color-primary)] data-[state=active]:text-white data-[state=inactive]:text-[var(--muted)] data-[state=inactive]:hover:text-[var(--foreground)] data-[state=inactive]:hover:bg-[var(--background-subtle)]"
                >
                  Amp Hub
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="meters"
                  className="cursor-pointer px-6 py-2.5 rounded-full text-sm font-medium transition-all data-[state=active]:bg-[var(--color-primary)] data-[state=active]:text-white data-[state=inactive]:text-[var(--muted)] data-[state=inactive]:hover:text-[var(--foreground)] data-[state=inactive]:hover:bg-[var(--background-subtle)]"
                >
                  PowerlinkGO
                </Tabs.Trigger>
              </Tabs.List>

              {/* Tab Content */}
              <div className="mt-12">
                <Tabs.Content value="hub" className="focus:outline-none">
                  <HardwareTabContent specs={hubSpecs} />
                </Tabs.Content>
                <Tabs.Content value="meters" className="focus:outline-none">
                  <HardwareTabContent specs={meterSpecs} />
                </Tabs.Content>
              </div>
            </Tabs.Root>
          </FadeIn>
        </div>
      </section>

      {/* ============================================
          SECTION 3: BENTO GRID - Dark Background
          ============================================ */}
      <section
        className="section-dark py-[var(--space-section-lg)] relative overflow-hidden"
        aria-labelledby="platform-heading"
      >
        {/* Background effects */}
        <div className="absolute inset-0 opacity-20 bg-dots-dark" />
        <div
          className="pointer-events-none absolute top-0 right-1/4 w-80 h-80 rounded-full blur-[120px]"
          style={{ background: "var(--glow-teal-strong)" }}
        />
        <div
          className="pointer-events-none absolute bottom-0 left-1/4 w-80 h-80 rounded-full blur-[120px]"
          style={{ background: "var(--glow-blue)" }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto">
              <Badge variant="dark">Intelligent Platform</Badge>
              <h2
                id="platform-heading"
                className="mt-6 font-display text-[var(--text-4xl)] font-bold tracking-tight text-dark-heading"
              >
                Platform built for{" "}
                <span className="gradient-text">action</span>
              </h2>
              <p className="mt-4 text-lg text-dark-muted">
                Don&apos;t just see data—act on it. Our platform shows exactly what to fix and how much you&apos;ll save.
              </p>
            </div>
          </FadeIn>

          {/* Bento Grid */}
          <FadeInStagger staggerDelay={0.1}>
            <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {platformFeatures.map((feature, i) => (
                <FadeInStaggerItem
                  key={feature.id}
                  index={i}
                  className={feature.large ? "sm:col-span-2 lg:row-span-2" : ""}
                >
                  <div
                    className={`h-full rounded-2xl p-6 lg:p-8 transition-all duration-300 hover:scale-[1.02] ${
                      feature.large ? "flex flex-col justify-between" : "flex flex-col"
                    }`}
                    style={{
                      background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
                      border: "1px solid var(--section-dark-border)"
                    }}
                  >
                    <div>
                      <div
                        className="inline-flex h-12 w-12 items-center justify-center rounded-xl icon-glow"
                        style={{ background: "var(--glow-teal-strong)" }}
                      >
                        <feature.icon className="h-6 w-6 text-[var(--color-primary)]" />
                      </div>
                      <h3
                        className={`mt-4 font-display font-semibold text-dark-heading ${
                          feature.large ? "text-2xl" : "text-lg"
                        }`}
                      >
                        {feature.title}
                      </h3>
                      <p
                        className={`mt-2 text-dark-muted ${feature.large ? "text-base" : "text-sm"}`}
                      >
                        {feature.description}
                      </p>
                    </div>
                    {/* Visualization for all cards */}
                    {feature.visualization && (
                      <feature.visualization />
                    )}
                  </div>
                </FadeInStaggerItem>
              ))}
            </div>
          </FadeInStagger>
        </div>
      </section>

      {/* ============================================
          SECTION 4: HOW IT WORKS - Light Background
          ============================================ */}
      <section
        className="bg-[var(--background)] py-[var(--space-section-lg)]"
        aria-labelledby="how-it-works-heading"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto">
              <Badge variant="primary">Simple Process</Badge>
              <h2
                id="how-it-works-heading"
                className="mt-6 font-display text-[var(--text-4xl)] font-bold tracking-tight text-[var(--foreground-heading)]"
              >
                How It Works
              </h2>
              <p className="mt-4 text-lg text-[var(--muted)]">
                From installation to insights in 24 hours. No complex setup, no long wait times.
              </p>
            </div>
          </FadeIn>

          <FadeInStagger staggerDelay={0.2}>
            <div className="mt-16 grid gap-8 lg:grid-cols-3">
              {steps.map((step, i) => (
                <FadeInStaggerItem key={step.number} index={i}>
                  <div className="relative">
                    {/* Connector line */}
                    {i < steps.length - 1 && (
                      <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-[var(--color-primary)] to-transparent" />
                    )}
                    <div className="gradient-border p-8 h-full">
                      <span className="font-display text-5xl font-bold text-[var(--color-primary)]/20">
                        {step.number}
                      </span>
                      <h3 className="mt-4 font-display text-2xl font-semibold text-[var(--foreground)]">
                        {step.title}
                      </h3>
                      <p className="mt-3 text-[var(--muted)]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </FadeInStaggerItem>
              ))}
            </div>
          </FadeInStagger>
        </div>
      </section>

      {/* ============================================
          SECTION 5: PRICING - Dark Gradient
          ============================================ */}
      <section
        id="pricing"
        className="scroll-mt-20 section-dark py-[var(--space-section-lg)] relative overflow-hidden"
        aria-labelledby="pricing-heading"
      >
        {/* Background effects */}
        <div className="absolute inset-0 opacity-30 bg-grid-dark" />
        <div
          className="pointer-events-none absolute top-1/2 left-0 w-96 h-96 rounded-full blur-[150px] -translate-y-1/2"
          style={{ background: "var(--glow-teal)" }}
        />
        <div
          className="pointer-events-none absolute top-1/2 right-0 w-96 h-96 rounded-full blur-[150px] -translate-y-1/2"
          style={{ background: "var(--glow-blue)" }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto">
              <Badge variant="dark">Transparent Pricing</Badge>
              <h2
                id="pricing-heading"
                className="mt-6 font-display text-[var(--text-4xl)] font-bold tracking-tight text-dark-heading"
              >
                Simple, predictable{" "}
                <span className="gradient-text">pricing</span>
              </h2>
              <p className="mt-4 text-lg text-dark-muted">
                One-time hardware cost plus affordable monthly software. No hidden fees.
              </p>
            </div>
          </FadeIn>

          {/* Pricing Cards */}
          <FadeInStagger staggerDelay={0.15}>
            <div className="mt-16 grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
              {pricingTiers.map((tier, i) => (
                <FadeInStaggerItem key={tier.name} index={i}>
                  <div
                    className={`relative rounded-3xl p-8 lg:p-10 h-full flex flex-col ${
                      tier.highlighted ? "ring-2 ring-[var(--color-primary)]" : ""
                    }`}
                    style={{
                      background: tier.highlighted
                        ? "linear-gradient(135deg, rgba(29,185,160,0.1) 0%, rgba(255,255,255,0.03) 100%)"
                        : "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
                      border: "1px solid var(--section-dark-border)"
                    }}
                  >
                    {tier.highlighted && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <Badge variant="dark" className="shadow-lg">
                          {tier.tagline}
                        </Badge>
                      </div>
                    )}

                    <div className="flex-1">
                      <h3 className="font-display text-2xl font-bold text-dark-heading">
                        {tier.name}
                      </h3>
                      {!tier.highlighted && (
                        <p className="text-sm text-[var(--color-primary)]">{tier.tagline}</p>
                      )}
                      <p className="mt-2 text-sm text-dark-muted">
                        {tier.description}
                      </p>

                      <div className="mt-6">
                        <span className="font-display text-4xl font-bold text-dark-heading">
                          {tier.price}
                        </span>
                        <span className="ml-2 text-sm text-dark-muted">
                          {tier.period}
                        </span>
                      </div>

                      <ul className="mt-8 space-y-3">
                        {tier.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-3">
                            <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--glow-teal-strong)]">
                              <CheckIcon className="h-3 w-3 text-[var(--color-primary)]" />
                            </div>
                            <span className="text-sm text-dark-text">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-8">
                      <Button
                        asChild
                        size="lg"
                        className={`btn-lift w-full ${
                          tier.highlighted ? "" : "bg-white/10 hover:bg-white/20 text-dark-heading"
                        }`}
                        variant={tier.highlighted ? "primary" : "secondary"}
                      >
                        <a
                          href="https://calendly.com/tariq-amp/intro-call"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {tier.cta}
                        </a>
                      </Button>
                    </div>
                  </div>
                </FadeInStaggerItem>
              ))}
            </div>
          </FadeInStagger>
        </div>
      </section>

      {/* ============================================
          SECTION 6: CTA - Accent/Mint Background
          ============================================ */}
      <section
        className="relative overflow-hidden py-[var(--space-section-lg)]"
        style={{ background: "linear-gradient(135deg, var(--color-primary-light) 0%, #D4F5ED 100%)" }}
        aria-labelledby="product-cta-heading"
      >
        {/* Decorative elements */}
        <div
          className="pointer-events-none absolute top-0 left-1/4 w-64 h-64 rounded-full blur-[100px] opacity-50"
          style={{ background: "var(--color-primary)" }}
        />
        <div
          className="pointer-events-none absolute bottom-0 right-1/4 w-64 h-64 rounded-full blur-[100px] opacity-30"
          style={{ background: "var(--color-secondary)" }}
        />

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <FadeIn>
            <h2
              id="product-cta-heading"
              className="font-display text-[var(--text-4xl)] font-bold tracking-tight text-[var(--color-primary-dark)] lg:text-[var(--text-5xl)]"
            >
              Ready to see your building&apos;s data?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--color-primary-dark)]/80">
              Book a demo and get equipment-level visibility in 24 hours.
              No commitment, no pressure—just clarity.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                asChild
                size="lg"
                className="btn-lift bg-[var(--color-primary-dark)] hover:bg-[var(--color-primary-dark)]/90"
              >
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
                className="btn-lift border-[var(--color-primary-dark)]/20 text-[var(--color-primary-dark)]"
              >
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}

// Hardware Tab Content Component
function HardwareTabContent({ specs }: { specs: typeof hubSpecs }) {
  const isPowerlinkGO = specs.name === "PowerlinkGO";
  const isAmpHub = specs.name === "Amp Hub";

  return (
    <div className="grid gap-8 lg:grid-cols-[45%_1fr] lg:gap-12 items-center max-w-6xl mx-auto">
      {/* Image/Visualization - 45% width on desktop */}
      <FadeIn direction="right">
        <div
          className="relative w-full aspect-[3/4] rounded-2xl p-3 sm:p-6 float-3d flex items-center justify-center bg-gradient-to-br from-[var(--background)] to-[var(--background-subtle)]"
          style={{
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px var(--border)",
          }}
        >
          {isPowerlinkGO ? (
            <VizPowerlinkGO />
          ) : isAmpHub ? (
            <VizAmpHub />
          ) : (
            <Image
              src={specs.image}
              alt={specs.name}
              width={600}
              height={450}
              className="max-h-full max-w-[85%] object-contain"
            />
          )}
        </div>
      </FadeIn>

      {/* Content - 55% width on desktop */}
      <FadeIn direction="left" delay={0.2}>
        <div className="min-w-0 lg:pr-4">
          <span className="text-sm font-medium uppercase tracking-wider text-[var(--color-primary)]">
            {specs.tagline}
          </span>
          <h3 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-[var(--foreground-heading)]">
            {specs.name}
          </h3>
          <p className="mt-4 text-base sm:text-lg text-[var(--muted)]">
            {specs.description}
          </p>

          {/* Specs grid - stack on small screens, 2 cols from 400px+ */}
          <dl className="mt-6 sm:mt-8 grid grid-cols-1 min-[400px]:grid-cols-2 gap-3 sm:gap-4">
            {specs.specs.map((spec) => (
              <div
                key={spec.label}
                className="rounded-xl p-4 bg-[var(--background)]"
                style={{ boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08), 0 0 0 1px var(--border)" }}
              >
                <dt className="text-xs font-medium text-[var(--muted)]">
                  {spec.label}
                </dt>
                <dd className="mt-1 font-display text-xl font-bold text-[var(--color-primary)]">
                  {spec.value}
                </dd>
                <dd className="text-xs text-[var(--muted)]">
                  {spec.desc}
                </dd>
              </div>
            ))}
          </dl>

          {/* Features list */}
          <ul className="mt-8 space-y-3">
            {specs.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)]/15">
                  <CheckIcon className="h-3 w-3 text-[var(--color-primary)]" />
                </div>
                <span className="text-[var(--foreground)]">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </FadeIn>
    </div>
  );
}

// Main export with Suspense for useSearchParams
export default function ProductPage() {
  return (
    <Suspense fallback={<ProductPageSkeleton />}>
      <ProductPageContent />
    </Suspense>
  );
}

// Loading skeleton
function ProductPageSkeleton() {
  return (
    <div className="section-dark-hero min-h-[90vh] flex items-center justify-center">
      <div className="animate-pulse">
        <div className="h-8 w-32 bg-white/10 rounded-full mx-auto" />
        <div className="mt-8 h-16 w-96 bg-white/10 rounded-lg mx-auto" />
        <div className="mt-4 h-6 w-64 bg-white/10 rounded-lg mx-auto" />
      </div>
    </div>
  );
}

// ========================================
// BENTO CARD VISUALIZATIONS
// Premium abstract illustrations with animations
// ========================================

// Circuit Monitoring - Grid network (large card)
function VizCircuitMonitoring() {
  return (
    <div className="viz-circuit relative w-full h-[280px] lg:h-[320px] mt-6">
      {/* Visually hidden description for screen readers */}
      <span className="sr-only">
        Animated visualization showing a grid of connected circuit nodes with data flowing between them, representing real-time circuit-level monitoring.
      </span>
      <svg className="w-full h-full" viewBox="0 0 400 280" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          {/* Topographic pattern */}
          <pattern id="topo-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M0,30 Q15,25 30,30 T60,30" fill="none" stroke="rgba(29, 185, 160, 0.04)" strokeWidth="1" />
            <path d="M0,45 Q15,40 30,45 T60,45" fill="none" stroke="rgba(29, 185, 160, 0.03)" strokeWidth="1" />
          </pattern>
        </defs>

        {/* Background topographic lines */}
        <rect className="topo-line" width="100%" height="100%" fill="url(#topo-pattern)" />

        {/* Grid connection lines - horizontal */}
        <line className="grid-line" x1="60" y1="70" x2="340" y2="70" stroke="rgba(29, 185, 160, 0.15)" strokeWidth="1" />
        <line className="grid-line" x1="60" y1="140" x2="340" y2="140" stroke="rgba(29, 185, 160, 0.15)" strokeWidth="1" />
        <line className="grid-line" x1="60" y1="210" x2="340" y2="210" stroke="rgba(29, 185, 160, 0.15)" strokeWidth="1" />

        {/* Grid connection lines - vertical */}
        <line className="grid-line" x1="80" y1="50" x2="80" y2="230" stroke="rgba(29, 185, 160, 0.15)" strokeWidth="1" />
        <line className="grid-line" x1="150" y1="50" x2="150" y2="230" stroke="rgba(29, 185, 160, 0.15)" strokeWidth="1" />
        <line className="grid-line" x1="220" y1="50" x2="220" y2="230" stroke="rgba(29, 185, 160, 0.15)" strokeWidth="1" />
        <line className="grid-line" x1="290" y1="50" x2="290" y2="230" stroke="rgba(29, 185, 160, 0.15)" strokeWidth="1" />

        {/* Data flow dots - horizontal */}
        <circle className="data-dot-h" cx="60" cy="70" r="3" fill="#1DB9A0" />
        <circle className="data-dot-h-2" cx="60" cy="140" r="3" fill="#1DB9A0" />

        {/* Data flow dots - vertical */}
        <circle className="data-dot-v" cx="150" cy="50" r="3" fill="#1DB9A0" />
        <circle className="data-dot-v-2" cx="290" cy="50" r="3" fill="#1DB9A0" />

        {/* Grid nodes - Row 1 */}
        <g className="node">
          <circle cx="80" cy="70" r="8" fill="rgba(29, 185, 160, 0.1)" />
          <circle className="node-pulse-1" cx="80" cy="70" r="4" fill="rgba(29, 185, 160, 0.6)" />
        </g>
        <g className="node">
          <circle cx="150" cy="70" r="8" fill="rgba(29, 185, 160, 0.1)" />
          <circle className="node-pulse-3" cx="150" cy="70" r="4" fill="rgba(29, 185, 160, 0.5)" />
        </g>
        <g className="node">
          <circle cx="220" cy="70" r="8" fill="rgba(29, 185, 160, 0.1)" />
          <circle className="node-pulse-2" cx="220" cy="70" r="4" fill="rgba(29, 185, 160, 0.6)" />
        </g>
        <g className="node">
          <circle cx="290" cy="70" r="8" fill="rgba(29, 185, 160, 0.1)" />
          <circle className="node-pulse-4" cx="290" cy="70" r="4" fill="rgba(29, 185, 160, 0.5)" />
        </g>

        {/* Grid nodes - Row 2 */}
        <g className="node">
          <circle cx="80" cy="140" r="8" fill="rgba(29, 185, 160, 0.1)" />
          <circle className="node-pulse-4" cx="80" cy="140" r="4" fill="rgba(29, 185, 160, 0.5)" />
        </g>
        <g className="node">
          <circle cx="150" cy="140" r="12" fill="rgba(29, 185, 160, 0.2)" />
          <circle className="node-primary" cx="150" cy="140" r="6" fill="#1DB9A0" />
        </g>
        <g className="node">
          <circle cx="220" cy="140" r="8" fill="rgba(29, 185, 160, 0.1)" />
          <circle className="node-pulse-1" cx="220" cy="140" r="4" fill="rgba(29, 185, 160, 0.6)" />
        </g>
        <g className="node">
          <circle cx="290" cy="140" r="8" fill="rgba(29, 185, 160, 0.1)" />
          <circle className="node-pulse-3" cx="290" cy="140" r="4" fill="rgba(29, 185, 160, 0.5)" />
        </g>

        {/* Grid nodes - Row 3 */}
        <g className="node">
          <circle cx="80" cy="210" r="8" fill="rgba(29, 185, 160, 0.1)" />
          <circle className="node-pulse-2" cx="80" cy="210" r="4" fill="rgba(29, 185, 160, 0.5)" />
        </g>
        <g className="node">
          <circle cx="150" cy="210" r="8" fill="rgba(29, 185, 160, 0.1)" />
          <circle className="node-pulse-4" cx="150" cy="210" r="4" fill="rgba(29, 185, 160, 0.6)" />
        </g>
        <g className="node">
          <circle cx="220" cy="210" r="8" fill="rgba(29, 185, 160, 0.1)" />
          <circle className="node-pulse-3" cx="220" cy="210" r="4" fill="rgba(29, 185, 160, 0.5)" />
        </g>
        <g className="node">
          <circle cx="290" cy="210" r="8" fill="rgba(29, 185, 160, 0.1)" />
          <circle className="node-pulse-1" cx="290" cy="210" r="4" fill="rgba(29, 185, 160, 0.6)" />
        </g>
      </svg>
    </div>
  );
}

// AI Savings - Animated line graph
function VizAiSavings() {
  return (
    <div className="viz-line-graph relative w-full h-[140px] mt-4">
      <span className="sr-only">
        Animated line graph showing energy savings trending upward over time with a glowing endpoint indicator.
      </span>
      {/* Dot grid background */}
      <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
        <defs>
          <pattern id="dot-grid-ai" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="rgba(29, 185, 160, 0.05)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dot-grid-ai)" />
      </svg>

      {/* Line graph */}
      <svg className="relative w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(29, 185, 160, 0.3)" />
            <stop offset="100%" stopColor="rgba(29, 185, 160, 0.8)" />
          </linearGradient>
          <linearGradient id="fill-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(29, 185, 160, 0.2)" />
            <stop offset="100%" stopColor="rgba(29, 185, 160, 0)" />
          </linearGradient>
        </defs>

        {/* Fill area */}
        <path
          className="fill-area"
          d="M0,85 Q30,80 50,70 T100,45 T150,25 T180,22 L180,100 L0,100 Z"
          fill="url(#fill-gradient)"
        />

        {/* Line */}
        <path
          className="line"
          d="M0,85 Q30,80 50,70 T100,45 T150,25 T180,22"
          fill="none"
          stroke="url(#line-gradient)"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Traveling dot along the line - continuous animation */}
        <circle className="traveling-dot" r="3" fill="#1DB9A0" />

        {/* Endpoint glow and dot - continuous pulse */}
        <circle className="endpoint-glow" cx="180" cy="22" r="8" fill="rgba(29, 185, 160, 0.3)" />
        <circle className="endpoint-dot" cx="180" cy="22" r="3" fill="#1DB9A0" />
      </svg>
    </div>
  );
}

// Real-time Alerts - Pulse waveform with spike
function VizAlerts() {
  return (
    <div className="viz-alerts relative w-full h-[140px] mt-4 overflow-hidden">
      <span className="sr-only">
        Animated waveform visualization with an alert spike and expanding ripples, representing real-time anomaly detection.
      </span>
      <svg className="w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        {/* Waveform - left side */}
        <path
          className="waveform"
          d="M0,50 Q10,50 20,48 T40,52 T60,48 T80,52 T95,50"
          fill="none"
          stroke="rgba(29, 185, 160, 0.3)"
          strokeWidth="1.5"
        />

        {/* Alert spike */}
        <g className="spike-active">
          <path
            className="spike"
            d="M95,50 L100,50 L105,15 L110,70 L115,35 L120,55 L125,50"
            fill="none"
            stroke="#1DB9A0"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* Waveform - right side */}
        <path
          className="waveform"
          d="M125,50 Q135,48 145,52 T165,48 T185,52 T200,50"
          fill="none"
          stroke="rgba(29, 185, 160, 0.3)"
          strokeWidth="1.5"
        />

        {/* Ripple circles from spike */}
        <circle className="ripple ripple-1" cx="110" cy="50" r="15" fill="none" stroke="rgba(29, 185, 160, 0.5)" strokeWidth="1" />
        <circle className="ripple ripple-2" cx="110" cy="50" r="15" fill="none" stroke="rgba(29, 185, 160, 0.4)" strokeWidth="1" />
        <circle className="ripple ripple-3" cx="110" cy="50" r="15" fill="none" stroke="rgba(29, 185, 160, 0.3)" strokeWidth="1" />
      </svg>
    </div>
  );
}

// Building Rating - Topographic contour gauge
function VizRating() {
  return (
    <div className="viz-rating relative w-full h-[140px] mt-4 flex items-center justify-center">
      <span className="sr-only">
        Animated efficiency gauge with concentric zones from red (poor) to green (excellent), with an indicator showing high efficiency.
      </span>
      <svg className="w-full h-full" viewBox="0 0 200 120" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        {/* Contour lines - outer to inner (warm to cool) */}
        <rect className="contour contour-1" x="20" y="15" width="160" height="90" rx="20" fill="none" stroke="rgba(255, 150, 100, 0.15)" strokeWidth="1" />
        <rect className="contour contour-2" x="35" y="25" width="130" height="70" rx="16" fill="none" stroke="rgba(255, 180, 100, 0.2)" strokeWidth="1" />
        <rect className="contour contour-3" x="50" y="35" width="100" height="50" rx="12" fill="none" stroke="rgba(200, 200, 100, 0.25)" strokeWidth="1" />
        <rect className="contour contour-4" x="65" y="45" width="70" height="30" rx="8" fill="none" stroke="rgba(100, 200, 160, 0.3)" strokeWidth="1" />
        <rect className="contour contour-5" x="80" y="52" width="40" height="16" rx="4" fill="none" stroke="rgba(29, 185, 160, 0.5)" strokeWidth="1.5" />

        {/* Center fill - the "good" zone */}
        <rect className="contour contour-5" x="80" y="52" width="40" height="16" rx="4" fill="rgba(29, 185, 160, 0.1)" />

        {/* Indicator with glow */}
        <circle className="indicator-glow" cx="100" cy="60" r="8" fill="rgba(29, 185, 160, 0.2)" />
        <circle className="indicator-dot" cx="100" cy="60" r="4" fill="#1DB9A0" />
      </svg>
    </div>
  );
}

// API Access - Connection nodes with data flow
function VizApi() {
  return (
    <div className="viz-api relative w-full h-[140px] mt-4">
      <span className="sr-only">
        Animated network diagram showing a central API hub connected to multiple integration endpoints with flowing data.
      </span>
      <svg className="w-full h-full" viewBox="0 0 200 120" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        {/* Connection lines (bezier curves) with draw animation */}
        <path className="connection-line" d="M100,60 Q60,30 30,35" fill="none" stroke="rgba(29, 185, 160, 0.3)" strokeWidth="1" />
        <path className="connection-line" d="M100,60 Q140,25 170,30" fill="none" stroke="rgba(29, 185, 160, 0.3)" strokeWidth="1" />
        <path className="connection-line" d="M100,60 Q50,70 25,85" fill="none" stroke="rgba(29, 185, 160, 0.3)" strokeWidth="1" />
        <path className="connection-line" d="M100,60 Q150,75 175,90" fill="none" stroke="rgba(29, 185, 160, 0.3)" strokeWidth="1" />
        <path className="connection-line" d="M100,60 Q100,90 100,105" fill="none" stroke="rgba(29, 185, 160, 0.3)" strokeWidth="1" />

        {/* Data flow lines (dashed, animated) */}
        <path className="connection" d="M100,60 Q60,30 30,35" fill="none" stroke="rgba(29, 185, 160, 0.5)" strokeWidth="1" />
        <path className="connection" d="M100,60 Q140,25 170,30" fill="none" stroke="rgba(29, 185, 160, 0.5)" strokeWidth="1" />
        <path className="connection" d="M100,60 Q50,70 25,85" fill="none" stroke="rgba(29, 185, 160, 0.5)" strokeWidth="1" />
        <path className="connection" d="M100,60 Q150,75 175,90" fill="none" stroke="rgba(29, 185, 160, 0.5)" strokeWidth="1" />
        <path className="connection" d="M100,60 Q100,90 100,105" fill="none" stroke="rgba(29, 185, 160, 0.5)" strokeWidth="1" />

        {/* Center node (main hub) with pulse */}
        <g className="center-node">
          <circle cx="100" cy="60" r="12" fill="rgba(29, 185, 160, 0.15)" />
          <circle cx="100" cy="60" r="6" fill="#1DB9A0" />
        </g>

        {/* Outer nodes with fade-in */}
        <g className="node-outer">
          <circle cx="30" cy="35" r="7" fill="rgba(29, 185, 160, 0.15)" />
          <circle cx="30" cy="35" r="3" fill="rgba(29, 185, 160, 0.7)" />
        </g>
        <g className="node-outer">
          <circle cx="170" cy="30" r="7" fill="rgba(29, 185, 160, 0.15)" />
          <circle cx="170" cy="30" r="3" fill="rgba(29, 185, 160, 0.7)" />
        </g>
        <g className="node-outer">
          <circle cx="25" cy="85" r="7" fill="rgba(29, 185, 160, 0.15)" />
          <circle cx="25" cy="85" r="3" fill="rgba(29, 185, 160, 0.7)" />
        </g>
        <g className="node-outer">
          <circle cx="175" cy="90" r="7" fill="rgba(29, 185, 160, 0.15)" />
          <circle cx="175" cy="90" r="3" fill="rgba(29, 185, 160, 0.7)" />
        </g>
        <g className="node-outer">
          <circle cx="100" cy="105" r="7" fill="rgba(29, 185, 160, 0.15)" />
          <circle cx="100" cy="105" r="3" fill="rgba(29, 185, 160, 0.7)" />
        </g>
      </svg>
    </div>
  );
}

// PowerlinkGO Data Flow Visualization
// All paths and positions are STATIC to prevent hydration errors
// Uses SVG SMIL animateMotion for better cross-browser support
function VizPowerlinkGO() {
  // Static equipment data with pre-calculated positions
  // Layout: Arranged around center point (200, 200) in 400x400 viewBox
  // Side: 'left' = 20% mobile / 16% desktop, 'right' = 80% mobile / 84% desktop, 'center' = 50%
  const equipmentData = [
    {
      id: 'hvac',
      label: 'HVAC',
      icon: HvacIcon,
      path: 'M65,290 Q130,250 200,200',
      side: 'left' as const,
      top: '72%',
      delay: 0,
    },
    {
      id: 'chiller',
      label: 'Chiller',
      icon: ChillerIcon,
      path: 'M200,50 Q200,120 200,200',
      side: 'center' as const,
      top: '10%',
      delay: 0.4,
    },
    {
      id: 'pump',
      label: 'Pump',
      icon: PumpIcon,
      path: 'M335,110 Q270,150 200,200',
      side: 'right' as const,
      top: '28%',
      delay: 0.8,
    },
    {
      id: 'lighting',
      label: 'Lighting',
      icon: LightingIcon,
      path: 'M335,290 Q270,250 200,200',
      side: 'right' as const,
      top: '72%',
      delay: 1.2,
    },
    {
      id: 'socket',
      label: 'Plug',
      icon: SocketIcon,
      path: 'M200,350 Q200,280 200,200',
      side: 'center' as const,
      top: '90%',
      delay: 1.6,
    },
    {
      id: 'meter',
      label: 'Meter',
      icon: MeterIcon,
      path: 'M65,110 Q130,150 200,200',
      side: 'left' as const,
      top: '28%',
      delay: 2.0,
    },
  ];

  return (
    <div
      className="viz-powerlink relative w-full max-w-[280px] sm:max-w-[400px] md:max-w-[500px] mx-auto flex items-center justify-center py-6"
      style={{ aspectRatio: '1 / 1.3' }}
      role="img"
      aria-label="PowerlinkGO device receiving data from building equipment including HVAC, chiller, pump, lighting, plug loads, and meter"
    >
      {/* Scale down on mobile to fit 320px screens */}
      <div className="relative w-full h-full scale-[0.85] sm:scale-100 origin-center">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 400 400"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
        {/* Subtle orbit ring */}
        <circle
          className="viz-orbit-ring"
          cx="200"
          cy="200"
          r="140"
          fill="none"
          stroke="rgba(29, 185, 160, 0.1)"
          strokeWidth="1"
          strokeDasharray="6 6"
        />

        {/* Connection paths with dashed animation */}
        {equipmentData.map((eq) => (
          <path
            key={`path-${eq.id}`}
            className="viz-path"
            d={eq.path}
            fill="none"
            stroke="rgba(29, 185, 160, 0.2)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        ))}

        {/* Animated flow dots using SVG SMIL */}
        {equipmentData.map((eq) => (
          <circle
            key={`dot-${eq.id}`}
            className="viz-flow-dot"
            r="5"
            fill="#1DB9A0"
          >
            <animateMotion
              dur="2.5s"
              repeatCount="indefinite"
              begin={`${eq.delay}s`}
              calcMode="spline"
              keySplines="0.4 0 0.2 1"
              keyTimes="0;1"
              path={eq.path}
            />
          </circle>
        ))}

        {/* Pulsing rings behind device */}
        <circle
          className="viz-pulse-ring"
          cx="200"
          cy="200"
          r="70"
          fill="rgba(29, 185, 160, 0.08)"
        />
        <circle
          className="viz-pulse-ring viz-pulse-ring-2"
          cx="200"
          cy="200"
          r="55"
          fill="rgba(29, 185, 160, 0.12)"
        />
      </svg>

      {/* Equipment icons - responsive positioning: 20%/80% on mobile, 16%/84% on desktop */}
      {equipmentData.map((eq) => {
        const IconComponent = eq.icon;
        return (
          <div
            key={`icon-${eq.id}`}
            className={`viz-equipment-icon absolute flex flex-col items-center ${
              eq.side === 'left'
                ? 'left-[20%] md:left-[16%]'
                : eq.side === 'right'
                ? 'left-[80%] md:left-[84%]'
                : 'left-[50%]'
            }`}
            style={{
              top: eq.top,
              transform: 'translate(-50%, -50%)',
              animationDelay: `${eq.delay * 0.15}s`,
            }}
          >
            <div className="w-11 h-11 rounded-full bg-[var(--background)] border border-[var(--border)] shadow-sm flex items-center justify-center">
              <IconComponent className="w-5 h-5 text-[var(--muted)]" />
            </div>
            <span className="mt-1.5 text-[10px] text-[var(--muted)] font-medium">{eq.label}</span>
          </div>
        );
      })}

      {/* Central PowerlinkGO device - 3-4x larger */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute -inset-8 rounded-2xl bg-[var(--color-primary)]/20 blur-2xl" />
          {/* Device image container */}
          <div className="relative w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] flex items-center justify-center">
            <Image
              src="/images/hardware/powerlink-go.png"
              alt="PowerlinkGO Device"
              width={200}
              height={200}
              className="object-contain drop-shadow-xl relative z-10"
              priority
            />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

// Equipment Icons for PowerlinkGO visualization
function HvacIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495" />
    </svg>
  );
}

function ChillerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  );
}

function PumpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function LightingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
    </svg>
  );
}

function SocketIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
    </svg>
  );
}

function MeterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
    </svg>
  );
}

function MotorIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  );
}
