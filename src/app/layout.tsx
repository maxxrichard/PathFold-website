import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SITE_URL } from "@/lib/site";
import { StructuredData } from "@/components/site/StructuredData";

export const dynamic = "force-dynamic";

// General Sans (Indian Type Foundry, Fontshare licence), self-hosted. One family for the whole site.
const generalSans = localFont({
  variable: "--font-general",
  display: "swap",
  src: [
    { path: "../fonts/GeneralSans-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/GeneralSans-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/GeneralSans-600.woff2", weight: "600", style: "normal" },
    { path: "../fonts/GeneralSans-700.woff2", weight: "700", style: "normal" },
  ],
});

const googleVerification = process.env.GOOGLE_SITE_VERIFICATION;

export const viewport: Viewport = {
  themeColor: "#ffffff",
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  ...(googleVerification ? { verification: { google: googleVerification } } : {}),
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  title: {
    default: "PathFold – Learning protein folding pathways",
    template: "%s · PathFold",
  },
  description:
    "PathFold is a generative AI framework that learns and predicts how proteins fold and misfold over time, directly from their amino acid sequence. Funded by BMFTR (Zukunft eHealth), coordinated at Saarland University.",
  keywords: [
    "PathFold",
    "protein folding",
    "protein misfolding",
    "generative AI",
    "protein language model",
    "neurodegenerative diseases",
    "Alzheimer",
    "Saarland University",
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
    <html lang="en" className={`${generalSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <StructuredData />
      </body>
    </html>
  );
}
