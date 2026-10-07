"use client";

import { useState } from "react";
import CADCShell from "@/components/CADCShell";

// ─── Contact Data ─────────────────────────────────────────────────────────────

// Every CADC office — 6 senior nutrition, 3 Advantage, 1 Head Start, 3 transit, 1 weatherization, 1 market + main office (per Leslea 10/2)
const OFFICES = [
  {
    name: "CADC Main Office",
    address: "105 S. Main Street, Frederick, OK 73542",
    phone: "580-335-5588",
    phoneHref: "tel:+15803355588",
    hours: "Mon\u2013Fri 8:00am\u20135:00pm",
    mapsUrl: "https://maps.google.com/?q=105+S.+Main+Street%2C+Frederick%2C+OK+73542",
    appleMapsUrl: "https://maps.apple.com/?q=105+S.+Main+Street%2C+Frederick%2C+OK+73542",
    programs: ["All Programs \u2014 Main Office", "Senior Nutrition", "Transit"],
  },
  {
    name: "Red River Transit \u2014 Frederick Office",
    address: "105 S. Main Street, Frederick, OK 73542",
    phone: "580-335-2691",
    phoneHref: "tel:+15803352691",
    hours: "Mon\u2013Fri 8:00am\u20135:00pm",
    mapsUrl: "https://maps.google.com/?q=105+S.+Main+Street%2C+Frederick%2C+OK+73542",
    appleMapsUrl: "https://maps.apple.com/?q=105+S.+Main+Street%2C+Frederick%2C+OK+73542",
    programs: ["Red River Transportation", "Transit Office"],
  },
  {
    name: "Senior Nutrition \u2014 Frederick",
    address: "100 E Grand, Frederick, OK 73542",
    phone: "580-335-7026",
    phoneHref: "tel:+15803357026",
    hours: "Mon\u2013Fri 11:00am\u20131:00pm",
    mapsUrl: "https://maps.google.com/?q=100+E+Grand%2C+Frederick%2C+OK+73542",
    appleMapsUrl: "https://maps.apple.com/?q=100+E+Grand%2C+Frederick%2C+OK+73542",
    programs: ["Senior Congregate Meals"],
  },
  {
    name: "Senior Nutrition \u2014 Cache",
    address: "416 West C Ave., Cache, OK 73527",
    phone: "580-429-3427",
    phoneHref: "tel:+15804293427",
    hours: "Mon\u2013Fri 11:00am\u20131:00pm",
    mapsUrl: "https://maps.google.com/?q=416+West+C+Ave.%2C+Cache%2C+OK+73527",
    appleMapsUrl: "https://maps.apple.com/?q=416+West+C+Ave.%2C+Cache%2C+OK+73527",
    programs: ["Senior Congregate Meals"],
  },
  {
    name: "Senior Nutrition \u2014 Temple",
    address: "201 S Commercial, Temple, OK 73568",
    phone: "580-342-6944",
    phoneHref: "tel:+15803426944",
    hours: "Mon\u2013Fri 11:00am\u20131:00pm",
    mapsUrl: "https://maps.google.com/?q=201+S+Commercial%2C+Temple%2C+OK+73568",
    appleMapsUrl: "https://maps.apple.com/?q=201+S+Commercial%2C+Temple%2C+OK+73568",
    programs: ["Senior Congregate Meals"],
  },
  {
    name: "Senior Nutrition \u2014 Walters",
    address: "500 E California, Walters, OK 73572",
    phone: "580-875-9044",
    phoneHref: "tel:+15808759044",
    hours: "Mon\u2013Fri 11:00am\u20131:00pm",
    mapsUrl: "https://maps.google.com/?q=500+E+California%2C+Walters%2C+OK+73572",
    appleMapsUrl: "https://maps.apple.com/?q=500+E+California%2C+Walters%2C+OK+73572",
    programs: ["Senior Congregate Meals"],
  },
  {
    name: "Senior Nutrition \u2014 Ringling",
    address: "200 D St., Ringling, OK 73456",
    phone: "580-662-2362",
    phoneHref: "tel:+15806622362",
    hours: "Mon\u2013Fri 11:00am\u20131:00pm",
    mapsUrl: "https://maps.google.com/?q=200+D+St.%2C+Ringling%2C+OK+73456",
    appleMapsUrl: "https://maps.apple.com/?q=200+D+St.%2C+Ringling%2C+OK+73456",
    programs: ["Senior Congregate Meals"],
  },
  {
    name: "Senior Nutrition \u2014 Ryan",
    address: "400 Taylor St. Apt #8, Ryan, OK 73565",
    phone: "580-757-2412",
    phoneHref: "tel:+15807572412",
    hours: "Mon\u2013Fri 11:00am\u20131:00pm",
    mapsUrl: "https://maps.google.com/?q=400+Taylor+St.+Apt+%238%2C+Ryan%2C+OK+73565",
    appleMapsUrl: "https://maps.apple.com/?q=400+Taylor+St.+Apt+%238%2C+Ryan%2C+OK+73565",
    programs: ["Senior Congregate Meals"],
  },
  {
    name: "Red River Transit \u2014 Ryan Office",
    address: "400 Taylor & Main, Ryan, OK 73565",
    phone: "580-757-2235",
    phoneHref: "tel:+15807572235",
    hours: "Mon\u2013Fri 8:00am\u20135:00pm",
    mapsUrl: "https://maps.google.com/?q=400+Taylor+%26+Main%2C+Ryan%2C+OK+73565",
    appleMapsUrl: "https://maps.apple.com/?q=400+Taylor+%26+Main%2C+Ryan%2C+OK+73565",
    programs: ["Red River Transportation", "Transit Office"],
  },
  {
    name: "Red River Transit \u2014 Sayre Office",
    address: "304 W. Main, Sayre, OK 73662",
    phone: "580-928-2199",
    phoneHref: "tel:+15809282199",
    hours: "Mon\u2013Fri 8:00am\u20135:00pm",
    mapsUrl: "https://maps.google.com/?q=304+W.+Main%2C+Sayre%2C+OK+73662",
    appleMapsUrl: "https://maps.apple.com/?q=304+W.+Main%2C+Sayre%2C+OK+73662",
    programs: ["Red River Transportation"],
  },
  {
    name: "Advantage \u2014 Sentinel Office",
    address: "122 S. 3rd Butler Building, Sentinel, OK 73664",
    phone: "580-393-2216",
    phoneHref: "tel:+15803932216",
    hours: "Mon\u2013Fri 8:00am\u20135:00pm",
    mapsUrl: "https://maps.google.com/?q=122+S.+3rd+Butler+Building%2C+Sentinel%2C+OK+73664",
    appleMapsUrl: "https://maps.apple.com/?q=122+S.+3rd+Butler+Building%2C+Sentinel%2C+OK+73664",
    programs: ["Advantage Home Delivered Meals"],
  },
  {
    name: "Advantage \u2014 Temple Office",
    address: "102 W. Texas, Temple, OK 73568",
    phone: "580-342-6967",
    phoneHref: "tel:+15803426967",
    hours: "Mon\u2013Fri 8:00am\u20135:00pm",
    mapsUrl: "https://maps.google.com/?q=102+W.+Texas%2C+Temple%2C+OK+73568",
    appleMapsUrl: "https://maps.apple.com/?q=102+W.+Texas%2C+Temple%2C+OK+73568",
    programs: ["Advantage Home Delivered Meals"],
  },
  {
    name: "Advantage \u2014 Lawton Office",
    address: "802 SW A Ave, Suite B, Lawton, OK 73501",
    phone: "580-699-8880",
    phoneHref: "tel:+15806998880",
    hours: "Mon\u2013Fri 8:00am\u20135:00pm",
    mapsUrl: "https://maps.google.com/?q=802+SW+A+Ave%2C+Suite+B%2C+Lawton%2C+OK+73501",
    appleMapsUrl: "https://maps.apple.com/?q=802+SW+A+Ave%2C+Suite+B%2C+Lawton%2C+OK+73501",
    programs: ["Advantage Home Delivered Meals"],
  },
  {
    name: "Head Start \u2014 Administrative Office",
    address: "400 N. Randlett St., Hobart, OK 73651",
    phone: "580-726-3343",
    phoneHref: "tel:+15807263343",
    hours: "Mon\u2013Fri 8:00am\u20135:00pm",
    mapsUrl: "https://maps.google.com/?q=400+N.+Randlett+St.%2C+Hobart%2C+OK+73651",
    appleMapsUrl: "https://maps.apple.com/?q=400+N.+Randlett+St.%2C+Hobart%2C+OK+73651",
    programs: ["Head Start & Early Head Start"],
  },
  {
    name: "Weatherization \u2014 Main Office",
    address: "105 S. Main Street, Frederick, OK 73542",
    phone: "580-335-5588",
    phoneHref: "tel:+15803355588",
    hours: "Mon\u2013Fri 8:00am\u20135:00pm",
    mapsUrl: "https://maps.google.com/?q=105+S.+Main+Street%2C+Frederick%2C+OK+73542",
    appleMapsUrl: "https://maps.apple.com/?q=105+S.+Main+Street%2C+Frederick%2C+OK+73542",
    programs: ["Weatherization Assistance"],
  },
  {
    name: "Community Market \u2014 Scheduling Office",
    address: "105 S. Main Street, Frederick, OK 73542",
    phone: "580-305-1964",
    phoneHref: "tel:+15803051964",
    hours: "Call for market schedule",
    mapsUrl: "https://maps.google.com/?q=105+S.+Main+Street%2C+Frederick%2C+OK+73542",
    appleMapsUrl: "https://maps.apple.com/?q=105+S.+Main+Street%2C+Frederick%2C+OK+73542",
    programs: ["Community Market"],
  },
];

