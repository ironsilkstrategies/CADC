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
];

// Approximate positions as percentages of the map area (SW Oklahoma focus)
const LOCATION_POSITIONS: Record<string, { x: number; y: number }> = {
  "frederick-main":   { x: 38, y: 72 },
  "frederick-senior": { x: 41, y: 74 },
  "cache-senior":     { x: 55, y: 65 },
  "temple-senior":    { x: 47, y: 80 },
  "walters-senior":   { x: 50, y: 84 },
  "ringling-senior":  { x: 62, y: 82 },
  "ryan-senior":      { x: 60, y: 86 },
  "sayre-transit":    { x: 18, y: 42 },
  "sentinel-advantage": { x: 28, y: 52 },
  "lawton-advantage": { x: 58, y: 68 },
};

function LocationMap() {
  const [selected, setSelected] = useState<CADCLocation | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const filtered = LOCATIONS.filter(loc => {
    if (filter === "all") return true;
    return loc.programs.some(p => p.toLowerCase().includes(filter.toLowerCase()));
  });

  return (
    <section aria-labelledby="map-section-title">
      <p style={{ color: "#CC0000", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>Find Us</p>
      <h2 id="map-section-title" style={{ color: "#0101FF", fontSize: "clamp(1.2rem,2.5vw,1.6rem)", fontWeight: 800, marginBottom: 16 }}>CADC Locations Across Southwest Oklahoma</h2>
      <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>Tap any pin to see address, hours, services, directions, and save to your contacts.</p>

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

      {/* Map container */}
      <div style={{ position: "relative", background: "#eaecf5", borderRadius: 16, overflow: "hidden", border: "1px solid #dde0ef", aspectRatio: "16/9" }}
        role="region"
        aria-label="Interactive CADC location map — use the location list below for keyboard access"
      >
        {/* SVG Oklahoma map background */}
        <svg viewBox="150 60 360 310" style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }} aria-hidden="true">
          <rect x={0} y={0} width={600} height={400} fill="#eaecf5" />
          {/* Simplified SW Oklahoma outline — just county borders as context */}
          <text x={300} y={100} textAnchor="middle" fontSize={8} fill="#b0b4cc" fontWeight={600}>SOUTHWEST OKLAHOMA</text>
        </svg>

        {/* Location pins */}
        {filtered.map(loc => {
          const pos = LOCATION_POSITIONS[loc.id];
          if (!pos) return null;
          const color = getProgramColor(loc.programs);
          return (
            <button
              key={loc.id}
              onClick={() => setSelected(loc)}
              aria-label={`${loc.name} — ${loc.city}, ${loc.county} County. Tap for details.`}
              title={loc.name}
              style={{
                position: "absolute",
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: "translate(-50%, -100%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                zIndex: 10,
              }}
            >
              {/* Pin SVG */}
              <svg width={32} height={40} viewBox="0 0 32 40" aria-hidden="true">
                <path d="M16 0C9.373 0 4 5.373 4 12c0 9 12 28 12 28S28 21 28 12C28 5.373 22.627 0 16 0z" fill={color} stroke="white" strokeWidth={2} />
                <circle cx={16} cy={12} r={5} fill="white" />
              </svg>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div role="list" aria-label="Map legend" style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 14, marginBottom: 24 }}>
        {LEGEND_ITEMS.map(item => (
          <div key={item.label} role="listitem" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: item.color, flexShrink: 0 }} aria-hidden="true" />
            <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Accessible location list — keyboard users */}
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
