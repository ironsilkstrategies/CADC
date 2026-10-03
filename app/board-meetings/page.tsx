"use client";

import Link from "next/link";
import CADCShell from "@/components/CADCShell";

export default function BoardMeetingsPage() {
  return (
    <CADCShell>
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* Header */}
        <p style={{ color: "#CC0000", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>
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

        {/* Coming Soon / Placeholder */}
        <div style={{
          background: "#F0F0FF", border: "1.5px solid #0101FF",
          borderRadius: 14, padding: "32px 28px", marginBottom: 32,
          display: "flex", gap: 20, alignItems: "flex-start",
        }}>
          <span style={{ fontSize: 36, flexShrink: 0 }}>📋</span>
          <div>
            <p style={{ fontWeight: 800, fontSize: 16, color: "#111827", marginBottom: 8 }}>
              Documents Coming Soon
            </p>
            <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.7, marginBottom: 0 }}>
              Board meeting agendas and minutes are being compiled and will be posted here.
              For immediate access to meeting records, contact the CADC main office.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
              <a href="tel:+15803355588" style={{ background: "#0101FF", color: "white", padding: "10px 20px", borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
                📞 580-335-5588
              </a>
              <a href="mailto:lhixson@cadcok.org" style={{ background: "white", border: "1.5px solid #0101FF", color: "#0101FF", padding: "10px 20px", borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
                ✉️ Email Leslea Hixson
              </a>
            </div>
          </div>
        </div>

        {/* Meeting Schedule */}
        <div style={{ background: "white", border: "1px solid #E5E7EB", borderRadius: 12, padding: "24px 28px", marginBottom: 24 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#9CA3AF", marginBottom: 14 }}>Board Meeting Schedule</p>
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
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#9CA3AF", marginBottom: 14 }}>Related Documents</p>
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
                  {d.note && <p style={{ fontSize: 11, color: "#9CA3AF", margin: "2px 0 0" }}>{d.note}</p>}
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
