// ─── CADC Site CMS — content model ──────────────────────────────────────────
export interface Meal { headline: string; full: string[] }
export interface MarketStop { time: string; location: string }
export interface StaffMember { name: string; title: string; phone?: string; email?: string }
export interface PublicDoc { label: string; href: string }

export interface IntakeLead {
  id: string; ts: string; program: string; county?: string;
  name?: string; phone?: string; email?: string; step: string;
  notes?: string; status: "new" | "contacted" | "enrolled" | "ineligible" | "closed";
}

export interface SiteStats {
  programTaps: Record<string, number>;
  countyViews: Record<string, number>;
  searchTerms: Record<string, number>;
  weeklyVisits: number;
  lastReset: string;
}

export interface VolunteerEntry {
  id: string; ts: string; volunteerName: string; supervisorName: string;
  program: string; center: string; date: string; hours: number;
  type: "volunteer" | "in-kind-space" | "in-kind-services" | "public-school-collab";
  description?: string;
}

export interface TransitBooking {
  id: string; ts: string; name: string; phone: string;
  pickupAddress: string; destination: string;
  requestedDate: string; requestedTime: string;
  accessibility: string; status: "new" | "confirmed" | "completed" | "cancelled";
  notes?: string;
}

export interface ScheduledItem {
  id: string; title: string;
  section: "announcement" | "seniorMenu" | "marketSchedule" | "staff" | "documents" | "boardDocs";
  publishAt: string; expiresAt?: string; payload: unknown;
  status: "scheduled" | "published" | "expired" | "cancelled";
  createdBy: string; createdAt: string;
}

export interface BoardDoc {
  id: string; title: string;
  category: "agenda" | "minutes" | "resolution" | "policy-council" | "annual-report" | "other";
  date: string; href: string; uploadedBy: string; uploadedAt: string;
}

// ─── Feature flags ────────────────────────────────────────────────────────────
// All features default OFF. Toggle from /admin → ⚡ Features tab.
// CONTRACT SCOPE (base $2,995 — always available):
//   None of the below — base site content is always on.
// AMENDMENT SCOPE (premium — toggle on when deal signed):
//   transitBooking, intakeLeads, volunteerLog, spanishToggle,
//   faqAccordion, boardPortal, contentScheduling, grantPdf
export interface SiteFeatures {
  // ── Base site features (can be toggled for operational reasons) ──
  spanishToggle: boolean;      // ES/EN language toggle in header

  // ── Amendment scope — off until contract signed ───────────────
  transitBooking: boolean;     // online ride request form (Transit → Schedule)
  intakeLeads: boolean;        // follow-up capture on eligibility pages
  volunteerLog: boolean;       // public volunteer hour submission (Head Start)
  faqAccordion: boolean;       // Head Start FAQ section (Robin requested)
  boardPortal: boolean;        // Board Documents portal (Tiffany uploads)
  contentScheduling: boolean;  // scheduled content publishing system
  grantPdf: boolean;           // quarterly grant impact PDF generator

  // ── Forms & Intake — off until ready ─────────────────────────────────────
  formServiceScreener: boolean;        // Universal "Find Your Benefits" screener
  formHeadStartPreEnroll: boolean;     // Head Start pre-enrollment interest form
  formWeatherizationInterest: boolean; // Weatherization interest/waitlist form
  formVitaAppointment: boolean;        // VITA tax appointment request form
  formVolunteerInterest: boolean;      // Volunteer interest & availability form
  formCommunityNeeds: boolean;         // Community needs survey (quarterly)
}

// ─── Site-wide text fields ────────────────────────────────────────────────────
// Strings that were hardcoded in TSX — now admin-editable without a deploy.
// Edited via /admin → Content → Site Text tab.
export interface SiteText {
  footerTagline: string;        // "Helping People. Changing Lives. Serving Southwest Oklahoma since 1966."
  surveyBannerText: string;     // "2026 Community Needs Survey — Make Your Voice Heard →"
  surveyUrl: string;            // SurveyMonkey or other survey link
  mainPhone: string;            // "580-335-5588" — main CADC line shown in header/footer
  headOfficeAddress: string;    // "105 S. Main Street · P.O. Box 989\nFrederick, OK 73542"
  facebookUrl: string;
  instagramUrl: string;
}

