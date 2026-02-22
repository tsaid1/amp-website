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

export const metadata: Metadata = {
  metadataBase: new URL("https://ampenergy.ae"),
  title: {
    default: "Amp Energy | Your Building's Energy Platform",
    template: "%s | Amp",
  },
  description:
    "The fastest way to get energy data from your building. Real-time, equipment-level visibility. No BMS required.",
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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Amp Energy | Your Building's Energy Platform",
    description:
      "The fastest way to get energy data from your building. Real-time, equipment-level visibility. No BMS required.",
    url: "https://ampenergy.ae",
    siteName: "Amp Energy",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Amp Energy - Equipment-Level Energy Intelligence for Buildings",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Amp Energy | Your Building's Energy Platform",
    description:
      "The fastest way to get energy data from your building. No BMS required.",
    images: ["/images/og-image.jpg"],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Amp",
              url: "https://ampenergy.ae",
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Amp Energy",
              url: "https://ampenergy.ae",
              logo: "https://ampenergy.ae/images/amp-logo.svg",
              contactPoint: {
                "@type": "ContactPoint",
                email: "hello@ampenergy.ae",
                contactType: "sales",
              },
              address: {
                "@type": "PostalAddress",
                streetAddress: "Floor 8, Tower 4, One Central, DWTC",
                addressLocality: "Dubai",
                addressCountry: "AE",
              },
              sameAs: ["https://linkedin.com/company/amp-ai/"],
            }),
          }}
        />
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
