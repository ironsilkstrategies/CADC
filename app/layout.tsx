import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

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
    "A Community Action Development Corporation serving 9 counties across Southwest Oklahoma — Head Start, Red River Transportation, Weatherization, Senior Nutrition, Tax Help, and more. Helping People. Changing Lives.",
  metadataBase: new URL("https://cadcok.org"),
  openGraph: {
    title: "CADC — Community Action Development Corporation",
    description: "Helping People. Changing Lives. A Community Action Development Corporation serving Southwest Oklahoma.",
    url: "https://cadcok.org",
    siteName: "CADC",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "CADC — Community Action Development Corporation",
    description: "Helping People. Changing Lives. A Community Action Development Corporation serving Southwest Oklahoma.",
  },
};

const VERSION = "v2.33";

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
