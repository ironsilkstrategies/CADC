import Link from "next/link";
import type { Metadata } from "next";
import { contact } from "@/lib/org";

export const metadata: Metadata = {
  title: "Senior Congregate Meals | CADC Southwest Oklahoma",
  description:
    "Hot meals and community at sites across Southwest Oklahoma, plus Advantage home delivery for older adults who can't travel. Free to eligible seniors.",
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--cadc-maroon)" }}>
      {children}
    </p>
  );
}

function ContactCTA() {
  return (
    <div className="cadc-grid-bg rounded-2xl overflow-hidden" style={{ background: "var(--cadc-blue)" }}>
      <div className="px-6 py-8 md:px-10 md:py-10 flex flex-col gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2 opacity-70" style={{ color: "var(--cadc-blue-light)" }}>
            Find a Meal Site
          </p>
          <h2 className="font-serif text-2xl md:text-3xl font-bold leading-tight text-white">
            Find Your Nearest Site
          </h2>
          <p className="mt-3 text-sm md:text-base leading-relaxed" style={{ color: "var(--cadc-blue-light)" }}>
            Call us and we'll connect you with the nearest congregate meal site
            or arrange Advantage home delivery if you're unable to travel.
          </p>
        </div>
        <a
          href={contact.mainPhoneHref}
          className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 w-full sm:w-auto"
          style={{ background: "var(--cadc-maroon)" }}
        >
          📞 Call {contact.mainPhone}
        </a>
      </div>
    </div>
  );
}

export default function SeniorMealsPage() {
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
            Senior Congregate Meals
          </h1>
          <p className="text-base md:text-lg leading-relaxed max-w-2xl" style={{ color: "var(--cadc-blue-light)" }}>
            Hot meals and community connection at sites across Southwest Oklahoma.
            Home delivery available for older adults who can't travel.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-5 md:px-8 py-10 md:py-14 flex flex-col gap-14">

        <ContactCTA />

        {/* Two programs */}
        <section aria-labelledby="programs-heading">
          <SectionLabel>How We Serve</SectionLabel>
          <h2 id="programs-heading" className="font-serif text-2xl font-bold mb-6" style={{ color: "var(--cadc-blue)" }}>
            Two Ways to Get a Hot Meal
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                label: "Congregate Meals",
                icon: "🍽️",
                detail:
                  "Enjoy a hot, nutritious meal alongside neighbors at one of our community sites. Meals bring people together — it's food and connection in one place.",
              },
              {
                label: "Advantage Home Delivery",
                icon: "🚗",
                detail:
                  "Can't make it to a site? Advantage home delivery brings hot meals directly to eligible seniors who are homebound or unable to travel.",
              },
            ].map((g) => (
              <div
                key={g.label}
                className="rounded-xl border p-6 flex flex-col gap-3"
                style={{ borderColor: "var(--cadc-blue-light)", background: "var(--cadc-blue-light)" }}
              >
                <span className="text-3xl" aria-hidden="true">{g.icon}</span>
                <p className="font-serif text-lg font-bold" style={{ color: "var(--cadc-blue)" }}>{g.label}</p>
                <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>{g.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What's included */}
        <section aria-labelledby="included-heading">
          <SectionLabel>What to Expect</SectionLabel>
          <h2 id="included-heading" className="font-serif text-2xl font-bold mb-6" style={{ color: "var(--cadc-blue)" }}>
            More Than Just a Meal
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "Hot, nutritious meals meeting dietary guidelines",
              "Social connection and community",
              "Friendly, welcoming environment",
              "Home delivery for homebound seniors",
              "Outreach support across 5 counties",
              "Regular contact and wellness checks",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-relaxed" style={{ color: "#374151" }}>
                <span
                  className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: "var(--cadc-blue)", minWidth: "1.25rem" }}
                  aria-hidden="true"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Sites — placeholder until verified */}
        <section
          aria-labelledby="sites-heading"
          className="rounded-2xl p-6 md:p-8"
          style={{ background: "var(--cadc-blue-light)" }}
        >
          <SectionLabel>Locations</SectionLabel>
          <h2 id="sites-heading" className="font-serif text-2xl font-bold mb-3" style={{ color: "var(--cadc-blue)" }}>
            14 Meal Sites Across the Region
          </h2>
          <p className="text-sm leading-relaxed mb-6" style={{ color: "#374151" }}>
            We operate 14 congregate meal sites across Southwest Oklahoma.
            A full site directory with addresses and serving times is being added now.
            In the meantime, call us and we'll find your nearest location immediately.
          </p>
          <a
            href={contact.mainPhoneHref}
            className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--cadc-blue)" }}
          >
            📞 {contact.mainPhone} — Find a site near you
          </a>
        </section>

        {/* Eligibility */}
        <section aria-labelledby="eligibility-heading">
          <SectionLabel>Who Can Participate</SectionLabel>
          <h2 id="eligibility-heading" className="font-serif text-2xl font-bold mb-6" style={{ color: "var(--cadc-blue)" }}>
            Open to Older Adults Across Our Region
          </h2>
          <div className="flex flex-col gap-4">
            {[
              { label: "Age", detail: "Adults 60 years of age and older" },
              { label: "Spouses", detail: "Spouses of eligible participants may also receive meals regardless of age" },
              { label: "Home delivery", detail: "Homebound seniors or those unable to travel to a site may qualify for Advantage home delivery" },
              { label: "Area", detail: "Must reside within CADC's service area — call to confirm your county" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex gap-4 items-start pb-4 border-b last:border-b-0 last:pb-0"
                style={{ borderColor: "var(--cadc-border)" }}
              >
                <span
                  className="flex-shrink-0 rounded-lg px-2 py-1 text-xs font-bold uppercase tracking-wide text-white"
                  style={{ background: "var(--cadc-blue)" }}
                >
                  {item.label}
                </span>
                <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <ContactCTA />

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
