import Link from "next/link";
import Image from "next/image";
import { LinkedInIcon } from "@/components/icons";

const productLinks = [
  { href: "/product", label: "Platform" },
  { href: "/product?tab=hub", label: "Hardware" },
  { href: "/product#pricing", label: "Pricing" },
];

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy Policy" },
];

export function Footer() {
  return (
    <footer className="relative bg-[var(--section-dark-bg)] border-gradient-top">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Logo & Tagline */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="inline-block logo-glow"
            >
              <Image
                src="/images/amp-logo.svg"
                alt="Amp"
                width={100}
                height={33}
                style={{ height: "33px", width: "auto" }}
              />
            </Link>
            <p className="mt-6 text-sm text-[var(--section-dark-text-muted)] max-w-xs leading-relaxed">
              The fastest way to get energy data from your building.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-display text-sm font-semibold text-[var(--section-dark-heading)]">
              Product
            </h3>
            <ul className="mt-4 -mx-2 space-y-1">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block px-2 py-2 min-h-[44px] flex items-center text-sm text-[var(--section-dark-text-muted)] transition-colors hover:text-[var(--color-primary)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-display text-sm font-semibold text-[var(--section-dark-heading)]">
              Company
            </h3>
            <ul className="mt-4 -mx-2 space-y-1">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block px-2 py-2 min-h-[44px] flex items-center text-sm text-[var(--section-dark-text-muted)] transition-colors hover:text-[var(--color-primary)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display text-sm font-semibold text-[var(--section-dark-heading)]">
              Contact
            </h3>
            <div className="mt-6 space-y-4">
              <a
                href="mailto:hello@ampenergy.ae"
                className="block text-sm text-[var(--section-dark-text-muted)] transition-colors hover:text-[var(--color-primary)]"
              >
                hello@ampenergy.ae
              </a>
              <address className="text-sm text-[var(--section-dark-text-muted)] not-italic leading-relaxed">
                Floor 8, Tower 4
                <br />
                One Central, DWTC
                <br />
                Dubai, UAE
              </address>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-[var(--section-dark-border)] py-6 sm:flex-row">
          <p className="text-sm text-[var(--section-dark-text-muted)]">© 2026 Amp Inc.</p>

          <div className="flex items-center gap-2">
            <Link
              href="/privacy"
              className="px-3 py-2 min-h-[44px] flex items-center text-sm text-[var(--section-dark-text-muted)] transition-colors hover:text-[var(--color-primary)]"
            >
              Privacy Policy
            </Link>
            <a
              href="https://www.linkedin.com/company/amp-ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--section-dark-text-muted)] transition-colors hover:text-[var(--color-primary)]"
              aria-label="Amp on LinkedIn"
            >
              <LinkedInIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

