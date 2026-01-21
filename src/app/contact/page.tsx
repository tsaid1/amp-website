"use client";

import { useState, useRef, type FormEvent } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { Button, Input, Textarea, FadeIn, FadeInStagger, FadeInStaggerItem } from "@/components/ui";
import { CalendarIcon, MailIcon, MapPinIcon, ChevronDownIcon } from "@/components/icons";
import { submitContactForm } from "./actions";

const faqs = [
  {
    question: "How do I know if Amp is right for my building?",
    answer:
      "Amp works with any commercial building, regardless of age or existing systems. Whether you're targeting net-zero emissions or simply want to reduce energy bills, we help you see exactly where energy is being used—and wasted.",
  },
  {
    question: "Do I need a building management system (BMS)?",
    answer:
      "No. Amp is completely standalone and doesn't require any existing systems or software.",
  },
  {
    question: "How much can I expect to save?",
    answer:
      "On average, our customers identify 10-20% in energy savings opportunities. The exact amount depends on your building, but we'll show you the projected savings before you commit to any changes.",
  },
  {
    question: "How accurate is the data?",
    answer: "Our sensors measure within ±0.2% accuracy—precise enough to bill tenants or verify energy contracts.",
  },
  {
    question: "How long does installation take?",
    answer: "Typically 4 hours. Your building stays fully operational during installation, and you'll see live data within 24 hours.",
  },
];

// Validation helpers
function validateEmail(email: string): string | null {
  if (!email) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Please enter a valid email address";
  return null;
}

function validateName(name: string): string | null {
  if (!name) return "Name is required";
  if (name.length < 2) return "Name must be at least 2 characters";
  if (name.length > 100) return "Name must be less than 100 characters";
  return null;
}

function validateMessage(message: string): string | null {
  if (!message) return "Message is required";
  if (message.length < 10) return "Message must be at least 10 characters";
  if (message.length > 2000) return "Message must be less than 2000 characters";
  return null;
}

type FormStatus = "idle" | "submitting" | "success" | "error";

interface FormErrors {
  name?: string;
  email?: string;
  company?: string;
  message?: string;
  website?: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
    website: "", // Honeypot field - should remain empty
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Refs for focus management on validation errors
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const nameError = validateName(formData.name);
    if (nameError) newErrors.name = nameError;

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const messageError = validateMessage(formData.message);
    if (messageError) newErrors.message = messageError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Focus the first field with an error for accessibility
  const focusFirstError = (errorFields: FormErrors) => {
    if (errorFields.name && nameInputRef.current) {
      nameInputRef.current.focus();
    } else if (errorFields.email && emailInputRef.current) {
      emailInputRef.current.focus();
    } else if (errorFields.message && messageInputRef.current) {
      messageInputRef.current.focus();
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Validate form and focus first error if invalid
    const newErrors: FormErrors = {};
    const nameError = validateName(formData.name);
    if (nameError) newErrors.name = nameError;
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;
    const messageError = validateMessage(formData.message);
    if (messageError) newErrors.message = messageError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Focus first error field after state update
      setTimeout(() => focusFirstError(newErrors), 0);
      return;
    }

    // Prevent double submission
    if (status === "submitting") return;

    setStatus("submitting");

    try {
      const result = await submitContactForm({
        name: formData.name,
        email: formData.email,
        company: formData.company || undefined,
        message: formData.message,
        website: formData.website, // Honeypot
      });

      if (result.success) {
        setStatus("success");
        setFormData({ name: "", email: "", company: "", message: "", website: "" });
        setErrors({});
      } else {
        setStatus("error");
        setSubmitError(result.error || "Failed to send message. Please try again.");
      }
    } catch {
      setStatus("error");
      setSubmitError("Failed to send message. Please try again or email us directly.");
    }
  };

