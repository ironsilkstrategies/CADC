"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { CADCHeader, CADCFooter } from "./CADCOrbitSite";

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

      <CADCHeader />

      {/* Page content */}
      <main id={mainId} role="main" style={{ position: "relative", zIndex: 1 }}>
        {children}
      </main>

      <CADCFooter />

      {/* ADA + focus styles */}
      <style>{`
        *:focus-visible { outline: 3px solid #0101FF !important; outline-offset: 3px !important; border-radius: 4px; }
        @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }
        @media (forced-colors: active) { button, a { border: 1px solid ButtonText; } }
      `}</style>
    </div>
  );
}
