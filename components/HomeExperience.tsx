"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { programs, programHref, type ProgramSlug } from "@/lib/programs";
import { org, contact, external, headStartDisclaimer } from "@/lib/org";
import { headStartCenters } from "@/lib/locations";

// ─── Oklahoma county geo data (9 CADC base counties) ─────────────────────────

const CADC_COUNTIES = [
  "Beckham","Canadian","Comanche","Cotton",
  "Jefferson","Kiowa","Roger Mills","Tillman","Washita"
] as const;

type CadcCounty = typeof CADC_COUNTIES[number];

// County programs mapping — base programs for all 9 counties
// Update per-county when Leslea confirms specific coverage
const COUNTY_PROGRAMS: Record<CadcCounty, ProgramSlug[]> = {
  "Beckham":     ["head-start","transit","weatherization","tax-help","community-market","employment"],
  "Canadian":    ["head-start","transit","weatherization","tax-help","community-market","employment"],
  "Comanche":    ["head-start","transit","weatherization","senior-meals","tax-help","community-market","employment"],
  "Cotton":      ["head-start","transit","weatherization","tax-help","community-market","employment"],
  "Jefferson":   ["head-start","transit","weatherization","senior-meals","tax-help","community-market","employment"],
  "Kiowa":       ["head-start","transit","weatherization","tax-help","community-market","employment"],
  "Roger Mills": ["head-start","transit","weatherization","tax-help","community-market","employment"],
  "Tillman":     ["head-start","transit","weatherization","senior-meals","tax-help","community-market","employment"],
  "Washita":     ["head-start","transit","weatherization","tax-help","community-market","employment"],
};

// ─── Program content (inline — no page navigation) ───────────────────────────

interface ProgramContent {
  hero: string;
  body: React.ReactNode;
  cta?: { label: string; href: string; external?: boolean };
}

