"use client";

// ─── CADC Staff Admin — /admin ────────────────────────────────────────────────
// Phone-friendly editor for the content directors change most often.
// Reached via the hidden door (tap the © line in the footer 5 times) or /admin.
// Auth: single shared password (ADMIN_PASSWORD env var on Vercel), stored in
// sessionStorage for the tab only. Saves go to Vercel KV via /api/cms.

import { useEffect, useMemo, useState } from "react";
import { DEFAULT_CONTENT, type SiteContent, type Meal, type MarketStop, type StaffMember, type PublicDoc } from "@/lib/cms";

const BLUE = "#0101FF", MAROON = "#CC0000", BORDER = "#e5e7eb", MUTED = "#6b7280";
const card: React.CSSProperties = { background: "white", border: `1px solid ${BORDER}`, borderRadius: 14, padding: 16, marginBottom: 14 };
const input: React.CSSProperties = { width: "100%", fontSize: 16, padding: "12px 12px", border: `1px solid ${BORDER}`, borderRadius: 10, boxSizing: "border-box", fontFamily: "inherit" };
const label: React.CSSProperties = { color: MAROON, fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 6px", display: "block" };
const btn = (bg = BLUE, fg = "white"): React.CSSProperties => ({ background: bg, color: fg, border: bg === "white" ? `1px solid ${BLUE}` : "none", borderRadius: 10, padding: "12px 18px", fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "inherit" });

type Tab = "announce" | "menu" | "market" | "staff" | "docs";
const TABS: { id: Tab; label: string; icon: string; who: string }[] = [
  { id: "announce", label: "Announcement", icon: "📣", who: "Leslea" },
  { id: "menu",     label: "Senior Menu",  icon: "🍽️", who: "Laura" },
  { id: "market",   label: "Market Schedule", icon: "🛒", who: "Scott" },
  { id: "staff",    label: "Staff Directory", icon: "👤", who: "Leslea" },
  { id: "docs",     label: "Public Documents", icon: "📄", who: "Leslea" },
];

export default function AdminPage() {
  const [key, setKey] = useState<string>("");
  const [authed, setAuthed] = useState(false);
  const [name, setName] = useState("");
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [tab, setTab] = useState<Tab>("announce");
  const [status, setStatus] = useState<string>("");
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const k = sessionStorage.getItem("cadc-admin-key");
    const n = sessionStorage.getItem("cadc-admin-name");
    if (k) { setKey(k); setAuthed(true); }
    if (n) setName(n);
    fetch("/api/cms", { cache: "no-store" }).then(r => r.json()).then(j => { setContent({ ...DEFAULT_CONTENT, ...j }); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  async function login() {
    const r = await fetch("/api/cms", { method: "HEAD", headers: { "x-admin-key": key } });
    if (r.status === 204) { sessionStorage.setItem("cadc-admin-key", key); sessionStorage.setItem("cadc-admin-name", name); setAuthed(true); setStatus(""); }
    else setStatus("That password didn't work. Check with Leslea or Chris.");
  }
  function logout() { sessionStorage.clear(); setAuthed(false); setKey(""); }

  function update<K extends keyof SiteContent>(k: K, v: SiteContent[K]) { setContent(c => ({ ...c, [k]: v })); setDirty(true); }

  async function save() {
    setStatus("Saving…");
    const r = await fetch("/api/cms", { method: "POST", headers: { "Content-Type": "application/json", "x-admin-key": key }, body: JSON.stringify({ ...content, updatedBy: name || "staff" }) });
    if (r.ok) { setStatus("✓ Saved — the website is updated."); setDirty(false); }
    else if (r.status === 401) { setStatus("Session expired. Please log in again."); logout(); }
    else setStatus("Save failed. Try again or call Chris.");
    setTimeout(() => setStatus(s => s.startsWith("✓") ? "" : s), 4000);
  }

  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", background: "#F8F9FF", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'Space Grotesk','Inter',sans-serif" }}>
        <div style={{ ...card, maxWidth: 380, width: "100%", textAlign: "center" }}>
          <img src="/images/cadc-logo.png" alt="CADC" style={{ height: 52, margin: "8px auto 14px" }} />
          <h1 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 4px", color: "#111827" }}>Staff Sign-In</h1>
          <p style={{ color: MUTED, fontSize: 13, margin: "0 0 18px" }}>Update the CADC website from your phone.</p>
          <div style={{ textAlign: "left", marginBottom: 10 }}><span style={label}>Your name</span><input style={input} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Laura" autoComplete="name" /></div>
          <div style={{ textAlign: "left", marginBottom: 16 }}><span style={label}>Staff password</span><input style={input} type="password" value={key} onChange={e => setKey(e.target.value)} onKeyDown={e => e.key === "Enter" && login()} autoComplete="current-password" /></div>
          <button style={{ ...btn(), width: "100%" }} onClick={login}>Sign In</button>
          {status && <p style={{ color: MAROON, fontSize: 13, marginTop: 12 }}>{status}</p>}
          <a href="/" style={{ display: "block", marginTop: 16, color: MUTED, fontSize: 12 }}>← Back to cadcok.org</a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F8F9FF", fontFamily: "'Space Grotesk','Inter',sans-serif", color: "#111827" }}>
      {/* Top bar */}
      <div style={{ position: "sticky", top: 0, zIndex: 10, background: "white", borderBottom: `1px solid ${BORDER}`, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/images/cadc-logo.png" alt="CADC" style={{ height: 30 }} />
          <div><div style={{ fontWeight: 800, fontSize: 13 }}>Staff Admin</div><div style={{ fontSize: 11, color: MUTED }}>Signed in as {name || "staff"}</div></div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ ...btn(dirty ? MAROON : BLUE), padding: "10px 16px" }} onClick={save} disabled={!dirty && !status.startsWith("Sav")}>{dirty ? "Save changes" : "Saved"}</button>
          <button style={{ ...btn("white", BLUE), padding: "10px 12px" }} onClick={logout}>Sign out</button>
        </div>
      </div>
      {status && <div style={{ background: status.startsWith("✓") ? "#E4E4FF" : "#FFE4E4", color: status.startsWith("✓") ? BLUE : MAROON, padding: "10px 14px", fontWeight: 700, fontSize: 13, textAlign: "center" }}>{status}</div>}

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, padding: "12px 14px 0", overflowX: "auto" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: "0 0 auto", background: tab === t.id ? BLUE : "white", color: tab === t.id ? "white" : BLUE, border: `1px solid ${tab === t.id ? BLUE : BORDER}`, borderRadius: 20, padding: "9px 14px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: 14, maxWidth: 720, margin: "0 auto" }}>
        {loading && <p style={{ color: MUTED }}>Loading current content…</p>}
        <p style={{ color: MUTED, fontSize: 12, margin: "6px 0 14px" }}>Usually updated by <strong>{TABS.find(t => t.id === tab)?.who}</strong>. Last site update: {new Date(content.updatedAt).toLocaleString()} by {content.updatedBy}.</p>

        {tab === "announce" && <AnnounceEditor v={content.announcement} onChange={v => update("announcement", v)} />}
        {tab === "menu"     && <MenuEditor v={content.seniorMenu} onChange={v => update("seniorMenu", v)} />}
        {tab === "market"   && <MarketEditor v={content.marketSchedule} onChange={v => update("marketSchedule", v)} />}
        {tab === "staff"    && <StaffEditor v={content.staff} onChange={v => update("staff", v)} />}
        {tab === "docs"     && <DocsEditor v={content.documents} onChange={v => update("documents", v)} />}

        <div style={{ ...card, background: "#F0F0FF", border: "none", marginTop: 20 }}>
          <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.6 }}>
            <strong>Need help?</strong> Changes go live the moment you tap Save. If something looks wrong on the website, tap Save again after fixing it, or call Chris at IronSilk Strategies. Nothing here can break the site — if the connection fails, visitors see the last saved version.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Editors ──────────────────────────────────────────────────────────────────

function AnnounceEditor({ v, onChange }: { v: SiteContent["announcement"]; onChange: (v: SiteContent["announcement"]) => void }) {
  return (
    <div style={card}>
      <span style={label}>Site-wide announcement banner</span>
      <p style={{ color: MUTED, fontSize: 13, margin: "0 0 12px" }}>Shows at the very top of every page. Use for closures, weather delays, enrollment deadlines.</p>
      <label style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, fontWeight: 700 }}>
        <input type="checkbox" checked={v.enabled} onChange={e => onChange({ ...v, enabled: e.target.checked })} style={{ width: 22, height: 22 }} /> Show the banner
      </label>
      <span style={label}>Message</span>
      <input style={input} value={v.text} onChange={e => onChange({ ...v, text: e.target.value })} placeholder="e.g. All CADC offices closed Monday, Sept 7 for Labor Day" />
      <span style={{ ...label, marginTop: 12 }}>Link (optional)</span>
      <input style={input} value={v.href ?? ""} onChange={e => onChange({ ...v, href: e.target.value })} placeholder="/?program=head-start  or  https://…" />
    </div>
  );
}

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
function monthDates(month: string, year: number): string[] {
  const m = MONTHS.indexOf(month); if (m < 0) return [];
  const days = new Date(year, m + 1, 0).getDate();
  return Array.from({ length: days }, (_, i) => `${year}-${String(m + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`);
}
function dayLabel(d: string) { return new Date(d + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }); }
function isWeekend(d: string) { const w = new Date(d + "T12:00:00").getDay(); return w === 0 || w === 6; }

