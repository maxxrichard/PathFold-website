import type { Metadata } from "next";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

export const dynamic = "force-dynamic";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"], display: "swap" });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PathFold – Learning protein folding pathways",
    template: "%s · PathFold",
  },
  description:
    "PathFold is a generative AI framework that learns and predicts how proteins fold and misfold over time, directly from their amino acid sequence. Funded by BMFTR (Zukunft eHealth), coordinated at Universität des Saarlandes.",
  keywords: [
    "PathFold",
    "protein folding",
    "protein misfolding",
    "generative AI",
    "protein language model",
    "neurodegenerative diseases",
    "Alzheimer",
    "Universität des Saarlandes",
    "DFKI",
    "DZNE",
    "BMFTR",
  ],
  openGraph: {
    type: "website",
    siteName: "PathFold",
    title: "PathFold – Learning protein folding pathways",
    description:
      "From sequence to dynamic folding pathways: a generative framework for protein folding and misfolding dynamics.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "PathFold overview" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PathFold – Learning protein folding pathways",
    description: "From sequence to dynamic folding pathways.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${jetbrains.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
