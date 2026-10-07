"use client";

import Link from "next/link";
import CADCShell from "@/components/CADCShell";
import { contact } from "@/lib/org";

const BLUE = "#0101FF";
const RED = "#CC0000";
const INK = "#111827";
const BODY = "#1F2937";

const ROLES = [
  { icon: "🏫", title: "Head Start & Early Head Start", detail: "Teachers, classroom aides, family service workers, cooks, and center staff across our 11 centers." },
  { icon: "🚌", title: "Red River Transportation", detail: "Drivers, dispatch, and maintenance for a 12-county public transit system." },
  { icon: "🏠", title: "Weatherization & Housing", detail: "Field crew, energy auditors, and housing staff improving homes across the region." },
  { icon: "🍽️", title: "Senior Nutrition & Advantage", detail: "Kitchen staff, site managers, and meal delivery support for seniors." },
  { icon: "🛒", title: "Community Market", detail: "Mobile market staff bringing groceries to rural communities." },
  { icon: "🏛️", title: "Administration", detail: "Finance, HR, purchasing, and program support at our Frederick office." },
];

export default function JoinOurTeamPage() {
  return (
    <CADCShell>
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px 80px", color: INK }}>

        <p style={{ color: RED, fontSize: 14, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 10 }}>Join Our Team</p>
        <h1 style={{ color: BLUE, fontSize: "clamp(2rem,4vw,2.8rem)", fontWeight: 800, lineHeight: 1.1, margin: "0 0 14px", fontFamily: "'Space Grotesk', sans-serif" }}>
          Work that changes lives — close to home.
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.7, color: BODY, maxWidth: 680, margin: "0 0 28px" }}>
          CADC employs more than 200 people across 9 counties in Southwest Oklahoma. Every role here connects directly to families, children, and seniors in the communities we serve.
        </p>

        {/* Openings */}
        <section aria-labelledby="openings" style={{ background: BLUE, borderRadius: 18, padding: "28px 28px", color: "white", marginBottom: 40 }}>
          <h2 id="openings" style={{ fontSize: 24, fontWeight: 800, margin: "0 0 8px" }}>Current Openings</h2>
          <p style={{ fontSize: 17, lineHeight: 1.6, margin: "0 0 20px", color: "rgba(255,255,255,0.92)" }}>
            Open positions are posted on our Facebook page. Call our office to ask about a position or request an application.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <a href={contact.social.facebook} target="_blank" rel="noopener noreferrer"
              style={{ background: "white", color: BLUE, padding: "14px 22px", borderRadius: 10, fontWeight: 800, fontSize: 17, textDecoration: "none" }}>
              View Openings on Facebook →
            </a>
            <a href="tel:+15803355588"
              style={{ background: RED, color: "white", padding: "14px 22px", borderRadius: 10, fontWeight: 800, fontSize: 17, textDecoration: "none" }}>
              📞 580-335-5588
            </a>
          </div>
        </section>

        {/* Where you might fit */}
        <section aria-labelledby="roles" style={{ marginBottom: 40 }}>
          <h2 id="roles" style={{ color: BLUE, fontSize: 26, fontWeight: 800, margin: "0 0 16px" }}>Where You Might Fit</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
            {ROLES.map(r => (
              <div key={r.title} style={{ background: "white", border: "1.5px solid #E4E4FF", borderRadius: 14, padding: "18px 20px" }}>
                <div style={{ fontSize: 30, marginBottom: 6 }} aria-hidden="true">{r.icon}</div>
                <p style={{ fontWeight: 800, fontSize: 18, color: INK, margin: "0 0 6px" }}>{r.title}</p>
                <p style={{ fontSize: 16, lineHeight: 1.6, color: BODY, margin: 0 }}>{r.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contacts */}
        <section aria-labelledby="contacts" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14, marginBottom: 40 }}>
          <h2 id="contacts" style={{ position: "absolute", left: -9999 }}>Hiring contacts</h2>
          <div style={{ background: "#F0F0FF", borderRadius: 14, padding: "20px 22px" }}>
            <p style={{ color: RED, fontSize: 13, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 6px" }}>Human Resources</p>
            <p style={{ fontWeight: 800, fontSize: 19, margin: "0 0 6px" }}>Suzie Fletcher</p>
            <a href="mailto:sfletcher@cadcok.org" style={{ display: "block", color: BLUE, fontWeight: 700, fontSize: 17, marginBottom: 4 }}>sfletcher@cadcok.org</a>
            <a href="tel:+15803355588" style={{ display: "block", color: BLUE, fontWeight: 700, fontSize: 17 }}>580-335-5588</a>
          </div>
          <div style={{ background: "#F0F0FF", borderRadius: 14, padding: "20px 22px" }}>
            <p style={{ color: RED, fontSize: 13, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 6px" }}>Head Start Positions</p>
            <p style={{ fontWeight: 800, fontSize: 19, margin: "0 0 6px" }}>Robin Harris, Director</p>
            <a href="mailto:rharris@cadcok.org" style={{ display: "block", color: BLUE, fontWeight: 700, fontSize: 17, marginBottom: 4 }}>rharris@cadcok.org</a>
            <a href="tel:+15807263343" style={{ display: "block", color: BLUE, fontWeight: 700, fontSize: 17 }}>580-726-3343</a>
          </div>
        </section>

        <p style={{ fontSize: 16, color: BODY, lineHeight: 1.6, marginBottom: 28 }}>
          CADC is an equal opportunity employer. See our{" "}
          <a href="/documents/affirmative-action-plan-2023.pdf" target="_blank" rel="noopener noreferrer" style={{ color: BLUE, fontWeight: 700 }}>Affirmative Action Plan</a>.
        </p>

        <Link href="/" style={{ color: BLUE, fontWeight: 800, fontSize: 17, textDecoration: "none" }}>← Back to CADC Home</Link>
      </main>
    </CADCShell>
  );
}
