"use client";

/**
 * CADCServiceMap — SVG county map of Oklahoma
 * Shows CADC service coverage by program, no external API required.
 * Tap a filter to see which counties that program serves.
 * Tap a highlighted county to see programs active there.
 */

import { useState } from "react";

// ─── County service data ──────────────────────────────────────────────────────

type ProgramKey =
  | "head-start"
  | "transit"
  | "weatherization"
  | "senior-nutrition"
  | "advantage"
  | "community-market"
  | "vita";

const PROGRAMS: { key: ProgramKey; label: string; icon: string; color: string }[] = [
  { key: "head-start",       label: "Head Start",        icon: "🏫", color: "#0101FF" },
  { key: "transit",          label: "Red River Transit",  icon: "🚌", color: "#059669" },
  { key: "weatherization",   label: "Weatherization",     icon: "🏠", color: "#d97706" },
  { key: "senior-nutrition", label: "Senior Nutrition",   icon: "🍽️", color: "#7c3aed" },
  { key: "advantage",        label: "Advantage Meals",    icon: "🚗", color: "#db2777" },
  { key: "community-market", label: "Community Market",   icon: "🛒", color: "#16a34a" },
  { key: "vita",             label: "VITA Tax Help",      icon: "📋", color: "#ea580c" },
];

// County → programs active there
// Sources: confirmed by CADC staff, Oct 2026 build
const COUNTY_PROGRAMS: Record<string, ProgramKey[]> = {
  // CADC base 9-county service area
  beckham:     ["head-start", "transit", "weatherization", "advantage"],
  canadian:    ["head-start", "transit", "weatherization", "advantage"],
  comanche:    ["head-start", "transit", "weatherization", "senior-nutrition", "advantage", "community-market"],
  cotton:      ["head-start", "transit", "weatherization", "senior-nutrition", "advantage"],
  jefferson:   ["head-start", "transit", "weatherization", "senior-nutrition", "advantage"],
  kiowa:       ["head-start", "transit", "weatherization", "advantage"],
  "roger-mills": ["head-start", "transit", "weatherization", "advantage"],
  tillman:     ["head-start", "transit", "weatherization", "senior-nutrition", "advantage"],
  washita:     ["head-start", "transit", "weatherization", "advantage"],
  // Transit extended counties (Red River Transportation)
  blaine:      ["transit"],
  caddo:       ["transit", "advantage"],
  custer:      ["transit", "advantage"],
  dewey:       ["transit"],
  ellis:       ["transit"],
  grady:       ["transit", "advantage"],
  harmon:      ["transit", "advantage"],
  jackson:     ["transit", "advantage"],
  mcclain:     ["transit", "advantage"],
  stephens:    ["transit", "advantage"],
  // Advantage extended counties
  greer:       ["advantage"],
  // Community Market
  "roger-mills-market": [],
};

// ─── SVG path data for Oklahoma counties (simplified, relative positions) ────
// Each county defined as [x%, y%, width%, height%] in a 100×60 coordinate space
// Approximate county grid layout for Oklahoma

interface CountyShape {
  id: string;
  name: string;
  // SVG rect approximation — Oklahoma counties are roughly uniform
  x: number;
  y: number;
  w: number;
  h: number;
}