export const DEFAULT_SITE_TEXT: SiteText = {
  footerTagline:    "Helping People. Changing Lives.\nServing Southwest Oklahoma since 1966.",
  surveyBannerText: "2026 Community Needs Survey — Make Your Voice Heard →",
  surveyUrl:        "https://www.surveymonkey.com/r/26cadcneeds",
  mainPhone:        "580-335-5588",
  headOfficeAddress:"105 S. Main Street · P.O. Box 989\nFrederick, OK 73542",
  facebookUrl:      "https://www.facebook.com/share/1Ei1cCmz46/?mibextid=wwXIfr",
  instagramUrl:     "https://www.instagram.com/wearecadc",
};

// Program taglines — one per orbit node. Editable without a code deploy.
// Keys match ProgramData.slug in CADCOrbitSite.tsx.
export const DEFAULT_PROGRAM_TAGLINES: Record<string, string> = {
  "head-start":          "Free early childhood education across 11 centers",
  "transit":             "220,175 passenger trips · 1.5M revenue miles · 12 counties",
  "weatherization":      "Free home energy improvements for qualifying households",
  "senior-nutrition":    "28,827 congregate meals · 24,485 home-delivered · 327 clients served in 2025",
  "community-market":    "Fresh, affordable groceries brought directly to your community",
  "tax-help":            "Free IRS-certified tax prep — no cost, no fees",
  "employment":          "Join the CADC team across Southwest Oklahoma",
  "board":               "Governance, Policy Council, and agency leadership",
  "advantage":           "Home-delivered meals for seniors & adults with disabilities",
};

export interface SiteContent {
  updatedAt: string;
  updatedBy: string;
  announcement: { enabled: boolean; text: string; href?: string; type?: "info" | "urgent" | "closed" };
  features: SiteFeatures;
  seniorMenu: { month: string; year: number; note: string; meals: Record<string, Meal> };
  marketSchedule: { month: string; year: number; note: string; transportation: string; stops: Record<string, MarketStop[]> };
  staff: StaffMember[];
  documents: PublicDoc[];
  boardDocs: BoardDoc[];
  siteText: SiteText;
  programTaglines: Record<string, string>;
}

// ─── KV Keys ─────────────────────────────────────────────────────────────────
export const CMS_KEY             = "cadc:content";
export const CMS_KEY_ES          = "cadc:content:es";          // Gemini-translated Spanish version
export const CONTENT_BLOCKS_KEY  = "cadc:content-blocks";
export const CONTENT_BLOCKS_KEY_ES = "cadc:content-blocks:es"; // Spanish content block overrides
export const LEADS_KEY           = "cadc:leads";
export const STATS_KEY           = "cadc:stats";
export const VOLUNTEER_KEY       = "cadc:volunteer";
export const BOOKINGS_KEY        = "cadc:bookings";
export const SCHEDULE_KEY        = "cadc:schedule";
export const MEDIA_KEY           = "cadc:media";
export const ARCHIVE_KEY         = "cadc:archive";

