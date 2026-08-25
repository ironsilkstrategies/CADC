import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
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
    "Southwest Oklahoma's community action agency. Serving 9 counties with Head Start, Red River Transportation, Weatherization, Senior Nutrition, Tax Help, and more. Helping People. Changing Lives.",
  metadataBase: new URL("https://cadcok.org"),
  openGraph: {
    title: "CADC — Community Action Development Corporation",
    description: "Helping People. Changing Lives. Southwest Oklahoma's community action agency.",
    url: "https://cadcok.org",
    siteName: "CADC",
    locale: "en_US",
    type: "website",
  },
};

const VERSION = "v2.03";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
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
