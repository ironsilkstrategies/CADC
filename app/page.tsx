import HomeExperience from "@/components/HomeExperience";
import ProgramGrid from "@/components/ProgramGrid";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Full-screen interactive hero */}
      <HomeExperience />

      {/* Stats bar */}
      <section className="bg-[var(--cadc-blue)] text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            ["9", "Programs"],
            ["13", "Head Start Centers"],
            ["110", "Transit Vehicles"],
            ["9", "Counties Served"],
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

      {/* Program grid */}
      <ProgramGrid />

      {/* Head Start CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div
          className="rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center gap-6 justify-between"
          style={{ background: "var(--cadc-blue-light)" }}
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: "var(--cadc-maroon)" }}>
              Most requested
            </p>
            <h2 className="text-xl md:text-2xl font-bold" style={{ color: "var(--cadc-blue)" }}>
              Enroll your child in Head Start today
            </h2>
            <p className="mt-1 max-w-lg" style={{ color: "var(--cadc-ink-soft)" }}>
              Free early childhood education across 13 centers. Applications open year-round.
            </p>
          </div>
          <Link
            href="/programs/head-start"
            className="shrink-0 px-6 py-3 rounded-lg font-bold text-white transition-colors hover:opacity-90"
            style={{ background: "var(--cadc-maroon)" }}
          >
            Start Enrollment →
          </Link>
        </div>
      </section>
    </>
  );
}
