// app/advantage-meals/page.tsx
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Advantage Home Delivered Meals | CADC Southwest Oklahoma",
  description: "Frozen home-delivered meals for Oklahoma Medicaid members with disabilities or seniors. 13 counties. 340,830 meals delivered in 2024. Contact your SoonerCare case manager.",
  keywords: ["Advantage meals Oklahoma", "home delivered meals Oklahoma", "Medicaid meals Southwest Oklahoma", "CADC Advantage program"],
  alternates: { canonical: "https://cadcok.org/advantage-meals" },
};

export default function AdvantagePage() {
  redirect("/?program=advantage");
}
