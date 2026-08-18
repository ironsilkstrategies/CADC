import Link from "next/link";
import type { Metadata } from "next";
import { org, contact } from "@/lib/org";
import { agencyLeadership, programDirectors } from "@/lib/staff";

export const metadata: Metadata = {
  title: "About CADC | Community Action Development Corporation",
  description:
    "Community Action Development Corporation has served Southwest Oklahoma for decades — 9 programs, 16–17 counties, and a team committed to improving lives across the region.",
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--cadc-maroon)" }}>
      {children}
    </p>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="cadc-grid-bg py-14 md:py-20" style={{ background: "var(--cadc-blue)" }}>
        <div className="mx-auto max-w-4xl px-5 md:px-8">
          <h1 className="font-serif text-3xl md:text-5xl font-bold leading-tight mb-4 text-white">
            About CADC
          </h1>
          <p className="text-base md:text-lg leading-relaxed max-w-2xl" style={{ color: "var(--cadc-blue-light)" }}>
            {org.tagline} For decades, Community Action Development Corporation
            has worked to reduce poverty and expand opportunity across Southwest Oklahoma.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-5 md:px-8 py-10 md:py-14 flex flex-col gap-14">

        {/* Mission */}
        <section aria-labelledby="mission-heading">
          <SectionLabel>Mission</SectionLabel>
          <h2 id="mission-heading" className="font-serif text-2xl font-bold mb-5" style={{ color: "var(--cadc-blue)" }}>
            Why We Exist
          </h2>
          <p className="text-base leading-relaxed mb-4" style={{ color: "#374151" }}>
            Community Action Development Corporation is a Community Action Agency serving
            Southwest and Central Oklahoma. Our mission is to reduce poverty, revitalize
            low-income communities, and empower residents to achieve economic stability
            and self-sufficiency.
          </p>
          <p className="text-base leading-relaxed" style={{ color: "#374151" }}>
            We do this through nine programs — from early childhood education to rural
            transit to home weatherization — delivered by a team with deep roots in the
            communities we serve.
          </p>
        </section>

        {/* By the numbers */}
        <section aria-labelledby="numbers-heading">
          <SectionLabel>By the Numbers</SectionLabel>
          <h2 id="numbers-heading" className="font-serif text-2xl font-bold mb-6" style={{ color: "var(--cadc-blue)" }}>
            The Scale of What We Do
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { stat: "9", label: "Programs" },
              { stat: "13", label: "Head Start Centers" },
              { stat: "110", label: "Transit Vehicles" },
              { stat: "16–17", label: "Counties Served" },
            ].map(({ stat, label }) => (
              <div
                key={label}
                className="rounded-xl p-5 text-center"
                style={{ background: "var(--cadc-blue-light)" }}
              >
                <p className="font-serif text-3xl font-bold" style={{ color: "var(--cadc-blue)" }}>{stat}</p>
                <p className="text-xs font-semibold uppercase tracking-wide mt-1" style={{ color: "var(--cadc-ink-soft)" }}>{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What we do */}
        <section aria-labelledby="programs-heading">
          <SectionLabel>Our Work</SectionLabel>
          <h2 id="programs-heading" className="font-serif text-2xl font-bold mb-6" style={{ color: "var(--cadc-blue)" }}>
            Nine Programs, One Commitment
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { name: "Head Start & Early Head Start", href: "/programs/head-start", detail: "Free early childhood education at 13 centers across the region." },
              { name: "Red River Transportation", href: "/programs/transit", detail: "Rural public transit across 16 counties — 110 vehicles, ADA equipped." },
              { name: "Weatherization & Housing", href: "/programs/weatherization", detail: "Free home energy improvements for income-eligible households." },
              { name: "Senior Congregate Meals", href: "/programs/senior-meals", detail: "Hot meals and community connection at 14 sites plus home delivery." },
              { name: "VITA Tax Assistance", href: "/programs/tax-help", detail: "Free IRS-certified tax preparation — keep every dollar of your refund." },
              { name: "Community Market", href: "/programs/community-market", detail: "Expanding food access across Southwest Oklahoma." },
              { name: "Employment & Workforce", href: "/programs/employment", detail: "Open positions and workforce support across the region." },
              { name: "Board & Leadership", href: "/programs/board", detail: "Governance, agendas, and Policy Council information." },
            ].map((p) => (
              <Link
                key={p.name}
                href={p.href}
                className="flex flex-col gap-1 rounded-xl border p-5 transition-shadow hover:shadow-md"
                style={{ borderColor: "#e5e7eb" }}
              >
                <p className="font-semibold text-sm" style={{ color: "var(--cadc-blue)" }}>{p.name}</p>
                <p className="text-xs leading-relaxed" style={{ color: "#6b7280" }}>{p.detail}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Executive team */}
        <section aria-labelledby="team-heading">
          <SectionLabel>Our Team</SectionLabel>
          <h2 id="team-heading" className="font-serif text-2xl font-bold mb-6" style={{ color: "var(--cadc-blue)" }}>
            Executive Leadership
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
          <SectionLabel>Program Leadership</SectionLabel>
          <h2 id="directors-heading" className="font-serif text-2xl font-bold mb-6" style={{ color: "var(--cadc-blue)" }}>
            Department Directors
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

        {/* Contact CTA */}
        <div className="cadc-grid-bg rounded-2xl overflow-hidden" style={{ background: "var(--cadc-blue)" }}>
          <div className="px-6 py-8 md:px-10 md:py-10 flex flex-col gap-4">
            <h2 className="font-serif text-2xl font-bold text-white">Get in Touch</h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--cadc-blue-light)" }}>
              {contact.address.street}, {contact.address.city}, {contact.address.state} {contact.address.zip}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={contact.mainPhoneHref}
                className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: "var(--cadc-maroon)" }}
              >
                📞 {contact.mainPhone}
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-lg border px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                style={{ borderColor: "rgba(255,255,255,0.35)" }}
              >
                Contact Page →
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