export const DEFAULT_CONTENT: SiteContent = {
  updatedAt: "2026-09-01T00:00:00.000Z",
  updatedBy: "seed",
  announcement: { enabled: false, text: "", href: "", type: "info" },
  features: {
    spanishToggle:     false,
    transitBooking:    false,
    intakeLeads:       false,
    volunteerLog:      false,
    faqAccordion:      false,
    boardPortal:       false,
    contentScheduling: false,
    grantPdf:          false,
    formServiceScreener:        false,
    formHeadStartPreEnroll:     false,
    formWeatherizationInterest: false,
    formVitaAppointment:        false,
    formVolunteerInterest:      false,
    formCommunityNeeds:         false,
  },
  boardDocs: [],
  seniorMenu: {
    month: "September", year: 2026,
    note: "8 oz milk served daily at all congregate sites",
    meals: {
      "2026-09-01": { headline: "Mexican Casserole", full: ["Mexican Casserole","Tex Mex Rice","Ranch Beans","Chips","Brownie"] },
      "2026-09-02": { headline: "Baked Rigatoni", full: ["Baked Rigatoni","Corn","Green Beans","Garlic Bread","Applesauce"] },
      "2026-09-03": { headline: "Chicken Pasta", full: ["Chicken Pasta","Pickled Beets","Mandarin Oranges","Crackers","Cake w/ Icing"] },
      "2026-09-04": { headline: "Chicken Fried Steak", full: ["Chicken Fried Steak","Mashed Potatoes w/ Gravy","Peas & Carrots","Sliced Bread","Fruit"] },
      "2026-09-07": { headline: "Breakfast Casserole", full: ["Breakfast Casserole","Hash Brown Patty","Biscuit w/ Gravy","Sliced Pears","Cottage Cheese"] },
      "2026-09-08": { headline: "Taco Spud", full: ["Taco Spud","Baked Potato","Mixed Veggies","Dinner Roll","Pudding Pan Pie"] },
      "2026-09-09": { headline: "BBQ Pork", full: ["BBQ Pork on Bun","Baked Beans","Potato Salad","No Bake Cookie"] },
      "2026-09-10": { headline: "Brown Beans w/ Ham", full: ["Brown Beans w/ Ham","Oven Fried Potatoes","Zucchini/Tomatoes","Cornbread","Cobbler"] },
      "2026-09-11": { headline: "Meatloaf", full: ["Meatloaf","Mashed Potatoes w/ Gravy","Cali Mix","Fruit","Dinner Roll"] },
      "2026-09-14": { headline: "Cajun Pork Chop", full: ["Cajun Pork Chop","Potato Casserole","Baked Beans","Sliced Bread","Mandarin Orange Salad"] },
      "2026-09-15": { headline: "Chicken Teriyaki", full: ["Chicken Teriyaki","Broccoli","Carrots","Rice Pilaf","Pineapple","Upside-Down Cake"] },
      "2026-09-16": { headline: "Pimento Cheese", full: ["Pimento Cheese","Vegetable Soup","Crackers","Pears w/ Cottage Cheese","Cake w/ Frosting"] },
      "2026-09-17": { headline: "Sliced Turkey", full: ["Sliced Turkey on Bun","Tomato Soup","Diced Peaches","Peanut Butter Bar"] },
      "2026-09-18": { headline: "Salisbury Steak", full: ["Salisbury Steak","Mashed Potatoes w/ Gravy","Green Beans","Dinner Roll","Butterscotch Fluff"] },
      "2026-09-21": { headline: "Chicken Parmesan", full: ["Chicken Parmesan","Spaghetti Noodles","Carrots","Broccoli","Garlic Bread","Pan Pie"] },
      "2026-09-22": { headline: "Tuna Salad", full: ["Tuna Salad on Croissant","Pickled Beets","Diced Peaches","Macaroni Salad","Cookie Bar"] },
      "2026-09-23": { headline: "Sausage Gravy", full: ["Sausage Gravy w/ Biscuit","Zucchini/Tomatoes","Fruit Salad"] },
      "2026-09-24": { headline: "Fried Fish", full: ["Fried Fish","Potato Wedges","Cole Slaw","Hush Puppies","Poke Cake"] },
      "2026-09-25": { headline: "Meatloaf", full: ["Meatloaf","Mashed Potatoes w/ Gravy","Green Beans","Dinner Roll","Pear Crisp"] },
      "2026-09-28": { headline: "Pulled Pork", full: ["Pulled Pork","Baked Potato","Mixed Vegetables","Sliced Bread","Cookies"] },
      "2026-09-29": { headline: "Chicken Salad", full: ["Chicken Salad","Cottage Cheese","Pickled Beets","Crackers","Fruit Salad","Simply Super Cake"] },
      "2026-09-30": { headline: "Chicken & Noodles", full: ["Chicken & Noodles","Carrots","Peas","Applesauce"] },
    },
  },
  marketSchedule: {
    month: "September", year: 2026,
    note: "Temporarily starting earlier due to extreme heat. Regular hours return in October.",
    transportation: "Need a ride? Call or text 580-374-5518",
    stops: {
      "2026-09-01": [{ time: "9:30–11:30", location: "Mt. View" }, { time: "1:30–3:30", location: "Corn" }],
      "2026-09-02": [{ time: "9:30–11:30", location: "Burns Flat" }, { time: "1:00–3:30", location: "Sentinel" }],
      "2026-09-03": [{ time: "9:00–12:00", location: "Grandfield" }, { time: "2:00–4:30", location: "Tipton" }],
      "2026-09-04": [{ time: "10:30–12:00", location: "Ringling" }, { time: "2:00–3:30", location: "Ryan" }],
      "2026-09-08": [{ time: "9:00–12:00", location: "Geronimo" }, { time: "1:30–4:00", location: "Chattanooga" }],
      "2026-09-09": [{ time: "9:30–11:30", location: "Lawton — 509 Woodridge Dr." }, { time: "1:30–3:30", location: "Cache" }],
      "2026-09-10": [{ time: "10:30–12:00", location: "Erick" }, { time: "2:00–3:30", location: "Lone Wolf" }],
      "2026-09-11": [{ time: "10:30–12:00", location: "Hammon" }, { time: "1:30–3:00", location: "Canute" }],
      "2026-09-14": [{ time: "9:00–11:00", location: "Randlett" }, { time: "1:00–3:30", location: "Temple" }],
      "2026-09-15": [{ time: "9:30–11:30", location: "Mt. View" }, { time: "1:30–3:30", location: "Corn" }],
      "2026-09-16": [{ time: "9:30–11:30", location: "Burns Flat" }, { time: "1:00–3:30", location: "Sentinel" }],
      "2026-09-17": [{ time: "9:00–12:00", location: "Grandfield" }, { time: "2:00–4:30", location: "Tipton" }],
      "2026-09-18": [{ time: "10:30–12:00", location: "Ringling" }, { time: "2:00–3:30", location: "Ryan" }],
      "2026-09-21": [{ time: "9:30–11:30", location: "Sterling" }, { time: "1:00–3:00", location: "Fletcher" }],
      "2026-09-22": [{ time: "9:00–12:00", location: "Geronimo" }, { time: "1:30–4:00", location: "Chattanooga" }],
      "2026-09-23": [{ time: "9:30–11:30", location: "Lawton — Benjamin Davis HR" }, { time: "1:30–3:30", location: "Cache" }],
      "2026-09-24": [{ time: "10:30–12:00", location: "Erick" }, { time: "2:00–3:30", location: "Lone Wolf" }],
      "2026-09-25": [{ time: "10:30–12:00", location: "Hammon" }, { time: "1:30–3:00", location: "Canute" }],
      "2026-09-28": [{ time: "9:30–11:00", location: "Valley Community S.C. — Lawton" }, { time: "1:00–3:30", location: "Temple" }],
      "2026-09-29": [{ time: "9:30–11:30", location: "Mt. View" }, { time: "1:30–3:30", location: "Corn" }],
      "2026-09-30": [{ time: "9:30–11:30", location: "Burns Flat" }, { time: "1:00–3:30", location: "Sentinel" }],
    },
  },
  staff: [
    { name: "Leslea Hixson",   title: "Executive Director",                         phone: "580-335-5588" },
    { name: "Robin Harris",    title: "Director, Head Start & Early Head Start",     phone: "580-726-3343", email: "rharris@cadcok.org" },
    { name: "Gilbert Nuncio",  title: "Director, Red River Transportation",          phone: "580-335-2691" },
    { name: "Robert Meador",   title: "Director, Weatherization & Housing",          phone: "580-305-0853" },
    { name: "Laura Vardell",   title: "Director, Senior Nutrition",                  phone: "580-335-5588" },
    { name: "Scott Fraley",    title: "Director, Community Market",                  phone: "580-305-1964", email: "SFraley@cadcok.org" },
    { name: "Kristie Jackson", title: "Director, Advantage Home Delivered Meals",    phone: "580-393-2216" },
  ],
  documents: [
    { label: "Title VI Policy (Red River Transportation)", href: "/documents/title-vi-policy.pdf" },
    { label: "Affirmative Action Plan 2023",               href: "/documents/affirmative-action-plan-2023.pdf" },
    { label: "Annual Report 2025",                         href: "/documents/annual-report-2025.pdf" },
    { label: "Federal Program Disclosures",                href: "/documents/federal-disclosures.pdf" },
  ],
  siteText: DEFAULT_SITE_TEXT,
  programTaglines: DEFAULT_PROGRAM_TAGLINES,
};

