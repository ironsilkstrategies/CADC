/**
 * CADC Orbit Site — Full orbit-native shell
 * v2.00 — complete architectural rebuild
 *
 * Mobile:  white surface, centered orbit, bottom-sheet content panels
 * Desktop: deep-space dark viewport, particle field, split-panel layout
 *          left 40% orbit | right 60% content materialization
 *
 * Interaction model:
 *   Stage 0 → logo assembly animation (1.2s)
 *   Stage 1 → Main orbit  (8 program nodes)
 *   Stage 2 → Program orbit (sub-area nodes)
 *   Stage 3 → Content panel
 *   Back navigation collapses through stages
 */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import CADCServiceMap from "./CADCServiceMap";

// ─── Design tokens ────────────────────────────────────────────────────────────

const T = {
  blue:        "#0101FF",
  blueDark:    "#0000B8",
  blueLight:   "#E4E4FF",
  maroon:      "#CC0000",
  maroonDark:  "#8B0000",
  void:        "#F8F9FF",
  ghost:       "#F8F9FF",
  surface:     "#ffffff",
  border:      "#e5e7eb",
  textPrimary: "#111827",
  textMuted:   "#6b7280",
};

// ─── All program content ──────────────────────────────────────────────────────

interface SubArea {
  id: string;
  label: string;
  shortLabel: string;
  icon: string;
  content: React.ReactNode;
}

interface ProgramData {
  slug: string;
  name: string;
  shortName: string;
  icon: string;
  color: string;
  tagline: string;
  subAreas: SubArea[];
}

// ─── useIsDesktop hook (hoisted — used by MealCalendarPanel and main component) ─

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isDesktop;
}

// ─── Senior Nutrition Menu Data ───────────────────────────────────────────────
// To update: change month, year, and meals object only. Keys are YYYY-MM-DD.

const MENU_DATA = {
  month: "September",
  year: 2026,
  note: "8 oz milk served daily at all congregate sites",
  meals: {
    "2026-09-01": { headline: "Mexican Casserole", full: ["Mexican Casserole", "Tex Mex Rice", "Ranch Beans", "Chips", "Brownie"] },
    "2026-09-02": { headline: "Baked Rigatoni", full: ["Baked Rigatoni", "Corn", "Green Beans", "Garlic Bread", "Applesauce"] },
    "2026-09-03": { headline: "Chicken Pasta", full: ["Chicken Pasta", "Pickled Beets", "Mandarin Oranges", "Crackers", "Cake w/ Icing"] },
    "2026-09-04": { headline: "Chicken Fried Steak", full: ["Chicken Fried Steak", "Mashed Potatoes w/ Gravy", "Peas & Carrots", "Sliced Bread", "Fruit"] },
    "2026-09-07": { headline: "Breakfast Casserole", full: ["Breakfast Casserole", "Hash Brown Patty", "Biscuit w/ Gravy", "Sliced Pears", "Cottage Cheese"] },
    "2026-09-08": { headline: "Taco Spud", full: ["Taco Spud", "Baked Potato", "Mixed Veggies", "Dinner Roll", "Pudding Pan Pie"] },
    "2026-09-09": { headline: "BBQ Pork", full: ["BBQ Pork on Bun", "Baked Beans", "Potato Salad", "No Bake Cookie"] },
    "2026-09-10": { headline: "Brown Beans w/ Ham", full: ["Brown Beans w/ Ham", "Oven Fried Potatoes", "Zucchini/Tomatoes", "Cornbread", "Cobbler"] },
    "2026-09-11": { headline: "Meatloaf", full: ["Meatloaf", "Mashed Potatoes w/ Gravy", "Cali Mix", "Fruit", "Dinner Roll"] },
    "2026-09-14": { headline: "Cajun Pork Chop", full: ["Cajun Pork Chop", "Potato Casserole", "Baked Beans", "Sliced Bread", "Mandarin Orange Salad"] },
    "2026-09-15": { headline: "Chicken Teriyaki", full: ["Chicken Teriyaki", "Broccoli", "Carrots", "Rice Pilaf", "Pineapple", "Upside-Down Cake"] },
    "2026-09-16": { headline: "Pimento Cheese", full: ["Pimento Cheese", "Vegetable Soup", "Crackers", "Pears w/ Cottage Cheese", "Cake w/ Frosting"] },
    "2026-09-17": { headline: "Sliced Turkey", full: ["Sliced Turkey on Bun", "Tomato Soup", "Diced Peaches", "Peanut Butter Bar"] },
    "2026-09-18": { headline: "Salisbury Steak", full: ["Salisbury Steak", "Mashed Potatoes w/ Gravy", "Green Beans", "Dinner Roll", "Butterscotch Fluff"] },
    "2026-09-21": { headline: "Chicken Parmesan", full: ["Chicken Parmesan", "Spaghetti Noodles", "Carrots", "Broccoli", "Garlic Bread", "Pan Pie"] },
    "2026-09-22": { headline: "Tuna Salad", full: ["Tuna Salad on Croissant", "Pickled Beets", "Diced Peaches", "Macaroni Salad", "Cookie Bar"] },
    "2026-09-23": { headline: "Sausage Gravy", full: ["Sausage Gravy w/ Biscuit", "Zucchini/Tomatoes", "Fruit Salad"] },
    "2026-09-24": { headline: "Fried Fish", full: ["Fried Fish", "Potato Wedges", "Cole Slaw", "Hush Puppies", "Poke Cake"] },
    "2026-09-25": { headline: "Meatloaf", full: ["Meatloaf", "Mashed Potatoes w/ Gravy", "Green Beans", "Dinner Roll", "Pear Crisp"] },
    "2026-09-28": { headline: "Pulled Pork", full: ["Pulled Pork", "Baked Potato", "Mixed Vegetables", "Sliced Bread", "Cookies"] },
    "2026-09-29": { headline: "Chicken Salad", full: ["Chicken Salad", "Cottage Cheese", "Pickled Beets", "Crackers", "Fruit Salad", "Simply Super Cake"] },
    "2026-09-30": { headline: "Chicken & Noodles", full: ["Chicken & Noodles", "Carrots", "Peas", "Applesauce"] },
  } as Record<string, { headline: string; full: string[] }>,
};

// ─── Community Market Schedule Data ──────────────────────────────────────────
// To update: change month, year, and stops object only. Keys are YYYY-MM-DD.
// Each day can have multiple stops.

const MARKET_SCHEDULE_DATA = {
  month: "September",
  year: 2026,
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
  } as Record<string, { time: string; location: string }[]>,
};

// ─── Market Schedule Component ────────────────────────────────────────────────

