"use client";

import Link from "next/link";
import { useState } from "react";
import { programs, programHref } from "@/lib/programs";
import { contact } from "@/lib/org";

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[var(--cadc-border)] shadow-sm">
      {/* Top utility bar */}
      <div className="bg-[var(--cadc-blue)] text-white text-sm">
        <div className="mx-auto max-w-7xl px-4 flex items-center justify-between h-9">
          <span className="hidden sm:inline">
            Serving 16–17 counties across Southwest Oklahoma
          </span>
          <a
            href={contact.transitPhoneHref}
            className="flex items-center gap-1.5 font-semibold hover:underline"
          >
            📞 Ride the River: {contact.transitPhone}
          </a>
        </div>
      </div>

      {/* Main nav */}
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-full border-2 border-[var(--cadc-blue)] flex items-center justify-center bg-white group-hover:shadow-md transition-shadow">
              <span
                className="text-[var(--cadc-blue)] font-bold text-lg"
                style={{ fontFamily: "Georgia, serif" }}
              >
                CADC
              </span>
            </div>
            <div className="hidden md:block leading-tight">
              <div className="font-bold text-[var(--cadc-blue)] text-sm">
                Community Action
              </div>
              <div className="text-xs text-[var(--cadc-gray)]">
                Development Corporation
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <div className="relative group">
              <button className="px-3 py-2 text-sm font-semibold text-[var(--cadc-ink)] hover:text-[var(--cadc-blue)] flex items-center gap-1">
                Programs
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
              <div className="absolute top-full left-0 pt-2 hidden group-hover:block group-focus-within:block">
                <div className="w-72 bg-white border border-[var(--cadc-border)] rounded-lg shadow-lg py-2">
                  {programs.map((p) => (
                    <Link
                      key={p.slug}
                      href={programHref(p.slug)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--cadc-blue-light)] text-sm"
                    >
                      <span aria-hidden="true">{p.icon}</span>
                      <span className="text-[var(--cadc-ink)]">{p.shortName}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <Link
              href="/locations"
              className="px-3 py-2 text-sm font-semibold text-[var(--cadc-ink)] hover:text-[var(--cadc-blue)]"
            >
              Locations
            </Link>
            <Link
              href="/about"
              className="px-3 py-2 text-sm font-semibold text-[var(--cadc-ink)] hover:text-[var(--cadc-blue)]"
            >
              About
            </Link>
          </nav>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 -mr-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span className="h-0.5 bg-[var(--cadc-blue)] rounded-full" />
              <span className="h-0.5 bg-[var(--cadc-blue)] rounded-full" />
              <span className="h-0.5 bg-[var(--cadc-blue)] rounded-full" />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-[var(--cadc-border)] bg-white">
          <div className="px-4 py-3 flex flex-col gap-1">
            {programs.map((p) => (
              <Link
                key={p.slug}
                href={programHref(p.slug)}
                className="flex items-center gap-3 px-3 py-3 rounded-md hover:bg-[var(--cadc-blue-light)] text-sm"
                onClick={() => setMenuOpen(false)}
              >
                <span aria-hidden="true">{p.icon}</span>
                <span>{p.shortName}</span>
              </Link>
            ))}
            <Link
              href="/locations"
              className="px-3 py-3 text-sm font-semibold border-t border-[var(--cadc-border)] mt-2 pt-3"
              onClick={() => setMenuOpen(false)}
            >
              Locations
            </Link>
            <Link
              href="/about"
              className="px-3 py-3 text-sm font-semibold"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
