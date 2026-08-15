import Link from "next/link";
import type { Metadata } from "next";
import { external, contact } from "@/lib/org";

export const metadata: Metadata = {
  title: "Community Market | CADC Southwest Oklahoma",
  description:
    "An emerging program expanding food access across Southwest Oklahoma. Tell us what your community needs.",
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--cadc-maroon)" }}>
      {children}
    </p>
  );
}

export default function CommunityMarketPage() {
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

          <div
            className="inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider text-white mb-4"
            style={{ background: "var(--cadc-maroon)" }}
          >
            Growing Program
          </div>

          <h1 className="font-serif text-3xl md:text-5xl font-bold leading-tight mb-4 text-white">
            Community Market
          </h1>
          <p className="text-base md:text-lg leading-relaxed max-w-2xl" style={{ color: "var(--cadc-blue-light)" }}>
            A developing program focused on expanding food access across the region.
            We're building this with the community — your input shapes what comes next.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-5 md:px-8 py-10 md:py-14 flex flex-col gap-14">

        {/* Survey CTA */}
        <div className="cadc-grid-bg rounded-2xl overflow-hidden" style={{ background: "var(--cadc-blue)" }}>
          <div className="px-6 py-8 md:px-10 md:py-10 flex flex-col gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2 opacity-70" style={{ color: "var(--cadc-blue-light)" }}>
                Your Voice
              </p>
              <h2 className="font-serif text-2xl md:text-3xl font-bold leading-tight text-white">
                Tell Us What Your Community Needs
              </h2>
              <p className="mt-3 text-sm md:text-base leading-relaxed" style={{ color: "var(--cadc-blue-light)" }}>
                The Community Needs Survey directly informs how CADC expands food
                access across Southwest Oklahoma. Takes less than 5 minutes.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={external.communityNeedsSurvey}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: "var(--cadc-maroon)" }}
              >
                Take the Survey →
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

        {/* What it is */}
        <section aria-labelledby="about-heading">
          <SectionLabel>About This Program</SectionLabel>
          <h2 id="about-heading" className="font-serif text-2xl font-bold mb-5" style={{ color: "var(--cadc-blue)" }}>
            Building Food Access From the Ground Up
          </h2>
          <p className="text-base leading-relaxed mb-4" style={{ color: "#374151" }}>
            The Community Market is one of CADC's newest initiatives — built around
            the understanding that food access in rural Southwest Oklahoma requires
            more than a traditional approach. We're developing a model that meets
            people where they are.
          </p>
          <p className="text-base leading-relaxed" style={{ color: "#374151" }}>
            This program is actively expanding. The survey above is the most
            direct way to influence its direction and make sure it serves the
            communities that need it most.
          </p>
        </section>

        {/* Focus areas */}
        <section aria-labelledby="focus-heading">
          <SectionLabel>Focus Areas</SectionLabel>
          <h2 id="focus-heading" className="font-serif text-2xl font-bold mb-6" style={{ color: "var(--cadc-blue)" }}>
            What We're Working Toward
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: "🛒", title: "Affordable Food Access", detail: "Reducing barriers to fresh, nutritious food for low-income households across the region." },
              { icon: "🌱", title: "Local Food Systems", detail: "Connecting local producers with community members who need what they grow." },
              { icon: "📍", title: "Rural Reach", detail: "Prioritizing communities that commercial grocery options have passed over." },
              { icon: "🤝", title: "Community-Driven", detail: "Program design shaped directly by resident input — not assumptions about what people need." },
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

        {/* Stay informed */}
        <section
          aria-labelledby="stay-heading"
          className="rounded-2xl p-6 md:p-8"
          style={{ background: "var(--cadc-blue-light)" }}
        >
          <SectionLabel>Stay Connected</SectionLabel>
          <h2 id="stay-heading" className="font-serif text-xl font-bold mb-3" style={{ color: "var(--cadc-blue)" }}>
            More Coming Soon
          </h2>
          <p className="text-sm leading-relaxed mb-5" style={{ color: "#374151" }}>
            As the Community Market develops, this page will be updated with
            locations, hours, and how to participate. The best way to stay
            informed is to take the survey and follow CADC on social media.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={external.communityNeedsSurvey}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: "var(--cadc-blue)" }}
            >
              Take the Community Needs Survey
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
