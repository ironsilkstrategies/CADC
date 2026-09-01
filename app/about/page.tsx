"use client";

import { useState } from "react";
import Link from "next/link";
import { contact, complianceDocs } from "@/lib/org";

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATS = [
  { value: "1966", label: "Year founded" },
  { value: "9", label: "Counties served" },
  { value: "11", label: "Head Start centers" },
  { value: "110", label: "Transit vehicles" },
  { value: "6", label: "Senior meal sites" },
];

const COUNTIES = [
  "Beckham","Canadian","Comanche","Cotton",
  "Jefferson","Kiowa","Roger Mills","Tillman","Washita",
];

const PROGRAMS = [
  { name: "Head Start & Early Head Start", slug: "head-start", icon: "🏫" },
  { name: "Red River Transportation", slug: "transit", icon: "🚌" },
  { name: "Weatherization & Housing", slug: "weatherization", icon: "🏠" },
  { name: "Senior Nutrition", slug: "senior-meals", icon: "🍽️" },
  { name: "Advantage Home Delivered Meals", slug: "advantage", icon: "🚗" },
  { name: "VITA Free Tax Help", slug: "tax-help", icon: "📋" },
  { name: "Community Market", slug: "community-market", icon: "🛒" },
  { name: "Employment & Workforce", slug: "employment", icon: "💼" },
];

const STAFF = [
  { name: "Leslea Hixson", title: "Executive Director", bio: "Executive Director since January 2024. Previously served as CADC's Head Start/Early Head Start Director. Holds a bachelor's degree in Elementary Education and a master's in Education Administration, with 17 years in public education as a teacher and administrator." },
  { name: "Terry Collom", title: "Chief Financial Officer", bio: "CFO with 16 years at CADC. Bachelor's degree in Accounting from Cameron University and 27 years of experience in the accounting field, including 10 years in private manufacturing." },
  { name: "Robin Harris", title: "Head Start & Early Head Start Director", bio: "Leads CADC's Head Start and Early Head Start program across 11 centers in Southwest Oklahoma." },
  { name: "Gilbert Nuncio", title: "Transit Director", bio: "13 years with CADC. Started as a Red River Transportation driver in 2014, promoted to Maintenance Supervisor in 2016, Route Supervisor in 2018, and Transit Director in 2021." },
  { name: "Robert Meador", title: "Weatherization & Housing Director", bio: "Joined CADC in September 1991. Has overseen weatherization of over a thousand homes and led numerous housing rehabilitation projects over a 35-year career in community action." },
  { name: "Laura Vardell", title: "Senior Nutrition Director", bio: "4 years with CADC, overseeing congregate meal programs across Southwest Oklahoma." },
  { name: "Scott Fraley", title: "Community Market Director", bio: "Brings 30+ years of leadership experience in retail, merchandising, and materials management. Born and raised in Frederick, deeply rooted in the community." },
  { name: "Kristie Jackson", title: "Advantage Director", bio: "Started at CADC as a Head Start teacher in September 2022. Long personal history with CADC — attended Head Start as a child, as did her children." },
  { name: "Suzi Fletcher", title: "Human Resources Director & Payroll Manager", bio: "Joined CADC in August 2023. Bachelor's and master's degrees in Accounting from Oklahoma State University, with 28 years of experience across payroll, audit, and financial accounting." },
  { name: "Tiffany Camero", title: "Executive Secretary", bio: "6 years with CADC. U.S. Navy veteran who served 4 years on active duty." },
  { name: "Marty Martin", title: "Purchasing Officer", bio: "3 years with CADC. 30 years of accounting experience in banking." },
  { name: "Sarah Perez", title: "Bookkeeper", bio: "Joined CADC in January 2023. Working toward a Bachelor's in Accounting at NWOSU." },
];

// ─── Location Map Data ────────────────────────────────────────────────────────
// Each location: name, city, address, phone, programs[], lat/lng for maps link

interface CADCLocation {
  id: string;
  name: string;
  city: string;
  county: string;
  address: string;
  phone: string;
  phoneHref: string;
  programs: string[];
  mapsQuery: string;
  hours?: string;
}

