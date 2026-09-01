"use client";

import { useState } from "react";
import CADCShell from "@/components/CADCShell";

// ─── Contact Data ─────────────────────────────────────────────────────────────

const OFFICES = [
  {
    name: "Main Office — Frederick",
    address: "105 S. Main Street, Frederick, OK 73542",
    phone: "580-335-5588",
    phoneHref: "tel:+15803355588",
    hours: "Mon–Fri 8:00am–5:00pm",
    mapsUrl: "https://maps.google.com/?q=105+S+Main+Street+Frederick+OK+73542",
    appleMapsUrl: "https://maps.apple.com/?q=105+S+Main+Street+Frederick+OK+73542",
    programs: ["All programs", "Executive office", "HR", "Finance"],
  },
  {
    name: "Red River Transit — Sayre",
    address: "304 W. Main, Sayre, OK 73662",
    phone: "580-928-2199",
    phoneHref: "tel:+15809282199",
    hours: "Mon–Fri 8:00am–5:00pm",
    mapsUrl: "https://maps.google.com/?q=304+W+Main+Sayre+OK+73662",
    appleMapsUrl: "https://maps.apple.com/?q=304+W+Main+Sayre+OK+73662",
    programs: ["Red River Transportation"],
  },
  {
    name: "Advantage — Sentinel",
    address: "122 S. 3rd Butler Building, Sentinel, OK 73664",
    phone: "580-393-2216",
    phoneHref: "tel:+15803932216",
    hours: "Mon–Fri 8:00am–5:00pm",
    mapsUrl: "https://maps.google.com/?q=122+S+3rd+Sentinel+OK+73664",
    appleMapsUrl: "https://maps.apple.com/?q=122+S+3rd+Sentinel+OK+73664",
    programs: ["Advantage Home Delivered Meals"],
  },
  {
    name: "Advantage — Lawton",
    address: "802 SW A Ave, Suite B, Lawton, OK 73501",
    phone: "580-699-8880",
    phoneHref: "tel:+15806998880",
    hours: "Mon–Fri 8:00am–5:00pm",
    mapsUrl: "https://maps.google.com/?q=802+SW+A+Ave+Suite+B+Lawton+OK+73501",
    appleMapsUrl: "https://maps.apple.com/?q=802+SW+A+Ave+Lawton+OK+73501",
    programs: ["Advantage Home Delivered Meals"],
  },
];

const DIRECTORS = [
  { name: "Leslea Hixson", title: "Executive Director", phone: "580-335-5588", email: null },
  { name: "Robin Harris", title: "Head Start & Early Head Start Director", phone: "580-335-5588", email: null },
  { name: "Gilbert Nuncio", title: "Red River Transit Director", phone: "580-928-2199", email: null },
  { name: "Robert Meador", title: "Weatherization Director", phone: "580-335-5588", email: null },
  { name: "Laura Vardell", title: "Senior Nutrition Director", phone: "580-335-5588", email: null },
  { name: "Scott Fraley", title: "Community Market Director", phone: "580-305-1964", email: "SFraley@cadcok.org" },
  { name: "Kristie Jackson", title: "Advantage Director", phone: "580-393-2216", email: null },
];

// ─── Contact Page ─────────────────────────────────────────────────────────────

