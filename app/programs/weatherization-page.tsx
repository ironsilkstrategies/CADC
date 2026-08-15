import Link from "next/link";
import type { Metadata } from "next";
import { external, contact } from "@/lib/org";

export const metadata: Metadata = {
  title: "Weatherization & Housing | CADC Southwest Oklahoma",
  description:
    "Free home energy improvements for income-eligible households across 17 counties. Insulation, air sealing, HVAC — funded through the Department of Energy and Oklahoma DHS.",
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--cadc-maroon)" }}>
      {children}
    </p>
  );
}

function ApplyCTA() {
  return (
    <div className="cadc-grid-bg rounded-2xl overflow-hidden" style={{ background: "var(--cadc-blue)" }}>
      <div className="px-6 py-8 md:px-10 md:py-10 flex flex-col gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2 opacity-70" style={{ color: "var(--cadc-blue-light)" }}>
            Apply Now
          </p>
          <h2 className="font-serif text-2xl md:text-3xl font-bold leading-tight text-white">
            See If Your Home Qualifies
          </h2>
          <p className="mt-3 text-sm md:text-base leading-relaxed" style={{ color: "var(--cadc-blue-light)" }}>
            Applications are handled through the statewide WAP portal. The process
            is free — there is no cost to apply or to receive services.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={external.weatherizationApply}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--cadc-maroon)" }}
          >
            Apply Online → ok.mywaplink.org
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

export default function WeatherizationPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
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
            Weatherization &amp; Housing
          </h1>
          <p className="text-base md:text-lg leading-relaxed max-w-2xl" style={{ color: "var(--cadc-blue-light)" }}>
            Free home energy improvements for income-eligible households across
            17 counties. Funded through the U.S. Department of Energy and Oklahoma DHS.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-5 md:px-8 py-10 md:py-14 flex flex-col gap-14">

        <ApplyCTA />

        {/* What we do */}
        <section aria-labelledby="services-heading">
          <SectionLabel>What's Included</SectionLabel>
          <h2 id="services-heading" className="font-serif text-2xl font-bold mb-6" style={{ color: "var(--cadc-blue)" }}>
            Home Improvements at No Cost
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "Insulation — attic, wall, and floor",
              "Air sealing — stops drafts and heat loss",
              "Heating and cooling system upgrades",
              "Water heater improvements",
              "Windows and doors (select cases)",
              "Health and safety repairs tied to energy systems",
              "Energy audits to identify your home's needs",
              "Education on reducing your utility bills",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-relaxed" style={{ color: "#374151" }}>
                <span
                  className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: "var(--cadc-blue)", minWidth: "1.25rem" }}
                  aria-hidden="true"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Eligibility */}
        <section
          aria-labelledby="eligibility-heading"
          className="rounded-2xl p-6 md:p-8"
          style={{ background: "var(--cadc-blue-light)" }}
        >
          <SectionLabel>Who Qualifies</SectionLabel>
          <h2 id="eligibility-heading" className="font-serif text-2xl font-bold mb-6" style={{ color: "var(--cadc-blue)" }}>
            Eligibility Requirements
          </h2>
          <div className="flex flex-col gap-4">
            {[
              { label: "Income", detail: "Household income at or below 200% of the federal poverty level" },
              { label: "Priority", detail: "Households with elderly residents, young children, or persons with disabilities are prioritized" },
              { label: "Renters", detail: "Renters may qualify with landlord permission" },
              { label: "Coverage", detail: "17 counties across Southwest and Central Oklahoma — call to confirm your county" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex gap-4 items-start pb-4 border-b last:border-b-0 last:pb-0"
                style={{ borderColor: "#c7d4e8" }}
              >
                <span
                  className="flex-shrink-0 rounded-lg px-2 py-1 text-xs font-bold uppercase tracking-wide text-white"
                  style={{ background: "var(--cadc-blue)" }}
                >
                  {item.label}
                </span>
                <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>{item.detail}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs leading-relaxed" style={{ color: "#6b7280" }}>
            Not sure if you qualify?{" "}
            <a href={contact.mainPhoneHref} className="font-semibold underline underline-offset-2 hover:opacity-70" style={{ color: "var(--cadc-blue)" }}>
              Call us and we'll check for you.
            </a>
          </p>
        </section>

        {/* How it works */}
        <section aria-labelledby="process-heading">
          <SectionLabel>How It Works</SectionLabel>
          <h2 id="process-heading" className="font-serif text-2xl font-bold mb-6" style={{ color: "var(--cadc-blue)" }}>
            From Application to Completion
          </h2>
          <ol className="flex flex-col gap-5">
            {[
              { step: "1", title: "Apply online or call", detail: "Submit your application at ok.mywaplink.org or call our office. No cost to apply." },
              { step: "2", title: "Home energy audit", detail: "A certified energy auditor visits your home to assess insulation, air leakage, heating systems, and more." },
              { step: "3", title: "Work is scheduled", detail: "Approved improvements are scheduled and completed by certified contractors at no cost to you." },
              { step: "4", title: "Final inspection", detail: "Work is inspected for quality and compliance before the file is closed." },
            ].map((s) => (
              <li key={s.step} className="flex gap-4 items-start">
                <span
                  className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-serif font-bold text-base text-white"
                  style={{ background: "var(--cadc-blue)" }}
                  aria-hidden="true"
                >
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

        {/* Funding note */}
        <section
          aria-labelledby="funding-heading"
          className="rounded-2xl p-6 md:p-8 border"
          style={{ borderColor: "var(--cadc-blue-light)" }}
        >
          <SectionLabel>Funding</SectionLabel>
          <h2 id="funding-heading" className="font-serif text-xl font-bold mb-3" style={{ color: "var(--cadc-blue)" }}>
            Federally & State Funded
          </h2>
          <p className="text-sm leading-relaxed mb-3" style={{ color: "#374151" }}>
            The Weatherization Assistance Program (WAP) is funded by the U.S. Department
            of Energy and administered in Oklahoma through the Department of Human Services.
            CADC delivers the program directly to eligible households across our 17-county
            service area.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
            There is no cost to eligible applicants. All work is performed by
            DOE-certified contractors and inspected for quality.
          </p>
        </section>

        <ApplyCTA />

        {/* Back nav */}
        <div className="pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold transition-opacity hover:opacity-70"
            style={{ color: "var(--cadc-blue)" }}
          >
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
