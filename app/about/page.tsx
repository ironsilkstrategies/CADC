import Link from "next/link";
import type { Metadata } from "next";
import { org, contact, addressOneLine, complianceDocs } from "@/lib/org";

export const metadata: Metadata = {
  title: "About CADC | Community Action Development Corporation",
  description:
    "CADC has served Southwest Oklahoma families since 1966 — early childhood education, transportation, weatherization, nutrition, and more across 9 counties.",
};

const STATS = [
  { value: "1966", label: "Year founded" },
  { value: "9", label: "Counties served" },
  { value: "11", label: "Head Start centers" },
  { value: "110", label: "Transit vehicles" },
  { value: "5", label: "Senior meal sites" },
];

const PROGRAMS = [
  { name: "Head Start & Early Head Start", slug: "head-start", icon: "🏫" },
  { name: "Red River Transportation", slug: "transit", icon: "🚌" },
  { name: "Weatherization & Housing", slug: "weatherization", icon: "🏠" },
  { name: "Senior Nutrition", slug: "senior-meals", icon: "🍽️" },
  { name: "Advantage Home Delivered Meals", slug: "advantage", icon: "🚗" },
  { name: "VITA Free Tax Help", slug: "tax-help", icon: "📋" },
  { name: "Community Market", slug: "community-market", icon: "🛒" },
  { name: "Employment & Workforce", slug: "employment", icon: "💼" },
];

const LEADERSHIP = [
  { name: "Leslea Hixson", title: "Executive Director" },
  { name: "Robin Harris", title: "Director, Head Start & Early Head Start" },
  { name: "Kristie Jackson", title: "Advantage Director" },
];

const COUNTIES = [
  "Beckham","Canadian","Comanche","Cotton",
  "Jefferson","Kiowa","Roger Mills","Tillman","Washita",
];

