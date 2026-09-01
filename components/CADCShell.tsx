"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ─── Design tokens — must match CADCOrbitSite.tsx ────────────────────────────
const T = {
  blue:      "#0101FF",
  maroon:    "#CC0000",
  textPrimary: "#111827",
  textMuted:   "#6b7280",
  border:      "#e5e7eb",
  void:        "#F8F9FF",
};

// ─── Sketch Field ─────────────────────────────────────────────────────────────
// Mirrors SketchField from CADCOrbitSite — same hand-drawn floating icons

const SKETCHES = [
  { color: "#0101FF", draw: (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.moveTo(-22,-8); ctx.lineTo(-22,6); ctx.lineTo(-18,10); ctx.lineTo(18,10);
    ctx.lineTo(22,6); ctx.lineTo(22,-8); ctx.lineTo(-22,-8);
    ctx.moveTo(-22,0); ctx.lineTo(22,0);
    ctx.moveTo(-14,-8); ctx.lineTo(-14,0); ctx.moveTo(-5,-8); ctx.lineTo(-5,0);
    ctx.moveTo(5,-8); ctx.lineTo(5,0); ctx.moveTo(14,-8); ctx.lineTo(14,0);
    ctx.moveTo(-16,10); ctx.arc(-16,10,4,0,Math.PI*2);
    ctx.moveTo(16,10); ctx.arc(16,10,4,0,Math.PI*2);
    ctx.stroke();
  }},
  { color: "#CC0000", draw: (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.moveTo(0,-18); ctx.lineTo(20,0); ctx.lineTo(20,18);
    ctx.lineTo(-20,18); ctx.lineTo(-20,0); ctx.closePath();
    ctx.moveTo(-6,18); ctx.lineTo(-6,6); ctx.lineTo(6,6); ctx.lineTo(6,18);
    ctx.moveTo(-14,4); ctx.lineTo(-8,4); ctx.lineTo(-8,10); ctx.lineTo(-14,10); ctx.closePath();
    ctx.stroke();
  }},
  { color: "#0101FF", draw: (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.moveTo(-20,-10); ctx.lineTo(-14,-10); ctx.lineTo(-10,8); ctx.lineTo(14,8);
    ctx.lineTo(16,-2); ctx.lineTo(-10,-2);
    ctx.moveTo(-10,8); ctx.lineTo(-12,14);
    ctx.moveTo(-8,14); ctx.arc(-8,14,3,0,Math.PI*2);
    ctx.moveTo(12,14); ctx.arc(12,14,3,0,Math.PI*2);
    ctx.stroke();
  }},
  { color: "#CC0000", draw: (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.arc(0,0,16,0,Math.PI*2);
    ctx.moveTo(-4,-12); ctx.lineTo(-4,12);
    ctx.moveTo(-7,-12); ctx.lineTo(-7,-6); ctx.arc(-5.5,-6,1.5,Math.PI,0); ctx.lineTo(-4,-12);
    ctx.moveTo(6,-12); ctx.lineTo(6,-4); ctx.bezierCurveTo(6,2,9,6,9,12);
    ctx.moveTo(6,-4); ctx.bezierCurveTo(6,2,3,6,3,12);
    ctx.stroke();
  }},
  { color: "#0101FF", draw: (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.arc(0,-14,5,0,Math.PI*2);
    ctx.moveTo(0,-9); ctx.lineTo(0,4);
    ctx.moveTo(-10,0); ctx.lineTo(10,0);
    ctx.moveTo(0,4); ctx.lineTo(-7,18);
    ctx.moveTo(0,4); ctx.lineTo(7,18);
    ctx.stroke();
  }},
  { color: "#CC0000", draw: (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.moveTo(0,14);
    ctx.bezierCurveTo(-20,-2,-20,-18,0,-10);
    ctx.bezierCurveTo(20,-18,20,-2,0,14);
    ctx.stroke();
  }},
  { color: "#0101FF", draw: (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.moveTo(0,-14); ctx.lineTo(0,14);
    ctx.moveTo(0,-14); ctx.lineTo(-16,-10); ctx.lineTo(-16,18); ctx.lineTo(0,14);
    ctx.moveTo(0,-14); ctx.lineTo(16,-10); ctx.lineTo(16,18); ctx.lineTo(0,14);
    ctx.moveTo(-14,-4); ctx.lineTo(-4,-4);
    ctx.moveTo(-14,2); ctx.lineTo(-4,2);
    ctx.moveTo(4,-4); ctx.lineTo(14,-4);
    ctx.moveTo(4,2); ctx.lineTo(14,2);
    ctx.stroke();
  }},
  { color: "#CC0000", draw: (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.moveTo(-5,-18); ctx.lineTo(-5,12); ctx.lineTo(5,12); ctx.lineTo(5,-18);
    ctx.closePath();
    ctx.moveTo(-5,12); ctx.lineTo(0,20); ctx.lineTo(5,12);
    ctx.moveTo(-5,-12); ctx.lineTo(5,-12);
    ctx.stroke();
  }},
];

