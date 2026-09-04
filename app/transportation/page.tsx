// app/transportation/page.tsx
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Red River Transportation — Rural Transit | CADC Southwest Oklahoma",
  description: "Rural public transportation serving 12 counties in Southwest Oklahoma. Medical trips, grocery runs, work transportation. Call 580-335-2691 to schedule.",
  keywords: ["public transit Southwest Oklahoma", "rural transportation Oklahoma", "Red River Transportation", "free transportation Beckham County", "medical transportation Frederick OK"],
  alternates: { canonical: "https://cadcok.org/transportation" },
};

export default function TransportationPage() {
  redirect("/?program=transit");
}
