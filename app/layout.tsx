import type { Metadata } from "next";
import "./globals.css";
import { CADCJsonLd } from "@/components/CADCJsonLd";

export const metadata: Metadata = {
  title: "CADC — Community Action Development Corporation",
  description:
    "Community Action Development Corporation serves families across Southwest Oklahoma with Head Start, Red River Transportation, Weatherization, Senior Nutrition, Advantage meals and the Community Market. Helping People. Changing Lives.",
  metadataBase: new URL("https://cadcok.org"),
  openGraph: {
    title: "CADC — Community Action Development Corporation",
    description: "Helping People. Changing Lives. Head Start, Transit, Weatherization, Senior Meals and more across Southwest Oklahoma.",
    url: "https://cadcok.org",
    siteName: "CADC — Community Action Development Corporation",
    locale: "en_US",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "CADC — Helping People. Changing Lives. Services for families across Southwest Oklahoma" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CADC — Community Action Development Corporation",
    description: "Helping People. Changing Lives. Head Start, Transit, Weatherization, Senior Meals and more across Southwest Oklahoma.",
    images: ["/og-image.jpg"],
  },
};

const VERSION = "v2.40";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Fonts loaded at runtime (next/font/google fails on Vercel builds) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" />
        <CADCJsonLd />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        {children}
        {/* Build watermark — hidden from users */}
        <div
          aria-hidden="true"
          style={{
            position: "fixed", bottom: 8, right: 10, zIndex: 9999,
            fontSize: "9px", fontFamily: "monospace", fontVariantNumeric: "tabular-nums",
            color: "rgba(128,128,128,0.35)", pointerEvents: "none", userSelect: "none",
            letterSpacing: "0.05em",
          }}
        >
          {VERSION}
        </div>
      </body>
    </html>
  );
}