  const handleFieldChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
    // Reset submit error when user modifies form
    if (submitError) {
      setSubmitError(null);
    }
  };

  const isSubmitting = status === "submitting";

  return (
    <>
      {/* Section 1: Hero - Asymmetric, left-aligned */}
      <section className="relative overflow-hidden bg-[var(--background)] py-[var(--space-section)]">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--color-primary-light)]/20 via-transparent to-transparent" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn direction="up">
            <div className="max-w-2xl">
              <span className="inline-block rounded-full bg-[var(--color-primary)]/10 px-4 py-1.5 text-sm font-medium text-[var(--color-primary-dark)]">
                Get in Touch
              </span>
              <h1 className="mt-6 font-display text-[clamp(2.5rem,5vw+1rem,4rem)] font-bold leading-[1.05] tracking-[-0.03em] text-[var(--foreground-heading)]">
                Let&apos;s talk about your{" "}
                <span className="text-[var(--color-primary)]">building</span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-[var(--muted)] sm:text-xl">
                Book a demo or send us a message. We&apos;d love to hear from you.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Section 2: Two Column Layout - Asymmetric */}
      <section className="bg-[var(--background)] pb-[var(--space-section-lg)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left Column - Contact Form (wider) */}
            <FadeIn direction="right" className="lg:col-span-7">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6 shadow-sm sm:p-8">
                <h2 className="font-display text-xl font-semibold text-[var(--foreground)]">
                  Send us a message
                </h2>

                {/* Success message */}
                {status === "success" && (
                  <div
                    className="mt-6 rounded-lg bg-[var(--success)]/10 border border-[var(--success)]/20 p-4"
                    role="alert"
                  >
                    <p className="text-sm font-medium text-[var(--success)]">
                      Message sent successfully!
                    </p>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      We&apos;ll get back to you within 24 hours.
                    </p>
                  </div>
                )}

                {/* Error message */}
                {submitError && (
                  <div
                    className="mt-6 rounded-lg bg-[var(--error)]/10 border border-[var(--error)]/20 p-4"
                    role="alert"
                  >
                    <p className="text-sm font-medium text-[var(--error)]">
                      {submitError}
                    </p>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      You can also reach us at{" "}
                      <a
                        href="mailto:hello@ampenergy.ae"
                        className="text-[var(--color-primary)] hover:underline"
                      >
                        hello@ampenergy.ae
                      </a>
                    </p>
                  </div>
                )}

                <form
                  onSubmit={handleSubmit}
                  className="mt-6 space-y-5"
                  noValidate
                >
                  {/* Honeypot field - hidden from users, catches bots */}
                  <div className="absolute -left-[9999px]" aria-hidden="true">
                    <label htmlFor="website">
                      Website
                      <input
                        type="text"
                        id="website"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        value={formData.website}
                        onChange={(e) => handleFieldChange("website", e.target.value)}
                      />
                    </label>
                  </div>

                  <Input
                    ref={nameInputRef}
                    label="Name"
                    name="name"
                    autoComplete="name"
                    required
                    maxLength={100}
                    value={formData.name}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    placeholder="Your name"
                    error={errors.name}
                    disabled={isSubmitting}
                  />
                  <Input
                    ref={emailInputRef}
                    label="Email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={254}
                    value={formData.email}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                    placeholder="you@company.com"
                    error={errors.email}
                    disabled={isSubmitting}
                    inputMode="email"
                  />
                  <Input
                    label="Company"
                    name="company"
                    autoComplete="organization"
                    maxLength={100}
                    value={formData.company}
                    onChange={(e) => handleFieldChange("company", e.target.value)}
                    placeholder="Your company (optional)"
                    hint="Optional"
                    disabled={isSubmitting}
                  />
                  <Textarea
                    ref={messageInputRef}
                    label="Message"
                    name="message"
                    required
                    maxLength={2000}
                    showCharCount
                    value={formData.message}
                    onChange={(e) => handleFieldChange("message", e.target.value)}
                    placeholder="How can we help?"
                    rows={5}
                    error={errors.message}
                    disabled={isSubmitting}
                    hint="Minimum 10 characters"
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="btn-lift w-full"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </div>
            </FadeIn>

            {/* Right Column - Info (narrower) */}
            <FadeInStagger staggerDelay={0.15} className="lg:col-span-5">
              <div className="space-y-6">
                {/* Book a Demo */}
                <FadeInStaggerItem>
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary-dark)]">
                        <CalendarIcon className="h-6 w-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-display text-lg font-semibold text-[var(--foreground)]">
                          Book a Demo
                        </h3>
                        <p className="mt-1 text-sm text-[var(--muted)]">
                          See how Amp works with your building. Schedule a 30-minute call with our team.
                        </p>
                        <Button asChild variant="secondary" size="sm" className="btn-lift mt-4">
                          <a
                            href="https://calendly.com/tariq-amp/intro-call"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Schedule Demo
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </FadeInStaggerItem>

                {/* Email */}
                <FadeInStaggerItem>
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary-dark)]">
                        <MailIcon className="h-6 w-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-display text-lg font-semibold text-[var(--foreground)]">
                          Email Us
                        </h3>
                        <a
                          href="mailto:hello@ampenergy.ae"
                          className="mt-1 block break-words text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-hover)]"
                        >
                          hello@ampenergy.ae
                        </a>
                      </div>
                    </div>
                  </div>
                </FadeInStaggerItem>

                {/* Location */}
                <FadeInStaggerItem>
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary-dark)]">
                        <MapPinIcon className="h-6 w-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-display text-lg font-semibold text-[var(--foreground)]">
                          Visit Us
                        </h3>
                        <address className="mt-1 text-sm text-[var(--muted)] not-italic">
                          Floor 8, Tower 4
                          <br />
                          One Central, DWTC
                          <br />
                          Dubai, UAE
                        </address>
                      </div>
                    </div>
                  </div>
                </FadeInStaggerItem>
              </div>
            </FadeInStagger>
          </div>
        </div>
      </section>

      {/* Section 3: FAQ - Left-aligned header */}
      <section className="bg-[var(--background-subtle)] py-[var(--space-section-lg)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left - Header */}
            <FadeIn direction="right" className="lg:col-span-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-wider text-[var(--color-primary)]">
                  FAQ
                </p>
                <h2 className="mt-4 font-display text-[var(--text-3xl)] font-bold tracking-tight text-[var(--foreground-heading)]">
                  Common questions
                </h2>
                <p className="mt-4 text-[var(--muted)]">
                  Can&apos;t find your answer? Send us a message or email us directly.
                </p>
              </div>
            </FadeIn>

            {/* Right - Accordion */}
            <FadeIn direction="left" delay={0.2} className="lg:col-span-8">
              <Accordion.Root type="single" collapsible className="space-y-3">
                {faqs.map((faq, index) => (
                  <Accordion.Item
                    key={index}
                    value={`item-${index}`}
                    className="rounded-xl border border-[var(--border)] bg-[var(--background)] overflow-hidden"
                  >
                    <Accordion.Header>
                      <Accordion.Trigger className="group flex w-full items-center justify-between px-6 py-4 text-left text-base font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--background-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]">
                        <span className="min-w-0 flex-1 pr-4">{faq.question}</span>
                        <ChevronDownIcon className="h-5 w-5 shrink-0 text-[var(--muted)] transition-transform duration-200 group-data-[state=open]:rotate-180" />
                      </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content className="accordion-content">
                      <div className="px-6 pb-4 text-[var(--muted)]">
                        {faq.answer}
                      </div>
                    </Accordion.Content>
                  </Accordion.Item>
                ))}
              </Accordion.Root>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}

