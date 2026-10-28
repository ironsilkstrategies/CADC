import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { CADCJsonLd } from "@/components/CADCJsonLd";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

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

const VERSION = "v2.34";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <head>
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
