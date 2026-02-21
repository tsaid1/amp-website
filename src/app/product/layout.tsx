import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Energy Monitoring Platform & Hardware | Circuit-Level Building Analytics",
  description:
    "Monitor every circuit and piece of equipment in your building. AI-powered savings recommendations, real-time alerts & automated reports. See pricing.",
  openGraph: {
    title: "Energy Monitoring Platform & Hardware | Circuit-Level Analytics",
    description:
      "Monitor every circuit and piece of equipment in your building. AI-powered savings, real-time alerts & automated reports.",
    type: "website",
    url: "https://www.ampenergy.ae/product",
  },
  twitter: {
    card: "summary_large_image",
    title: "Energy Monitoring Platform & Hardware | Circuit-Level Analytics",
    description:
      "Monitor every circuit and piece of equipment in your building. AI-powered savings, real-time alerts & automated reports.",
  },
};

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
