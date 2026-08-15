import Link from "next/link";
import type { Metadata } from "next";
import { contact } from "@/lib/org";

export const metadata: Metadata = {
  title: "Employment & Workforce | CADC Southwest Oklahoma",
  description:
    "Open positions at CADC and workforce support across Southwest Oklahoma. Join a team that serves the region every day.",
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--cadc-maroon)" }}>
      {children}
    </p>
  );
}

export default function EmploymentPage() {
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
            Employment &amp; Workforce
          </h1>
          <p className="text-base md:text-lg leading-relaxed max-w-2xl" style={{ color: "var(--cadc-blue-light)" }}>
            Join a team that serves Southwest Oklahoma every day —
            or find workforce resources to help move your career forward.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-5 md:px-8 py-10 md:py-14 flex flex-col gap-14">

        {/* Open positions CTA */}
        <div className="cadc-grid-bg rounded-2xl overflow-hidden" style={{ background: "var(--cadc-blue)" }}>
          <div className="px-6 py-8 md:px-10 md:py-10 flex flex-col gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2 opacity-70" style={{ color: "var(--cadc-blue-light)" }}>
                Now Hiring
              </p>
              <h2 className="font-serif text-2xl md:text-3xl font-bold leading-tight text-white">
                Open Positions at CADC
              </h2>
              <p className="mt-3 text-sm md:text-base leading-relaxed" style={{ color: "var(--cadc-blue-light)" }}>
                Current openings are posted on Facebook and listed through our
                office. Call us to ask about open positions or to request an
                application.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={contact.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: "var(--cadc-maroon)" }}
              >
                View Openings on Facebook →
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

        {/* Why work at CADC */}
        <section aria-labelledby="why-heading">
          <SectionLabel>Why CADC</SectionLabel>
          <h2 id="why-heading" className="font-serif text-2xl font-bold mb-6" style={{ color: "var(--cadc-blue)" }}>
            Work That Means Something
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: "🌎", title: "Regional Impact", detail: "Every role at CADC connects directly to the communities we serve — 16–17 counties across Southwest Oklahoma." },
              { icon: "🏫", title: "Diverse Programs", detail: "From Head Start teachers to transit drivers to outreach workers — CADC employs across a wide range of fields." },
              { icon: "📈", title: "Growth & Stability", detail: "Many CADC team members have been with the agency for years. We invest in the people who invest in us." },
              { icon: "🤝", title: "Mission-Driven", detail: "We exist to improve lives. If that's why you work, you'll fit right in." },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border p-6 flex flex-col gap-2"
                style={{ borderColor: "var(--cadc-blue-light)", background: "var(--cadc-blue-light)" }}
              >
                <span className="text-2xl" aria-hidden="true">{item.icon}</span>
                <p className="font-serif text-base font-bold" style={{ color: "var(--cadc-blue)" }}>{item.title}</p>
                <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Types of roles */}
        <section aria-labelledby="roles-heading">
          <SectionLabel>Types of Positions</SectionLabel>
          <h2 id="roles-heading" className="font-serif text-2xl font-bold mb-6" style={{ color: "var(--cadc-blue)" }}>
            Where You Might Fit
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "Head Start teachers and classroom aides",
              "Family service workers",
              "Transit drivers — CDL and non-CDL",
              "Nutrition technicians",
              "Health and disability coordinators",
              "Administrative and office support",
              "Outreach and community engagement",
              "Maintenance and facilities",
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

        {/* How to apply */}
        <section
          aria-labelledby="apply-heading"
          className="rounded-2xl p-6 md:p-8"
          style={{ background: "var(--cadc-blue-light)" }}
        >
          <SectionLabel>How to Apply</SectionLabel>
          <h2 id="apply-heading" className="font-serif text-2xl font-bold mb-5" style={{ color: "var(--cadc-blue)" }}>
            Simple Process
          </h2>
          <ol className="flex flex-col gap-5">
            {[
              { step: "1", title: "Find an opening", detail: "Check our Facebook page or call the office to ask about current positions." },
              { step: "2", title: "Request an application", detail: "Call or visit your nearest CADC office to pick up or request an application." },
              { step: "3", title: "Submit and follow up", detail: "Return your completed application and follow up directly with the hiring office." },
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
          <div className="mt-6">
            <a
              href={contact.mainPhoneHref}
              className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: "var(--cadc-blue)" }}
            >
              📞 Call {contact.mainPhone}
            </a>
          </div>
        </section>

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
