import { notFound } from "next/navigation";
import Link from "next/link";
import { programs, getProgram, allProgramSlugs, programHref } from "@/lib/programs";
import type { ProgramSlug } from "@/lib/programs";

export async function generateStaticParams() {
  return allProgramSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = getProgram(slug as ProgramSlug);
  if (!program) return {};
  return {
    title: `${program.name} | CADC Southwest Oklahoma`,
    description: program.blurb,
  };
}

export default async function ProgramPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = getProgram(slug as ProgramSlug);
  if (!program) notFound();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section
        className="cadc-grid-bg py-14 md:py-20"
        style={{ background: "var(--cadc-blue)" }}
      >
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

          <div className="flex items-center gap-3 mb-5">
            <span className="text-4xl" aria-hidden="true">{program.icon}</span>
          </div>

          <h1
            className="font-serif text-3xl md:text-5xl font-bold leading-tight mb-4 text-white"
          >
            {program.name}
          </h1>
          <p className="text-base md:text-lg leading-relaxed max-w-2xl" style={{ color: "var(--cadc-blue-light)" }}>
            {program.blurb}
          </p>

          {program.cta && (
            <div className="mt-8">
              <a
                href={program.cta.href}
                target={program.cta.external ? "_blank" : undefined}
                rel={program.cta.external ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm text-white transition-opacity hover:opacity-90"
                style={{ background: "var(--cadc-maroon)" }}
              >
                {program.cta.label}
                <span aria-hidden="true">→</span>
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Content placeholder — replaced per program as pages are built */}
      <section className="mx-auto max-w-4xl px-5 md:px-8 py-14">
        <div
          className="rounded-2xl p-8 text-center"
          style={{ background: "var(--cadc-blue-light)" }}
        >
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--cadc-maroon)" }}>
            Full page coming soon
          </p>
          <p className="text-base leading-relaxed mb-6" style={{ color: "var(--cadc-ink)" }}>
            Detailed information, locations, and resources for {program.name} are being added now.
            For immediate assistance, contact CADC directly.
          </p>
          <a
            href="tel:+15803355588"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--cadc-blue)" }}
          >
            📞 Call 580-335-5588
          </a>
        </div>
      </section>

      {/* Other programs */}
      <section className="mx-auto max-w-4xl px-5 md:px-8 pb-16">
        <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--cadc-ink-soft)" }}>
          Other programs
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {programs
            .filter((p) => p.slug !== program.slug)
            .slice(0, 8)
            .map((p) => (
              <Link
                key={p.slug}
                href={programHref(p.slug)}
                className="flex flex-col items-center gap-2 rounded-xl border p-4 text-center text-sm font-semibold transition-shadow hover:shadow-md"
                style={{ borderColor: "var(--cadc-border)", color: "var(--cadc-blue)" }}
              >
                <span className="text-2xl" aria-hidden="true">{p.icon}</span>
                {p.shortName}
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
