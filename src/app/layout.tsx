import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
  preload: true,
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ampenergy.ae";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Amp | Equipment-Level Energy Data for Buildings",
    template: "%s | Amp",
  },
  description:
    "The fastest and most affordable way to get equipment-level energy data from your building. Circuit-level monitoring with ±0.2% accuracy. No BMS required.",
  keywords: [
    "energy monitoring",
    "building energy management",
    "circuit-level monitoring",
    "energy analytics",
    "sustainability",
    "energy efficiency",
    "smart building",
    "energy data",
    "Dubai",
    "UAE",
  ],
  authors: [{ name: "Amp Inc." }],
  creator: "Amp Inc.",
  publisher: "Amp Inc.",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Amp",
    title: "Amp | Equipment-Level Energy Data for Buildings",
    description:
      "The fastest and most affordable way to get equipment-level energy data from your building. Circuit-level monitoring with ±0.2% accuracy.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Amp - Equipment-Level Energy Data",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Amp | Equipment-Level Energy Data for Buildings",
    description:
      "The fastest and most affordable way to get equipment-level energy data from your building.",
    images: ["/images/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add these when you have the verification codes
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
};

// JSON-LD Organization Schema
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Amp",
  legalName: "Amp Inc.",
  url: siteUrl,
  logo: `${siteUrl}/images/amp-logo.svg`,
  description:
    "Amp provides equipment-level energy monitoring for commercial buildings. Circuit-level data with ±0.2% accuracy, no BMS required.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Floor 8, Tower 4, One Central, DWTC",
    addressLocality: "Dubai",
    addressCountry: "UAE",
  },
  contactPoint: {
    "@type": "ContactPoint",
    email: "hello@ampenergy.ae",
    contactType: "sales",
  },
  sameAs: ["https://www.linkedin.com/company/amp-ai/"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} antialiased`}
      >
        {/* Skip to content link for accessibility */}
        <a
          href="#main-content"
          className="skip-link"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
