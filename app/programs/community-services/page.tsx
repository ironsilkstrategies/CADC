import Link from "next/link";
import type { Metadata } from "next";
import { contact } from "@/lib/org";

export const metadata: Metadata = {
  title: "Community Services | CADC Southwest Oklahoma",
  description:
    "CSBG-funded emergency assistance and referrals for households facing a crisis across Southwest Oklahoma. Utility help, food resources, and more.",
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--cadc-maroon)" }}>
      {children}
    </p>
  );
}

function ContactCTA() {
  return (
    <div className="cadc-grid-bg rounded-2xl overflow-hidden" style={{ background: "var(--cadc-blue)" }}>
      <div className="px-6 py-8 md:px-10 md:py-10 flex flex-col gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2 opacity-70" style={{ color: "var(--cadc-blue-light)" }}>
            Get Help Now
          </p>
          <h2 className="font-serif text-2xl md:text-3xl font-bold leading-tight text-white">
            Reach Out Today
          </h2>
          <p className="mt-3 text-sm md:text-base leading-relaxed" style={{ color: "var(--cadc-blue-light)" }}>
            If your household is facing a crisis, don't wait. Call us and we'll
            connect you with the right assistance as quickly as possible.
          </p>
        </div>
        <a
          href={contact.mainPhoneHref}
          className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 w-full sm:w-auto"
          style={{ background: "var(--cadc-maroon)" }}
        >
          📞 Call {contact.mainPhone}
        </a>
      </div>
    </div>
  );
}

export default function CommunityServicesPage() {
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
            Community Services
          </h1>
          <p className="text-base md:text-lg leading-relaxed max-w-2xl" style={{ color: "var(--cadc-blue-light)" }}>
            Emergency assistance and referrals for households in crisis across
            Southwest Oklahoma — funded through the Community Services Block Grant.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-5 md:px-8 py-10 md:py-14 flex flex-col gap-14">

        <ContactCTA />

        {/* What we provide */}
        <section aria-labelledby="services-heading">
          <SectionLabel>How We Help</SectionLabel>
          <h2 id="services-heading" className="font-serif text-2xl font-bold mb-6" style={{ color: "var(--cadc-blue)" }}>
            Emergency Assistance & Referrals
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "Utility assistance — electric, gas, water",
              "Food resources and referrals",
              "Emergency financial assistance",
              "Housing stability support",
              "Referrals to partner agencies",
              "Case management for ongoing needs",
              "Crisis intervention and navigation",
              "Connection to federal and state programs",
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

        {/* Who we serve */}
        <section
          aria-labelledby="eligibility-heading"
          className="rounded-2xl p-6 md:p-8"
          style={{ background: "var(--cadc-blue-light)" }}
        >
          <SectionLabel>Who We Serve</SectionLabel>
          <h2 id="eligibility-heading" className="font-serif text-2xl font-bold mb-6" style={{ color: "var(--cadc-blue)" }}>
            Low-Income Households in Crisis
          </h2>
          <div className="flex flex-col gap-4">
            {[
              { label: "Income", detail: "Households at or below 125% of the federal poverty level" },
              { label: "Situation", detail: "Priority given to households facing an immediate crisis — utility shutoff, food insecurity, housing instability" },
              { label: "Area", detail: "Residents within CADC's service area across Southwest and Central Oklahoma" },
              { label: "Documentation", detail: "Call us first — we'll tell you exactly what to bring before you visit" },
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
        </section>

        {/* About CSBG */}
        <section
          aria-labelledby="csbg-heading"
          className="rounded-2xl p-6 md:p-8 border"
          style={{ borderColor: "var(--cadc-blue-light)" }}
        >
          <SectionLabel>About the Program</SectionLabel>
          <h2 id="csbg-heading" className="font-serif text-xl font-bold mb-3" style={{ color: "var(--cadc-blue)" }}>
            Community Services Block Grant
          </h2>
          <p className="text-sm leading-relaxed mb-3" style={{ color: "#374151" }}>
            CADC's Community Services program is funded through the Community Services
            Block Grant (CSBG), a federal program administered in Oklahoma through the
            Department of Commerce. CSBG exists to reduce poverty, revitalize low-income
            communities, and empower low-income families to become self-sufficient.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
            As a Community Action Agency, CADC has delivered these services across
            Southwest Oklahoma for decades — connecting families to the resources they
            need to stabilize and move forward.
          </p>
        </section>

        <ContactCTA />

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
