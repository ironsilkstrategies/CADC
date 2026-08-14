"use client";

import Link from "next/link";
import { useState } from "react";
import { programs } from "@/lib/programs";

export default function OrbitHero() {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const active = programs.find((p) => p.slug === activeSlug);

  // Fixed coordinate space (SVG viewBox handles the actual scaling —
  // the wrapper is capped by CSS so it can never exceed the viewport,
  // which is what caused the mobile clipping in the static prototype).
  const radius = 230;
  const cx = 0;
  const cy = 0;

  return (
    <section className="cadc-grid-bg relative overflow-hidden py-12 md:py-24">
      <div className="cadc-grid-fade" />

      <div className="relative mx-auto max-w-5xl px-4">
        {/* Eyebrow + heading */}
        <div className="text-center mb-8 md:mb-10">
          <p className="text-xs font-bold tracking-widest text-[var(--cadc-red)] uppercase mb-2">
            Serving 16–17 Counties in Southwest Oklahoma
          </p>
          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--cadc-blue)] mb-3"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Nine programs. One community.
          </h1>
          <p className="text-sm sm:text-base text-[var(--cadc-ink-soft)] max-w-xl mx-auto px-2">
            Tap a program below to see what CADC offers — or jump straight to{" "}
            <Link
              href="/programs/head-start"
              className="text-[var(--cadc-blue)] font-semibold underline underline-offset-2"
            >
              Head Start enrollment
            </Link>
            .
          </p>
        </div>

        {/* Orbit diagram — square aspect-ratio box that scales down to
            fit the viewport with side padding, never overflows */}
        <div
          className="relative mx-auto w-full"
          style={{
            maxWidth: 560,
            aspectRatio: "1 / 1",
          }}
        >
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="-280 -280 560 560"
            aria-hidden="true"
          >
            <circle
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke="rgba(0,48,135,0.12)"
              strokeWidth="1.5"
              strokeDasharray="2 6"
            />
            {programs.map((p, i) => {
              const angle = -90 + (i / programs.length) * 360;
              const rad = (angle * Math.PI) / 180;
              const x = cx + radius * Math.cos(rad);
              const y = cy + radius * Math.sin(rad);
              return (
                <line
                  key={p.slug}
                  x1={cx}
                  y1={cy}
                  x2={x}
                  y2={y}
                  stroke="rgba(204,0,0,0.15)"
                  strokeWidth="1"
                  strokeDasharray="3 5"
                />
              );
            })}
          </svg>

          {/* Center logo — sized in % of container so it scales with the box */}
          <div
            className="absolute rounded-full bg-white border-[3px] border-[var(--cadc-blue)] flex flex-col items-center justify-center shadow-lg"
            style={{
              width: "26.5%",
              height: "26.5%",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              boxShadow:
                "0 0 0 8px rgba(0,48,135,0.07), 0 10px 30px rgba(0,48,135,0.15)",
            }}
          >
            <span
              className="text-[var(--cadc-blue)] font-bold"
              style={{ fontFamily: "Georgia, serif", fontSize: "clamp(14px, 4vw, 24px)" }}
            >
              CADC
            </span>
            <div className="w-[24%] h-[3px] bg-[var(--cadc-red)] my-1" />
            <span
              className="font-bold text-[var(--cadc-ink-soft)] uppercase tracking-wide text-center leading-tight px-2"
              style={{ fontSize: "clamp(6px, 1.6vw, 9px)" }}
            >
              Community Action
              <br />
              Development Corp.
            </span>
          </div>

          {/* Program nodes — positioned in % coords so they scale with the box */}
          {programs.map((p, i) => {
            const angle = -90 + (i / programs.length) * 360;
            const rad = (angle * Math.PI) / 180;
            // radius as % of half-width (280 = half of 560 viewBox)
            const xPct = (radius / 280) * Math.cos(rad) * 50;
            const yPct = (radius / 280) * Math.sin(rad) * 50;
            const isActive = activeSlug === p.slug;

            return (
              <button
                key={p.slug}
                onClick={() => setActiveSlug(isActive ? null : p.slug)}
                className="absolute flex flex-col items-center gap-1 group"
                style={{
                  left: `calc(50% + ${xPct}%)`,
                  top: `calc(50% + ${yPct}%)`,
                  transform: "translate(-50%, -50%)",
                }}
                aria-expanded={isActive}
                aria-label={`${p.name} — ${p.tagline}`}
              >
                <span
                  className={`rounded-full bg-white border-2 flex items-center justify-center shadow-md transition-all
                    ${isActive ? "border-[var(--cadc-red)] scale-110 shadow-lg" : "border-[var(--cadc-blue)] group-hover:scale-105"}
                  `}
                  style={{
                    width: "clamp(38px, 11.5vw, 64px)",
                    height: "clamp(38px, 11.5vw, 64px)",
                    fontSize: "clamp(14px, 4vw, 24px)",
                  }}
                >
                  <span aria-hidden="true">{p.icon}</span>
                </span>
                <span
                  className="font-bold text-[var(--cadc-blue)] uppercase tracking-wide text-center leading-tight"
                  style={{
                    fontSize: "clamp(7px, 2vw, 11px)",
                    maxWidth: "clamp(52px, 15vw, 90px)",
                    textShadow: "0 1px 4px rgba(255,255,255,0.9)",
                  }}
                >
                  {p.shortName}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active program callout */}
        {active && (
          <div className="mt-8 mx-auto max-w-md bg-white border-2 border-[var(--cadc-blue)] rounded-xl p-5 shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-start gap-3">
              <span className="text-3xl" aria-hidden="true">
                {active.icon}
              </span>
              <div className="flex-1">
                <h2 className="font-bold text-[var(--cadc-blue)]">
                  {active.name}
                </h2>
                <p className="text-sm text-[var(--cadc-ink-soft)] mt-1">
                  {active.description}
                </p>
                <Link
                  href={active.href}
                  className="inline-flex items-center gap-1 mt-3 text-sm font-bold text-[var(--cadc-red)] hover:underline"
                >
                  {active.tagline} →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
