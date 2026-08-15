import Link from "next/link";
import { programs, programHref } from "@/lib/programs";

export default function ProgramGrid() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-12 md:py-16">
      <p className="mb-2 text-center text-[0.65rem] font-bold uppercase tracking-widest text-[var(--cadc-maroon)]">
        What We Do
      </p>
      <h2 className="mb-10 text-center font-serif text-2xl font-bold text-[var(--cadc-blue)] md:text-3xl">
        9 Programs. One Mission.
      </h2>

      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3">
        {programs.map((p) => (
          <li key={p.slug}>
            <Link
              href={programHref(p.slug)}
              className="group flex h-full flex-col items-center gap-3 rounded-xl border border-[var(--cadc-border)] bg-white p-5 text-center transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[var(--cadc-maroon)]"
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[var(--cadc-blue)] text-2xl transition-colors group-hover:border-[var(--cadc-maroon)]"
                aria-hidden="true"
              >
                {p.icon}
              </span>
              <span className="font-semibold leading-tight text-[var(--cadc-blue)] transition-colors group-hover:text-[var(--cadc-maroon)]">
                {p.shortName}
              </span>
              <span className="text-xs leading-relaxed text-[var(--cadc-ink-soft)]">
                {p.blurb}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
