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
  {name:"Beaver",cx:242.4,cy:41.4,cadc:false,path:"M198.3 12.4L283.6 12.0L283.5 67.8L197.5 67.8L198.3 12.4Z"},
  {name:"Woods",cx:373.7,cy:38.3,cadc:false,path:"M333.1 12.3L415.6 12.3L416.6 79.1L401.8 77.2L388.5 67.1L378.0 67.0L378.0 56.8L369.1 44.1L361.7 36.3L347.9 33.9L333.1 12.3Z"},
  {name:"Caddo",cx:431.5,cy:214.7,cadc:false,path:"M408.5 173.1L437.0 173.1L437.2 192.4L456.2 192.4L456.5 250.4L408.8 250.4L408.5 173.1Z"},
  {name:"Mcclain",cx:519.9,cy:226.6,cadc:false,path:"M494.6 197.2L503.7 201.0L505.9 210.2L518.6 218.9L518.9 224.3L523.3 225.8L526.1 239.5L554.3 244.5L561.7 238.1L561.7 250.5L494.7 250.4L494.6 197.2Z"},
  {name:"Le Flore",cx:765.5,cy:230.7,cadc:false,path:"M786.2 253.4L785.3 289.0L742.1 289.1L742.1 269.8L731.1 269.8L731.1 250.4L736.7 250.4L736.7 240.7L743.0 240.7L743.0 211.8L753.3 211.8L753.4 198.4L757.3 194.9L768.4 202.0L773.2 197.9L780.4 200.0L783.5 193.0L787.7 191.3L786.2 253.4Z"},
  {name:"Sequoyah",cx:755.7,cy:184.0,cadc:false,path:"M787.9 190.8L783.0 193.5L780.4 200.0L773.2 197.9L768.4 202.0L759.8 194.8L753.5 198.4L750.8 193.1L744.2 195.7L745.4 190.1L736.1 188.4L725.6 178.2L725.0 163.4L784.2 163.4L787.9 190.8Z"},
  {name:"Kay",cx:548.3,cy:38.9,cadc:false,path:"M513.6 12.4L578.1 12.3L577.8 36.4L570.8 40.6L565.5 39.8L561.6 47.1L550.6 46.4L550.2 57.3L513.6 57.4L513.6 12.4Z"},
  {name:"Texas",cx:144.7,cy:37.1,cadc:false,path:"M100.2 13.0L198.2 12.4L197.5 67.8L99.9 67.7L100.2 13.0Z"},
  {name:"Woodward",cx:355.3,cy:60.7,cadc:false,path:"M347.7 32.3L351.5 36.1L361.7 36.3L378.0 56.8L378.4 105.3L320.4 105.0L319.6 57.4L347.7 57.2L347.7 32.3Z"},
  {name:"Delaware",cx:757.7,cy:78.8,cadc:false,path:"M771.1 49.1L776.1 105.3L735.5 105.3L736.5 48.8L771.1 49.1Z"},
  {name:"Noble",cx:542.3,cy:77.0,cadc:false,path:"M550.2 57.3L562.6 56.6L565.6 59.4L552.5 67.0L552.5 86.2L562.2 86.3L562.2 95.9L542.7 95.9L542.7 105.6L513.7 105.0L513.6 57.4L550.2 57.3Z"},
  {name:"Ellis",cx:308.7,cy:108.1,cadc:false,path:"M319.6 57.4L320.4 105.0L339.8 105.0L339.9 121.8L330.3 124.9L323.8 138.1L318.3 140.8L304.1 135.7L299.2 122.6L293.5 124.9L292.1 131.2L283.8 136.5L283.6 57.4L319.6 57.4Z"},
  {name:"Payne",cx:553.3,cy:116.0,cadc:false,path:"M562.2 95.9L571.8 95.9L571.8 105.6L589.7 105.5L589.7 129.8L538.6 129.8L528.2 122.2L523.4 124.9L523.4 105.6L542.7 105.6L542.7 95.9L562.2 95.9Z"},
  {name:"Logan",cx:518.6,cy:132.0,cadc:false,path:"M513.7 105.0L523.4 105.0L523.4 124.9L527.5 122.0L537.0 129.4L542.7 127.8L542.7 153.9L494.4 153.7L494.3 105.0L513.7 105.0Z"},
  {name:"Cherokee",cx:730.3,cy:135.0,cadc:false,path:"M754.8 105.3L753.9 163.4L725.0 163.4L724.9 144.1L712.4 144.0L715.9 138.6L711.0 133.9L711.4 127.0L715.3 124.2L717.7 115.0L725.8 115.0L725.8 105.3L754.8 105.3Z"},
  {name:"Roger Mills",cx:313.5,cy:146.9,cadc:true,path:"M339.9 121.8L341.4 177.8L322.3 177.8L322.3 187.5L283.8 187.4L283.8 136.5L292.1 131.2L293.5 124.9L300.7 122.9L304.1 135.7L318.2 140.8L323.8 138.1L330.3 124.9L339.9 121.8Z"},
  {name:"Seminole",cx:589.6,cy:213.9,cadc:false,path:"M606.0 202.1L606.0 221.5L601.6 221.4L600.7 246.1L598.1 248.8L595.4 243.7L588.3 245.6L583.3 241.7L583.3 248.6L579.5 249.9L575.7 245.4L575.7 188.6L597.3 190.9L595.7 183.9L600.9 186.7L606.0 182.4L606.0 202.1Z"},
  {name:"Washita",cx:388.1,cy:209.3,cadc:true,path:"M341.4 182.6L408.5 182.7L409.0 223.0L406.0 220.5L398.3 223.1L341.8 221.4L341.4 182.6Z"},
  {name:"Haskell",cx:722.6,cy:200.8,cadc:false,path:"M732.0 183.4L736.1 188.4L745.4 190.1L744.0 195.6L751.1 193.2L753.4 198.4L753.3 211.8L743.0 211.8L743.0 227.8L704.9 227.8L704.9 216.5L695.3 216.5L695.6 201.4L701.2 197.9L704.7 202.1L709.2 200.8L715.5 204.8L732.0 183.4Z"},
  {name:"Grady",cx:476.2,cy:217.0,cadc:false,path:"M456.2 192.4L494.6 197.0L494.9 269.7L456.8 269.7L456.2 192.4Z"},
  {name:"Pittsburg",cx:667.7,cy:226.2,cadc:false,path:"M695.6 201.4L695.3 216.5L704.9 216.5L704.9 231.1L690.5 231.1L689.9 279.4L656.6 279.5L656.6 269.8L637.6 269.8L637.9 228.8L644.9 218.2L654.4 218.3L657.7 213.6L663.7 212.5L668.0 214.7L680.0 206.8L682.2 209.7L689.9 205.1L690.9 201.0L695.6 201.4Z"},
  {name:"Hughes",cx:622.2,cy:232.9,cadc:false,path:"M647.6 202.1L647.4 217.5L637.9 228.8L637.6 260.1L609.2 260.1L609.2 241.8L607.4 245.1L601.5 244.2L601.6 221.4L606.0 221.5L606.0 202.1L647.6 202.1Z"},
  {name:"Pontotoc",cx:588.2,cy:251.8,cadc:false,path:"M575.7 245.4L581.5 249.9L583.8 246.8L581.6 243.6L584.3 241.8L588.3 245.6L595.4 243.7L598.7 248.8L601.7 244.1L607.4 245.1L609.2 241.8L609.2 269.8L599.6 269.8L599.6 289.2L571.1 289.2L571.1 279.5L561.6 279.5L561.7 238.3L565.8 242.5L572.1 240.3L575.7 245.4Z"},
  {name:"Okfuskee",cx:608.1,cy:184.8,cadc:false,path:"M589.8 163.4L628.5 163.3L628.5 173.0L638.0 173.0L638.1 192.4L647.7 192.5L647.6 202.1L606.0 202.1L606.0 182.4L600.9 186.7L595.7 183.9L597.4 190.9L589.5 189.8L589.8 163.4Z"},
  {name:"Cotton",cx:430.0,cy:324.3,cadc:true,path:"M452.0 289.1L450.8 331.8L431.8 327.9L427.4 335.9L421.1 338.4L409.7 327.9L409.7 308.3L405.0 308.3L405.0 300.3L419.2 298.7L419.2 295.5L438.1 295.5L442.8 293.9L442.8 289.1L452.0 289.1Z"},
  {name:"Carter",cx:531.8,cy:314.1,cadc:false,path:"M523.6 289.1L523.6 303.6L552.1 303.7L552.8 308.4L561.5 308.4L561.4 326.2L558.3 326.2L558.3 337.5L504.5 337.5L504.5 289.1L523.6 289.1Z"},
  {name:"Cleveland",cx:517.8,cy:215.9,cadc:false,path:"M542.6 223.0L542.6 242.3L526.1 239.5L523.2 225.5L518.9 224.3L518.7 219.0L510.9 211.8L505.9 210.2L503.8 201.1L494.8 197.4L494.7 192.4L542.6 192.5L542.6 223.0Z"},
  {name:"Garvin",cx:529.4,cy:271.7,cadc:false,path:"M561.5 250.5L561.6 274.7L537.4 276.2L542.4 289.1L504.5 289.1L504.5 269.7L494.9 269.7L495.0 250.4L561.5 250.5Z"},
  {name:"Pushmataha",cx:705.4,cy:297.9,cadc:false,path:"M731.1 269.8L742.1 269.8L742.1 289.1L732.3 289.0L732.3 318.3L722.8 318.3L722.8 327.9L665.9 328.0L665.9 289.1L675.7 289.1L675.7 279.4L689.9 279.4L689.9 269.7L731.1 269.8Z"},
  {name:"Rogers",cx:680.4,cy:89.3,cadc:false,path:"M696.7 108.5L696.6 114.9L684.8 114.9L685.1 108.8L680.5 105.2L662.7 105.2L662.9 56.9L706.8 56.9L706.8 66.6L697.1 66.6L696.7 108.5Z"},
  {name:"Creek",cx:618.2,cy:131.6,cadc:false,path:"M631.6 139.1L628.5 139.1L628.5 163.3L589.8 163.4L589.7 105.1L619.0 105.2L619.0 114.9L643.3 114.9L643.0 139.2L631.6 139.1Z"},
  {name:"Pawnee",cx:585.0,cy:83.4,cadc:false,path:"M577.0 60.6L582.4 75.4L588.5 76.0L592.8 81.7L598.4 79.6L594.7 89.0L598.9 90.3L604.5 86.3L615.2 97.7L623.0 98.4L621.7 105.3L571.8 105.6L571.8 95.9L562.2 95.9L562.2 86.3L552.5 86.2L552.5 67.0L561.3 72.6L577.0 60.6Z"},
  {name:"Tulsa",cx:650.3,cy:108.5,cadc:false,path:"M667.5 126.2L667.5 134.3L662.3 134.3L662.3 139.2L643.0 139.2L643.3 114.9L619.0 114.9L619.0 105.2L645.9 105.4L645.9 76.2L664.6 76.2L662.7 105.2L667.5 105.2L667.5 126.2Z"},
  {name:"Osage",cx:593.3,cy:65.4,cadc:false,path:"M645.8 74.4L645.9 105.4L621.7 105.3L623.0 98.4L615.2 97.7L604.5 86.3L598.9 90.3L594.7 89.0L598.4 79.6L592.8 81.7L588.5 76.0L582.4 75.4L577.7 60.8L571.7 63.4L566.7 71.0L557.1 71.5L554.9 65.4L565.6 59.4L562.6 56.6L550.4 57.5L549.6 47.3L561.6 47.1L565.5 39.8L570.8 40.6L577.8 36.4L578.1 12.3L645.9 12.3L645.8 74.4Z"},
  {name:"Muskogee",cx:705.7,cy:170.5,cadc:false,path:"M725.0 155.1L724.5 175.9L728.7 183.1L732.0 183.4L725.6 192.9L721.9 193.3L723.7 194.8L720.1 196.1L720.8 200.6L714.2 205.2L709.2 200.8L705.3 201.8L705.3 173.0L671.9 173.0L671.9 153.7L667.1 153.7L667.1 139.2L677.6 139.2L678.7 146.9L683.2 149.4L703.8 143.2L724.9 144.1L725.0 155.1Z"},
  {name:"Wagoner",cx:688.8,cy:127.7,cadc:false,path:"M667.5 121.3L667.5 105.2L680.5 105.2L685.1 108.8L684.8 114.9L717.7 115.0L715.3 124.2L711.3 127.3L711.0 133.9L715.9 138.6L712.4 144.0L693.3 145.0L683.5 149.4L678.7 146.9L677.6 139.2L662.3 139.2L662.3 134.3L667.5 134.3L667.5 121.3Z"},
  {name:"Kiowa",cx:366.4,cy:244.2,cadc:true,path:"M341.8 221.4L398.3 223.1L407.1 220.6L408.8 250.4L390.1 250.4L390.1 279.4L374.3 279.4L374.3 274.5L365.0 274.5L365.9 270.8L370.9 268.6L360.0 266.5L361.3 251.0L357.1 250.1L352.8 254.7L345.7 248.6L348.2 245.1L342.9 236.3L345.1 230.0L340.8 228.4L341.0 224.6L337.3 221.6L341.8 221.4Z"},
  {name:"Greer",cx:335.7,cy:240.7,cadc:false,path:"M337.3 221.6L341.0 224.6L340.8 228.4L345.1 230.0L342.9 236.3L348.2 245.1L345.7 248.6L352.1 255.2L337.6 255.1L337.7 260.0L334.5 260.8L336.1 264.8L314.0 264.9L312.4 260.0L309.2 260.0L308.2 240.5L294.0 240.5L293.9 231.0L303.5 231.0L303.5 221.3L337.3 221.6Z"},
  {name:"Harper",cx:320.3,cy:34.6,cadc:false,path:"M283.6 12.0L334.2 12.7L340.5 25.5L347.7 32.2L347.7 57.2L283.6 57.4L283.6 12.0Z"},
  {name:"Mcintosh",cx:675.8,cy:201.8,cadc:false,path:"M647.7 192.5L657.2 192.5L657.2 182.8L661.9 182.8L662.0 173.0L705.3 173.0L705.3 201.8L701.2 197.9L691.2 200.9L689.9 205.1L682.2 209.7L680.0 206.8L668.0 214.7L664.2 212.4L657.7 213.6L654.4 218.3L647.4 217.5L647.7 192.5Z"},
  {name:"Choctaw",cx:675.4,cy:349.6,cadc:false,path:"M665.9 328.0L722.3 327.9L722.4 352.4L715.6 349.7L713.5 357.1L711.4 355.3L709.8 359.5L687.1 358.7L685.8 353.1L682.6 351.8L673.6 358.0L660.4 359.3L651.8 351.8L651.6 331.4L646.7 327.9L665.9 328.0Z"},
  {name:"Love",cx:533.2,cy:356.8,cadc:false,path:"M558.2 337.5L561.3 350.4L556.0 351.0L556.8 357.7L553.3 362.6L547.5 361.6L551.1 365.6L547.1 367.1L547.6 373.8L545.2 376.6L537.9 372.0L536.9 365.5L540.4 362.3L536.8 354.9L532.2 360.5L527.4 357.7L525.4 361.5L525.3 358.2L521.1 365.5L514.4 364.4L514.6 357.4L511.4 354.6L504.7 356.6L504.7 347.1L506.8 347.1L504.7 337.5L558.2 337.5Z"},
  {name:"Pottawatomie",cx:565.2,cy:210.0,cadc:false,path:"M589.4 182.9L588.8 190.7L580.4 187.1L575.7 188.6L575.7 245.4L572.1 240.3L565.8 242.5L561.6 238.1L554.4 244.4L542.6 242.3L542.7 182.8L589.4 182.9Z"},
  {name:"Jackson",cx:345.4,cy:283.5,cadc:false,path:"M360.8 257.1L358.7 261.5L360.3 266.9L371.0 269.0L365.8 271.0L366.9 279.8L359.6 280.1L354.3 290.6L353.0 300.6L356.4 307.6L340.9 294.4L337.7 304.0L322.8 298.9L320.1 303.8L311.5 303.4L297.9 289.1L314.0 289.0L314.0 264.9L336.1 264.8L334.5 260.8L337.7 260.0L337.6 255.1L352.1 255.2L357.8 249.9L361.3 251.0L360.8 257.1Z"},
  {name:"Nowata",cx:680.3,cy:33.6,cadc:false,path:"M665.3 12.3L699.6 12.3L699.6 18.6L697.4 18.6L697.4 56.9L663.2 56.9L665.3 12.3Z"},
  {name:"Cimarron",cx:54.9,cy:36.0,cadc:false,path:"M100.2 13.0L99.9 67.7L12.1 67.7L12.1 12.2L100.2 13.0Z"},
  {name:"McCurtain",cx:757.1,cy:364.0,cadc:false,path:"M785.3 289.0L782.7 386.8L775.5 386.7L777.7 383.6L773.6 384.8L776.3 382.4L773.8 380.2L767.0 383.0L768.7 378.5L762.2 380.0L763.5 378.4L760.6 376.9L760.5 379.6L760.6 375.9L755.6 374.7L757.9 372.0L754.3 375.0L752.7 371.0L752.6 375.0L748.3 373.6L743.6 368.6L743.6 364.3L741.4 366.7L739.2 360.7L732.3 360.6L730.5 354.6L728.5 358.6L729.3 354.3L725.5 356.0L722.4 352.4L722.8 318.3L732.3 318.3L732.3 289.0L785.3 289.0Z"},
  {name:"Craig",cx:721.8,cy:35.2,cadc:false,path:"M699.6 12.3L735.8 12.3L733.1 15.0L737.1 17.9L736.0 66.7L706.8 66.6L706.8 56.9L697.4 56.9L697.4 18.6L699.6 18.6L699.6 12.3Z"},
  {name:"Ottawa",cx:751.6,cy:25.9,cadc:false,path:"M736.5 48.8L737.1 17.9L733.4 12.9L771.1 12.4L771.1 49.1L736.5 48.8Z"},
  {name:"Grant",cx:483.5,cy:34.6,cadc:false,path:"M454.8 12.4L513.6 12.4L513.6 57.4L455.0 57.3L454.8 12.4Z"},
  {name:"Alfalfa",cx:435.6,cy:43.9,cadc:false,path:"M415.6 12.3L454.8 12.4L455.4 71.8L416.6 71.8L415.6 12.3Z"},
  {name:"Garfield",cx:483.5,cy:81.7,cadc:false,path:"M513.6 57.4L513.7 105.0L455.5 105.0L455.5 57.3L513.6 57.4Z"},
  {name:"Mayes",cx:716.8,cy:89.6,cadc:false,path:"M736.0 66.7L735.5 105.3L725.8 105.3L725.8 115.0L696.6 114.9L697.1 66.6L736.0 66.7Z"},
  {name:"Major",cx:419.1,cy:86.1,cadc:false,path:"M455.4 71.8L455.5 105.0L378.4 105.3L378.0 67.0L388.5 67.1L393.2 72.9L410.3 79.9L416.6 79.1L416.6 71.8L455.4 71.8Z"},
  {name:"Blaine",cx:424.8,cy:142.8,cadc:false,path:"M445.8 105.0L446.1 153.8L436.5 153.8L436.6 173.1L407.7 173.1L407.3 105.0L445.8 105.0Z"},
  {name:"Kingfisher",cx:472.2,cy:130.1,cadc:false,path:"M446.1 153.8L445.8 105.0L494.3 105.0L494.4 153.7L446.1 153.8Z"},
  {name:"Dewey",cx:374.9,cy:126.3,cadc:false,path:"M378.4 105.3L407.3 105.0L407.7 144.1L340.3 144.1L339.8 105.0L378.4 105.3Z"},
  {name:"Adair",cx:768.5,cy:134.7,cadc:false,path:"M776.1 105.3L784.2 163.4L753.9 163.4L754.8 105.3L776.1 105.3Z"},
  {name:"Lincoln",cx:565.8,cy:157.2,cadc:false,path:"M589.7 129.8L589.4 182.9L542.7 182.8L542.7 129.7L589.7 129.8Z"},
  {name:"Custer",cx:377.7,cy:162.9,cadc:false,path:"M407.7 144.1L408.5 182.7L341.4 182.6L340.3 144.1L407.7 144.1Z"},
  {name:"Canadian",cx:470.5,cy:183.1,cadc:true,path:"M494.4 153.7L494.6 197.0L479.2 197.3L470.1 192.4L468.5 195.7L463.3 192.0L437.2 192.4L436.5 153.8L494.4 153.7Z"},
  {name:"Beckham",cx:314.1,cy:205.3,cadc:true,path:"M341.4 177.8L341.8 221.4L303.5 221.3L303.5 231.0L283.8 230.9L283.8 187.4L322.3 187.5L322.3 177.8L341.4 177.8Z"},
  {name:"Latimer",cx:714.5,cy:249.2,cadc:false,path:"M743.0 227.8L743.0 240.7L736.7 240.7L736.7 250.4L731.1 250.4L731.1 269.8L689.9 269.7L690.5 231.1L704.9 231.1L705.1 227.8L743.0 227.8Z"},
  {name:"Harmon",cx:295.5,cy:269.6,cadc:false,path:"M293.9 231.0L294.0 240.5L308.2 240.5L309.2 260.0L314.0 261.7L314.0 289.0L297.9 289.1L290.4 281.4L283.8 283.1L283.8 230.9L293.9 231.0Z"},
  {name:"Comanche",cx:425.8,cy:269.6,cadc:true,path:"M456.5 250.4L456.8 269.7L452.1 269.7L452.0 289.1L442.8 289.1L442.8 293.9L438.1 295.5L419.2 295.5L419.2 298.7L405.0 300.3L405.0 289.0L390.1 289.0L390.1 250.4L456.5 250.4Z"},
  {name:"Coal",cx:617.4,cy:278.3,cadc:false,path:"M637.6 260.1L637.6 289.2L632.8 289.2L632.8 298.9L599.5 298.8L599.6 269.8L609.2 269.8L609.2 260.1L637.6 260.1Z"},
  {name:"Stephens",cx:481.3,cy:291.1,cadc:false,path:"M494.9 269.7L504.5 269.7L504.5 313.3L452.3 313.2L452.1 269.7L494.9 269.7Z"},
  {name:"Atoka",cx:644.2,cy:298.9,cadc:false,path:"M675.7 279.4L675.7 289.1L665.9 289.1L665.9 328.0L609.1 327.9L609.1 298.9L632.8 298.9L632.8 289.2L637.6 289.2L637.6 269.8L656.6 269.8L656.6 279.5L675.7 279.4Z"},
  {name:"Tillman",cx:370.9,cy:305.3,cadc:true,path:"M390.1 279.4L390.1 289.0L405.0 289.0L405.0 308.3L409.7 308.3L409.7 327.9L396.4 331.5L375.4 320.8L370.1 323.4L357.1 321.5L355.1 311.0L356.9 306.0L352.8 298.2L359.5 280.1L366.8 279.9L365.0 274.5L374.3 274.5L374.3 279.4L390.1 279.4Z"},
  {name:"Murray",cx:546.8,cy:288.9,cadc:false,path:"M561.6 274.7L561.6 279.5L571.1 279.5L571.1 289.2L566.2 289.2L566.2 308.4L552.8 308.4L552.1 303.7L523.6 303.6L523.6 289.1L542.4 289.1L537.4 276.2L561.6 274.7Z"},
  {name:"Johnston",cx:585.9,cy:316.0,cadc:false,path:"M599.4 289.2L599.5 298.8L609.1 298.9L609.1 327.9L604.9 327.9L604.9 332.7L593.0 332.6L585.3 326.2L561.4 326.2L561.5 308.4L566.2 308.4L566.2 289.2L599.4 289.2Z"},
  {name:"Jefferson",cx:479.4,cy:344.0,cadc:true,path:"M504.5 313.3L504.7 345.0L506.8 347.1L504.7 347.1L504.7 356.5L501.5 354.9L502.1 350.5L494.7 346.3L476.2 362.0L466.3 356.7L469.8 346.4L457.4 345.1L455.3 341.6L457.4 341.1L454.0 336.4L456.8 331.0L452.3 329.6L452.3 313.2L504.5 313.3Z"},
  {name:"Marshall",cx:585.3,cy:343.4,cadc:false,path:"M593.0 332.6L596.4 338.3L593.6 344.3L589.4 344.4L593.8 349.4L592.8 356.8L585.6 354.6L581.5 364.1L576.6 364.7L572.4 359.5L567.5 361.7L564.0 351.2L561.3 350.4L561.3 343.9L558.2 343.9L558.3 326.2L588.2 326.7L593.0 332.6Z"},
  {name:"Bryan",cx:629.5,cy:355.1,cadc:false,path:"M646.7 327.9L651.6 331.4L651.8 351.9L667.8 362.1L660.7 363.6L651.8 357.9L650.3 361.2L645.7 359.4L644.1 363.1L632.7 363.3L629.8 372.0L619.5 371.3L614.4 380.2L607.7 370.2L600.6 370.6L598.3 365.2L588.9 362.4L592.9 357.9L593.8 349.5L589.4 344.3L593.6 344.3L596.4 338.3L593.0 332.6L604.9 332.7L604.9 327.9L646.7 327.9Z"},
  {name:"Washington",cx:654.1,cy:45.1,cadc:false,path:"M663.2 48.9L662.9 76.2L645.9 76.2L645.9 12.3L665.3 12.3L663.2 48.9Z"},
  {name:"Okmulgee",cx:650.7,cy:166.4,cadc:false,path:"M657.2 186.4L657.2 192.5L638.1 192.4L638.0 173.0L628.5 173.0L628.5 139.1L667.1 139.2L667.1 153.7L671.9 153.7L671.9 173.0L662.0 173.0L661.9 182.8L657.2 182.8L657.2 186.4Z"},
  {name:"Oklahoma",cx:520.9,cy:175.4,cadc:false,path:"M542.6 187.6L542.6 192.5L494.7 192.4L494.4 153.7L542.7 153.9L542.6 187.6Z"}
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
    <section className="relative w-full cadc-grid-bg overflow-hidden" style={{ height: "100svh" }}>

      {/* ── STAGE: LOGO ── */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 px-4"
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
          paddingTop: "16px",
          minHeight: "auto",
          position: "absolute",
          inset: 0,
          transform: stage === "map" ? "translateY(0)" : "translateY(20px)",
          overflowY: stage === "map" ? "auto" : "hidden",
        }}
      >
        <button onClick={goBack} className="self-start mb-4 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide opacity-60 hover:opacity-90 transition-opacity" style={{ color: "var(--cadc-blue)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back
        </button>

        <p className="text-xs font-bold uppercase tracking-widest mb-2 text-center" style={{ color: "var(--cadc-maroon)" }}>Select Your County</p>
        <h2 className="font-serif text-2xl font-bold mb-6 text-center" style={{ color: "var(--cadc-blue)" }}>Where do you need help?</h2>

        <div className="relative w-full rounded-2xl overflow-hidden border" style={{ borderColor: "var(--cadc-border)" }}>
          <svg viewBox="0 0 800 420" className="w-full h-auto block" aria-label="Oklahoma county map" role="img">
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
          position: "absolute",
          inset: 0,
          overflowY: stage === "orbit" || stage === "program" ? "auto" : "hidden",
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