const LOCATIONS: CADCLocation[] = [
  {
    id: "frederick-main",
    name: "CADC Main Office",
    city: "Frederick",
    county: "Tillman",
    address: "105 S. Main Street, Frederick, OK 73542",
    phone: "580-335-5588",
    phoneHref: "tel:+15803355588",
    programs: ["All Programs — Main Office", "Senior Nutrition", "Transit"],
    mapsQuery: "105 S Main Street Frederick OK 73542",
    hours: "Mon–Fri 8:00am–5:00pm",
  },
  {
    id: "frederick-senior",
    name: "Senior Nutrition — Frederick",
    city: "Frederick",
    county: "Tillman",
    address: "100 E Grand, Frederick, OK 73542",
    phone: "580-335-7026",
    phoneHref: "tel:+15803357026",
    programs: ["Senior Congregate Meals"],
    mapsQuery: "100 E Grand Frederick OK 73542",
    hours: "Mon–Fri 11:00am–1:00pm",
  },
  {
    id: "cache-senior",
    name: "Senior Nutrition — Cache",
    city: "Cache",
    county: "Comanche",
    address: "416 West C Ave., Cache, OK 73527",
    phone: "580-429-3427",
    phoneHref: "tel:+15804293427",
    programs: ["Senior Congregate Meals"],
    mapsQuery: "416 West C Ave Cache OK 73527",
    hours: "Mon–Fri 11:00am–1:00pm",
  },
  {
    id: "temple-senior",
    name: "Senior Nutrition — Temple",
    city: "Temple",
    county: "Cotton",
    address: "201 S Commercial, Temple, OK 73568",
    phone: "580-342-6944",
    phoneHref: "tel:+15803426944",
    programs: ["Senior Congregate Meals"],
    mapsQuery: "201 S Commercial Temple OK 73568",
    hours: "Mon–Fri 11:00am–1:00pm",
  },
  {
    id: "walters-senior",
    name: "Senior Nutrition — Walters",
    city: "Walters",
    county: "Cotton",
    address: "500 E California, Walters, OK 73572",
    phone: "580-875-9044",
    phoneHref: "tel:+15808759044",
    programs: ["Senior Congregate Meals"],
    mapsQuery: "500 E California Walters OK 73572",
    hours: "Mon–Fri 11:00am–1:00pm",
  },
  {
    id: "ringling-senior",
    name: "Senior Nutrition — Ringling",
    city: "Ringling",
    county: "Jefferson",
    address: "200 D St., Ringling, OK 73456",
    phone: "580-662-2362",
    phoneHref: "tel:+15806622362",
    programs: ["Senior Congregate Meals"],
    mapsQuery: "200 D St Ringling OK 73456",
    hours: "Mon–Fri 11:00am–1:00pm",
  },
  {
    id: "ryan-senior",
    name: "Senior Nutrition — Ryan",
    city: "Ryan",
    county: "Jefferson",
    address: "400 Taylor St. Apt #8, Ryan, OK 73565",
    phone: "580-757-2412",
    phoneHref: "tel:+15807572412",
    programs: ["Senior Congregate Meals", "Transit Office"],
    mapsQuery: "400 Taylor St Ryan OK 73565",
    hours: "Mon–Fri 11:00am–1:00pm",
  },
  {
    id: "sayre-transit",
    name: "Red River Transit — Sayre Office",
    city: "Sayre",
    county: "Beckham",
    address: "304 W. Main, Sayre, OK 73662",
    phone: "580-928-2199",
    phoneHref: "tel:+15809282199",
    programs: ["Red River Transportation"],
    mapsQuery: "304 W Main Sayre OK 73662",
    hours: "Mon–Fri 8:00am–5:00pm",
  },
  {
    id: "sentinel-advantage",
    name: "Advantage — Sentinel Office",
    city: "Sentinel",
    county: "Washita",
    address: "122 S. 3rd Butler Building, Sentinel, OK 73664",
    phone: "580-393-2216",
    phoneHref: "tel:+15803932216",
    programs: ["Advantage Home Delivered Meals"],
    mapsQuery: "122 S 3rd Sentinel OK 73664",
    hours: "Mon–Fri 8:00am–5:00pm",
  },
  {
    id: "lawton-advantage",
    name: "Advantage — Lawton Office",
    city: "Lawton",
    county: "Comanche",
    address: "802 SW A Ave, Suite B, Lawton, OK 73501",
    phone: "580-699-8880",
    phoneHref: "tel:+15806998880",
    programs: ["Advantage Home Delivered Meals"],
    mapsQuery: "802 SW A Ave Suite B Lawton OK 73501",
    hours: "Mon–Fri 8:00am–5:00pm",
  },
];

// Program color legend
const PROGRAM_COLORS: Record<string, string> = {
  "All Programs — Main Office": "#0101FF",
  "Senior Congregate Meals": "#CC0000",
  "Red River Transportation": "#059669",
  "Transit Office": "#059669",
  "Advantage Home Delivered Meals": "#7C3AED",
};

function getProgramColor(programs: string[]): string {
  for (const p of programs) {
    if (PROGRAM_COLORS[p]) return PROGRAM_COLORS[p];
  }
  return "#0101FF";
}

// ─── Save to Contacts vCard generator ─────────────────────────────────────────

