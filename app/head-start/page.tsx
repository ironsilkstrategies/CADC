// app/head-start/page.tsx
// Static SEO page — Google indexes this. Orbit deep-links into it.
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Head Start & Early Head Start | CADC — Southwest Oklahoma",
  description: "Free early childhood education for income-eligible families in Southwest Oklahoma. 11 centers, children birth–age 5. Apply online or call 580-726-3343.",
  keywords: ["Head Start Oklahoma", "Head Start Frederick OK", "Head Start Hobart OK", "Early Head Start Southwest Oklahoma", "free preschool Oklahoma", "CADC Head Start"],
  openGraph: { title: "Head Start | CADC", description: "Free early education for SW Oklahoma families.", url: "https://cadcok.org/head-start" },
  alternates: { canonical: "https://cadcok.org/head-start" },
};

export default function HeadStartPage() {
  redirect("/?program=head-start");
}
