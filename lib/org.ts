/**
 * CADC — organization constants.
 * Single source of truth for identity, contact, compliance, and outbound links.
 *
 * SOURCING NOTE: values marked VERIFY were extracted from the legacy cadcok.org
 * (Wix) and have not yet been confirmed by CADC staff. Confirm before launch.
 */

// ─── Brand tokens (sampled from the official logo artwork) ───────────────────

export const brand = {
  blue: "#0101FF",
  blueDark: "#0000B8",
  blueLight: "#E4E4FF",
  maroon: "#7E0001",
  maroonDark: "#5C0001",
} as const;

// ─── Identity ────────────────────────────────────────────────────────────────

export const org = {
  legalName: "Community Action Development Corporation",
  shortName: "CADC",
  tagline: "Helping People. Changing Lives.",
  serviceAreaLabel: "Serving 9 counties across Southwest Oklahoma",
  domain: "cadcok.org",
} as const;

// ─── Primary contact ─────────────────────────────────────────────────────────

export const contact = {
  /** Main agency line. Legacy site rendered this untappable — always use tel:. */
  mainPhone: "580-335-5588",
  mainPhoneHref: "tel:+15803355588",

  /** Red River Transportation toll-free. */
  transitPhone: "1-800-524-5552",
  transitPhoneHref: "tel:+18005245552",

  address: {
    street: "105 S. Main",
    city: "Frederick",
    state: "OK",
    zip: "73542",
  },

  social: {
    facebook: "https://www.facebook.com/WeAreCADC/",
    instagram: "https://www.instagram.com/wearecadc/",
  },
} as const;

export const addressOneLine =
  `${contact.address.street}, ${contact.address.city}, ${contact.address.state} ${contact.address.zip}`;

// ─── External integrations ───────────────────────────────────────────────────
// These point OFF-SITE and are not ours to redesign or regenerate.
// The ChildPlus token in particular cannot be reconstructed — never edit it.

export const external = {
  /** Head Start / Early Head Start application portal. TOKENIZED — do not alter. */
  childPlusApply:
    "https://www.childplus.net/apply/en-us/A64D6EA2F03A47EEF3D75C9197CE5727/1E6D5387820CDA26B0DE2EDC09C58447",

  /** Weatherization application (DOE/DHS statewide portal). */
  weatherizationApply: "https://ok.mywaplink.org",

  /** CADC Community Needs Survey. */
  communityNeedsSurvey: "https://www.surveymonkey.com/r/26cadcneeds",

  /** Oklahoma Transit Association statewide transit survey. */
  transitSurvey: "https://oktransitplan.metroquest.com/",
} as const;

// ─── Compliance ──────────────────────────────────────────────────────────────
// Legally required. Missing these creates a federal exposure, not a design gap.

/** Required on all Head Start / Early Head Start pages. */
export const headStartGrantNumber = "06CH011161";

export const headStartDisclaimer =
  `This website is supported by Grant Number ${headStartGrantNumber} from the Office of Head Start ` +
  "within the Administration for Children and Families, a division of the U.S. Department of " +
  "Health and Human Services. Neither the Administration for Children and Families nor any of " +
  "its components operate, control, are responsible for, or necessarily endorse this website " +
  "(including, without limitation, its content, technical infrastructure, and policies, and any " +
  "services or tools provided). The opinions, findings, conclusions, and recommendations " +
  "expressed are those of Community Action Development Corporation and do not necessarily " +
  "reflect the views of the Administration for Children and Families and the Office of Head Start.";

export interface ComplianceDoc {
  label: string;
  /** Path on the NEW platform. Files must be re-hosted before DNS cutover. */
  href: string;
  /** Legacy Wix URL — source for migration only. Dies at cutover. */
  legacyHref: string;
  program: "transit" | "head-start" | "agency";
}

/**
 * FTA Title VI + ADA documents. Currently Wix-hosted, which means they BREAK
 * at DNS cutover unless re-uploaded. Migrate these before go-live.
 */
export const complianceDocs: ComplianceDoc[] = [
  {
    label: "Title VI Policy",
    href: "/docs/title-vi-policy.pdf",
    legacyHref:
      "https://www.cadcok.org/_files/ugd/f04cf2_902826dfa9a74dec9b39c51ae394b266.pdf",
    program: "transit",
  },
  {
    label: "Title VI Notice to the Public",
    href: "/docs/title-vi-notice.pdf",
    legacyHref:
      "https://www.cadcok.org/_files/ugd/f04cf2_0d59436d85f54daf9c0cb006dca85e6f.pdf",
    program: "transit",
  },
  {
    label: "Title VI Complaint Form",
    href: "/docs/title-vi-complaint-form.pdf",
    legacyHref:
      "https://www.cadcok.org/_files/ugd/f04cf2_f9eb315a249c40ddae819fd96f838986.pdf",
    program: "transit",
  },
  {
    label: "ADA Policy",
    href: "/docs/ada-policy.pdf",
    legacyHref:
      "https://www.cadcok.org/_files/ugd/f04cf2_9efcac3335d94f5d9313f1b642408bbe.pdf",
    program: "transit",
  },
  {
    label: "2024 Annual Report",
    href: "/docs/annual-report-2024.pdf",
    legacyHref:
      "https://www.cadcok.org/_files/ugd/f04cf2_5cfc2778d2fd422196f04c7a00c92b4c.pdf",
    program: "agency",
  },
];

// ─── Legacy slug → new slug redirect map ─────────────────────────────────────
// Wire these as 301s in next.config.ts before DNS cutover or search ranking is lost.

export const redirects: Record<string, string> = {
  "/discover-more-1": "/programs/head-start",
  "/public-transportation": "/programs/transit",
  "/weatherization": "/programs/weatherization",
  "/senior-congregate-meals": "/programs/senior-meals",
  "/community-services": "/",
  "/taxes": "/programs/tax-help",
  "/copy-of-taxes": "/programs/community-market",
  "/employment-1": "/programs/employment",
  "/events-agenda": "/programs/board",
  "/events-agenda-1": "/programs/board",
  "/find-job": "/programs",
  "/discover-more": "/contact",
  "/about-1": "/about",
};
