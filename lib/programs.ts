/**
 * The CADC programs — single source of truth.
 * Drives: orbit intro, program grid, header nav, footer, sitemap, routing.
 *
 * CONFIRMED BY LESLEA HIXSON (Aug 18 2026):
 * - Base service area is 9 counties
 * - Community Services (CSBG) funding is gone — program removed
 * - Senior Meals: 5 sites (Frederick, Ryan, Ringling, Temple, Cache, Waters)
 * - County-specific coverage varies per program
 */

export type ProgramSlug =
  | "head-start"
  | "transit"
  | "weatherization"
  | "senior-meals"
  | "tax-help"
  | "community-market"
  | "employment"
  | "board";

export interface Program {
  slug: ProgramSlug;
  name: string;
  shortName: string;
  blurb: string;
  icon: string;
  cta?: { label: string; href: string; external?: boolean };
  inOrbit: boolean;
}

export const programs: Program[] = [
  {
    slug: "head-start",
    name: "Head Start & Early Head Start",
    shortName: "Head Start",
    blurb:
      "Free early childhood education at 13 centers across Southwest Oklahoma. " +
      "Serving preschool-age children, plus pregnant women and expectant families.",
    icon: "🏫",
    cta: { label: "Start an application", href: "/programs/head-start#apply" },
    inOrbit: true,
  },
  {
    slug: "transit",
    name: "Red River Transportation",
    shortName: "Red River Transit",
    blurb:
      "Rural public transit with a fleet of 110 vehicles. " +
      "Rides to medical appointments, dialysis, work, and shopping. Every vehicle is lift or ramp equipped.",
    icon: "🚌",
    cta: { label: "Call 1-800-524-5552", href: "tel:+18005245552" },
    inOrbit: true,
  },
  {
    slug: "weatherization",
    name: "Weatherization & Housing",
    shortName: "Weatherization",
    blurb:
      "Free home energy improvements for income-eligible households. " +
      "Funded through the Department of Energy and Oklahoma DHS.",
    icon: "🏠",
    cta: { label: "Apply online", href: "https://ok.mywaplink.org", external: true },
    inOrbit: true,
  },
  {
    slug: "senior-meals",
    name: "Senior Congregate Meals",
    shortName: "Senior Meals",
    blurb:
      "Hot meals and community at 5 sites across Southwest Oklahoma, " +
      "plus Advantage home delivery for older adults who can't travel.",
    icon: "🍽️",
    cta: { label: "Call 580-335-5588", href: "tel:+15803355588" },
    inOrbit: true,
  },
  {
    slug: "tax-help",
    name: "VITA Tax Assistance",
    shortName: "Tax Help",
    blurb:
      "Free tax preparation by IRS-certified volunteers. No cost, no filing fees.",
    icon: "📋",
    inOrbit: true,
  },
  {
    slug: "community-market",
    name: "Community Market",
    shortName: "Community Market",
    blurb:
      "A developing program expanding food access across the region. " +
      "Tell us what your community needs.",
    icon: "🛒",
    cta: {
      label: "Take the Community Needs Survey",
      href: "https://www.surveymonkey.com/r/26cadcneeds",
      external: true,
    },
    inOrbit: true,
  },
  {
    slug: "employment",
    name: "Employment & Workforce",
    shortName: "Employment",
    blurb:
      "Open positions at CADC and workforce support across Southwest Oklahoma.",
    icon: "💼",
    inOrbit: true,
  },
  {
    slug: "board",
    name: "Board & Leadership",
    shortName: "Board & Leaders",
    blurb:
      "Meeting agendas, schedules, governance documents, and Policy Council information.",
    icon: "⚖️",
    inOrbit: true,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const programHref = (slug: ProgramSlug) => `/programs/${slug}`;

export const getProgram = (slug: ProgramSlug): Program | undefined =>
  programs.find((p) => p.slug === slug);

export const orbitPrograms = () => programs.filter((p) => p.inOrbit);

export const allProgramSlugs = () => programs.map((p) => ({ slug: p.slug }));