// Oklahoma county grid — 11 columns × ~7 rows approximately
// Western panhandle + main body layout
const COUNTIES: CountyShape[] = [
  // PANHANDLE (top strip)
  { id: "cimarron",    name: "Cimarron",    x: 0,    y: 0,    w: 10.5, h: 8.5 },
  { id: "texas",       name: "Texas",       x: 10.5, y: 0,    w: 10.5, h: 8.5 },
  { id: "beaver",      name: "Beaver",      x: 21,   y: 0,    w: 10.5, h: 8.5 },

  // ROW 1 (NW corner down)
  { id: "harper",      name: "Harper",      x: 0,    y: 8.5,  w: 8,    h: 11 },
  { id: "woodward",    name: "Woodward",    x: 8,    y: 8.5,  w: 9,    h: 11 },
  { id: "woods",       name: "Woods",       x: 17,   y: 8.5,  w: 9,    h: 11 },
  { id: "alfalfa",     name: "Alfalfa",     x: 26,   y: 8.5,  w: 8,    h: 11 },
  { id: "major",       name: "Major",       x: 34,   y: 8.5,  w: 8,    h: 11 },
  { id: "garfield",    name: "Garfield",    x: 42,   y: 8.5,  w: 8,    h: 11 },
  { id: "grant",       name: "Grant",       x: 50,   y: 8.5,  w: 8,    h: 11 },
  { id: "kay",         name: "Kay",         x: 58,   y: 8.5,  w: 8,    h: 11 },
  { id: "osage",       name: "Osage",       x: 66,   y: 8.5,  w: 9,    h: 11 },
  { id: "washington",  name: "Washington",  x: 75,   y: 8.5,  w: 8,    h: 11 },
  { id: "nowata",      name: "Nowata",      x: 83,   y: 8.5,  w: 8,    h: 11 },
  { id: "craig",       name: "Craig",       x: 91,   y: 8.5,  w: 9,    h: 11 },

  // ROW 2
  { id: "ellis",       name: "Ellis",       x: 0,    y: 19.5, w: 8,    h: 11 },
  { id: "dewey",       name: "Dewey",       x: 8,    y: 19.5, w: 9,    h: 11 },
  { id: "blaine",      name: "Blaine",      x: 17,   y: 19.5, w: 9,    h: 11 },
  { id: "kingfisher",  name: "Kingfisher",  x: 26,   y: 19.5, w: 8,    h: 11 },
  { id: "canadian",    name: "Canadian",    x: 34,   y: 19.5, w: 8,    h: 11 },
  { id: "logan",       name: "Logan",       x: 42,   y: 19.5, w: 8,    h: 11 },
  { id: "payne",       name: "Payne",       x: 50,   y: 19.5, w: 8,    h: 11 },
  { id: "rogers",      name: "Rogers",      x: 58,   y: 19.5, w: 8,    h: 11 },
  { id: "mayes",       name: "Mayes",       x: 66,   y: 19.5, w: 9,    h: 11 },
  { id: "delaware",    name: "Delaware",    x: 75,   y: 19.5, w: 8,    h: 11 },
  { id: "ottawa",      name: "Ottawa",      x: 83,   y: 19.5, w: 17,   h: 11 },

  // ROW 3
  { id: "roger-mills", name: "Roger Mills", x: 0,    y: 30.5, w: 8,    h: 11 },
  { id: "custer",      name: "Custer",      x: 8,    y: 30.5, w: 9,    h: 11 },
  { id: "washita",     name: "Washita",     x: 17,   y: 30.5, w: 9,    h: 11 },
  { id: "caddo",       name: "Caddo",       x: 26,   y: 30.5, w: 8,    h: 11 },
  { id: "grady",       name: "Grady",       x: 34,   y: 30.5, w: 8,    h: 11 },
  { id: "mcclain",     name: "McClain",     x: 42,   y: 30.5, w: 8,    h: 11 },
  { id: "cleveland",   name: "Cleveland",   x: 50,   y: 30.5, w: 8,    h: 11 },
  { id: "pottawatomie",name: "Pottawatomie",x: 58,   y: 30.5, w: 8,    h: 11 },
  { id: "okfuskee",    name: "Okfuskee",    x: 66,   y: 30.5, w: 9,    h: 11 },
  { id: "okmulgee",    name: "Okmulgee",    x: 75,   y: 30.5, w: 8,    h: 11 },
  { id: "muskogee",    name: "Muskogee",    x: 83,   y: 30.5, w: 9,    h: 11 },
  { id: "cherokee",    name: "Cherokee",    x: 92,   y: 30.5, w: 8,    h: 11 },

  // ROW 4
  { id: "beckham",     name: "Beckham",     x: 0,    y: 41.5, w: 8,    h: 11 },
  { id: "kiowa",       name: "Kiowa",       x: 8,    y: 41.5, w: 9,    h: 11 },
  { id: "comanche",    name: "Comanche",    x: 17,   y: 41.5, w: 9,    h: 11 },
  { id: "stephens",    name: "Stephens",    x: 26,   y: 41.5, w: 8,    h: 11 },
  { id: "murray",      name: "Murray",      x: 34,   y: 41.5, w: 8,    h: 11 },
  { id: "garvin",      name: "Garvin",      x: 42,   y: 41.5, w: 8,    h: 11 },
  { id: "pontotoc",    name: "Pontotoc",    x: 50,   y: 41.5, w: 8,    h: 11 },
  { id: "seminole",    name: "Seminole",    x: 58,   y: 41.5, w: 8,    h: 11 },
  { id: "hughes",      name: "Hughes",      x: 66,   y: 41.5, w: 9,    h: 11 },
  { id: "mcintosh",    name: "McIntosh",    x: 75,   y: 41.5, w: 8,    h: 11 },
  { id: "haskell",     name: "Haskell",     x: 83,   y: 41.5, w: 9,    h: 11 },
  { id: "sequoyah",    name: "Sequoyah",    x: 92,   y: 41.5, w: 8,    h: 11 },

  // ROW 5 (Southern tier)
  { id: "harmon",      name: "Harmon",      x: 0,    y: 52.5, w: 8,    h: 11 },
  { id: "greer",       name: "Greer",       x: 8,    y: 52.5, w: 9,    h: 11 },
  { id: "tillman",     name: "Tillman",     x: 17,   y: 52.5, w: 9,    h: 11 },
  { id: "cotton",      name: "Cotton",      x: 26,   y: 52.5, w: 8,    h: 11 },
  { id: "jefferson",   name: "Jefferson",   x: 34,   y: 52.5, w: 8,    h: 11 },
  { id: "carter",      name: "Carter",      x: 42,   y: 52.5, w: 8,    h: 11 },
  { id: "johnston",    name: "Johnston",    x: 50,   y: 52.5, w: 8,    h: 11 },
  { id: "coal",        name: "Coal",        x: 58,   y: 52.5, w: 8,    h: 11 },
  { id: "atoka",       name: "Atoka",       x: 66,   y: 52.5, w: 9,    h: 11 },
  { id: "pittsburg",   name: "Pittsburg",   x: 75,   y: 52.5, w: 8,    h: 11 },
  { id: "latimer",     name: "Latimer",     x: 83,   y: 52.5, w: 9,    h: 11 },
  { id: "leflore",     name: "LeFlore",     x: 92,   y: 52.5, w: 8,    h: 11 },

  // ROW 6 (Southernmost)
  { id: "jackson",     name: "Jackson",     x: 8,    y: 63.5, w: 9,    h: 11 },
  { id: "love",        name: "Love",        x: 42,   y: 63.5, w: 8,    h: 11 },
  { id: "marshall",    name: "Marshall",    x: 50,   y: 63.5, w: 8,    h: 11 },
  { id: "bryan",       name: "Bryan",       x: 58,   y: 63.5, w: 8,    h: 11 },
  { id: "pushmataha",  name: "Pushmataha",  x: 75,   y: 63.5, w: 8,    h: 11 },
  { id: "mccurtain",   name: "McCurtain",   x: 83,   y: 63.5, w: 17,   h: 11 },
  { id: "choctaw",     name: "Choctaw",     x: 66,   y: 63.5, w: 9,    h: 11 },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function CADCServiceMap({ dark = false }: { dark?: boolean }) {
  const [activeFilter, setActiveFilter] = useState<ProgramKey | null>(null);
  const [hoveredCounty, setHoveredCounty] = useState<string | null>(null);
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);

  const c = {
    bg: dark ? "rgba(0,0,20,0.6)" : "#f8f9ff",
    border: dark ? "rgba(1,1,255,0.2)" : "#e0e4ff",
    countyFill: dark ? "rgba(255,255,255,0.04)" : "#f0f2ff",
    countyStroke: dark ? "rgba(1,1,255,0.15)" : "#c4caee",
    countyText: dark ? "rgba(255,255,255,0.35)" : "#9095b0",
    labelBg: dark ? "#0a0a2e" : "#ffffff",
    labelText: dark ? "white" : "#111827",
    labelBorder: dark ? "rgba(1,1,255,0.4)" : "#0101FF",
    headerText: dark ? "white" : "#111827",
    mutedText: dark ? "rgba(255,255,255,0.4)" : "#6b7280",
    filterBg: dark ? "rgba(255,255,255,0.06)" : "#ffffff",
    filterBorder: dark ? "rgba(1,1,255,0.2)" : "#e5e7eb",
    filterActiveBorder: dark ? "rgba(1,1,255,0.7)" : "#0101FF",
  };

  function getCountyColor(county: CountyShape): string {
    const programs = COUNTY_PROGRAMS[county.id] ?? [];
    if (programs.length === 0) return c.countyFill;

    if (activeFilter) {
      if (programs.includes(activeFilter)) {
        const prog = PROGRAMS.find(p => p.key === activeFilter);
        return prog ? prog.color + "55" : c.countyFill;
      }
      return c.countyFill;
    }

    // No filter — show all served counties in CADC blue
    return "rgba(1,1,255,0.18)";
  }

  function getCountyStroke(county: CountyShape): string {
    const programs = COUNTY_PROGRAMS[county.id] ?? [];
    if (programs.length === 0) return c.countyStroke;

    if (activeFilter) {
      if (programs.includes(activeFilter)) {
        const prog = PROGRAMS.find(p => p.key === activeFilter);
        return prog ? prog.color : "#0101FF";
      }
      return c.countyStroke;
    }
    return "rgba(1,1,255,0.4)";
  }

  const selectedPrograms = selectedCounty
    ? COUNTY_PROGRAMS[selectedCounty] ?? []
    : [];

  const selectedCountyName = selectedCounty
    ? COUNTIES.find(c => c.id === selectedCounty)?.name ?? selectedCounty
    : null;

  return (
    <div style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom: 14 }}>
        <p style={{ color: c.headerText, fontWeight: 800, fontSize: 15, margin: "0 0 4px" }}>
          CADC Service Area
        </p>
        <p style={{ color: c.mutedText, fontSize: 11, margin: 0 }}>
          Tap a program to highlight its service counties. Tap any county to see active programs.
        </p>
      </div>

      {/* Program filter chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
        <button
          onClick={() => { setActiveFilter(null); setSelectedCounty(null); }}
          style={{
            padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: "pointer",
            background: activeFilter === null ? "#0101FF" : c.filterBg,
            color: activeFilter === null ? "white" : c.mutedText,
            border: `1.5px solid ${activeFilter === null ? "#0101FF" : c.filterBorder}`,
            transition: "all 0.15s ease",
          }}
        >
          All Programs
        </button>
        {PROGRAMS.map(prog => (
          <button
            key={prog.key}
            onClick={() => { setActiveFilter(activeFilter === prog.key ? null : prog.key); setSelectedCounty(null); }}
            style={{
              padding: "5px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: "pointer",
              background: activeFilter === prog.key ? prog.color + "22" : c.filterBg,
              color: activeFilter === prog.key ? prog.color : c.mutedText,
              border: `1.5px solid ${activeFilter === prog.key ? prog.color : c.filterBorder}`,
              transition: "all 0.15s ease",
            }}
          >
            {prog.icon} {prog.label}
          </button>
        ))}
      </div>

      {/* SVG Map */}
      <div style={{
        background: c.bg, border: `1px solid ${c.border}`,
        borderRadius: 12, overflow: "hidden", position: "relative",
      }}>
        <svg
          viewBox="0 0 100 80"
          style={{ width: "100%", display: "block" }}
          aria-label="CADC Oklahoma county service area map"
        >
          {COUNTIES.map(county => {
            const served = (COUNTY_PROGRAMS[county.id] ?? []).length > 0;
            const isHovered = hoveredCounty === county.id;
            const isSelected = selectedCounty === county.id;
            const fill = getCountyColor(county);
            const stroke = getCountyStroke(county);
            const showLabel = county.w >= 8; // only label counties wide enough

            return (
              <g key={county.id}>
                <rect
                  x={county.x + 0.3}
                  y={county.y + 0.3}
                  width={county.w - 0.6}
                  height={county.h - 0.6}
                  rx={0.5}
                  fill={isSelected ? stroke : isHovered && served ? fill.replace("55","88") : fill}
                  stroke={isSelected || isHovered ? stroke : stroke}
                  strokeWidth={isSelected ? 0.6 : isHovered ? 0.5 : 0.3}
                  style={{ cursor: served ? "pointer" : "default", transition: "fill 0.15s ease" }}
                  onMouseEnter={() => served && setHoveredCounty(county.id)}
                  onMouseLeave={() => setHoveredCounty(null)}
                  onClick={() => served && setSelectedCounty(selectedCounty === county.id ? null : county.id)}
                />
                {showLabel && (
                  <text
                    x={county.x + county.w / 2}
                    y={county.y + county.h / 2 + 0.5}
                    textAnchor="middle"
                    fontSize={2.2}
                    fill={isSelected ? "white" : served ? (dark ? "rgba(255,255,255,0.7)" : "#374151") : c.countyText}
                    fontWeight={served ? "600" : "400"}
                    style={{ pointerEvents: "none", userSelect: "none" }}
                  >
                    {county.name.length > 9 ? county.name.slice(0, 8) + "…" : county.name}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* County detail popup */}
        {selectedCounty && selectedCountyName && (
          <div style={{
            position: "absolute", bottom: 12, left: 12, right: 12,
            background: c.labelBg, border: `2px solid ${c.labelBorder}`,
            borderRadius: 10, padding: "12px 16px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            animation: "fadeIn 0.2s ease",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
              <div>
                <p style={{ color: "#0101FF", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 4px" }}>
                  {selectedCountyName} County
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {selectedPrograms.map(key => {
                    const prog = PROGRAMS.find(p => p.key === key);
                    return prog ? (
                      <span key={key} style={{
                        fontSize: 10, fontWeight: 700, padding: "3px 8px",
                        borderRadius: 12, background: prog.color + "18",
                        color: prog.color, border: `1px solid ${prog.color}44`,
                      }}>
                        {prog.icon} {prog.label}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
              <button
                onClick={() => setSelectedCounty(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: c.mutedText, fontSize: 16, lineHeight: 1, padding: 2 }}
                aria-label="Close"
              >×</button>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginTop: 10, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: "rgba(1,1,255,0.18)", border: "1px solid rgba(1,1,255,0.4)" }} />
          <span style={{ fontSize: 10, color: c.mutedText }}>CADC serves this county</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: c.countyFill, border: `1px solid ${c.countyStroke}` }} />
          <span style={{ fontSize: 10, color: c.mutedText }}>Outside service area</span>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