export default function ContactPage() {
  const [copied, setCopied] = useState<string | null>(null);

  function copyEmail(email: string) {
    navigator.clipboard.writeText(email).then(() => {
      setCopied(email);
      setTimeout(() => setCopied(null), 2000);
    });
  }

  return (
    <CADCShell mainId="main-contact-content">

      {/* Hero */}
      <header style={{ background: "rgba(248,249,255,0.92)", borderBottom: "1px solid #e5e7eb", padding: "48px 0 40px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px" }}>
          <p style={{ color: "#CC0000", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>We're Here to Help</p>
          <h1 style={{ color: "#0101FF", fontSize: "clamp(1.6rem,4vw,2.6rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: 16 }}>Contact CADC</h1>
          <p style={{ color: "#374151", fontSize: 16, lineHeight: 1.75, maxWidth: 560, marginBottom: 24 }}>
            Reach us by phone, visit a location, or connect with the program director who can help you most.
          </p>
          <a
            href="tel:+15803355588"
            aria-label="Call CADC main office at 580-335-5588"
            style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#CC0000", color: "white", padding: "14px 28px", borderRadius: 8, fontWeight: 800, fontSize: 16, textDecoration: "none" }}
          >
            📞 580-335-5588
          </a>
        </div>
      </header>

      {/* Main content */}
      <div id="main-contact-content" style={{ maxWidth: 860, margin: "0 auto", padding: "56px 24px 80px", display: "flex", flexDirection: "column", gap: 56 }}>

        {/* Office locations */}
        <section aria-labelledby="offices-heading">
          <p style={{ color: "#CC0000", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>Our Offices</p>
          <h2 id="offices-heading" style={{ color: "#0101FF", fontSize: "clamp(1.2rem,2.5vw,1.6rem)", fontWeight: 800, marginBottom: 20 }}>Find a Location Near You</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: 16 }}>
            {OFFICES.map(office => (
              <div key={office.name} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 14, padding: "20px 22px" }}>
                <p style={{ color: "#0101FF", fontWeight: 800, fontSize: 14, margin: "0 0 4px" }}>{office.name}</p>
                <p style={{ color: "#6b7280", fontSize: 12, margin: "0 0 12px", lineHeight: 1.5 }}>{office.address}</p>
                <p style={{ color: "#CC0000", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px" }}>Hours</p>
                <p style={{ color: "#374151", fontSize: 12, margin: "0 0 12px" }}>{office.hours}</p>
                <p style={{ color: "#CC0000", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px" }}>Programs</p>
                <p style={{ color: "#374151", fontSize: 12, margin: "0 0 16px", lineHeight: 1.5 }}>{office.programs.join(" · ")}</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <a href={office.phoneHref} aria-label={`Call ${office.name}`} style={{ flex: 1, minWidth: 80, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, background: "#0101FF", color: "white", padding: "9px 12px", borderRadius: 8, fontWeight: 700, fontSize: 11, textDecoration: "none" }}>
                    📞 {office.phone}
                  </a>
                  <a href={office.mapsUrl} target="_blank" rel="noopener noreferrer" aria-label={`Directions to ${office.name} via Google Maps`} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, background: "#f0f0ff", color: "#0101FF", padding: "9px 12px", borderRadius: 8, fontWeight: 700, fontSize: 11, textDecoration: "none", border: "1px solid rgba(1,1,255,0.2)" }}>
                    🗺️ Directions
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Program directors */}
        <section aria-labelledby="directors-heading">
          <p style={{ color: "#CC0000", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>Program Directors</p>
          <h2 id="directors-heading" style={{ color: "#0101FF", fontSize: "clamp(1.2rem,2.5vw,1.6rem)", fontWeight: 800, marginBottom: 20 }}>Contact the Right Person</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px,1fr))", gap: 12 }}>
            {DIRECTORS.map(d => (
              <div key={d.name} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 18px" }}>
                <p style={{ color: "#111827", fontWeight: 800, fontSize: 14, margin: "0 0 2px" }}>{d.name}</p>
                <p style={{ color: "#CC0000", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 12px" }}>{d.title}</p>
                <a href={`tel:+1${d.phone.replace(/\D/g,"")}`} aria-label={`Call ${d.name} at ${d.phone}`} style={{ display: "flex", alignItems: "center", gap: 6, color: "#0101FF", fontWeight: 700, fontSize: 13, textDecoration: "none", marginBottom: d.email ? 8 : 0 }}>
                  📞 {d.phone}
                </a>
                {d.email && (
                  <button
                    onClick={() => copyEmail(d.email!)}
                    aria-label={`Copy email address for ${d.name}`}
                    style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: copied === d.email ? "#059669" : "#0101FF", fontWeight: 700, fontSize: 13, cursor: "pointer", padding: 0 }}
                  >
                    {copied === d.email ? "✓ Copied!" : `✉️ ${d.email}`}
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Quick contact cards */}
        <section aria-labelledby="quick-contact-heading">
          <p style={{ color: "#CC0000", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>Quick Access</p>
          <h2 id="quick-contact-heading" style={{ color: "#0101FF", fontSize: "clamp(1.2rem,2.5vw,1.6rem)", fontWeight: 800, marginBottom: 20 }}>What Do You Need?</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))", gap: 12 }}>
            {[
              { icon: "🏫", title: "Head Start Enrollment", desc: "Early childhood education for children birth–5", href: "/#head-start" },
              { icon: "🚌", title: "Schedule a Ride", desc: "Red River Transportation — call to book", href: "tel:+15809282199" },
              { icon: "🍽️", title: "Senior Meal Sites", desc: "Congregate dining at 6 locations", href: "/#senior-meals" },
              { icon: "🚗", title: "Advantage Meals", desc: "Home-delivered meals for seniors", href: "tel:+15803932216" },
              { icon: "🏠", title: "Weatherization", desc: "Energy efficiency & housing assistance", href: "/#weatherization" },
              { icon: "🛒", title: "Community Market", desc: "Mobile grocery — call Scott Fraley", href: "tel:+15803051964" },
              { icon: "📋", title: "VITA Tax Help", desc: "Free tax preparation services", href: "/#tax-help" },
              { icon: "📊", title: "2026 Community Survey", desc: "Shape CADC's future programs", href: "https://www.surveymonkey.com/r/26cadcneeds" },
            ].map(card => (
              <a
                key={card.title}
                href={card.href}
                target={card.href.startsWith("http") ? "_blank" : undefined}
                rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined}
                aria-label={card.title}
                style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 18px", textDecoration: "none", display: "block", transition: "border-color 0.2s, box-shadow 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#0101FF"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 16px rgba(1,1,255,0.1)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#e5e7eb"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none"; }}
              >
                <span style={{ fontSize: 22, display: "block", marginBottom: 8 }} aria-hidden="true">{card.icon}</span>
                <p style={{ color: "#111827", fontWeight: 700, fontSize: 13, margin: "0 0 4px" }}>{card.title}</p>
                <p style={{ color: "#6b7280", fontSize: 11, margin: 0, lineHeight: 1.4 }}>{card.desc}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Emergency / after hours */}
        <section style={{ background: "#F0F0FF", borderRadius: 16, padding: "32px 36px", border: "1px solid rgba(1,1,255,0.12)" }} aria-labelledby="main-contact-cta">
          <p style={{ color: "#CC0000", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 10 }}>Main Office</p>
          <h2 id="main-contact-cta" style={{ color: "#0101FF", fontSize: "clamp(1.2rem,2.5vw,1.8rem)", fontWeight: 800, marginBottom: 8 }}>Community Action Development Corporation</h2>
          <p style={{ color: "#374151", fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
            105 S. Main Street, Frederick, OK 73542<br />
            Mon–Fri 8:00am–5:00pm
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href="tel:+15803355588" aria-label="Call CADC at 580-335-5588" style={{ background: "#CC0000", color: "white", padding: "12px 24px", borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
              📞 580-335-5588
            </a>
            <a href="/about" style={{ border: "1px solid #0101FF", color: "#0101FF", padding: "12px 24px", borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
              About CADC →
            </a>
          </div>
        </section>

      </div>
    </CADCShell>
  );
}
