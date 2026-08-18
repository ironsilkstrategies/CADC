"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { programs, programHref, type ProgramSlug } from "@/lib/programs";
import { org, contact } from "@/lib/org";
import { useRouter } from "next/navigation";


// ─── Types ───────────────────────────────────────────────────────────────────

type Stage = "logo" | "map" | "orbit";
type CadcCounty = "Beckham"|"Canadian"|"Comanche"|"Cotton"|"Jefferson"|"Kiowa"|"Roger Mills"|"Tillman"|"Washita";

// ─── County programs ──────────────────────────────────────────────────────────

const COUNTY_PROGRAMS: Record<CadcCounty, ProgramSlug[]> = {
  "Beckham": ["head-start","transit","weatherization","tax-help","community-market","employment"],
  "Canadian": ["head-start","transit","weatherization","tax-help","community-market","employment"],
  "Comanche": ["head-start","transit","weatherization","senior-meals","tax-help","community-market","employment"],
  "Cotton": ["head-start","transit","weatherization","tax-help","community-market","employment"],
  "Jefferson": ["head-start","transit","weatherization","senior-meals","tax-help","community-market","employment"],
  "Kiowa": ["head-start","transit","weatherization","tax-help","community-market","employment"],
  "Roger Mills": ["head-start","transit","weatherization","tax-help","community-market","employment"],
  "Tillman": ["head-start","transit","weatherization","senior-meals","tax-help","community-market","employment"],
  "Washita": ["head-start","transit","weatherization","tax-help","community-market","employment"]
};

// ─── County geo data (SW Oklahoma crop, real geographic paths) ────────────────

