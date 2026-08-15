"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { programs, programHref, type ProgramSlug } from "@/lib/programs";
import { org } from "@/lib/org";

const RADIUS_PCT = 39;
const START_DEG = -90;
const DESKTOP_MIN = 860;

interface Point { x: number; y: number }

function nodePosition(index: number, total: number): Point {
  const angle = START_DEG + (index / total) * 360;
  const rad = (angle * Math.PI) / 180;
  return {
    x: 50 + RADIUS_PCT * Math.cos(rad),
    y: 50 + RADIUS_PCT * Math.sin(rad),
  };
}

export default function OrbitHero() {
  const [revealed, setRevealed] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const [activeSlug, setActiveSlug] = useState<ProgramSlug | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const sheetRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const active = programs.find((p) => p.slug === activeSlug) ?? null;
  const activeIndex = programs.findIndex((p) => p.slug === activeSlug);

  // ── Breakpoint ──
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${DESKTOP_MIN}px)`);
    const sync = () => {
      setIsDesktop(mq.matches);
      setActiveSlug(null); // never strand a callout in the wrong mode
    };
    setIsDesktop(mq.matches);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // ── Reveal ──
  const reveal = useCallback(() => {
    setRevealed((already) => {
      if (already) return already;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        setVisibleCount(programs.length);
      } else {
        programs.forEach((_, i) => {
          timers.current.push(
            setTimeout(() => setVisibleCount((c) => Math.max(c, i + 1)), 80 + i * 85)
          );
        });
      }
      return true;
    });
  }, []);

  // Auto-reveal for reduced motion; Tab reveals for keyboard users
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) reveal();
    const onTab = (e: KeyboardEvent) => { if (e.key === "Tab") reveal(); };
    window.addEventListener("keydown", onTab, { once: true });
    return () => {
      window.removeEventListener("keydown", onTab);
      timers.current.forEach(clearTimeout);
    };
  }, [reveal]);

  // ── Sheet: body scroll lock, Escape, focus trap ──
  const sheetOpen = !!active && !isDesktop;

  useEffect(() => {
    if (!sheetOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { close(); return; }
      if (e.key !== "Tab" || !sheetRef.current) return;
      const f = sheetRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKey);

    const cta = sheetRef.current?.querySelector<HTMLElement>("a,button");
    const t = setTimeout(() => cta?.focus(), 60);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [sheetOpen]);

  function close() {
    const i = activeIndex;
    setActiveSlug(null);
    if (i >= 0) nodeRefs.current[i]?.focus();
  }

  function toggle(slug: ProgramSlug) {
    setActiveSlug((cur) => (cur === slug ? null : slug));
  }

  // ── Callout body, shared by sheet and desktop panel ──
  const calloutBody = active && (
    <>
      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-[var(--cadc-blue-light)] opacity-70">
        CADC Program
      </p>
      <h2 id="calloutTitle" className="mt-1.5 flex items-center gap-2.5 font-serif text-2xl font-bold leading-tight text-white">
        <span aria-hidden="true">{active.icon}</span>
        {active.name}
      </h2>
      <p className="mt-2.5 text-[0.92rem] leading-relaxed text-[var(--cadc-blue-light)]">
        {active.blurb}
      </p>
      <Link
        href={programHref(active.slug)}
        className="mt-4 flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-[10px] bg-[var(--cadc-maroon)] px-5 py-4 text-[0.92rem] font-bold uppercase tracking-[0.06em] text-white transition-colors hover:bg-[var(--cadc-maroon-dark)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-white"
      >
        Go to {active.shortName} <span aria-hidden="true">→</span>
      </Link>
    </>
  );

  return (
    <>
      <a href="#program-list" className="sr-only focus:not-sr-only focus:absolute focus:left-0 focus:top-0 focus:z-[999] focus:bg-[var(--cadc-blue)] focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white">
        Skip to program list
      </a>

      <section className="relative flex min-h-[100svh] w-full items-center justify-center px-3 pb-24 pt-[76px] cadc-grid-bg">
        <div
          className="relative aspect-square"
          style={{ width: "min(78vw, 82svh, 560px)" }}
        >
          {/* Orbit ring */}
          <div
            className={`absolute inset-[11%] rounded-full border-[1.5px] border-dashed border-[rgba(1,1,255,0.16)] transition-all duration-[600ms] ${
              revealed ? "scale-100 opacity-100" : "scale-[0.6] opacity-0"
            }`}
          />

          {/* Connectors */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {programs.map((p, i) => {
              const { x, y } = nodePosition(i, programs.length);
              const on = i < visibleCount;
              const isActive = p.slug === activeSlug;
              return (
                <line
                  key={p.slug}
                  x1={50} y1={50} x2={x} y2={y}
                  stroke={isActive ? "var(--cadc-maroon)" : "rgba(126,0,1,0.30)"}
                  strokeWidth={isActive ? 1.8 : 1}
                  strokeDasharray="4 4"
                  className="transition-opacity duration-500"
                  style={{ opacity: on ? 1 : 0 }}
                />
              );
            })}
          </svg>

          {/* Center logo */}
          <button
            type="button"
            onClick={() => { if (!revealed) reveal(); else window.location.href = "/"; }}
            onMouseEnter={() => { if (window.matchMedia("(hover: hover)").matches) reveal(); }}
            aria-expanded={revealed}
            aria-label={revealed ? "Go to CADC home" : "Show all CADC programs"}
            className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center transition-transform duration-300 hover:scale-[1.04] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-8 focus-visible:outline-[var(--cadc-maroon)]"
          >
            <span
              className="flex aspect-square flex-col items-center justify-center gap-0.5 rounded-full border-[3px] border-[var(--cadc-blue)] bg-white p-2.5 transition-shadow duration-300"
              style={{
                width: "clamp(96px, 26%, 150px)",
                boxShadow: "0 0 0 6px rgba(1,1,255,0.07), 0 8px 32px rgba(1,1,255,0.16)",
              }}
            >
              <span className="font-serif font-bold leading-none text-[var(--cadc-blue)]" style={{ fontSize: "clamp(1.4rem, 5vw, 2.3rem)", letterSpacing: "0.04em" }}>
                CADC
              </span>
              <span className="my-1 h-0.5 w-[38px] bg-[var(--cadc-maroon)]" />
              <span className="text-center font-semibold uppercase leading-[1.4] tracking-[0.06em] text-[#4a4a6a]" style={{ fontSize: "clamp(0.34rem, 1.1vw, 0.46rem)" }}>
                Community Action<br />Development Corp.
              </span>
            </span>
            <span
              className={`mt-2.5 whitespace-nowrap font-medium uppercase tracking-[0.12em] text-[var(--cadc-blue)] transition-opacity duration-[400ms] ${revealed ? "opacity-0" : "opacity-60"}`}
              style={{ fontSize: "clamp(0.52rem, 1.5vw, 0.64rem)" }}
            >
              Tap to explore programs
            </span>
          </button>

          {/* Program nodes */}
          {programs.map((p, i) => {
            const { x, y } = nodePosition(i, programs.length);
            const on = i < visibleCount;
            const isActive = p.slug === activeSlug;
            return (
              <button
                key={p.slug}
                ref={(el) => { nodeRefs.current[i] = el; }}
                type="button"
                tabIndex={on ? 0 : -1}
                onClick={() => toggle(p.slug)}
                aria-expanded={isActive}
                aria-label={`${p.name} — view details`}
                className={`group absolute flex w-[92px] flex-col items-center gap-1.5 transition-all duration-500 ${
                  on ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none scale-[0.4] opacity-0"
                }`}
                style={{ left: `${x}%`, top: `${y}%`, transform: `translate(-50%, -50%) scale(${on ? 1 : 0.4})` }}
              >
                <span
                  className={`flex aspect-square items-center justify-center rounded-full border-[2.5px] bg-white leading-none transition-all duration-[250ms] group-hover:scale-[1.12] group-focus-visible:outline group-focus-visible:outline-[3px] group-focus-visible:outline-offset-4 group-focus-visible:outline-[var(--cadc-maroon)] ${
                    isActive ? "scale-[1.12] border-[var(--cadc-maroon)]" : "border-[var(--cadc-blue)] group-hover:border-[var(--cadc-maroon)]"
                  }`}
                  style={{
                    width: "clamp(44px, 11vw, 64px)",
                    fontSize: "clamp(0.95rem, 2.9vw, 1.4rem)",
                    boxShadow: "0 3px 12px rgba(1,1,255,0.12)",
                  }}
                  aria-hidden="true"
                >
                  {p.icon}
                </span>
                <span
                  className="w-[92px] break-words text-center font-semibold uppercase leading-[1.25] tracking-[0.06em] text-[var(--cadc-blue)]"
                  style={{ fontSize: "clamp(0.48rem, 1.5vw, 0.62rem)" }}
                >
                  {p.shortName}
                </span>
              </button>
            );
          })}

          {/* Desktop callout — dedicated space below the orbit */}
          {isDesktop && (
            <div
              role="region"
              aria-live="polite"
              className={`absolute left-1/2 top-[calc(100%+20px)] z-30 w-[min(420px,90vw)] -translate-x-1/2 rounded-[14px] bg-[var(--cadc-blue)] px-6 py-[22px] transition-opacity duration-300 ${
                active ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
              }`}
              style={{ boxShadow: "0 12px 40px rgba(1,1,255,0.26)" }}
            >
              {calloutBody}
            </div>
          )}
        </div>

        <p
          className={`fixed bottom-[22px] left-1/2 z-[5] w-full -translate-x-1/2 px-3 text-center font-medium uppercase tracking-[0.13em] text-[#4a4a6a] transition-opacity duration-[800ms] ${
            revealed ? "opacity-100" : "opacity-0"
          }`}
          style={{ fontSize: "clamp(0.52rem, 1.6vw, 0.7rem)" }}
        >
          {org.serviceAreaLabel}
        </p>
      </section>

      {/* Mobile bottom sheet */}
      {!isDesktop && (
        <>
          <div
            onClick={close}
            className={`fixed inset-0 z-50 bg-[rgba(0,0,80,0.45)] backdrop-blur-[2px] transition-opacity duration-300 ${
              sheetOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
            }`}
          />
          <div
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="calloutTitle"
            aria-hidden={!sheetOpen}
            className="fixed inset-x-0 bottom-0 z-[60] max-h-[78svh] overflow-y-auto rounded-t-[20px] bg-[var(--cadc-blue)] px-[22px] pt-2.5"
            style={{
              paddingBottom: "calc(24px + env(safe-area-inset-bottom))",
              transform: sheetOpen ? "translateY(0)" : "translateY(100%)",
              transition: "transform 0.42s cubic-bezier(0.32,0.72,0,1)",
              boxShadow: "0 -8px 40px rgba(0,0,80,0.32)",
            }}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/35" />
            {calloutBody}
            <button
              type="button"
              onClick={close}
              className="mt-3 w-full p-3 text-[0.8rem] font-semibold uppercase tracking-[0.1em] text-[var(--cadc-blue-light)] opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              Close
            </button>
          </div>
        </>
      )}

      {/* Non-visual navigation fallback — always present, never gated */}
      <nav id="program-list" className="sr-only" aria-label="CADC programs">
        <ul>
          {programs.map((p) => (
            <li key={p.slug}>
              <Link href={programHref(p.slug)}>{p.name}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