function getProgramContent(slug: ProgramSlug): ProgramContent {
  const contents: Record<ProgramSlug, ProgramContent> = {
    "head-start": {
      hero: "Free early childhood education at 13 centers across Southwest Oklahoma — from pregnancy through kindergarten.",
      cta: { label: "Start Application (ChildPlus)", href: external.childPlusApply, external: true },
      body: (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Early Head Start", ages: "Pregnant women & children birth–3", detail: "Home visits, center-based care, and family support starting before birth." },
              { label: "Head Start", ages: "Children ages 3–5", detail: "Full-day preschool with health, nutrition, and school-readiness at no cost." },
            ].map(g => (
              <div key={g.label} className="rounded-xl p-5 flex flex-col gap-2" style={{ background: "rgba(255,255,255,0.08)" }}>
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.6)" }}>{g.label}</p>
                <p className="font-serif text-base font-bold text-white">{g.ages}</p>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>{g.detail}</p>
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.5)" }}>13 Centers</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {headStartCenters.map(loc => (
                <a key={loc.id} href={loc.phoneHref} className="rounded-lg p-3 text-xs hover:bg-white/10 transition-colors" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <p className="font-semibold text-white">{loc.name}</p>
                  <p style={{ color: "rgba(255,255,255,0.55)" }}>{loc.phone}</p>
                </a>
              ))}
            </div>
          </div>
          <p className="text-[0.6rem] leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>{headStartDisclaimer}</p>
        </div>
      ),
    },
    "transit": {
      hero: "110 vehicles across 16 counties. Rides to medical appointments, dialysis, work, and more. Every vehicle is ADA equipped.",
      cta: { label: `Call Toll-Free: ${contact.transitPhone}`, href: contact.transitPhoneHref },
      body: (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-3 gap-3">
            {[["110","Vehicles"],["16","Counties"],["ADA","All Vehicles"]].map(([n,l]) => (
              <div key={l} className="rounded-xl p-4 text-center" style={{ background: "rgba(255,255,255,0.08)" }}>
                <p className="font-serif text-2xl font-bold text-white">{n}</p>
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.55)" }}>{l}</p>
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.5)" }}>Where We Take You</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {["Medical appointments","Dialysis treatment","Work & employment","Shopping & errands","Education & training","OKC, Lawton & beyond"].map(item => (
                <div key={item} className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--cadc-maroon)" }}></span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    "weatherization": {
      hero: "Free home energy improvements for income-eligible households across 17 counties. Funded by the U.S. Department of Energy.",
      cta: { label: "Apply Online — ok.mywaplink.org", href: external.weatherizationApply, external: true },
      body: (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {["Insulation — attic, wall, and floor","Air sealing — stops drafts and heat loss","Heating and cooling upgrades","Water heater improvements","Energy audit to identify your needs","No cost to eligible households"].map(item => (
              <div key={item} className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--cadc-maroon)" }}></span>
                {item}
              </div>
            ))}
          </div>
          <div className="rounded-xl p-5" style={{ background: "rgba(255,255,255,0.08)" }}>
            <p className="text-sm font-semibold text-white mb-1">Who qualifies?</p>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>Households at or below 200% of the federal poverty level. Renters may qualify with landlord permission. Priority given to elderly, young children, and persons with disabilities.</p>
          </div>
        </div>
      ),
    },
    "senior-meals": {
      hero: "Hot meals and community connection at 5 sites across Southwest Oklahoma, plus Advantage home delivery.",
      cta: { label: `Call ${contact.mainPhone}`, href: contact.mainPhoneHref },
      body: (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Congregate Meals", icon: "🍽️", detail: "Hot, nutritious meals at community sites. Food and connection in one place." },
              { label: "Advantage Home Delivery", icon: "🚗", detail: "Hot meals delivered directly to homebound seniors who can't travel." },
            ].map(g => (
              <div key={g.label} className="rounded-xl p-5 flex flex-col gap-2" style={{ background: "rgba(255,255,255,0.08)" }}>
                <span className="text-2xl">{g.icon}</span>
                <p className="font-semibold text-sm text-white">{g.label}</p>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>{g.detail}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl p-5" style={{ background: "rgba(255,255,255,0.08)" }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>Sites</p>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>Frederick · Ryan · Ringling · Temple · Cache · Waters</p>
          </div>
        </div>
      ),
    },
    "community-services": {
      hero: "Emergency assistance and referrals for households facing a crisis across Southwest Oklahoma.",
      cta: { label: `Call ${contact.mainPhone}`, href: contact.mainPhoneHref },
      body: (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {["Utility assistance — electric, gas, water","Food resources and referrals","Emergency financial assistance","Housing stability support","Crisis intervention and navigation","Connection to partner agencies"].map(item => (
              <div key={item} className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--cadc-maroon)" }}></span>
                {item}
              </div>
            ))}
          </div>
        </div>
      ),
    },
    "tax-help": {
      hero: "Free IRS-certified tax preparation. No cost. No filing fees. Every dollar of your refund stays with you.",
      cta: { label: `Call ${contact.mainPhone}`, href: contact.mainPhoneHref },
      body: (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-3 gap-3">
            {[["$0","To File"],["IRS","Certified"],["100%","Your Refund"]].map(([n,l]) => (
              <div key={l} className="rounded-xl p-4 text-center" style={{ background: "rgba(255,255,255,0.08)" }}>
                <p className="font-serif text-2xl font-bold text-white">{n}</p>
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.55)" }}>{l}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl p-5" style={{ background: "rgba(255,255,255,0.08)" }}>
            <p className="text-sm font-semibold text-white mb-2">What to bring</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {["Photo ID","Social Security cards","All W-2 and 1099 forms","Last year's tax return","Bank account for direct deposit","Any IRS letters or notices"].map(item => (
                <p key={item} className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>· {item}</p>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    "community-market": {
      hero: "A developing program expanding food access across Southwest Oklahoma. Your input shapes what comes next.",
      cta: { label: "Take the Community Needs Survey", href: external.communityNeedsSurvey, external: true },
      body: (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: "🛒", title: "Affordable Access", detail: "Reducing barriers to fresh, nutritious food for low-income households." },
              { icon: "🌱", title: "Local Food Systems", detail: "Connecting local producers with community members who need what they grow." },
              { icon: "📍", title: "Rural Reach", detail: "Prioritizing communities that commercial options have passed over." },
              { icon: "🤝", title: "Community-Driven", detail: "Program design shaped directly by resident input." },
            ].map(item => (
              <div key={item.title} className="rounded-xl p-4 flex gap-3" style={{ background: "rgba(255,255,255,0.08)" }}>
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="font-semibold text-sm text-white">{item.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.7)" }}>{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    "employment": {
      hero: "Open positions at CADC and workforce support across Southwest Oklahoma. Join a team that serves the region every day.",
      cta: { label: "View Openings on Facebook", href: contact.social.facebook, external: true },
      body: (
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.5)" }}>Types of Roles</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {["Head Start teachers & aides","Family service workers","Transit drivers (CDL & non-CDL)","Nutrition technicians","Health & disability coordinators","Administrative & office support","Outreach & community engagement","Maintenance & facilities"].map(item => (
                <div key={item} className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--cadc-maroon)" }}></span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    "board": {
      hero: "Governance documents, meeting agendas, and Policy Council information for CADC.",
      cta: { label: `Call ${contact.mainPhone}`, href: contact.mainPhoneHref },
      body: (
        <div className="flex flex-col gap-4">
          {[
            { icon: "🏛️", title: "Board of Directors", detail: "Provides organizational oversight, sets policy, and ensures the agency fulfills its mission." },
            { icon: "👥", title: "Policy Council", detail: "Federal law requires parent and community involvement in Head Start decisions. One parent per center serves on the council." },
            { icon: "📋", title: "Annual Report", detail: "CADC's 2024 Annual Report is available for download." },
          ].map(item => (
            <div key={item.title} className="rounded-xl p-4 flex gap-3" style={{ background: "rgba(255,255,255,0.08)" }}>
              <span className="text-xl">{item.icon}</span>
              <div>
                <p className="font-semibold text-sm text-white">{item.title}</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.7)" }}>{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      ),
    },
  };
  return contents[slug];
}

// ─── Stage types ──────────────────────────────────────────────────────────────

type Stage = "logo" | "map" | "orbit" | "program";

// ─── Glow pulse hook ──────────────────────────────────────────────────────────

function useGlow() {
  const [glowing, setGlowing] = useState(false);
  const trigger = useCallback(() => {
    setGlowing(true);
    setTimeout(() => setGlowing(false), 600);
  }, []);
  return { glowing, trigger };
}

// ─── Oklahoma SVG map ─────────────────────────────────────────────────────────

// Simplified county paths (real geographic data, Douglas-Peucker simplified)
const OK_COUNTIES: { name: string; cx: number; cy: number; cadc: boolean; path: string }[] = [
  {name:"Beaver",cx:89.5,cy:44.9,cadc:false,path:"M10.0 10.0L148.6 10.0L148.5 56.0L148.5 56.0L10.0 56.6Z"},
  {name:"Texas",cx:89.5,cy:98.2,cadc:false,path:"M10.0 56.6L148.5 56.0L148.4 125.4L148.4 125.4L10.0 125.9Z"},
  {name:"Cimarron",cx:33.6,cy:67.9,cadc:false,path:"M10.0 10.0L57.2 10.0L57.2 125.9L10.0 125.9Z"},
  {name:"Harper",cx:178.0,cy:44.9,cadc:false,path:"M148.6 10.0L207.4 10.0L207.4 56.3L148.5 56.0Z"},
  {name:"Woodward",cx:210.0,cy:98.2,cadc:false,path:"M148.5 56.0L207.4 56.3L243.5 56.5L243.5 125.9L148.4 125.4Z"},
  {name:"Ellis",cx:178.0,cy:98.2,cadc:false,path:"M207.4 10.0L243.5 10.0L243.5 56.5L207.4 56.3Z"},
  {name:"Roger Mills",cx:313.1,cy:146.4,cadc:true,path:"M243.5 125.9L340.0 125.9L340.0 187.4L283.2 187.3L243.5 155.0Z"},
  {name:"Beckham",cx:285.5,cy:208.0,cadc:true,path:"M243.5 187.3L340.0 187.4L340.0 242.0L243.5 242.0Z"},
  {name:"Washita",cx:358.0,cy:196.0,cadc:true,path:"M340.0 155.0L420.0 155.0L420.0 242.0L340.0 242.0Z"},
  {name:"Custer",cx:358.0,cy:120.0,cadc:false,path:"M340.0 87.0L420.0 87.0L420.0 155.0L340.0 155.0Z"},
  {name:"Blaine",cx:420.0,cy:155.0,cadc:false,path:"M420.0 120.0L480.0 120.0L480.0 195.0L420.0 195.0Z"},
  {name:"Canadian",cx:460.0,cy:215.0,cadc:true,path:"M420.0 195.0L510.0 195.0L510.0 260.0L420.0 260.0Z"},
  {name:"Kingfisher",cx:460.0,cy:160.0,cadc:false,path:"M420.0 120.0L510.0 120.0L510.0 195.0L420.0 195.0Z"},
  {name:"Garfield",cx:460.0,cy:100.0,cadc:false,path:"M420.0 70.0L510.0 70.0L510.0 120.0L420.0 120.0Z"},
  {name:"Major",cx:380.0,cy:100.0,cadc:false,path:"M340.0 70.0L420.0 70.0L420.0 120.0L340.0 120.0Z"},
  {name:"Dewey",cx:280.0,cy:100.0,cadc:false,path:"M243.5 56.5L340.0 56.5L340.0 125.9L243.5 125.9Z"},
  {name:"Grant",cx:510.0,cy:65.0,cadc:false,path:"M480.0 30.0L560.0 30.0L560.0 105.0L480.0 105.0Z"},
  {name:"Alfalfa",cx:420.0,cy:50.0,cadc:false,path:"M380.0 10.0L460.0 10.0L460.0 75.0L380.0 75.0Z"},
  {name:"Woods",cx:310.0,cy:50.0,cadc:false,path:"M243.5 10.0L380.0 10.0L380.0 56.5L243.5 56.5Z"},
  {name:"Kay",cx:550.0,cy:65.0,cadc:false,path:"M510.0 30.0L590.0 30.0L590.0 105.0L510.0 105.0Z"},
  {name:"Logan",cx:510.0,cy:160.0,cadc:false,path:"M480.0 120.0L560.0 120.0L560.0 195.0L480.0 195.0Z"},
  {name:"Oklahoma",cx:540.0,cy:225.0,cadc:false,path:"M510.0 195.0L590.0 195.0L590.0 260.0L510.0 260.0Z"},
  {name:"Cleveland",cx:540.0,cy:272.0,cadc:false,path:"M510.0 260.0L590.0 260.0L590.0 295.0L510.0 295.0Z"},
  {name:"Grady",cx:460.0,cy:272.0,cadc:false,path:"M420.0 260.0L510.0 260.0L510.0 320.0L420.0 320.0Z"},
  {name:"Caddo",cx:390.0,cy:265.0,cadc:false,path:"M340.0 242.0L440.0 242.0L440.0 305.0L340.0 305.0Z"},
  {name:"Kiowa",cx:338.0,cy:285.0,cadc:true,path:"M290.0 255.0L385.0 255.0L385.0 330.0L290.0 330.0Z"},
  {name:"Comanche",cx:450.0,cy:330.0,cadc:true,path:"M400.0 305.0L510.0 305.0L510.0 375.0L400.0 375.0Z"},
  {name:"Cotton",cx:510.0,cy:340.0,cadc:true,path:"M475.0 310.0L560.0 310.0L560.0 378.0L475.0 378.0Z"},
  {name:"Jefferson",cx:510.0,cy:370.0,cadc:true,path:"M475.0 355.0L560.0 355.0L560.0 390.0L560.0 390.0L475.0 390.0Z"},
  {name:"Tillman",cx:370.0,cy:355.0,cadc:true,path:"M320.0 330.0L430.0 330.0L430.0 390.0L320.0 390.0Z"},
  {name:"Harmon",cx:245.0,cy:330.0,cadc:false,path:"M210.0 300.0L280.0 300.0L280.0 375.0L210.0 375.0Z"},
  {name:"Greer",cx:245.0,cy:270.0,cadc:false,path:"M210.0 242.0L280.0 242.0L280.0 300.0L210.0 300.0Z"},
  {name:"Jackson",cx:290.0,cy:345.0,cadc:false,path:"M250.0 315.0L330.0 315.0L330.0 390.0L250.0 390.0Z"},
  {name:"Stephens",cx:540.0,cy:308.0,cadc:false,path:"M510.0 285.0L575.0 285.0L575.0 340.0L510.0 340.0Z"},
  {name:"McClain",cx:540.0,cy:290.0,cadc:false,path:"M510.0 262.0L575.0 262.0L575.0 290.0L510.0 290.0Z"},
  {name:"Pottawatomie",cx:590.0,cy:245.0,cadc:false,path:"M560.0 215.0L640.0 215.0L640.0 270.0L560.0 270.0Z"},
  {name:"Lincoln",cx:590.0,cy:185.0,cadc:false,path:"M560.0 155.0L640.0 155.0L640.0 215.0L560.0 215.0Z"},
  {name:"Payne",cx:560.0,cy:140.0,cadc:false,path:"M530.0 105.0L600.0 105.0L600.0 165.0L530.0 165.0Z"},
  {name:"Noble",cx:560.0,cy:105.0,cadc:false,path:"M530.0 75.0L600.0 75.0L600.0 120.0L530.0 120.0Z"},
  {name:"Osage",cx:620.0,cy:100.0,cadc:false,path:"M590.0 50.0L670.0 50.0L670.0 155.0L590.0 155.0Z"},
  {name:"Pawnee",cx:620.0,cy:143.0,cadc:false,path:"M590.0 120.0L655.0 120.0L655.0 170.0L590.0 170.0Z"},
  {name:"Creek",cx:630.0,cy:195.0,cadc:false,path:"M595.0 165.0L670.0 165.0L670.0 235.0L595.0 235.0Z"},
  {name:"Tulsa",cx:655.0,cy:160.0,cadc:false,path:"M630.0 140.0L685.0 140.0L685.0 185.0L630.0 185.0Z"},
  {name:"Rogers",cx:685.0,cy:145.0,cadc:false,path:"M660.0 115.0L720.0 115.0L720.0 175.0L660.0 175.0Z"},
  {name:"Mayes",cx:685.0,cy:110.0,cadc:false,path:"M655.0 75.0L720.0 75.0L720.0 130.0L655.0 130.0Z"},
  {name:"Nowata",cx:665.0,cy:67.0,cadc:false,path:"M635.0 35.0L700.0 35.0L700.0 90.0L635.0 90.0Z"},
  {name:"Craig",cx:695.0,cy:67.0,cadc:false,path:"M665.0 35.0L730.0 35.0L730.0 95.0L665.0 95.0Z"},
  {name:"Ottawa",cx:730.0,cy:85.0,cadc:false,path:"M700.0 55.0L760.0 55.0L760.0 115.0L700.0 115.0Z"},
  {name:"Delaware",cx:730.0,cy:130.0,cadc:false,path:"M700.0 100.0L760.0 100.0L760.0 165.0L700.0 165.0Z"},
  {name:"Cherokee",cx:700.0,cy:180.0,cadc:false,path:"M665.0 155.0L740.0 155.0L740.0 210.0L665.0 210.0Z"},
  {name:"Wagoner",cx:672.0,cy:203.0,cadc:false,path:"M645.0 185.0L705.0 185.0L705.0 230.0L645.0 230.0Z"},
  {name:"Muskogee",cx:690.0,cy:235.0,cadc:false,path:"M655.0 210.0L730.0 210.0L730.0 265.0L655.0 265.0Z"},
  {name:"Cherokee",cx:714.0,cy:195.0,cadc:false,path:"M690.0 170.0L745.0 170.0L745.0 225.0L690.0 225.0Z"},
  {name:"Sequoyah",cx:733.0,cy:250.0,cadc:false,path:"M705.0 220.0L762.0 220.0L762.0 285.0L705.0 285.0Z"},
  {name:"Adair",cx:733.0,cy:210.0,cadc:false,path:"M705.0 175.0L762.0 175.0L762.0 240.0L705.0 240.0Z"},
  {name:"Haskell",cx:700.0,cy:280.0,cadc:false,path:"M670.0 255.0L735.0 255.0L735.0 310.0L670.0 310.0Z"},
  {name:"LeFlore",cx:735.0,cy:315.0,cadc:false,path:"M700.0 280.0L762.0 280.0L762.0 360.0L700.0 360.0Z"},
  {name:"Latimer",cx:695.0,cy:315.0,cadc:false,path:"M660.0 285.0L730.0 285.0L730.0 350.0L660.0 350.0Z"},
  {name:"Pittsburg",cx:655.0,cy:295.0,cadc:false,path:"M620.0 265.0L695.0 265.0L695.0 330.0L620.0 330.0Z"},
  {name:"McIntosh",cx:663.0,cy:255.0,cadc:false,path:"M630.0 230.0L700.0 230.0L700.0 280.0L630.0 280.0Z"},
  {name:"Okfuskee",cx:620.0,cy:233.0,cadc:false,path:"M590.0 210.0L655.0 210.0L655.0 260.0L590.0 260.0Z"},
  {name:"Hughes",cx:610.0,cy:285.0,cadc:false,path:"M575.0 260.0L650.0 260.0L650.0 320.0L575.0 320.0Z"},
  {name:"Pontotoc",cx:580.0,cy:310.0,cadc:false,path:"M548.0 285.0L618.0 285.0L618.0 345.0L548.0 345.0Z"},
  {name:"Seminole",cx:580.0,cy:270.0,cadc:false,path:"M548.0 248.0L618.0 248.0L618.0 290.0L548.0 290.0Z"},
  {name:"Coal",cx:600.0,cy:345.0,cadc:false,path:"M565.0 320.0L640.0 320.0L640.0 375.0L565.0 375.0Z"},
  {name:"Atoka",cx:625.0,cy:358.0,cadc:false,path:"M595.0 330.0L660.0 330.0L660.0 390.0L595.0 390.0Z"},
  {name:"Johnston",cx:570.0,cy:365.0,cadc:false,path:"M538.0 340.0L608.0 340.0L608.0 390.0L538.0 390.0Z"},
  {name:"Murray",cx:553.0,cy:340.0,cadc:false,path:"M520.0 315.0L588.0 315.0L588.0 365.0L520.0 365.0Z"},
  {name:"Carter",cx:530.0,cy:365.0,cadc:false,path:"M498.0 340.0L565.0 340.0L565.0 390.0L498.0 390.0Z"},
  {name:"Garvin",cx:540.0,cy:325.0,cadc:false,path:"M508.0 300.0L578.0 300.0L578.0 350.0L508.0 350.0Z"},
  {name:"McClain",cx:500.0,cy:303.0,cadc:false,path:"M468.0 278.0L535.0 278.0L535.0 328.0L468.0 328.0Z"},
  {name:"Love",cx:500.0,cy:372.0,cadc:false,path:"M468.0 348.0L535.0 348.0L535.0 390.0L468.0 390.0Z"},
  {name:"Marshall",cx:560.0,cy:385.0,cadc:false,path:"M528.0 368.0L595.0 368.0L595.0 390.0L528.0 390.0Z"},
  {name:"Bryan",cx:600.0,cy:380.0,cadc:false,path:"M565.0 360.0L640.0 360.0L640.0 390.0L565.0 390.0Z"},
  {name:"Choctaw",cx:665.0,cy:372.0,cadc:false,path:"M633.0 348.0L700.0 348.0L700.0 390.0L633.0 390.0Z"},
  {name:"McCurtain",cx:717.0,cy:368.0,cadc:false,path:"M690.0 340.0L762.0 340.0L762.0 390.0L690.0 390.0Z"},
  {name:"Pushmataha",cx:675.0,cy:348.0,cadc:false,path:"M645.0 318.0L710.0 318.0L710.0 378.0L645.0 378.0Z"},
];

// ─── Orbit geometry ───────────────────────────────────────────────────────────

const RADIUS_PCT = 39;
const START_DEG = -90;

function nodePos(i: number, total: number) {
  const angle = START_DEG + (i / total) * 360;
  const rad = (angle * Math.PI) / 180;
  return {
    x: 50 + RADIUS_PCT * Math.cos(rad),
    y: 50 + RADIUS_PCT * Math.sin(rad),
  };
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function HomeExperience() {
  const [stage, setStage] = useState<Stage>("logo");
  const [selectedCounty, setSelectedCounty] = useState<CadcCounty | null>(null);
  const [visiblePrograms, setVisiblePrograms] = useState<ProgramSlug[]>([]);
  const [visibleCount, setVisibleCount] = useState(0);
  const [activeProgram, setActiveProgram] = useState<ProgramSlug | null>(null);
  const [glowTarget, setGlowTarget] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const logoGlow = useGlow();
  const reduceMotion = typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  // County selected → filter programs → go to orbit
  const selectCounty = useCallback((county: CadcCounty) => {
    setGlowTarget(county);
    setTimeout(() => setGlowTarget(null), 600);
    setSelectedCounty(county);
    const progs = COUNTY_PROGRAMS[county];
    setVisiblePrograms(progs);
    setVisibleCount(0);
    setActiveProgram(null);

    setTimeout(() => {
      setStage("orbit");
      if (reduceMotion) {
        setVisibleCount(progs.length);
      } else {
        progs.forEach((_, i) => {
          setTimeout(() => setVisibleCount(c => Math.max(c, i + 1)), 80 + i * 85);
        });
      }
    }, reduceMotion ? 0 : 400);
  }, [reduceMotion]);

  // Program node tapped → show inline content
  const selectProgram = useCallback((slug: ProgramSlug) => {
    setGlowTarget(slug);
    setTimeout(() => setGlowTarget(null), 600);
    setActiveProgram(prev => prev === slug ? null : slug);
    setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }, []);

  const goBack = useCallback(() => {
    if (stage === "orbit" || stage === "program") {
      setStage("map");
      setActiveProgram(null);
    } else if (stage === "map") {
      setStage("logo");
    }
  }, [stage]);

  const activeContent = activeProgram ? getProgramContent(activeProgram) : null;
  const activeP = programs.find(p => p.slug === activeProgram);

  return (
    <section className="relative min-h-[100svh] w-full flex flex-col items-center cadc-grid-bg" style={{ paddingBottom: "60px" }}>

      {/* ── STAGE: LOGO ── */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-500"
        style={{
          opacity: stage === "logo" ? 1 : 0,
          pointerEvents: stage === "logo" ? "auto" : "none",
          transform: stage === "logo" ? "scale(1)" : "scale(0.92)",
        }}
      >
        <button
          type="button"
          onClick={() => { logoGlow.trigger(); setTimeout(() => setStage("map"), 200); }}
          className="flex flex-col items-center group"
          aria-label="Explore CADC service area"
        >
          {/* Glow ring */}
          <div className="relative">
            <div
              className="absolute inset-0 rounded-full transition-all duration-300"
              style={{
                background: "radial-gradient(circle, rgba(1,1,255,0.25) 0%, transparent 70%)",
                transform: logoGlow.glowing ? "scale(2.5)" : "scale(1)",
                opacity: logoGlow.glowing ? 0 : 0.6,
                transition: "transform 0.6s ease-out, opacity 0.6s ease-out",
              }}
            />
            <div
              className="relative w-36 h-36 rounded-full border-[3px] flex flex-col items-center justify-center gap-1 bg-white transition-all duration-300"
              style={{
                borderColor: "var(--cadc-blue)",
                boxShadow: logoGlow.glowing
                  ? "0 0 0 20px rgba(1,1,255,0.08), 0 0 60px rgba(1,1,255,0.3)"
                  : "0 0 0 6px rgba(1,1,255,0.07), 0 8px 32px rgba(1,1,255,0.16)",
              }}
            >
              <span className="font-serif font-bold text-[2.2rem] leading-none" style={{ color: "var(--cadc-blue)", letterSpacing: "0.04em" }}>CADC</span>
              <span className="w-10 h-0.5" style={{ background: "var(--cadc-maroon)" }}></span>
              <span className="text-center font-semibold uppercase leading-[1.4]" style={{ fontSize: "0.42rem", letterSpacing: "0.06em", color: "#4a4a6a" }}>
                Community Action<br />Development Corp.
              </span>
            </div>
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-widest opacity-60 group-hover:opacity-90 transition-opacity" style={{ color: "var(--cadc-blue)" }}>
            Tap to explore your county
          </p>
        </button>

        <p className="absolute bottom-6 text-center text-xs uppercase tracking-widest font-medium" style={{ color: "#4a4a6a", opacity: 0.5 }}>
          {org.serviceAreaLabel}
        </p>
      </div>

      {/* ── STAGE: MAP ── */}
      <div
        className="w-full max-w-3xl mx-auto px-4 flex flex-col items-center justify-center transition-all duration-500"
        style={{
          opacity: stage === "map" ? 1 : 0,
          pointerEvents: stage === "map" ? "auto" : "none",
          paddingTop: stage === "map" ? "80px" : "0",
          minHeight: "100svh",
          position: stage === "map" ? "relative" : "absolute",
          inset: stage !== "map" ? 0 : undefined,
          transform: stage === "map" ? "translateY(0)" : "translateY(20px)",
        }}
      >
        <button onClick={goBack} className="self-start mb-4 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide opacity-60 hover:opacity-90 transition-opacity" style={{ color: "var(--cadc-blue)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back
        </button>

        <p className="text-xs font-bold uppercase tracking-widest mb-2 text-center" style={{ color: "var(--cadc-maroon)" }}>Select Your County</p>
        <h2 className="font-serif text-2xl font-bold mb-6 text-center" style={{ color: "var(--cadc-blue)" }}>Where do you need help?</h2>

        <div className="relative w-full rounded-2xl overflow-hidden border" style={{ borderColor: "var(--cadc-border)" }}>
          <svg viewBox="0 0 800 400" className="w-full h-auto block" aria-label="Oklahoma county map" role="img">
            {OK_COUNTIES.map((county) => {
              const isActive = glowTarget === county.name;
              return (
                <g key={county.name}>
                  {/* Glow pulse */}
                  {isActive && (
                    <circle cx={county.cx} cy={county.cy} r={30}
                      style={{ fill: "rgba(1,1,255,0.3)", animation: "ping 0.6s ease-out forwards" }}
                    />
                  )}
                  <path
                    d={county.path}
                    onClick={() => county.cadc && selectCounty(county.name as CadcCounty)}
                    style={{
                      fill: county.name === selectedCounty
                        ? "var(--cadc-blue)"
                        : county.cadc ? "var(--cadc-blue-light)" : "#f0f0f5",
                      stroke: "#ffffff",
                      strokeWidth: county.cadc ? 1.5 : 0.8,
                      cursor: county.cadc ? "pointer" : "default",
                      transition: "fill 0.25s ease",
                      filter: isActive ? "brightness(1.3)" : undefined,
                    }}
                  />
                  {county.cadc && (
                    <>
                      <circle cx={county.cx} cy={county.cy - 12} r={5}
                        style={{ fill: "var(--cadc-maroon)", stroke: "#fff", strokeWidth: 1.5, pointerEvents: "none" }}
                      />
                      <text x={county.cx} y={county.cy + 6} textAnchor="middle"
                        style={{ fontSize: "7px", fontWeight: 600, fill: county.name === selectedCounty ? "#ffffff" : "var(--cadc-blue)", pointerEvents: "none", fontFamily: "system-ui" }}>
                        {county.name}
                      </text>
                    </>
                  )}
                </g>
              );
            })}
          </svg>

          <div className="absolute bottom-3 left-3 flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm inline-block border-[1.5px]" style={{ background: "var(--cadc-blue-light)", borderColor: "var(--cadc-blue)" }}></span>
              <span style={{ color: "var(--cadc-ink)" }}>CADC County</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: "var(--cadc-maroon)" }}></span>
              <span style={{ color: "var(--cadc-ink)" }}>Tap to see services</span>
            </span>
          </div>
        </div>

        <p className="mt-4 text-xs text-center" style={{ color: "#9ca3af" }}>
          9 base counties · {org.tagline}
        </p>
      </div>

      {/* ── STAGE: ORBIT ── */}
      <div
        className="w-full flex flex-col items-center transition-all duration-500"
        style={{
          opacity: stage === "orbit" || stage === "program" ? 1 : 0,
          pointerEvents: stage === "orbit" || stage === "program" ? "auto" : "none",
          paddingTop: "76px",
          position: stage === "orbit" || stage === "program" ? "relative" : "absolute",
          inset: stage !== "orbit" && stage !== "program" ? 0 : undefined,
          transform: stage === "orbit" || stage === "program" ? "translateY(0)" : "translateY(20px)",
        }}
      >
        {/* Back + county label */}
        <div className="w-full max-w-sm mx-auto px-4 flex items-center justify-between mb-2 pt-2">
          <button onClick={goBack} className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide opacity-60 hover:opacity-90 transition-opacity" style={{ color: "var(--cadc-blue)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Map
          </button>
          {selectedCounty && (
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--cadc-maroon)" }}>
              {selectedCounty} County
            </span>
          )}
        </div>

        {/* Orbit diagram */}
        <div className="relative" style={{ width: "min(82vw, 82svh, 520px)", aspectRatio: "1/1" }}>
          {/* Orbit ring */}
          <div className="absolute rounded-full border-[1.5px] border-dashed transition-all duration-700"
            style={{ inset: "11%", borderColor: "rgba(1,1,255,0.16)", opacity: visibleCount > 0 ? 1 : 0 }} />

          {/* Connectors */}
          <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {visiblePrograms.map((slug, i) => {
              const { x, y } = nodePos(i, visiblePrograms.length);
              return (
                <line key={slug} x1={50} y1={50} x2={x} y2={y}
                  stroke={slug === activeProgram ? "var(--cadc-maroon)" : "rgba(126,0,1,0.25)"}
                  strokeWidth={slug === activeProgram ? 1.8 : 1}
                  strokeDasharray="4 4"
                  style={{ opacity: i < visibleCount ? 1 : 0, transition: "opacity 0.4s ease, stroke 0.25s ease" }}
                />
              );
            })}
          </svg>

          {/* Center logo */}
          <button
            type="button"
            onClick={() => { setStage("map"); setActiveProgram(null); }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10"
            aria-label="Back to map"
          >
            <div className="rounded-full border-[3px] flex flex-col items-center justify-center gap-0.5 bg-white"
              style={{
                width: "clamp(80px,22vw,120px)", aspectRatio: "1/1",
                borderColor: "var(--cadc-blue)",
                boxShadow: "0 0 0 5px rgba(1,1,255,0.07), 0 6px 24px rgba(1,1,255,0.14)",
              }}>
              <span className="font-serif font-bold leading-none" style={{ fontSize: "clamp(1.2rem,4vw,1.8rem)", color: "var(--cadc-blue)", letterSpacing: "0.04em" }}>CADC</span>
              <span className="w-8 h-0.5" style={{ background: "var(--cadc-maroon)" }}></span>
              <span className="text-center font-semibold uppercase leading-tight" style={{ fontSize: "0.38rem", letterSpacing: "0.06em", color: "#4a4a6a" }}>
                Community Action<br />Development Corp.
              </span>
            </div>
          </button>

          {/* Program nodes */}
          {visiblePrograms.map((slug, i) => {
            const prog = programs.find(p => p.slug === slug)!;
            const { x, y } = nodePos(i, visiblePrograms.length);
            const isOn = i < visibleCount;
            const isActive = slug === activeProgram;
            const isGlowing = glowTarget === slug;

            return (
              <button
                key={slug}
                type="button"
                tabIndex={isOn ? 0 : -1}
                onClick={() => selectProgram(slug)}
                aria-label={prog.name}
                aria-pressed={isActive}
                className="absolute flex flex-col items-center gap-1.5"
                style={{
                  left: `${x}%`, top: `${y}%`,
                  width: "clamp(60px,16vw,80px)",
                  transform: `translate(-50%, -50%) scale(${isOn ? 1 : 0.3})`,
                  opacity: isOn ? 1 : 0,
                  pointerEvents: isOn ? "auto" : "none",
                  transition: "opacity 0.4s ease, transform 0.4s ease",
                }}
              >
                {/* Glow pulse ring */}
                {isGlowing && (
                  <div className="absolute rounded-full" style={{
                    inset: "-8px",
                    background: "radial-gradient(circle, rgba(1,1,255,0.4) 0%, transparent 70%)",
                    animation: "ping 0.6s ease-out forwards",
                  }} />
                )}
                <div style={{
                  width: "clamp(40px,10vw,58px)",
                  aspectRatio: "1/1",
                  borderRadius: "50%",
                  background: "white",
                  border: `2.5px solid ${isActive ? "var(--cadc-maroon)" : "var(--cadc-blue)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "clamp(0.9rem,2.6vw,1.3rem)",
                  boxShadow: isActive
                    ? "0 0 0 4px rgba(126,0,1,0.2), 0 6px 20px rgba(126,0,1,0.25)"
                    : isGlowing
                    ? "0 0 0 8px rgba(1,1,255,0.15), 0 6px 24px rgba(1,1,255,0.3)"
                    : "0 3px 12px rgba(1,1,255,0.12)",
                  transition: "border-color 0.25s, box-shadow 0.3s",
                }} aria-hidden="true">
                  {prog.icon}
                </div>
                <span style={{
                  fontSize: "clamp(0.44rem,1.4vw,0.58rem)",
                  fontWeight: 600,
                  color: isActive ? "var(--cadc-maroon)" : "var(--cadc-blue)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  textAlign: "center",
                  lineHeight: 1.25,
                  width: "clamp(60px,16vw,80px)",
                  overflowWrap: "break-word",
                }}>
                  {prog.shortName}
                </span>
              </button>
            );
          })}
        </div>

        <p className="mt-3 text-xs font-medium uppercase tracking-widest opacity-50" style={{ color: "#4a4a6a", fontSize: "0.6rem" }}>
          Tap a program to explore
        </p>

        {/* ── INLINE PROGRAM CONTENT ── */}
        <div ref={contentRef} className="w-full max-w-2xl mx-auto px-4 mt-6"
          style={{
            opacity: activeProgram ? 1 : 0,
            maxHeight: activeProgram ? "2000px" : "0px",
            overflow: "hidden",
            transition: "opacity 0.4s ease, max-height 0.5s ease",
          }}>
          {activeContent && activeP && (
            <div className="rounded-2xl overflow-hidden mb-6" style={{ background: "var(--cadc-blue)" }}>
              <div className="px-6 py-8 flex flex-col gap-5">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1" style={{ color: "var(--cadc-blue-light)" }}>
                      {selectedCounty} County
                    </p>
                    <h2 className="font-serif text-xl font-bold text-white leading-tight flex items-center gap-2">
                      <span aria-hidden="true">{activeP.icon}</span>
                      {activeP.name}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--cadc-blue-light)" }}>
                      {activeContent.hero}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveProgram(null)}
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white opacity-50 hover:opacity-90 transition-opacity"
                    style={{ background: "rgba(255,255,255,0.12)" }}
                    aria-label="Close"
                  >✕</button>
                </div>

                {/* Body content */}
                {activeContent.body}

                {/* CTA */}
                {activeContent.cta && (
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <a
                      href={activeContent.cta.href}
                      target={activeContent.cta.external ? "_blank" : undefined}
                      rel={activeContent.cta.external ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
                      style={{ background: "var(--cadc-maroon)" }}
                    >
                      {activeContent.cta.label} →
                    </a>
                    <Link
                      href={programHref(activeP.slug)}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                      style={{ borderColor: "rgba(255,255,255,0.3)" }}
                    >
                      Full {activeP.shortName} page →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ping keyframe */}
      <style>{`
        @keyframes ping {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