const OK_COUNTIES: {name:string;cx:number;cy:number;cadc:boolean;path:string}[] = [
  {name:"Beaver",cx:242.4,cy:41.4,cadc:false,path:"M198.3 12.4L283.6 12.0L283.5 67.8L197.5 67.8L198.3 12.4Z"},
  {name:"Woods",cx:373.7,cy:38.3,cadc:false,path:"M333.1 12.3L415.6 12.3L416.6 79.1L401.8 77.2L388.5 67.1L378.0 67.0L378.0 56.8L369.1 44.1L361.7 36.3L347.9 33.9L333.1 12.3Z"},
  {name:"Caddo",cx:431.5,cy:214.7,cadc:false,path:"M408.5 173.1L437.0 173.1L437.2 192.4L456.2 192.4L456.5 250.4L408.8 250.4L408.5 173.1Z"},
  {name:"Mcclain",cx:519.9,cy:226.6,cadc:false,path:"M494.6 197.2L503.7 201.0L505.9 210.2L518.6 218.9L518.9 224.3L523.3 225.8L526.1 239.5L554.3 244.5L561.7 238.1L561.7 250.5L494.7 250.4L494.6 197.2Z"},
  {name:"Woodward",cx:355.3,cy:60.7,cadc:false,path:"M347.7 32.3L351.5 36.1L361.7 36.3L378.0 56.8L378.4 105.3L320.4 105.0L319.6 57.4L347.7 57.2L347.7 32.3Z"},
  {name:"Noble",cx:542.3,cy:77.0,cadc:false,path:"M550.2 57.3L562.6 56.6L565.6 59.4L552.5 67.0L552.5 86.2L562.2 86.3L562.2 95.9L542.7 95.9L542.7 105.6L513.7 105.0L513.6 57.4L550.2 57.3Z"},
  {name:"Ellis",cx:308.7,cy:108.1,cadc:false,path:"M319.6 57.4L320.4 105.0L339.8 105.0L339.9 121.8L330.3 124.9L323.8 138.1L318.3 140.8L304.1 135.7L299.2 122.6L293.5 124.9L292.1 131.2L283.8 136.5L283.6 57.4L319.6 57.4Z"},
  {name:"Payne",cx:553.3,cy:116.0,cadc:false,path:"M562.2 95.9L571.8 95.9L571.8 105.6L589.7 105.5L589.7 129.8L538.6 129.8L528.2 122.2L523.4 124.9L523.4 105.6L542.7 105.6L542.7 95.9L562.2 95.9Z"},
  {name:"Logan",cx:518.6,cy:132.0,cadc:false,path:"M513.7 105.0L523.4 105.0L523.4 124.9L527.5 122.0L537.0 129.4L542.7 127.8L542.7 153.9L494.4 153.7L494.3 105.0L513.7 105.0Z"},
  {name:"Roger Mills",cx:313.5,cy:146.9,cadc:true,path:"M339.9 121.8L341.4 177.8L322.3 177.8L322.3 187.5L283.8 187.4L283.8 136.5L292.1 131.2L293.5 124.9L300.7 122.9L304.1 135.7L318.2 140.8L323.8 138.1L330.3 124.9L339.9 121.8Z"},
  {name:"Seminole",cx:589.6,cy:213.9,cadc:false,path:"M606.0 202.1L606.0 221.5L601.6 221.4L600.7 246.1L598.1 248.8L595.4 243.7L588.3 245.6L583.3 241.7L583.3 248.6L579.5 249.9L575.7 245.4L575.7 188.6L597.3 190.9L595.7 183.9L600.9 186.7L606.0 182.4L606.0 202.1Z"},
  {name:"Washita",cx:388.1,cy:209.3,cadc:true,path:"M341.4 182.6L408.5 182.7L409.0 223.0L406.0 220.5L398.3 223.1L341.8 221.4L341.4 182.6Z"},
  {name:"Grady",cx:476.2,cy:217.0,cadc:false,path:"M456.2 192.4L494.6 197.0L494.9 269.7L456.8 269.7L456.2 192.4Z"},
  {name:"Pontotoc",cx:588.2,cy:251.8,cadc:false,path:"M575.7 245.4L581.5 249.9L583.8 246.8L581.6 243.6L584.3 241.8L588.3 245.6L595.4 243.7L598.7 248.8L601.7 244.1L607.4 245.1L609.2 241.8L609.2 269.8L599.6 269.8L599.6 289.2L571.1 289.2L571.1 279.5L561.6 279.5L561.7 238.3L565.8 242.5L572.1 240.3L575.7 245.4Z"},
  {name:"Cotton",cx:430.0,cy:324.3,cadc:true,path:"M452.0 289.1L450.8 331.8L431.8 327.9L427.4 335.9L421.1 338.4L409.7 327.9L409.7 308.3L405.0 308.3L405.0 300.3L419.2 298.7L419.2 295.5L438.1 295.5L442.8 293.9L442.8 289.1L452.0 289.1Z"},
  {name:"Carter",cx:531.8,cy:314.1,cadc:false,path:"M523.6 289.1L523.6 303.6L552.1 303.7L552.8 308.4L561.5 308.4L561.4 326.2L558.3 326.2L558.3 337.5L504.5 337.5L504.5 289.1L523.6 289.1Z"},
  {name:"Cleveland",cx:517.8,cy:215.9,cadc:false,path:"M542.6 223.0L542.6 242.3L526.1 239.5L523.2 225.5L518.9 224.3L518.7 219.0L510.9 211.8L505.9 210.2L503.8 201.1L494.8 197.4L494.7 192.4L542.6 192.5L542.6 223.0Z"},
  {name:"Garvin",cx:529.4,cy:271.7,cadc:false,path:"M561.5 250.5L561.6 274.7L537.4 276.2L542.4 289.1L504.5 289.1L504.5 269.7L494.9 269.7L495.0 250.4L561.5 250.5Z"},
  {name:"Pawnee",cx:585.0,cy:83.4,cadc:false,path:"M577.0 60.6L582.4 75.4L588.5 76.0L592.8 81.7L598.4 79.6L594.7 89.0L598.9 90.3L604.5 86.3L615.2 97.7L623.0 98.4L621.7 105.3L571.8 105.6L571.8 95.9L562.2 95.9L562.2 86.3L552.5 86.2L552.5 67.0L561.3 72.6L577.0 60.6Z"},
  {name:"Osage",cx:593.3,cy:65.4,cadc:false,path:"M645.8 74.4L645.9 105.4L621.7 105.3L623.0 98.4L615.2 97.7L604.5 86.3L598.9 90.3L594.7 89.0L598.4 79.6L592.8 81.7L588.5 76.0L582.4 75.4L577.7 60.8L571.7 63.4L566.7 71.0L557.1 71.5L554.9 65.4L565.6 59.4L562.6 56.6L550.4 57.5L549.6 47.3L561.6 47.1L565.5 39.8L570.8 40.6L577.8 36.4L578.1 12.3L645.9 12.3L645.8 74.4Z"},
  {name:"Kiowa",cx:366.4,cy:244.2,cadc:true,path:"M341.8 221.4L398.3 223.1L407.1 220.6L408.8 250.4L390.1 250.4L390.1 279.4L374.3 279.4L374.3 274.5L365.0 274.5L365.9 270.8L370.9 268.6L360.0 266.5L361.3 251.0L357.1 250.1L352.8 254.7L345.7 248.6L348.2 245.1L342.9 236.3L345.1 230.0L340.8 228.4L341.0 224.6L337.3 221.6L341.8 221.4Z"},
  {name:"Greer",cx:335.7,cy:240.7,cadc:false,path:"M337.3 221.6L341.0 224.6L340.8 228.4L345.1 230.0L342.9 236.3L348.2 245.1L345.7 248.6L352.1 255.2L337.6 255.1L337.7 260.0L334.5 260.8L336.1 264.8L314.0 264.9L312.4 260.0L309.2 260.0L308.2 240.5L294.0 240.5L293.9 231.0L303.5 231.0L303.5 221.3L337.3 221.6Z"},
  {name:"Love",cx:533.2,cy:356.8,cadc:false,path:"M558.2 337.5L561.3 350.4L556.0 351.0L556.8 357.7L553.3 362.6L547.5 361.6L551.1 365.6L547.1 367.1L547.6 373.8L545.2 376.6L537.9 372.0L536.9 365.5L540.4 362.3L536.8 354.9L532.2 360.5L527.4 357.7L525.4 361.5L525.3 358.2L521.1 365.5L514.4 364.4L514.6 357.4L511.4 354.6L504.7 356.6L504.7 347.1L506.8 347.1L504.7 337.5L558.2 337.5Z"},
  {name:"Pottawatomie",cx:565.2,cy:210.0,cadc:false,path:"M589.4 182.9L588.8 190.7L580.4 187.1L575.7 188.6L575.7 245.4L572.1 240.3L565.8 242.5L561.6 238.1L554.4 244.4L542.6 242.3L542.7 182.8L589.4 182.9Z"},
  {name:"Jackson",cx:345.4,cy:283.5,cadc:false,path:"M360.8 257.1L358.7 261.5L360.3 266.9L371.0 269.0L365.8 271.0L366.9 279.8L359.6 280.1L354.3 290.6L353.0 300.6L356.4 307.6L340.9 294.4L337.7 304.0L322.8 298.9L320.1 303.8L311.5 303.4L297.9 289.1L314.0 289.0L314.0 264.9L336.1 264.8L334.5 260.8L337.7 260.0L337.6 255.1L352.1 255.2L357.8 249.9L361.3 251.0L360.8 257.1Z"},
  {name:"Alfalfa",cx:435.6,cy:43.9,cadc:false,path:"M415.6 12.3L454.8 12.4L455.4 71.8L416.6 71.8L415.6 12.3Z"},
  {name:"Garfield",cx:483.5,cy:81.7,cadc:false,path:"M513.6 57.4L513.7 105.0L455.5 105.0L455.5 57.3L513.6 57.4Z"},
  {name:"Major",cx:419.1,cy:86.1,cadc:false,path:"M455.4 71.8L455.5 105.0L378.4 105.3L378.0 67.0L388.5 67.1L393.2 72.9L410.3 79.9L416.6 79.1L416.6 71.8L455.4 71.8Z"},
  {name:"Blaine",cx:424.8,cy:142.8,cadc:false,path:"M445.8 105.0L446.1 153.8L436.5 153.8L436.6 173.1L407.7 173.1L407.3 105.0L445.8 105.0Z"},
  {name:"Kingfisher",cx:472.2,cy:130.1,cadc:false,path:"M446.1 153.8L445.8 105.0L494.3 105.0L494.4 153.7L446.1 153.8Z"},
  {name:"Dewey",cx:374.9,cy:126.3,cadc:false,path:"M378.4 105.3L407.3 105.0L407.7 144.1L340.3 144.1L339.8 105.0L378.4 105.3Z"},
  {name:"Lincoln",cx:565.8,cy:157.2,cadc:false,path:"M589.7 129.8L589.4 182.9L542.7 182.8L542.7 129.7L589.7 129.8Z"},
  {name:"Custer",cx:377.7,cy:162.9,cadc:false,path:"M407.7 144.1L408.5 182.7L341.4 182.6L340.3 144.1L407.7 144.1Z"},
  {name:"Canadian",cx:470.5,cy:183.1,cadc:true,path:"M494.4 153.7L494.6 197.0L479.2 197.3L470.1 192.4L468.5 195.7L463.3 192.0L437.2 192.4L436.5 153.8L494.4 153.7Z"},
  {name:"Beckham",cx:314.1,cy:205.3,cadc:true,path:"M341.4 177.8L341.8 221.4L303.5 221.3L303.5 231.0L283.8 230.9L283.8 187.4L322.3 187.5L322.3 177.8L341.4 177.8Z"},
  {name:"Harmon",cx:295.5,cy:269.6,cadc:false,path:"M293.9 231.0L294.0 240.5L308.2 240.5L309.2 260.0L314.0 261.7L314.0 289.0L297.9 289.1L290.4 281.4L283.8 283.1L283.8 230.9L293.9 231.0Z"},
  {name:"Comanche",cx:425.8,cy:269.6,cadc:true,path:"M456.5 250.4L456.8 269.7L452.1 269.7L452.0 289.1L442.8 289.1L442.8 293.9L438.1 295.5L419.2 295.5L419.2 298.7L405.0 300.3L405.0 289.0L390.1 289.0L390.1 250.4L456.5 250.4Z"},
  {name:"Stephens",cx:481.3,cy:291.1,cadc:false,path:"M494.9 269.7L504.5 269.7L504.5 313.3L452.3 313.2L452.1 269.7L494.9 269.7Z"},
  {name:"Tillman",cx:370.9,cy:305.3,cadc:true,path:"M390.1 279.4L390.1 289.0L405.0 289.0L405.0 308.3L409.7 308.3L409.7 327.9L396.4 331.5L375.4 320.8L370.1 323.4L357.1 321.5L355.1 311.0L356.9 306.0L352.8 298.2L359.5 280.1L366.8 279.9L365.0 274.5L374.3 274.5L374.3 279.4L390.1 279.4Z"},
  {name:"Murray",cx:546.8,cy:288.9,cadc:false,path:"M561.6 274.7L561.6 279.5L571.1 279.5L571.1 289.2L566.2 289.2L566.2 308.4L552.8 308.4L552.1 303.7L523.6 303.6L523.6 289.1L542.4 289.1L537.4 276.2L561.6 274.7Z"},
  {name:"Johnston",cx:585.9,cy:316.0,cadc:false,path:"M599.4 289.2L599.5 298.8L609.1 298.9L609.1 327.9L604.9 327.9L604.9 332.7L593.0 332.6L585.3 326.2L561.4 326.2L561.5 308.4L566.2 308.4L566.2 289.2L599.4 289.2Z"},
  {name:"Jefferson",cx:479.4,cy:344.0,cadc:true,path:"M504.5 313.3L504.7 345.0L506.8 347.1L504.7 347.1L504.7 356.5L501.5 354.9L502.1 350.5L494.7 346.3L476.2 362.0L466.3 356.7L469.8 346.4L457.4 345.1L455.3 341.6L457.4 341.1L454.0 336.4L456.8 331.0L452.3 329.6L452.3 313.2L504.5 313.3Z"},
  {name:"Marshall",cx:585.3,cy:343.4,cadc:false,path:"M593.0 332.6L596.4 338.3L593.6 344.3L589.4 344.4L593.8 349.4L592.8 356.8L585.6 354.6L581.5 364.1L576.6 364.7L572.4 359.5L567.5 361.7L564.0 351.2L561.3 350.4L561.3 343.9L558.2 343.9L558.3 326.2L588.2 326.7L593.0 332.6Z"},
  {name:"Oklahoma",cx:520.9,cy:175.4,cadc:false,path:"M542.6 187.6L542.6 192.5L494.7 192.4L494.4 153.7L542.7 153.9L542.6 187.6Z"}
];

