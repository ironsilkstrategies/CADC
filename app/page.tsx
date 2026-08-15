import OrbitHero from "@/components/OrbitHero";
import ProgramGrid from "@/components/ProgramGrid";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <OrbitHero />

      {/* Stats bar */}
      <section className="bg-[var(--cadc-blue)] text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            ["9", "Programs"],
            ["13", "Head Start Centers"],
            ["110", "Transit Vehicles"],
            ["16–17", "Counties Served"],
          ].map(([num, label]) => (
            <div key={label}>
              <div className="text-3xl md:text-4xl font-bold">{num}</div>
              <div className="text-xs md:text-sm text-white/70 uppercase tracking-wide mt-1">
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <ProgramGrid />

      {/* Head Start CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="bg-[var(--cadc-blue-light)] rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center gap-6 justify-between">
          <div>
            <p className="text-xs font-bold text-[var(--cadc-maroon)] uppercase tracking-wide mb-1">
              Most requested
            </p>
            <h2 className="text-xl md:text-2xl font-bold text-[var(--cadc-blue)]">
              Enroll your child in Head Start today
            </h2>
            <p className="text-[var(--cadc-ink-soft)] mt-1 max-w-lg">
              Free early childhood education across 13 centers. Applications open
              year-round.
            </p>
          </div>
          <Link
            href="/programs/head-start"
            className="shrink-0 px-6 py-3 rounded-lg bg-[var(--cadc-maroon)] text-white font-bold hover:bg-[var(--cadc-maroon-dark)] transition-colors"
          >
            Start Enrollment →
          </Link>
        </div>
      </section>
    </>
  );
}
