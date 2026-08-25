import Link from "next/link";
import type { Metadata } from "next";
import { contact, complianceDocs } from "@/lib/org";
import { transitOffices, headStartCenters } from "@/lib/locations";

export const metadata: Metadata = {
  title: "Contact CADC | Community Action Development Corporation",
  description:
    "Contact Community Action Development Corporation — main office in Frederick, OK. Transit scheduling, Head Start enrollment, and program information.",
};

export default function ContactPage() {
  const titleVI = complianceDocs.filter(d => d.program === "transit");

  return (
    <div className="min-h-screen" style={{ background: "#F8F8FF", fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>

      {/* Hero */}
      <section style={{ background: "#000014", position: "relative", overflow: "hidden", padding: "80px 0 56px" }}>
        <div style={{
          position: "absolute", inset: 0, opacity: 0.04,
          backgroundImage: "linear-gradient(rgba(1,1,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(1,1,255,0.8) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }} />
        <div style={{ position: "relative", maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.45)", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", marginBottom: 28 }}>
            <span>←</span> Back to Home
          </Link>
          <p style={{ color: "#0101FF", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 14 }}>
            We're here to help
          </p>
          <h1 style={{ color: "white", fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: 16 }}>
            Contact <span style={{ color: "#0101FF" }}>CADC</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, lineHeight: 1.7 }}>
            Main office · Frederick, Oklahoma · Serving 9 counties across Southwest Oklahoma
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px 80px", display: "flex", flexDirection: "column", gap: 48 }}>

        {/* Primary contact cards */}
        <section>
          <p style={{ color: "#7E0001", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 20 }}>Main Contact</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>

            {/* Main phone */}
            <div style={{ background: "#0101FF", borderRadius: 16, padding: 24 }}>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 8px" }}>Main Line</p>
              <a href={contact.mainPhoneHref} style={{ color: "white", fontSize: "clamp(1.1rem,3vw,1.5rem)", fontWeight: 800, textDecoration: "none", display: "block", marginBottom: 8 }}>
                {contact.mainPhone}
              </a>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, margin: 0, lineHeight: 1.5 }}>
                {contact.address.street}<br />
                {contact.address.city}, {contact.address.state} {contact.address.zip}
              </p>
              <a
                href={`https://maps.apple.com/?address=${encodeURIComponent(`${contact.address.street}, ${contact.address.city}, ${contact.address.state} ${contact.address.zip}`)}`}
                target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-block", marginTop: 12, color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 700, textDecoration: "none" }}
              >
                📍 Get directions →
              </a>
            </div>

            {/* Transit */}
            <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 16, padding: 24 }}>
              <p style={{ color: "#7E0001", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 8px" }}>Red River Transportation</p>
              <a href={contact.transitPhoneHref} style={{ color: "#0101FF", fontSize: "clamp(1.1rem,3vw,1.5rem)", fontWeight: 800, textDecoration: "none", display: "block", marginBottom: 8 }}>
                {contact.transitPhone}
              </a>
              <p style={{ color: "#6b7280", fontSize: 12, margin: 0, lineHeight: 1.5 }}>
                Toll-free · Schedule rides to medical appointments, dialysis, work, and shopping
              </p>
            </div>

            {/* Social */}
            <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 16, padding: 24 }}>
              <p style={{ color: "#7E0001", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 12px" }}>Find Us Online</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <a href={contact.social.facebook} target="_blank" rel="noopener noreferrer" style={{ color: "#0101FF", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                  Facebook — WeAreCADC →
                </a>
                <a href={contact.social.instagram} target="_blank" rel="noopener noreferrer" style={{ color: "#0101FF", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                  Instagram — @wearecadc →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Transit offices */}
        <section>
          <p style={{ color: "#7E0001", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 8 }}>Red River Transportation</p>
          <h2 style={{ color: "#0101FF", fontSize: "clamp(1.1rem,2.5vw,1.5rem)", fontWeight: 800, marginBottom: 20 }}>Transit Office Locations</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
            {transitOffices.map(o => (
              <div key={o.id} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: "18px 20px" }}>
                <p style={{ color: "#111827", fontWeight: 800, fontSize: 14, margin: "0 0 4px" }}>{o.city}</p>
                <p style={{ color: "#6b7280", fontSize: 12, margin: "0 0 8px", lineHeight: 1.5 }}>{o.street}<br />{o.city}, {o.state} {o.zip}</p>
                <a href={o.phoneHref} style={{ color: "#0101FF", fontWeight: 700, fontSize: 13, textDecoration: "none" }}>{o.phone}</a>
                <div style={{ marginTop: 8 }}>
                  <a
                    href={`https://maps.apple.com/?address=${encodeURIComponent(`${o.street}, ${o.city}, ${o.state} ${o.zip}`)}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{ color: "#9ca3af", fontSize: 11, fontWeight: 600, textDecoration: "none" }}
                  >📍 Directions</a>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 10 }}>
            {titleVI.map(d => (
              <a key={d.label} href={d.href} target="_blank" rel="noopener noreferrer"
                style={{ color: "#6b7280", fontSize: 11, fontWeight: 600, textDecoration: "underline", textUnderlineOffset: 2 }}>
                {d.label}
              </a>
            ))}
          </div>
        </section>

        {/* Head Start centers */}
        <section>
          <p style={{ color: "#7E0001", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 8 }}>Head Start & Early Head Start</p>
          <h2 style={{ color: "#0101FF", fontSize: "clamp(1.1rem,2.5vw,1.5rem)", fontWeight: 800, marginBottom: 20 }}>11 Centers Across Southwest Oklahoma</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
            {headStartCenters.map(c => (
              <div key={c.id} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 18px" }}>
                <p style={{ color: "#111827", fontWeight: 800, fontSize: 13, margin: "0 0 3px" }}>{c.name}</p>
                <p style={{ color: "#9ca3af", fontSize: 11, margin: "0 0 6px", lineHeight: 1.4 }}>{c.street}, {c.city}</p>
                <a href={c.phoneHref} style={{ color: "#0101FF", fontWeight: 700, fontSize: 12, textDecoration: "none" }}>{c.phone}</a>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
