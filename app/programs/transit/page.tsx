"use client";

import { useState } from "react";
import Link from "next/link";
import { contact, complianceDocs } from "@/lib/org";
import { transitOffices } from "@/lib/locations";
import {
  standardFares,
  reducedFares,
  quoteFare,
  formatUSD,
  fareNotes,
  fleet,
  reducedEligibilityNote,
  type RiderType,
} from "@/lib/fares";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--cadc-maroon)" }}>
      {children}
    </p>
  );
}

function FareCalculator() {
  const [miles, setMiles] = useState("");
  const [rider, setRider] = useState<RiderType>("standard");
  const mileNum = parseFloat(miles);
  const quote = quoteFare(mileNum, rider);

  return (
    <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "var(--cadc-blue-light)" }}>
      {/* Header */}
      <div className="px-6 py-5" style={{ background: "var(--cadc-blue)" }}>
        <p className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-1" style={{ color: "var(--cadc-blue-light)" }}>
          Fare Calculator
        </p>
        <h2 className="font-serif text-xl font-bold text-white">Estimate Your Fare</h2>
        <p className="text-xs mt-1 opacity-70" style={{ color: "var(--cadc-blue-light)" }}>
          Based on round-trip mileage
        </p>
      </div>

      {/* Inputs */}
      <div className="px-6 py-6 flex flex-col gap-5 bg-white">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: "var(--cadc-ink)" }}>
            Round-trip miles
          </label>
          <input
            type="number"
            inputMode="decimal"
            min="1"
            placeholder="e.g. 45"
            value={miles}
            onChange={(e) => setMiles(e.target.value)}
            className="w-full rounded-lg border px-4 py-3 text-base focus:outline-none focus:ring-2"
            style={{
              borderColor: "var(--cadc-border)",
              color: "var(--cadc-ink)",
              // @ts-ignore
              "--tw-ring-color": "var(--cadc-blue)",
            }}
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: "var(--cadc-ink)" }}>
            Rider type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(["standard", "reduced"] as RiderType[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRider(r)}
                className="rounded-lg border px-4 py-3 text-sm font-semibold transition-all"
                style={{
                  borderColor: rider === r ? "var(--cadc-blue)" : "var(--cadc-border)",
                  background: rider === r ? "var(--cadc-blue)" : "white",
                  color: rider === r ? "white" : "var(--cadc-ink)",
                }}
              >
                {r === "standard" ? "General Public" : "Seniors 55+ / Disabled"}
              </button>
            ))}
          </div>
          {rider === "reduced" && (
            <p className="mt-2 text-xs leading-relaxed" style={{ color: "#6b7280" }}>
              {reducedEligibilityNote}
            </p>
          )}
        </div>

        {/* Result */}
        {quote ? (
          <div className="rounded-xl p-5 text-center" style={{ background: "var(--cadc-blue-light)" }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--cadc-maroon)" }}>
              Estimated fare
            </p>
            <p className="font-serif text-4xl font-bold" style={{ color: "var(--cadc-blue)" }}>
              {formatUSD(quote.amount)}
              {quote.isPerMile && <span className="text-lg font-sans font-normal"> total</span>}
            </p>
            <p className="text-xs mt-1" style={{ color: "#6b7280" }}>
              {quote.band.label} · {rider === "reduced" ? "reduced rate" : "standard rate"}
            </p>
          </div>
        ) : miles && mileNum <= 0 ? (
          <p className="text-sm text-center" style={{ color: "var(--cadc-maroon)" }}>
            Enter a valid mileage above
          </p>
        ) : null}

        <a
          href={contact.transitPhoneHref}
          className="flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
          style={{ background: "var(--cadc-maroon)" }}
        >
          📞 Book a Ride — {contact.transitPhone}
        </a>

        <p className="text-[0.65rem] leading-relaxed text-center" style={{ color: "#9ca3af" }}>
          {fareNotes.join(" · ")}
        </p>
      </div>
    </div>
  );
}

