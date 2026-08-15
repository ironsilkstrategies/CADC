/**
 * The 9 CADC programs — single source of truth.
 * Drives: orbit intro, program grid, header nav, footer, sitemap, routing.
 *
 * Add a program here and it appears everywhere. Never hardcode a program
 * name or link anywhere else in the app.
 */

export type ProgramSlug =
  | "head-start"
  | "transit"
  | "weatherization"
  | "senior-meals"
  | "community-services"
  | "tax-help"
  | "community-market"
  | "employment"
  | "board";

export interface Program {
  slug: ProgramSlug;
  /** Full name, used in page titles and headings. */
  name: string;
  /** Short label for tight spaces — orbit nodes, nav. */
  shortName: string;
  /** One or two sentences. Plain language, written for the person who needs it. */
  blurb: string;
  /** Emoji placeholder — replace with an SVG icon set before launch. */
  icon: string;
  /** Primary action for this program, if it has one. */
  cta?: { label: string; href: string; external?: boolean };
  /** Show in the orbit intro? All 9 do — equal weight, no hero program. */
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
      "Rural public transit across 16 counties with a fleet of 110 vehicles. " +
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
      "Free home energy improvements for income-eligible households across 17 counties. " +
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
      "Hot meals and community at 14 sites, plus Advantage home delivery for " +
      "older adults who can't travel.",
    icon: "🍽️",
    cta: { label: "Find a meal site", href: "/locations?program=senior-meals" },
    inOrbit: true,
  },
  {
    slug: "community-services",
    name: "Community Services",
    shortName: "Community Svcs",
    blurb:
      "CSBG-funded emergency assistance and referrals for households facing a crisis.",
    icon: "🤝",
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

// ─── Helpers ─────────────────────────────────────────────────────────────────

export const programHref = (slug: ProgramSlug) => `/programs/${slug}`;

export const getProgram = (slug: ProgramSlug): Program | undefined =>
  programs.find((p) => p.slug === slug);

export const orbitPrograms = () => programs.filter((p) => p.inOrbit);

/** For generateStaticParams() on the [slug] route. */
export const allProgramSlugs = () => programs.map((p) => ({ slug: p.slug }));
