// app/about/layout.tsx
// Server component wrapper — exports metadata for the about page.
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About CADC | Community Action Development Corporation",
  description:
    "Since 1966, CADC has served Southwest Oklahoma families — Head Start, transportation, weatherization, nutrition, and more across 9 counties.",
  openGraph: {
    title: "About CADC | Community Action Development Corporation",
    description: "Helping People. Changing Lives. Southwest Oklahoma's community action agency since 1966.",
    url: "https://cadcok.org/about",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