export default function AboutPage() {
  const annualReport = complianceDocs.find(d => d.label === "2024 Annual Report");

  return (
    <div className="min-h-screen" style={{ background: "#F8F8FF", fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>

      {/* Hero */}
      <section style={{ background: "#000014", position: "relative", overflow: "hidden", padding: "80px 0 64px" }}>
        {/* Subtle grid texture */}
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
            Southwest Oklahoma
          </p>
          <h1 style={{ color: "white", fontSize: "clamp(2rem,5vw,3.4rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: 20 }}>
            Community Action<br />
            <span style={{ color: "#0101FF" }}>Development</span> Corporation
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 16, lineHeight: 1.75, maxWidth: 600, marginBottom: 32 }}>
            Since 1966, CADC has worked alongside families across Southwest Oklahoma — connecting people to the resources, programs, and support they need to build stable, healthy lives.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href={`tel:+1${contact.mainPhone.replace(/\D/g,"")}`} style={{ background: "#7E0001", color: "white", padding: "12px 24px", borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: "none", letterSpacing: "0.04em" }}>
              📞 {contact.mainPhone}
            </a>
            {annualReport && (
              <a href={annualReport.href} target="_blank" rel="noopener noreferrer" style={{ border: "1px solid rgba(1,1,255,0.4)", color: "rgba(255,255,255,0.7)", padding: "12px 24px", borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
                2024 Annual Report ↗
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div style={{ background: "#0101FF" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px", display: "flex", flexWrap: "wrap" }}>
          {STATS.map(s => (
            <div key={s.label} style={{ flex: "1 1 120px", padding: "20px 16px", textAlign: "center", borderRight: "1px solid rgba(255,255,255,0.12)" }}>
              <div style={{ color: "white", fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 800, lineHeight: 1 }}>{s.value}</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "56px 24px 80px", display: "flex", flexDirection: "column", gap: 56 }}>

        {/* Mission */}
        <section>
          <p style={{ color: "#7E0001", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>Our Mission</p>
          <h2 style={{ color: "#0101FF", fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>
            Helping People. Changing Lives.
          </h2>
          <p style={{ color: "#374151", fontSize: 15, lineHeight: 1.8, maxWidth: 640 }}>
            CADC is a private, non-profit Community Action Agency and Community Action Partnership member. We work to reduce poverty, revitalize communities, and empower people across Southwest Oklahoma through direct services, advocacy, and partnerships.
          </p>
          <p style={{ color: "#374151", fontSize: 15, lineHeight: 1.8, maxWidth: 640, marginTop: 14 }}>
            Every program we operate is built around one belief: that people, given the right support at the right time, can and do change their circumstances. We show up for that moment — every day, across 9 counties.
          </p>
        </section>

        {/* Service area */}
        <section>
          <p style={{ color: "#7E0001", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>Where We Serve</p>
          <h2 style={{ color: "#0101FF", fontSize: "clamp(1.2rem,2.5vw,1.6rem)", fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>
            9 Counties Across Southwest Oklahoma
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {COUNTIES.map(c => (
              <div key={c} style={{ background: "#E4E4FF", border: "1px solid rgba(1,1,255,0.2)", borderRadius: 6, padding: "7px 14px", fontSize: 13, color: "#0101FF", fontWeight: 700 }}>
                {c}
              </div>
            ))}
          </div>
          <p style={{ color: "#6b7280", fontSize: 13, marginTop: 12 }}>
            Some programs — including Red River Transportation and Advantage Home Delivered Meals — serve additional counties beyond the base 9. Visit individual program pages for coverage details.
          </p>
        </section>

        {/* Programs */}
        <section>
          <p style={{ color: "#7E0001", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>What We Do</p>
          <h2 style={{ color: "#0101FF", fontSize: "clamp(1.2rem,2.5vw,1.6rem)", fontWeight: 800, lineHeight: 1.2, marginBottom: 20 }}>
            Our Programs
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
            {PROGRAMS.map(p => (
              <Link key={p.slug} href={`/#${p.slug}`} style={{
                background: "white", border: "1px solid #e5e7eb", borderRadius: 12,
                padding: "16px 20px", textDecoration: "none",
                display: "flex", alignItems: "center", gap: 12,
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#0101FF"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 16px rgba(1,1,255,0.1)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#e5e7eb"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none"; }}
              >
                <span style={{ fontSize: 22 }}>{p.icon}</span>
                <span style={{ color: "#111827", fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}>{p.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Leadership */}
        <section>
          <p style={{ color: "#7E0001", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>Agency Leadership</p>
          <h2 style={{ color: "#0101FF", fontSize: "clamp(1.2rem,2.5vw,1.6rem)", fontWeight: 800, lineHeight: 1.2, marginBottom: 20 }}>
            Our Team
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
            {LEADERSHIP.map(l => (
              <div key={l.name} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: "20px" }}>
                <p style={{ color: "#111827", fontWeight: 800, fontSize: 15, margin: "0 0 4px" }}>{l.name}</p>
                <p style={{ color: "#7E0001", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>{l.title}</p>
              </div>
            ))}
          </div>
          <p style={{ color: "#6b7280", fontSize: 13, marginTop: 14 }}>
            Each program has a dedicated director reporting to the Executive Director. Board of Directors information available upon request.
          </p>
        </section>

        {/* Contact CTA */}
        <section style={{ background: "#000014", borderRadius: 20, padding: "40px 36px", position: "relative", overflow: "hidden" }}>
          <div style={{
            position: "absolute", inset: 0, opacity: 0.04,
            backgroundImage: "linear-gradient(rgba(1,1,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(1,1,255,0.8) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }} />
          <div style={{ position: "relative" }}>
            <p style={{ color: "#0101FF", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 10 }}>Get in touch</p>
            <h3 style={{ color: "white", fontSize: "clamp(1.2rem,2.5vw,1.8rem)", fontWeight: 800, marginBottom: 8 }}>We're here to help.</h3>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, lineHeight: 1.7, marginBottom: 24, maxWidth: 480 }}>
              {contact.address.street} · {contact.address.city}, {contact.address.state} {contact.address.zip}
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href={contact.mainPhoneHref} style={{ background: "#7E0001", color: "white", padding: "12px 24px", borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
                📞 {contact.mainPhone}
              </a>
              <Link href="/contact" style={{ border: "1px solid rgba(1,1,255,0.4)", color: "rgba(255,255,255,0.7)", padding: "12px 24px", borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
                Contact page →
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
