import Link from "next/link";
import { programs, orgInfo } from "@/lib/programs";

export default function SiteFooter() {
  return (
    <footer className="bg-[var(--cadc-blue-dark)] text-white mt-24">
      <div className="mx-auto max-w-7xl px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div
            className="text-xl font-bold mb-2"
            style={{ fontFamily: "Georgia, serif" }}
          >
            CADC
          </div>
          <p className="text-sm text-white/70 leading-relaxed">
            {orgInfo.name}
            <br />
            {orgInfo.address}
          </p>
          <p className="text-sm text-white/70 mt-3">{orgInfo.serviceArea}</p>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-white/60 mb-3">
            Programs
          </h3>
          <ul className="space-y-2 text-sm">
            {programs.slice(0, 5).map((p) => (
              <li key={p.slug}>
                <Link href={p.href} className="text-white/80 hover:text-white">
                  {p.shortName}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-white/60 mb-3">
            More
          </h3>
          <ul className="space-y-2 text-sm">
            {programs.slice(5).map((p) => (
              <li key={p.slug}>
                <Link href={p.href} className="text-white/80 hover:text-white">
                  {p.shortName}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/locations" className="text-white/80 hover:text-white">
                Locations
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-white/60 mb-3">
            Ride the River
          </h3>
          <a
            href={`tel:${orgInfo.transitPhone.replace(/-/g, "")}`}
            className="text-lg font-bold text-white hover:underline"
          >
            {orgInfo.transitPhone}
          </a>
          <p className="text-sm text-white/70 mt-2">
            Transit service across 16 counties
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-4 text-xs text-white/50 flex flex-col sm:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} {orgInfo.name}</span>
          <span>An equal opportunity provider and employer</span>
        </div>
      </div>
    </footer>
  );
}