function ShellSketchField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let W = canvas.offsetWidth, H = canvas.offsetHeight;
    canvas.width = W; canvas.height = H;
    const instances = Array.from({ length: 18 }, (_, i) => ({
      sketch: SKETCHES[i % SKETCHES.length],
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      scale: 0.5 + Math.random() * 1.3,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.003,
      alpha: 0.04 + Math.random() * 0.07,
    }));
    let raf: number;
    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      for (const inst of instances) {
        inst.x += inst.vx; inst.y += inst.vy; inst.rotation += inst.rotSpeed;
        if (inst.x < -60) inst.x = W + 60;
        if (inst.x > W + 60) inst.x = -60;
        if (inst.y < -60) inst.y = H + 60;
        if (inst.y > H + 60) inst.y = -60;
        ctx.save();
        ctx.translate(inst.x, inst.y);
        ctx.rotate(inst.rotation);
        ctx.scale(inst.scale, inst.scale);
        ctx.globalAlpha = inst.alpha;
        const isMaroon = inst.sketch.color === "#CC0000";
        ctx.strokeStyle = isMaroon ? "rgba(204,0,0,1)" : "rgba(1,1,255,1)";
        ctx.lineWidth = 1.8 / inst.scale;
        ctx.lineCap = "round"; ctx.lineJoin = "round";
        inst.sketch.draw(ctx);
        ctx.restore();
      }
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0, opacity: 0.35 }}
      aria-hidden="true"
    />
  );
}

// ─── Shell Search Bar ─────────────────────────────────────────────────────────

const SEARCH_PROGRAMS = [
  { label: "Head Start & Early Head Start", icon: "🏫", href: "/#head-start" },
  { label: "Red River Transportation", icon: "🚌", href: "/#transit" },
  { label: "Weatherization & Housing", icon: "🏠", href: "/#weatherization" },
  { label: "Senior Nutrition", icon: "🍽️", href: "/#senior-meals" },
  { label: "Advantage Home Delivered Meals", icon: "🚗", href: "/#advantage" },
  { label: "VITA Free Tax Help", icon: "📋", href: "/#tax-help" },
  { label: "Community Market", icon: "🛒", href: "/#community-market" },
  { label: "Employment & Workforce", icon: "💼", href: "/#employment" },
  { label: "About CADC", icon: "🏛️", href: "/about" },
  { label: "Contact Us", icon: "📞", href: "/contact" },
  { label: "Beckham County", icon: "📍", href: "/#beckham" },
  { label: "Canadian County", icon: "📍", href: "/#canadian" },
  { label: "Comanche County", icon: "📍", href: "/#comanche" },
  { label: "Cotton County", icon: "📍", href: "/#cotton" },
  { label: "Jefferson County", icon: "📍", href: "/#jefferson" },
  { label: "Kiowa County", icon: "📍", href: "/#kiowa" },
  { label: "Roger Mills County", icon: "📍", href: "/#roger-mills" },
  { label: "Tillman County", icon: "📍", href: "/#tillman" },
  { label: "Washita County", icon: "📍", href: "/#washita" },
];