const DIRECTORS = [
  { name: "Leslea Hixson", title: "Executive Director", phone: "580-335-5588", email: "lhixson@cadcok.org" },
  { name: "Robin Harris", title: "Head Start & Early Head Start Director", phone: "580-726-3343", email: "rharris@cadcok.org" },
  { name: "Gilbert Nuncio", title: "Red River Transit Director", phone: "580-335-2691", email: "redriver@pldi.net" },
  { name: "Robert Meador", title: "Weatherization Director", phone: "580-305-0853", email: null },
  { name: "Laura Vardell", title: "Senior Nutrition Director", phone: "580-335-5588", email: null },
  { name: "Scott Fraley", title: "Community Market Director", phone: "580-305-1964", email: "sfraley@cadcok.org" },
  { name: "Kristie Jackson", title: "CSBG & Advantage Director", phone: "580-393-2216", email: "kjackson@cadcok.org" },
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
          <p style={{ color: "#CC0000", fontSize: 14, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>We're Here to Help</p>
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
          <p style={{ color: "#CC0000", fontSize: 14, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>Our Offices</p>
          <h2 id="offices-heading" style={{ color: "#0101FF", fontSize: "clamp(1.2rem,2.5vw,1.6rem)", fontWeight: 800, marginBottom: 20 }}>Find a Location Near You</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: 16 }}>
            {OFFICES.map(office => (
              <div key={office.name} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 14, padding: "20px 22px" }}>
                <p style={{ color: "#0101FF", fontWeight: 800, fontSize: 14, margin: "0 0 4px" }}>{office.name}</p>
                <p style={{ color: "#374151", fontSize: 15, margin: "0 0 12px", lineHeight: 1.5 }}>{office.address}</p>
                <p style={{ color: "#CC0000", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px" }}>Hours</p>
                <p style={{ color: "#374151", fontSize: 15, margin: "0 0 12px" }}>{office.hours}</p>
                <p style={{ color: "#CC0000", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px" }}>Programs</p>
                <p style={{ color: "#374151", fontSize: 15, margin: "0 0 16px", lineHeight: 1.5 }}>{office.programs.join(" · ")}</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <a href={office.phoneHref} aria-label={`Call ${office.name}`} style={{ flex: 1, minWidth: 80, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, background: "#0101FF", color: "white", padding: "9px 12px", borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                    📞 {office.phone}
                  </a>
                  <a href={office.mapsUrl} target="_blank" rel="noopener noreferrer" aria-label={`Directions to ${office.name} via Google Maps`} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, background: "#f0f0ff", color: "#0101FF", padding: "9px 12px", borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: "none", border: "1px solid rgba(1,1,255,0.2)" }}>
                    🗺️ Directions
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Program directors */}
        <section aria-labelledby="directors-heading">
          <p style={{ color: "#CC0000", fontSize: 14, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>Program Directors</p>
          <h2 id="directors-heading" style={{ color: "#0101FF", fontSize: "clamp(1.2rem,2.5vw,1.6rem)", fontWeight: 800, marginBottom: 20 }}>Contact the Right Person</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px,1fr))", gap: 12 }}>
            {DIRECTORS.map(d => (
              <div key={d.name} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 18px" }}>
                <p style={{ color: "#111827", fontWeight: 800, fontSize: 14, margin: "0 0 2px" }}>{d.name}</p>
                <p style={{ color: "#CC0000", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 12px" }}>{d.title}</p>
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
          <p style={{ color: "#CC0000", fontSize: 14, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>Quick Access</p>
          <h2 id="quick-contact-heading" style={{ color: "#0101FF", fontSize: "clamp(1.2rem,2.5vw,1.6rem)", fontWeight: 800, marginBottom: 20 }}>What Do You Need?</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))", gap: 12 }}>
            {[
              { icon: "🏫", title: "Head Start Enrollment", desc: "Early childhood education for children birth–5", href: "/?program=head-start" },
              { icon: "🚌", title: "Schedule a Ride", desc: "Red River Transportation — call to book", href: "tel:+15803352691" },
              { icon: "🍽️", title: "Senior Meal Sites", desc: "Congregate dining at 6 locations", href: "/?program=senior-meals" },
              { icon: "🚗", title: "Advantage Meals", desc: "Home-delivered meals for seniors", href: "tel:+15803932216" },
              { icon: "🏠", title: "Weatherization", desc: "Energy efficiency & housing assistance", href: "/?program=weatherization" },
              { icon: "🛒", title: "Community Market", desc: "Mobile grocery — call Scott Fraley", href: "tel:+15803051964" },
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
                <p style={{ color: "#374151", fontSize: 14, margin: 0, lineHeight: 1.4 }}>{card.desc}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Main office CTA */}
        <section style={{ background: "#F0F0FF", borderRadius: 16, padding: "32px 36px", border: "1px solid rgba(1,1,255,0.12)" }} aria-labelledby="main-contact-cta">
          <p style={{ color: "#CC0000", fontSize: 14, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 10 }}>Main Office</p>
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
