import Link from "next/link";
import { programs } from "@/lib/programs";
import { org, contact } from "@/lib/org";

export default function SiteFooter() {
  return (
    <footer
      className="cadc-grid-bg border-t border-[var(--cadc-border)] bg-[var(--cadc-blue)] text-white"
    >
      <div className="mx-auto max-w-5xl px-5 py-10 md:py-14">
        {/* Top row */}
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          {/* Identity */}
          <div className="flex flex-col gap-2">
            <p className="font-serif text-xl font-bold tracking-wide">
              {org.shortName}
            </p>
            <p className="text-[0.78rem] uppercase tracking-widest opacity-70">
              {org.legalName}
            </p>
            <p className="mt-1 text-sm italic opacity-80">{org.tagline}</p>
          </div>

          {/* Programs */}
          <nav aria-label="Programs">
            <p className="mb-3 text-[0.65rem] font-bold uppercase tracking-widest opacity-60">
              Programs
            </p>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-1.5">
              {programs.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/programs/${p.slug}`}
                    className="text-sm opacity-80 transition-opacity hover:opacity-100"
                  >
                    {p.shortName}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="flex flex-col gap-2">
            <p className="mb-1 text-[0.65rem] font-bold uppercase tracking-widest opacity-60">
              Contact
            </p>
            <a
              href={contact.mainPhoneHref}
              className="text-sm opacity-80 transition-opacity hover:opacity-100"
            >
              {contact.mainPhone}
            </a>
            <p className="text-sm opacity-80">
              {contact.address.street}<br />
              {contact.address.city}, {contact.address.state} {contact.address.zip}
            </p>
            <div className="mt-2 flex gap-4">
              <a
                href={contact.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm opacity-70 transition-opacity hover:opacity-100"
              >
                Facebook
              </a>
              <a
                href={contact.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm opacity-70 transition-opacity hover:opacity-100"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-white/20 pt-6 text-center text-[0.7rem] opacity-50">
          © {new Date().getFullYear()} {org.legalName} · {org.domain}
        </div>
      </div>
    </footer>
  );
}
