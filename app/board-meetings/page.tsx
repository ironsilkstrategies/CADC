"use client";

import Link from "next/link";
import CADCShell from "@/components/CADCShell";

export default function BoardMeetingsPage() {
  return (
    <CADCShell>
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* Header */}
        <p style={{ color: "#CC0000", fontSize: 14, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>
          Transparency &amp; Governance
        </p>
        <h1 style={{ color: "#0101FF", fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 800, marginBottom: 8, lineHeight: 1.15, fontFamily: "'Space Grotesk', sans-serif" }}>
          Board Meeting Agendas &amp; Minutes
        </h1>
        <p style={{ color: "#374151", fontSize: 15, lineHeight: 1.8, marginBottom: 40, maxWidth: 600 }}>
          CADC is governed by a tripartite Board of Directors representing the communities we serve.
          Meeting agendas and approved minutes are published below in accordance with our commitment
          to public transparency.
        </p>

        {[{ year: "2026", items: [{m:"January",href:"https://www.cadcok.org/_files/ugd/f04cf2_8155e29b4c0048da962a69872ba68189.pdf"},{m:"February",href:"https://www.cadcok.org/_files/ugd/f04cf2_4760e7a2212d4e2c88027b69f60266d7.pdf"},{m:"March",href:"https://www.cadcok.org/_files/ugd/f04cf2_b026b04267fb41afb2005b8225d604d0.pdf"},{m:"April",href:"https://www.cadcok.org/_files/ugd/f04cf2_f39bf565e53448969603cd48b8eb4648.pdf"},{m:"May",href:"https://www.cadcok.org/_files/ugd/f04cf2_b36c6dbfd97d436ead0ff7570de2997d.pdf"},{m:"June",href:"https://www.cadcok.org/_files/ugd/f04cf2_cb1b069cb17c44f0a4392efad4effaad.pdf"}] }, { year: "2025", items: [{m:"January",href:"https://www.cadcok.org/_files/ugd/f04cf2_ecc189ea07344b2a9cd33eee90a7e710.doc?dn=JANUARY%206%202024.doc"},{m:"February",href:"https://www.cadcok.org/_files/ugd/f04cf2_1570c0a640684f7a985a327e6001836d.pdf"},{m:"March",href:"https://www.cadcok.org/_files/ugd/f04cf2_3cea445bdca2494081aef1863aca040c.pdf"},{m:"April",href:"https://www.cadcok.org/_files/ugd/f04cf2_667b569d4b9c4e6fa6656bd787d44061.pdf"},{m:"May",href:"https://www.cadcok.org/_files/ugd/f04cf2_e66abd38031d49b6b8fbdeff1cedea18.pdf"},{m:"August",href:"https://www.cadcok.org/_files/ugd/f04cf2_70dcb6144b7646f0bcc87e71131e6234.pdf"},{m:"September",href:"https://www.cadcok.org/_files/ugd/f04cf2_7cc2bc5c160f4556b2411759445afa6a.pdf"},{m:"October",href:"https://www.cadcok.org/_files/ugd/f04cf2_4995ac4139a84673a273bba4e82331a9.pdf"},{m:"November",href:"https://www.cadcok.org/_files/ugd/f04cf2_f2a21c737a3d4fc48571a5f1b3b0d149.pdf"},{m:"December",href:"https://www.cadcok.org/_files/ugd/f04cf2_4425019387ae4b3481707bfdc630f602.pdf"}] }].map(g => (
          <div key={g.year} style={{ marginBottom: 32 }}>
            <h2 style={{ color: "#111827", fontSize: 22, fontWeight: 800, marginBottom: 14 }}>{g.year} Board Meetings</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
              {g.items.map(it => (
                <a key={it.m} href={it.href} target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 18px", background: "white", border: "1.5px solid #E4E4FF", borderRadius: 12, textDecoration: "none", color: "#0101FF", fontWeight: 800, fontSize: 17 }}>
                  📄 {it.m} {g.year}
                </a>
              ))}
            </div>
          </div>
        ))}
        <p style={{ fontSize: 15, color: "#374151", marginBottom: 32 }}>Looking for a meeting not listed? Call <a href="tel:+15803355588" style={{ color: "#0101FF", fontWeight: 700 }}>580-335-5588</a>.</p>

        {/* Meeting Schedule */}
        <div style={{ background: "white", border: "1px solid #E5E7EB", borderRadius: 12, padding: "24px 28px", marginBottom: 24 }}>
          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#4B5563", marginBottom: 14 }}>Board Meeting Schedule</p>
          <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7 }}>
            The CADC Board of Directors meets quarterly. Special meetings may be called as needed.
            Meeting times and locations are announced in advance. Contact the office for the current schedule.
          </p>
          <a href="tel:+15803355588" style={{ display: "inline-block", color: "#0101FF", fontWeight: 700, fontSize: 13, textDecoration: "none", marginTop: 12 }}>
            Call for meeting dates →
          </a>
        </div>

        {/* Annual Reports */}
        <div style={{ background: "white", border: "1px solid #E5E7EB", borderRadius: 12, padding: "24px 28px", marginBottom: 40 }}>
          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#4B5563", marginBottom: 14 }}>Related Documents</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { label: "FY2025 Annual Report", href: "/documents/annual-report-2025.pdf", note: "Program outcomes, financials, board roster" },
              { label: "Affirmative Action Plan 2023", href: "/documents/affirmative-action-plan-2023.pdf", note: "" },
              { label: "Title VI Nondiscrimination Policy", href: "/documents/title-vi-policy.pdf", note: "Red River Transportation" },
            ].map(d => (
              <a key={d.label} href={d.href} target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", gap: 12, alignItems: "flex-start", textDecoration: "none", padding: "10px 14px", background: "#F8F9FF", borderRadius: 8, border: "1px solid #E4E4FF" }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>📄</span>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 13, color: "#0101FF", margin: 0 }}>{d.label}</p>
                  {d.note && <p style={{ fontSize: 14, color: "#4B5563", margin: "2px 0 0" }}>{d.note}</p>}
                </div>
              </a>
            ))}
          </div>
        </div>

        <Link href="/" style={{ color: "#0101FF", fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
          ← Back to CADC Home
        </Link>

      </main>
    </CADCShell>
  );
}
