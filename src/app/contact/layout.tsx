import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Book a Building Energy Monitoring Demo",
  description:
    "Get in touch with Amp for equipment-level energy monitoring. Based in Dubai, DWTC. Book a demo and get live building data within 24 hours. Contact us today.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us | Book a Building Energy Monitoring Demo",
    description:
      "Get in touch with Amp for equipment-level energy monitoring. Based in Dubai, DWTC. Book a demo and get live data in 24 hours.",
    type: "website",
    url: "https://www.ampenergy.ae/contact",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Book a Building Energy Monitoring Demo",
    description:
      "Get in touch with Amp for equipment-level energy monitoring. Based in Dubai, DWTC. Book a demo and get live data in 24 hours.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
