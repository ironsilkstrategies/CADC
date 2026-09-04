// app/free-tax-help/page.tsx
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Free Tax Preparation — VITA | CADC Southwest Oklahoma",
  description: "Free federal and state tax preparation for households earning $67,000 or less. CADC VITA volunteers serve 5 counties. Call 580-335-5588 to schedule.",
  keywords: ["free tax preparation Oklahoma", "VITA Southwest Oklahoma", "free tax help Frederick OK", "CADC VITA program"],
  alternates: { canonical: "https://cadcok.org/free-tax-help" },
};

export default function VitaPage() {
  redirect("/?program=tax-help");
}