function generateVCard(loc: CADCLocation): string {
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:CADC — ${loc.name}`,
    `ORG:Community Action Development Corporation`,
    `TITLE:${loc.programs.join(", ")}`,
    `TEL;TYPE=WORK,VOICE:${loc.phoneHref.replace("tel:","").replace("+1","")}`,
    `ADR;TYPE=WORK:;;${loc.address};;;;USA`,
    `NOTE:${loc.hours ? `Hours: ${loc.hours}` : ""} | cadcok.org`,
    "URL:https://cadcok.org",
    "END:VCARD",
  ].join("\n");
}

function downloadVCard(loc: CADCLocation) {
  const blob = new Blob([generateVCard(loc)], { type: "text/vcard" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `cadc-${loc.id}.vcf`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Location Card (expanded detail) ─────────────────────────────────────────

function LocationCard({ loc, onClose }: { loc: CADCLocation; onClose: () => void }) {
  const color = getProgramColor(loc.programs);
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(loc.mapsQuery)}`;
  const appleMapsUrl = `https://maps.apple.com/?q=${encodeURIComponent(loc.mapsQuery)}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={`loc-title-${loc.id}`}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(0,0,0,0.55)", backdropFilter: "blur(3px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "white", borderRadius: 20, padding: 0,
          maxWidth: 420, width: "100%",
          boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{ background: color, padding: "20px 24px", position: "relative" }}>
          <button
            onClick={onClose}
            aria-label="Close location details"
            style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", color: "white", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}
          >×</button>
          <p id={`loc-title-${loc.id}`} style={{ color: "white", fontWeight: 800, fontSize: 16, margin: 0, paddingRight: 40 }}>{loc.name}</p>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, margin: "4px 0 0" }}>{loc.city} · {loc.county} County</p>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Address */}
          <div>
            <p style={{ color: "#CC0000", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 4px" }}>Address</p>
            <p style={{ color: "#111827", fontSize: 14, margin: 0, lineHeight: 1.5 }}>{loc.address}</p>
          </div>

          {/* Hours */}
          {loc.hours && (
            <div>
              <p style={{ color: "#CC0000", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 4px" }}>Hours</p>
              <p style={{ color: "#111827", fontSize: 14, margin: 0 }}>{loc.hours}</p>
            </div>
          )}

          {/* Programs */}
          <div>
            <p style={{ color: "#CC0000", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>Services at this location</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {loc.programs.map(p => (
                <span key={p} style={{ background: "#E4E4FF", border: "1px solid rgba(1,1,255,0.2)", borderRadius: 6, padding: "4px 10px", fontSize: 12, color: "#0101FF", fontWeight: 600 }}>{p}</span>
              ))}
            </div>
          </div>

          {/* Phone */}
          <div>
            <p style={{ color: "#CC0000", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>Phone</p>
            <a href={loc.phoneHref} style={{ color: "#0101FF", fontWeight: 800, fontSize: 16, textDecoration: "none" }} aria-label={`Call ${loc.name} at ${loc.phone}`}>{loc.phone}</a>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Get directions to ${loc.name} via Google Maps`}
              style={{ flex: 1, minWidth: 120, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "#0101FF", color: "white", padding: "11px 14px", borderRadius: 8, fontWeight: 700, fontSize: 12, textDecoration: "none" }}
            >
              🗺️ Google Maps
            </a>
            <a
              href={appleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Get directions to ${loc.name} via Apple Maps`}
              style={{ flex: 1, minWidth: 120, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "#111827", color: "white", padding: "11px 14px", borderRadius: 8, fontWeight: 700, fontSize: 12, textDecoration: "none" }}
            >
              🍎 Apple Maps
            </a>
            <button
              onClick={() => downloadVCard(loc)}
              aria-label={`Save ${loc.name} contact information to your phone`}
              style={{ flex: 1, minWidth: 120, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "#059669", color: "white", padding: "11px 14px", borderRadius: 8, fontWeight: 700, fontSize: 12, border: "none", cursor: "pointer" }}
            >
              💾 Save Contact
            </button>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            style={{ background: "none", border: "1px solid #e5e7eb", borderRadius: 8, padding: "10px", fontSize: 12, fontWeight: 700, color: "#6b7280", cursor: "pointer" }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Interactive Location Map ─────────────────────────────────────────────────

const LEGEND_ITEMS = [
  { color: "#0101FF", label: "Main Office / All Programs" },
  { color: "#CC0000", label: "Senior Nutrition Sites" },
  { color: "#059669", label: "Transit Offices" },
  { color: "#7C3AED", label: "Advantage Offices" },
  { color: "#D97706", label: "Head Start Centers" },
];

// SVG viewBox: "150 60 360 310" — exact coords derived from county path centroids
// lx/ly values taken directly from SW_OK_ALL_COUNTIES in CADCOrbitSite.tsx
// Cities positioned relative to their county centroid using geographic knowledge
const LOCATION_SVG: Record<string, { x: number; y: number }> = {
  // Frederick, Tillman County — county centroid lx:332.4, ly:295.4
  // Frederick city is in northern Tillman
  "frederick-main":     { x: 332, y: 282 },
  "frederick-senior":   { x: 336, y: 286 },

  // Cache, Comanche County — county centroid lx:368.3, ly:269.0
  // Cache is SW of Lawton
  "cache-senior":       { x: 356, y: 276 },

  // Temple, Cotton County — county centroid lx:372.8, ly:306.4
  // Temple is in northern Cotton
  "temple-senior":      { x: 368, y: 298 },

  // Walters, Cotton County — central Cotton
  "walters-senior":     { x: 376, y: 312 },

  // Ringling, Jefferson County — county centroid lx:414.8, ly:329.8
  // Ringling is in NW Jefferson
  "ringling-senior":    { x: 406, y: 326 },

  // Ryan, Jefferson County — SW Jefferson
  "ryan-senior":        { x: 412, y: 340 },

  // Sayre, Beckham County — county centroid lx:272.4, ly:199.8
  // Sayre is central Beckham
  "sayre-transit":      { x: 268, y: 200 },

  // Sentinel, Washita County — county centroid lx:326.3, ly:198.5
  "sentinel-advantage": { x: 322, y: 196 },

  // Lawton, Comanche County — NE of county centroid
  "lawton-advantage":   { x: 374, y: 260 },
};

// Head Start centers — 11 locations across SW Oklahoma
// Positioned using known city locations within county SVG bounds
const HEAD_START_CENTERS = [
  { name: "Hobart HS",      city: "Hobart",      county: "Kiowa",      x: 318, y: 248 },
  { name: "Altus HS",       city: "Altus",        county: "Jackson",    x: 282, y: 278 },
  { name: "Lawton HS",      city: "Lawton",       county: "Comanche",   x: 370, y: 265 },
  { name: "Frederick HS",   city: "Frederick",    county: "Tillman",    x: 330, y: 290 },
  { name: "Sayre HS",       city: "Sayre",        county: "Beckham",    x: 264, y: 196 },
  { name: "Elk City HS",    city: "Elk City",     county: "Beckham",    x: 258, y: 210 },
  { name: "Clinton HS",     city: "Clinton",      county: "Washita",    x: 304, y: 186 },
  { name: "Weatherford HS", city: "Weatherford",  county: "Custer",     x: 326, y: 158 },
  { name: "Anadarko HS",    city: "Anadarko",     county: "Caddo",      x: 370, y: 220 },
  { name: "El Reno HS",     city: "El Reno",      county: "Canadian",   x: 418, y: 168 },
  { name: "Chickasha HS",   city: "Chickasha",    county: "Grady",      x: 414, y: 232 },
];

// SVG Pin component — clean teardrop shape
function Pin({ x, y, color, label, onClick, size = 10 }: {
  x: number; y: number; color: string; label: string;
  onClick: () => void; size?: number;
}) {
  return (
    <g
      style={{ cursor: "pointer" }}
      onClick={onClick}
      role="button"
      aria-label={label}
    >
      {/* Drop shadow */}
      <ellipse cx={x} cy={y + 1} rx={size * 0.6} ry={size * 0.2} fill="rgba(0,0,0,0.2)" />
      {/* Pin body */}
      <path
        d={`M${x},${y - size * 2.2}
           C${x - size},${y - size * 2.2} ${x - size},${y - size * 0.8} ${x},${y - size * 0.8}
           C${x + size},${y - size * 0.8} ${x + size},${y - size * 2.2} ${x},${y - size * 2.2}Z`}
        fill={color}
        stroke="white"
        strokeWidth={1.5}
      />
      {/* Pin point */}
      <path
        d={`M${x - size * 0.4},${y - size * 0.9} L${x},${y} L${x + size * 0.4},${y - size * 0.9}`}
        fill={color}
        stroke="white"
        strokeWidth={0.8}
        strokeLinejoin="round"
      />
      {/* Inner dot */}
      <circle cx={x} cy={y - size * 1.55} r={size * 0.35} fill="white" opacity={0.9} />
    </g>
  );
}

// Small Head Start diamond marker
function HSMarker({ x, y }: { x: number; y: number }) {
  return (
    <g style={{ pointerEvents: "none" }}>
      <rect
        x={x - 4} y={y - 4} width={8} height={8}
        fill="#D97706" stroke="white" strokeWidth={1}
        transform={`rotate(45 ${x} ${y})`}
      />
    </g>
  );
}

function LocationMap() {
  const [selected, setSelected] = useState<CADCLocation | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [hoveredHS, setHoveredHS] = useState<string | null>(null);

  const filtered = LOCATIONS.filter(loc => {
    if (filter === "all") return true;
    return loc.programs.some(p => p.toLowerCase().includes(filter.toLowerCase()));
  });

  return (
    <section aria-labelledby="map-section-title">
      <p style={{ color: "#CC0000", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>Find Us</p>
      <h2 id="map-section-title" style={{ color: "#0101FF", fontSize: "clamp(1.2rem,2.5vw,1.6rem)", fontWeight: 800, marginBottom: 8 }}>CADC Service Map</h2>
      <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>All CADC locations, Head Start centers, and service counties. Tap any pin for address, hours, directions, and contact info.</p>

      {/* Filter chips */}
      <div role="group" aria-label="Filter locations by program type" style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
        {[
          { id: "all", label: "All Locations" },
          { id: "senior", label: "🍽️ Senior Meals" },
          { id: "transit", label: "🚌 Transit" },
          { id: "advantage", label: "🚗 Advantage" },
          { id: "main", label: "🏛️ Main Office" },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            aria-pressed={filter === f.id}
            style={{
              background: filter === f.id ? "#0101FF" : "white",
              color: filter === f.id ? "white" : "#374151",
              border: `1.5px solid ${filter === f.id ? "#0101FF" : "#e5e7eb"}`,
              borderRadius: 20, padding: "7px 14px", fontSize: 12,
              fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
            }}
          >{f.label}</button>
        ))}
      </div>

      {/* Precision SVG Map */}
      <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid #dde0ef", boxShadow: "0 4px 24px rgba(1,1,255,0.08)" }}>
        <svg
          viewBox="150 60 360 310"
          style={{ width: "100%", display: "block", background: "#edf0f7" }}
          aria-label="Interactive CADC service area map"
          role="img"
        >
          {/* Background fill */}
          <rect x={0} y={0} width={600} height={400} fill="#edf0f7" />

          {/* ── Non-CADC counties — subtle grey ── */}
          {[
            {n:"Alfalfa",   p:"M 396.0,56.3 L 396.0,70.4 L 362.3,70.4 L 361.5,12.3 L 371.2,12.4 L 376.4,12.5 L 377.0,12.5 L 385.5,12.5 L 387.0,12.5 L 387.8,12.5 L 390.2,12.5 L 392.6,12.4 L 395.4,12.4 L 395.6,56.3 Z",   lx:378.7,ly:41.4},
            {n:"Blaine",    p:"M 354.2,102.7 L 357.0,102.6 L 387.7,102.7 L 387.9,150.4 L 379.6,150.4 L 379.6,169.2 L 355.3,169.2 L 354.6,169.2 L 354.6,140.9 L 354.2,102.7 Z",   lx:371.1,ly:135.9},
            {n:"Caddo",     p:"M 355.6,244.7 L 355.5,218.4 L 355.3,178.7 L 355.3,169.2 L 379.6,169.2 L 380.2,188.1 L 396.6,188.0 L 396.9,244.7 Z",   lx:376.1,ly:207.0},
            {n:"Carter",    p:"M 487.8,318.7 L 484.9,329.7 L 438.6,329.6 L 438.5,306.0 L 438.5,282.4 L 455.0,282.4 L 455.0,296.6 L 479.7,296.7 L 487.8,301.3 Z",   lx:463.1,ly:306.0},
            {n:"Cleveland", p:"M 429.9,188.1 L 449.4,188.1 L 461.8,188.1 L 471.4,188.1 L 471.4,236.8 L 455.8,232.9 L 454.8,220.7 L 440.1,205.8 L 438.9,197.7 L 429.9,192.4 Z",   lx:450.7,ly:212.4},
            {n:"Custer",    p:"M 296.3,141.0 L 354.6,140.9 L 354.6,169.2 L 355.3,169.2 L 355.3,178.7 L 297.2,178.6 L 297.2,173.8 Z",   lx:325.8,ly:159.8},
            {n:"Dewey",     p:"M 295.9,119.2 L 295.8,102.8 L 329.2,103.1 L 354.2,102.7 L 354.6,140.9 L 296.3,141.0 Z",   lx:325.2,ly:121.9},
            {n:"Ellis",     p:"M 247.3,114.6 L 247.3,66.5 L 247.1,56.3 L 278.3,56.4 L 279.0,102.8 L 295.8,102.8 L 295.9,119.2 L 286.9,122.9 L 282.0,135.1 L 269.6,135.8 L 262.9,130.3 L 262.3,120.6 L 256.1,121.9 L 253.2,130.0 L 247.3,133.5 Z",   lx:271.5,ly:96.1},
            {n:"Garfield",  p:"M 446.3,56.3 L 446.4,56.3 L 446.4,102.8 L 429.6,102.8 L 396.0,102.7 L 396.0,56.3 Z",   lx:421.2,ly:79.5},
            {n:"Garvin",    p:"M 438.5,282.4 L 438.4,263.5 L 430.2,263.5 L 430.2,244.7 L 487.9,244.8 L 487.9,268.3 L 466.9,269.9 L 471.3,282.5 L 455.0,282.4 Z",   lx:459.0,ly:263.6},
            {n:"Grady",     p:"M 396.6,188.0 L 417.2,192.6 L 418.9,192.8 L 419.3,192.0 L 420.1,192.2 L 420.5,192.9 L 420.8,192.5 L 421.6,192.4 L 422.1,191.5 L 424.8,193.9 L 425.7,193.7 L 426.1,193.4 L 427.2,193.8 L 428.0,193.5 L 428.9,192.8 L 429.9,192.6 L 430.2,244.7 L 430.2,263.5 L 397.3,263.5 L 397.2,263.5 L 397.1,244.7 L 396.9,244.7 Z",   lx:413.4,ly:225.8},
            {n:"Grant",     p:"M 446.3,56.3 L 396.0,56.3 L 395.4,12.4 L 400.6,12.4 L 419.7,12.4 L 421.1,12.4 L 422.3,12.4 L 427.9,12.4 L 431.6,12.3 L 435.0,12.4 L 438.3,12.4 L 445.5,12.4 L 446.3,12.4 Z",   lx:420.9,ly:34.3},
            {n:"Greer",     p:"M 293.7,216.6 L 300.1,224.5 L 301.8,244.4 L 306.5,248.3 L 294.0,249.2 L 292.6,258.8 L 273.5,258.8 L 269.3,254.1 L 268.5,235.0 L 256.1,235.1 L 256.1,225.7 L 264.4,225.7 L 264.4,216.3 Z",   lx:281.3,ly:237.6},
            {n:"Harmon",    p:"M 247.3,256.5 L 247.3,225.7 L 256.1,225.7 L 256.1,235.1 L 268.5,235.0 L 269.3,254.1 L 273.5,258.8 L 273.5,282.4 L 259.4,282.6 L 253.4,275.1 L 247.5,276.5 L 247.3,276.6 Z",   lx:260.4,ly:254.2},
            {n:"Harper",    p:"M 247.2,12.1 L 264.2,12.1 L 274.2,12.2 L 282.0,12.3 L 286.5,12.3 L 290.0,12.3 L 296.5,25.4 L 302.6,31.8 L 302.6,56.1 L 278.3,56.4 L 247.1,56.3 Z",   lx:274.9,ly:34.2},
            {n:"Jackson",   p:"M 309.2,300.7 L 305.3,293.6 L 297.8,289.4 L 294.5,296.6 L 291.2,296.8 L 290.2,295.2 L 285.4,292.4 L 280.7,292.0 L 277.4,296.7 L 271.3,296.3 L 265.6,290.7 L 259.4,282.6 L 273.5,282.4 L 273.5,258.8 L 292.6,258.8 L 294.0,249.2 L 306.5,248.3 L 314.2,245.2 L 314.1,261.2 L 321.7,261.3 L 317.7,268.2 L 308.5,283.8 Z",   lx:290.5,ly:273.0},
            {n:"Kingfisher",p:"M 396.0,102.7 L 429.6,102.8 L 429.7,150.3 L 387.9,150.4 L 387.7,102.7 Z",   lx:408.7,ly:126.6},
            {n:"Logan",     p:"M 471.5,126.9 L 471.5,150.5 L 429.7,150.3 L 429.6,102.8 L 446.4,102.8 L 454.8,103.4 L 454.8,122.2 L 457.2,119.4 Z",   lx:450.6,ly:126.6},
            {n:"Love",      p:"M 484.7,344.3 L 483.7,349.6 L 475.3,366.3 L 471.8,367.8 L 469.8,366.7 L 466.5,359.0 L 466.5,357.0 L 458.2,351.2 L 453.3,356.9 L 449.1,356.9 L 446.3,354.5 L 447.2,351.3 L 447.2,349.1 L 444.6,346.5 L 443.3,346.1 L 441.9,346.7 L 439.8,348.1 L 438.6,348.4 L 438.6,329.6 L 484.9,329.7 L 487.7,342.4 Z",   lx:463.1,ly:348.8},
            {n:"Major",     p:"M 354.2,102.7 L 329.2,103.1 L 328.9,65.7 L 338.0,65.7 L 340.8,70.7 L 355.1,78.1 L 362.3,77.5 L 362.3,70.4 L 396.0,70.4 L 396.0,102.7 Z",   lx:362.5,ly:84.4},
            {n:"McClain",   p:"M 429.9,192.6 L 438.9,197.7 L 440.1,205.8 L 454.8,220.7 L 455.8,232.9 L 471.4,236.8 L 488.0,232.8 L 488.0,244.7 L 487.9,244.8 L 430.2,244.7 Z",   lx:459.0,ly:218.6},
            {n:"Oklahoma",  p:"M 461.8,188.1 L 449.4,188.1 L 429.9,188.1 L 429.9,178.7 L 429.7,150.3 L 471.5,150.5 L 471.5,178.7 L 471.4,188.1 Z",   lx:450.6,ly:169.2},
            {n:"Stephens",  p:"M 393.0,282.4 L 393.0,263.5 L 430.2,263.5 L 438.4,263.5 L 438.5,282.4 L 438.5,306.0 L 393.3,305.9 L 393.3,282.4 Z",   lx:415.7,ly:284.8},
            {n:"Woods",     p:"M 302.6,31.8 L 296.5,25.4 L 290.0,12.3 L 335.1,12.3 L 341.7,12.3 L 347.8,12.3 L 361.5,12.3 L 362.3,70.4 L 362.3,77.5 L 355.1,78.1 L 340.8,70.7 L 338.0,65.7 L 328.9,55.7 L 314.8,35.8 Z",   lx:326.2,ly:45.2},
            {n:"Woodward",  p:"M 278.3,56.4 L 302.6,56.1 L 302.6,31.8 L 314.8,35.8 L 328.9,55.7 L 328.9,65.7 L 329.2,103.1 L 295.8,102.8 L 279.0,102.8 Z",   lx:303.8,ly:67.4},
          ].map(c => (
            <g key={c.n}>
              <path d={c.p} fill="#dce0ed" stroke="#c8cde0" strokeWidth={0.7} strokeLinejoin="round" />
              <text x={c.lx} y={c.ly} textAnchor="middle" dominantBaseline="middle" fontSize={4} fill="#a0a8c0" style={{ userSelect: "none", pointerEvents: "none" }}>{c.n}</text>
            </g>
          ))}

          {/* ── CADC service counties — highlighted ── */}
          {[
            {n:"Beckham",     p:"M 247.3,209.2 L 247.3,183.2 L 280.6,183.3 L 280.6,173.8 L 297.2,173.8 L 297.2,178.6 L 297.5,216.3 L 293.7,216.4 L 293.7,216.6 L 264.4,216.3 L 264.4,225.7 L 256.1,225.7 L 247.3,225.7 Z",   lx:272.4,ly:199.8},
            {n:"Canadian",    p:"M 429.9,178.7 L 429.9,192.6 L 428.9,192.8 L 428.0,193.5 L 427.2,193.8 L 426.1,193.4 L 425.7,193.7 L 424.8,193.9 L 422.1,191.5 L 421.6,192.4 L 420.8,192.5 L 420.5,192.9 L 420.1,192.2 L 419.3,192.0 L 418.9,192.8 L 417.2,192.6 L 396.6,188.0 L 380.2,188.1 L 379.6,169.2 L 379.6,150.4 L 387.9,150.4 L 429.7,150.3 Z",   lx:404.8,ly:172.1},
            {n:"Comanche",    p:"M 393.0,282.4 L 385.0,282.4 L 381.0,288.7 L 364.6,288.6 L 364.6,291.8 L 352.3,293.4 L 352.3,282.4 L 339.4,282.4 L 339.4,244.6 L 355.6,244.7 L 396.9,244.7 L 397.2,263.5 L 393.0,263.5 Z",   lx:368.3,ly:269.0},
            {n:"Cotton",      p:"M 390.9,325.0 L 388.5,324.7 L 381.1,322.9 L 378.7,321.0 L 375.6,320.3 L 374.1,321.3 L 372.9,323.4 L 372.8,324.2 L 370.2,326.9 L 366.9,330.4 L 364.6,329.5 L 360.8,322.9 L 357.1,319.9 L 356.3,319.9 L 356.4,301.2 L 352.3,293.4 L 364.6,291.8 L 364.6,288.6 L 381.0,288.7 L 385.0,282.4 L 393.0,282.4 L 393.3,282.4 L 393.3,305.9 L 393.3,322.0 Z",   lx:372.8,ly:306.4},
            {n:"Jefferson",   p:"M 405.9,349.3 L 407.8,344.2 L 408.4,338.5 L 405.5,337.2 L 402.6,338.0 L 400.9,338.1 L 397.5,337.0 L 395.8,333.7 L 390.9,325.0 L 393.3,322.0 L 393.3,305.9 L 438.5,306.0 L 438.5,328.4 L 438.6,348.4 L 437.0,348.1 L 435.8,346.7 L 436.4,342.6 L 434.8,340.8 L 431.1,338.5 L 429.9,338.3 L 428.6,338.8 L 427.6,340.4 L 425.0,344.2 L 421.0,349.2 L 417.2,352.8 L 414.7,353.7 L 413.8,353.6 L 406.8,350.1 Z",   lx:414.8,ly:329.8},
            {n:"Kiowa",       p:"M 355.5,218.4 L 355.6,244.7 L 339.4,244.6 L 339.4,272.9 L 325.7,272.9 L 325.7,268.2 L 317.7,268.2 L 321.7,261.3 L 314.1,261.2 L 314.2,245.2 L 306.5,248.3 L 301.8,244.4 L 300.1,224.5 L 293.7,216.6 L 293.7,216.4 L 297.5,216.3 L 345.3,216.4 Z",   lx:324.6,ly:244.6},
            {n:"Roger Mills", p:"M 247.3,161.9 L 247.3,133.5 L 253.2,130.0 L 256.1,121.9 L 262.3,120.6 L 262.9,130.3 L 269.6,135.8 L 282.0,135.1 L 286.9,122.9 L 295.9,119.2 L 296.3,141.0 L 297.2,173.8 L 280.6,173.8 L 280.6,183.3 L 247.3,183.2 Z",   lx:272.3,ly:151.2},
            {n:"Tillman",     p:"M 329.5,316.2 L 321.0,315.2 L 316.4,315.5 L 313.5,314.9 L 310.8,314.0 L 309.2,305.7 L 309.2,300.8 L 308.5,283.8 L 317.7,268.2 L 325.7,268.2 L 325.7,272.9 L 339.4,272.9 L 339.4,282.4 L 352.3,282.4 L 352.3,293.4 L 356.4,301.2 L 356.3,319.9 L 354.2,319.8 L 349.3,322.6 L 344.2,322.6 L 336.9,320.8 L 332.0,317.5 Z",   lx:332.4,ly:295.4},
            {n:"Washita",     p:"M 355.5,218.4 L 345.3,216.4 L 297.5,216.3 L 297.2,178.6 L 355.3,178.7 Z",   lx:326.3,ly:198.5},
          ].map(c => (
            <g key={c.n}>
              <path d={c.p} fill="rgba(1,1,255,0.11)" stroke="rgba(1,1,255,0.5)" strokeWidth={1.4} strokeLinejoin="round" />
              <text x={c.lx} y={c.ly} textAnchor="middle" dominantBaseline="middle" fontSize={5.5} fontWeight="700" fill="#0a0a6e" style={{ userSelect: "none", pointerEvents: "none" }}>{c.n}</text>
            </g>
          ))}

          {/* ── City labels for key service cities ── */}
          {[
            {n:"Frederick",   x:332,  y:292},
            {n:"Lawton",      x:376,  y:270},
            {n:"Sayre",       x:265,  y:207},
            {n:"Cache",       x:350,  y:281},
            {n:"Walters",     x:378,  y:316},
            {n:"Temple",      x:366,  y:302},
            {n:"Ringling",    x:404,  y:330},
            {n:"Ryan",        x:408,  y:344},
            {n:"Sentinel",    x:319,  y:204},
            {n:"Hobart",      x:316,  y:253},
            {n:"Altus",       x:280,  y:283},
            {n:"Clinton",     x:302,  y:191},
            {n:"Elk City",    x:256,  y:215},
            {n:"Anadarko",    x:368,  y:226},
            {n:"El Reno",     x:416,  y:174},
            {n:"Chickasha",   x:412,  y:238},
            {n:"Weatherford", x:324,  y:163},
          ].map(c => (
            <text key={c.n} x={c.x} y={c.y} textAnchor="middle" fontSize={3.8} fill="#6b7280" fontStyle="italic" style={{ userSelect: "none", pointerEvents: "none" }}>{c.n}</text>
          ))}

          {/* ── Head Start centers — amber diamonds ── */}
          {HEAD_START_CENTERS.map(hs => (
            <g key={hs.name}>
              <HSMarker x={hs.x} y={hs.y} />
              {hoveredHS === hs.name && (
                <g>
                  <rect x={hs.x - 20} y={hs.y - 18} width={40} height={10} rx={2} fill="rgba(217,119,6,0.95)" />
                  <text x={hs.x} y={hs.y - 11} textAnchor="middle" fontSize={3.5} fill="white" fontWeight="700">{hs.city}</text>
                </g>
              )}
              <rect
                x={hs.x - 8} y={hs.y - 8} width={16} height={16}
                fill="transparent"
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHoveredHS(hs.name)}
                onMouseLeave={() => setHoveredHS(null)}
              />
            </g>
          ))}

          {/* ── Location pins — rendered last so they're on top ── */}
          {filtered.map(loc => {
            const pos = LOCATION_SVG[loc.id];
            if (!pos) return null;
            const color = getProgramColor(loc.programs);
            return (
              <Pin
                key={loc.id}
                x={pos.x}
                y={pos.y}
                color={color}
                label={`${loc.name} — ${loc.city}, ${loc.county} County`}
                onClick={() => setSelected(loc)}
                size={9}
              />
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div role="list" aria-label="Map legend" style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 14, marginBottom: 24 }}>
        {LEGEND_ITEMS.map(item => (
          <div key={item.label} role="listitem" style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: item.color, flexShrink: 0, border: "1.5px solid white", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} aria-hidden="true" />
            <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>{item.label}</span>
          </div>
        ))}
        <div role="listitem" style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{ width: 10, height: 10, background: "#D97706", transform: "rotate(45deg)", flexShrink: 0, border: "1px solid white" }} aria-hidden="true" />
          <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>Head Start Centers (11)</span>
        </div>
      </div>

      {/* Accessible location list */}
      <div>
        <h3 style={{ color: "#0101FF", fontSize: 14, fontWeight: 800, marginBottom: 12 }}>All Locations</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px,1fr))", gap: 10 }}>
          {filtered.map(loc => {
            const color = getProgramColor(loc.programs);
            return (
              <button
                key={loc.id}
                onClick={() => setSelected(loc)}
                aria-label={`View details for ${loc.name} in ${loc.city}`}
                style={{
                  background: "white", border: "1px solid #e5e7eb", borderRadius: 12,
                  padding: "14px 16px", textAlign: "left", cursor: "pointer",
                  display: "flex", alignItems: "flex-start", gap: 12,
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = `0 4px 16px ${color}22`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, marginTop: 4, flexShrink: 0 }} aria-hidden="true" />
                <div>
                  <p style={{ color: "#111827", fontWeight: 700, fontSize: 13, margin: "0 0 2px" }}>{loc.name}</p>
                  <p style={{ color: "#6b7280", fontSize: 11, margin: "0 0 4px" }}>{loc.city} · {loc.county} County</p>
                  <p style={{ color: "#0101FF", fontSize: 11, fontWeight: 700, margin: 0 }}>{loc.phone}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail modal */}
      {selected && <LocationCard loc={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}

// ─── Main About Page ──────────────────────────────────────────────────────────

export default function AboutPage() {
  const annualReport = complianceDocs.find((d: { label: string }) => d.label === "2024 Annual Report");

  return (
    <div className="min-h-screen" style={{ background: "#F8F8FF", fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>

      {/* Skip to main content */}
      <a href="#main-about-content" style={{ position: "absolute", left: "-9999px", top: "auto", width: 1, height: 1, overflow: "hidden", zIndex: 9999, background: "#0101FF", color: "white", padding: "12px 20px", fontWeight: 700, fontSize: 14, textDecoration: "none" }}
        onFocus={e => { e.currentTarget.style.left = "0"; e.currentTarget.style.width = "auto"; e.currentTarget.style.height = "auto"; }}
        onBlur={e => { e.currentTarget.style.left = "-9999px"; e.currentTarget.style.width = "1px"; e.currentTarget.style.height = "1px"; }}
      >Skip to main content</a>

      {/* Hero */}
      <header style={{ background: "#F8F9FF", borderBottom: "1px solid #e5e7eb", padding: "56px 0 48px", position: "relative" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px" }}>
          <Link href="/" aria-label="Back to CADC home page" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#6b7280", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", marginBottom: 28 }}>
            ← Back to Home
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 24, flexWrap: "wrap" }}>
            <img src="/images/cadc-logo.png" alt="CADC Community Action Development Corporation" style={{ height: 72, width: "auto" }} />
            <div>
              <p style={{ color: "#CC0000", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 6 }}>Southwest Oklahoma · Since 1966</p>
              <h1 style={{ color: "#0101FF", fontSize: "clamp(1.6rem,4vw,2.6rem)", fontWeight: 800, lineHeight: 1.1, margin: 0 }}>
                Community Action<br />Development Corporation
              </h1>
            </div>
          </div>
          <p style={{ color: "#374151", fontSize: 16, lineHeight: 1.75, maxWidth: 600, marginBottom: 28 }}>
            Since 1966, CADC has worked alongside families across Southwest Oklahoma — connecting people to the resources, programs, and support they need to build stable, healthy lives.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href={`tel:+1${contact.mainPhone.replace(/\D/g,"")}`} aria-label={`Call CADC main office at ${contact.mainPhone}`} style={{ background: "#CC0000", color: "white", padding: "12px 24px", borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
              📞 {contact.mainPhone}
            </a>
            <a
              href="https://www.surveymonkey.com/r/26cadcneeds"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Take the 2026 CADC Community Needs Survey (opens in new tab)"
              style={{ background: "#0101FF", color: "white", padding: "12px 24px", borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: "none" }}
            >
              📋 2026 Community Survey
            </a>
            {annualReport && (
              <a href={(annualReport as { href: string }).href} target="_blank" rel="noopener noreferrer" aria-label="Download 2024 Annual Report (opens in new tab)" style={{ border: "1px solid #0101FF", color: "#0101FF", padding: "12px 24px", borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
                2024 Annual Report ↗
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Stats bar */}
      <div style={{ background: "#0101FF" }} role="region" aria-label="CADC key statistics">
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px", display: "flex", flexWrap: "wrap" }}>
          {STATS.map(s => (
            <div key={s.label} style={{ flex: "1 1 120px", padding: "20px 16px", textAlign: "center", borderRight: "1px solid rgba(255,255,255,0.12)" }}>
              <div style={{ color: "white", fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 800, lineHeight: 1 }} aria-label={`${s.value} — ${s.label}`}>{s.value}</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 }} aria-hidden="true">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <main id="main-about-content" style={{ maxWidth: 860, margin: "0 auto", padding: "56px 24px 80px", display: "flex", flexDirection: "column", gap: 56 }}>

        {/* Mission */}
        <section aria-labelledby="mission-heading">
          <p style={{ color: "#CC0000", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>Our Mission</p>
          <h2 id="mission-heading" style={{ color: "#0101FF", fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>Helping People. Changing Lives.</h2>
          <p style={{ color: "#374151", fontSize: 15, lineHeight: 1.8, maxWidth: 660 }}>
            CADC is a private, non-profit Community Action Agency and Community Action Partnership member. We work to reduce poverty, revitalize communities, and empower people across Southwest Oklahoma through direct services, advocacy, and partnerships.
          </p>
          <p style={{ color: "#374151", fontSize: 15, lineHeight: 1.8, maxWidth: 660, marginTop: 14 }}>
            Every program we operate is built around one belief: that people, given the right support at the right time, can and do change their circumstances. We show up for that moment — every day, across 9 counties.
          </p>
        </section>

        {/* Service area */}
        <section aria-labelledby="service-area-heading">
          <p style={{ color: "#CC0000", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>Where We Serve</p>
          <h2 id="service-area-heading" style={{ color: "#0101FF", fontSize: "clamp(1.2rem,2.5vw,1.6rem)", fontWeight: 800, marginBottom: 16 }}>9 Counties Across Southwest Oklahoma</h2>
          <ul style={{ display: "flex", flexWrap: "wrap", gap: 8, listStyle: "none", padding: 0, margin: 0 }}>
            {COUNTIES.map(c => (
              <li key={c} style={{ background: "#E4E4FF", border: "1px solid rgba(1,1,255,0.2)", borderRadius: 6, padding: "7px 14px", fontSize: 13, color: "#0101FF", fontWeight: 700 }}>{c}</li>
            ))}
          </ul>
          <p style={{ color: "#6b7280", fontSize: 13, marginTop: 12 }}>
            Some programs — including Red River Transportation and Advantage Home Delivered Meals — serve additional counties. Visit individual program pages for coverage details.
          </p>
        </section>

        {/* Interactive Location Map */}
        <LocationMap />

        {/* Programs */}
        <section aria-labelledby="programs-heading">
          <p style={{ color: "#CC0000", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>What We Do</p>
          <h2 id="programs-heading" style={{ color: "#0101FF", fontSize: "clamp(1.2rem,2.5vw,1.6rem)", fontWeight: 800, marginBottom: 20 }}>Our Programs</h2>
          <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12, listStyle: "none", padding: 0, margin: 0 }}>
            {PROGRAMS.map(p => (
              <li key={p.slug}>
                <Link href={`/#${p.slug}`} aria-label={`Learn more about ${p.name}`}
                  style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 20px", textDecoration: "none", display: "flex", alignItems: "center", gap: 12 }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#0101FF"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#e5e7eb"; }}
                >
                  <span aria-hidden="true" style={{ fontSize: 22 }}>{p.icon}</span>
                  <span style={{ color: "#111827", fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}>{p.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Staff */}
        <section aria-labelledby="staff-heading">
          <p style={{ color: "#CC0000", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>Administrative Staff</p>
          <h2 id="staff-heading" style={{ color: "#0101FF", fontSize: "clamp(1.2rem,2.5vw,1.6rem)", fontWeight: 800, marginBottom: 20 }}>Our Team</h2>
          <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14, listStyle: "none", padding: 0, margin: 0 }}>
            {STAFF.map(s => (
              <li key={s.name} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 14, padding: "20px 22px" }}>
                <p style={{ color: "#111827", fontWeight: 800, fontSize: 15, margin: "0 0 3px" }}>{s.name}</p>
                <p style={{ color: "#CC0000", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.09em", margin: "0 0 10px" }}>{s.title}</p>
                <p style={{ color: "#6b7280", fontSize: 12, lineHeight: 1.65, margin: 0 }}>{s.bio}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Contact CTA */}
        <section aria-labelledby="contact-cta-heading" style={{ background: "#F0F0FF", borderRadius: 20, padding: "40px 36px", border: "1px solid rgba(1,1,255,0.15)" }}>
          <p style={{ color: "#CC0000", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 10 }}>Get in touch</p>
          <h2 id="contact-cta-heading" style={{ color: "#0101FF", fontSize: "clamp(1.2rem,2.5vw,1.8rem)", fontWeight: 800, marginBottom: 8 }}>We're here to help.</h2>
          <p style={{ color: "#374151", fontSize: 14, lineHeight: 1.7, marginBottom: 24, maxWidth: 480 }}>
            {contact.address.street} · {contact.address.city}, {contact.address.state} {contact.address.zip}
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href={contact.mainPhoneHref} aria-label={`Call CADC at ${contact.mainPhone}`} style={{ background: "#CC0000", color: "white", padding: "12px 24px", borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
              📞 {contact.mainPhone}
            </a>
            <Link href="/contact" style={{ border: "1px solid #0101FF", color: "#0101FF", padding: "12px 24px", borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
              Contact page →
            </Link>
          </div>
        </section>

      </main>

      {/* ADA compliance styles */}
      <style>{`
        *:focus-visible {
          outline: 3px solid #0101FF !important;
          outline-offset: 3px !important;
          border-radius: 4px;
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
        @media (forced-colors: active) {
          button, a { border: 1px solid ButtonText; }
        }
      `}</style>
    </div>
  );
}
