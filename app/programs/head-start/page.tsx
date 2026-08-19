"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { external, headStartDisclaimer, contact } from "@/lib/org";
import { headStartCenters } from "@/lib/locations";
import { headStartStaff } from "@/lib/staff";

// ─── Head Start sub-orbit data ────────────────────────────────────────────────

interface HSArea {
  id: string;
  label: string;
  shortLabel: string;
  icon: string;
  content: React.ReactNode;
}

const HS_AREAS: HSArea[] = [
  {
    id: "ehs",
    label: "Early Head Start",
    shortLabel: "EHS",
    icon: "🤱",
    content: (
      <div className="flex flex-col gap-4">
        <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
          Early Head Start serves pregnant women, expectant families, and children from birth to age 3.
          Our program provides home visits, center-based care, and family support starting before birth —
          focused on the most critical window of brain development.
        </p>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--cadc-maroon)" }}>
            Provided at no cost while children are in our care
          </p>
          <ul className="grid grid-cols-1 gap-2">
            {["Formula for infants", "Diapers", "Wipes", "Nutritious meals and snacks", "Developmental support and screenings"].map(item => (
              <li key={item} className="flex items-center gap-2 text-sm" style={{ color: "#374151" }}>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--cadc-blue)" }} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: "hs",
    label: "Head Start",
    shortLabel: "Head Start",
    icon: "🏫",
    content: (
      <div className="flex flex-col gap-4">
        <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
          Head Start serves children ages 3–5 with full-day, full-year preschool at no cost to
          income-eligible families. Every child receives comprehensive services including education,
          health, nutrition, and family support.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {["Full-day preschool at no cost", "Health & dental screenings", "Nutritious meals daily", "Family engagement", "School readiness curriculum", "Individualized learning goals"].map(item => (
            <div key={item} className="flex items-center gap-2 text-sm" style={{ color: "#374151" }}>
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--cadc-blue)" }} />
              {item}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "applications",
    label: "Applications",
    shortLabel: "Apply",
    icon: "📝",
    content: (
      <div className="flex flex-col gap-4">
        <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
          Enrollment is open year-round and applications are reviewed on a rolling basis.
          Spaces fill quickly — apply as early as possible.
        </p>
        <div className="rounded-xl p-4" style={{ background: "var(--cadc-blue-light)" }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--cadc-maroon)" }}>What you'll need</p>
          <ul className="flex flex-col gap-1">
            {["Proof of income (pay stubs, tax return, or benefits letter)", "Child's birth certificate", "Immunization records", "Proof of address"].map(item => (
              <li key={item} className="text-xs" style={{ color: "#374151" }}>· {item}</li>
            ))}
          </ul>
        </div>
        <a
          href={external.childPlusApply}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
          style={{ background: "var(--cadc-maroon)" }}
        >
          Start Application (ChildPlus) →
        </a>
      </div>
    ),
  },
  {
    id: "ersea",
    label: "ERSEA",
    shortLabel: "ERSEA",
    icon: "📋",
    content: (
      <div className="flex flex-col gap-4">
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "var(--cadc-maroon)" }}>
          Eligibility · Recruitment · Selection · Enrollment · Attendance
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
          ERSEA is the process that ensures Head Start serves the children and families who need it most.
          Our ERSEA coordinator manages eligibility verification, community outreach, enrollment selection,
          and ongoing attendance monitoring across all 11 centers.
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
          Up to 10% of enrollment is reserved for children with disabilities, regardless of income.
          Children in foster care or experiencing homelessness qualify automatically.
        </p>
      </div>
    ),
  },
  {
    id: "education",
    label: "Education",
    shortLabel: "Education",
    icon: "📚",
    content: (
      <div className="flex flex-col gap-4">
        <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
          Our education program uses <strong>Frog Street</strong>, a credential-based curriculum
          designed specifically for early childhood. Every classroom follows structured lesson plans
          aligned to each child's individual developmental goals.
        </p>
        <div className="grid grid-cols-1 gap-3">
          {[
            { title: "Developmental Screenings", detail: "Every child is screened within the first 45 days on developmental stages — identifying strengths and areas for support early." },
            { title: "Individualized Goals", detail: "Lesson plans and learning goals are set for each child based on where they are developmentally, not a one-size-fits-all approach." },
            { title: "Frog Street Curriculum", detail: "A nationally recognized, credential-based curriculum focused on language, literacy, math, and social-emotional development." },
            { title: "Classroom Facebook Pages", detail: "Each classroom has a private Facebook page where parents and guardians can see photos, events, and updates throughout the year." },
          ].map(item => (
            <div key={item.title} className="rounded-xl p-4" style={{ background: "var(--cadc-blue-light)" }}>
              <p className="text-xs font-bold mb-1" style={{ color: "var(--cadc-blue)" }}>{item.title}</p>
              <p className="text-xs leading-relaxed" style={{ color: "#374151" }}>{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "health",
    label: "Health / Mental Health / Disabilities",
    shortLabel: "Health",
    icon: "🏥",
    content: (
      <div className="flex flex-col gap-4">
        <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
          Every child enrolled in Head Start receives comprehensive health services. Our Health,
          Mental Health, and Disabilities Coordinator ensures every child's needs are documented,
          monitored, and met throughout the program year.
        </p>
        <div className="flex flex-col gap-3">
          {[
            { title: "Medical Protocols", detail: "Children with conditions such as asthma must have an inhaler on-site at the center. All medical needs are documented and staff are trained accordingly." },
            { title: "Allergy Management", detail: "Food allergies require a doctor's note specifying the allergy and what can be substituted. Centers maintain allergy records for every child." },
            { title: "Vision, Dental & Hearing", detail: "Screenings are completed within program timelines. Referrals are made when follow-up care is needed." },
            { title: "Mental Health", detail: "Mental health support is integrated into the classroom and available to families. We partner with mental health professionals to serve children and parents." },
            { title: "Disabilities Services", detail: "Up to 10% of enrollment is reserved for children with disabilities. We coordinate with school districts and specialists to provide appropriate services." },
          ].map(item => (
            <div key={item.title} className="rounded-xl p-4 border" style={{ borderColor: "#e5e7eb" }}>
              <p className="text-xs font-bold mb-1" style={{ color: "var(--cadc-maroon)" }}>{item.title}</p>
              <p className="text-xs leading-relaxed" style={{ color: "#374151" }}>{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "nutrition",
    label: "Nutrition",
    shortLabel: "Nutrition",
    icon: "🥗",
    content: (
      <div className="flex flex-col gap-4">
        <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
          All meals served in our Head Start and Early Head Start programs meet the requirements of the
          <strong> Child and Adult Care Food Program (CACFP)</strong> — a federal nutrition standard
          that ensures children receive balanced, age-appropriate meals every day.
        </p>
        <div className="grid grid-cols-1 gap-2">
          {[
            "Breakfast, lunch, and snacks served daily at no cost",
            "Menus planned by nutrition staff to meet CACFP standards",
            "Age-appropriate portions and food groups",
            "Formula, diapers, and wipes provided for Early Head Start infants",
            "Allergy accommodations with doctor's documentation",
            "Family nutrition education and resources",
          ].map(item => (
            <div key={item} className="flex items-start gap-2 text-sm" style={{ color: "#374151" }}>
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: "var(--cadc-blue)" }} />
              {item}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "family",
    label: "Family Service Workers",
    shortLabel: "Family",
    icon: "🤝",
    content: (
      <div className="flex flex-col gap-4">
        <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
          Every Head Start family is assigned a Family Service Worker — a dedicated point of contact
          who builds relationships, identifies needs, and connects families to resources inside and
          outside the program.
        </p>
        <div className="flex flex-col gap-3">
          {[
            { title: "Family Goal Setting", detail: "Workers help families set and work toward goals — housing stability, employment, education, and more." },
            { title: "Community Connections", detail: "Referrals to community resources, benefits programs, and support services as needs arise." },
            { title: "Parent Engagement", detail: "Families are encouraged to volunteer, serve on the Policy Council, and participate in classroom activities." },
            { title: "Home Visits", detail: "Regular home visits for Early Head Start families and as needed for Head Start families." },
          ].map(item => (
            <div key={item.title} className="rounded-xl p-4" style={{ background: "var(--cadc-blue-light)" }}>
              <p className="text-xs font-bold mb-1" style={{ color: "var(--cadc-blue)" }}>{item.title}</p>
              <p className="text-xs leading-relaxed" style={{ color: "#374151" }}>{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "inkind",
    label: "Safety & Training",
    shortLabel: "Safety",
    icon: "🛡️",
    content: (
      <div className="flex flex-col gap-4">
        <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
          Safety is embedded in every aspect of our program. Staff complete ongoing training
          requirements and our centers maintain strict safety standards year-round.
        </p>
        <div className="flex flex-col gap-3">
          {[
            { title: "Staff Training", detail: "All staff complete required training in child safety, emergency procedures, mandated reporting, and program-specific protocols." },
            { title: "In-Kind Contributions", detail: "Community members can support Head Start children directly by volunteering time or donating goods. In-kind contributions help meet our non-federal share requirements — contact your nearest center to learn how." },
            { title: "Emergency Procedures", detail: "Centers maintain current emergency plans and conduct regular drills with children and staff." },
            { title: "Safe Environments", detail: "All centers undergo regular safety inspections. Vehicles are maintained and driver safety protocols are strictly enforced." },
          ].map(item => (
            <div key={item.title} className="rounded-xl p-4 border" style={{ borderColor: "#e5e7eb" }}>
              <p className="text-xs font-bold mb-1" style={{ color: "var(--cadc-maroon)" }}>{item.title}</p>
              <p className="text-xs leading-relaxed" style={{ color: "#374151" }}>{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

// ─── Sub-orbit geometry ───────────────────────────────────────────────────────

const RADIUS_PCT = 38;
const START_DEG = -90;

function nodePos(i: number, total: number) {
  const angle = START_DEG + (i / total) * 360;
  const rad = (angle * Math.PI) / 180;
  return { x: 50 + RADIUS_PCT * Math.cos(rad), y: 50 + RADIUS_PCT * Math.sin(rad) };
}

// ─── Sub-orbit component ──────────────────────────────────────────────────────

function HeadStartOrbit() {
  const [active, setActive] = useState<string | null>(null);
  const [glow, setGlow] = useState<string | null>(null);

  function tap(id: string) {
    setGlow(id);
    setTimeout(() => setGlow(null), 600);
    setActive(prev => prev === id ? null : id);
  }

  const activeArea = HS_AREAS.find(a => a.id === active);

  return (
    <div className="flex flex-col gap-6">
      {/* Orbit diagram */}
      <div className="relative mx-auto" style={{ width: "min(88vw, 480px)", aspectRatio: "1/1" }}>
        {/* Ring */}
        <div className="absolute rounded-full border-dashed"
          style={{ inset: "11%", border: "1.5px dashed rgba(1,1,255,0.16)" }} />

        {/* Connectors */}
        <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {HS_AREAS.map((area, i) => {
            const { x, y } = nodePos(i, HS_AREAS.length);
            return (
              <line key={area.id} x1={50} y1={50} x2={x} y2={y}
                stroke={active === area.id ? "var(--cadc-maroon)" : "rgba(126,0,1,0.2)"}
                strokeWidth={active === area.id ? 1.8 : 0.8}
                strokeDasharray="3 3"
                style={{ transition: "stroke 0.25s ease, stroke-width 0.25s ease" }}
              />
            );
          })}
        </svg>

        {/* Center */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center bg-white rounded-full border-[3px]"
          style={{
            width: "clamp(72px,19vw,100px)", aspectRatio: "1/1",
            borderColor: "var(--cadc-blue)",
            boxShadow: "0 0 0 5px rgba(1,1,255,0.07), 0 6px 20px rgba(1,1,255,0.14)",
          }}>
          <span style={{ fontSize: "clamp(0.9rem,3vw,1.4rem)" }}>🏫</span>
          <span className="font-serif font-bold text-center leading-tight" style={{ fontSize: "clamp(0.38rem,1.1vw,0.5rem)", color: "var(--cadc-blue)", letterSpacing: "0.04em" }}>
            HEAD<br />START
          </span>
        </div>

        {/* Nodes */}
        {HS_AREAS.map((area, i) => {
          const { x, y } = nodePos(i, HS_AREAS.length);
          const isActive = active === area.id;
          const isGlowing = glow === area.id;
          return (
            <button
              key={area.id}
              type="button"
              onClick={() => tap(area.id)}
              aria-label={area.label}
              aria-pressed={isActive}
              className="absolute flex flex-col items-center gap-1"
              style={{
                left: `${x}%`, top: `${y}%`,
                width: "clamp(52px,14vw,72px)",
                transform: "translate(-50%, -50%)",
              }}
            >
              {isGlowing && (
                <div className="absolute rounded-full" style={{
                  inset: "-8px",
                  background: "radial-gradient(circle, rgba(1,1,255,0.3) 0%, transparent 70%)",
                  animation: "ping 0.6s ease-out forwards",
                }} />
              )}
              <div style={{
                width: "clamp(36px,9vw,52px)", aspectRatio: "1/1",
                borderRadius: "50%", background: "white",
                border: `2.5px solid ${isActive ? "var(--cadc-maroon)" : "var(--cadc-blue)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "clamp(0.8rem,2.2vw,1.1rem)",
                boxShadow: isActive
                  ? "0 0 0 4px rgba(126,0,1,0.15), 0 4px 16px rgba(126,0,1,0.2)"
                  : "0 2px 8px rgba(1,1,255,0.1)",
                transition: "border-color 0.25s, box-shadow 0.3s",
              }} aria-hidden="true">
                {area.icon}
              </div>
              <span style={{
                fontSize: "clamp(0.38rem,1.1vw,0.5rem)",
                fontWeight: 700,
                color: isActive ? "var(--cadc-maroon)" : "var(--cadc-blue)",
                textTransform: "uppercase", letterSpacing: "0.05em",
                textAlign: "center", lineHeight: 1.2,
                width: "clamp(52px,14vw,72px)",
                overflowWrap: "break-word",
              }}>
                {area.shortLabel}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content panel */}
      <div
        className="rounded-2xl overflow-hidden transition-all duration-400"
        style={{
          maxHeight: activeArea ? "1200px" : "0px",
          opacity: activeArea ? 1 : 0,
          transition: "max-height 0.4s ease, opacity 0.3s ease",
        }}
      >
        {activeArea && (
          <div className="border rounded-2xl overflow-hidden" style={{ borderColor: "var(--cadc-border)" }}>
            <div className="px-5 py-4 flex items-center justify-between" style={{ background: "var(--cadc-blue)" }}>
              <h3 className="font-serif font-bold text-white text-base flex items-center gap-2">
                <span aria-hidden="true">{activeArea.icon}</span>
                {activeArea.label}
              </h3>
              <button
                type="button"
                onClick={() => setActive(null)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-white opacity-60 hover:opacity-100 transition-opacity"
                style={{ background: "rgba(255,255,255,0.15)", fontSize: "0.75rem" }}
                aria-label="Close"
              >✕</button>
            </div>
            <div className="p-5">{activeArea.content}</div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes ping {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.6); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--cadc-maroon)" }}>
      {children}
    </p>
  );
}

function EnrollCTA() {
  return (
    <div className="cadc-grid-bg rounded-2xl overflow-hidden" style={{ background: "var(--cadc-blue)" }}>
      <div className="px-6 py-8 md:px-10 md:py-10 flex flex-col gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2 opacity-70" style={{ color: "var(--cadc-blue-light)" }}>
            Enrollment
          </p>
          <h2 className="font-serif text-2xl md:text-3xl font-bold leading-tight text-white">
            Apply for Head Start Today
          </h2>
          <p className="mt-3 text-sm md:text-base leading-relaxed" style={{ color: "var(--cadc-blue-light)" }}>
            Enrollment is open year-round. Applications are reviewed on a rolling basis — spaces fill quickly.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={external.childPlusApply}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--cadc-maroon)" }}
          >
            Start Application (ChildPlus) →
          </a>
          <a
            href={contact.mainPhoneHref}
            className="inline-flex items-center justify-center gap-2 rounded-lg border px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            style={{ borderColor: "rgba(255,255,255,0.35)" }}
          >
            📞 {contact.mainPhone}
          </a>
        </div>
      </div>
    </div>
  );
}

export default function HeadStartPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="cadc-grid-bg py-14 md:py-20" style={{ background: "var(--cadc-blue)" }}>
        <div className="mx-auto max-w-4xl px-5 md:px-8">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-6 opacity-70 hover:opacity-100 transition-opacity" style={{ color: "var(--cadc-blue-light)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
            All Programs
          </Link>
          <h1 className="font-serif text-3xl md:text-5xl font-bold leading-tight mb-4 text-white">
            Head Start &amp;<br className="hidden sm:block" /> Early Head Start
          </h1>
          <p className="text-base md:text-lg leading-relaxed max-w-2xl" style={{ color: "var(--cadc-blue-light)" }}>
            Free, federally funded early childhood education across 11 centers in Southwest Oklahoma —
            from pregnancy through kindergarten.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-5 md:px-8 py-10 md:py-14 flex flex-col gap-14">

        <EnrollCTA />

        {/* Head Start sub-orbit */}
        <section aria-labelledby="explore-heading">
          <SectionLabel>Explore Our Program</SectionLabel>
          <h2 id="explore-heading" className="font-serif text-2xl font-bold mb-6" style={{ color: "var(--cadc-blue)" }}>
            Tap Any Area to Learn More
          </h2>
          <HeadStartOrbit />
        </section>

        {/* 11 Centers */}
        <section aria-labelledby="locations-heading">
          <SectionLabel>Where We Are</SectionLabel>
          <h2 id="locations-heading" className="font-serif text-2xl font-bold mb-6" style={{ color: "var(--cadc-blue)" }}>
            11 Head Start Centers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {headStartCenters.map((loc) => (
              <div key={loc.id} className="rounded-xl border p-5 flex flex-col gap-1.5" style={{ borderColor: "#e5e7eb" }}>
                <p className="font-semibold text-sm" style={{ color: "var(--cadc-blue)" }}>{loc.name}</p>
                <p className="text-xs leading-relaxed" style={{ color: "#6b7280" }}>{loc.street}</p>
                <p className="text-xs" style={{ color: "#6b7280" }}>{loc.city}, {loc.state} {loc.zip}</p>
                <a href={loc.phoneHref} className="text-xs font-semibold mt-1 hover:underline" style={{ color: "var(--cadc-blue)" }}>
                  {loc.phone}
                </a>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs" style={{ color: "#6b7280" }}>
            <Link href="/programs/transit" className="font-semibold underline underline-offset-2 hover:opacity-70" style={{ color: "var(--cadc-blue)" }}>
              Transportation assistance available via Red River Transit →
            </Link>
          </p>
        </section>

        {/* Staff */}
        <section aria-labelledby="staff-heading">
          <SectionLabel>Our Team</SectionLabel>
          <h2 id="staff-heading" className="font-serif text-2xl font-bold mb-6" style={{ color: "var(--cadc-blue)" }}>
            Head Start Leadership
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {headStartStaff.map((s) => (
              <div key={s.id} className="rounded-xl border p-5 flex flex-col gap-1.5" style={{ borderColor: "#e5e7eb" }}>
                <p className="font-bold text-sm" style={{ color: "var(--cadc-blue)" }}>{s.name}</p>
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--cadc-maroon)" }}>{s.title}</p>
                {s.tenure && <p className="text-xs" style={{ color: "#9ca3af" }}>{s.tenure}</p>}
                {s.bio && <p className="text-xs leading-relaxed mt-1" style={{ color: "#374151" }}>{s.bio}</p>}
              </div>
            ))}
          </div>
        </section>

        <EnrollCTA />

        {/* Federal disclaimer */}
        <section aria-label="Federal grant disclosure">
          <p className="text-[0.65rem] leading-relaxed" style={{ color: "#9ca3af" }}>
            {headStartDisclaimer}
          </p>
        </section>

        <div className="pb-4">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold transition-opacity hover:opacity-70" style={{ color: "var(--cadc-blue)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
            Back to all programs
          </Link>
        </div>

      </div>
    </div>
  );
}
