import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Community Action Development Corporation | Southwest Oklahoma",
  description:
    "CADC serves 16-17 counties across Southwest Oklahoma with Head Start, transit, weatherization, senior meals, and more. Find your program and get help today.",
};

const VERSION = "v1.25";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            bottom: "14px",
            right: "16px",
            zIndex: 9999,
            fontSize: "0.6rem",
            fontWeight: 600,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--cadc-blue)",
            opacity: 0.32,
            userSelect: "none",
            pointerEvents: "none",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {VERSION}
        </div>
      </body>
    </html>
  );
}
