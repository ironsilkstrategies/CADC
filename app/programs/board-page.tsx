import Link from "next/link";
import type { Metadata } from "next";
import { contact } from "@/lib/org";
import { agencyLeadership, programDirectors } from "@/lib/staff";

export const metadata: Metadata = {
  title: "Board & Leadership | CADC Southwest Oklahoma",
  description:
    "Board meeting agendas, schedules, governance documents, and Policy Council information for Community Action Development Corporation.",
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--cadc-maroon)" }}>
      {children}
    </p>
  );
}

export default function BoardPage() {
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
            Board &amp; Leadership
          </h1>
          <p className="text-base md:text-lg leading-relaxed max-w-2xl" style={{ color: "var(--cadc-blue-light)" }}>
            Governance documents, meeting agendas, executive leadership, and
            Policy Council information for Community Action Development Corporation.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-5 md:px-8 py-10 md:py-14 flex flex-col gap-14">

        {/* Executive leadership */}
        <section aria-labelledby="leadership-heading">
          <SectionLabel>Executive Leadership</SectionLabel>
          <h2 id="leadership-heading" className="font-serif text-2xl font-bold mb-6" style={{ color: "var(--cadc-blue)" }}>
            Agency Administration
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {agencyLeadership.map((s) => (
              <div key={s.id} className="rounded-xl border p-5 flex flex-col gap-1.5" style={{ borderColor: "#e5e7eb" }}>
                <p className="font-bold text-sm" style={{ color: "var(--cadc-blue)" }}>{s.name}</p>
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--cadc-maroon)" }}>{s.title}</p>
                {s.tenure && <p className="text-xs" style={{ color: "#9ca3af" }}>{s.tenure}</p>}
                {s.bio && <p className="text-xs leading-relaxed mt-1" style={{ color: "#374151" }}>{s.bio}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* Program directors */}
        <section aria-labelledby="directors-heading">
          <SectionLabel>Program Directors</SectionLabel>
          <h2 id="directors-heading" className="font-serif text-2xl font-bold mb-6" style={{ color: "var(--cadc-blue)" }}>
            Department Leadership
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {programDirectors.map((s) => (
              <div key={s.id} className="rounded-xl border p-5 flex flex-col gap-1.5" style={{ borderColor: "#e5e7eb" }}>
                <p className="font-bold text-sm" style={{ color: "var(--cadc-blue)" }}>{s.name}</p>
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--cadc-maroon)" }}>{s.title}</p>
                {s.tenure && <p className="text-xs" style={{ color: "#9ca3af" }}>{s.tenure}</p>}
                {s.bio && <p className="text-xs leading-relaxed mt-1" style={{ color: "#374151" }}>{s.bio}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* Board of Directors */}
        <section aria-labelledby="board-heading">
          <SectionLabel>Board of Directors</SectionLabel>
          <h2 id="board-heading" className="font-serif text-2xl font-bold mb-4" style={{ color: "var(--cadc-blue)" }}>
            Board Members
          </h2>
          <div
            className="rounded-2xl p-6 md:p-8"
            style={{ background: "var(--cadc-blue-light)" }}
          >
            <p className="text-sm leading-relaxed mb-4" style={{ color: "#374151" }}>
              The CADC Board of Directors provides organizational oversight, sets policy,
              and ensures the agency fulfills its mission across Southwest Oklahoma.
              A full board member directory is being added — contact the office for
              current board information.
            </p>
            <a
              href={contact.mainPhoneHref}
              className="inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: "var(--cadc-blue)" }}
            >
              📞 Call {contact.mainPhone}
            </a>
          </div>
        </section>

        {/* Agendas */}
        <section aria-labelledby="agendas-heading">
          <SectionLabel>Board Meetings</SectionLabel>
          <h2 id="agendas-heading" className="font-serif text-2xl font-bold mb-4" style={{ color: "var(--cadc-blue)" }}>
            Meeting Agendas & Schedule
          </h2>
          <div className="rounded-2xl border-2 border-dashed p-8 text-center" style={{ borderColor: "#c7d4e8" }}>
            <p className="text-sm font-semibold mb-1" style={{ color: "var(--cadc-blue)" }}>
              Agendas & Minutes
            </p>
            <p className="text-xs leading-relaxed mb-4" style={{ color: "#9ca3af" }}>
              Documents will appear here as they are posted by CADC staff.
              For the current meeting schedule, contact the office.
            </p>
            <a
              href={contact.mainPhoneHref}
              className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: "var(--cadc-blue)" }}
            >
              📞 {contact.mainPhone}
            </a>
          </div>
        </section>

        {/* Governance structure */}
        <section aria-labelledby="structure-heading">
          <SectionLabel>Governance</SectionLabel>
          <h2 id="structure-heading" className="font-serif text-2xl font-bold mb-6" style={{ color: "var(--cadc-blue)" }}>
            How CADC Is Governed
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: "🏛️", title: "Board of Directors", detail: "Provides organizational oversight, sets policy, and ensures the agency fulfills its mission across Southwest Oklahoma." },
              { icon: "👥", title: "Policy Council", detail: "Federal law requires parent and community involvement in key Head Start program decisions. One parent per center serves on the council." },
              { icon: "📋", title: "Community Accountability", detail: "As a Community Action Agency, CADC is accountable to the communities it serves." },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border p-6 flex flex-col gap-3" style={{ borderColor: "var(--cadc-blue-light)", background: "var(--cadc-blue-light)" }}>
                <span className="text-2xl" aria-hidden="true">{item.icon}</span>
                <p className="font-serif text-base font-bold" style={{ color: "var(--cadc-blue)" }}>{item.title}</p>
                <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Policy Council */}
        <section aria-labelledby="policy-council-heading" className="rounded-2xl p-6 md:p-8 border" style={{ borderColor: "var(--cadc-blue-light)" }}>
          <SectionLabel>Policy Council</SectionLabel>
          <h2 id="policy-council-heading" className="font-serif text-xl font-bold mb-3" style={{ color: "var(--cadc-blue)" }}>
            Parents at the Table
          </h2>
          <p className="text-sm leading-relaxed mb-3" style={{ color: "#374151" }}>
            The Head Start Policy Council is a federally required governance body made up of
            parents of currently enrolled Head Start children and community representatives.
            One parent from each Head Start center serves on the Policy Council.
          </p>
          <p className="text-sm leading-relaxed mb-5" style={{ color: "#374151" }}>
            Policy Council members participate in decisions about program planning, budget,
            hiring, and policy — giving families a real voice in the program that serves their children.
          </p>
          <a href={contact.mainPhoneHref} className="inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-2 hover:opacity-70" style={{ color: "var(--cadc-blue)" }}>
            Interested in serving on the Policy Council? Call us →
          </a>
        </section>

        {/* Annual report */}
        <section aria-labelledby="annual-heading">
          <SectionLabel>Transparency</SectionLabel>
          <h2 id="annual-heading" className="font-serif text-2xl font-bold mb-4" style={{ color: "var(--cadc-blue)" }}>Annual Report</h2>
          <div className="rounded-xl border p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4" style={{ borderColor: "#e5e7eb" }}>
            <div className="flex-1">
              <p className="font-semibold text-sm mb-1" style={{ color: "var(--cadc-blue)" }}>2024 Annual Report</p>
              <p className="text-xs leading-relaxed" style={{ color: "#6b7280" }}>CADC's full annual report — program outcomes, financials, and community impact.</p>
            </div>
            <a
              href="/docs/annual-report-2024.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 flex-shrink-0"
              style={{ background: "var(--cadc-maroon)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
              </svg>
              Download PDF
            </a>
          </div>
        </section>

        {/* Contact CTA */}
        <div className="cadc-grid-bg rounded-2xl overflow-hidden" style={{ background: "var(--cadc-blue)" }}>
          <div className="px-6 py-8 md:px-10 md:py-10 flex flex-col gap-4">
            <h2 className="font-serif text-2xl font-bold text-white">Questions About Governance?</h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--cadc-blue-light)" }}>
              Contact the CADC main office for board meeting dates, agenda requests,
              or information about serving on the Policy Council.
            </p>
            <a
              href={contact.mainPhoneHref}
              className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 w-full sm:w-auto"
              style={{ background: "var(--cadc-maroon)" }}
            >
              📞 Call {contact.mainPhone}
            </a>
          </div>
        </div>

        {/* Back nav */}
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
