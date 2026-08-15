import Link from "next/link";
import type { Metadata } from "next";
import { contact } from "@/lib/org";

export const metadata: Metadata = {
  title: "VITA Tax Assistance | CADC Southwest Oklahoma",
  description:
    "Free tax preparation by IRS-certified volunteers across Southwest Oklahoma. No cost, no filing fees. Keep every dollar of your refund.",
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
            Free Tax Prep
          </p>
          <h2 className="font-serif text-2xl md:text-3xl font-bold leading-tight text-white">
            Get Your Taxes Done Free
          </h2>
          <p className="mt-3 text-sm md:text-base leading-relaxed" style={{ color: "var(--cadc-blue-light)" }}>
            Call us to find out when and where VITA tax prep is available
            in your area this season.
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

export default function TaxHelpPage() {
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
            VITA Tax Assistance
          </h1>
          <p className="text-base md:text-lg leading-relaxed max-w-2xl" style={{ color: "var(--cadc-blue-light)" }}>
            Free tax preparation by IRS-certified volunteers. No cost.
            No filing fees. Every dollar of your refund stays with you.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-5 md:px-8 py-10 md:py-14 flex flex-col gap-14">

        <ContactCTA />

        {/* Why free matters */}
        <section aria-labelledby="why-heading">
          <SectionLabel>Why It Matters</SectionLabel>
          <h2 id="why-heading" className="font-serif text-2xl font-bold mb-6" style={{ color: "var(--cadc-blue)" }}>
            Keep Every Dollar You Earned
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { stat: "$0", label: "Cost to file", detail: "No prep fees, no filing fees, no hidden charges" },
              { stat: "IRS", label: "Certified volunteers", detail: "Every preparer is trained and certified by the IRS" },
              { stat: "100%", label: "Your refund", detail: "Nothing taken out — your full refund goes directly to you" },
            ].map(({ stat, label, detail }) => (
              <div
                key={label}
                className="rounded-xl p-6 flex flex-col gap-2 text-center"
                style={{ background: "var(--cadc-blue-light)" }}
              >
                <p className="font-serif text-3xl font-bold" style={{ color: "var(--cadc-blue)" }}>{stat}</p>
                <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--cadc-maroon)" }}>{label}</p>
                <p className="text-xs leading-relaxed" style={{ color: "#374151" }}>{detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What to bring */}
        <section aria-labelledby="bring-heading">
          <SectionLabel>What to Bring</SectionLabel>
          <h2 id="bring-heading" className="font-serif text-2xl font-bold mb-6" style={{ color: "var(--cadc-blue)" }}>
            Come Prepared
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "Photo ID — driver's license or state ID",
              "Social Security cards for you, your spouse, and dependents",
              "All W-2 and 1099 forms",
              "Last year's tax return (if available)",
              "Bank account and routing number for direct deposit",
              "Any letters or notices from the IRS",
              "Records of other income — rental, self-employment, etc.",
              "Proof of health insurance (Form 1095)",
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

        {/* Who qualifies */}
        <section
          aria-labelledby="eligibility-heading"
          className="rounded-2xl p-6 md:p-8"
          style={{ background: "var(--cadc-blue-light)" }}
        >
          <SectionLabel>Who Qualifies</SectionLabel>
          <h2 id="eligibility-heading" className="font-serif text-2xl font-bold mb-6" style={{ color: "var(--cadc-blue)" }}>
            Generally Available to Most Households
          </h2>
          <div className="flex flex-col gap-4">
            {[
              { label: "Income", detail: "VITA generally serves households earning $67,000 or less per year" },
              { label: "Returns", detail: "Handles most common federal and state returns including earned income credit, child tax credit, and education credits" },
              { label: "Season", detail: "Available during tax season — call us for this year's dates and locations" },
              { label: "Complex returns", detail: "Self-employment with losses, rental properties, or multi-state returns may require a paid preparer" },
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

        {/* About VITA */}
        <section
          aria-labelledby="vita-heading"
          className="rounded-2xl p-6 md:p-8 border"
          style={{ borderColor: "var(--cadc-blue-light)" }}
        >
          <SectionLabel>About VITA</SectionLabel>
          <h2 id="vita-heading" className="font-serif text-xl font-bold mb-3" style={{ color: "var(--cadc-blue)" }}>
            Volunteer Income Tax Assistance
          </h2>
          <p className="text-sm leading-relaxed mb-3" style={{ color: "#374151" }}>
            VITA is an IRS program that provides free tax filing assistance to
            people who generally earn $67,000 or less. Volunteers are trained
            and certified by the IRS each year before preparing a single return.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
            CADC brings VITA to communities across Southwest Oklahoma that would
            otherwise pay $200–$500 or more to have their taxes prepared commercially.
            That money stays local — in the pockets of the families who earned it.
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
