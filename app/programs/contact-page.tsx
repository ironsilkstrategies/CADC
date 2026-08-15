import type { Metadata } from "next";
import { org, contact } from "@/lib/org";
import { transitOffices, headStartCenters } from "@/lib/locations";

export const metadata: Metadata = {
  title: "Contact CADC | Community Action Development Corporation",
  description:
    "Contact Community Action Development Corporation. Main office in Frederick, OK. Serving 16–17 counties across Southwest Oklahoma.",
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--cadc-maroon)" }}>
      {children}
    </p>
  );
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="cadc-grid-bg py-14 md:py-20" style={{ background: "var(--cadc-blue)" }}>
        <div className="mx-auto max-w-4xl px-5 md:px-8">
          <h1 className="font-serif text-3xl md:text-5xl font-bold leading-tight mb-4 text-white">
            Contact Us
          </h1>
          <p className="text-base md:text-lg leading-relaxed max-w-2xl" style={{ color: "var(--cadc-blue-light)" }}>
            We're here to help. Reach out by phone, visit a location near you,
            or connect with us on social media.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-5 md:px-8 py-10 md:py-14 flex flex-col gap-14">

        {/* Primary contact */}
        <section aria-labelledby="primary-heading">
          <SectionLabel>Main Office</SectionLabel>
          <h2 id="primary-heading" className="font-serif text-2xl font-bold mb-6" style={{ color: "var(--cadc-blue)" }}>
            {org.legalName}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href={contact.mainPhoneHref}
              className="cadc-grid-bg flex flex-col gap-2 rounded-xl p-6 transition-opacity hover:opacity-90"
              style={{ background: "var(--cadc-blue)" }}
            >
              <span className="text-2xl" aria-hidden="true">📞</span>
              <p className="text-xs font-bold uppercase tracking-widest text-white opacity-70">Main Phone</p>
              <p className="font-serif text-xl font-bold text-white">{contact.mainPhone}</p>
              <p className="text-xs text-white opacity-60">Tap to call</p>
            </a>

            <div className="flex flex-col gap-2 rounded-xl border p-6" style={{ borderColor: "#e5e7eb" }}>
              <span className="text-2xl" aria-hidden="true">📍</span>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--cadc-maroon)" }}>Address</p>
              <p className="font-semibold text-sm" style={{ color: "var(--cadc-blue)" }}>
                {contact.address.street}<br />
                {contact.address.city}, {contact.address.state} {contact.address.zip}
              </p>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(`${contact.address.street}, ${contact.address.city}, ${contact.address.state} ${contact.address.zip}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold underline underline-offset-2 hover:opacity-70 mt-1"
                style={{ color: "var(--cadc-blue)" }}
              >
                Open in Maps →
              </a>
            </div>
          </div>
        </section>

        {/* Transit — toll-free always visible */}
        <section aria-labelledby="transit-heading">
          <SectionLabel>Red River Transportation</SectionLabel>
          <h2 id="transit-heading" className="font-serif text-2xl font-bold mb-4" style={{ color: "var(--cadc-blue)" }}>
            Book a Ride
          </h2>
          <a
            href={contact.transitPhoneHref}
            className="cadc-grid-bg flex items-center gap-5 rounded-xl p-6 transition-opacity hover:opacity-90"
            style={{ background: "var(--cadc-blue)" }}
          >
            <span className="text-3xl" aria-hidden="true">🚌</span>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white opacity-70 mb-1">Toll-Free</p>
              <p className="font-serif text-2xl font-bold text-white">{contact.transitPhone}</p>
              <p className="text-xs text-white opacity-60 mt-0.5">Ride the River — tap to call</p>
            </div>
          </a>
        </section>

        {/* Social */}
        <section aria-labelledby="social-heading">
          <SectionLabel>Social Media</SectionLabel>
          <h2 id="social-heading" className="font-serif text-2xl font-bold mb-6" style={{ color: "var(--cadc-blue)" }}>
            Follow CADC
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: "Facebook", handle: "@WeAreCADC", href: contact.social.facebook, icon: "📘", detail: "Program updates, job openings, and community news" },
              { name: "Instagram", handle: "@wearecadc", href: contact.social.instagram, icon: "📸", detail: "Photos and stories from across our programs" },
            ].map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 rounded-xl border p-5 transition-shadow hover:shadow-md"
                style={{ borderColor: "#e5e7eb" }}
              >
                <span className="text-2xl" aria-hidden="true">{s.icon}</span>
                <div>
                  <p className="font-bold text-sm" style={{ color: "var(--cadc-blue)" }}>{s.name}</p>
                  <p className="text-xs font-semibold" style={{ color: "var(--cadc-maroon)" }}>{s.handle}</p>
                  <p className="text-xs leading-relaxed mt-1" style={{ color: "#6b7280" }}>{s.detail}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Transit offices */}
        <section aria-labelledby="transit-offices-heading">
          <SectionLabel>Transportation Offices</SectionLabel>
          <h2 id="transit-offices-heading" className="font-serif text-2xl font-bold mb-6" style={{ color: "var(--cadc-blue)" }}>
            Red River Transit Locations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {transitOffices.map((loc) => (
              <div key={loc.id} className="rounded-xl border p-5 flex flex-col gap-1.5" style={{ borderColor: "#e5e7eb" }}>
                <p className="font-semibold text-sm" style={{ color: "var(--cadc-blue)" }}>{loc.name}</p>
                <p className="text-xs" style={{ color: "#6b7280" }}>{loc.street}, {loc.city}, {loc.state} {loc.zip}</p>
                <a href={loc.phoneHref} className="text-xs font-semibold mt-1 hover:underline" style={{ color: "var(--cadc-blue)" }}>{loc.phone}</a>
              </div>
            ))}
          </div>
        </section>

        {/* Head Start offices quick reference */}
        <section aria-labelledby="hs-offices-heading">
          <SectionLabel>Head Start Centers</SectionLabel>
          <h2 id="hs-offices-heading" className="font-serif text-2xl font-bold mb-6" style={{ color: "var(--cadc-blue)" }}>
            All 13 Locations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {headStartCenters.map((loc) => (
              <div key={loc.id} className="rounded-xl border p-4 flex flex-col gap-1" style={{ borderColor: "#e5e7eb" }}>
                <p className="font-semibold text-xs" style={{ color: "var(--cadc-blue)" }}>{loc.name}</p>
                <p className="text-xs" style={{ color: "#6b7280" }}>{loc.city}, {loc.state}</p>
                <a href={loc.phoneHref} className="text-xs font-semibold hover:underline" style={{ color: "var(--cadc-blue)" }}>{loc.phone}</a>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
