// app/weatherization/page.tsx
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Weatherization Assistance Program | CADC Southwest Oklahoma",
  description: "Free home weatherization for income-eligible households in 17 Oklahoma counties. Priority for elderly, disabled, and families with children. Call 580-335-5588.",
  keywords: ["weatherization Oklahoma", "weatherization assistance Southwest Oklahoma", "WAP Oklahoma", "free home repair Oklahoma", "energy assistance Oklahoma"],
  alternates: { canonical: "https://cadcok.org/weatherization" },
};

export default function WeatherizationPage() {
  redirect("/?program=weatherization");
}