// ─── Fetch helpers ────────────────────────────────────────────────────────────

export async function fetchContent(): Promise<SiteContent> {
  try {
    const r = await fetch("/api/cms", { cache: "no-store" });
    if (!r.ok) return DEFAULT_CONTENT;
    const j = await r.json();
    return { ...DEFAULT_CONTENT, ...j, features: { ...DEFAULT_CONTENT.features, ...(j.features ?? {}) } };
  } catch { return DEFAULT_CONTENT; }
}

// Fetches the Gemini-translated Spanish version from KV.
// Returns null if no Spanish version has been generated yet
// (admin hasn't saved with spanishToggle on, or Gemini hasn't run).
// The public site falls back to English in that case — never breaks.
export async function fetchContentEs(): Promise<SiteContent | null> {
  try {
    const r = await fetch("/api/cms?lang=es", { cache: "no-store" });
    if (!r.ok) return null;
    const j = await r.json();
    // API returns { es: false } when KV has no Spanish version yet
    if (j?.es === false) return null;
    return { ...DEFAULT_CONTENT, ...j, features: { ...DEFAULT_CONTENT.features, ...(j.features ?? {}) } };
  } catch { return null; }
}

export async function fetchLeads(adminKey: string): Promise<IntakeLead[]> {
  try { const r = await fetch("/api/cms/leads", { headers: { "x-admin-key": adminKey }, cache: "no-store" }); if (!r.ok) return []; return r.json(); } catch { return []; }
}
export async function fetchStats(adminKey: string): Promise<SiteStats | null> {
  try { const r = await fetch("/api/cms/stats", { headers: { "x-admin-key": adminKey }, cache: "no-store" }); if (!r.ok) return null; return r.json(); } catch { return null; }
}
export async function fetchVolunteer(adminKey: string): Promise<VolunteerEntry[]> {
  try { const r = await fetch("/api/cms/volunteer", { headers: { "x-admin-key": adminKey }, cache: "no-store" }); if (!r.ok) return []; return r.json(); } catch { return []; }
}
export async function fetchBookings(adminKey: string): Promise<TransitBooking[]> {
  try { const r = await fetch("/api/cms/bookings", { headers: { "x-admin-key": adminKey }, cache: "no-store" }); if (!r.ok) return []; return r.json(); } catch { return []; }
}
export async function fetchSchedule(adminKey: string): Promise<ScheduledItem[]> {
  try { const r = await fetch("/api/cms/schedule", { headers: { "x-admin-key": adminKey }, cache: "no-store" }); if (!r.ok) return []; return r.json(); } catch { return []; }
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── MEDIA LIBRARY & ARCHIVE SYSTEM (site-builder admin) ───────────────────
// ═══════════════════════════════════════════════════════════════════════════

export interface MediaAsset {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  kind: "image" | "document" | "other";
  tags: string[];
  altText?: string;
  uploadedBy: string;
  uploadedAt: string;
  aiSuggestion?: {
    contentType: string;
    targetSection: string;
    confidence: "high" | "medium" | "low";
    reasoning: string;
    extractedData?: Record<string, unknown>;
  };
  archivedAt?: string;
}

export interface ArchivedItem {
  id: string;
  section: string;
  originalId: string;
  label: string;
  payload: unknown;
  archivedAt: string;
  archivedBy: string;
}

export interface ContentBlock {
  id: string;
  section: string;
  label: string;
  type: "text" | "richtext" | "image" | "stat";
  value: string;
  updatedAt: string;
  updatedBy: string;
}

export async function fetchMedia(adminKey: string): Promise<MediaAsset[]> {
  try { const r = await fetch("/api/cms/media", { headers: { "x-admin-key": adminKey }, cache: "no-store" }); if (!r.ok) return []; return r.json(); } catch { return []; }
}
export async function fetchArchive(adminKey: string): Promise<ArchivedItem[]> {
  try { const r = await fetch("/api/cms/archive", { headers: { "x-admin-key": adminKey }, cache: "no-store" }); if (!r.ok) return []; return r.json(); } catch { return []; }
}
export async function fetchContentBlocks(adminKey: string): Promise<ContentBlock[]> {
  try { const r = await fetch("/api/cms/content-blocks", { headers: { "x-admin-key": adminKey }, cache: "no-store" }); if (!r.ok) return []; return r.json(); } catch { return []; }
}
