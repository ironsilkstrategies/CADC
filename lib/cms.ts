// ─── CADC Site CMS — content model ──────────────────────────────────────────
// Everything directors can edit from /admin lives here. Stored in Vercel KV
// under key "cadc:content". DEFAULT_CONTENT is used until the first save and
// whenever KV is unreachable, so the public site never breaks.

export interface Meal { headline: string; full: string[] }
export interface MarketStop { time: string; location: string }
export interface StaffMember { name: string; title: string; phone?: string; email?: string }
export interface PublicDoc { label: string; href: string }

export interface SiteContent {
  updatedAt: string;
  updatedBy: string;
  announcement: { enabled: boolean; text: string; href?: string };
  seniorMenu: { month: string; year: number; note: string; meals: Record<string, Meal> };
  marketSchedule: { month: string; year: number; note: string; transportation: string; stops: Record<string, MarketStop[]> };
  staff: StaffMember[];
  documents: PublicDoc[];
}

export const CMS_KEY = "cadc:content";

export const DEFAULT_CONTENT: SiteContent = {
  updatedAt: "2026-09-01T00:00:00.000Z",
  updatedBy: "seed",
  announcement: { enabled: false, text: "", href: "" },
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
    { name: "Leslea Hixson",  title: "Executive Director", phone: "580-335-5588" },
    { name: "Robin Harris",   title: "Director, Head Start & Early Head Start", phone: "580-726-3343", email: "rharris@cadcok.org" },
    { name: "Gilbert Nuncio", title: "Director, Red River Transportation", phone: "580-335-2691" },
    { name: "Robert Meador",  title: "Director, Weatherization & Housing", phone: "580-305-0853" },
    { name: "Laura Vardell",  title: "Director, Senior Nutrition", phone: "580-335-5588" },
    { name: "Scott Fraley",   title: "Director, Community Market", phone: "580-305-1964", email: "SFraley@cadcok.org" },
    { name: "Kristie Jackson",title: "Director, Advantage Home Delivered Meals", phone: "580-393-2216" },
  ],
  documents: [
    { label: "Title VI Policy (Red River Transportation)", href: "/documents/title-vi-policy.pdf" },
    { label: "Affirmative Action Plan 2023",               href: "/documents/affirmative-action-plan-2023.pdf" },
    { label: "Annual Report 2025",                         href: "/documents/annual-report-2025.pdf" },
    { label: "Federal Program Disclosures",                href: "/documents/federal-disclosures.pdf" },
  ],
};

// Client-side fetch with graceful fallback
export async function fetchContent(): Promise<SiteContent> {
  try {
    const r = await fetch("/api/cms", { cache: "no-store" });
    if (!r.ok) return DEFAULT_CONTENT;
    const j = await r.json();
    return { ...DEFAULT_CONTENT, ...j };
  } catch { return DEFAULT_CONTENT; }
}
