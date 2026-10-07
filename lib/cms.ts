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
  instagramUrl:     "",
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
    month: "October", year: 2026,
    note: "8 oz milk served daily at all congregate sites",
    meals: {
      "2026-10-01": { headline: "Ham & Pinto Beans", full: ["Ham & Pinto Beans", "Zucchini/Tomatoes", "Spinach", "Cornbread", "Lemon Pie"] },
      "2026-10-02": { headline: "Sloppy Joes on Bun", full: ["Sloppy Joes on Bun", "Potato Salad", "Baked Beans", "Banana Pudding"] },
      "2026-10-05": { headline: "Ranch Chicken", full: ["Ranch Chicken", "Tossed Salad", "Mexican Corn", "Tortilla Chips", "Rocky Road Pudding"] },
      "2026-10-06": { headline: "Fish on Bun", full: ["Fish on Bun", "Coleslaw", "Potato Wedges", "Cornbread", "Cake"] },
      "2026-10-07": { headline: "Baked Chicken", full: ["Baked Chicken", "Sweet Potato Casserole", "Spinach", "Sliced Bread", "Jell-O w/ Fruit"] },
      "2026-10-08": { headline: "Chef Salad", full: ["Chef Salad", "Diced Peaches", "Crackers", "Cinnamon Roll"] },
      "2026-10-09": { headline: "Meatloaf", full: ["Meatloaf", "Mashed Potatoes w/ Gravy", "Cooked Cabbage", "Roll", "Harvest Bar"] },
      "2026-10-12": { headline: "Chicken Pot Pie", full: ["Chicken Pot Pie", "Harvard Beets", "Fruit Salad"] },
      "2026-10-13": { headline: "Cheeseburger on Bun", full: ["Cheeseburger on Bun", "Pea Salad", "Baked Beans", "Frosted Brownie"] },
      "2026-10-14": { headline: "Scalloped Chicken w/ Gravy", full: ["Scalloped Chicken w/ Gravy", "Sweet Potatoes", "Green Beans", "Dinner Roll"] },
      "2026-10-15": { headline: "Hobo Beans", full: ["Hobo Beans", "Tomato Spoon Relish", "Spinach", "Cornbread", "Crisp"] },
      "2026-10-16": { headline: "Smothered Pork Chop", full: ["Smothered Pork Chop", "Mashed Potatoes w/ Gravy", "California Mix", "Sliced Bread", "Bread Pudding"] },
      "2026-10-19": { headline: "Chicken & Dumplings", full: ["Chicken & Dumplings", "Broccoli", "Carrots", "Dinner Roll", "Spice Cake"] },
      "2026-10-20": { headline: "Loaded Baked Potato", full: ["Loaded Baked Potato", "Vegetable Soup", "Fruit", "Sliced Bread", "Mock Pecan Pie"] },
      "2026-10-21": { headline: "Meatballs w/ Spaghetti", full: ["Meatballs w/ Spaghetti", "Corn", "Green Beans", "Garlic Bread", "Jell-O w/ Fruit"] },
      "2026-10-22": { headline: "Creamy Tacos", full: ["Creamy Tacos", "Tossed Salad", "Peaches", "Tortilla Chips", "2 Cookies"] },
      "2026-10-23": { headline: "Chicken Fried Steak", full: ["Chicken Fried Steak", "Mashed Potatoes w/ Gravy", "Black-Eyed Peas", "Dinner Roll", "Applesauce"] },
      "2026-10-26": { headline: "Beef Stew", full: ["Beef Stew", "Harvard Beets", "Crackers", "Cake w/ Frosting"] },
      "2026-10-27": { headline: "Chicken Tenders", full: ["Chicken Tenders", "Mashed Potatoes w/ Gravy", "Broccoli/Cauliflower", "Sliced Bread", "Butterscotch Pan Pie"] },
      "2026-10-28": { headline: "Egg Omelet", full: ["Egg Omelet", "Hash Brown", "Tomato Spoon Relish", "Biscuit w/ Gravy", "Orange Jell-O"] },
      "2026-10-29": { headline: "Brown Beans w/ Ham", full: ["Brown Beans w/ Ham", "Spinach", "Oven Potatoes", "Cornbread", "Crisp"] },
      "2026-10-30": { headline: "Ribette", full: ["Ribette", "Scalloped Potatoes", "Green Beans", "Dinner Roll", "Cookie Bar"] },
    },
  },
  marketSchedule: {
    month: "October", year: 2026,
    note: "Extended hours this month! Please help us share this schedule at churches, senior centers, and local businesses.",
    transportation: "Need a ride to the market? Call or text 580-374-5518",
    stops: {
      "2026-10-01": [{ time: "11:30 a.m.–2 p.m.", location: "Lawton — Pleasant Valley Community Senior Center, 1130 SW Monroe Ave." }, { time: "2:30–6 p.m.", location: "Lawton — Benjamin O. Davis Highrise, 620 SW E Ave." }],
      "2026-10-02": [{ time: "11:30 a.m.–5:30 p.m.", location: "Corn — Main & Oklahoma" }],
      "2026-10-05": [{ time: "11 a.m.–6 p.m.", location: "Geronimo — 100 Main St. (Senior Citizen Center)" }],
      "2026-10-06": [{ time: "11:30 a.m.–5:30 p.m.", location: "Mt. View — 106 OK-115" }],
      "2026-10-07": [{ time: "11 a.m.–6 p.m.", location: "Cache — City Park, South 8th" }],
      "2026-10-08": [{ time: "12–5 p.m.", location: "Erick — 103 W. 2nd St." }],
      "2026-10-09": [{ time: "11 a.m.–2 p.m.", location: "Eldorado — 700 Block of W. A St." }, { time: "2:30–6 p.m.", location: "Olustee — 100 W. 4th" }],
      "2026-10-12": [{ time: "11 a.m.–6 p.m.", location: "Temple — 122 S. Commercial Ave." }],
      "2026-10-13": [{ time: "11:30 a.m.–5:30 p.m.", location: "Mt. View — 106 OK-115" }],
      "2026-10-14": [{ time: "11:30 a.m.–2 p.m.", location: "Burns Flat — 228 Hwy 44" }, { time: "2:30–5:30 p.m.", location: "Sentinel — 210 East Main" }],
      "2026-10-15": [{ time: "11:30 a.m.–2 p.m.", location: "Lawton — Pleasant Valley Community Senior Center, 1130 SW Monroe Ave." }, { time: "2:30–6 p.m.", location: "Lawton — Benjamin O. Davis Highrise, 620 SW E Ave." }],
      "2026-10-16": [{ time: "11:30 a.m.–5:30 p.m.", location: "Corn — Main & Oklahoma" }],
      "2026-10-19": [{ time: "11 a.m.–6 p.m.", location: "Blair — 100 West Main (across from City Hall)" }],
      "2026-10-20": [{ time: "11:30 a.m.–5:30 p.m.", location: "Mt. View — 106 OK-115" }],
      "2026-10-21": [{ time: "11 a.m.–6 p.m.", location: "Cache — City Park, South 8th" }],
      "2026-10-22": [{ time: "12–5 p.m.", location: "Erick — 103 W. 2nd St." }],
      "2026-10-23": [{ time: "11 a.m.–2 p.m.", location: "Eldorado — 700 Block of W. A St." }, { time: "2:30–6 p.m.", location: "Olustee — 100 W. 4th" }],
      "2026-10-26": [{ time: "11 a.m.–6 p.m.", location: "Temple — 122 S. Commercial Ave." }],
      "2026-10-27": [{ time: "11:30 a.m.–5:30 p.m.", location: "Mt. View — 106 OK-115" }],
      "2026-10-28": [{ time: "11:30 a.m.–2 p.m.", location: "Burns Flat — 228 Hwy 44" }, { time: "2:30–5:30 p.m.", location: "Sentinel — 210 East Main" }],
      "2026-10-29": [{ time: "11:30 a.m.–2 p.m.", location: "Lawton — Valley Community Senior Living, 1130 SW Monroe Ave." }, { time: "2:30–6 p.m.", location: "Lawton — Benjamin O. Davis Highrise, 620 SW E Ave." }],
      "2026-10-30": [{ time: "11:30 a.m.–5:30 p.m.", location: "Corn — Main & Oklahoma" }],
    },
  },
  staff: [
    { name: "Leslea Hixson",   title: "Executive Director",                         phone: "580-335-5588" },
    { name: "Robin Harris",    title: "Director, Head Start & Early Head Start",     phone: "580-726-3343", email: "rharris@cadcok.org" },
    { name: "Gilbert Nuncio",  title: "Director, Red River Transportation",          phone: "580-335-2691" },
    { name: "Robert Meador",   title: "Director, Weatherization & Housing",          phone: "580-305-0853" },
    { name: "Laura Vardell",   title: "Director, Senior Nutrition",                  phone: "580-335-5588" },
    { name: "Scott Fraley",    title: "Director, Community Market",                  phone: "580-305-1964", email: "SFraley@cadcok.org" },
    { name: "Kristie Jackson", title: "Director, CSBG & Advantage",                 phone: "580-393-2216", email: "kjackson@cadcok.org" },
  ],
  documents: [
    { label: "Annual Report 2025",                         href: "/documents/annual-report-2025.pdf" },
    { label: "Title VI Policy (Red River Transportation)", href: "/documents/title-vi-policy.pdf" },
    { label: "Affirmative Action Plan 2023",               href: "/documents/affirmative-action-plan-2023.pdf" },
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
    const merged = { ...DEFAULT_CONTENT, ...j, features: { ...DEFAULT_CONTENT.features, ...(j.features ?? {}) } };
    // Always show Annual Report first in document lists
    if (Array.isArray(merged.documents)) {
      merged.documents.sort((a: PublicDoc, b: PublicDoc) => {
        if (a.label.toLowerCase().includes("annual")) return -1;
        if (b.label.toLowerCase().includes("annual")) return 1;
        return 0;
      });
    }
    return merged;
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
