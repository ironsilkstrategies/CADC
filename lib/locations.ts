/**
 * Every CADC physical location.
 * Powers: location finder, program page location blocks, LocalBusiness schema.
 *
 * ⚠️ ALL ENTRIES REQUIRE CADC VERIFICATION BEFORE LAUNCH.
 * Extracted from the legacy site, which contained known duplication errors.
 * Send the verification packet to CADC in week 1 — their turnaround is the
 * critical path on this deliverable, not development time.
 *
 * Coordinates are intentionally omitted. Do not guess them — geocode from the
 * verified addresses once CADC signs off, then populate `lat` / `lng`.
 */

import type { ProgramSlug } from "./programs";

export interface Location {
  id: string;
  name: string;
  program: ProgramSlug;
  street: string;
  mailing?: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  /** tel: href — legacy site blocked phone detection; every number must be tappable. */
  phoneHref: string;
  lat?: number;
  lng?: number;
  verified: boolean;
}

const tel = (p: string) => `tel:+1${p.replace(/\D/g, "")}`;

// ─── Head Start & Early Head Start — 13 centers ──────────────────────────────

export const headStartCenters: Location[] = [
  { id: "hs-burns-flat", name: "Burns Flat – Dill City", program: "head-start",
    street: "100A Cimarron", city: "Burns Flat", state: "OK", zip: "73624",
    phone: "580-562-1776", phoneHref: tel("580-562-1776"), verified: false },

  { id: "hs-cordell", name: "Cordell", program: "head-start",
    street: "511 E. Kiowa", city: "Cordell", state: "OK", zip: "73632",
    phone: "580-832-2454", phoneHref: tel("580-832-2454"), verified: false },

  { id: "hs-erick", name: "Erick", program: "head-start",
    street: "611 W. 3rd", mailing: "P.O. Box 1222", city: "Erick", state: "OK", zip: "73645",
    phone: "580-526-3198", phoneHref: tel("580-526-3198"), verified: false },

  { id: "hs-frederick", name: "Frederick", program: "head-start",
    street: "521 E. Gladstone", city: "Frederick", state: "OK", zip: "73542",
    phone: "580-335-5644", phoneHref: tel("580-335-5644"), verified: false },

  { id: "hs-grandfield", name: "Grandfield", program: "head-start",
    street: "416 S. Main", mailing: "P.O. Box 157", city: "Grandfield", state: "OK", zip: "73546",
    phone: "580-479-3288", phoneHref: tel("580-479-3288"), verified: false },

  { id: "hs-hammon", name: "Hammon", program: "head-start",
    street: "8th & Shockey", mailing: "P.O. Box 462", city: "Hammon", state: "OK", zip: "73650",
    phone: "580-473-9110", phoneHref: tel("580-473-9110"), verified: false },

  { id: "hs-hobart", name: "Hobart", program: "head-start",
    street: "400 N. Randlett", city: "Hobart", state: "OK", zip: "73651",
    phone: "580-726-3648", phoneHref: tel("580-726-3648"), verified: false },

  { id: "hs-ringling", name: "Ringling", program: "head-start",
    street: "Hwy 89 & Oak", city: "Ringling", state: "OK", zip: "73456",
    phone: "580-662-2987", phoneHref: tel("580-662-2987"), verified: false },

  { id: "hs-sayre", name: "Sayre", program: "head-start",
    street: "400 E. Hanna", mailing: "P.O. Box 21", city: "Sayre", state: "OK", zip: "73662",
    phone: "580-928-5417", phoneHref: tel("580-928-5417"), verified: false },

  { id: "hs-sentinel", name: "Sentinel", program: "head-start",
    street: "114 S. 3rd St.", mailing: "P.O. Box 598", city: "Sentinel", state: "OK", zip: "73664",
    phone: "580-393-4303", phoneHref: tel("580-393-4303"), verified: false },

  { id: "hs-snyder", name: "Snyder / Mt. Park", program: "head-start",
    street: "621 C Street", city: "Snyder", state: "OK", zip: "73566",
    phone: "580-569-4335", phoneHref: tel("580-569-4335"), verified: false },

  { id: "hs-temple", name: "Temple", program: "head-start",
    street: "102 W. Texas", mailing: "P.O. Box 247", city: "Temple", state: "OK", zip: "73568",
    phone: "580-342-5022", phoneHref: tel("580-342-5022"), verified: false },

  { id: "hs-waurika", name: "Waurika", program: "head-start",
    street: "803 Phillips", mailing: "P.O. Box C6", city: "Waurika", state: "OK", zip: "73573",
    phone: "580-228-2810", phoneHref: tel("580-228-2810"), verified: false },
];

// ─── Red River Transportation offices ────────────────────────────────────────
// Legacy site listed Cordell twice, identically. Deduplicated here.
// Packet references 4 offices; 4 unique are listed below. Confirm completeness.

export const transitOffices: Location[] = [
  { id: "tr-cordell", name: "Cordell Office", program: "transit",
    street: "111 E. Main", city: "Cordell", state: "OK", zip: "73632",
    phone: "580-832-5458", phoneHref: tel("580-832-5458"), verified: false },

  { id: "tr-frederick", name: "Frederick Office", program: "transit",
    street: "105 S. Main", city: "Frederick", state: "OK", zip: "73542",
    phone: "580-335-5588", phoneHref: tel("580-335-5588"), verified: false },

  { id: "tr-sayre", name: "Sayre Office", program: "transit",
    street: "304 W. Main", city: "Sayre", state: "OK", zip: "73662",
    phone: "580-928-2199", phoneHref: tel("580-928-2199"), verified: false },

  { id: "tr-ryan", name: "Ryan Office", program: "transit",
    street: "400 Taylor & Main", city: "Ryan", state: "OK", zip: "73565",
    phone: "580-757-2235", phoneHref: tel("580-757-2235"), verified: false },
];

// ─── Senior Congregate Meals — 14 sites ──────────────────────────────────────
// ⚠️ NOT PUBLISHED ON THE LEGACY SITE. Must be collected directly from CADC.
// This is the single largest content gap in the build. Request in week 1.

export const seniorMealSites: Location[] = [];

// ─── Aggregate ───────────────────────────────────────────────────────────────

export const allLocations: Location[] = [
  ...headStartCenters,
  ...transitOffices,
  ...seniorMealSites,
];

export const locationsByProgram = (slug: ProgramSlug) =>
  allLocations.filter((l) => l.program === slug);

export const unverifiedCount = () =>
  allLocations.filter((l) => !l.verified).length;

export const formatAddress = (l: Location) =>
  `${l.street}, ${l.city}, ${l.state} ${l.zip}`;