const VIEWBOX = "220 85 340 310";

// ─── Orbit geometry ───────────────────────────────────────────────────────────

const RADIUS_PCT = 38;
const START_DEG = -90;

function nodePos(i: number, total: number) {
  const angle = START_DEG + (i / total) * 360;
  const rad = (angle * Math.PI) / 180;
  return { x: 50 + RADIUS_PCT * Math.cos(rad), y: 50 + RADIUS_PCT * Math.sin(rad) };
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function HomeExperience() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("logo");
  const [selectedCounty, setSelectedCounty] = useState<CadcCounty | null>(null);
  const [countyPrograms, setCountyPrograms] = useState<ProgramSlug[]>([]);
  const [visibleCount, setVisibleCount] = useState(0);
  const [activeSlug, setActiveSlug] = useState<ProgramSlug | null>(null);
  const [glowTarget, setGlowTarget] = useState<string | null>(null);
  const [logoGlow, setLogoGlow] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const reduceMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => () => { timers.current.forEach(clearTimeout); }, []);

  function glow(id: string, ms = 600) {
    setGlowTarget(id);
    timers.current.push(setTimeout(() => setGlowTarget(null), ms));
  }

  function selectCounty(name: CadcCounty) {
    glow(name);
    setSelectedCounty(name);
    const progs = COUNTY_PROGRAMS[name];
    setCountyPrograms(progs);
    setVisibleCount(0);
    setActiveSlug(null);
    timers.current.push(setTimeout(() => {
      setStage("orbit");
      if (reduceMotion) {
        setVisibleCount(progs.length);
      } else {
        progs.forEach((_, i) => {
          timers.current.push(setTimeout(() => setVisibleCount(c => Math.max(c, i + 1)), 80 + i * 90));
        });
      }
    }, reduceMotion ? 0 : 350));
  }

  function selectProgram(slug: ProgramSlug) {
    glow(slug);
    timers.current.push(setTimeout(() => router.push(programHref(slug)), 300));
  }

  function goBack() {
    if (stage === "orbit") { setStage("map"); setVisibleCount(0); }
    else if (stage === "map") { setStage("logo"); }
  }

  const isOrbit = stage === "orbit";
  const isMap = stage === "map";
  const isLogo = stage === "logo";

  return (
    <section
      className="relative w-full cadc-grid-bg"
      style={{ height: "100svh", overflow: "hidden" }}
    >
      {/* ── LOGO STAGE ── */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-500"
        style={{
          opacity: isLogo ? 1 : 0,
          pointerEvents: isLogo ? "auto" : "none",
          transform: isLogo ? "scale(1)" : "scale(0.94)",
        }}
      >
        <button
          type="button"
          onClick={() => { setLogoGlow(true); setTimeout(() => { setLogoGlow(false); setStage("map"); }, 300); }}
          className="flex flex-col items-center"
          aria-label="Explore CADC service area"
        >
          <div className="relative">
            {/* Glow ring */}
            <div style={{
              position: "absolute", inset: "-20px", borderRadius: "50%",
              background: "radial-gradient(circle, rgba(1,1,255,0.22) 0%, transparent 70%)",
              transform: logoGlow ? "scale(2.2)" : "scale(1)",
              opacity: logoGlow ? 0 : 0.7,
              transition: "transform 0.5s ease-out, opacity 0.5s ease-out",
            }} />
            <div
              className="relative flex flex-col items-center justify-center gap-1 bg-white rounded-full border-[3px]"
              style={{
                width: "clamp(120px, 32vw, 160px)",
                aspectRatio: "1/1",
                borderColor: logoGlow ? "var(--cadc-maroon)" : "var(--cadc-blue)",
                boxShadow: logoGlow
                  ? "0 0 0 16px rgba(1,1,255,0.07), 0 0 50px rgba(1,1,255,0.25)"
                  : "0 0 0 6px rgba(1,1,255,0.07), 0 8px 32px rgba(1,1,255,0.16)",
                transition: "box-shadow 0.4s ease, border-color 0.3s ease",
              }}
            >
              <span className="font-serif font-bold leading-none" style={{ fontSize: "clamp(1.6rem,6vw,2.4rem)", color: "var(--cadc-blue)", letterSpacing: "0.04em" }}>CADC</span>
              <span className="block" style={{ width: "38px", height: "2px", background: "var(--cadc-maroon)", margin: "3px 0" }} />
              <span className="text-center font-semibold uppercase" style={{ fontSize: "0.42rem", letterSpacing: "0.06em", color: "#4a4a6a", lineHeight: 1.4 }}>
                Community Action<br />Development Corp.
              </span>
            </div>
          </div>
          <p className="mt-4 font-semibold uppercase tracking-widest" style={{ fontSize: "0.62rem", color: "var(--cadc-blue)", opacity: 0.6 }}>
            Tap to explore your county
          </p>
        </button>
        <p className="absolute bottom-6 text-center font-medium uppercase tracking-widest" style={{ fontSize: "0.58rem", color: "#4a4a6a", opacity: 0.45 }}>
          {org.serviceAreaLabel}
        </p>
      </div>

      {/* ── MAP STAGE ── */}
      <div
        className="absolute inset-0 flex flex-col transition-all duration-500"
        style={{
          opacity: isMap ? 1 : 0,
          pointerEvents: isMap ? "auto" : "none",
          transform: isMap ? "translateY(0)" : "translateY(16px)",
          paddingTop: "12px",
          paddingLeft: "12px",
          paddingRight: "12px",
          overflowY: "auto",
        }}
      >
        <button onClick={goBack} className="flex items-center gap-1.5 mb-3 self-start" style={{ fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--cadc-blue)", opacity: 0.65 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back
        </button>

        <p className="text-center font-bold uppercase tracking-widest mb-1" style={{ fontSize: "0.65rem", color: "var(--cadc-maroon)" }}>Select Your County</p>
        <h2 className="font-serif font-bold text-center mb-3" style={{ fontSize: "clamp(1.3rem,5vw,2rem)", color: "var(--cadc-blue)" }}>Where do you need help?</h2>

        {/* Map — cropped to SW Oklahoma */}
        <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "var(--cadc-border)", background: "#f9f9fc" }}>
          <svg
            viewBox={{VIEWBOX}}
            className="w-full h-auto block"
            aria-label="Southwest Oklahoma county map"
            role="img"
          >
            {OK_COUNTIES.map((county) => {
              const isGlowing = glowTarget === county.name;
              return (
                <g key={{county.name}}>
                  {isGlowing && (
                    <circle cx={{county.cx}} cy={{county.cy}} r={25}
                      fill="rgba(1,1,255,0.25)"
                      style={{ animation: "ping 0.6s ease-out forwards" }}
                    />
                  )}
                  <path
                    d={{county.path}}
                    onClick={{() => county.cadc && selectCounty(county.name as CadcCounty)}}
                    style={{
                      fill: county.name === selectedCounty
                        ? "var(--cadc-blue)"
                        : county.cadc ? "var(--cadc-blue-light)" : "#ededf4",
                      stroke: "#ffffff",
                      strokeWidth: county.cadc ? 1.2 : 0.6,
                      cursor: county.cadc ? "pointer" : "default",
                      transition: "fill 0.2s ease",
                    }}
                  />
                  {county.cadc && (
                    <>
                      <text
                        x={{county.cx}} y={{county.cy}}
                        textAnchor="middle" dominantBaseline="middle"
                        style={{
                          fontSize: county.name === "Roger Mills" ? "5.5px" : "6.5px",
                          fontWeight: 700,
                          fill: county.name === selectedCounty ? "#ffffff" : "var(--cadc-blue)",
                          pointerEvents: "none",
                          fontFamily: "system-ui, sans-serif",
                          letterSpacing: "0.03em",
                        }}
                      >
                        {county.name === "Roger Mills" ? "Roger Mills" : county.name}
                      </text>
                      {county.name !== selectedCounty && (
                        <circle
                          cx={{county.cx}} cy={{county.cy - 11}} r={3.5}
                          fill="var(--cadc-maroon)" stroke="#fff" strokeWidth={1.2}
                          style={{ pointerEvents: "none" }}
                        />
                      )}
                    </>
                  )}
                </g>
              );
            })}
          </svg>

          <div className="flex items-center gap-4 px-3 py-2 border-t" style={{ borderColor: "var(--cadc-border)" }}>
            <span className="flex items-center gap-1.5" style={{ fontSize: "0.65rem" }}>
              <span className="w-3 h-3 rounded-sm inline-block border-[1.5px]" style={{ background: "var(--cadc-blue-light)", borderColor: "var(--cadc-blue)" }}></span>
              <span style={{ color: "var(--cadc-ink)" }}>CADC County</span>
            </span>
            <span className="flex items-center gap-1.5" style={{ fontSize: "0.65rem" }}>
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: "var(--cadc-maroon)" }}></span>
              <span style={{ color: "var(--cadc-ink)" }}>Tap to see services</span>
            </span>
          </div>
        </div>

        <p className="mt-3 text-center" style={{ fontSize: "0.6rem", color: "#9ca3af" }}>
          9 base counties · {org.tagline}
        </p>
      </div>

      {/* ── ORBIT STAGE ── */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-500"
        style={{
          opacity: isOrbit ? 1 : 0,
          pointerEvents: isOrbit ? "auto" : "none",
          transform: isOrbit ? "translateY(0)" : "translateY(16px)",
        }}
      >
        {/* Back + county label */}
        <div className="absolute top-3 left-0 right-0 flex items-center justify-between px-4">
          <button onClick={goBack} className="flex items-center gap-1.5" style={{ fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--cadc-blue)", opacity: 0.65 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Map
          </button>
          {selectedCounty && (
            <span className="font-bold uppercase tracking-widest" style={{ fontSize: "0.6rem", color: "var(--cadc-maroon)" }}>
              {selectedCounty} County
            </span>
          )}
        </div>

        {/* Orbit */}
        <div className="relative" style={{ width: "min(84vw, 84svh, 480px)", aspectRatio: "1/1" }}>
          {/* Ring */}
          <div className="absolute rounded-full border-dashed transition-all duration-700"
            style={{
              inset: "11%",
              border: "1.5px dashed rgba(1,1,255,0.16)",
              opacity: visibleCount > 0 ? 1 : 0,
            }}
          />

          {/* Connectors */}
          <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {countyPrograms.map((slug, i) => {
              const { x, y } = nodePos(i, countyPrograms.length);
              return (
                <line key={{slug}} x1={50} y1={50} x2={{x}} y2={{y}}
                  stroke={{slug === activeSlug ? "var(--cadc-maroon)" : "rgba(126,0,1,0.22)"}}
                  strokeWidth={{slug === activeSlug ? 1.8 : 1}}
                  strokeDasharray="4 4"
                  style={{ opacity: i < visibleCount ? 1 : 0, transition: "opacity 0.4s ease, stroke 0.25s ease" }}
                />
              );
            })}
          </svg>

          {/* Center logo */}
          <button
            type="button"
            onClick={() => { setStage("map"); setVisibleCount(0); setActiveSlug(null); }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center"
            aria-label="Back to map"
          >
            <div className="bg-white rounded-full border-[3px] flex flex-col items-center justify-center gap-0.5"
              style={{
                width: "clamp(76px, 21vw, 110px)",
                aspectRatio: "1/1",
                borderColor: "var(--cadc-blue)",
                boxShadow: "0 0 0 5px rgba(1,1,255,0.07), 0 6px 22px rgba(1,1,255,0.14)",
              }}
            >
              <span className="font-serif font-bold leading-none" style={{ fontSize: "clamp(1rem,3.5vw,1.6rem)", color: "var(--cadc-blue)", letterSpacing: "0.04em" }}>CADC</span>
              <span className="block" style={{ width: "30px", height: "1.5px", background: "var(--cadc-maroon)", margin: "2px 0" }} />
              <span className="text-center font-semibold uppercase leading-tight" style={{ fontSize: "0.36rem", letterSpacing: "0.05em", color: "#4a4a6a" }}>
                Community Action<br />Development Corp.
              </span>
            </div>
          </button>

          {/* Program nodes */}
          {countyPrograms.map((slug, i) => {
            const prog = programs.find(p => p.slug === slug)!;
            const { x, y } = nodePos(i, countyPrograms.length);
            const isOn = i < visibleCount;
            const isActive = slug === activeSlug;
            const isGlowing = glowTarget === slug;

            return (
              <button
                key={{slug}}
                type="button"
                tabIndex={{isOn ? 0 : -1}}
                onClick={{() => { setActiveSlug(slug); selectProgram(slug); }}}
                aria-label={{prog.name}}
                className="absolute flex flex-col items-center gap-1"
                style={{
                  left: `${{x}}%`, top: `${{y}}%`,
                  width: "clamp(56px,15vw,76px)",
                  transform: `translate(-50%, -50%) scale(${{isOn ? 1 : 0.3}})`,
                  opacity: isOn ? 1 : 0,
                  pointerEvents: isOn ? "auto" : "none",
                  transition: "opacity 0.4s ease, transform 0.45s ease",
                }}
              >
                {/* Glow */}
                {isGlowing && (
                  <div className="absolute rounded-full" style={{
                    inset: "-10px",
                    background: "radial-gradient(circle, rgba(1,1,255,0.35) 0%, transparent 70%)",
                    animation: "ping 0.6s ease-out forwards",
                  }} />
                )}
                <div style={{
                  width: "clamp(40px,10vw,56px)",
                  aspectRatio: "1/1",
                  borderRadius: "50%",
                  background: "white",
                  border: `2.5px solid ${{isActive ? "var(--cadc-maroon)" : "var(--cadc-blue)"}}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "clamp(0.9rem,2.5vw,1.25rem)",
                  boxShadow: isActive
                    ? "0 0 0 4px rgba(126,0,1,0.18), 0 5px 18px rgba(126,0,1,0.22)"
                    : isGlowing
                    ? "0 0 0 8px rgba(1,1,255,0.14), 0 5px 20px rgba(1,1,255,0.28)"
                    : "0 3px 10px rgba(1,1,255,0.12)",
                  transition: "border-color 0.25s, box-shadow 0.3s",
                }} aria-hidden="true">
                  {{prog.icon}}
                </div>
                <span style={{
                  fontSize: "clamp(0.42rem,1.3vw,0.55rem)",
                  fontWeight: 700,
                  color: isActive ? "var(--cadc-maroon)" : "var(--cadc-blue)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  textAlign: "center",
                  lineHeight: 1.2,
                  width: "clamp(56px,15vw,76px)",
                  overflowWrap: "break-word",
                }}>
                  {{prog.shortName}}
                </span>
              </button>
            );
          })}
        </div>

        <p className="mt-2 font-medium uppercase tracking-widest" style={{ fontSize: "0.58rem", color: "#4a4a6a", opacity: 0.45 }}>
          Tap a program to go there
        </p>
      </div>

      {/* Ping animation */}
      <style>{`
        @keyframes ping {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.8); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
