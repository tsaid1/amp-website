import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Dubai-Based Building Energy Intelligence",
  description:
    "Amp helps businesses in the UAE and beyond cut energy waste with plug & play hardware and AI analytics. Trusted by Amazon, IKEA & Masdar. Learn our story.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Us | Dubai-Based Building Energy Intelligence",
    description:
      "Amp helps businesses cut energy waste with plug & play hardware and AI analytics. Trusted by Amazon, IKEA & Masdar.",
    type: "website",
    url: "https://www.ampenergy.ae/about",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Dubai-Based Building Energy Intelligence",
    description:
      "Amp helps businesses cut energy waste with plug & play hardware and AI analytics. Trusted by Amazon, IKEA & Masdar.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