function MarketSchedule({ dark }: { dark: boolean }) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const { month, year, note, transportation, stops } = MARKET_SCHEDULE_DATA;

  const firstDay = new Date(year, new Date(`${month} 1, ${year}`).getMonth(), 1);
  const lastDay = new Date(year, firstDay.getMonth() + 1, 0);
  const startOffset = firstDay.getDay();
  const totalDays = lastDay.getDate();

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  const monthNum = String(firstDay.getMonth() + 1).padStart(2, "0");
  function dateKey(day: number) {
    return `${year}-${monthNum}-${String(day).padStart(2, "0")}`;
  }

  const isWeekend = (dow: number) => dow === 0 || dow === 6;

  const c = {
    headerBg: T.blue,
    cellHasMeal: dark ? "rgba(1,1,255,0.15)" : "#EEF0FF",
    cellHasMealBorder: T.blue,
    dayNumMeal: dark ? "white" : "#111827",
    headline: dark ? "rgba(255,255,255,0.85)" : "#111827",
    weekend: dark ? "rgba(255,255,255,0.02)" : "#fafafa",
    weekendText: dark ? "rgba(255,255,255,0.15)" : "#d1d5db",
    cellBg: dark ? "rgba(255,255,255,0.04)" : "#ffffff",
    cellBorder: dark ? "rgba(255,255,255,0.08)" : "#e5e7eb",
    border: dark ? "rgba(1,1,255,0.2)" : "#C7C7FF",
    bg: dark ? "rgba(1,1,255,0.08)" : "#F0F0FF",
    dayLabel: dark ? "rgba(255,255,255,0.4)" : "#6b7280",
    dayNum: dark ? "rgba(255,255,255,0.5)" : "#9ca3af",
    note: dark ? "rgba(255,255,255,0.35)" : "#9ca3af",
    modalBg: dark ? "#00001A" : "#ffffff",
    modalBorder: T.blue,
    modalTitle: dark ? "white" : "#111827",
    modalItem: dark ? "rgba(255,255,255,0.75)" : "#374151",
    overlay: "rgba(0,0,0,0.72)",
  };

  const selectedStops = selectedDate ? stops[selectedDate] : null;
  const selectedDayNum = selectedDate ? parseInt(selectedDate.split("-")[2]) : null;

  return (
    <div style={{ position: "relative" }}>
      <div style={{ background: c.headerBg, borderRadius: "10px 10px 0 0", padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ color: "white", fontWeight: 800, fontSize: 13, letterSpacing: "0.05em" }}>{month} {year}</span>
        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, fontWeight: 600 }}>Tap a day to see stops</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", background: c.bg, borderLeft: `1px solid ${c.border}`, borderRight: `1px solid ${c.border}` }}>
        {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
          <div key={d} style={{ textAlign: "center", padding: "6px 2px", fontSize: 9, fontWeight: 700, color: c.dayLabel, textTransform: "uppercase", letterSpacing: "0.08em" }}>{d}</div>
        ))}
      </div>

      <div style={{ border: `1px solid ${c.border}`, borderTop: "none", borderRadius: "0 0 10px 10px", overflow: "hidden" }}>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", borderTop: wi === 0 ? "none" : `1px solid ${c.cellBorder}` }}>
            {week.map((day, di) => {
              const weekend = isWeekend(di);
              const key = day ? dateKey(day) : null;
              const hasStop = key ? !!stops[key] : false;
              const dayStops = key ? stops[key] : null;

              return (
                <div
                  key={di}
                  onClick={() => hasStop && key && setSelectedDate(key)}
                  style={{
                    minHeight: 52,
                    background: !day ? "transparent" : weekend ? c.weekend : hasStop ? c.cellHasMeal : c.cellBg,
                    borderLeft: di > 0 ? `1px solid ${c.cellBorder}` : "none",
                    borderTop: hasStop ? `2px solid ${c.cellHasMealBorder}` : "2px solid transparent",
                    cursor: hasStop ? "pointer" : "default",
                    padding: "5px 5px 4px",
                    display: "flex", flexDirection: "column", gap: 2,
                  }}
                >
                  {day && (
                    <>
                      <span style={{ fontSize: 9, fontWeight: 700, color: hasStop ? c.dayNumMeal : weekend ? c.weekendText : c.dayNum, lineHeight: 1 }}>{day}</span>
                      {dayStops && (
                        <span style={{ fontSize: 7, fontWeight: 600, color: c.headline, lineHeight: 1.3 }}>
                          {dayStops.map(s => s.location.split("—")[0].trim()).join(", ")}
                        </span>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <p style={{ fontSize: 10, color: c.note, margin: "8px 0 0", fontStyle: "italic" }}>{note}</p>

      {selectedDate && selectedStops && selectedDayNum && (
        <div
          onClick={() => setSelectedDate(null)}
          style={{ position: "fixed", inset: 0, zIndex: 200, background: c.overlay, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: c.modalBg, border: `2px solid ${c.modalBorder}`, borderRadius: 16, padding: 24, maxWidth: 320, width: "100%", boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <p style={{ color: T.blue, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 4px" }}>
                  {month} {selectedDayNum}, {year}
                </p>
                <h4 style={{ color: c.modalTitle, fontWeight: 800, fontSize: 16, margin: 0 }}>Market Stops Today</h4>
              </div>
              <button onClick={() => setSelectedDate(null)} style={{ background: "none", border: "none", cursor: "pointer", color: c.note, fontSize: 20, lineHeight: 1, padding: 4 }} aria-label="Close">×</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {selectedStops.map((stop, i) => (
                <div key={i} style={{ padding: "10px 14px", background: dark ? "rgba(1,1,255,0.12)" : "#EEF0FF", borderRadius: 10, borderLeft: `3px solid ${T.blue}` }}>
                  <p style={{ color: T.blue, fontSize: 10, fontWeight: 700, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.08em" }}>{stop.time}</p>
                  <p style={{ color: c.modalTitle, fontWeight: 700, fontSize: 14, margin: 0 }}>{stop.location}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14, padding: "10px 14px", background: dark ? "rgba(255,255,255,0.05)" : "#f9fafb", borderRadius: 10 }}>
              <p style={{ color: c.note, fontSize: 10, margin: "0 0 4px" }}>Need a ride?</p>
              <a href="tel:+15803745518" style={{ color: "#0101FF", fontWeight: 700, fontSize: 13, textDecoration: "none" }}>580-374-5518</a>
            </div>
            <p style={{ color: c.note, fontSize: 10, fontStyle: "italic", margin: "10px 0 0", textAlign: "center" }}>Tap outside to close</p>
          </div>
        </div>
      )}
    </div>
  );
}

function MarketSchedulePanel() {
  const isDesktop = useIsDesktop();
  return (
    <div className="cadc-content">
      <p style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 12, color: isDesktop ? "rgba(255,255,255,0.7)" : "#374151" }}>
        Tap any market day to see stop locations and times. Schedule updates monthly.
      </p>
      <MarketSchedule dark={isDesktop} />
      <div style={{ marginTop: 14, padding: "10px 14px", background: isDesktop ? "rgba(1,1,255,0.1)" : "#EEF0FF", borderRadius: 10 }}>
        <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.blue, margin: "0 0 6px" }}>Need a ride to the market?</p>
        <a href="tel:+15803745518" style={{ color: "#0101FF", fontWeight: 700, fontSize: 13, textDecoration: "none" }}>Call or text 580-374-5518</a>
      </div>
    </div>
  );
}



// ─── Meal Calendar Component ──────────────────────────────────────────────────

function MealCalendar({ dark }: { dark: boolean }) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const { month, year, note, meals } = MENU_DATA;

  // Build calendar grid — full weeks containing the month
  const firstDay = new Date(year, new Date(`${month} 1, ${year}`).getMonth(), 1);
  const lastDay = new Date(year, firstDay.getMonth() + 1, 0);
  const startOffset = firstDay.getDay(); // 0=Sun
  const totalDays = lastDay.getDate();

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  const monthNum = String(firstDay.getMonth() + 1).padStart(2, "0");

  function dateKey(day: number) {
    return `${year}-${monthNum}-${String(day).padStart(2, "0")}`;
  }

  const isWeekend = (dayOfWeek: number) => dayOfWeek === 0 || dayOfWeek === 6;

  // Styles derived from dark/light context
  const c = {
    bg: dark ? "rgba(1,1,255,0.08)" : "#f4f4ff",
    border: dark ? "rgba(1,1,255,0.2)" : "#d4d4f0",
    headerBg: dark ? "rgba(1,1,255,0.25)" : "#0101FF",
    headerText: "white",
    dayLabel: dark ? "rgba(255,255,255,0.4)" : "#6b7280",
    cellBg: dark ? "rgba(255,255,255,0.04)" : "#ffffff",
    cellBorder: dark ? "rgba(1,1,255,0.12)" : "#e5e7eb",
    cellHasMeal: dark ? "rgba(1,1,255,0.18)" : "#eeeeff",
    cellHasMealBorder: dark ? "rgba(1,1,255,0.4)" : "#0101FF",
    dayNum: dark ? "rgba(255,255,255,0.5)" : "#9ca3af",
    dayNumMeal: dark ? "white" : "#111827",
    headline: dark ? "rgba(255,255,255,0.85)" : "#111827",
    weekend: dark ? "rgba(255,255,255,0.02)" : "#fafafa",
    weekendText: dark ? "rgba(255,255,255,0.15)" : "#d1d5db",
    modalBg: dark ? "#0a0a2e" : "#ffffff",
    modalBorder: dark ? "rgba(1,1,255,0.4)" : "#0101FF",
    modalTitle: dark ? "white" : "#111827",
    modalItem: dark ? "rgba(255,255,255,0.7)" : "#374151",
    overlay: "rgba(0,0,10,0.72)",
    note: dark ? "rgba(255,255,255,0.35)" : "#9ca3af",
  };

  const selectedMeal = selectedDate ? meals[selectedDate] : null;
  const selectedDayNum = selectedDate ? parseInt(selectedDate.split("-")[2]) : null;

  return (
    <div style={{ position: "relative" }}>
      {/* Calendar header */}
      <div style={{ background: c.headerBg, borderRadius: "10px 10px 0 0", padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ color: c.headerText, fontWeight: 800, fontSize: 13, letterSpacing: "0.05em" }}>
          {month} {year}
        </span>
        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, fontWeight: 600 }}>Mon–Fri service</span>
      </div>

      {/* Day labels */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", background: c.bg, borderLeft: `1px solid ${c.border}`, borderRight: `1px solid ${c.border}` }}>
        {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
          <div key={d} style={{ textAlign: "center", padding: "6px 2px", fontSize: 9, fontWeight: 700, color: c.dayLabel, textTransform: "uppercase", letterSpacing: "0.08em" }}>{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ border: `1px solid ${c.border}`, borderTop: "none", borderRadius: "0 0 10px 10px", overflow: "hidden" }}>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", borderTop: wi === 0 ? "none" : `1px solid ${c.cellBorder}` }}>
            {week.map((day, di) => {
              const weekend = isWeekend(di);
              const key = day ? dateKey(day) : null;
              const hasMeal = key ? !!meals[key] : false;
              const meal = key ? meals[key] : null;

              return (
                <div
                  key={di}
                  onClick={() => hasMeal && key && setSelectedDate(key)}
                  style={{
                    minHeight: 52,
                    background: !day ? "transparent" : weekend ? c.weekend : hasMeal ? c.cellHasMeal : c.cellBg,
                    borderLeft: di > 0 ? `1px solid ${c.cellBorder}` : "none",
                    borderTop: hasMeal ? `2px solid ${c.cellHasMealBorder}` : "2px solid transparent",
                    cursor: hasMeal ? "pointer" : "default",
                    padding: "5px 5px 4px",
                    display: "flex", flexDirection: "column", gap: 2,
                    transition: "background 0.15s ease",
                  }}
                >
                  {day && (
                    <>
                      <span style={{ fontSize: 9, fontWeight: 700, color: hasMeal ? c.dayNumMeal : weekend ? c.weekendText : c.dayNum, lineHeight: 1 }}>{day}</span>
                      {meal && (
                        <span style={{ fontSize: 8, fontWeight: 600, color: c.headline, lineHeight: 1.3, wordBreak: "break-word" }}>{meal.headline}</span>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Note */}
      <p style={{ fontSize: 10, color: c.note, margin: "8px 0 0", fontStyle: "italic" }}>{note}</p>

      {/* Day detail modal */}
      {selectedDate && selectedMeal && selectedDayNum && (
        <div
          onClick={() => setSelectedDate(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 200,
            background: c.overlay,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 24,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: c.modalBg,
              border: `2px solid ${c.modalBorder}`,
              borderRadius: 16,
              padding: 24,
              maxWidth: 320,
              width: "100%",
              boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <p style={{ color: dark ? "rgba(1,1,255,0.9)" : "#0101FF", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 4px" }}>
                  {month} {selectedDayNum}, {year}
                </p>
                <h4 style={{ color: c.modalTitle, fontWeight: 800, fontSize: 17, margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}>
                  {selectedMeal.headline}
                </h4>
              </div>
              <button
                onClick={() => setSelectedDate(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: c.note, fontSize: 20, lineHeight: 1, padding: 4 }}
                aria-label="Close"
              >×</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {selectedMeal.full.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: dark ? "rgba(1,1,255,0.12)" : "#f0f0ff", borderRadius: 8 }}>
                  <span style={{ fontSize: 11 }}>{i === 0 ? "🍽️" : "·"}</span>
                  <span style={{ color: c.modalItem, fontSize: 13, fontWeight: i === 0 ? 700 : 400 }}>{item}</span>
                </div>
              ))}
            </div>
            <p style={{ color: c.note, fontSize: 10, fontStyle: "italic", margin: "12px 0 0", textAlign: "center" }}>Tap outside to close</p>
          </div>
        </div>
      )}
    </div>
  );
}

// MealCalendarPanel detects desktop (dark) vs mobile (light) context
function MealCalendarPanel() {
  const isDesktop = useIsDesktop();
  return (
    <div className="cadc-content">
      <p style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 12, color: isDesktop ? "rgba(255,255,255,0.7)" : "#374151" }}>
        Tap any day to see the full meal. Menu rotates monthly — check back for updates.
      </p>
      <MealCalendar dark={isDesktop} />
      <div style={{ marginTop: 14, padding: "10px 14px", background: isDesktop ? "rgba(1,1,255,0.1)" : "#f0f0ff", borderRadius: 10 }}>
        <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: isDesktop ? "rgba(204,0,0,0.9)" : "#CC0000", margin: "0 0 6px" }}>About our menus</p>
        <p style={{ fontSize: 12, color: isDesktop ? "rgba(255,255,255,0.7)" : "#374151", margin: 0, lineHeight: 1.6 }}>Menus are planned by a registered dietitian and reviewed quarterly by Laura Vardell and our site managers. Each menu cycle covers three months.</p>
      </div>
      <div style={{ marginTop: 10, padding: "10px 14px", background: isDesktop ? "rgba(1,1,255,0.1)" : "#f0f0ff", borderRadius: 10 }}>
        <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: isDesktop ? "rgba(204,0,0,0.9)" : "#CC0000", margin: "0 0 6px" }}>Questions about the menu?</p>
        <a href="tel:+15803355588" style={{ color: "#0101FF", fontWeight: 700, fontSize: 13, textDecoration: "none" }}>580-335-5588</a>
      </div>
    </div>
  );
}

// ServiceMapPanel — wraps CADCServiceMap with dark/light context detection
function ServiceMapPanel() {
  const isDesktop = useIsDesktop();
  return (
    <div className="cadc-content">
      <CADCServiceMap dark={isDesktop} />
    </div>
  );
}

// ─── Spring Physics Engine ────────────────────────────────────────────────────
// Real spring simulation: F = -k*x - d*v (Hooke's law + damping)
// Runs on requestAnimationFrame for silky 60fps motion

interface SpringState { value: number; velocity: number; target: number; }

function createSpring(value = 0): SpringState {
  return { value, velocity: 0, target: value };
}

function tickSpring(s: SpringState, stiffness = 200, damping = 26, dt = 0.016): SpringState {
  const force = -stiffness * (s.value - s.target) - damping * s.velocity;
  const velocity = s.velocity + force * dt;
  const value = s.value + velocity * dt;
  const settled = Math.abs(value - s.target) < 0.001 && Math.abs(velocity) < 0.001;
  return { value: settled ? s.target : value, velocity: settled ? 0 : velocity, target: s.target };
}

// Orbit node spring — governs scale, opacity, position offset
interface NodeSpring {
  scale: SpringState;
  opacity: SpringState;
  offsetX: SpringState;
  offsetY: SpringState;
  glow: SpringState;
}

function createNodeSpring(opacity = 0): NodeSpring {
  return {
    scale:   createSpring(0.4),
    opacity: createSpring(opacity),
    offsetX: createSpring(0),
    offsetY: createSpring(0),
    glow:    createSpring(0),
  };
}

// Particle burst on tap
interface Particle {
  id: number;
  x: number; y: number;
  vx: number; vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

function spawnParticles(cx: number, cy: number, count = 18): Particle[] {
  const colors = ["#0101FF","#4444FF","#8888FF","#CC0000","#ffffff"];
  return Array.from({length: count}, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
    const speed = 120 + Math.random() * 180;
    return {
      id: i,
      x: cx, y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      maxLife: 0.6 + Math.random() * 0.5,
      size: 2 + Math.random() * 3,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
  });
}

// Shockwave ring on tap
interface Shockwave {
  id: number;
  x: number; y: number;
  radius: number;
  maxRadius: number;
  life: number;
  color: string;
}

function spawnShockwaves(cx: number, cy: number): Shockwave[] {
  return [
    {id:0, x:cx, y:cy, radius:0, maxRadius:120, life:1, color:"rgba(1,1,255,0.7)"},
    {id:1, x:cx, y:cy, radius:0, maxRadius:200, life:1, color:"rgba(1,1,255,0.4)"},
    {id:2, x:cx, y:cy, radius:0, maxRadius:300, life:1, color:"rgba(204,0,0,0.25)"},
  ];
}

// ─── Canvas Overlay Component ─────────────────────────────────────────────────
// Renders particles + shockwaves on a canvas overlay

function CanvasOverlay({ particles, shockwaves, width, height }: {
  particles: Particle[];
  shockwaves: Shockwave[];
  width: number;
  height: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    // Draw shockwaves
    shockwaves.forEach(sw => {
      if (sw.life <= 0) return;
      const progress = 1 - sw.life;
      const r = sw.maxRadius * progress;
      const alpha = sw.life * 0.8;
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, r, 0, Math.PI * 2);
      ctx.strokeStyle = sw.color.replace(/[\d.]+\)$/, `${alpha})`);
      ctx.lineWidth = 2 * sw.life;
      ctx.stroke();
    });

    // Draw particles
    particles.forEach(p => {
      if (p.life <= 0) return;
      const alpha = p.life;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fillStyle = p.color.replace(")", `,${alpha})`).replace("rgb(","rgba(") || `rgba(1,1,255,${alpha})`;
      ctx.fill();
      // Glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(1,1,255,${alpha * 0.2})`;
      ctx.fill();
    });
  }, [particles, shockwaves, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:20, opacity: 0.35 }}
    />
  );
}

// ─── Spring Orbit Component ───────────────────────────────────────────────────
// Full spring-physics driven orbit with particles, shockwaves, magnetic hover

function SpringOrbit({ stage, activeProgram, availablePrograms, glowNode, popNode, beamNode, orbitTx, assembled, tapProgram, tapSubArea, isMobile = false }: {
  stage: Stage; activeProgram: ProgramData | null; availablePrograms: ProgramData[];
  glowNode: string | null; popNode: string | null; beamNode: string | null;
  orbitTx: TransitionState; assembled: boolean;
  tapProgram: (p: ProgramData) => void; tapSubArea: (a: SubArea) => void;
  isMobile?: boolean;
}) {
  const isSubLevel = stage === "program" || stage === "content";
  const items = isSubLevel ? (activeProgram?.subAreas ?? []) : availablePrograms;

  // Spring states for each node (keyed by id/slug)
  const nodeSpringMap = useRef<Map<string, NodeSpring>>(new Map());
  const rafRef = useRef<number>(0);
  const [, forceUpdate] = useState(0);

  // Particle / shockwave state
  const [particles, setParticles] = useState<Particle[]>([]);
  const [shockwaves, setShockwaves] = useState<Shockwave[]>([]);

  // Orbit slow rotation angle
  const idleAngle = useRef(0);
  const lastTime = useRef(performance.now());

  // Mouse position for magnetic effect
  const mouseRef = useRef<{x:number;y:number}>({x:-9999,y:-9999});
  const containerRef = useRef<HTMLDivElement>(null);

  // Hub spring
  const hubScale = useRef(createSpring(0));
  const hubGlow = useRef(createSpring(0));
  const hubPulse = useRef(0);

  const RADIUS = isMobile ? 36 : 38;
  const SIZE = isMobile ? "min(92vw,400px)" : "min(80vw,420px)";
  const NODE_SIZE = isMobile ? 42 : 58;

  // Initialize / sync node springs when items change
  useEffect(() => {
    const newMap = new Map<string, NodeSpring>();
    items.forEach((item, i) => {
      const id = isSubLevel ? (item as SubArea).id : (item as ProgramData).slug;
      const existing = nodeSpringMap.current.get(id);
      if (existing) {
        newMap.set(id, existing);
      } else {
        newMap.set(id, createNodeSpring(0));
      }
      // Target: visible
      const spring = newMap.get(id)!;
      spring.scale.target = 1;
      spring.opacity.target = 1;
    });
    // Fade out removed nodes
    nodeSpringMap.current.forEach((spring, id) => {
      if (!newMap.has(id)) {
        spring.scale.target = 0;
        spring.opacity.target = 0;
        newMap.set(id, spring);
      }
    });
    nodeSpringMap.current = newMap;
    hubScale.current.target = 1;
    hubGlow.current.target = 1;
  }, [items.length, stage]);

  // Handle orbitTx transitions
  useEffect(() => {
    if (orbitTx === "out") {
      nodeSpringMap.current.forEach(spring => {
        spring.scale.target = 0.2;
        spring.opacity.target = 0;
        spring.offsetX.target = (Math.random() - 0.5) * 40;
        spring.offsetY.target = (Math.random() - 0.5) * 40;
      });
      hubScale.current.target = 1.3;
      hubGlow.current.target = 2;
    } else if (orbitTx === "in") {
      setTimeout(() => {
        nodeSpringMap.current.forEach((spring, _id) => {
          spring.scale.target = 1;
          spring.opacity.target = 1;
          spring.offsetX.target = 0;
          spring.offsetY.target = 0;
        });
        hubScale.current.target = 1;
        hubGlow.current.target = 1;
      }, 80);
    }
  }, [orbitTx]);

  // Handle popNode — spring burst
  useEffect(() => {
    if (!popNode) return;
    const spring = nodeSpringMap.current.get(popNode);
    if (spring) {
      spring.scale.target = 1.5;
      spring.glow.target = 1;
      setTimeout(() => {
        if (spring) { spring.scale.target = 1; spring.glow.target = 0; }
      }, 400);
    }
  }, [popNode]);

  // Main animation loop
  useEffect(() => {
    let frameId: number;

    function loop(now: number) {
      const dt = Math.min((now - lastTime.current) / 1000, 0.05);
      lastTime.current = now;

      // Idle orbit rotation — slow drift
      if (orbitTx === "idle" && assembled) {
        idleAngle.current += dt * 0.06; // ~3.4° per second
      }

      // Hub pulse
      hubPulse.current += dt * 2.4;

      // Tick hub springs
      hubScale.current = tickSpring(hubScale.current, 180, 22, dt);
      hubGlow.current = tickSpring(hubGlow.current, 120, 18, dt);

      // Get container rect for mouse offset
      const rect = containerRef.current?.getBoundingClientRect();

      // Tick node springs + magnetic
      let needsUpdate = false;
      nodeSpringMap.current.forEach((spring, id) => {
        const idx = items.findIndex(item =>
          isSubLevel ? (item as SubArea).id === id : (item as ProgramData).slug === id
        );
        if (idx === -1) return;

        const baseAngle = (idx / items.length) * Math.PI * 2;
        const angle = baseAngle + idleAngle.current;
        const pct = RADIUS; // percent of orbit
        const cx = 50 + Math.cos(angle) * pct; // 0-100 space
        const cy = 50 + Math.sin(angle) * pct;

        // Magnetic hover
        if (rect && stage !== "entry" && stage !== "map") {
          const svgW = rect.width;
          const svgH = rect.height; // orbit is square
          const nodePixX = (cx / 100) * svgW;
          const nodePixY = (cy / 100) * svgH;
          const mx = mouseRef.current.x - rect.left;
          const my = mouseRef.current.y - rect.top;
          const dist = Math.hypot(mx - nodePixX, my - nodePixY);
          const magnetRadius = 60;
          if (dist < magnetRadius) {
            const strength = (1 - dist / magnetRadius) * 8;
            spring.offsetX.target = (mx - nodePixX) * strength / NODE_SIZE;
            spring.offsetY.target = (my - nodePixY) * strength / NODE_SIZE;
          } else {
            spring.offsetX.target = 0;
            spring.offsetY.target = 0;
          }
        }

        const prev = { ...spring };
        spring.scale   = tickSpring(spring.scale,   220, 24, dt);
        spring.opacity = tickSpring(spring.opacity,  160, 20, dt);
        spring.offsetX = tickSpring(spring.offsetX,  300, 32, dt);
        spring.offsetY = tickSpring(spring.offsetY,  300, 32, dt);
        spring.glow    = tickSpring(spring.glow,     180, 28, dt);

        if (
          Math.abs(prev.scale.value - spring.scale.value) > 0.0001 ||
          Math.abs(prev.opacity.value - spring.opacity.value) > 0.0001
        ) needsUpdate = true;
      });

      // Tick particles
      setParticles(prev => {
        const next = prev
          .map(p => ({
            ...p,
            x: p.x + p.vx * dt,
            y: p.y + p.vy * dt,
            vx: p.vx * 0.92,
            vy: p.vy * 0.92 + 60 * dt, // gravity
            life: p.life - dt / p.maxLife,
          }))
          .filter(p => p.life > 0);
        return next.length !== prev.length || next.some((p,i) => Math.abs(p.life - prev[i]?.life) > 0.001)
          ? next : prev;
      });

      // Tick shockwaves
      setShockwaves(prev => {
        const next = prev
          .map((sw, i) => ({
            ...sw,
            life: sw.life - dt / (0.5 + i * 0.15),
          }))
          .filter(sw => sw.life > 0);
        return next.length !== prev.length ? next : prev;
      });

      if (needsUpdate) forceUpdate(n => n + 1);

      frameId = requestAnimationFrame(loop);
    }

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [items.length, stage, orbitTx, assembled, isSubLevel]);

  // Mouse tracking
  useEffect(() => {
    function onMove(e: MouseEvent) { mouseRef.current = {x: e.clientX, y: e.clientY}; }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  function handleNodeTap(item: ProgramData | SubArea, e: React.MouseEvent | React.TouchEvent) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    // Spawn burst
    setParticles(prev => [...prev, ...spawnParticles(cx, cy)]);
    setShockwaves(spawnShockwaves(cx, cy));
    if (isSubLevel) tapSubArea(item as SubArea);
    else tapProgram(item as ProgramData);
  }

  const hubS = hubScale.current.value;
  const hubG = hubGlow.current.value;
  const pulseAlpha = (Math.sin(hubPulse.current) * 0.5 + 0.5) * 0.4;

  return (
    <div ref={containerRef} style={{ position:"relative", width: SIZE, aspectRatio:"1/1", margin:"0 auto" }}>

      {/* Particle/shockwave canvas */}
      <CanvasOverlay
        particles={particles}
        shockwaves={shockwaves}
        width={isMobile ? 400 : 420}
        height={isMobile ? 400 : 420}
      />

      {/* Ambient rings */}
      <div style={{
        position:"absolute", inset:"6%", borderRadius:"50%",
        border:"1px solid rgba(1,1,255,0.12)",
        boxShadow:`0 0 ${40 + hubG*20}px rgba(1,1,255,${0.06 + pulseAlpha*0.1})`,
        pointerEvents:"none",
      }}/>
      <div style={{
        position:"absolute", inset:"18%", borderRadius:"50%",
        border:`1px solid rgba(1,1,255,${0.06 + pulseAlpha * 0.15})`,
        pointerEvents:"none",
      }}/>

      {/* SVG connector lines */}
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",overflow:"visible"}} viewBox="0 0 100 100" aria-hidden>
        {items.map((item, i) => {
          const id = isSubLevel ? (item as SubArea).id : (item as ProgramData).slug;
          const spring = nodeSpringMap.current.get(id);
          const baseAngle = (i / items.length) * Math.PI * 2;
          const angle = baseAngle + idleAngle.current;
          const x = 50 + Math.cos(angle) * RADIUS;
          const y = 50 + Math.sin(angle) * RADIUS;
          const isGlowing = id === glowNode || id === popNode;
          const opacity = spring?.opacity.value ?? 0;
          return (
            <line key={id}
              x1={50} y1={50} x2={x} y2={y}
              stroke={isGlowing ? "rgba(1,1,255,0.7)" : `rgba(1,1,255,${0.08 + pulseAlpha * 0.12})`}
              strokeWidth={isGlowing ? 1.2 : 0.5}
              strokeDasharray="2 3"
              opacity={opacity}
              style={{transition:"stroke 0.3s,stroke-width 0.3s"}}
            />
          );
        })}
      </svg>

      {/* Hub center */}
      <div style={{
        position:"absolute", left:"50%", top:"50%",
        width: isMobile ? "clamp(60px,18vw,80px)" : "clamp(72px,16%,88px)",
        aspectRatio:"1/1",
        transform:`translate(-50%,-50%) scale(${hubS})`,
        borderRadius:"50%",
        background: isMobile ? "white" : T.void,
        border:`2.5px solid ${T.blue}`,
        boxShadow:`0 0 0 ${8*hubG}px rgba(1,1,255,${0.04+pulseAlpha*0.08}), 0 0 ${40*hubG}px rgba(1,1,255,${0.2+pulseAlpha*0.15}), inset 0 0 20px rgba(1,1,255,${0.05+pulseAlpha*0.05})`,
        display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,
        transition:"transform 0s", // let spring handle it
      }}>
        <span style={{fontSize: isMobile ? "clamp(1rem,5vw,1.4rem)" : "clamp(1rem,2.5vw,1.4rem)"}}>
          {isSubLevel ? activeProgram?.icon : "🏛️"}
        </span>
        <span style={{
          color:T.blue,
          fontSize: isMobile ? "clamp(0.35rem,1.8vw,0.5rem)" : "clamp(0.35rem,0.8vw,0.5rem)",
          fontWeight:800, letterSpacing:"0.1em", textTransform:"uppercase",
          textAlign:"center", padding:"0 4px", lineHeight:1.2,
          opacity: orbitTx === "out" ? 0 : 1,
          transition:"opacity 0.2s ease",
        }}>
          {isSubLevel ? activeProgram?.shortName : "CADC"}
        </span>
      </div>

      {/* Orbit nodes */}
      {items.map((item, i) => {
        const id = isSubLevel ? (item as SubArea).id : (item as ProgramData).slug;
        const label = isSubLevel ? (item as SubArea).shortLabel : (item as ProgramData).shortName;
        const icon = isSubLevel ? (item as SubArea).icon : (item as ProgramData).icon;
        const spring = nodeSpringMap.current.get(id) ?? createNodeSpring(0);

        const baseAngle = (i / items.length) * Math.PI * 2;
        const angle = baseAngle + idleAngle.current;
        const x = 50 + Math.cos(angle) * RADIUS;
        const y = 50 + Math.sin(angle) * RADIUS;

        const sc = spring.scale.value;
        const op = spring.opacity.value;
        const ox = spring.offsetX.value;
        const oy = spring.offsetY.value;
        const glow = spring.glow.value;
        const isActive = id === popNode || id === glowNode;

        return (
          <button
            key={id}
            onClick={(e) => handleNodeTap(item, e)}
            aria-label={label}
            style={{
              position:"absolute",
              left:`${x}%`, top:`${y}%`,
              width: isMobile ? "clamp(48px,13vw,64px)" : "clamp(52px,11%,68px)",
              transform:`translate(calc(-50% + ${ox}px), calc(-50% + ${oy}px)) scale(${sc})`,
              display:"flex",flexDirection:"column",alignItems:"center",gap: isMobile?3:5,
              background:"none",border:"none",cursor:"pointer",padding:0,
              opacity: op,
              zIndex: isActive ? 10 : 1,
              transition:"none", // springs handle everything
            }}
          >
            {/* Glow ring */}
            {glow > 0.01 && (
              <div style={{
                position:"absolute",inset:`${-12*glow}px`,borderRadius:"50%",
                background:`radial-gradient(circle, rgba(1,1,255,${0.5*glow}) 0%, transparent 65%)`,
                pointerEvents:"none",
              }}/>
            )}
            {/* Node disc */}
            <div className="node-disc" style={{
              width: isMobile ? "clamp(34px,10vw,48px)" : "clamp(44px,9.5%,60px)",
              aspectRatio:"1/1", borderRadius:"50%",
              background: isActive ? "#E4E4FF" : isMobile ? "white" : "rgba(1,5,30,0.9)",
              border:`${isActive?3:2}px solid ${T.blue}`,
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize: isMobile ? "clamp(0.85rem,4vw,1.1rem)" : "clamp(1rem,2vw,1.3rem)",
              boxShadow: isActive
                ? `0 0 24px rgba(1,1,255,0.7), 0 0 48px rgba(1,1,255,0.3), inset 0 0 12px rgba(1,1,255,0.1)`
                : `0 0 ${8+glow*20}px rgba(1,1,255,${0.15+glow*0.3}), 0 4px 16px rgba(0,0,0,0.3)`,
              transition:"box-shadow 0.2s ease, background 0.15s ease, border-color 0.15s ease",
            }}>
              {icon}
            </div>
            <span style={{
              color: T.blue,
              fontSize: isMobile ? "clamp(0.36rem,1.6vw,0.48rem)" : "clamp(0.38rem,0.85vw,0.52rem)",
              fontWeight: isActive ? 800 : 700,
              textTransform:"uppercase", letterSpacing:"0.05em",
              textAlign:"center", lineHeight:1.2,
              width: isMobile ? "clamp(48px,13vw,64px)" : "clamp(52px,11%,68px)",
              overflowWrap:"break-word",
              textShadow: isMobile ? "none" : isActive ? "0 0 12px rgba(1,1,255,0.8)" : "0 0 8px rgba(1,1,255,0.3)",
            }}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}


// ─── Photo Registry ───────────────────────────────────────────────────────────
// UPLOAD INSTRUCTIONS:
// 1. Create folder: public/images/ in your GitHub repo
// 2. Upload each photo file, rename to match the path below
// 3. Photos go live automatically on next deploy
//
// Naming convention: /images/[program]-[description].jpg
// All paths are relative to /public/

const PHOTOS = {
  // ── Senior Nutrition ──────────────────────────────────────────────────────
  seniorNutrition: {
    // Kitchen staff in green uniforms, hairnets, serving line — action shot
    kitchenStaff:     "/images/senior-kitchen-staff.jpg",
    // Elegant ornate dining room (Frederick site) — full house, blue walls
    frederickDining:  "/images/senior-dining-frederick.jpg",
    // Full house wide shot same ornate room — community feeling
    frederickWide:    "/images/senior-dining-frederick-wide.jpg",
    // Wood paneling dining room, red chairs — Ryan/Ringling site
    communityDining:  "/images/senior-dining-community.jpg",
    // Blue accent walls, group at table — Cache/Temple site
    groupDining:      "/images/senior-dining-group.jpg",
    // Seniors doing puzzle at table — social engagement
    puzzle:           "/images/senior-social-puzzle.jpg",
    // Patriotic holiday setup — community events angle
    patrioticSetup:   "/images/senior-patriotic-event.jpg",
  },

  // ── Community Market ──────────────────────────────────────────────────────
  communityMarket: {
    // 42-foot trailer exterior with truck, church backdrop — hero
    trailerHero:      "/images/market-trailer-exterior.jpg",
    // Fresh produce shelving — watermelons, apples, sweet potatoes
    freshProduce:     "/images/market-fresh-produce.jpg",
    // Refrigerated produce case — grapes, squash, peppers, tomatoes
    refrigeratedProduce: "/images/market-refrigerated-produce.jpg",
    // Frozen foods case — peaches, broccoli, ice cream bars
    frozen:           "/images/market-frozen-foods.jpg",
    // Frozen meals case — burritos, fish sticks, chicken
    frozenMeals:      "/images/market-frozen-meals.jpg",
    // Dairy/refrigerated — eggs, butter, milk, yogurt
    dairy:            "/images/market-dairy.jpg",
    // Dry goods shelving — cereals, snacks, pantry
    dryGoods:         "/images/market-dry-goods.jpg",
    // HBA/household — toothbrushes, cleaning, toilet paper
    household:        "/images/market-household.jpg",
  },

  // ── Head Start (placeholder — photos coming from Robin/Tarra) ─────────────
  headStart: {
    classroomActivity: "/images/headstart-classroom.jpg",
    outdoorPlay:       "/images/headstart-outdoor.jpg",
    familyEngagement:  "/images/headstart-family.jpg",
  },
} as const;

// ─── Program Hero Banner ──────────────────────────────────────────────────────
// Displays at top of program content panel (Option B of photo strategy)
// Photo strips with parallax-style overlay and program identity

function ProgramHeroBanner({ slug, dark }: { slug: string; dark: boolean }) {
  // Map program slug to hero photo + caption
  const heroMap: Record<string, { src: string; caption: string; credit?: string }> = {
    "senior-meals": {
      src: PHOTOS.seniorNutrition.frederickDining,
      caption: "Congregate dining at our Frederick center",
    },
    "community-market": {
      src: PHOTOS.communityMarket.trailerHero,
      caption: "The CADC Community Market — bringing fresh food to 22 communities",
    },
    "head-start": {
      src: PHOTOS.headStart.classroomActivity,
      caption: "Early childhood education across 11 CADC centers",
    },
  };

  const hero = heroMap[slug];
  if (!hero) return null;

  return (
    <div style={{
      position: "relative", width: "100%", height: 180,
      borderRadius: 14, overflow: "hidden", marginBottom: 20,
      background: dark ? "rgba(1,1,255,0.1)" : "#e8eaff",
      animation: "fadeSlideIn 0.5s ease",
    }}>
      <img
        src={hero.src}
        alt={hero.caption}
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        style={{
          width: "100%", height: "100%", objectFit: "cover",
          objectPosition: "center",
          display: "block",
        }}
      />
      {/* Gradient overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: dark
          ? "linear-gradient(to top, rgba(0,0,20,0.85) 0%, rgba(0,0,20,0.2) 60%, transparent 100%)"
          : "linear-gradient(to top, rgba(0,0,60,0.75) 0%, rgba(0,0,60,0.1) 60%, transparent 100%)",
      }}/>
      {/* Caption */}
      <p style={{
        position: "absolute", bottom: 10, left: 14, right: 14,
        color: "rgba(255,255,255,0.85)", fontSize: 10, fontWeight: 600,
        fontStyle: "italic", margin: 0, letterSpacing: "0.03em",
        textShadow: "0 1px 4px rgba(0,0,0,0.5)",
      }}>{hero.caption}</p>
    </div>
  );
}

// ─── Inline Photo Strip ───────────────────────────────────────────────────────
// Used inside sub-area content — horizontal scrollable photo row
// Place anywhere inside a cadc-content div

function PhotoStrip({ photos, dark }: {
  photos: { src: string; alt: string }[];
  dark: boolean;
}) {
  return (
    <div style={{
      display: "flex", gap: 8, overflowX: "auto", margin: "14px 0",
      paddingBottom: 6,
      scrollbarWidth: "none",
    }}>
      {photos.map((photo, i) => (
        <div key={i} style={{
          flex: "0 0 auto", width: 140, height: 100,
          borderRadius: 10, overflow: "hidden",
          background: dark ? "rgba(1,1,255,0.1)" : "#e8eaff",
          border: `1px solid ${dark ? "rgba(1,1,255,0.2)" : "#d0d4f0"}`,
        }}>
          <img
            src={photo.src}
            alt={photo.alt}
            onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = "none"; }}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
      ))}
    </div>
  );
}

// ─── Photo Grid ───────────────────────────────────────────────────────────────
// 2-column grid for program sub-areas with more space

function PhotoGrid({ photos, dark }: {
  photos: { src: string; alt: string }[];
  dark: boolean;
}) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "1fr 1fr",
      gap: 8, margin: "14px 0",
    }}>
      {photos.slice(0, 4).map((photo, i) => (
        <div key={i} style={{
          borderRadius: 10, overflow: "hidden", aspectRatio: "4/3",
          background: dark ? "rgba(1,1,255,0.1)" : "#e8eaff",
          border: `1px solid ${dark ? "rgba(1,1,255,0.2)" : "#d0d4f0"}`,
          gridColumn: i === 0 && photos.length >= 3 ? "1 / span 2" : "auto",
        }}>
          <img
            src={photo.src}
            alt={photo.alt}
            onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = "none"; }}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
      ))}
    </div>
  );
}



const PROGRAMS: ProgramData[] = [

  // ── 1. HEAD START ──────────────────────────────────────────────────────────
  {
    slug: "head-start",
    name: "Head Start & Early Head Start",
    shortName: "Head Start",
    icon: "🏫",
    color: T.blue,
    tagline: "Free early childhood education across 11 centers",
    subAreas: [
      {
        id: "ehs", label: "Early Head Start", shortLabel: "EHS", icon: "🤱",
        content: (
          <div className="cadc-content">
            <p>Early Head Start provides a comprehensive, age-appropriate program for infants, toddlers, and pregnant women from birth to age 3. Our approach supports the whole child — social-emotional, cognitive, physical, and language development are interconnected from the earliest stages of life.</p>
            <p>Families are valued as essential partners. Parents are encouraged to participate in daily routines, volunteer in classrooms, and stay engaged throughout the year.</p>
            <div className="cadc-card">
              <p className="cadc-label">Provided at no cost while children are in care</p>
              <ul className="cadc-list">
                {["Formula for infants","Diapers","Wipes","Nutritious meals and snacks","Developmental screenings and individualized support"].map(i=><li key={i}>{i}</li>)}
              </ul>
            </div>
          </div>
        ),
      },
      {
        id: "hs", label: "Head Start Preschool", shortLabel: "Preschool", icon: "📖",
        content: (
          <div className="cadc-content">
            <p>Head Start serves children ages 3–5 with full-day, full-year preschool at no cost to income-eligible families. Every child receives education, health, nutrition, and family support — all in one place.</p>
            <div className="cadc-grid-2">
              {["Full-day preschool at no cost","Health screenings","Nutritious meals daily","Family engagement","School readiness goals","Individualized learning plans"].map(i=><div key={i} className="cadc-chip">{i}</div>)}
            </div>
          </div>
        ),
      },
      {
        id: "apply", label: "How to Apply", shortLabel: "Apply", icon: "📝",
        content: (
          <div className="cadc-content">
            <p>Enrollment is open year-round. Applications are reviewed on a rolling basis — spaces fill quickly. Apply as early as possible.</p>
            <div className="cadc-card">
              <p className="cadc-label">What you'll need</p>
              <ul className="cadc-list">
                {["Birth certificate or other proof of birth","Proof of residency (utility bill or address document)","Proof of SNAP, SSI, or TANF benefits (if applicable)","SoonerCare or private insurance information","Proof of income if you do not receive SNAP benefits","Immunization record","Proof of disability or special services (Speech, PT, OT)","Foster care document (if applicable)"].map(i=><li key={i}>{i}</li>)}
              </ul>
            </div>
            <p className="cadc-note">This program is provided at no cost to the parent or guardian.</p>
            <a href="https://childplus.com" target="_blank" rel="noopener noreferrer" className="cadc-btn">Start Application (ChildPlus) →</a>
          </div>
        ),
      },
      {
        id: "enrollment", label: "Who Qualifies", shortLabel: "Qualifies", icon: "✅",
        content: (
          <div className="cadc-content">
            <p>EHS serves pregnant mothers and children from birth to age 3. Head Start serves children ages 3–5.</p>
            <div className="cadc-card">
              <p className="cadc-label">Automatically eligible</p>
              <p>Children are automatically eligible if they are in foster care, unhoused, or from families who receive Public Assistance (SNAP, SSI, or TANF).</p>
            </div>
            <div className="cadc-card">
              <p className="cadc-label">All families are encouraged to apply</p>
              <p>Enrollment is based on a points system that considers many circumstances beyond the automatic eligibility categories above. We serve all children — don't count yourself out before you apply.</p>
            </div>
            <a href="https://childplus.com" target="_blank" rel="noopener noreferrer" className="cadc-btn">Apply Now →</a>
          </div>
        ),
      },
      {
        id: "ehs-education", label: "EHS Education", shortLabel: "EHS Ed", icon: "🧸",
        content: (
          <div className="cadc-content">
            <p>Our Early Head Start education approach supports infants and toddlers across all developmental domains using evidence-based tools and individualized instruction.</p>
            <div className="cadc-stack">
              {[
                {t:"Brigance Developmental Screening",d:"Every child is screened within the first 45 days using the Brigance Early Childhood Screener — a standardized tool identifying strengths and areas for support across all developmental domains. Aligned with 45 CFR §1302.33."},
                {t:"Individualized Goals",d:"Lesson plans and learning goals are created for each child based on Brigance results, DRDP assessment data, daily observations, and family input. No two children receive the same plan. Standards §1302.33 and §1302.32."},
                {t:"Frog Street Infant/Toddler Curriculum",d:"A nationally recognized, credential-based curriculum supporting language & early literacy, cognitive development, social-emotional skills, approaches to learning, and physical development. Standards §1302.33 and §1302.32."},
                {t:"DRDP Assessment",d:"A strength-based assessment tool measuring what children can do — not comparing against age norms. Completed three times per year (Fall, Winter, Spring). Staff document approximately 15% of each child's measures weekly through observations. Standards §1302.33 and §1302.32."},
                {t:"Conscious Discipline — Baby Doll Circle Time",d:"A Conscious Discipline strategy using baby dolls to model nurturing interactions, build attachment, and teach self-regulation. Children develop empathy, connection, and emotional awareness through consistent rituals and predictable routines. Standard 45 CFR §1302.32 and §1302.33."},
              ].map(i=><div key={i.t} className="cadc-card-sm"><p className="cadc-card-title">{i.t}</p><p>{i.d}</p></div>)}
            </div>
          </div>
        ),
      },
      {
        id: "hs-education", label: "HS Education", shortLabel: "HS Ed", icon: "📚",
        content: (
          <div className="cadc-content">
            <p>Our Head Start Preschool education program supports 3 and 4-year-old children across all developmental domains through evidence-based curriculum, individualized instruction, and rigorous assessment.</p>
            <div className="cadc-stack">
              {[
                {t:"Brigance Developmental Screening",d:"Every child is screened within the first 45 days using the Brigance Early Childhood Screener — identifying strengths and areas for support early. Aligned with 45 CFR §1302.33."},
                {t:"Individualized Goals",d:"Lesson plans are built from Brigance results, DRDP data, daily observations, and family input — ensuring instruction is never one-size-fits-all. Standards §1302.33 and §1302.32."},
                {t:"Frog Street Curriculum",d:"A nationally recognized, credential-based curriculum aligned to Oklahoma Early Learning Guidelines, Head Start ELOF, and DRDP developmental domains. Covers language, literacy, math, social-emotional development, and approaches to learning. Standards §1302.33 and §1302.32."},
                {t:"DRDP Assessment",d:"Strength-based assessment completed three times per year — Fall, Winter, and Spring. Staff document approximately 15% of each child's measures weekly using observations from routines, play, and group activities. Standards §1302.33 and §1302.32."},
                {t:"School Readiness Goals",d:"Goals aligned with ELOF, DRDP, and Frog Street — covering social-emotional skills, early literacy and language, early math and science, cognitive flexibility, physical development, and approaches to learning. Required under 45 CFR §1302.102."},
                {t:"Conscious Discipline",d:"A nationally recognized, evidence-based social-emotional learning framework. Builds safety, connection, and problem-solving skills in the classroom. Reduces challenging behaviors, strengthens teacher confidence, and supports long-term school readiness. Standards §1302.32, §1302.33, §1302.102."},
                {t:"CLASS — Classroom Assessment Scoring System",d:"A nationally recognized observation tool measuring the quality of teacher-child interactions across three domains: Emotional Support, Classroom Organization, and Instructional Support. CLASS data guides professional development and aligns practices with Head Start ELOF. Standard §1302.33."},
              ].map(i=><div key={i.t} className="cadc-card-sm"><p className="cadc-card-title">{i.t}</p><p>{i.d}</p></div>)}
            </div>
          </div>
        ),
      },
      {
        id: "health", label: "Health & Wellness", shortLabel: "Health", icon: "🏥",
        content: (
          <div className="cadc-content">
            <p>Every enrolled child receives comprehensive health services. Our Health, Mental Health, and Disabilities Coordinator ensures every child's needs are documented and met.</p>
            <div className="cadc-stack">
              {[
                {t:"Medical Protocols",d:"Children with conditions such as asthma must have an inhaler on-site. All medical needs are documented and staff trained."},
                {t:"Allergy Management",d:"Food allergies require a doctor's note specifying the allergy and approved substitutes."},
                {t:"Vision & Hearing Screenings",d:"CADC provides vision, hearing, and mental health screenings. Other screenings are the parent's responsibility — we provide guidance and referrals to help families get them completed."},
                {t:"Dental Hygiene",d:"Teeth brushing occurs daily in the classroom. Teachers demonstrate and brush alongside children to build healthy habits. Dental exams are the parent's responsibility — we will help direct families to the right resources."},
                {t:"Mental Health Support",d:"Integrated into the classroom and available to families. We partner with mental health professionals."},
                {t:"Disabilities Services",d:"Up to 10% of enrollment reserved for children with disabilities. We coordinate with school districts and specialists."},
              ].map(i=><div key={i.t} className="cadc-card-sm"><p className="cadc-card-title">{i.t}</p><p>{i.d}</p></div>)}
            </div>
          </div>
        ),
      },
      {
        id: "nutrition", label: "Nutrition", shortLabel: "Nutrition", icon: "🥗",
        content: (
          <div className="cadc-content">
            <p>All meals meet <strong>CACFP (Child and Adult Care Food Program)</strong> requirements — a federal nutrition standard ensuring balanced, age-appropriate meals every day.</p>
            <ul className="cadc-list">
              {["Breakfast, lunch, and snacks served daily at no cost","Menus planned by nutrition staff to meet CACFP standards","Age-appropriate portions and food groups","Formula, diapers, and wipes provided for Early Head Start infants","Allergy accommodations with doctor's documentation","Family nutrition education and resources"].map(i=><li key={i}>{i}</li>)}
            </ul>
          </div>
        ),
      },
      {
        id: "parent-engagement", label: "Parent Engagement", shortLabel: "Parents", icon: "👨‍👩‍👧",
        content: (
          <div className="cadc-content">
            <p>Parent and community involvement is not optional at Head Start — it is foundational. Families are partners in the program, and the community is part of the team.</p>
            <div className="cadc-stack">
              {[
                {t:"Policy Council",d:"The Head Start Policy Council includes parents of currently enrolled children and community representatives. Members have a real voice in how the program operates — approving budgets, reviewing policies, participating in hiring decisions, and advocating for families."},
                {t:"Parent Education & Trainings",d:"CADC offers parent education opportunities throughout the year covering child development, health, family wellness, and school readiness. Training schedules are available through your child's center."},
                {t:"Sub Committees",d:"Parents can join sub-committees to take a deeper role in specific areas of program governance and planning. Contact your center to learn about current sub-committee opportunities."},
                {t:"Get Involved — Community Welcome",d:"Head Start's impact depends on community involvement. Parents, grandparents, neighbors, and local volunteers are all welcome. Show up at any center — no appointment needed. Volunteer hours count as in-kind contributions that help CADC match its federal grant and keep the program free for families."},
              ].map(i=><div key={i.t} className="cadc-card-sm"><p className="cadc-card-title">{i.t}</p><p>{i.d}</p></div>)}
            </div>
            <div className="cadc-card">
              <p className="cadc-label">Ways to contribute</p>
              <ul className="cadc-list">
                {["Assist with handwashing and daily routines","Sit and eat with the children","Help with cleaning tables and play areas","Participate during large and small group time","Join outdoor activities and field trips","Cut out and prepare classroom materials","Help decorate bulletin boards","Share a hobby, talent, or cultural tradition","Be a mystery reader — surprise your child's class","Complete monthly Learning at Home activities","Assist staff with repairs, painting, or yard work"].map(i=><li key={i}>{i}</li>)}
              </ul>
            </div>
            <div className="cadc-card">
              <p className="cadc-label">Donations — Coming Soon</p>
              <p>CADC is setting up online donation options including Amazon Smile, Walmart Community, and Shop Raise. Check back soon or call us to express interest in supporting a classroom directly.</p>
            </div>
          </div>
        ),
      },
      {
        id: "safety", label: "Safety & Training", shortLabel: "Safety", icon: "🛡️",
        content: (
          <div className="cadc-content">
            <p>Safety is embedded in every aspect of our program. Centers meet all Oklahoma Child Care Licensing (OKDHS) requirements and follow federal Head Start Program Performance Standards (45 CFR §1302.47).</p>
            <div className="cadc-stack">
              {[
                {t:"Staff Training",d:"All staff complete training in child safety, emergency procedures, mandated reporting, Emergency Preparedness, Active Supervision, and program protocols. Teachers must obtain a Child Development Associate (CDA) credential within 6–12 months of hire."},
                {t:"Safe Environments",d:"Centers undergo Environmental Health and Safety checks every other month. Daily safety checks are conducted in classrooms, playgrounds, and pick-up/drop-off areas. Indoor and outdoor environments meet CPSC/ASTM standards."},
                {t:"Emergency Procedures",d:"Each center maintains a current all-hazards emergency preparedness plan covering fire, severe weather, lockdowns, medical emergencies, and utility outages. Monthly drills are conducted with staff and children."},
              ].map(i=><div key={i.t} className="cadc-card-sm"><p className="cadc-card-title">{i.t}</p><p>{i.d}</p></div>)}
            </div>
          </div>
        ),
      },
      {
        id: "faq", label: "FAQs", shortLabel: "FAQ", icon: "❓",
        content: (
          <div className="cadc-content">
            <p>Answers to the questions families ask us every day.</p>
            <div className="cadc-stack">
              {[
                {q:"Who qualifies for Early Head Start and Head Start?",a:"EHS serves pregnant mothers and children from birth to age 3. Head Start serves children ages 3–5. Children are automatically eligible if they are in foster care, unhoused, or from families who receive Public Assistance (SNAP, SSI, or TANF). Enrollment is based on a points system that considers many circumstances — all families are encouraged to apply."},
                {q:"What do I need to bring to apply?",a:"Birth certificate or proof of birth, proof of residency, proof of SNAP/SSI/TANF if applicable, SoonerCare or insurance info, proof of income if no SNAP, immunization record, proof of disability or special services if applicable, and foster care documents if applicable."},
                {q:"Are children with disabilities or special needs accepted?",a:"Yes. Up to 10% of enrollment is reserved for children with disabilities regardless of income. We coordinate with school districts and specialists to provide appropriate services through an IEP or IFSP."},
                {q:"Can parents apply to work at CADC Head Start?",a:"Yes. CADC actively hires from the communities we serve. View open positions on the CADC Facebook page or call 580-335-5588."},
                {q:"How can parents or community members get involved?",a:"Just show up at any center — no call or appointment needed. Parents, grandparents, neighbors, and local volunteers are all welcome. Every hour you contribute counts as an in-kind donation that helps keep the program free for families."},
                {q:"What should I expect during a home visit?",a:"CADC attempts two home visits per year per family. Your Center Staff will work with you on goals, connect you to resources, and discuss your child's development. If a home visit isn't possible due to safety concerns or family preference, an alternative location can be arranged to maintain confidentiality."},
                {q:"How does Head Start support my child's health?",a:"CADC provides vision, hearing, and mental health screenings. Other screenings — including dental exams — are the parent's responsibility, though we will help direct you to the right resources. Health needs are documented and monitored by our Health Coordinator. Children with conditions such as asthma must have an inhaler on-site."},
                {q:"What if my child has allergies or special dietary needs?",a:"A doctor's note is required specifying the allergy and approved food substitutes. Centers maintain allergy records for every enrolled child and accommodate needs through our CACFP-compliant meal program."},
                {q:"I need a new parent handbook or school calendar. What do I do?",a:"Contact your child's center directly. Each center can provide current handbooks and calendars. You can also find updates through your classroom's private Facebook page."},
              ].map(item => (
                <div key={item.q} className="cadc-card-sm">
                  <p className="cadc-card-title">{item.q}</p>
                  <p>{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        ),
      },
    ],
  },

  // ── 2. TRANSIT ─────────────────────────────────────────────────────────────
  {
    slug: "transit",
    name: "Red River Transportation",
    shortName: "Transit",
    icon: "🚌",
    color: T.blue,
    tagline: "110 vehicles · ADA equipped · 12 counties",
    subAreas: [
      {
        id: "rides", label: "Schedule a Ride", shortLabel: "Schedule", icon: "📅",
        content: (
          <div className="cadc-content">
            <p>Red River Transportation provides rural public transit across Southwest Oklahoma. Call to schedule rides to medical appointments, dialysis, work, shopping, and more.</p>
            <div className="cadc-card">
              <p className="cadc-label">Toll-free scheduling</p>
              <a href="tel:+18005245552" className="cadc-btn">📞 1-800-524-5552</a>
            </div>
            <div className="cadc-card">
              <p className="cadc-label">Counties served</p>
              <p>Beckham · Caddo · Canadian · Comanche · Cotton · Custer · Jefferson · Kiowa · Roger Mills · Stephens · Tillman · Washita</p>
              <p className="cadc-note">Canadian County: no in-town service for Mustang or Yukon. Comanche County: no in-town service for Lawton.</p>
            </div>
          </div>
        ),
      },
      {
        id: "fares", label: "Fare Schedule", shortLabel: "Fares", icon: "💲",
        content: (
          <div className="cadc-content">
            <p>Fares are calculated on round-trip mileage. Reduced fares apply to riders age 55+ and persons with disabilities. Effective October 1, 2022.</p>
            <div className="cadc-fare-table">
              <div className="cadc-fare-header"><span>Distance</span><span>Standard</span><span>Reduced</span></div>
              {[
                ["1–10 miles","$8.00","$8.00"],
                ["11–30 miles","$15.00","$15.00"],
                ["31–50 miles","$30.00","$20.00"],
                ["51–100 miles","$45.00","$30.00"],
                ["101–150 miles","$60.00","$40.00"],
                ["151–249 miles","$80.00","$60.00"],
                ["250+ miles","$0.40/mi","$0.40/mi"],
                ["Wait time","$10.00/hr","$10.00/hr"],
              ].map(r=><div key={r[0]} className="cadc-fare-row"><span>{r[0]}</span><span>{r[1]}</span><span>{r[2]}</span></div>)}
            </div>
            <p className="cadc-note">Wait time charged after the first hour. All vehicles are ADA lift or ramp equipped.</p>
          </div>
        ),
      },
      {
        id: "offices", label: "Office Locations", shortLabel: "Offices", icon: "📍",
        content: (
          <div className="cadc-content">
            <div className="cadc-stack">
              {[
                {name:"Frederick Office",addr:"105 S. Main, Frederick, OK 73542",phone:"580-335-5588",href:"tel:+15803355588"},
                {name:"Sayre Office",addr:"304 W. Main, Sayre, OK 73662",phone:"580-928-2199",href:"tel:+15809282199"},
                {name:"Ryan Office",addr:"400 Taylor & Main, Ryan, OK 73565",phone:"580-757-2235",href:"tel:+15807572235"},
              ].map(o=>(
                <div key={o.name} className="cadc-card-sm">
                  <p className="cadc-card-title">{o.name}</p>
                  <p>{o.addr}</p>
                  <a href={o.href} className="cadc-link">{o.phone}</a>
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        id: "ada", label: "ADA & Accessibility", shortLabel: "ADA", icon: "♿",
        content: (
          <div className="cadc-content">
            <p>All 110 Red River Transportation vehicles are equipped with lifts or ramps. No rider is turned away due to a mobility device or disability.</p>
            <div className="cadc-card">
              <p className="cadc-label">Title VI Non-Discrimination</p>
              <p>Red River Transportation does not discriminate on the basis of race, color, or national origin. For Title VI information or to file a complaint, contact the Frederick office.</p>
            </div>
          </div>
        ),
      },
    ],
  },

  // ── 3. WEATHERIZATION ──────────────────────────────────────────────────────
  {
    slug: "weatherization",
    name: "Weatherization & Housing",
    shortName: "Weatherization",
    icon: "🏠",
    color: T.blue,
    tagline: "Free home energy improvements for qualifying households",
    subAreas: [
      {
        id: "what", label: "What We Do", shortLabel: "Overview", icon: "🔧",
        content: (
          <div className="cadc-content">
            <p>The Weatherization Assistance Program (WAP) provides free home energy improvements to income-eligible households. Funded through the Department of Energy and Oklahoma DHS.</p>
            <div className="cadc-grid-2">
              {["Insulation installation","Air sealing","Heating & cooling system upgrades","Energy audits","Window and door improvements","Health and safety measures"].map(i=><div key={i} className="cadc-chip">{i}</div>)}
            </div>
          </div>
        ),
      },
      {
        id: "apply-weath", label: "Apply", shortLabel: "Apply", icon: "📝",
        content: (
          <div className="cadc-content">
            <p>Applications are submitted online through the Oklahoma Weatherization portal. The process typically includes an energy audit of your home before work begins.</p>
            <div className="cadc-card">
              <p className="cadc-label">Apply online</p>
              <a href="https://ok.mywaplink.org" target="_blank" rel="noopener noreferrer" className="cadc-btn">Oklahoma WAP Portal →</a>
            </div>
            <div className="cadc-card">
              <p className="cadc-label">Questions?</p>
              <a href="tel:+15803355588" className="cadc-link">580-335-5588</a>
            </div>
          </div>
        ),
      },
      {
        id: "eligibility-weath", label: "Eligibility", shortLabel: "Eligible?", icon: "✅",
        content: (
          <div className="cadc-content">
            <p>Eligibility is based on household income. Priority is given to elderly residents, people with disabilities, and families with young children.</p>
            <div className="cadc-card">
              <p className="cadc-label">General eligibility</p>
              <ul className="cadc-list">
                {["Income at or below 200% of federal poverty guidelines","Own or rent your primary residence","Priority for households with elderly members 60+","Priority for households with children under 6","Priority for persons with disabilities"].map(i=><li key={i}>{i}</li>)}
              </ul>
            </div>
          </div>
        ),
      },
    ],
  },

  // ── 4. SENIOR MEALS ────────────────────────────────────────────────────────
  {
    slug: "senior-meals",
    name: "Senior Nutrition",
    shortName: "Senior Meals",
    icon: "🍽️",
    color: T.blue,
    tagline: "More than a meal — nutrition, connection, and dignity",
    subAreas: [
      {
        id: "sn-about", label: "About the Program", shortLabel: "About", icon: "ℹ️",
        content: (
          <div className="cadc-content">
            <p>CADC's Senior Nutrition Program serves adults 60 and older with nutritious meals, meaningful community connection, and caring support. Our sites are more than places to eat — they are places where seniors gather, build friendships, and stay connected.</p>
            <p>For those who are unable to attend a congregate site, our Home-Delivered Meal Program brings a hot meal and a friendly visit directly to their door.</p>
            <PhotoGrid dark={false} photos={[
              { src: PHOTOS.seniorNutrition.kitchenStaff, alt: "CADC Senior Nutrition kitchen staff preparing meals" },
              { src: PHOTOS.seniorNutrition.puzzle, alt: "Seniors socializing over a puzzle at a CADC meal site" },
              { src: PHOTOS.seniorNutrition.patrioticSetup, alt: "Patriotic holiday celebration at a CADC senior meal site" },
              { src: PHOTOS.seniorNutrition.groupDining, alt: "Seniors dining together at a CADC congregate site" },
            ]} />
            <div className="cadc-card">
              <p className="cadc-label">Program eligibility</p>
              <p>Available to individuals age 60 and older. Spouses and caregivers may also be eligible — contact us for details.</p>
            </div>
            <div className="cadc-card">
              <p className="cadc-label">Staff training & safety</p>
              <div className="cadc-stack">
                {[
                  {t:"Food Handlers Certification",d:"All nutrition staff are required to complete a Food Handlers class prior to working in our kitchens."},
                  {t:"CPR / First Aid / Heimlich",d:"All nutrition staff are certified in CPR, First Aid, and Heimlich Maneuver. Training completed June 2026 — recertified every two years."},
                  {t:"Health Department Inspections",d:"Every center is inspected by the Health Department twice per year."},
                  {t:"Vent Hood Suppression Systems",d:"Kitchen suppression systems inspected twice per year at all centers."},
                  {t:"Fire Inspections",d:"Annual fire inspections conducted at all six centers."},
                  {t:"Registered Dietitian Oversight",d:"Our registered dietitian conducts site inspections every two months in addition to planning all menus quarterly."},
                ].map(i=><div key={i.t} className="cadc-card-sm"><p className="cadc-card-title">{i.t}</p><p>{i.d}</p></div>)}
              </div>
            </div>
            <div className="cadc-card">
              <p className="cadc-label">6 centers across 4 counties</p>
              <div className="cadc-grid-2">
                {[
                  "Frederick — Tillman County",
                  "Cache — Comanche County",
                  "Temple — Cotton County",
                  "Walters — Cotton County",
                  "Ringling — Jefferson County",
                  "Ryan — Jefferson County",
                ].map(i=><div key={i} className="cadc-chip">{i}</div>)}
              </div>
            </div>
            <p className="cadc-note">We are committed to serving our seniors with compassion, dignity, respect, and kindness.</p>
          </div>
        ),
      },
      {
        id: "congregate", label: "Congregate Meals", shortLabel: "Congregate", icon: "🍽️",
        content: (
          <div className="cadc-content">
            <p>Hot, nutritious meals served in a welcoming environment at 6 community sites across Southwest Oklahoma. Seniors enjoy a meal with others, participate in activities, socialize, and build friendships.</p>
            <PhotoStrip dark={false} photos={[
              { src: PHOTOS.seniorNutrition.frederickDining, alt: "Frederick senior nutrition congregate dining room" },
              { src: PHOTOS.seniorNutrition.frederickWide, alt: "Seniors dining at the Frederick center" },
              { src: PHOTOS.seniorNutrition.communityDining, alt: "Community dining room at a CADC senior nutrition site" },
            ]} />
            <div className="cadc-card">
              <p className="cadc-label">Meal contributions</p>
              <div className="cadc-stack">
                <div className="cadc-card-sm">
                  <p className="cadc-card-title">With completed assessment</p>
                  <p>$3.00 per meal</p>
                </div>
                <div className="cadc-card-sm">
                  <p className="cadc-card-title">Without assessment</p>
                  <p>$7.00 per meal</p>
                </div>
              </div>
            </div>
            <p className="cadc-label" style={{marginTop:14}}>Our 6 congregate sites</p>
            <div className="cadc-stack">
              {[
                {name:"Frederick",county:"Tillman County",addr:"100 E Grand, Frederick, OK 73542",phone:"580-335-7026",href:"tel:+15803357026"},
                {name:"Ringling",county:"Jefferson County",addr:"200 D St., Ringling, OK 73456",phone:"580-662-2362",href:"tel:+15806622362"},
                {name:"Cache",county:"Comanche County",addr:"416 West C Ave., Cache, OK 73527",phone:"580-429-3427",href:"tel:+15804293427"},
                {name:"Temple",county:"Cotton County",addr:"201 S Commercial, Temple, OK 73568",phone:"580-342-6944",href:"tel:+15803426944"},
                {name:"Walters",county:"Cotton County",addr:"500 E California, Walters, OK 73572",phone:"580-875-9044",href:"tel:+15808759044"},
                {name:"Ryan",county:"Jefferson County",addr:"400 Taylor St. Apt #8, Ryan, OK 73565",phone:"580-757-2412",href:"tel:+15807572412"},
              ].map(s=>(
                <div key={s.name} className="cadc-card-sm">
                  <p className="cadc-card-title">{s.name}</p>
                  <p style={{fontSize:10,opacity:0.6,margin:"2px 0 4px"}}>{s.county}</p>
                  <p>{s.addr}</p>
                  <a href={s.href} className="cadc-link">{s.phone}</a>
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        id: "sn-menu", label: "Monthly Menu", shortLabel: "Menu", icon: "📋",
        content: <MealCalendarPanel />,
      },
      {
        id: "sn-homedelivered", label: "Home Delivered", shortLabel: "Home Delivery", icon: "🚗",
        content: (
          <div className="cadc-content">
            <p>Our Home-Delivered Meal Program helps seniors who are unable to attend a congregate meal site. Nutritious meals are delivered directly to their homes — along with a friendly visit and an important connection to the community.</p>
            <div className="cadc-card">
              <p className="cadc-label">Meal contribution</p>
              <div className="cadc-card-sm">
                <p className="cadc-card-title">With completed assessment (required)</p>
                <p>$3.00 per meal</p>
              </div>
              <p className="cadc-note">An assessment is required before receiving home-delivered meals.</p>
            </div>
            <div className="cadc-card">
              <p className="cadc-label">More information</p>
              <a href="tel:+15803355588" className="cadc-btn">📞 580-335-5588</a>
            </div>
          </div>
        ),
      },
    ],
  },

  // ── 5. TAX HELP ────────────────────────────────────────────────────────────
  {
    slug: "tax-help",
    name: "VITA Free Tax Help",
    shortName: "Tax Help",
    icon: "📋",
    color: T.blue,
    tagline: "Free IRS-certified tax prep — no cost, no fees",
    subAreas: [
      {
        id: "vita-what", label: "About VITA", shortLabel: "About", icon: "ℹ️",
        content: (
          <div className="cadc-content">
            <p>The Volunteer Income Tax Assistance (VITA) program offers free tax preparation by IRS-certified volunteers to individuals and families who generally make $67,000 or less.</p>
            <div className="cadc-grid-2">
              {["$0 filing cost","IRS-certified volunteers","Federal and state returns","EITC maximization","No hidden fees","Secure and confidential"].map(i=><div key={i} className="cadc-chip">{i}</div>)}
            </div>
          </div>
        ),
      },
      {
        id: "vita-bring", label: "What to Bring", shortLabel: "Bring", icon: "📎",
        content: (
          <div className="cadc-content">
            <div className="cadc-card">
              <p className="cadc-label">Required documents</p>
              <ul className="cadc-list">
                {["Photo ID for all adults","Social Security cards for everyone on the return","All W-2, 1099, and income forms","Last year's tax return (if available)","Bank account and routing number for direct deposit","Health insurance information (1095-A if you had Marketplace coverage)","Childcare provider name, address, and tax ID (if applicable)"].map(i=><li key={i}>{i}</li>)}
              </ul>
            </div>
            <div className="cadc-card">
              <p className="cadc-label">Find a site</p>
              <a href="tel:+15803355588" className="cadc-link">580-335-5588</a>
            </div>
          </div>
        ),
      },
    ],
  },

  // ── 6. COMMUNITY MARKET ────────────────────────────────────────────────────
  {
    slug: "community-market",
    name: "Community Market",
    shortName: "Market",
    icon: "🛒",
    color: T.blue,
    tagline: "Fresh, affordable groceries brought directly to your community",
    subAreas: [
      {
        id: "market-about", label: "About the Market", shortLabel: "About", icon: "ℹ️",
        content: (
          <div className="cadc-content">
            <p>The CADC Community Market is a mobile grocery store housed in a 42-foot customized trailer — bringing fresh, affordable, and nutritious food directly to communities across Southwest Oklahoma that have lost access to full-service grocery stores.</p>
            <p>The market is open to the general public regardless of ZIP code. No membership or eligibility required.</p>
            <PhotoStrip dark={false} photos={[
              { src: PHOTOS.communityMarket.trailerHero, alt: "CADC Community Market 42-foot mobile grocery trailer" },
              { src: PHOTOS.communityMarket.freshProduce, alt: "Fresh produce available at the CADC Community Market" },
              { src: PHOTOS.communityMarket.refrigeratedProduce, alt: "Refrigerated produce section of the Community Market" },
            ]} />
            <div className="cadc-card">
              <p className="cadc-label">Mission</p>
              <p>To bring fresh, affordable, and nutritious food directly to every community we serve — breaking down barriers to access and fostering healthier, happier lives, one stop at a time.</p>
            </div>
            <div className="cadc-card">
              <p className="cadc-label">By the numbers</p>
              <div className="cadc-grid-2">
                {["8 counties served","22 communities","42-foot mobile trailer","400+ SKUs on board","EBT/SNAP accepted","5-star customer rating"].map(i=><div key={i} className="cadc-chip">{i}</div>)}
              </div>
            </div>
            <div className="cadc-card">
              <p className="cadc-label">Payment accepted</p>
              <p>EBT/SNAP benefits, cash, credit cards, and debit cards. Every form of payment accepted so food is accessible to every family.</p>
            </div>
            <div className="cadc-card">
              <p className="cadc-label">Economic impact</p>
              <p>Tax dollars generated through Community Market purchases are returned to the communities it serves — keeping economic resources local and supporting the continued vitality of rural Oklahoma.</p>
            </div>
            <div className="cadc-card">
              <p className="cadc-label">Contact Scott Fraley — Community Market Director</p>
              <a href="tel:+15803051964" className="cadc-link">580-305-1964</a>
              <a href="mailto:SFraley@cadcok.org" className="cadc-link" style={{display:"block",marginTop:4}}>SFraley@cadcok.org</a>
            </div>
          </div>
        ),
      },
      {
        id: "market-products", label: "What We Carry", shortLabel: "Products", icon: "🥦",
        content: (
          <div className="cadc-content">
            <p>The Community Market carries 400+ SKUs — from fresh produce to frozen meals to household essentials. We stock the brands and products you know and trust.</p>
            <PhotoGrid dark={false} photos={[
              { src: PHOTOS.communityMarket.freshProduce, alt: "Fresh produce — watermelons, apples, sweet potatoes, onions" },
              { src: PHOTOS.communityMarket.refrigeratedProduce, alt: "Refrigerated produce — grapes, peppers, tomatoes, carrots" },
              { src: PHOTOS.communityMarket.frozen, alt: "Frozen foods — peaches, broccoli, ice cream bars" },
              { src: PHOTOS.communityMarket.dairy, alt: "Dairy and refrigerated — eggs, butter, milk, yogurt" },
            ]} />
            <div className="cadc-card">
              <p className="cadc-label">Top sellers by category</p>
              <div className="cadc-stack">
                {[
                  {cat:"Fresh Produce",pct:"33%",d:"Seasonal fruits and vegetables priced competitively"},
                  {cat:"Frozen Items",pct:"29%",d:"Frozen meals, vegetables, meats, and ice cream"},
                  {cat:"Groceries",pct:"22%",d:"Pantry staples, cereals, snacks, and canned goods"},
                  {cat:"Meat & Dairy",pct:"14%",d:"Fresh and refrigerated proteins and dairy products"},
                  {cat:"HBA / Household",pct:"2%",d:"Personal care and household cleaning products"},
                ].map(i=>(
                  <div key={i.cat} className="cadc-card-sm">
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
                      <p className="cadc-card-title" style={{margin:0}}>{i.cat}</p>
                      <span style={{fontWeight:800,fontSize:13,color:"#0101FF"}}>{i.pct}</span>
                    </div>
                    <p style={{margin:"4px 0 0"}}>{i.d}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="cadc-card">
              <p className="cadc-label">Featured brands</p>
              <p>Braum's milk, locally sourced USDA grass-fed beef, Blue Bell Ice Cream, Sara Lee bread, and many other name-brand favorites. Whether you're stocking up for the family, planning a cookout, or simply looking for quality products you can count on — we've got something for everyone.</p>
            </div>
            <p className="cadc-note">Fresh produce and frozen items together account for 62% of total sales — the community is telling us what they need most.</p>
          </div>
        ),
      },
      {
        id: "market-schedule", label: "September Schedule", shortLabel: "Schedule", icon: "📅",
        content: <MarketSchedulePanel />,
      },
      {
        id: "market-recipes", label: "Budget Recipes", shortLabel: "Recipes", icon: "🍳",
        content: (
          <div className="cadc-content">
            <p>The Community Market provides easy, budget-friendly meal ideas for our shoppers. All ingredients available on the market.</p>
            <div className="cadc-stack">
              {[
                {
                  name:"Spaghetti & Meat Sauce",
                  desc:"A classic family favorite that comes together quickly with just a few basic ingredients.",
                  serves:"4–6", prep:"5 min", cook:"20 min",
                  ingredients:["1 lb. spaghetti","1 lb. ground beef","1 jar pasta sauce (about 24 oz.)","1 tbsp cooking oil, if needed","Salt, to taste","Optional: grated Parmesan or shredded mozzarella"],
                  tip:"Stretch the sauce by adding a can of diced tomatoes or a small amount of cooked vegetables.",
                },
                {
                  name:"Easy Tacos",
                  desc:"Let everyone add their favorite toppings for a meal the whole family can enjoy.",
                  serves:"4–6", prep:"5 min", cook:"10 min",
                  ingredients:["1 lb. ground beef","1 packet taco seasoning","Water (per seasoning directions)","8–12 tortillas or taco shells","1 cup shredded cheese","Optional: lettuce, diced tomatoes, onion, salsa, sour cream, refried beans"],
                  tip:"Add refried beans or cooked rice to the tacos to make the meat go further.",
                },
                {
                  name:"Easy Chili",
                  desc:"Hearty chili using inexpensive pantry staples — perfect for a cold evening or reheated the next day.",
                  serves:"4–6", prep:"5 min", cook:"25 min",
                  ingredients:["1 lb. ground beef","1 can beans, drained and rinsed","1 can diced tomatoes","1 can tomato sauce","1 packet chili seasoning","½ cup water, or as needed","Optional: diced onion, shredded cheese, sour cream, crackers, corn chips"],
                  tip:"Serve chili over rice, baked potatoes, or pasta to make a small batch stretch into more meals.",
                },
                {
                  name:"Chicken & Rice",
                  desc:"Simple comfort food requiring only a handful of ingredients — a filling dinner with minimal preparation.",
                  serves:"4–6", prep:"5 min", cook:"20–25 min",
                  ingredients:["2 cups cooked rice","1 can chicken, drained","1 can cream of chicken soup","½ cup milk","Salt and pepper, to taste","Optional: frozen mixed vegetables, canned peas, shredded cheese, garlic powder, onion powder"],
                  tip:"Leftover cooked rice works especially well and helps reduce food waste.",
                },
                {
                  name:"Bean & Cheese Burritos",
                  desc:"Simple, inexpensive, and filling — great for a quick lunch or dinner.",
                  serves:"4", prep:"5 min", cook:"5–10 min",
                  ingredients:["1 can refried beans","4–8 flour tortillas","1 cup shredded cheese","Salsa, optional","Optional: cooked rice, diced tomatoes, chopped onion, corn, taco seasoning, sour cream"],
                  tip:"Add cooked rice to the filling to make the burrito more filling without adding much cost.",
                },
              ].map(r=>(
                <div key={r.name} className="cadc-card-sm">
                  <p className="cadc-card-title">{r.name}</p>
                  <p style={{fontSize:11,marginBottom:6}}>{r.desc}</p>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8}}>
                    {[`Serves ${r.serves}`,`Prep ${r.prep}`,`Cook ${r.cook}`].map(s=>(
                      <span key={s} style={{fontSize:9,fontWeight:700,padding:"2px 7px",background:"rgba(1,1,255,0.08)",borderRadius:20,color:"#0101FF"}}>{s}</span>
                    ))}
                  </div>
                  <p style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",margin:"0 0 4px",opacity:0.6}}>Ingredients</p>
                  <ul style={{margin:"0 0 8px",paddingLeft:16,fontSize:11}}>
                    {r.ingredients.map(i=><li key={i}>{i}</li>)}
                  </ul>
                  <p style={{fontSize:10,fontStyle:"italic",margin:0,opacity:0.7}}>💡 {r.tip}</p>
                </div>
              ))}
            </div>
          </div>
        ),
      },
    ],
  },

  // ── 7. EMPLOYMENT ──────────────────────────────────────────────────────────
  {
    slug: "employment",
    name: "Employment & Workforce",
    shortName: "Employment",
    icon: "💼",
    color: T.blue,
    tagline: "Join the CADC team across Southwest Oklahoma",
    subAreas: [
      {
        id: "jobs", label: "Open Positions", shortLabel: "Jobs", icon: "📋",
        content: (
          <div className="cadc-content">
            <p>CADC has positions across multiple programs — Head Start, transit, weatherization, administration, and more. We serve 9 counties and our team reflects the communities we're in.</p>
            <div className="cadc-card">
              <p className="cadc-label">View current openings</p>
              <a href="https://www.facebook.com/cadcok" target="_blank" rel="noopener noreferrer" className="cadc-btn">CADC on Facebook →</a>
            </div>
            <div className="cadc-card">
              <p className="cadc-label">Or call us directly</p>
              <a href="tel:+15803355588" className="cadc-link">580-335-5588</a>
            </div>
          </div>
        ),
      },
      {
        id: "why", label: "Why CADC", shortLabel: "Why CADC", icon: "⭐",
        content: (
          <div className="cadc-content">
            <p>Working at CADC means showing up every day for the people in your community who need it most — children, seniors, families navigating hard times.</p>
            <div className="cadc-grid-2">
              {["Mission-driven work","Benefits package","Community impact","Professional development","Stable employment","Regional reach"].map(i=><div key={i} className="cadc-chip">{i}</div>)}
            </div>
          </div>
        ),
      },
    ],
  },

  // ── 8. BOARD & LEADERSHIP ─────────────────────────────────────────────────
  {
    slug: "board",
    name: "Board & Leadership",
    shortName: "Leadership",
    icon: "⚖️",
    color: T.blue,
    tagline: "Governance, Policy Council, and agency leadership",
    subAreas: [
      {
        id: "leadership", label: "Agency Leadership", shortLabel: "Leadership", icon: "👤",
        content: (
          <div className="cadc-content">
            <div className="cadc-stack">
              {[
                {n:"Leslea Hixson",t:"Executive Director"},
                {n:"Robin Harris",t:"Director, Head Start & Early Head Start"},
                {n:"Kristie Jackson",t:"Advantage Director"},
              ].map(p=><div key={p.n} className="cadc-card-sm"><p className="cadc-card-title">{p.n}</p><p>{p.t}</p></div>)}
            </div>
          </div>
        ),
      },
      {
        id: "board-members", label: "Board of Directors", shortLabel: "Board", icon: "🏛️",
        content: (
          <div className="cadc-content">
            <p>CADC is governed by a Board of Directors representing the communities we serve across Southwest Oklahoma.</p>
            <div className="cadc-card">
              <p className="cadc-label">Board information coming soon</p>
              <p>Contact us for board meeting schedules and governance documents.</p>
              <a href="tel:+15803355588" className="cadc-link">580-335-5588</a>
            </div>
          </div>
        ),
      },
      {
        id: "policy-council", label: "Policy Council", shortLabel: "Policy Council", icon: "📋",
        content: (
          <div className="cadc-content">
            <p>The Head Start Policy Council is a governing body that includes parents of currently enrolled children and community representatives. Policy Council members have a real voice in how the program operates.</p>
            <div className="cadc-card">
              <p className="cadc-label">Parent involvement in governance</p>
              <ul className="cadc-list">
                {["Approve the Head Start budget","Review and approve program policies","Participate in hiring decisions","Advocate for families and children","Serve on Sub Committees"].map(i=><li key={i}>{i}</li>)}
              </ul>
            </div>
            <div className="cadc-card">
              <p className="cadc-label">Get involved</p>
              <a href="tel:+15803355588" className="cadc-link">580-335-5588</a>
            </div>
          </div>
        ),
      },
      {
        id: "about-cadc", label: "About CADC", shortLabel: "About", icon: "🏢",
        content: (
          <div className="cadc-content">
            <p>Community Action Development Corporation (CADC) has been serving Southwest Oklahoma families since 1966. We are a private, non-profit Community Action Agency and Community Action Partnership member.</p>
            <div className="cadc-card">
              <p className="cadc-label">Main office</p>
              <p>105 S. Main Street · P.O. Box 989<br/>Frederick, OK 73542</p>
              <a href="tel:+15803355588" className="cadc-link">580-335-5588</a>
            </div>
          </div>
        ),
      },
      {
        id: "service-map", label: "Service Area Map", shortLabel: "Map", icon: "🗺️",
        content: <ServiceMapPanel />,
      },
    ],
  },
// ── 9. ADVANTAGE HOME DELIVERED MEALS ─────────────────────────────────────
  {
    slug: "advantage",
    name: "Advantage Home Delivered Meals",
    shortName: "Advantage",
    icon: "🚗",
    color: T.blue,
    tagline: "Home-delivered meals for seniors & adults with disabilities",
    subAreas: [
      {
        id: "adv-about", label: "About the Program", shortLabel: "About", icon: "ℹ️",
        content: (
          <div className="cadc-content">
            <p>CADC Advantage provides home-delivered meals to older adults and individuals with disabilities through Oklahoma Medicaid waiver programs — Advantage, Living Choice, and Medically Fragile.</p>
            <p>Meals are delivered every two weeks. Members may receive 14 or 28 meals per delivery, plus fresh milk and juice. Both frozen and shelf-stable meal options are available.</p>
            <div className="cadc-card">
              <p className="cadc-label">17 counties served</p>
              <p>Beckham · Caddo · Canadian · Comanche · Cotton · Custer · Grady · Greer · Harmon · Jackson · Jefferson · Kiowa · McClain · Roger Mills · Stephens · Tillman · Washita</p>
            </div>
          </div>
        ),
      },
      {
        id: "adv-eligibility", label: "Eligibility", shortLabel: "Eligible?", icon: "✅",
        content: (
          <div className="cadc-content">
            <p>To receive Advantage Home Delivered Meals, applicants must meet all of the following criteria:</p>
            <div className="cadc-card">
              <ul className="cadc-list">
                {["Be financially qualified for SoonerCare (Medicaid)","Meet medical Level of Care (LOC) criteria","Be at least age 65, OR be age 19–64 with an intellectual or developmental disability, physical or other disability, or cognitive impairment related to a developmental disability"].map(i=><li key={i}>{i}</li>)}
              </ul>
            </div>
            <div className="cadc-card">
              <p className="cadc-label">To apply or get help</p>
              <a href="tel:+18009877767" className="cadc-btn">📞 1-800-987-7767</a>
              <p className="cadc-note">Or call 405-522-5050</p>
            </div>
          </div>
        ),
      },
      {
        id: "adv-meals", label: "Meal Options", shortLabel: "Meals", icon: "🍱",
        content: (
          <div className="cadc-content">
            <p>Members choose from a rotating selection of frozen and shelf-stable meals designed to meet nutritional needs. Fresh milk and juice are included with every delivery.</p>
            <div className="cadc-card">
              <p className="cadc-label">Delivery schedule</p>
              <ul className="cadc-list">
                {["Meals delivered every two weeks","14-meal plan: 2 half-gallons of milk or juice per delivery","28-meal plan: 4 half-gallons of milk or juice per delivery","Shelf-stable boxes contain 7 meals each","Members can mix frozen and shelf-stable meals"].map(i=><li key={i}>{i}</li>)}
              </ul>
            </div>
            <div className="cadc-card">
              <p className="cadc-label">Milk & juice options</p>
              <p>Whole milk, 2% milk, chocolate milk, buttermilk, almond milk (sweet, unsweetened, vanilla), orange juice, apple juice. Purchased through Braum's where available; local grocery partners used in other areas.</p>
            </div>
          </div>
        ),
      },
      {
        id: "adv-offices", label: "Office Locations", shortLabel: "Offices", icon: "📍",
        content: (
          <div className="cadc-content">
            <div className="cadc-stack">
              {[
                {n:"Sentinel — Emily Correll",addr:"122 S. 3rd Butler Building, Sentinel, OK 73664",p:"580-393-2216",href:"tel:+15803932216"},
                {n:"Temple — Danya Brinson",addr:"102 West Texas, Temple, OK 73568",p:"580-342-6967",href:"tel:+15803426967"},
                {n:"Lawton — Kristie Jackson",addr:"802 SW A Ave, Suite B, Lawton, OK 73501",p:"580-699-8880",href:"tel:+15806998880"},
              ].map(o=>(
                <div key={o.n} className="cadc-card-sm">
                  <p className="cadc-card-title">{o.n}</p>
                  <p>{o.addr}</p>
                  <a href={o.href} className="cadc-link">{o.p}</a>
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        id: "adv-donate", label: "Support & Donate", shortLabel: "Donate", icon: "❤️",
        content: (
          <div className="cadc-content">
            <p>CADC is exploring ways for community members and businesses to support our nutrition programs directly. Details coming soon — check back or contact us to express interest.</p>
            <div className="cadc-card">
              <p className="cadc-label">Coming soon</p>
              <p>Online donation options, Amazon Smile, Walmart Community, and Shop Raise are being set up. We'll update this page once logistics are confirmed.</p>
            </div>
            <div className="cadc-card">
              <p className="cadc-label">Questions? Contact us</p>
              <a href="tel:+15803355588" className="cadc-link">580-335-5588</a>
            </div>
          </div>
        ),
      },
    ],
  },

];

// ─── Geometry helpers ─────────────────────────────────────────────────────────

function orbitPos(i: number, total: number, radiusPct: number) {
  const angle = -90 + (i / total) * 360;
  const rad = (angle * Math.PI) / 180;
  return { x: 50 + radiusPct * Math.cos(rad), y: 50 + radiusPct * Math.sin(rad) };
}

// ─── Particle field (desktop) ─────────────────────────────────────────────────

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    const PARTICLE_COUNT = 120;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    let raf: number;
    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(1,1,255,${p.alpha})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}

// ─── County service data for county-first flow ───────────────────────────────

const CADC_BASE_COUNTIES = [
  "beckham","canadian","comanche","cotton","jefferson","kiowa","roger-mills","tillman","washita"
];

// Which programs are available per county
const COUNTY_PROGRAM_MAP: Record<string, string[]> = {
  beckham:      ["head-start","transit","weatherization","advantage"],
  canadian:     ["head-start","transit","weatherization","advantage"],
  comanche:     ["head-start","transit","weatherization","senior-meals","advantage","community-market"],
  cotton:       ["head-start","transit","weatherization","senior-meals","advantage"],
  jefferson:    ["head-start","transit","weatherization","senior-meals","advantage"],
  kiowa:        ["head-start","transit","weatherization","advantage","community-market"],
  "roger-mills":["head-start","transit","weatherization","advantage"],
  tillman:      ["head-start","transit","weatherization","senior-meals","advantage"],
  washita:      ["head-start","transit","weatherization","advantage"],
  // Transit extended
  blaine:       ["transit"], caddo: ["transit","advantage"], custer: ["transit","advantage"],
  dewey:        ["transit"], ellis: ["transit"], grady: ["transit","advantage"],
  harmon:       ["transit","advantage"], jackson: ["transit","advantage"],
  mcclain:      ["transit","advantage"], stephens: ["transit","advantage"],
  greer:        ["transit","advantage"],
};

// Geographic county shapes — approximate SW Oklahoma positions
// Each: id, label, cx%, cy% (center as % of SVG 100×70 viewBox)
interface CountyDot { id: string; name: string; cx: number; cy: number; }

const SW_OK_COUNTIES: CountyDot[] = [
  { id:"roger-mills", name:"Roger Mills", cx:14, cy:20 },
  { id:"beckham",     name:"Beckham",     cx:8,  cy:35 },
  { id:"washita",     name:"Washita",     cx:26, cy:35 },
  { id:"canadian",    name:"Canadian",    cx:52, cy:28 },
  { id:"kiowa",       name:"Kiowa",       cx:26, cy:50 },
  { id:"comanche",    name:"Comanche",    cx:42, cy:58 },
  { id:"tillman",     name:"Tillman",     cx:30, cy:68 },
  { id:"cotton",      name:"Cotton",      cx:46, cy:70 },
  { id:"jefferson",   name:"Jefferson",   cx:58, cy:72 },
];

// ─── Oklahoma 9-county SVG map ────────────────────────────────────────────────

// ─── SW Oklahoma county map — all counties visible, CADC highlighted ──────────
// 37 counties from US Census Bureau GeoJSON, projected to 500×380 SVG viewBox
// Grey = context only. Blue highlighted = CADC service county (clickable).

const SW_OK_ALL_COUNTIES: {fips:string;name:string;slug:string|null;isCADC:boolean;path:string;lx:number;ly:number}[] = [
  {fips:"40003",name:"Alfalfa",slug:null,isCADC:false,path:"M 396.0,56.3 L 396.0,70.4 L 362.3,70.4 L 361.5,12.3 L 371.2,12.4 L 376.4,12.5 L 377.0,12.5 L 385.5,12.5 L 387.0,12.5 L 387.8,12.5 L 390.2,12.5 L 392.6,12.4 L 395.4,12.4 L 395.6,56.3 L 396.0,56.3 Z",lx:378.7,ly:41.4},
  {fips:"40007",name:"Beaver",slug:null,isCADC:false,path:"M 204.6,66.5 L 172.6,66.5 L 173.3,12.4 L 176.5,12.4 L 180.3,12.4 L 183.5,12.3 L 187.4,12.3 L 194.4,12.3 L 197.7,12.2 L 201.0,12.2 L 204.1,12.2 L 231.6,12.0 L 238.3,12.0 L 240.4,12.0 L 246.9,12.1 L 247.2,12.2 L 247.1,56.3 L 247.1,66.5 L 233.2,66.5 L 223.0,66.5 L 215.0,66.5 L 206.4,66.5 L 204.6,66.5 Z",lx:209.9,ly:39.3},
  {fips:"40009",name:"Beckham",slug:"beckham",isCADC:true,path:"M 247.3,209.2 L 247.3,183.2 L 280.6,183.3 L 280.6,173.8 L 297.2,173.8 L 297.2,178.6 L 297.5,216.3 L 293.7,216.4 L 293.7,216.6 L 264.4,216.3 L 264.4,225.7 L 256.1,225.7 L 247.3,225.7 L 247.3,209.2 Z",lx:272.4,ly:199.8},
  {fips:"40011",name:"Blaine",slug:null,isCADC:false,path:"M 354.2,102.7 L 357.0,102.6 L 387.7,102.7 L 387.9,150.4 L 379.6,150.4 L 379.6,169.2 L 355.3,169.2 L 354.6,169.2 L 354.6,140.9 L 354.2,102.7 Z",lx:371.1,ly:135.9},
  {fips:"40015",name:"Caddo",slug:null,isCADC:false,path:"M 355.6,244.7 L 355.5,218.4 L 355.3,178.7 L 355.3,169.2 L 379.6,169.2 L 380.2,188.1 L 396.6,188.0 L 396.9,244.7 L 355.6,244.7 Z",lx:376.1,ly:207.0},
  {fips:"40017",name:"Canadian",slug:"canadian",isCADC:true,path:"M 429.9,178.7 L 429.9,192.6 L 428.9,192.8 L 428.0,193.5 L 427.2,193.8 L 426.1,193.4 L 425.7,193.7 L 424.8,193.9 L 422.1,191.5 L 421.6,192.4 L 420.8,192.5 L 420.5,192.9 L 420.1,192.2 L 419.3,192.0 L 418.9,192.8 L 417.2,192.6 L 396.6,188.0 L 380.2,188.1 L 379.6,169.2 L 379.6,150.4 L 387.9,150.4 L 429.7,150.3 L 429.9,178.7 Z",lx:404.8,ly:172.1},
  {fips:"40019",name:"Carter",slug:null,isCADC:false,path:"M 487.8,318.7 L 484.9,329.7 L 438.6,329.6 L 438.5,306.0 L 438.5,282.4 L 455.0,282.4 L 455.0,296.6 L 479.7,296.7 L 487.8,301.3 L 487.8,318.7 Z",lx:463.1,ly:306.0},
  {fips:"40025",name:"Cimarron",slug:null,isCADC:false,path:"M 77.9,66.4 L 12.0,66.4 L 12.0,12.2 L 13.2,12.4 L 22.0,12.3 L 45.8,12.8 L 62.7,12.8 L 74.3,12.9 L 76.1,12.9 L 86.3,13.0 L 88.4,13.0 L 88.1,66.4 L 77.9,66.4 Z",lx:50.2,ly:39.3},
  {fips:"40027",name:"Cleveland",slug:null,isCADC:false,path:"M 429.9,188.1 L 449.4,188.1 L 461.8,188.1 L 471.4,188.1 L 471.4,236.8 L 455.8,232.9 L 454.8,220.7 L 440.1,205.8 L 438.9,197.7 L 429.9,192.4 L 429.9,188.1 Z",lx:450.7,ly:212.4},
  {fips:"40031",name:"Comanche",slug:"comanche",isCADC:true,path:"M 393.0,282.4 L 385.0,282.4 L 381.0,288.7 L 364.6,288.6 L 364.6,291.8 L 352.3,293.4 L 352.3,282.4 L 339.4,282.4 L 339.4,244.6 L 355.6,244.7 L 396.9,244.7 L 397.2,263.5 L 393.0,263.5 L 393.0,282.4 Z",lx:368.3,ly:269.0},
  {fips:"40033",name:"Cotton",slug:"cotton",isCADC:true,path:"M 390.9,325.0 L 388.5,324.7 L 381.1,322.9 L 378.7,321.0 L 375.6,320.3 L 374.1,321.3 L 372.9,323.4 L 372.8,324.2 L 370.2,326.9 L 366.9,330.4 L 364.6,329.5 L 360.8,322.9 L 357.1,319.9 L 356.3,319.9 L 356.4,301.2 L 352.3,293.4 L 364.6,291.8 L 364.6,288.6 L 381.0,288.7 L 385.0,282.4 L 393.0,282.4 L 393.3,282.4 L 393.3,305.9 L 393.3,322.0 L 390.9,325.0 Z",lx:372.8,ly:306.4},
  {fips:"40039",name:"Custer",slug:null,isCADC:false,path:"M 296.3,141.0 L 354.6,140.9 L 354.6,169.2 L 355.3,169.2 L 355.3,178.7 L 297.2,178.6 L 297.2,173.8 L 296.3,141.0 Z",lx:325.8,ly:159.8},
  {fips:"40043",name:"Dewey",slug:null,isCADC:false,path:"M 295.9,119.2 L 295.8,102.8 L 329.2,103.1 L 354.2,102.7 L 354.6,140.9 L 296.3,141.0 L 295.9,119.2 Z",lx:325.2,ly:121.9},
  {fips:"40045",name:"Ellis",slug:null,isCADC:false,path:"M 247.3,114.6 L 247.3,66.5 L 247.1,56.3 L 278.3,56.4 L 279.0,102.8 L 295.8,102.8 L 295.9,119.2 L 286.9,122.9 L 282.0,135.1 L 269.6,135.8 L 262.9,130.3 L 262.3,120.6 L 256.1,121.9 L 253.2,130.0 L 247.3,133.5 L 247.3,114.6 Z",lx:271.5,ly:96.1},
  {fips:"40047",name:"Garfield",slug:null,isCADC:false,path:"M 446.3,56.3 L 446.4,56.3 L 446.4,102.8 L 429.6,102.8 L 396.0,102.7 L 396.0,56.3 L 446.3,56.3 Z",lx:421.2,ly:79.5},
  {fips:"40049",name:"Garvin",slug:null,isCADC:false,path:"M 438.5,282.4 L 438.4,263.5 L 430.2,263.5 L 430.2,244.7 L 487.9,244.8 L 487.9,268.3 L 466.9,269.9 L 471.3,282.5 L 455.0,282.4 L 438.5,282.4 Z",lx:459.0,ly:263.6},
  {fips:"40051",name:"Grady",slug:null,isCADC:false,path:"M 396.6,188.0 L 417.2,192.6 L 418.9,192.8 L 419.3,192.0 L 420.1,192.2 L 420.5,192.9 L 420.8,192.5 L 421.6,192.4 L 422.1,191.5 L 424.8,193.9 L 425.7,193.7 L 426.1,193.4 L 427.2,193.8 L 428.0,193.5 L 428.9,192.8 L 429.9,192.6 L 430.2,244.7 L 430.2,263.5 L 397.3,263.5 L 397.2,263.5 L 397.1,244.7 L 396.9,244.7 L 396.6,188.0 Z",lx:413.4,ly:225.8},
  {fips:"40053",name:"Grant",slug:null,isCADC:false,path:"M 446.3,56.3 L 396.0,56.3 L 395.4,12.4 L 400.6,12.4 L 419.7,12.4 L 421.1,12.4 L 422.3,12.4 L 427.9,12.4 L 431.6,12.3 L 435.0,12.4 L 438.3,12.4 L 445.5,12.4 L 446.3,12.4 L 446.3,56.3 Z",lx:420.9,ly:34.3},
  {fips:"40055",name:"Greer",slug:null,isCADC:false,path:"M 293.7,216.6 L 300.1,224.5 L 301.8,244.4 L 306.5,248.3 L 294.0,249.2 L 292.6,258.8 L 273.5,258.8 L 269.3,254.1 L 268.5,235.0 L 256.1,235.1 L 256.1,225.7 L 264.4,225.7 L 264.4,216.3 L 293.7,216.6 Z",lx:281.3,ly:237.6},
  {fips:"40057",name:"Harmon",slug:null,isCADC:false,path:"M 247.3,256.5 L 247.3,225.7 L 256.1,225.7 L 256.1,235.1 L 268.5,235.0 L 269.3,254.1 L 273.5,258.8 L 273.5,282.4 L 259.4,282.6 L 253.4,275.1 L 247.5,276.5 L 247.3,276.6 L 247.3,256.5 Z",lx:260.4,ly:254.2},
  {fips:"40059",name:"Harper",slug:null,isCADC:false,path:"M 247.2,12.1 L 264.2,12.1 L 274.2,12.2 L 282.0,12.3 L 286.5,12.3 L 290.0,12.3 L 296.5,25.4 L 302.6,31.8 L 302.6,56.1 L 278.3,56.4 L 247.1,56.3 L 247.2,12.1 Z",lx:274.9,ly:34.2},
  {fips:"40065",name:"Jackson",slug:null,isCADC:false,path:"M 309.2,300.7 L 305.3,293.6 L 297.8,289.4 L 294.5,296.6 L 291.2,296.8 L 290.2,295.2 L 285.4,292.4 L 280.7,292.0 L 277.4,296.7 L 271.3,296.3 L 265.6,290.7 L 259.4,282.6 L 273.5,282.4 L 273.5,258.8 L 292.6,258.8 L 294.0,249.2 L 306.5,248.3 L 314.2,245.2 L 314.1,261.2 L 321.7,261.3 L 317.7,268.2 L 308.5,283.8 L 309.2,300.7 Z",lx:290.5,ly:273.0},
  {fips:"40067",name:"Jefferson",slug:"jefferson",isCADC:true,path:"M 405.9,349.3 L 407.8,344.2 L 408.4,338.5 L 405.5,337.2 L 402.6,338.0 L 400.9,338.1 L 397.5,337.0 L 395.8,333.7 L 390.9,325.0 L 393.3,322.0 L 393.3,305.9 L 438.5,306.0 L 438.5,328.4 L 438.6,348.4 L 437.0,348.1 L 435.8,346.7 L 436.4,342.6 L 434.8,340.8 L 431.1,338.5 L 429.9,338.3 L 428.6,338.8 L 427.6,340.4 L 425.0,344.2 L 421.0,349.2 L 417.2,352.8 L 414.7,353.7 L 413.8,353.6 L 406.8,350.1 L 405.9,349.3 Z",lx:414.8,ly:329.8},
  {fips:"40073",name:"Kingfisher",slug:null,isCADC:false,path:"M 396.0,102.7 L 429.6,102.8 L 429.7,150.3 L 387.9,150.4 L 387.7,102.7 L 396.0,102.7 Z",lx:408.7,ly:126.6},
  {fips:"40075",name:"Kiowa",slug:"kiowa",isCADC:true,path:"M 355.5,218.4 L 355.6,244.7 L 339.4,244.6 L 339.4,272.9 L 325.7,272.9 L 325.7,268.2 L 317.7,268.2 L 321.7,261.3 L 314.1,261.2 L 314.2,245.2 L 306.5,248.3 L 301.8,244.4 L 300.1,224.5 L 293.7,216.6 L 293.7,216.4 L 297.5,216.3 L 345.3,216.4 L 355.5,218.4 Z",lx:324.6,ly:244.6},
  {fips:"40083",name:"Logan",slug:null,isCADC:false,path:"M 471.5,126.9 L 471.5,150.5 L 429.7,150.3 L 429.6,102.8 L 446.4,102.8 L 454.8,103.4 L 454.8,122.2 L 457.2,119.4 L 471.5,126.9 Z",lx:450.6,ly:126.6},
  {fips:"40085",name:"Love",slug:null,isCADC:false,path:"M 484.7,344.3 L 483.7,349.6 L 475.3,366.3 L 471.8,367.8 L 469.8,366.7 L 466.5,359.0 L 466.5,357.0 L 458.2,351.2 L 453.3,356.9 L 449.1,356.9 L 446.3,354.5 L 447.2,351.3 L 447.2,349.1 L 444.6,346.5 L 443.3,346.1 L 441.9,346.7 L 439.8,348.1 L 438.6,348.4 L 438.6,329.6 L 484.9,329.7 L 487.7,342.4 L 484.7,344.3 Z",lx:463.1,ly:348.8},
  {fips:"40093",name:"Major",slug:null,isCADC:false,path:"M 354.2,102.7 L 329.2,103.1 L 328.9,65.7 L 338.0,65.7 L 340.8,70.7 L 355.1,78.1 L 362.3,77.5 L 362.3,70.4 L 396.0,70.4 L 396.0,102.7 L 354.2,102.7 Z",lx:362.5,ly:84.4},
  {fips:"40087",name:"McClain",slug:null,isCADC:false,path:"M 429.9,192.6 L 438.9,197.7 L 440.1,205.8 L 454.8,220.7 L 455.8,232.9 L 471.4,236.8 L 488.0,232.8 L 488.0,244.7 L 487.9,244.8 L 430.2,244.7 L 429.9,192.6 Z",lx:459.0,ly:218.6},
  {fips:"40109",name:"Oklahoma",slug:null,isCADC:false,path:"M 461.8,188.1 L 449.4,188.1 L 429.9,188.1 L 429.9,178.7 L 429.7,150.3 L 471.5,150.5 L 471.5,178.7 L 471.4,188.1 L 461.8,188.1 Z",lx:450.6,ly:169.2},
  {fips:"40129",name:"Roger Mills",slug:"roger-mills",isCADC:true,path:"M 247.3,161.9 L 247.3,133.5 L 253.2,130.0 L 256.1,121.9 L 262.3,120.6 L 262.9,130.3 L 269.6,135.8 L 282.0,135.1 L 286.9,122.9 L 295.9,119.2 L 296.3,141.0 L 297.2,173.8 L 280.6,173.8 L 280.6,183.3 L 247.3,183.2 L 247.3,161.9 Z",lx:272.3,ly:151.2},
  {fips:"40137",name:"Stephens",slug:null,isCADC:false,path:"M 393.0,282.4 L 393.0,263.5 L 430.2,263.5 L 438.4,263.5 L 438.5,282.4 L 438.5,306.0 L 393.3,305.9 L 393.3,282.4 L 393.0,282.4 Z",lx:415.7,ly:284.8},
  {fips:"40139",name:"Texas",slug:null,isCADC:false,path:"M 170.8,66.5 L 88.1,66.4 L 88.4,13.0 L 98.2,12.9 L 121.8,12.8 L 130.9,12.7 L 136.5,12.7 L 140.8,12.6 L 152.3,12.6 L 163.8,12.5 L 164.8,12.5 L 168.0,12.4 L 173.3,12.4 L 172.6,66.5 L 170.8,66.5 Z",lx:130.7,ly:39.5},
  {fips:"40141",name:"Tillman",slug:"tillman",isCADC:true,path:"M 329.5,316.2 L 321.0,315.2 L 316.4,315.5 L 313.5,314.9 L 310.8,314.0 L 309.2,305.7 L 309.2,300.8 L 308.5,283.8 L 317.7,268.2 L 325.7,268.2 L 325.7,272.9 L 339.4,272.9 L 339.4,282.4 L 352.3,282.4 L 352.3,293.4 L 356.4,301.2 L 356.3,319.9 L 354.2,319.8 L 349.3,322.6 L 344.2,322.6 L 336.9,320.8 L 332.0,317.5 L 329.5,316.2 Z",lx:332.4,ly:295.4},
  {fips:"40149",name:"Washita",slug:"washita",isCADC:true,path:"M 355.5,218.4 L 345.3,216.4 L 297.5,216.3 L 297.2,178.6 L 355.3,178.7 L 355.5,218.4 Z",lx:326.3,ly:198.5},
  {fips:"40151",name:"Woods",slug:null,isCADC:false,path:"M 302.6,31.8 L 296.5,25.4 L 290.0,12.3 L 335.1,12.3 L 341.7,12.3 L 347.8,12.3 L 361.5,12.3 L 362.3,70.4 L 362.3,77.5 L 355.1,78.1 L 340.8,70.7 L 338.0,65.7 L 328.9,55.7 L 314.8,35.8 L 302.6,31.8 Z",lx:326.2,ly:45.2},
  {fips:"40153",name:"Woodward",slug:null,isCADC:false,path:"M 278.3,56.4 L 302.6,56.1 L 302.6,31.8 L 314.8,35.8 L 328.9,55.7 L 328.9,65.7 L 329.2,103.1 L 295.8,102.8 L 279.0,102.8 L 278.3,56.4 Z",lx:303.8,ly:67.4},
];

function OklahomaCountyMap({ selectedCounty, onSelectCounty, dark }: {
  selectedCounty: string | null;
  onSelectCounty: (id: string) => void;
  dark: boolean;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  const bg = dark ? "rgba(0,0,20,0.6)" : "#eaecf5";
  const greyFill = dark ? "rgba(255,255,255,0.04)" : "#dde0ef";
  const greyStroke = dark ? "rgba(255,255,255,0.1)" : "#b8bcd0";
  const cadcFill = dark ? "rgba(1,1,255,0.22)" : "rgba(1,1,255,0.13)";
  const cadcStroke = dark ? "rgba(1,1,255,0.55)" : "rgba(1,1,255,0.45)";
  const cadcHover = dark ? "rgba(1,1,255,0.4)" : "rgba(1,1,255,0.28)";
  const greyLabel = dark ? "rgba(255,255,255,0.18)" : "#a0a4b8";
  const cadcLabel = dark ? "rgba(255,255,255,0.9)" : "#1a1a5e";
  const selectedFill = "#0101FF";
  const selectedLabel = "white";

  return (
    <svg viewBox="0 0 500 380" style={{ width: "100%", display: "block" }}
      aria-label="SW Oklahoma county map — CADC service counties highlighted in blue">
      <rect x={0} y={0} width={500} height={380} fill={bg} rx={8} />

      {/* Grey background counties first */}
      {SW_OK_ALL_COUNTIES.filter(c => !c.isCADC).map(c => (
        <g key={c.fips}>
          <path d={c.path} fill={greyFill} stroke={greyStroke} strokeWidth={0.6} strokeLinejoin="round" />
          <text x={c.lx} y={c.ly} textAnchor="middle" dominantBaseline="middle"
            fontSize={4.5} fill={greyLabel} style={{ pointerEvents:"none", userSelect:"none" }}>
            {c.name}
          </text>
        </g>
      ))}

      {/* CADC counties on top — interactive */}
      {SW_OK_ALL_COUNTIES.filter(c => c.isCADC).map(c => {
        const isSel = selectedCounty === c.slug;
        const isHov = hovered === c.slug;
        return (
          <g key={c.fips} style={{ cursor: "pointer" }}>
            <path
              d={c.path}
              fill={isSel ? selectedFill : isHov ? cadcHover : cadcFill}
              stroke={isSel ? selectedFill : cadcStroke}
              strokeWidth={isSel ? 2 : 1.2}
              strokeLinejoin="round"
              style={{ transition: "fill 0.18s ease" }}
              onMouseEnter={() => setHovered(c.slug)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => c.slug && onSelectCounty(c.slug)}
            />
            {!isSel && (
              <circle cx={c.lx} cy={c.ly - 9} r={3}
                fill={isHov ? "#0101FF" : "#CC0000"}
                style={{ pointerEvents:"none", transition:"fill 0.15s" }} />
            )}
            <text x={c.lx} y={c.ly + 4} textAnchor="middle" dominantBaseline="middle"
              fontSize={isSel ? 7.5 : 6.5} fontWeight={isSel ? "800" : "700"}
              fill={isSel ? selectedLabel : cadcLabel}
              style={{ pointerEvents:"none", userSelect:"none" }}>
              {c.name}
            </text>
          </g>
        );
      })}

      {/* Legend */}
      <g transform="translate(12,370)">
        <rect x={0} y={-5} width={10} height={7} rx={1} fill={cadcFill} stroke={cadcStroke} strokeWidth={0.8}/>
        <text x={13} y={0} fontSize={5.5} fill={dark?"rgba(255,255,255,0.4)":"#6b7280"}>CADC County</text>
        <rect x={72} y={-5} width={10} height={7} rx={1} fill={greyFill} stroke={greyStroke} strokeWidth={0.8}/>
        <text x={85} y={0} fontSize={5.5} fill={dark?"rgba(255,255,255,0.4)":"#6b7280"}>Other County</text>
        <circle cx={145} cy={-1.5} r={3} fill="#CC0000"/>
        <text x={151} y={0} fontSize={5.5} fill={dark?"rgba(255,255,255,0.4)":"#6b7280"}>Tap to see services</text>
      </g>
    </svg>
  );
}


// ─── Main Orbit component ─────────────────────────────────────────────────────

type Stage = "entry" | "map" | "county" | "program" | "content";
type TransitionState = "idle" | "out" | "in";

export default function CADCOrbitSite() {
  const [stage, setStage] = useState<Stage>("entry");
  const [activeCounty, setActiveCounty] = useState<string | null>(null);
  const [activeProgram, setActiveProgram] = useState<ProgramData | null>(null);
  const [activeSubArea, setActiveSubArea] = useState<SubArea | null>(null);
  const [glowNode, setGlowNode] = useState<string | null>(null);
  const [popNode, setPopNode] = useState<string | null>(null);
  const [beamNode, setBeamNode] = useState<string | null>(null);
  const [orbitTx, setOrbitTx] = useState<TransitionState>("idle");
  const [assembled, setAssembled] = useState(false);
  const isDesktop = useIsDesktop();

  useEffect(() => {
    const t = setTimeout(() => setAssembled(true), 400);
    return () => clearTimeout(t);
  }, []);

  // Programs available for active county (or all if no county selected)
  const availablePrograms = activeCounty
    ? PROGRAMS.filter(p => (COUNTY_PROGRAM_MAP[activeCounty] ?? []).includes(p.slug))
    : PROGRAMS;

  function tapLogo() {
    setStage("map");
  }

  function tapCounty(countyId: string) {
    setActiveCounty(countyId);
    setOrbitTx("out");
    setTimeout(() => {
      setStage("county");
      setOrbitTx("in");
    }, 350);
    setTimeout(() => setOrbitTx("idle"), 750);
  }

  function tapProgram(prog: ProgramData) {
    setPopNode(prog.slug);
    setBeamNode(prog.slug);
    setGlowNode(prog.slug);
    setTimeout(() => setOrbitTx("out"), 120);
    setTimeout(() => {
      setActiveProgram(prog);
      setActiveSubArea(null);
      setStage("program");
      setOrbitTx("in");
      setGlowNode(null);
      setBeamNode(null);
    }, 480);
    setTimeout(() => {
      setOrbitTx("idle");
      setPopNode(null);
    }, 900);
  }

  function tapSubArea(area: SubArea) {
    setPopNode(area.id);
    setGlowNode(area.id);
    setTimeout(() => {
      setActiveSubArea(area);
      setStage("content");
      setGlowNode(null);
      setPopNode(null);
    }, 300);
  }

  function goBack() {
    setOrbitTx("out");
    setTimeout(() => {
      if (stage === "content") {
        setActiveSubArea(null);
        setStage("program");
      } else if (stage === "program") {
        setActiveProgram(null);
        setStage(activeCounty ? "county" : "map");
      } else if (stage === "county") {
        setActiveCounty(null);
        setStage("map");
      } else if (stage === "map") {
        setStage("entry");
      }
      setOrbitTx("in");
    }, 300);
    setTimeout(() => setOrbitTx("idle"), 700);
  }

  const activeCountyName = activeCounty
    ? SW_OK_COUNTIES.find(c => c.id === activeCounty)?.name ?? activeCounty
    : null;

  if (isDesktop) {
    return <DesktopLayout
      stage={stage} activeCounty={activeCounty} activeCountyName={activeCountyName}
      activeProgram={activeProgram} activeSubArea={activeSubArea}
      availablePrograms={availablePrograms}
      glowNode={glowNode} popNode={popNode} beamNode={beamNode} orbitTx={orbitTx}
      assembled={assembled}
      tapLogo={tapLogo} tapCounty={tapCounty} tapProgram={tapProgram}
      tapSubArea={tapSubArea} goBack={goBack}
      isDesktop={isDesktop}
    />;
  }

  return <MobileLayout
    stage={stage} activeCounty={activeCounty} activeCountyName={activeCountyName}
    activeProgram={activeProgram} activeSubArea={activeSubArea}
    availablePrograms={availablePrograms}
    glowNode={glowNode} popNode={popNode} beamNode={beamNode} orbitTx={orbitTx}
    assembled={assembled}
    tapLogo={tapLogo} tapCounty={tapCounty} tapProgram={tapProgram}
    tapSubArea={tapSubArea} goBack={goBack}
    isDesktop={isDesktop}
  />;
}

// ─── Shared props ─────────────────────────────────────────────────────────────

interface LayoutProps {
  stage: Stage;
  activeCounty: string | null;
  activeCountyName: string | null;
  activeProgram: ProgramData | null;
  activeSubArea: SubArea | null;
  availablePrograms: ProgramData[];
  glowNode: string | null;
  popNode: string | null;
  beamNode: string | null;
  orbitTx: TransitionState;
  assembled: boolean;
  isDesktop: boolean;
  tapLogo: () => void;
  tapCounty: (id: string) => void;
  tapProgram: (p: ProgramData) => void;
  tapSubArea: (a: SubArea) => void;
  goBack: () => void;
}

// ─── DESKTOP LAYOUT ───────────────────────────────────────────────────────────

function DesktopLayout({ stage, activeCounty, activeCountyName, activeProgram, activeSubArea, availablePrograms, glowNode, popNode, beamNode, orbitTx, assembled, tapLogo, tapCounty, tapProgram, tapSubArea, goBack, isDesktop }: LayoutProps) {
  return (
    <div style={{ background: T.void, minHeight: "100vh", fontFamily: "'Space Grotesk', 'Inter', sans-serif", position: "relative", overflow: "hidden" }}>
      <ParticleField />

      {/* Utility nav */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 48px", borderBottom: `1px solid ${T.border}`, background: "white", boxShadow: "0 1px 12px rgba(1,1,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: T.blue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🏛️</div>
          <div>
            <div style={{ color: T.blue, fontWeight: 700, fontSize: 14, letterSpacing: "0.05em" }}>CADC</div>
            <div style={{ color: T.textMuted, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase" }}>Community Action</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 32 }}>
          {["About", "Contact", "580-335-5588"].map((item, i) => (
            <a key={item} href={i === 2 ? "tel:+15803355588" : `/${item.toLowerCase()}`}
              style={{ color: T.textMuted, fontSize: 13, fontWeight: 600, textDecoration: "none", letterSpacing: "0.05em", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = T.blue)}
              onMouseLeave={e => (e.currentTarget.style.color = T.textMuted)}
            >{item}</a>
          ))}
        </div>
      </nav>

      {/* Main split layout */}
      <div style={{ display: "flex", height: "100vh", paddingTop: 64 }}>

        {/* LEFT — Orbit / Map panel */}
        <div style={{ width: "42%", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", flexDirection: "column" }}>

          {/* Back button */}
          {stage !== "entry" && (
            <button onClick={goBack} style={{
              position: "absolute", top: 24, left: 48, zIndex: 10,
              background: "white", border: `1px solid ${T.border}`,
              color: T.blue, padding: "8px 18px", borderRadius: 8,
              fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", cursor: "pointer",
              textTransform: "uppercase", transition: "all 0.2s",
              boxShadow: "0 2px 8px rgba(1,1,255,0.08)",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#E4E4FF"; e.currentTarget.style.borderColor = T.blue; }}
              onMouseLeave={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.borderColor = T.border; }}
            >← Back</button>
          )}

          {/* County label breadcrumb */}
          {activeCountyName && (stage === "county" || stage === "program" || stage === "content") && (
            <div style={{ position: "absolute", top: 24, right: 24, color: T.maroon, fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }}>
              {activeCountyName} County
            </div>
          )}

          {/* Entry state — large tappable logo */}
          {stage === "entry" && (
            <button
              onClick={tapLogo}
              style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}
            >
              <div style={{
                width: 200, height: 200, borderRadius: "50%", background: "white",
                border: `4px solid ${T.blue}`,
                boxShadow: `0 0 0 12px rgba(1,1,255,0.08), 0 0 60px rgba(1,1,255,0.2)`,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4,
                animation: "logoAssemble 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards, logoFloat 3.5s ease-in-out 0.8s infinite",
              }}>
                <span style={{ color: T.blue, fontWeight: 900, fontSize: 42, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "0.02em" }}>CADC</span>
                <div style={{ width: 48, height: 3, background: T.maroon, borderRadius: 2 }} />
                <span style={{ color: "#555", fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", textAlign: "center", lineHeight: 1.3 }}>Community Action<br />Development Corp.</span>
              </div>
              <span style={{ color: T.textMuted, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}>Tap to Explore Your County</span>
            </button>
          )}

          {/* Map state */}
          {stage === "map" && (
            <div style={{ width: "min(90%,420px)", animation: "fadeSlideIn 0.4s ease", background: "white", borderRadius: 16, border: `1px solid ${T.border}`, padding: 12 }}>
              <OklahomaCountyMap
                selectedCounty={null}
                onSelectCounty={tapCounty}
                dark={false}
              />
            </div>
          )}

          {/* County / Program / Content state — show orbit */}
          {(stage === "county" || stage === "program" || stage === "content") && (
            <SpringOrbit
              stage={stage} activeProgram={activeProgram}
              availablePrograms={availablePrograms}
              glowNode={glowNode} popNode={popNode} beamNode={beamNode} orbitTx={orbitTx}
              assembled={assembled}
              tapProgram={tapProgram} tapSubArea={tapSubArea}
            />
          )}
        </div>

        {/* RIGHT — Content panel */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px", borderLeft: `1px solid ${T.border}`, background: "white" }}>
          <DesktopContentPanel stage={stage} activeCountyName={activeCountyName} activeProgram={activeProgram} activeSubArea={activeSubArea} availablePrograms={availablePrograms} tapCounty={tapCounty} />
        </div>
      </div>

      <DesktopStyles />
    </div>
  );
}

function DesktopOrbit({ stage, activeProgram, availablePrograms, glowNode, popNode, beamNode, orbitTx, assembled, tapProgram, tapSubArea }: {
  stage: Stage; activeProgram: ProgramData | null; availablePrograms: ProgramData[]; glowNode: string | null;
  popNode: string | null; beamNode: string | null; orbitTx: TransitionState;
  assembled: boolean; tapProgram: (p: ProgramData) => void; tapSubArea: (a: SubArea) => void;
}) {
  const subAreas = activeProgram?.subAreas ?? [];
  const items = (stage === "county") ? availablePrograms : (stage === "program" || stage === "content") ? subAreas : availablePrograms;
  const RADIUS = 38;
  const SIZE = "min(80vw,420px)";

  return (
    <div style={{ width: SIZE, aspectRatio: "1/1", position: "relative" }}>
      {/* Outer glow ring */}
      <div style={{
        position: "absolute", inset: "8%", borderRadius: "50%",
        border: "1px dashed rgba(1,1,255,0.2)",
        boxShadow: "none",
      }} />

      {/* SVG connectors */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }} viewBox="0 0 100 100" aria-hidden="true">
        {items.map((item, i) => {
          const { x, y } = orbitPos(i, items.length, RADIUS);
          const isActive = (stage === "program" || stage === "content")
            ? (item as SubArea).id === glowNode
            : (item as ProgramData).slug === glowNode;
          return (
            <line key={i} x1={50} y1={50} x2={x} y2={y}
              stroke={isActive ? "rgba(1,1,255,0.8)" : "rgba(1,1,255,0.15)"}
              strokeWidth={isActive ? 1.5 : 0.6}
              strokeDasharray="2 3"
              style={{ transition: "stroke 0.3s, stroke-width 0.3s" }}
            />
          );
        })}
      </svg>

      {/* Center hub */}
      <div style={{
        position: "absolute", left: "50%", top: "50%",
        transform: "translate(-50%,-50%)",
        width: "clamp(72px,16%,88px)", aspectRatio: "1/1",
        borderRadius: "50%", background: "white",
        border: `2px solid ${T.blue}`,
        boxShadow: orbitTx === "out"
          ? `0 0 0 12px rgba(1,1,255,0.08), 0 8px 32px rgba(1,1,255,0.18)`
          : `0 0 0 6px rgba(1,1,255,0.06), 0 4px 20px rgba(1,1,255,0.14)`,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: 2,
        transition: "box-shadow 0.3s ease",
        animation: orbitTx === "out" ? "hubPulse 0.4s ease-out" : "none",
      }}>
        <span style={{
          fontSize: "clamp(1rem,2.5vw,1.4rem)",
          animation: orbitTx !== "idle" ? "hubSpin 0.45s ease-in-out" : "none",
        }}>
          {(stage === "program" || stage === "content") ? activeProgram?.icon : "🏛️"}
        </span>
        <span style={{
          color: T.blue,
          fontSize: (stage === "program" || stage === "content") ? "clamp(0.32rem,0.7vw,0.42rem)" : "clamp(0.35rem,0.8vw,0.5rem)",
          fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase",
          textAlign: "center", padding: "0 4px", lineHeight: 1.2,
          transition: "opacity 0.2s ease",
          opacity: orbitTx === "out" ? 0 : 1,
        }}>
          {(stage === "program" || stage === "content") ? activeProgram?.shortName : "CADC"}
        </span>
      </div>

      {/* Nodes */}
      {items.map((item, i) => {
        const { x, y } = orbitPos(i, items.length, RADIUS);
        const prog = item as ProgramData;
        const sub = item as SubArea;
        const isProgLevel = stage === "county";
        const id = isProgLevel ? prog.slug : (stage === "program" || stage === "content") ? sub.id : prog.slug;
        const label = isProgLevel ? prog.shortName : (stage === "program" || stage === "content") ? sub.shortLabel : prog.shortName;
        const icon = isProgLevel ? prog.icon : (stage === "program" || stage === "content") ? sub.icon : prog.icon;
        const isGlowing = id === glowNode;
        const isPopped = id === popNode;
        const isBeaming = id === beamNode;

        // Orbit transition: nodes fly out toward edges (out) or bloom in from center (in)
        const exitX = orbitTx === "out" ? (x - 50) * 0.4 : 0;
        const exitY = orbitTx === "out" ? (y - 50) * 0.4 : 0;
        const entryScale = orbitTx === "in" ? 1 : orbitTx === "out" ? 0.6 : 1;
        const txOpacity = orbitTx === "out" ? 0 : 1;
        const initDelay = assembled ? 0 : i * 80;
        const bloomDelay = orbitTx === "in" ? i * 45 : 0;

        return (
          <button
            key={id}
            onClick={() => (stage === "program" || stage === "content") ? tapSubArea(sub) : tapProgram(prog)}
            aria-label={(stage === "program" || stage === "content") ? sub.label : prog.name}
            style={{
              position: "absolute",
              left: `${x}%`, top: `${y}%`,
              width: "clamp(52px,11%,68px)",
              transform: `translate(calc(-50% + ${exitX}px), calc(-50% + ${exitY}px)) scale(${isPopped ? 1.28 : entryScale})`,
              display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
              background: "none", border: "none", cursor: "pointer", padding: 0,
              opacity: !assembled ? 0 : txOpacity,
              transition: orbitTx === "idle"
                ? `opacity 0.5s ease ${initDelay}ms, transform 0.25s cubic-bezier(0.34,1.56,0.64,1)`
                : `opacity 0.35s ease ${bloomDelay}ms, transform 0.38s cubic-bezier(0.34,1.56,0.64,1) ${bloomDelay}ms`,
              zIndex: isPopped ? 10 : 1,
            }}
            onMouseEnter={e => {
              if (!isPopped) (e.currentTarget.querySelector(".node-disc") as HTMLElement).style.transform = "scale(1.18)";
            }}
            onMouseLeave={e => {
              (e.currentTarget.querySelector(".node-disc") as HTMLElement).style.transform = "scale(1)";
            }}
          >
            {/* Ripple on glow */}
            {isGlowing && (
              <div style={{
                position: "absolute", inset: -14, borderRadius: "50%",
                background: `radial-gradient(circle, rgba(1,1,255,0.5) 0%, transparent 65%)`,
                animation: "desktopPing 0.7s ease-out forwards",
                pointerEvents: "none",
              }} />
            )}
            {/* Beam pulse traveling to center */}
            {isBeaming && (
              <div style={{
                position: "absolute", inset: -6, borderRadius: "50%",
                border: "2px solid rgba(1,1,255,0.9)",
                animation: "beamPulse 0.45s ease-out forwards",
                pointerEvents: "none",
              }} />
            )}
            <div className="node-disc" style={{
              width: "clamp(40px,8.5%,54px)", aspectRatio: "1/1",
              borderRadius: "50%",
              background: isPopped ? "#E4E4FF" : "white",
              border: `${isPopped ? 3 : 2}px solid ${isPopped ? T.blue : T.blue}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "clamp(0.9rem,2vw,1.2rem)",
              boxShadow: isPopped
                ? `0 0 24px rgba(1,1,255,0.3), 0 4px 16px rgba(1,1,255,0.15)`
                : `0 3px 12px rgba(1,1,255,0.12)`,
              transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease, border-width 0.15s ease",
            }}>
              {icon}
            </div>
            <span style={{
              color: T.blue,
              fontSize: "clamp(0.38rem,0.85vw,0.52rem)",
              fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em",
              textAlign: "center", lineHeight: 1.2, whiteSpace: "nowrap",
              transition: "color 0.2s ease",
            }}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function DesktopContentPanel({ stage, activeCountyName, activeProgram, activeSubArea, availablePrograms, tapCounty }: {
  stage: Stage; activeCountyName: string | null; activeProgram: ProgramData | null;
  activeSubArea: SubArea | null; availablePrograms: ProgramData[];
  tapCounty: (id: string) => void;
}) {
  if (stage === "entry") {
    return (
      <div style={{ maxWidth: 520, color: T.textPrimary }}>
        <p style={{ color: T.maroon, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>Helping People. Changing Lives.</p>
        <h1 style={{ fontSize: "clamp(2rem,3.5vw,3.2rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: 20, fontFamily: "'Space Grotesk', sans-serif", color: T.textPrimary }}>
          Community Action<br />
          <span style={{ color: T.blue }}>Development</span><br />
          Corporation
        </h1>
        <p style={{ color: T.textMuted, fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
          Serving 9 counties across Southwest Oklahoma — early childhood education, transportation, weatherization, senior nutrition, and more. Tap the CADC logo to find services in your county.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 32 }}>
          <a href="tel:+15803355588" style={{ background: T.blue, color: "white", padding: "12px 24px", borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: "none", letterSpacing: "0.05em" }}>📞 580-335-5588</a>
          <a href="/about" style={{ border: `1px solid ${T.border}`, color: T.blue, padding: "12px 24px", borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: "none" }}>About CADC</a>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
          {[["9","Programs"],["11","Head Start Centers"],["110","Transit Vehicles"],["6","Senior Meal Sites"],["17","Advantage Counties"],["1966","Est."]].map(([n,l])=>(
            <div key={l} style={{ background: "white", border: `1px solid ${T.border}`, borderRadius: 10, padding: "14px 10px", textAlign: "center", boxShadow: "0 2px 8px rgba(1,1,255,0.06)" }}>
              <div style={{ color: T.blue, fontWeight: 900, fontSize: 22 }}>{n}</div>
              <div style={{ color: T.textMuted, fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (stage === "map") {
    return (
      <div style={{ maxWidth: 520, color: T.textPrimary, animation: "fadeSlideIn 0.4s ease" }}>
        <p style={{ color: T.maroon, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 12px" }}>Select Your County</p>
        <h2 style={{ fontSize: "clamp(1.6rem,2.8vw,2.4rem)", fontWeight: 800, lineHeight: 1.15, margin: "0 0 16px", fontFamily: "'Space Grotesk', sans-serif", color: T.textPrimary }}>
          Where do you need help?
        </h2>
        <p style={{ color: T.textMuted, fontSize: 14, lineHeight: 1.6, margin: "0 0 24px" }}>
          Tap a county on the map to see which CADC programs are available in your area.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {SW_OK_COUNTIES.map(c => (
            <button key={c.id} onClick={() => tapCounty(c.id)} style={{
              background: "white", border: `1.5px solid ${T.blue}`,
              color: T.blue, padding: "8px 16px", borderRadius: 20,
              fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#E4E4FF"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "white"; }}
            >{c.name}</button>
          ))}
        </div>
        <p style={{ color: T.textMuted, fontSize: 11, marginTop: 20 }}>9 base counties · Helping People. Changing Lives.</p>
      </div>
    );
  }

  if (stage === "county" && activeCountyName) {
    const firstProg = availablePrograms[0];
    return (
      <div style={{ maxWidth: 540, color: T.textPrimary, maxHeight: "calc(100vh - 160px)", overflowY: "auto", animation: "fadeSlideIn 0.4s ease" }}>
        <p style={{ color: T.maroon, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 8px" }}>{activeCountyName} County</p>
        <h2 style={{ fontSize: "clamp(1.4rem,2.4vw,2rem)", fontWeight: 800, lineHeight: 1.15, margin: "0 0 16px", fontFamily: "'Space Grotesk', sans-serif", color: T.textPrimary }}>
          Programs available in your area
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
          {availablePrograms.map(p => (
            <div key={p.slug} style={{ background: "#E4E4FF", border: `1px solid rgba(1,1,255,0.2)`, borderRadius: 8, padding: "6px 12px", fontSize: 12, color: T.blue, fontWeight: 600 }}>
              {p.icon} {p.shortName}
            </div>
          ))}
        </div>
        {firstProg && (
          <div className="cadc-light-content">
            {firstProg.subAreas[0]?.content}
          </div>
        )}
        <p style={{ color: T.textMuted, fontSize: 11, marginTop: 16, fontStyle: "italic" }}>Tap a program node in the orbit for more detail.</p>
      </div>
    );
  }

  if (stage === "program" && activeProgram) {
    const firstSub = activeProgram.subAreas[0];
    return (
      <div style={{ maxWidth: 540, color: T.textPrimary, maxHeight: "calc(100vh - 160px)", overflowY: "auto", animation: "fadeSlideIn 0.4s ease" }}>
        <ProgramHeroBanner slug={activeProgram.slug} dark={false} />
        <div style={{ marginBottom: 20 }}>
          <p style={{ color: T.maroon, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 6px" }}>{activeProgram.tagline}</p>
          <h2 style={{ fontSize: "clamp(1.4rem,2.4vw,2rem)", fontWeight: 800, lineHeight: 1.15, margin: 0, fontFamily: "'Space Grotesk', sans-serif", color: T.textPrimary }}>
            {activeProgram.icon} {activeProgram.name}
          </h2>
        </div>
        {firstSub && (
          <div className="cadc-light-content">
            {firstSub.content}
          </div>
        )}
        <p style={{ color: T.textMuted, fontSize: 11, marginTop: 20, fontStyle: "italic" }}>Select any node in the orbit for more detail.</p>
      </div>
    );
  }

  if (stage === "content" && activeSubArea) {
    return (
      <div style={{ maxWidth: 540, color: T.textPrimary, maxHeight: "calc(100vh - 160px)", overflowY: "auto", animation: "clipReveal 0.45s cubic-bezier(0.22,1,0.36,1) forwards" }}>
        <h3 style={{ fontSize: "clamp(1.2rem,2vw,1.8rem)", fontWeight: 800, lineHeight: 1.2, marginBottom: 20, fontFamily: "'Space Grotesk', sans-serif", color: T.textPrimary }}>
          {activeSubArea.icon} {activeSubArea.label}
        </h3>
        <div className="cadc-light-content">
          {activeSubArea.content}
        </div>
      </div>
    );
  }

  return null;
}

// ─── MOBILE LAYOUT ────────────────────────────────────────────────────────────

function MobileLayout({ stage, activeCounty, activeCountyName, activeProgram, activeSubArea, availablePrograms, glowNode, popNode, beamNode, orbitTx, assembled, tapLogo, tapCounty, tapProgram, tapSubArea, goBack, isDesktop }: LayoutProps) {
  return (
    <div style={{ background: T.ghost, minHeight: "100svh", fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>

      {/* RESTORED: Blue utility bar */}
      <div style={{ background: T.blue, padding: "9px 20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <a href="tel:+18005245552" style={{ color: "white", fontWeight: 700, fontSize: 13, textDecoration: "none", letterSpacing: "0.03em" }}>
          📞 Ride the River: 1-800-524-5552
        </a>
      </div>

      {/* Mobile header */}
      <div style={{ position: "sticky", top: 0, zIndex: 40, background: "white", borderBottom: `1px solid ${T.border}`, padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {stage !== "entry" && (
            <button onClick={goBack} style={{ background: "none", border: "none", cursor: "pointer", color: T.blue, fontSize: 18, marginRight: 4, padding: 0 }} aria-label="Back">←</button>
          )}
          {/* CADC logo circle */}
          <div style={{ width: 38, height: 38, borderRadius: "50%", border: `2px solid ${T.blue}`, display: "flex", alignItems: "center", justifyContent: "center", background: "white" }}>
            <span style={{ color: T.blue, fontWeight: 900, fontSize: 10, letterSpacing: "0.05em" }}>CADC</span>
          </div>
          {stage === "map" && <span style={{ color: T.textMuted, fontSize: 12 }}>/ Select County</span>}
          {activeCountyName && stage !== "entry" && stage !== "map" && <span style={{ color: T.maroon, fontSize: 12, fontWeight: 700 }}>/ {activeCountyName}</span>}
          {stage === "program" && activeProgram && <span style={{ color: T.textMuted, fontSize: 12 }}>/ {activeProgram.shortName}</span>}
          {stage === "content" && activeSubArea && <span style={{ color: T.textMuted, fontSize: 12 }}>/ {activeSubArea.shortLabel}</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <a href="/about" style={{ color: T.blue, fontSize: 12, fontWeight: 700, textDecoration: "none" }}>About</a>
          <a href="/contact" style={{ color: T.blue, fontSize: 12, fontWeight: 700, textDecoration: "none" }}>Contact</a>
          <a href="tel:+15803355588" style={{ background: T.maroon, color: "white", padding: "6px 14px", borderRadius: 6, fontSize: 11, fontWeight: 700, textDecoration: "none" }}>📞 Call</a>
        </div>
      </div>

      {/* ENTRY — Large tappable logo, centered */}
      {stage === "entry" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 20px 40px", minHeight: "70svh" }}>
          <button
            onClick={tapLogo}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}
          >
            <div style={{
              width: 200, height: 200, borderRadius: "50%", background: "white",
              border: `4px solid ${T.blue}`,
              boxShadow: `0 0 0 10px rgba(1,1,255,0.06), 0 8px 40px rgba(1,1,255,0.15)`,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4,
            }}>
              <span style={{ color: T.blue, fontWeight: 900, fontSize: 40, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "0.02em" }}>CADC</span>
              <div style={{ width: 44, height: 3, background: T.maroon, borderRadius: 2 }} />
              <span style={{ color: "#555", fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "center", lineHeight: 1.4 }}>Community Action<br />Development Corp.</span>
            </div>
            <span style={{ color: T.blue, fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase" }}>Tap to Explore Your County</span>
          </button>
        </div>
      )}

      {/* MAP — Geographic county selector */}
      {stage === "map" && (
        <div style={{ padding: "20px 20px 40px" }}>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <p style={{ color: T.maroon, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", margin: "0 0 6px" }}>Select Your County</p>
            <h2 style={{ color: T.blue, fontWeight: 800, fontSize: 22, margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}>Where do you need help?</h2>
          </div>
          <div style={{ background: "white", borderRadius: 16, border: `1px solid ${T.border}`, overflow: "hidden", padding: 12 }}>
            <OklahomaCountyMap selectedCounty={null} onSelectCounty={tapCounty} dark={false} />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16, justifyContent: "center" }}>
            {SW_OK_COUNTIES.map(c => (
              <button key={c.id} onClick={() => tapCounty(c.id)} style={{
                background: "white", border: `1.5px solid ${T.blue}`, color: T.blue,
                padding: "8px 16px", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer",
              }}>{c.name}</button>
            ))}
          </div>
          <p style={{ textAlign: "center", color: T.textMuted, fontSize: 11, marginTop: 12 }}>9 base counties · Helping People. Changing Lives.</p>
        </div>
      )}

      {/* COUNTY — Orbit + program list */}
      {(stage === "county" || stage === "program" || stage === "content") && (
        <>
          <div style={{ padding: "12px 20px 0", textAlign: "center" }}>
            {activeCountyName && (
              <p style={{ color: T.maroon, fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.14em", margin: "0 0 2px" }}>
                {activeCountyName} County — {availablePrograms.length} programs available
              </p>
            )}
            <p style={{ color: T.textMuted, fontSize: 11, margin: 0 }}>Tap a program node to explore</p>
          </div>
          <div style={{ padding: "12px 0 0" }}>
            <SpringOrbit
              stage={stage} activeProgram={activeProgram}
              availablePrograms={availablePrograms}
              glowNode={glowNode} popNode={popNode} beamNode={beamNode} orbitTx={orbitTx}
              assembled={assembled}
              tapProgram={tapProgram} tapSubArea={tapSubArea}
              isMobile={true}
            />
          </div>
        </>
      )}

      {/* Content below orbit — program landing */}
      {stage === "program" && activeProgram && !activeSubArea && (
        <div style={{ padding: "0 20px 80px", animation: "mobileContentIn 0.4s cubic-bezier(0.22,1,0.36,1) forwards" }}>
          <ProgramHeroBanner slug={activeProgram.slug} dark={false} />
          <div style={{ background: "white", borderRadius: 16, overflow: "hidden", border: `1px solid ${T.border}` }}>
            <div style={{ background: T.blue, padding: "14px 20px" }}>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 4px" }}>{activeProgram.tagline}</p>
              <h2 style={{ color: "white", fontWeight: 800, fontSize: 17, margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}>
                {activeProgram.icon} {activeProgram.name}
              </h2>
            </div>
            <div style={{ padding: 20 }} className="cadc-light-content">
              {activeProgram.subAreas[0]?.content}
            </div>
            <div style={{ padding: "0 20px 16px" }}>
              <p style={{ color: T.textMuted, fontSize: 11, fontStyle: "italic", margin: 0 }}>Tap any node above to explore more.</p>
            </div>
          </div>
        </div>
      )}

      {/* Content below orbit — sub-area detail */}
      {stage === "content" && activeSubArea && (
        <div style={{ padding: "0 20px 80px", animation: "mobileContentIn 0.4s cubic-bezier(0.22,1,0.36,1) forwards" }}>
          <div style={{ background: "white", borderRadius: 16, overflow: "hidden", border: `1px solid ${T.border}` }}>
            <div style={{ background: T.blue, padding: "14px 20px" }}>
              <h3 style={{ color: "white", fontWeight: 800, fontSize: 16, margin: 0 }}>
                {activeSubArea.icon} {activeSubArea.label}
              </h3>
            </div>
            <div style={{ padding: 20 }} className="cadc-light-content">
              {activeSubArea.content}
            </div>
          </div>
        </div>
      )}

      {/* County landing — show available programs summary */}
      {stage === "county" && !activeProgram && (
        <div style={{ padding: "16px 20px 80px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {availablePrograms.map(p => (
              <button key={p.slug} onClick={() => tapProgram(p)}
                style={{ background: "white", border: `1px solid ${T.border}`, borderRadius: 12, padding: 16, textAlign: "left", cursor: "pointer" }}>
                <span style={{ fontSize: 24, display: "block", marginBottom: 6 }}>{p.icon}</span>
                <span style={{ color: T.blue, fontWeight: 700, fontSize: 12, display: "block" }}>{p.shortName}</span>
                <span style={{ color: T.textMuted, fontSize: 10 }}>{p.tagline}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <MobileStyles />
    </div>
  );
}

function MobileOrbit({ stage, activeProgram, availablePrograms, glowNode, popNode, beamNode, orbitTx, assembled, tapProgram, tapSubArea }: {
  stage: Stage; activeProgram: ProgramData | null; availablePrograms: ProgramData[]; glowNode: string | null;
  popNode: string | null; beamNode: string | null; orbitTx: TransitionState;
  assembled: boolean; tapProgram: (p: ProgramData) => void; tapSubArea: (a: SubArea) => void;
}) {
  const subAreas = activeProgram?.subAreas ?? [];
  const items = (stage === "program" || stage === "content") ? subAreas : availablePrograms;
  const RADIUS = 38;

  return (
    <div style={{ position: "relative", margin: "0 auto", width: "min(92vw, 400px)", aspectRatio: "1/1" }}>
      {/* Ring */}
      <div style={{
        position: "absolute", inset: "10%", borderRadius: "50%",
        border: `1.5px dashed rgba(1,1,255,0.2)`,
        boxShadow: "0 0 24px rgba(1,1,255,0.06)",
      }} />

      {/* SVG connectors */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }} viewBox="0 0 100 100" aria-hidden="true">
        {items.map((item, i) => {
          const { x, y } = orbitPos(i, items.length, RADIUS);
          return (
            <line key={i} x1={50} y1={50} x2={x} y2={y}
              stroke="rgba(1,1,255,0.12)" strokeWidth={0.7} strokeDasharray="2 3"
            />
          );
        })}
      </svg>

      {/* Center hub */}
      <div style={{
        position: "absolute", left: "50%", top: "50%",
        transform: "translate(-50%,-50%)",
        width: "clamp(60px,18vw,80px)", aspectRatio: "1/1",
        borderRadius: "50%", background: "white",
        border: `2.5px solid ${T.blue}`,
        boxShadow: `0 0 0 5px rgba(1,1,255,0.08), 0 4px 20px rgba(1,1,255,0.18)`,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1,
      }}>
        <span style={{ fontSize: "clamp(1rem,5vw,1.4rem)" }}>{(stage === "program" || stage === "content") ? activeProgram?.icon : "🏛️"}</span>
        <span style={{ color: T.blue, fontSize: "clamp(0.35rem,1.8vw,0.5rem)", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", textAlign: "center", lineHeight: 1.2, padding: "0 4px" }}>
          {(stage === "program" || stage === "content") ? activeProgram?.shortName : "CADC"}
        </span>
      </div>

      {/* Nodes */}
      {items.map((item, i) => {
        const { x, y } = orbitPos(i, items.length, RADIUS);
        const prog = item as ProgramData;
        const sub = item as SubArea;
        const isSubLevel = stage === "program" || stage === "content";
        const id = isSubLevel ? sub.id : prog.slug;
        const label = isSubLevel ? sub.shortLabel : prog.shortName;
        const icon = isSubLevel ? sub.icon : prog.icon;
        const isGlowing = id === glowNode;
        const isPopped = id === popNode;
        const initDelay = assembled ? 0 : i * 60;
        const bloomDelay = orbitTx === "in" ? i * 40 : 0;

        const exitX = orbitTx === "out" ? (x - 50) * 0.35 : 0;
        const exitY = orbitTx === "out" ? (y - 50) * 0.35 : 0;
        const txOpacity = orbitTx === "out" ? 0 : 1;
        const txScale = orbitTx === "in" ? 1 : orbitTx === "out" ? 0.5 : 1;

        return (
          <button
            key={id}
            onClick={() => isSubLevel ? tapSubArea(sub) : tapProgram(prog)}
            aria-label={label}
            style={{
              position: "absolute",
              left: `${x}%`, top: `${y}%`,
              width: "clamp(48px,13vw,64px)",
              transform: `translate(calc(-50% + ${exitX}px), calc(-50% + ${exitY}px)) scale(${isPopped ? 1.25 : txScale})`,
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              background: "none", border: "none", cursor: "pointer", padding: 0,
              opacity: !assembled ? 0 : txOpacity,
              transition: orbitTx === "idle"
                ? `opacity 0.45s ease ${initDelay}ms, transform 0.22s cubic-bezier(0.34,1.56,0.64,1)`
                : `opacity 0.3s ease ${bloomDelay}ms, transform 0.36s cubic-bezier(0.34,1.56,0.64,1) ${bloomDelay}ms`,
              zIndex: isPopped ? 10 : 1,
            }}
          >
            {isGlowing && (
              <div style={{
                position: "absolute", inset: -8, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(1,1,255,0.4) 0%, transparent 70%)",
                animation: "mobilePing 0.6s ease-out forwards", pointerEvents: "none",
              }} />
            )}
            {isPopped && (
              <div style={{
                position: "absolute", inset: -5, borderRadius: "50%",
                border: `2px solid ${T.blue}`,
                animation: "mobilePing 0.5s ease-out forwards", pointerEvents: "none",
              }} />
            )}
            <div style={{
              width: "clamp(34px,10vw,48px)", aspectRatio: "1/1",
              borderRadius: "50%",
              background: isPopped ? "#E4E4FF" : "white",
              border: `${isPopped ? 3 : 2}px solid ${T.blue}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "clamp(0.85rem,4vw,1.1rem)",
              boxShadow: isPopped
                ? `0 0 18px rgba(1,1,255,0.4), 0 4px 14px rgba(1,1,255,0.2)`
                : "0 2px 10px rgba(1,1,255,0.14)",
              transition: "box-shadow 0.2s ease, background 0.15s ease",
            }}>
              {icon}
            </div>
            <span style={{
              color: isPopped ? T.blue : T.blue,
              fontSize: "clamp(0.36rem,1.6vw,0.48rem)",
              fontWeight: isPopped ? 800 : 700,
              textTransform: "uppercase", letterSpacing: "0.05em",
              textAlign: "center", lineHeight: 1.2,
              width: "clamp(48px,13vw,64px)", overflowWrap: "break-word",
            }}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

function DesktopStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;700&display=swap');

      /* ── Logo entry — spring-inspired float with glow bloom ── */
      @keyframes logoFloat {
        0%   { transform: translateY(0px) scale(1); filter: drop-shadow(0 0 12px rgba(1,1,255,0.3)); }
        50%  { transform: translateY(-14px) scale(1.02); filter: drop-shadow(0 0 28px rgba(1,1,255,0.55)); }
        100% { transform: translateY(0px) scale(1); filter: drop-shadow(0 0 12px rgba(1,1,255,0.3)); }
      }

      /* ── Logo first-appear assembly ── */
      @keyframes logoAssemble {
        0%   { transform: scale(0.4) rotate(-12deg); opacity: 0; filter: blur(12px); }
        60%  { transform: scale(1.08) rotate(2deg); opacity: 1; filter: blur(0); }
        80%  { transform: scale(0.96) rotate(-1deg); }
        100% { transform: scale(1) rotate(0deg); opacity: 1; filter: blur(0); }
      }

      /* ── Content panel reveal — cinematic wipe ── */
      @keyframes clipReveal {
        0%   { clip-path: inset(0 100% 0 0); opacity: 0; transform: translateX(20px); }
        15%  { opacity: 0.8; }
        100% { clip-path: inset(0 0% 0 0); opacity: 1; transform: translateX(0); }
      }

      /* ── Content panel slide in with overshoot ── */
      @keyframes fadeSlideIn {
        0%   { opacity: 0; transform: translateX(32px) scale(0.97); }
        65%  { transform: translateX(-4px) scale(1.005); }
        100% { opacity: 1; transform: translateX(0) scale(1); }
      }

      /* ── Stage transition — portal swirl ── */
      @keyframes stagePortal {
        0%   { transform: scale(0) rotate(-180deg); opacity: 0; filter: blur(16px); }
        50%  { filter: blur(4px); }
        75%  { transform: scale(1.05) rotate(4deg); opacity: 1; filter: blur(0); }
        100% { transform: scale(1) rotate(0deg); opacity: 1; filter: blur(0); }
      }

      /* ── Hub pulse — living heartbeat ── */
      @keyframes hubPulse {
        0%   { transform: translate(-50%,-50%) scale(1); box-shadow: 0 0 0 0 rgba(1,1,255,0.4); }
        50%  { transform: translate(-50%,-50%) scale(1.06); box-shadow: 0 0 0 20px rgba(1,1,255,0); }
        100% { transform: translate(-50%,-50%) scale(1); box-shadow: 0 0 0 0 rgba(1,1,255,0); }
      }

      /* ── Hub icon morph on stage change ── */
      @keyframes hubSpin {
        0%   { transform: scale(1) rotate(0deg); opacity: 1; }
        30%  { transform: scale(0.3) rotate(135deg); opacity: 0; filter: blur(4px); }
        70%  { transform: scale(0.3) rotate(-135deg); opacity: 0; filter: blur(4px); }
        100% { transform: scale(1) rotate(0deg); opacity: 1; filter: blur(0); }
      }

      /* ── Map county tap — shockwave ── */
      @keyframes countyShock {
        0%   { transform: scale(1); opacity: 1; }
        40%  { transform: scale(1.15); opacity: 0.8; }
        100% { transform: scale(1); opacity: 1; }
      }

      /* ── Mobile content enter ── */
      @keyframes mobileContentIn {
        0%   { opacity: 0; transform: translateY(40px) scale(0.95); }
        60%  { transform: translateY(-6px) scale(1.01); }
        80%  { transform: translateY(3px) scale(0.998); }
        100% { opacity: 1; transform: translateY(0) scale(1); }
      }

      /* ── Node hover glow ── */
      .node-disc {
        transition: box-shadow 0.2s ease, border-color 0.2s ease, background 0.15s ease;
      }
      button:hover .node-disc {
        filter: brightness(1.15);
      }

      /* ── Dark content styles ── */
      .cadc-dark-content p { color: rgba(255,255,255,0.7); font-size: 14px; line-height: 1.7; margin: 0 0 14px; }
      .cadc-dark-content strong { color: white; }
      .cadc-dark-content .cadc-card { background: rgba(1,1,255,0.12); border: 1px solid rgba(1,1,255,0.25); border-radius: 12px; padding: 16px; margin: 14px 0; }
      .cadc-dark-content .cadc-card-sm { background: rgba(1,1,255,0.1); border: 1px solid rgba(1,1,255,0.2); border-radius: 10px; padding: 14px; margin: 8px 0; }
      .cadc-dark-content .cadc-card-title { color: rgba(1,1,255,0.9); font-weight: 700; font-size: 12px; margin: 0 0 6px; text-transform: uppercase; letter-spacing: 0.06em; }
      .cadc-dark-content .cadc-label { color: rgba(204,0,0,0.9); font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 8px; }
      .cadc-dark-content .cadc-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; }
      .cadc-dark-content .cadc-list li { color: rgba(255,255,255,0.65); font-size: 13px; padding-left: 14px; position: relative; }
      .cadc-dark-content .cadc-list li::before { content: "·"; position: absolute; left: 0; color: ${T.blue}; font-weight: 700; }
      .cadc-dark-content .cadc-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 12px 0; }
      .cadc-dark-content .cadc-chip { background: rgba(1,1,255,0.15); border: 1px solid rgba(1,1,255,0.25); border-radius: 6px; padding: 6px 10px; font-size: 12px; color: rgba(255,255,255,0.7); font-weight: 600; }
      .cadc-dark-content .cadc-stack { display: flex; flex-direction: column; gap: 8px; }
      .cadc-dark-content .cadc-btn { display: inline-flex; align-items: center; justify-content: center; background: ${T.maroon}; color: white; padding: 12px 20px; border-radius: 8px; font-size: 13px; font-weight: 700; text-decoration: none; margin-top: 8px; transition: transform 0.15s ease, box-shadow 0.15s ease; }
      .cadc-dark-content .cadc-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(204,0,0,0.4); }
      .cadc-dark-content .cadc-link { color: ${T.blue}; font-weight: 700; font-size: 14px; text-decoration: none; }
      .cadc-dark-content .cadc-note { color: rgba(255,255,255,0.4); font-size: 11px; font-style: italic; margin: 8px 0 0; }
      .cadc-dark-content .cadc-fare-table { border: 1px solid rgba(1,1,255,0.25); border-radius: 10px; overflow: hidden; margin: 14px 0; }
      .cadc-dark-content .cadc-fare-header { display: grid; grid-template-columns: 2fr 1fr 1fr; background: rgba(1,1,255,0.25); padding: 8px 14px; }
      .cadc-dark-content .cadc-fare-header span { color: rgba(255,255,255,0.9); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
      .cadc-dark-content .cadc-fare-row { display: grid; grid-template-columns: 2fr 1fr 1fr; padding: 8px 14px; border-top: 1px solid rgba(1,1,255,0.1); }
      .cadc-dark-content .cadc-fare-row span { color: rgba(255,255,255,0.65); font-size: 12px; font-family: 'JetBrains Mono', monospace; }
      .cadc-dark-content .cadc-content { display: flex; flex-direction: column; }
    `}</style>
  );
}

function MobileStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');

      @keyframes mobileContentIn {
        0%   { opacity: 0; transform: translateY(40px) scale(0.95); }
        60%  { transform: translateY(-6px) scale(1.01); }
        80%  { transform: translateY(3px) scale(0.998); }
        100% { opacity: 1; transform: translateY(0) scale(1); }
      }
      @keyframes logoAssemble {
        0%   { transform: scale(0.4) rotate(-12deg); opacity: 0; filter: blur(12px); }
        60%  { transform: scale(1.08) rotate(2deg); opacity: 1; filter: blur(0); }
        80%  { transform: scale(0.96) rotate(-1deg); }
        100% { transform: scale(1) rotate(0deg); opacity: 1; }
      }
      @keyframes logoFloat {
        0%,100% { transform: translateY(0px) scale(1); filter: drop-shadow(0 0 8px rgba(1,1,255,0.25)); }
        50%     { transform: translateY(-12px) scale(1.02); filter: drop-shadow(0 0 20px rgba(1,1,255,0.5)); }
      }
      @keyframes fadeSlideIn {
        0%   { opacity: 0; transform: translateY(20px); }
        65%  { transform: translateY(-3px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      @keyframes countyShock {
        0%   { transform: scale(1); }
        40%  { transform: scale(1.12); }
        100% { transform: scale(1); }
      }

      .node-disc { transition: box-shadow 0.2s ease, border-color 0.2s ease; }

      .cadc-light-content p { color: #374151; font-size: 14px; line-height: 1.7; margin: 0 0 12px; }
      .cadc-light-content strong { color: #111827; }
      .cadc-light-content .cadc-card { background: #E4E4FF; border-radius: 10px; padding: 14px; margin: 12px 0; }
      .cadc-light-content .cadc-card-sm { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 12px; margin: 6px 0; }
      .cadc-light-content .cadc-card-title { color: ${T.blue}; font-weight: 700; font-size: 11px; margin: 0 0 5px; text-transform: uppercase; letter-spacing: 0.06em; }
      .cadc-light-content .cadc-label { color: ${T.maroon}; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 8px; }
      .cadc-light-content .cadc-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; }
      .cadc-light-content .cadc-list li { color: #374151; font-size: 13px; padding-left: 14px; position: relative; }
      .cadc-light-content .cadc-list li::before { content: "·"; position: absolute; left: 0; color: ${T.blue}; font-weight: 700; }
      .cadc-light-content .cadc-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin: 10px 0; }
      .cadc-light-content .cadc-chip { background: #E4E4FF; border-radius: 6px; padding: 6px 10px; font-size: 11px; color: ${T.blue}; font-weight: 600; text-align: center; }
      .cadc-light-content .cadc-stack { display: flex; flex-direction: column; gap: 6px; }
      .cadc-light-content .cadc-btn { display: inline-flex; align-items: center; justify-content: center; background: ${T.maroon}; color: white; padding: 12px 18px; border-radius: 8px; font-size: 13px; font-weight: 700; text-decoration: none; margin-top: 8px; }
      .cadc-light-content .cadc-link { color: ${T.blue}; font-weight: 700; font-size: 13px; text-decoration: none; }
      .cadc-light-content .cadc-note { color: #9ca3af; font-size: 11px; font-style: italic; margin: 6px 0 0; }
      .cadc-light-content .cadc-fare-table { border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden; margin: 12px 0; }
      .cadc-light-content .cadc-fare-header { display: grid; grid-template-columns: 2fr 1fr 1fr; background: ${T.blue}; padding: 8px 12px; }
      .cadc-light-content .cadc-fare-header span { color: white; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
      .cadc-light-content .cadc-fare-row { display: grid; grid-template-columns: 2fr 1fr 1fr; padding: 7px 12px; border-top: 1px solid #e5e7eb; }
      .cadc-light-content .cadc-fare-row span { color: #374151; font-size: 12px; }
      .cadc-light-content .cadc-content { display: flex; flex-direction: column; }
    `}</style>
  );
}
