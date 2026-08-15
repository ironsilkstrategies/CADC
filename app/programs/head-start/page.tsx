import Link from "next/link";
import type { Metadata } from "next";
import { external, headStartDisclaimer, contact } from "@/lib/org";
import { headStartCenters } from "@/lib/locations";
import { headStartStaff } from "@/lib/staff";

export const metadata: Metadata = {
  title: "Head Start & Early Head Start | CADC Southwest Oklahoma",
  description:
    "Free early childhood education at 13 centers across Southwest Oklahoma. Serving children ages 3–5 and pregnant women and expectant families. Apply through ChildPlus.",
};

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
            Enrollment is open year-round. Applications are reviewed on a rolling
            basis — spaces fill quickly.
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

      <section className="cadc-grid-bg py-14 md:py-20" style={{ background: "var(--cadc-blue)" }}>
        <div className="mx-auto max-w-4xl px-5 md:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-6 opacity-70 hover:opacity-100 transition-opacity"
            style={{ color: "var(--cadc-blue-light)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m15 18-6-6 6-6" />
            </svg>
            All Programs
          </Link>
          <h1 className="font-serif text-3xl md:text-5xl font-bold leading-tight mb-4 text-white">
            Head Start &amp;<br className="hidden sm:block" /> Early Head Start
          </h1>
          <p className="text-base md:text-lg leading-relaxed max-w-2xl" style={{ color: "var(--cadc-blue-light)" }}>
            Free, federally funded early childhood education across 13 centers in
            Southwest Oklahoma — from pregnancy through kindergarten.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-5 md:px-8 py-10 md:py-14 flex flex-col gap-14">

        <EnrollCTA />

        <section aria-labelledby="programs-heading">
          <SectionLabel>Programs</SectionLabel>
          <h2 id="programs-heading" className="font-serif text-2xl font-bold mb-6" style={{ color: "var(--cadc-blue)" }}>
            Two Programs, One Mission
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Early Head Start", ages: "Pregnant women & children birth–3", detail: "Home visits, center-based care, and family support starting before birth. Focused on development during the most critical window." },
              { label: "Head Start", ages: "Children ages 3–5", detail: "Full-day preschool with health screenings, nutrition, family engagement, and school-readiness curriculum — at no cost to eligible families." },
            ].map((g) => (
              <div key={g.label} className="rounded-xl border p-6 flex flex-col gap-2" style={{ borderColor: "var(--cadc-blue-light)", background: "var(--cadc-blue-light)" }}>
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--cadc-maroon)" }}>{g.label}</p>
                <p className="font-serif text-lg font-bold" style={{ color: "var(--cadc-blue)" }}>{g.ages}</p>
                <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>{g.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="services-heading">
          <SectionLabel>Services Included</SectionLabel>
          <h2 id="services-heading" className="font-serif text-2xl font-bold mb-6" style={{ color: "var(--cadc-blue)" }}>
            What Your Child Receives
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "Full-day / full-year preschool at no cost",
              "Health, vision, dental, and hearing screenings",
              "Nutritious meals and snacks daily",
              "Mental health and disability services",
              "Family support specialists",
              "Parent leadership and engagement opportunities",
              "Home visit option (Early Head Start)",
              "Transportation assistance (select sites)",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-relaxed" style={{ color: "#374151" }}>
                <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "var(--cadc-blue)", minWidth: "1.25rem" }} aria-hidden="true">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="eligibility-heading" className="rounded-2xl p-6 md:p-8" style={{ background: "var(--cadc-blue-light)" }}>
          <SectionLabel>Who Qualifies</SectionLabel>
          <h2 id="eligibility-heading" className="font-serif text-2xl font-bold mb-6" style={{ color: "var(--cadc-blue)" }}>
            Eligibility Requirements
          </h2>
          <div className="flex flex-col gap-4">
            {[
              { label: "Income", detail: "Family income at or below federal poverty guidelines" },
              { label: "Foster / Homeless", detail: "Children in foster care or experiencing homelessness qualify regardless of income" },
              { label: "Disability", detail: "Up to 10% of enrollment reserved for children with disabilities" },
              { label: "Residency", detail: "Must reside within CADC's service area in Southwest Oklahoma" },
            ].map((item) => (
              <div key={item.label} className="flex gap-4 items-start pb-4 border-b last:border-b-0 last:pb-0" style={{ borderColor: "#c7d4e8" }}>
                <span className="flex-shrink-0 rounded-lg px-2 py-1 text-xs font-bold uppercase tracking-wide text-white" style={{ background: "var(--cadc-blue)" }}>
                  {item.label}
                </span>
                <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>{item.detail}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs leading-relaxed" style={{ color: "#6b7280" }}>
            Not sure if you qualify?{" "}
            <a href={contact.mainPhoneHref} className="font-semibold underline underline-offset-2 hover:opacity-70" style={{ color: "var(--cadc-blue)" }}>
              Call us — we'll walk you through it.
            </a>
          </p>
        </section>

        <section aria-labelledby="enroll-heading">
          <SectionLabel>How to Apply</SectionLabel>
          <h2 id="enroll-heading" className="font-serif text-2xl font-bold mb-6" style={{ color: "var(--cadc-blue)" }}>
            Enrollment Is 3 Steps
          </h2>
          <ol className="flex flex-col gap-5">
            {[
              { step: "1", title: "Start your application online", detail: "Tap the ChildPlus button above or call our office. Applications take about 10–15 minutes." },
              { step: "2", title: "Gather your documents", detail: "You'll need proof of income (pay stubs, tax return, or benefits letter), your child's birth certificate, immunization records, and proof of address." },
              { step: "3", title: "We'll contact you", detail: "Our team reviews applications on a rolling basis. We'll reach out to schedule a home visit or center tour and confirm enrollment." },
            ].map((s) => (
              <li key={s.step} className="flex gap-4 items-start">
                <span className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-serif font-bold text-base text-white" style={{ background: "var(--cadc-blue)" }} aria-hidden="true">
                  {s.step}
                </span>
                <div>
                  <p className="font-semibold text-sm mb-1" style={{ color: "var(--cadc-blue)" }}>{s.title}</p>
                  <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>{s.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="locations-heading">
          <SectionLabel>Where We Are</SectionLabel>
          <h2 id="locations-heading" className="font-serif text-2xl font-bold mb-6" style={{ color: "var(--cadc-blue)" }}>
            13 Head Start Centers
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

        <section aria-label="Federal grant disclosure">
          <p className="text-[0.65rem] leading-relaxed" style={{ color: "#9ca3af" }}>
            {headStartDisclaimer}
          </p>
        </section>

        <div className="pb-4">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold transition-opacity hover:opacity-70" style={{ color: "var(--cadc-blue)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to all programs
          </Link>
        </div>

      </div>
    </div>
  );
}