function MonthYear({ month, year, onChange }: { month: string; year: number; onChange: (m: string, y: number) => void }) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <select style={{ ...input, flex: 2 }} value={month} onChange={e => onChange(e.target.value, year)}>{MONTHS.map(m => <option key={m}>{m}</option>)}</select>
      <input style={{ ...input, flex: 1 }} type="number" value={year} onChange={e => onChange(month, Number(e.target.value))} />
    </div>
  );
}

function MenuEditor({ v, onChange }: { v: SiteContent["seniorMenu"]; onChange: (v: SiteContent["seniorMenu"]) => void }) {
  const dates = useMemo(() => monthDates(v.month, v.year), [v.month, v.year]);
  const setMeal = (d: string, meal: Meal | null) => { const meals = { ...v.meals }; if (meal) meals[d] = meal; else delete meals[d]; onChange({ ...v, meals }); };
  return (
    <>
      <div style={card}>
        <span style={label}>Menu month</span>
        <MonthYear month={v.month} year={v.year} onChange={(m, y) => onChange({ ...v, month: m, year: y })} />
        <span style={{ ...label, marginTop: 12 }}>Note shown under the calendar</span>
        <input style={input} value={v.note} onChange={e => onChange({ ...v, note: e.target.value })} />
        <p style={{ color: MUTED, fontSize: 12, margin: "10px 0 0" }}>Tip: switching the month keeps last month's meals on the same day numbers so you can edit instead of retyping. Clear a day to remove it.</p>
      </div>
      {dates.filter(d => !isWeekend(d)).map(d => {
        const meal = v.meals[d];
        return (
          <div key={d} style={{ ...card, padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <strong style={{ fontSize: 14 }}>{dayLabel(d)}</strong>
              {meal ? <button style={{ ...btn("white", MAROON), padding: "6px 10px", fontSize: 12, borderColor: MAROON }} onClick={() => setMeal(d, null)}>Clear day</button>
                    : <button style={{ ...btn("white", BLUE), padding: "6px 10px", fontSize: 12 }} onClick={() => setMeal(d, { headline: "", full: [] })}>+ Add meal</button>}
            </div>
            {meal && (
              <>
                <span style={label}>Main dish (shows on calendar)</span>
                <input style={input} value={meal.headline} onChange={e => setMeal(d, { ...meal, headline: e.target.value })} placeholder="e.g. Meatloaf" />
                <span style={{ ...label, marginTop: 10 }}>Full meal — one item per line</span>
                <textarea style={{ ...input, minHeight: 90 }} value={meal.full.join("\n")} onChange={e => setMeal(d, { ...meal, full: e.target.value.split("\n").map(s => s.trim()).filter(Boolean) })} placeholder={"Meatloaf\nMashed Potatoes w/ Gravy\nGreen Beans\nDinner Roll\nFruit"} />
              </>
            )}
          </div>
        );
      })}
    </>
  );
}

function MarketEditor({ v, onChange }: { v: SiteContent["marketSchedule"]; onChange: (v: SiteContent["marketSchedule"]) => void }) {
  const dates = useMemo(() => monthDates(v.month, v.year), [v.month, v.year]);
  const setStops = (d: string, stops: MarketStop[] | null) => { const s = { ...v.stops }; if (stops && stops.length) s[d] = stops; else delete s[d]; onChange({ ...v, stops: s }); };
  return (
    <>
      <div style={card}>
        <span style={label}>Schedule month</span>
        <MonthYear month={v.month} year={v.year} onChange={(m, y) => onChange({ ...v, month: m, year: y })} />
        <span style={{ ...label, marginTop: 12 }}>Note shown under the calendar</span>
        <input style={input} value={v.note} onChange={e => onChange({ ...v, note: e.target.value })} />
        <span style={{ ...label, marginTop: 12 }}>Ride line</span>
        <input style={input} value={v.transportation} onChange={e => onChange({ ...v, transportation: e.target.value })} />
      </div>
      {dates.filter(d => !isWeekend(d)).map(d => {
        const stops = v.stops[d] ?? [];
        return (
          <div key={d} style={{ ...card, padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <strong style={{ fontSize: 14 }}>{dayLabel(d)}</strong>
              <button style={{ ...btn("white", BLUE), padding: "6px 10px", fontSize: 12 }} onClick={() => setStops(d, [...stops, { time: "", location: "" }])}>+ Add stop</button>
            </div>
            {stops.map((st, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr auto", gap: 6, marginBottom: 6 }}>
                <input style={input} value={st.time} placeholder="9:30–11:30" onChange={e => { const n = [...stops]; n[i] = { ...st, time: e.target.value }; setStops(d, n); }} />
                <input style={input} value={st.location} placeholder="Town" onChange={e => { const n = [...stops]; n[i] = { ...st, location: e.target.value }; setStops(d, n); }} />
                <button aria-label="Remove stop" style={{ ...btn("white", MAROON), padding: "0 12px", borderColor: MAROON }} onClick={() => setStops(d, stops.filter((_, j) => j !== i))}>×</button>
              </div>
            ))}
            {stops.length === 0 && <p style={{ color: MUTED, fontSize: 12, margin: 0 }}>No market this day</p>}
          </div>
        );
      })}
    </>
  );
}

function StaffEditor({ v, onChange }: { v: StaffMember[]; onChange: (v: StaffMember[]) => void }) {
  const set = (i: number, m: StaffMember) => { const n = [...v]; n[i] = m; onChange(n); };
  return (
    <>
      {v.map((m, i) => (
        <div key={i} style={card}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div><span style={label}>Name</span><input style={input} value={m.name} onChange={e => set(i, { ...m, name: e.target.value })} /></div>
            <div><span style={label}>Title</span><input style={input} value={m.title} onChange={e => set(i, { ...m, title: e.target.value })} /></div>
            <div><span style={label}>Phone</span><input style={input} value={m.phone ?? ""} onChange={e => set(i, { ...m, phone: e.target.value })} placeholder="580-…" /></div>
            <div><span style={label}>Email (optional)</span><input style={input} value={m.email ?? ""} onChange={e => set(i, { ...m, email: e.target.value })} /></div>
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
            {i > 0 && <button style={{ ...btn("white", BLUE), padding: "6px 10px", fontSize: 12 }} onClick={() => { const n = [...v]; [n[i-1], n[i]] = [n[i], n[i-1]]; onChange(n); }}>↑ Move up</button>}
            <button style={{ ...btn("white", MAROON), padding: "6px 10px", fontSize: 12, borderColor: MAROON, marginLeft: "auto" }} onClick={() => onChange(v.filter((_, j) => j !== i))}>Remove</button>
          </div>
        </div>
      ))}
      <button style={{ ...btn(), width: "100%" }} onClick={() => onChange([...v, { name: "", title: "" }])}>+ Add staff member</button>
    </>
  );
}

function DocsEditor({ v, onChange }: { v: PublicDoc[]; onChange: (v: PublicDoc[]) => void }) {
  const set = (i: number, d: PublicDoc) => { const n = [...v]; n[i] = d; onChange(n); };
  return (
    <>
      <div style={{ ...card, background: "#F0F0FF", border: "none" }}>
        <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.6 }}>To replace a PDF: ask Chris to upload the new file to the website with the <strong>same file name</strong> — the link below stays the same and the new document appears instantly. Change the label here if the document's name changes.</p>
      </div>
      {v.map((d, i) => (
        <div key={i} style={card}>
          <span style={label}>Document name</span><input style={input} value={d.label} onChange={e => set(i, { ...d, label: e.target.value })} />
          <span style={{ ...label, marginTop: 10 }}>File link</span><input style={input} value={d.href} onChange={e => set(i, { ...d, href: e.target.value })} />
          <button style={{ ...btn("white", MAROON), padding: "6px 10px", fontSize: 12, borderColor: MAROON, marginTop: 10 }} onClick={() => onChange(v.filter((_, j) => j !== i))}>Remove</button>
        </div>
      ))}
      <button style={{ ...btn(), width: "100%" }} onClick={() => onChange([...v, { label: "", href: "/documents/" }])}>+ Add document</button>
    </>
  );
}
