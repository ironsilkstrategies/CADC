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

// ─── Design tokens ────────────────────────────────────────────────────────────

const T = {
  blue:        "#0101FF",
  blueDark:    "#0000B8",
  blueLight:   "#E4E4FF",
  maroon:      "#7E0001",
  maroonDark:  "#5C0001",
  void:        "#000014",
  ghost:       "#F8F8FF",
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
// headline = short label shown on calendar cell
// full = complete meal list shown in popup

const MENU_DATA = {
  month: "August",
  year: 2026,
  note: "8 oz milk served daily at all congregate sites",
  meals: {
    "2026-08-03": { headline: "Pork Chop", full: ["Pork Chop", "Potato Casserole", "Baked Beans", "Sliced Bread", "Mandarin Oranges"] },
    "2026-08-04": { headline: "Chicken Teriyaki", full: ["Chicken Teriyaki", "Broccoli", "Carrots", "Rice Pilaf", "Pineapple", "Upside-Down Cake"] },
    "2026-08-05": { headline: "Pimento Cheese", full: ["Pimento Cheese", "Vegetable Soup", "Crackers", "Cake w/ Frosting"] },
    "2026-08-06": { headline: "Sliced Turkey", full: ["Sliced Turkey on Bun", "Tomato Soup", "Diced Peaches", "Peanut Butter Bar"] },
    "2026-08-07": { headline: "Salisbury Steak", full: ["Salisbury Steak", "Mashed Potatoes w/ Gravy", "Green Beans", "Dinner Roll", "Butterscotch Fluff"] },
    "2026-08-10": { headline: "Chicken Parmesan", full: ["Chicken Parmesan", "Carrots", "Broccoli", "Garlic Bread", "Chocolate Pan Pie"] },
    "2026-08-11": { headline: "Tuna Salad", full: ["Tuna Salad", "Pickled Beets", "Macaroni Salad", "Diced Peaches", "Cookie Bar"] },
    "2026-08-12": { headline: "Sausage Gravy", full: ["Sausage Gravy over Biscuits", "Hash Browns", "Tomatoes", "Fruit Salad"] },
    "2026-08-13": { headline: "Fish Sandwich", full: ["Fish Sandwich on Bun", "Potato Wedges", "Pea Salad", "Poke Cake"] },
    "2026-08-14": { headline: "Meatloaf", full: ["Meatloaf", "Mashed Potatoes w/ Gravy", "Green Beans", "Pear Crisp", "Dinner Roll"] },
    "2026-08-17": { headline: "Pulled Pork", full: ["Pulled Pork", "Baked Potato", "Mixed Vegetables", "Sliced Bread", "Cookies"] },
    "2026-08-18": { headline: "Chicken Salad", full: ["Chicken Salad", "Cottage Cheese", "Pickled Beets", "Fruit Salad", "Simply Super Cake"] },
    "2026-08-19": { headline: "Chicken & Dumplings", full: ["Chicken & Dumplings", "Carrots", "Peas", "Applesauce"] },
    "2026-08-20": { headline: "Brown Beans", full: ["Brown Beans w/ Ham", "Zucchini/Tomatoes", "Spinach", "Cornbread", "Chocolate Pie"] },
    "2026-08-21": { headline: "Chili Cheeseburger", full: ["Chili Cheeseburger on Bun", "Baked Beans", "Potato Salad", "Pudding"] },
    "2026-08-24": { headline: "Chicken Tenders", full: ["Chicken Tenders", "Mashed Potatoes w/ Gravy", "Corn", "Bread", "Pears"] },
    "2026-08-25": { headline: "Roasted Ham", full: ["Roasted Ham", "Sweet Potatoes", "Brussels Sprouts", "Fruit Crisp"] },
    "2026-08-26": { headline: "Meatball Sub", full: ["Meatball Sub on Hoagie", "Broccoli Salad", "Fruit", "Cookie Bar"] },
    "2026-08-27": { headline: "BBQ Chicken", full: ["BBQ Chicken", "Potato Casserole", "Green Beans", "Roll", "Cake"] },
    "2026-08-28": { headline: "Sweet & Sour Pork", full: ["Sweet & Sour Pork on Rice", "Cali Mix", "Pineapple Tidbits", "Jell-O"] },
    "2026-08-31": { headline: "Mexican Casserole", full: ["Mexican Casserole", "Tex Mex Rice", "Ranch Beans", "Chips", "Brownie"] },
  } as Record<string, { headline: string; full: string[] }>,
};

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
        <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: isDesktop ? "rgba(126,0,1,0.9)" : "#7E0001", margin: "0 0 6px" }}>About our menus</p>
        <p style={{ fontSize: 12, color: isDesktop ? "rgba(255,255,255,0.7)" : "#374151", margin: 0, lineHeight: 1.6 }}>Menus are planned by a registered dietitian and reviewed quarterly by Laura Vardell and our site managers. Each menu cycle covers three months.</p>
      </div>
      <div style={{ marginTop: 10, padding: "10px 14px", background: isDesktop ? "rgba(1,1,255,0.1)" : "#f0f0ff", borderRadius: 10 }}>
        <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: isDesktop ? "rgba(126,0,1,0.9)" : "#7E0001", margin: "0 0 6px" }}>Questions about the menu?</p>
        <a href="tel:+15803355588" style={{ color: "#0101FF", fontWeight: 700, fontSize: 13, textDecoration: "none" }}>580-335-5588</a>
      </div>
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
            <div className="cadc-card">
              <p className="cadc-label">Program eligibility</p>
              <p>Available to individuals age 60 and older. Spouses and caregivers may also be eligible — contact us for details.</p>
            </div>
            <div className="cadc-grid-2">
              {["6 congregate sites","Home delivery available","Nutritious daily meals","Social activities","Community connection","Compassionate staff"].map(i=><div key={i} className="cadc-chip">{i}</div>)}
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
                {name:"Frederick",addr:"100 E Grand, Frederick, OK 73542",phone:"580-335-7026",href:"tel:+15803357026"},
                {name:"Ringling",addr:"200 D St., Ringling, OK 73456",phone:"580-662-2362",href:"tel:+15806622362"},
                {name:"Cache",addr:"416 West C Ave., Cache, OK 73527",phone:"580-429-3427",href:"tel:+15804293427"},
                {name:"Temple",addr:"201 S Commercial, Temple, OK 73568",phone:"580-342-6944",href:"tel:+15803426944"},
                {name:"Walters",addr:"500 E California, Walters, OK 73572",phone:"580-875-9044",href:"tel:+15808759044"},
                {name:"Ryan",addr:"400 Taylor St. Apt #8, Ryan, OK 73565",phone:"580-757-2412",href:"tel:+15807572412"},
              ].map(s=>(
                <div key={s.name} className="cadc-card-sm">
                  <p className="cadc-card-title">{s.name}</p>
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
    tagline: "Building food access across Southwest Oklahoma",
    subAreas: [
      {
        id: "market-about", label: "About the Market", shortLabel: "About", icon: "ℹ️",
        content: (
          <div className="cadc-content">
            <p>CADC's Community Market is an emerging program expanding food access across the region. We're building this program based directly on what our communities tell us they need.</p>
            <div className="cadc-card">
              <p className="cadc-label">Focus areas</p>
              <div className="cadc-grid-2">
                {["Fresh produce access","Food pantry networks","Nutrition education","Community garden support"].map(i=><div key={i} className="cadc-chip">{i}</div>)}
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "market-survey", label: "Community Survey", shortLabel: "Survey", icon: "📊",
        content: (
          <div className="cadc-content">
            <p>This program is built around your input. Take the Community Needs Survey and tell us what your community is missing.</p>
            <a href="https://www.surveymonkey.com/r/26cadcneeds" target="_blank" rel="noopener noreferrer" className="cadc-btn">Take the Survey →</a>
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

// ─── Main Orbit component ─────────────────────────────────────────────────────

type Stage = "main" | "program" | "content";
type TransitionState = "idle" | "out" | "in";

export default function CADCOrbitSite() {
  const [stage, setStage] = useState<Stage>("main");
  const [activeProgram, setActiveProgram] = useState<ProgramData | null>(null);
  const [activeSubArea, setActiveSubArea] = useState<SubArea | null>(null);
  const [glowNode, setGlowNode] = useState<string | null>(null);
  const [popNode, setPopNode] = useState<string | null>(null);
  const [beamNode, setBeamNode] = useState<string | null>(null);
  const [orbitTx, setOrbitTx] = useState<TransitionState>("idle");
  const [assembled, setAssembled] = useState(false);
  const isDesktop = useIsDesktop();

  useEffect(() => {
    const t = setTimeout(() => setAssembled(true), 300);
    return () => clearTimeout(t);
  }, []);

  function tapProgram(prog: ProgramData) {
    // 1. Pop + beam
    setPopNode(prog.slug);
    setBeamNode(prog.slug);
    setGlowNode(prog.slug);
    // 2. Start orbit exit
    setTimeout(() => {
      setOrbitTx("out");
    }, 120);
    // 3. Swap data mid-transition
    setTimeout(() => {
      setActiveProgram(prog);
      setActiveSubArea(null);
      setStage("program");
      setOrbitTx("in");
      setGlowNode(null);
      setBeamNode(null);
    }, 480);
    // 4. Settle
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
        setStage("main");
      }
      setOrbitTx("in");
    }, 300);
    setTimeout(() => setOrbitTx("idle"), 700);
  }

  if (isDesktop) {
    return <DesktopLayout
      stage={stage} activeProgram={activeProgram} activeSubArea={activeSubArea}
      glowNode={glowNode} popNode={popNode} beamNode={beamNode} orbitTx={orbitTx}
      assembled={assembled}
      tapProgram={tapProgram} tapSubArea={tapSubArea} goBack={goBack}
    />;
  }

  return <MobileLayout
    stage={stage} activeProgram={activeProgram} activeSubArea={activeSubArea}
    glowNode={glowNode} popNode={popNode} beamNode={beamNode} orbitTx={orbitTx}
    assembled={assembled}
    tapProgram={tapProgram} tapSubArea={tapSubArea} goBack={goBack}
  />;
}

// ─── Shared props ─────────────────────────────────────────────────────────────

interface LayoutProps {
  stage: Stage;
  activeProgram: ProgramData | null;
  activeSubArea: SubArea | null;
  glowNode: string | null;
  popNode: string | null;
  beamNode: string | null;
  orbitTx: TransitionState;
  assembled: boolean;
  tapProgram: (p: ProgramData) => void;
  tapSubArea: (a: SubArea) => void;
  goBack: () => void;
}

// ─── DESKTOP LAYOUT ───────────────────────────────────────────────────────────

function DesktopLayout({ stage, activeProgram, activeSubArea, glowNode, popNode, beamNode, orbitTx, assembled, tapProgram, tapSubArea, goBack }: LayoutProps) {
  return (
    <div style={{ background: T.void, minHeight: "100vh", fontFamily: "'Space Grotesk', 'Inter', sans-serif", position: "relative", overflow: "hidden" }}>
      <ParticleField />

      {/* Utility nav */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 48px", borderBottom: "1px solid rgba(1,1,255,0.15)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: T.blue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🏛️</div>
          <div>
            <div style={{ color: "white", fontWeight: 700, fontSize: 14, letterSpacing: "0.05em" }}>CADC</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase" }}>Community Action</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 32 }}>
          {["About", "Contact", "580-335-5588"].map((item, i) => (
            <a key={item} href={i === 2 ? "tel:+15803355588" : `/${item.toLowerCase()}`}
              style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: 600, textDecoration: "none", letterSpacing: "0.05em", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "white")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
            >{item}</a>
          ))}
        </div>
      </nav>

      {/* Main split layout */}
      <div style={{ display: "flex", height: "100vh", paddingTop: 64 }}>

        {/* LEFT — Orbit panel */}
        <div style={{ width: "42%", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>

          {/* Back button */}
          {stage !== "main" && (
            <button onClick={goBack} style={{
              position: "absolute", top: 24, left: 48, zIndex: 10,
              background: "rgba(1,1,255,0.15)", border: "1px solid rgba(1,1,255,0.3)",
              color: "rgba(255,255,255,0.8)", padding: "8px 18px", borderRadius: 8,
              fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", cursor: "pointer",
              textTransform: "uppercase", transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(1,1,255,0.3)"; e.currentTarget.style.color = "white"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(1,1,255,0.15)"; e.currentTarget.style.color = "rgba(255,255,255,0.8)"; }}
            >← Back</button>
          )}

          <DesktopOrbit
            stage={stage} activeProgram={activeProgram}
            glowNode={glowNode} popNode={popNode} beamNode={beamNode} orbitTx={orbitTx}
            assembled={assembled}
            tapProgram={tapProgram} tapSubArea={tapSubArea}
          />
        </div>

        {/* RIGHT — Content panel */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px", borderLeft: "1px solid rgba(1,1,255,0.1)" }}>
          <DesktopContentPanel stage={stage} activeProgram={activeProgram} activeSubArea={activeSubArea} />
        </div>
      </div>

      <DesktopStyles />
    </div>
  );
}

function DesktopOrbit({ stage, activeProgram, glowNode, popNode, beamNode, orbitTx, assembled, tapProgram, tapSubArea }: {
  stage: Stage; activeProgram: ProgramData | null; glowNode: string | null;
  popNode: string | null; beamNode: string | null; orbitTx: TransitionState;
  assembled: boolean; tapProgram: (p: ProgramData) => void; tapSubArea: (a: SubArea) => void;
}) {
  const programs = PROGRAMS;
  const subAreas = activeProgram?.subAreas ?? [];
  const items = stage === "main" ? programs : subAreas;
  const RADIUS = 38;
  const SIZE = "min(80vw,420px)";

  return (
    <div style={{ width: SIZE, aspectRatio: "1/1", position: "relative" }}>
      {/* Outer glow ring */}
      <div style={{
        position: "absolute", inset: "8%", borderRadius: "50%",
        border: "1px solid rgba(1,1,255,0.2)",
        boxShadow: "0 0 60px rgba(1,1,255,0.08), inset 0 0 60px rgba(1,1,255,0.04)",
      }} />

      {/* SVG connectors */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }} viewBox="0 0 100 100" aria-hidden="true">
        {items.map((item, i) => {
          const { x, y } = orbitPos(i, items.length, RADIUS);
          const isActive = stage === "main"
            ? (item as ProgramData).slug === glowNode
            : (item as SubArea).id === glowNode;
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
        borderRadius: "50%", background: T.void,
        border: `2px solid ${T.blue}`,
        boxShadow: orbitTx === "out"
          ? `0 0 0 16px rgba(1,1,255,0.12), 0 0 60px rgba(1,1,255,0.5)`
          : `0 0 0 8px rgba(1,1,255,0.06), 0 0 40px rgba(1,1,255,0.3)`,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: 2,
        transition: "box-shadow 0.3s ease",
        animation: orbitTx === "out" ? "hubPulse 0.4s ease-out" : "none",
      }}>
        <span style={{
          fontSize: "clamp(1rem,2.5vw,1.4rem)",
          animation: orbitTx !== "idle" ? "hubSpin 0.45s ease-in-out" : "none",
        }}>
          {stage === "main" ? "🏛️" : activeProgram?.icon}
        </span>
        <span style={{
          color: T.blue,
          fontSize: stage === "main" ? "clamp(0.35rem,0.8vw,0.5rem)" : "clamp(0.32rem,0.7vw,0.42rem)",
          fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase",
          textAlign: "center", padding: "0 4px", lineHeight: 1.2,
          transition: "opacity 0.2s ease",
          opacity: orbitTx === "out" ? 0 : 1,
        }}>
          {stage === "main" ? "CADC" : activeProgram?.shortName}
        </span>
      </div>

      {/* Nodes */}
      {items.map((item, i) => {
        const { x, y } = orbitPos(i, items.length, RADIUS);
        const prog = item as ProgramData;
        const sub = item as SubArea;
        const id = stage === "main" ? prog.slug : sub.id;
        const label = stage === "main" ? prog.shortName : sub.shortLabel;
        const icon = stage === "main" ? prog.icon : sub.icon;
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
            onClick={() => stage === "main" ? tapProgram(prog) : tapSubArea(sub)}
            aria-label={stage === "main" ? prog.name : sub.label}
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
              background: isPopped
                ? `radial-gradient(circle at 35% 35%, rgba(1,1,255,0.4), ${T.void})`
                : T.void,
              border: `${isPopped ? 3 : 2}px solid ${isPopped ? "rgba(1,1,255,1)" : T.blue}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "clamp(0.9rem,2vw,1.2rem)",
              boxShadow: isPopped
                ? `0 0 32px rgba(1,1,255,0.7), 0 0 8px rgba(1,1,255,0.9), inset 0 0 16px rgba(1,1,255,0.2)`
                : `0 0 16px rgba(1,1,255,0.25), inset 0 0 12px rgba(1,1,255,0.08)`,
              transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease, border-width 0.15s ease",
            }}>
              {icon}
            </div>
            <span style={{
              color: isPopped ? "white" : "rgba(255,255,255,0.75)",
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

function DesktopContentPanel({ stage, activeProgram, activeSubArea }: { stage: Stage; activeProgram: ProgramData | null; activeSubArea: SubArea | null }) {
  if (stage === "main") {
    return (
      <div style={{ maxWidth: 520, color: "white" }}>
        <p style={{ color: T.blue, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>Helping People. Changing Lives.</p>
        <h1 style={{ fontSize: "clamp(2rem,3.5vw,3.2rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: 20, fontFamily: "'Space Grotesk', sans-serif" }}>
          Community Action<br />
          <span style={{ color: T.blue }}>Development</span><br />
          Corporation
        </h1>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 16, lineHeight: 1.7, marginBottom: 32 }}>
          A Community Action Development Corporation serving 9 counties across Southwest Oklahoma — early childhood education, transportation, weatherization, nutrition programs, and more. Select any program from the orbit to explore.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a href="tel:+15803355588" style={{ background: T.blue, color: "white", padding: "12px 24px", borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: "none", letterSpacing: "0.05em" }}>
            📞 580-335-5588
          </a>
          <a href="/about" style={{ border: `1px solid rgba(1,1,255,0.4)`, color: "rgba(255,255,255,0.75)", padding: "12px 24px", borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
            About CADC
          </a>
        </div>
      </div>
    );
  }

  if (stage === "program" && activeProgram) {
    return (
      <div style={{ maxWidth: 520, color: "white", animation: "fadeSlideIn 0.4s ease" }}>
        <p style={{ color: T.blue, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>{activeProgram.tagline}</p>
        <h2 style={{ fontSize: "clamp(1.6rem,2.8vw,2.4rem)", fontWeight: 800, lineHeight: 1.15, marginBottom: 20, fontFamily: "'Space Grotesk', sans-serif" }}>
          {activeProgram.icon} {activeProgram.name}
        </h2>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
          Select an area from the orbit to explore this program in detail.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {activeProgram.subAreas.map(a => (
            <div key={a.id} style={{ background: "rgba(1,1,255,0.12)", border: "1px solid rgba(1,1,255,0.25)", borderRadius: 6, padding: "6px 12px", fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>
              {a.icon} {a.shortLabel}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (stage === "content" && activeSubArea) {
    return (
      <div style={{ maxWidth: 540, color: "white", maxHeight: "calc(100vh - 160px)", overflowY: "auto", animation: "clipReveal 0.45s cubic-bezier(0.22,1,0.36,1) forwards" }}>
        <h3 style={{ fontSize: "clamp(1.2rem,2vw,1.8rem)", fontWeight: 800, lineHeight: 1.2, marginBottom: 20, fontFamily: "'Space Grotesk', sans-serif", color: "white" }}>
          {activeSubArea.icon} {activeSubArea.label}
        </h3>
        <div className="cadc-dark-content">
          {activeSubArea.content}
        </div>
      </div>
    );
  }

  return null;
}

// ─── MOBILE LAYOUT ────────────────────────────────────────────────────────────

function MobileLayout({ stage, activeProgram, activeSubArea, glowNode, popNode, beamNode, orbitTx, assembled, tapProgram, tapSubArea, goBack }: LayoutProps) {
  return (
    <div style={{ background: T.ghost, minHeight: "100svh", fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>

      {/* Mobile header */}
      <div style={{ position: "sticky", top: 0, zIndex: 40, background: "white", borderBottom: `1px solid ${T.border}`, padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {stage !== "main" && (
            <button onClick={goBack} style={{ background: "none", border: "none", cursor: "pointer", color: T.blue, fontSize: 18, marginRight: 4, padding: 0 }} aria-label="Back">←</button>
          )}
          <span style={{ fontWeight: 800, fontSize: 15, color: T.blue, letterSpacing: "0.05em" }}>CADC</span>
          {stage === "program" && activeProgram && (
            <span style={{ color: T.textMuted, fontSize: 12 }}>/ {activeProgram.shortName}</span>
          )}
          {stage === "content" && activeSubArea && (
            <span style={{ color: T.textMuted, fontSize: 12 }}>/ {activeSubArea.shortLabel}</span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <a href="/about" style={{ color: T.blue, fontSize: 12, fontWeight: 700, textDecoration: "none" }}>About</a>
          <a href="/contact" style={{ color: T.blue, fontSize: 12, fontWeight: 700, textDecoration: "none" }}>Contact</a>
          <a href="tel:+15803355588" style={{ background: T.maroon, color: "white", padding: "6px 14px", borderRadius: 6, fontSize: 11, fontWeight: 700, textDecoration: "none" }}>📞 Call</a>
        </div>
      </div>

      {/* Orbit */}
      <div style={{ padding: "20px 0 0" }}>
        <MobileOrbit
          stage={stage} activeProgram={activeProgram}
          glowNode={glowNode} popNode={popNode} beamNode={beamNode} orbitTx={orbitTx}
          assembled={assembled}
          tapProgram={tapProgram} tapSubArea={tapSubArea}
        />
      </div>

      {/* Content below orbit */}
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

      {stage === "main" && (
        <div style={{ padding: "16px 20px 80px" }}>
          <div style={{ background: T.blue, borderRadius: 16, padding: 24 }}>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8, margin: 0 }}>Southwest Oklahoma</p>
            <h1 style={{ color: "white", fontWeight: 800, fontSize: 22, lineHeight: 1.2, margin: "8px 0 12px", fontFamily: "'Space Grotesk', sans-serif" }}>
              Community Action Development Corporation
            </h1>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, lineHeight: 1.6, margin: "0 0 16px" }}>
              Serving 9 counties — early childhood education, transportation, weatherization, nutrition programs, and more.
            </p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, margin: 0 }}>Tap any program node above to explore</p>
          </div>
        </div>
      )}

      {stage === "program" && activeProgram && !activeSubArea && (
        <div style={{ padding: "16px 20px 80px" }}>
          <div style={{ background: "white", borderRadius: 16, border: `1px solid ${T.border}`, padding: 20 }}>
            <p style={{ color: T.textMuted, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 8px" }}>{activeProgram.tagline}</p>
            <h2 style={{ color: T.blue, fontWeight: 800, fontSize: 20, margin: "0 0 8px", fontFamily: "'Space Grotesk', sans-serif" }}>{activeProgram.icon} {activeProgram.name}</h2>
            <p style={{ color: T.textMuted, fontSize: 13, lineHeight: 1.6, margin: 0 }}>Tap any node in the orbit above to explore this program.</p>
          </div>
        </div>
      )}

      <MobileStyles />
    </div>
  );
}

function MobileOrbit({ stage, activeProgram, glowNode, popNode, beamNode, orbitTx, assembled, tapProgram, tapSubArea }: {
  stage: Stage; activeProgram: ProgramData | null; glowNode: string | null;
  popNode: string | null; beamNode: string | null; orbitTx: TransitionState;
  assembled: boolean; tapProgram: (p: ProgramData) => void; tapSubArea: (a: SubArea) => void;
}) {
  const programs = PROGRAMS;
  const subAreas = activeProgram?.subAreas ?? [];
  const items = stage === "main" ? programs : subAreas;
  const RADIUS = stage === "main" ? 38 : 36;

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
        <span style={{ fontSize: "clamp(1rem,5vw,1.4rem)" }}>{stage === "main" ? "🏛️" : activeProgram?.icon}</span>
        <span style={{ color: T.blue, fontSize: "clamp(0.35rem,1.8vw,0.5rem)", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", textAlign: "center", lineHeight: 1.2, padding: "0 4px" }}>
          {stage === "main" ? "CADC" : activeProgram?.shortName}
        </span>
      </div>

      {/* Nodes */}
      {items.map((item, i) => {
        const { x, y } = orbitPos(i, items.length, RADIUS);
        const prog = item as ProgramData;
        const sub = item as SubArea;
        const id = stage === "main" ? prog.slug : sub.id;
        const label = stage === "main" ? prog.shortName : sub.shortLabel;
        const icon = stage === "main" ? prog.icon : sub.icon;
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
            onClick={() => stage === "main" ? tapProgram(prog) : tapSubArea(sub)}
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

      @keyframes desktopPing {
        0% { transform: scale(1); opacity: 0.9; }
        60% { opacity: 0.4; }
        100% { transform: scale(3.2); opacity: 0; }
      }
      @keyframes beamPulse {
        0% { transform: scale(1); opacity: 1; border-color: rgba(1,1,255,1); }
        50% { transform: scale(1.8); opacity: 0.6; }
        100% { transform: scale(0.2); opacity: 0; border-color: rgba(1,1,255,0.2); }
      }
      @keyframes hubPulse {
        0%  { transform: translate(-50%,-50%) scale(1); }
        40% { transform: translate(-50%,-50%) scale(1.18); }
        100%{ transform: translate(-50%,-50%) scale(1); }
      }
      @keyframes hubSpin {
        0%  { transform: scale(1) rotate(0deg); opacity: 1; }
        40% { transform: scale(0.6) rotate(90deg); opacity: 0; }
        60% { transform: scale(0.6) rotate(-90deg); opacity: 0; }
        100%{ transform: scale(1) rotate(0deg); opacity: 1; }
      }
      @keyframes clipReveal {
        from { clip-path: inset(0 100% 0 0); opacity: 0.6; transform: translateX(12px); }
        to   { clip-path: inset(0 0% 0 0); opacity: 1; transform: translateX(0); }
      }
      @keyframes fadeSlideIn {
        from { opacity: 0; transform: translateX(24px); }
        to   { opacity: 1; transform: translateX(0); }
      }

      .cadc-dark-content p { color: rgba(255,255,255,0.7); font-size: 14px; line-height: 1.7; margin: 0 0 14px; }
      .cadc-dark-content strong { color: white; }
      .cadc-dark-content .cadc-card { background: rgba(1,1,255,0.12); border: 1px solid rgba(1,1,255,0.25); border-radius: 12px; padding: 16px; margin: 14px 0; }
      .cadc-dark-content .cadc-card-sm { background: rgba(1,1,255,0.1); border: 1px solid rgba(1,1,255,0.2); border-radius: 10px; padding: 14px; margin: 8px 0; }
      .cadc-dark-content .cadc-card-title { color: rgba(1,1,255,0.9); font-weight: 700; font-size: 12px; margin: 0 0 6px; text-transform: uppercase; letter-spacing: 0.06em; }
      .cadc-dark-content .cadc-label { color: rgba(126,0,1,0.9); font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 8px; }
      .cadc-dark-content .cadc-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; }
      .cadc-dark-content .cadc-list li { color: rgba(255,255,255,0.65); font-size: 13px; padding-left: 14px; position: relative; }
      .cadc-dark-content .cadc-list li::before { content: "·"; position: absolute; left: 0; color: ${T.blue}; font-weight: 700; }
      .cadc-dark-content .cadc-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 12px 0; }
      .cadc-dark-content .cadc-chip { background: rgba(1,1,255,0.15); border: 1px solid rgba(1,1,255,0.25); border-radius: 6px; padding: 6px 10px; font-size: 12px; color: rgba(255,255,255,0.7); font-weight: 600; }
      .cadc-dark-content .cadc-stack { display: flex; flex-direction: column; gap: 8px; }
      .cadc-dark-content .cadc-btn { display: inline-flex; align-items: center; justify-content: center; background: ${T.maroon}; color: white; padding: 12px 20px; border-radius: 8px; font-size: 13px; font-weight: 700; text-decoration: none; margin-top: 8px; }
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

      @keyframes mobilePing {
        0% { transform: scale(1); opacity: 0.9; }
        60% { opacity: 0.4; }
        100% { transform: scale(2.8); opacity: 0; }
      }
      @keyframes fadeSlideUp {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes mobileContentIn {
        from { opacity: 0; transform: translateY(28px) scale(0.97); }
        to   { opacity: 1; transform: translateY(0) scale(1); }
      }

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