function ShellSearchBar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const results = query.trim().length > 0
    ? SEARCH_PROGRAMS.filter(p => p.label.toLowerCase().includes(query.toLowerCase())).slice(0, 7)
    : [];

  return (
    <div style={{ position: "relative", width: 280 }} role="search">
      <label htmlFor="shell-search" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>
        Search CADC programs and services
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F0F0FF", border: `1px solid ${open ? T.blue : T.border}`, borderRadius: 8, padding: "7px 12px", transition: "border-color 0.2s" }}>
        <span aria-hidden="true" style={{ fontSize: 13, opacity: 0.5 }}>🔍</span>
        <input
          id="shell-search"
          type="search"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Search programs…"
          autoComplete="off"
          aria-autocomplete="list"
          aria-controls="shell-search-results"
          aria-expanded={open && results.length > 0}
          style={{ flex: 1, border: "none", background: "transparent", fontSize: 12, color: T.textPrimary, outline: "none" }}
        />
        {query && (
          <button onClick={() => setQuery("")} aria-label="Clear search" style={{ background: "none", border: "none", cursor: "pointer", color: T.textMuted, fontSize: 16, padding: 0 }}>×</button>
        )}
      </div>
      {open && results.length > 0 && (
        <ul id="shell-search-results" role="listbox" aria-label="Search results" style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "white", border: `1px solid ${T.border}`, borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 200, margin: 0, padding: "6px 0", listStyle: "none" }}>
          {results.map((item, i) => (
            <li key={i} role="option" aria-selected={false}>
              <a href={item.href} onMouseDown={() => setOpen(false)} style={{ width: "100%", padding: "8px 14px", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: T.textPrimary }}
                onMouseEnter={e => (e.currentTarget.style.background = "#F0F0FF")}
                onMouseLeave={e => (e.currentTarget.style.background = "none")}
              >
                <span aria-hidden="true" style={{ fontSize: 14 }}>{item.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 700 }}>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── CADC Shell ───────────────────────────────────────────────────────────────

interface CADCShellProps {
  children: React.ReactNode;
  mainId?: string;
}

export default function CADCShell({ children, mainId = "main-content" }: CADCShellProps) {
  return (
    <div style={{ background: T.void, minHeight: "100vh", fontFamily: "'Space Grotesk', 'Inter', sans-serif", position: "relative" }}>
      {/* ADA skip link */}
      <a
        href={`#${mainId}`}
        style={{ position: "absolute", left: "-9999px", top: "auto", width: 1, height: 1, overflow: "hidden", zIndex: 9999, background: T.blue, color: "white", padding: "12px 20px", fontWeight: 700, fontSize: 14, textDecoration: "none" }}
        onFocus={e => { e.currentTarget.style.left = "0"; e.currentTarget.style.width = "auto"; e.currentTarget.style.height = "auto"; }}
        onBlur={e => { e.currentTarget.style.left = "-9999px"; e.currentTarget.style.width = "1px"; e.currentTarget.style.height = "1px"; }}
      >Skip to main content</a>

      {/* Floating sketch background */}
      <ShellSketchField />

      {/* Survey banner */}
      <a
        href="https://www.surveymonkey.com/r/26cadcneeds"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Take the 2026 CADC Community Needs Survey — your voice shapes our programs (opens in new tab)"
        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: T.maroon, color: "white", padding: "9px 20px", textDecoration: "none", fontSize: 12, fontWeight: 800, letterSpacing: "0.03em", position: "relative", zIndex: 50 }}
      >
        📋 <span>2026 Community Needs Survey — <strong>Make Your Voice Heard</strong></span>
      </a>

      {/* Nav — matches desktop nav in CADCOrbitSite exactly */}
      <nav
        role="navigation"
        aria-label="Main navigation"
        style={{ position: "sticky", top: 0, zIndex: 40, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 48px", borderBottom: `1px solid ${T.border}`, background: "white", boxShadow: "0 1px 12px rgba(1,1,255,0.06)" }}
      >
        <Link href="/" aria-label="CADC home page">
          <img src="/images/cadc-logo.png" alt="CADC Community Action Development Corporation" style={{ height: 44, width: "auto", display: "block" }} />
        </Link>

        <ShellSearchBar />

        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <a
            href="https://www.surveymonkey.com/r/26cadcneeds"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Take the 2026 CADC Community Needs Survey (opens in new tab)"
            style={{ background: T.maroon, color: "white", padding: "8px 16px", borderRadius: 20, fontSize: 11, fontWeight: 800, textDecoration: "none", letterSpacing: "0.04em", whiteSpace: "nowrap" }}
          >
            📋 Take Our Survey
          </a>
          {[
            { label: "About", href: "/about" },
            { label: "Contact", href: "/contact" },
            { label: "580-335-5588", href: "tel:+15803355588" },
          ].map(item => (
            <a
              key={item.label}
              href={item.href}
              style={{ color: T.textMuted, fontSize: 13, fontWeight: 600, textDecoration: "none", letterSpacing: "0.05em", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = T.blue)}
              onMouseLeave={e => (e.currentTarget.style.color = T.textMuted)}
            >{item.label}</a>
          ))}
        </div>
      </nav>

      {/* Page content */}
      <main id={mainId} role="main" style={{ position: "relative", zIndex: 1 }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{ background: "#0A1628", color: "white", padding: "48px 48px 32px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 48, marginBottom: 40 }}>
            {/* Logo + tagline */}
            <div style={{ flex: "1 1 240px" }}>
              <img src="/images/cadc-logo.png" alt="CADC" style={{ height: 56, width: "auto", marginBottom: 16, filter: "brightness(0) invert(1)" }} />
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 1.7, maxWidth: 280 }}>
                Helping People. Changing Lives.<br />
                Serving Southwest Oklahoma since 1966.
              </p>
            </div>

            {/* Programs */}
            <div style={{ flex: "1 1 180px" }}>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>Programs</p>
              {[
                ["Head Start", "/#head-start"],
                ["Red River Transit", "/#transit"],
                ["Weatherization", "/#weatherization"],
                ["Senior Nutrition", "/#senior-meals"],
                ["Community Market", "/#community-market"],
                ["Advantage Meals", "/#advantage"],
                ["VITA Tax Help", "/#tax-help"],
              ].map(([label, href]) => (
                <a key={label} href={href} style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: 13, textDecoration: "none", marginBottom: 8, transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "white")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
                >{label}</a>
              ))}
            </div>

            {/* Contact */}
            <div style={{ flex: "1 1 200px" }}>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>Contact</p>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, lineHeight: 1.8, marginBottom: 12 }}>
                105 S. Main Street<br />
                Frederick, OK 73542
              </p>
              <a href="tel:+15803355588" style={{ color: "white", fontWeight: 700, fontSize: 15, textDecoration: "none", display: "block", marginBottom: 8 }}>580-335-5588</a>
              <a href="/contact" style={{ color: "rgba(1,1,255,0.7)", fontSize: 13, textDecoration: "none", fontWeight: 600 }}>Contact page →</a>
            </div>

            {/* Survey CTA */}
            <div style={{ flex: "1 1 200px" }}>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>Community Input</p>
              <a
                href="https://www.surveymonkey.com/r/26cadcneeds"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "block", background: T.maroon, color: "white", padding: "14px 18px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 13, lineHeight: 1.5 }}
              >
                📋 2026 Community Needs Survey<br />
                <span style={{ fontWeight: 400, fontSize: 11, opacity: 0.8 }}>Your input shapes our programs</span>
              </a>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 24, display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, margin: 0 }}>
              © {new Date().getFullYear()} Community Action Development Corporation · cadcok.org · EEO / Title VI Compliant
            </p>
            <div style={{ display: "flex", gap: 20 }}>
              {[["About", "/about"], ["Contact", "/contact"], ["Privacy", "/privacy"]].map(([label, href]) => (
                <a key={label} href={href} style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "white")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
                >{label}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ADA + focus styles */}
      <style>{`
        *:focus-visible { outline: 3px solid #0101FF !important; outline-offset: 3px !important; border-radius: 4px; }
        @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }
        @media (forced-colors: active) { button, a { border: 1px solid ButtonText; } }
      `}</style>
    </div>
  );
}
