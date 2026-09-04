// app/senior-nutrition/page.tsx
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Senior Nutrition Program | CADC Southwest Oklahoma",
  description: "Hot congregate meals and home-delivered meals for seniors in Southwest Oklahoma. 6 dining sites in Frederick, Ryan, Ringling, Temple, Cache, and Waters.",
  keywords: ["senior meals Oklahoma", "senior nutrition Tillman County", "congregate meals Frederick OK", "home delivered meals seniors Oklahoma"],
  alternates: { canonical: "https://cadcok.org/senior-nutrition" },
};

export default function SeniorNutritionPage() {
  redirect("/?program=senior-meals");
}
