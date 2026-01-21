"use client";

import Link from "next/link";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { MenuIcon, CloseIcon } from "@/components/icons";

const navLinks = [
  { href: "/product", label: "Product" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md will-change-transform">
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center transition-opacity hover:opacity-80"
        >
          <Image
            src="/images/amp-logo.svg"
            alt="Amp"
            width={120}
            height={40}
            priority
            style={{ height: '40px', width: 'auto' }}
          />
        </Link>

        {/* Desktop Navigation - min-h-[44px] for WCAG touch target compliance */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link rounded-md px-3 py-2 min-h-[44px] flex items-center text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--color-primary-dark)]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <a
            href="https://calendly.com/tariq-amp/intro-call"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-lift inline-flex h-9 items-center justify-center rounded-full bg-[var(--color-btn-primary)] px-5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-btn-primary-hover)]"
          >
            Book a Demo
          </a>
        </div>

        {/* Mobile Menu */}
        <Dialog.Root open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <Dialog.Trigger asChild>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-md text-[var(--muted)] transition-colors hover:bg-[var(--border)] hover:text-[var(--foreground)] md:hidden"
              aria-label="Open menu"
            >
              <MenuIcon className="h-5 w-5" />
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
            <Dialog.Content
              className="fixed inset-x-4 top-4 z-50 rounded-xl border border-[var(--border)] bg-[var(--background)] p-6 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
              aria-describedby={undefined}
            >
              <div className="flex items-center justify-between">
                <Dialog.Title asChild>
                  <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                    <Image
                      src="/images/amp-logo.svg"
                      alt="Amp"
                      width={100}
                      height={33}
                      style={{ height: '33px', width: 'auto' }}
                    />
                  </Link>
                </Dialog.Title>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-md text-[var(--muted)] transition-colors hover:bg-[var(--border)] hover:text-[var(--foreground)]"
                    aria-label="Close menu"
                  >
                    <CloseIcon className="h-5 w-5" />
                  </button>
                </Dialog.Close>
              </div>

              <div className="mt-6 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-md px-3 py-3 min-h-[44px] flex items-center text-base font-medium text-[var(--muted)] transition-colors hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary-dark)]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="mt-6 border-t border-[var(--border)] pt-6">
                <a
                  href="https://calendly.com/tariq-amp/intro-call"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-lift flex h-11 w-full items-center justify-center rounded-full bg-[var(--color-btn-primary)] text-base font-medium text-white transition-colors hover:bg-[var(--color-btn-primary-hover)]"
                >
                  Book a Demo
                </a>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </nav>
    </header>
  );
}

