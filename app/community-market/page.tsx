// app/community-market/page.tsx
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Community Market | CADC Southwest Oklahoma",
  description: "CADC Community Market brings fresh food and essential goods to communities across Southwest Oklahoma. Check the schedule for stops in your area.",
  keywords: ["community market Oklahoma", "CADC market", "mobile food market Southwest Oklahoma", "fresh food rural Oklahoma"],
  alternates: { canonical: "https://cadcok.org/community-market" },
};

export default function CommunityMarketPage() {
  redirect("/?program=market");
}