export default function TransitPage() {
  const transitDocs = complianceDocs.filter((d) => d.program === "transit");

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

          <div className="inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider text-white mb-4" style={{ background: "var(--cadc-maroon)" }}>
            Ride the River
          </div>

          <h1 className="font-serif text-3xl md:text-5xl font-bold leading-tight mb-4 text-white">
            Red River Transportation
          </h1>
          <p className="text-base md:text-lg leading-relaxed max-w-2xl mb-8" style={{ color: "var(--cadc-blue-light)" }}>
            Rural public transit across {fleet.counties} counties with a fleet of {fleet.vehicles} vehicles.
            Rides to medical appointments, dialysis, work, shopping, and more.
            Every vehicle is ADA lift or ramp equipped.
          </p>

          <a
            href={contact.transitPhoneHref}
            className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--cadc-maroon)" }}
          >
            📞 Call Toll-Free: {contact.transitPhone}
          </a>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-5 md:px-8 py-10 md:py-14 flex flex-col gap-14">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { num: fleet.vehicles.toString(), label: "Vehicles" },
            { num: fleet.counties.toString(), label: "Counties" },
            { num: "ADA", label: "All vehicles equipped" },
          ].map(({ num, label }) => (
            <div key={label} className="rounded-xl p-5 text-center" style={{ background: "var(--cadc-blue-light)" }}>
              <p className="font-serif text-2xl font-bold" style={{ color: "var(--cadc-blue)" }}>{num}</p>
              <p className="text-xs font-semibold uppercase tracking-wide mt-1" style={{ color: "var(--cadc-ink-soft)" }}>{label}</p>
            </div>
          ))}
        </div>

        {/* What we serve */}
        <section aria-labelledby="services-heading">
          <SectionLabel>Where We Take You</SectionLabel>
          <h2 id="services-heading" className="font-serif text-2xl font-bold mb-6" style={{ color: "var(--cadc-blue)" }}>
            Rides That Matter
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "Medical appointments & specialist visits",
              "Dialysis treatment",
              "Work sites & employment",
              "Shopping & errands",
              "Education & training programs",
              "Recreation & social events",
              "Oklahoma City, Lawton & other destinations",
              "Connections to bus, rail, and air travel",
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

        {/* Fare calculator */}
        <section aria-labelledby="fares-heading">
          <SectionLabel>Fares</SectionLabel>
          <h2 id="fares-heading" className="font-serif text-2xl font-bold mb-6" style={{ color: "var(--cadc-blue)" }}>
            How Much Does It Cost?
          </h2>
          <FareCalculator />
        </section>

        {/* Full fare table */}
        <section aria-labelledby="fare-table-heading">
          <SectionLabel>Full Fare Schedule</SectionLabel>
          <h2 id="fare-table-heading" className="font-serif text-xl font-bold mb-4" style={{ color: "var(--cadc-blue)" }}>
            Inter-City Rates
          </h2>
          <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "#e5e7eb" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--cadc-blue-light)" }}>
                  <th className="text-left px-4 py-3 font-bold text-xs uppercase tracking-wide" style={{ color: "var(--cadc-blue)" }}>Distance</th>
                  <th className="text-right px-4 py-3 font-bold text-xs uppercase tracking-wide" style={{ color: "var(--cadc-blue)" }}>General Public</th>
                  <th className="text-right px-4 py-3 font-bold text-xs uppercase tracking-wide" style={{ color: "var(--cadc-blue)" }}>Seniors 55+ / Disabled</th>
                </tr>
              </thead>
              <tbody>
                {standardFares.map((band, i) => (
                  <tr key={band.label} className={i % 2 === 0 ? "bg-white" : ""} style={i % 2 !== 0 ? { background: "#fafafa" } : {}}>
                    <td className="px-4 py-3 font-medium" style={{ color: "var(--cadc-ink)" }}>{band.label}</td>
                    <td className="px-4 py-3 text-right" style={{ color: "var(--cadc-ink)" }}>
                      {band.flat !== null ? formatUSD(band.flat) : `$${band.perMile}/mi`}
                    </td>
                    <td className="px-4 py-3 text-right" style={{ color: "var(--cadc-ink)" }}>
                      {reducedFares[i].flat !== null ? formatUSD(reducedFares[i].flat!) : `$${reducedFares[i].perMile}/mi`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs" style={{ color: "#6b7280" }}>
            Fares calculated on round-trip mileage. Wait time charged at $10.00/hour after the first hour.
          </p>
        </section>

        {/* Offices */}
        <section aria-labelledby="offices-heading">
          <SectionLabel>Where We Are</SectionLabel>
          <h2 id="offices-heading" className="font-serif text-2xl font-bold mb-6" style={{ color: "var(--cadc-blue)" }}>
            Transportation Offices
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {transitOffices.map((loc) => (
              <div key={loc.id} className="rounded-xl border p-5 flex flex-col gap-1.5" style={{ borderColor: "#e5e7eb" }}>
                <p className="font-semibold text-sm" style={{ color: "var(--cadc-blue)" }}>{loc.name}</p>
                <p className="text-xs leading-relaxed" style={{ color: "#6b7280" }}>{loc.street}</p>
                <p className="text-xs" style={{ color: "#6b7280" }}>{loc.city}, {loc.state} {loc.zip}</p>
                <a href={loc.phoneHref} className="text-xs font-semibold mt-1 hover:underline" style={{ color: "var(--cadc-blue)" }}>
                  {loc.phone}
                </a>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm font-semibold" style={{ color: "var(--cadc-ink-soft)" }}>
            Or call toll-free:{" "}
            <a href={contact.transitPhoneHref} className="underline underline-offset-2" style={{ color: "var(--cadc-blue)" }}>
              {contact.transitPhone}
            </a>
          </p>
        </section>

        {/* Compliance docs — FTA required */}
        <section aria-labelledby="docs-heading">
          <SectionLabel>Policies & Rights</SectionLabel>
          <h2 id="docs-heading" className="font-serif text-xl font-bold mb-4" style={{ color: "var(--cadc-blue)" }}>
            Title VI & ADA Documents
          </h2>
          <div className="flex flex-col gap-2">
            {transitDocs.map((doc) => (
              <a
                key={doc.label}
                href={doc.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-2 hover:opacity-70 transition-opacity"
                style={{ color: "var(--cadc-blue)" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                </svg>
                {doc.label}
              </a>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed" style={{ color: "#9ca3af" }}>
            Red River Transportation operates in compliance with Title VI of the Civil Rights Act of 1964
            and the Americans with Disabilities Act. All vehicles are ADA lift or ramp equipped.
          </p>
        </section>

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
