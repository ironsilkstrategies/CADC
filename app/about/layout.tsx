import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About CADC | Community Action Development Corporation",
  description:
    "Since 1966, CADC has served Southwest Oklahoma families — a Community Action Development Corporation delivering Head Start, transportation, weatherization, nutrition, and more across 9 counties.",
  openGraph: {
    title: "About CADC | Community Action Development Corporation",
    description: "Helping People. Changing Lives. A Community Action Development Corporation serving Southwest Oklahoma since 1966.",
    url: "https://cadcok.org/about",
  },
  twitter: {
    card: "summary",
    title: "About CADC | Community Action Development Corporation",
    description: "Helping People. Changing Lives. A Community Action Development Corporation serving Southwest Oklahoma since 1966.",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
