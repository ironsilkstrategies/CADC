"use client";

// ─── CADC Staff Admin — /admin ────────────────────────────────────────────────
// Phone-friendly editor for the content directors change most often.
// Reached via the hidden door (tap the © line in the footer 5 times) or /admin.
// Auth: single shared password (ADMIN_PASSWORD env var on Vercel), stored in
// sessionStorage for the tab only. Saves go to Vercel KV via /api/cms.

import { useEffect, useMemo, useState } from "react";
import {
  DEFAULT_CONTENT,
  fetchLeads, fetchStats, fetchVolunteer, fetchBookings,
  type SiteContent, type Meal, type MarketStop, type StaffMember,
  type PublicDoc, type IntakeLead, type SiteStats, type VolunteerEntry,
  type TransitBooking,
} from "@/lib/cms";

const BLUE = "#0101FF", MAROON = "#CC0000", BORDER = "#e5e7eb", MUTED = "#6b7280";
const GREEN = "#059669", AMBER = "#D97706";
const card: React.CSSProperties = { background: "white", border: `1px solid ${BORDER}`, borderRadius: 14, padding: 16, marginBottom: 14 };
const input: React.CSSProperties = { width: "100%", fontSize: 16, padding: "12px 12px", border: `1px solid ${BORDER}`, borderRadius: 10, boxSizing: "border-box", fontFamily: "inherit" };
const lbl: React.CSSProperties = { color: MAROON, fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 6px", display: "block" };
const btn = (bg = BLUE, fg = "white"): React.CSSProperties => ({ background: bg, color: fg, border: bg === "white" ? `1px solid ${BLUE}` : "none", borderRadius: 10, padding: "12px 18px", fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "inherit" });

type Tab = "announce" | "menu" | "market" | "staff" | "docs" | "leads" | "stats" | "volunteer" | "bookings";
const TABS: { id: Tab; label: string; icon: string; who: string }[] = [
  { id: "announce",  label: "Alert",         icon: "🚨", who: "Leslea" },
  { id: "menu",      label: "Senior Menu",   icon: "🍽️", who: "Laura" },
  { id: "market",    label: "Market",        icon: "🛒", who: "Scott" },
  { id: "staff",     label: "Staff",         icon: "👤", who: "Leslea" },
  { id: "docs",      label: "Documents",     icon: "📄", who: "Leslea" },
  { id: "leads",     label: "Intake Leads",  icon: "📥", who: "All" },
  { id: "bookings",  label: "Transit Rides", icon: "🚌", who: "Gilbert" },
  { id: "volunteer", label: "Volunteer Hrs", icon: "🤝", who: "Robin" },
  { id: "stats",     label: "Site Stats",    icon: "📊", who: "Leslea" },
];

const HS_CENTERS = ["Erick","Sayre","Temple","Ringling","Hobart","Hammon","Grandfield","Frederick","Burns Flat","Cordell","Sentinel"];
const STATUS_COLORS: Record<string, string> = { new: AMBER, contacted: BLUE, enrolled: GREEN, ineligible: MUTED, closed: "#9CA3AF" };
const STATUS_LABELS: Record<string, string> = { new: "New", contacted: "Contacted", enrolled: "Enrolled", ineligible: "Ineligible", closed: "Closed" };
const BK_COLORS: Record<string, string> = { new: AMBER, confirmed: BLUE, completed: GREEN, cancelled: "#9CA3AF" };
const HEAD_START_MATCH_GOAL = 1_075_417;

function MonthYear({ month, year, onChange }: { month: string; year: number; onChange: (m: string, y: number) => void }) {
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8, marginBottom: 12 }}>
      <select style={input} value={month} onChange={e => onChange(e.target.value, year)}>{months.map(m => <option key={m}>{m}</option>)}</select>
      <input style={{ ...input, width: 90 }} type="number" value={year} onChange={e => onChange(month, parseInt(e.target.value))} />
    </div>
  );
}
function monthDates(month: string, year: number): string[] {
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const m = months.indexOf(month);
  const days = new Date(year, m + 1, 0).getDate();
  return Array.from({ length: days }, (_, i) => { const d = i + 1; return `${year}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`; });
}
function isWeekend(d: string) { const day = new Date(d + "T12:00:00").getDay(); return day === 0 || day === 6; }
function dayLabel(d: string) { return new Date(d + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }); }

export default function AdminPage() {
  const [key, setKey] = useState("");
  const [authed, setAuthed] = useState(false);
  const [name, setName] = useState("");
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [tab, setTab] = useState<Tab>("announce");
  const [status, setStatus] = useState("");
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<IntakeLead[]>([]);
  const [stats, setStats] = useState<SiteStats | null>(null);
  const [volunteer, setVolunteer] = useState<VolunteerEntry[]>([]);
  const [bookings, setBookings] = useState<TransitBooking[]>([]);

  useEffect(() => {
    const k = sessionStorage.getItem("cadc-admin-key");
    const n = sessionStorage.getItem("cadc-admin-name");
    if (k) { setKey(k); setAuthed(true); }
    if (n) setName(n);
    fetch("/api/cms", { cache: "no-store" }).then(r => r.json()).then(j => { setContent({ ...DEFAULT_CONTENT, ...j }); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!authed || !key) return;
    fetchLeads(key).then(setLeads);
    fetchStats(key).then(setStats);
    fetchVolunteer(key).then(setVolunteer);
    fetchBookings(key).then(setBookings);
  }, [authed, key]);

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

  async function updateLeadStatus(id: string, s: IntakeLead["status"]) {
    await fetch("/api/cms/leads", { method: "PATCH", headers: { "Content-Type": "application/json", "x-admin-key": key }, body: JSON.stringify({ id, status: s }) });
    setLeads(l => l.map(lead => lead.id === id ? { ...lead, status: s } : lead));
  }
  async function updateBookingStatus(id: string, s: TransitBooking["status"]) {
    await fetch("/api/cms/bookings", { method: "PATCH", headers: { "Content-Type": "application/json", "x-admin-key": key }, body: JSON.stringify({ id, status: s }) });
    setBookings(b => b.map(bk => bk.id === id ? { ...bk, status: s } : bk));
  }
  async function deleteVolunteer(id: string) {
    await fetch("/api/cms/volunteer", { method: "DELETE", headers: { "Content-Type": "application/json", "x-admin-key": key }, body: JSON.stringify({ id }) });
    setVolunteer(v => v.filter(e => e.id !== id));
  }

  if (!authed) return (
    <div style={{ minHeight: "100vh", background: "#F8F9FF", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'Space Grotesk','Inter',sans-serif" }}>
      <div style={{ ...card, maxWidth: 380, width: "100%", textAlign: "center" }}>
        <img src="/images/cadc-logo.png" alt="CADC" style={{ height: 52, margin: "8px auto 14px" }} />
        <h1 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 4px", color: "#111827" }}>Staff Sign-In</h1>
        <p style={{ color: MUTED, fontSize: 13, margin: "0 0 18px" }}>Update the CADC website from your phone.</p>
        <div style={{ textAlign: "left", marginBottom: 10 }}><span style={lbl}>Your name</span><input style={input} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Laura" autoComplete="name" /></div>
        <div style={{ textAlign: "left", marginBottom: 16 }}><span style={lbl}>Staff password</span><input style={input} type="password" value={key} onChange={e => setKey(e.target.value)} onKeyDown={e => e.key === "Enter" && login()} autoComplete="current-password" /></div>
        <button style={{ ...btn(), width: "100%" }} onClick={login}>Sign In</button>
        {status && <p style={{ color: MAROON, fontSize: 13, marginTop: 12 }}>{status}</p>}
        <a href="/" style={{ display: "block", marginTop: 16, color: MUTED, fontSize: 12 }}>← Back to cadcok.org</a>
      </div>
    </div>
  );

  const isContentTab = ["announce","menu","market","staff","docs"].includes(tab);

  return (
    <div style={{ minHeight: "100vh", background: "#F8F9FF", fontFamily: "'Space Grotesk','Inter',sans-serif", color: "#111827" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 10, background: "white", borderBottom: `1px solid ${BORDER}`, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/images/cadc-logo.png" alt="CADC" style={{ height: 30 }} />
          <div><div style={{ fontWeight: 800, fontSize: 13 }}>Staff Admin</div><div style={{ fontSize: 11, color: MUTED }}>Signed in as {name || "staff"}</div></div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {isContentTab && <button style={{ ...btn(dirty ? MAROON : BLUE), padding: "10px 16px" }} onClick={save} disabled={!dirty}>{dirty ? "Save changes" : "Saved"}</button>}
          <button style={{ ...btn("white", BLUE), padding: "10px 12px" }} onClick={logout}>Sign out</button>
        </div>
      </div>
      {status && <div style={{ background: status.startsWith("✓") ? "#E4E4FF" : "#FFE4E4", color: status.startsWith("✓") ? BLUE : MAROON, padding: "10px 14px", fontWeight: 700, fontSize: 13, textAlign: "center" }}>{status}</div>}

      <div style={{ display: "flex", gap: 6, padding: "12px 14px 0", overflowX: "auto", WebkitOverflowScrolling: "touch" as "touch" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: "0 0 auto", background: tab === t.id ? BLUE : "white", color: tab === t.id ? "white" : BLUE, border: `1px solid ${tab === t.id ? BLUE : BORDER}`, borderRadius: 20, padding: "9px 14px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: 14, maxWidth: 720, margin: "0 auto" }}>
        {loading && <p style={{ color: MUTED }}>Loading…</p>}
        {isContentTab && <p style={{ color: MUTED, fontSize: 12, margin: "6px 0 14px" }}>Usually updated by <strong>{TABS.find(t => t.id === tab)?.who}</strong>. Last update: {new Date(content.updatedAt).toLocaleString()} by {content.updatedBy}.</p>}

        {tab === "announce"  && <AnnounceEditor  v={content.announcement}    onChange={v => update("announcement", v)} />}
        {tab === "menu"      && <MenuEditor       v={content.seniorMenu}       onChange={v => update("seniorMenu", v)} />}
        {tab === "market"    && <MarketEditor     v={content.marketSchedule}   onChange={v => update("marketSchedule", v)} />}
        {tab === "staff"     && <StaffEditor      v={content.staff}            onChange={v => update("staff", v)} />}
        {tab === "docs"      && <DocsEditor       v={content.documents}        onChange={v => update("documents", v)} />}
        {tab === "leads"     && <LeadsPanel       leads={leads}                onUpdateStatus={updateLeadStatus} />}
        {tab === "bookings"  && <BookingsPanel    bookings={bookings}           onUpdateStatus={updateBookingStatus} />}
        {tab === "volunteer" && <VolunteerPanel   entries={volunteer}           adminKey={key} onDelete={deleteVolunteer} onAdd={e => setVolunteer(v => [e, ...v])} />}
        {tab === "stats"     && <StatsPanel       stats={stats} />}
      </div>
    </div>
  );
}

// ─── Alert Banner Editor ──────────────────────────────────────────────────────
function AnnounceEditor({ v, onChange }: { v: SiteContent["announcement"]; onChange: (v: SiteContent["announcement"]) => void }) {
  const typeColors: Record<string, string> = { info: BLUE, urgent: MAROON, closed: "#111827" };
  const cur = v.type ?? "info";
  return (
    <div style={{ ...card, border: v.enabled ? `2px solid ${MAROON}` : `1px solid ${BORDER}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontWeight: 800, fontSize: 15 }}>🚨 Sitewide Alert Banner</span>
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <span style={{ fontSize: 13, color: v.enabled ? MAROON : MUTED, fontWeight: 700 }}>{v.enabled ? "LIVE" : "Off"}</span>
          <input type="checkbox" checked={v.enabled} onChange={e => onChange({ ...v, enabled: e.target.checked })} style={{ width: 20, height: 20, cursor: "pointer" }} />
        </label>
      </div>
      {v.enabled && <div style={{ background: typeColors[cur], color: "white", padding: "10px 14px", borderRadius: 8, fontSize: 13, fontWeight: 700, marginBottom: 14, textAlign: "center" }}>📣 {v.text || "Preview of your alert"}{v.href ? " →" : ""}</div>}
      <span style={lbl}>Alert type</span>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {([["info","ℹ️ Info",BLUE],["urgent","🚨 Urgent",MAROON],["closed","🚫 Closed","#111827"]] as [string,string,string][]).map(([val, label, color]) => (
          <button key={val} onClick={() => onChange({ ...v, type: val as "info"|"urgent"|"closed" })}
            style={{ flex: 1, padding: "10px 6px", borderRadius: 8, border: `2px solid ${cur === val ? color : BORDER}`, background: cur === val ? color : "white", color: cur === val ? "white" : "#374151", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>{label}</button>
        ))}
      </div>
      <span style={lbl}>Alert message</span>
      <input style={{ ...input, marginBottom: 12 }} value={v.text} onChange={e => onChange({ ...v, text: e.target.value })} placeholder="e.g. Frederick office closed today due to weather." />
      <span style={lbl}>Link (optional)</span>
      <input style={input} value={v.href ?? ""} onChange={e => onChange({ ...v, href: e.target.value })} placeholder="https://… or leave blank" />
      <p style={{ color: MUTED, fontSize: 12, marginTop: 10, marginBottom: 0 }}>Appears on every page instantly when enabled. Turn off when resolved.</p>
    </div>
  );
}

// ─── Intake Leads Panel ───────────────────────────────────────────────────────
function LeadsPanel({ leads, onUpdateStatus }: { leads: IntakeLead[]; onUpdateStatus: (id: string, s: IntakeLead["status"]) => void }) {
  const [filter, setFilter] = useState("new");
  const counts = leads.reduce((acc, l) => { acc[l.status] = (acc[l.status] ?? 0) + 1; return acc; }, {} as Record<string, number>);
  const filtered = filter === "all" ? leads : leads.filter(l => l.status === filter);
  return (
    <>
      <div style={{ ...card, background: "#FFF8E7", border: `1px solid ${AMBER}` }}>
        <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.6 }}>People who started an inquiry on the site. <strong>Follow up with anyone showing New</strong> — that's a potential client. Every documented follow-up strengthens your grant reporting.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 14 }}>
        {([["new","🔴 New",AMBER],["contacted","🔵 Contacted",BLUE],["enrolled","✅ Enrolled",GREEN]] as [string,string,string][]).map(([s, label, color]) => (
          <div key={s} style={{ ...card, padding: 12, marginBottom: 0, textAlign: "center", cursor: "pointer", border: filter === s ? `2px solid ${color}` : `1px solid ${BORDER}` }} onClick={() => setFilter(s)}>
            <div style={{ fontSize: 22, fontWeight: 800, color }}>{counts[s] ?? 0}</div>
            <div style={{ fontSize: 11, color: MUTED, fontWeight: 700 }}>{label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 14, overflowX: "auto" }}>
        {["all","new","contacted","enrolled","ineligible","closed"].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ flex: "0 0 auto", padding: "8px 14px", borderRadius: 20, border: `1px solid ${filter === s ? BLUE : BORDER}`, background: filter === s ? BLUE : "white", color: filter === s ? "white" : "#374151", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
            {s === "all" ? `All (${leads.length})` : `${STATUS_LABELS[s]} (${counts[s] ?? 0})`}
          </button>
        ))}
      </div>
      {filtered.length === 0 && <p style={{ color: MUTED, textAlign: "center", padding: 40 }}>No leads here yet.</p>}
      {filtered.map(lead => (
        <div key={lead.id} style={{ ...card, borderLeft: `4px solid ${STATUS_COLORS[lead.status] ?? MUTED}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15 }}>{lead.name || "Anonymous"}</div>
              <div style={{ fontSize: 12, color: MUTED }}>{new Date(lead.ts).toLocaleDateString()} · {lead.program} · {lead.county || "county unknown"}</div>
            </div>
            <span style={{ background: STATUS_COLORS[lead.status], color: "white", padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 800 }}>{STATUS_LABELS[lead.status]}</span>
          </div>
          {lead.phone && <a href={`tel:${lead.phone}`} style={{ display: "block", color: BLUE, fontWeight: 700, fontSize: 14, marginBottom: 4, textDecoration: "none" }}>📞 {lead.phone}</a>}
          {lead.email && <a href={`mailto:${lead.email}`} style={{ display: "block", color: BLUE, fontWeight: 700, fontSize: 14, marginBottom: 4, textDecoration: "none" }}>✉️ {lead.email}</a>}
          {lead.notes && <p style={{ fontSize: 13, color: "#374151", margin: "6px 0" }}>{lead.notes}</p>}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
            {(["new","contacted","enrolled","ineligible","closed"] as IntakeLead["status"][]).map(s => (
              <button key={s} onClick={() => onUpdateStatus(lead.id, s)} style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${STATUS_COLORS[s]}`, background: lead.status === s ? STATUS_COLORS[s] : "white", color: lead.status === s ? "white" : STATUS_COLORS[s], fontWeight: 700, fontSize: 11, cursor: "pointer" }}>{STATUS_LABELS[s]}</button>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

// ─── Transit Bookings Panel ───────────────────────────────────────────────────
function BookingsPanel({ bookings, onUpdateStatus }: { bookings: TransitBooking[]; onUpdateStatus: (id: string, s: TransitBooking["status"]) => void }) {
  const [filter, setFilter] = useState("new");
  const counts = bookings.reduce((acc, b) => { acc[b.status] = (acc[b.status] ?? 0) + 1; return acc; }, {} as Record<string, number>);
  const filtered = filter === "all" ? bookings : bookings.filter(b => b.status === filter);
  return (
    <>
      <div style={{ ...card, background: "#F0F0FF", border: "none" }}>
        <p style={{ margin: 0, fontSize: 13, color: "#374151" }}>Online ride requests. Confirm or complete each — Gilbert's team handles the actual scheduling. Every request logged here becomes part of the ridership record.</p>
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 14, overflowX: "auto" }}>
        {["all","new","confirmed","completed","cancelled"].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ flex: "0 0 auto", padding: "8px 14px", borderRadius: 20, border: `1px solid ${filter === s ? BLUE : BORDER}`, background: filter === s ? BLUE : "white", color: filter === s ? "white" : "#374151", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
            {s === "all" ? `All (${bookings.length})` : `${s.charAt(0).toUpperCase()+s.slice(1)} (${counts[s] ?? 0})`}
          </button>
        ))}
      </div>
      {filtered.length === 0 && <p style={{ color: MUTED, textAlign: "center", padding: 40 }}>No ride requests here.</p>}
      {filtered.map(bk => (
        <div key={bk.id} style={{ ...card, borderLeft: `4px solid ${BK_COLORS[bk.status] ?? MUTED}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <div style={{ fontWeight: 800, fontSize: 15 }}>{bk.name}</div>
            <span style={{ background: BK_COLORS[bk.status], color: "white", padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 800 }}>{bk.status.charAt(0).toUpperCase()+bk.status.slice(1)}</span>
          </div>
          <a href={`tel:${bk.phone}`} style={{ display: "block", color: BLUE, fontWeight: 700, fontSize: 14, marginBottom: 6, textDecoration: "none" }}>📞 {bk.phone}</a>
          <div style={{ fontSize: 13, color: "#374151", marginBottom: 4 }}>📍 From: {bk.pickupAddress}</div>
          <div style={{ fontSize: 13, color: "#374151", marginBottom: 4 }}>🏁 To: {bk.destination}</div>
          <div style={{ fontSize: 13, color: "#374151", marginBottom: 4 }}>📅 {bk.requestedDate} at {bk.requestedTime}</div>
          {bk.accessibility && bk.accessibility !== "none" && <div style={{ fontSize: 13, color: MAROON, fontWeight: 700, marginBottom: 4 }}>♿ {bk.accessibility}</div>}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
            {(["new","confirmed","completed","cancelled"] as TransitBooking["status"][]).map(s => (
              <button key={s} onClick={() => onUpdateStatus(bk.id, s)} style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${BK_COLORS[s]}`, background: bk.status === s ? BK_COLORS[s] : "white", color: bk.status === s ? "white" : BK_COLORS[s], fontWeight: 700, fontSize: 11, cursor: "pointer" }}>{s.charAt(0).toUpperCase()+s.slice(1)}</button>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

// ─── Volunteer Hours Panel ────────────────────────────────────────────────────
function VolunteerPanel({ entries, adminKey, onDelete, onAdd }: { entries: VolunteerEntry[]; adminKey: string; onDelete: (id: string) => void; onAdd: (e: VolunteerEntry) => void }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ volunteerName: "", supervisorName: "", program: "head-start", center: "Hobart", date: new Date().toISOString().slice(0,10), hours: "", type: "volunteer" as VolunteerEntry["type"], description: "" });
  const [saving, setSaving] = useState(false);
  const totalHours = entries.reduce((s, e) => s + e.hours, 0);
  const dollarValue = entries.filter(e => e.type === "volunteer").reduce((s, e) => s + e.hours * 29, 0) + entries.filter(e => e.type !== "volunteer").reduce((s, e) => s + e.hours, 0);
  const matchPct = Math.min(100, (dollarValue / HEAD_START_MATCH_GOAL) * 100);
  async function submit() {
    if (!form.volunteerName || !form.hours) return;
    setSaving(true);
    const r = await fetch("/api/cms/volunteer", { method: "POST", headers: { "Content-Type": "application/json", "x-admin-key": adminKey }, body: JSON.stringify(form) });
    if (r.ok) { const { id } = await r.json(); onAdd({ ...form, id, ts: new Date().toISOString(), hours: parseFloat(form.hours) }); setForm(f => ({ ...f, volunteerName: "", hours: "", description: "" })); setShowForm(false); }
    setSaving(false);
  }
  return (
    <>
      <div style={{ ...card, background: "#F0FFF4", border: `1px solid ${GREEN}` }}>
        <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 8, color: GREEN }}>🤝 Head Start In-Kind Match Tracker</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 12 }}>
          {([[totalHours.toFixed(1),"Total Hours"],[`$${(dollarValue/1000).toFixed(0)}K`,"Est. Value"],[`${matchPct.toFixed(1)}%`,"of Goal"]] as [string,string][]).map(([val, label], i) => (
            <div key={i} style={{ textAlign: "center" }}><div style={{ fontSize: 20, fontWeight: 800, color: i === 2 ? (matchPct >= 80 ? GREEN : matchPct >= 50 ? AMBER : MAROON) : "#111827" }}>{val}</div><div style={{ fontSize: 10, color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div></div>
          ))}
        </div>
        <div style={{ background: "#E5E7EB", borderRadius: 8, height: 12, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${matchPct}%`, background: matchPct >= 80 ? GREEN : matchPct >= 50 ? AMBER : MAROON, borderRadius: 8, transition: "width 0.5s ease" }} />
        </div>
        <p style={{ fontSize: 11, color: MUTED, margin: "8px 0 0" }}>FY2026 match goal: $1,075,417. Volunteer hours at federal rate ($29/hr).</p>
      </div>
      <button style={{ ...btn(), width: "100%", marginBottom: 14 }} onClick={() => setShowForm(!showForm)}>{showForm ? "✕ Cancel" : "+ Log Volunteer Hours"}</button>
      {showForm && (
        <div style={card}>
          <span style={lbl}>Volunteer name</span>
          <input style={{ ...input, marginBottom: 10 }} value={form.volunteerName} onChange={e => setForm(f => ({ ...f, volunteerName: e.target.value }))} placeholder="Full name" />
          <span style={lbl}>Supervisor / staff contact</span>
          <input style={{ ...input, marginBottom: 10 }} value={form.supervisorName} onChange={e => setForm(f => ({ ...f, supervisorName: e.target.value }))} placeholder="Staff member who supervised" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
            <div><span style={lbl}>Program</span><select style={input} value={form.program} onChange={e => setForm(f => ({ ...f, program: e.target.value }))}><option value="head-start">Head Start</option><option value="early-head-start">Early Head Start</option></select></div>
            <div><span style={lbl}>Center</span><select style={input} value={form.center} onChange={e => setForm(f => ({ ...f, center: e.target.value }))}>{HS_CENTERS.map(c => <option key={c}>{c}</option>)}</select></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
            <div><span style={lbl}>Date</span><input style={input} type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></div>
            <div><span style={lbl}>Hours</span><input style={input} type="number" step="0.5" min="0.5" value={form.hours} onChange={e => setForm(f => ({ ...f, hours: e.target.value }))} placeholder="2.5" /></div>
          </div>
          <span style={lbl}>Type</span>
          <select style={{ ...input, marginBottom: 10 }} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as VolunteerEntry["type"] }))}>
            <option value="volunteer">Volunteer hours</option>
            <option value="in-kind-space">In-kind — Space/facility</option>
            <option value="in-kind-services">In-kind — Services</option>
            <option value="public-school-collab">Public school collaboration</option>
          </select>
          <span style={lbl}>Description (optional)</span>
          <input style={{ ...input, marginBottom: 14 }} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="e.g. Read to children in Hobart classroom" />
          <button style={{ ...btn(), width: "100%" }} onClick={submit} disabled={saving}>{saving ? "Saving…" : "Save Entry"}</button>
        </div>
      )}
      {entries.slice(0, 50).map(e => (
        <div key={e.id} style={{ ...card, padding: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14 }}>{e.volunteerName} · {e.hours}h</div>
              <div style={{ fontSize: 12, color: MUTED }}>{e.date} · {e.center} · {e.type.replace(/-/g," ")}</div>
              {e.description && <div style={{ fontSize: 12, color: "#374151", marginTop: 4 }}>{e.description}</div>}
            </div>
            <button onClick={() => onDelete(e.id)} style={{ ...btn("white", MAROON), padding: "4px 10px", fontSize: 12, borderColor: MAROON }}>×</button>
          </div>
        </div>
      ))}
      {entries.length > 50 && <p style={{ color: MUTED, textAlign: "center", fontSize: 13 }}>Showing 50 of {entries.length} entries.</p>}
    </>
  );
}

// ─── Site Stats Panel ─────────────────────────────────────────────────────────
function StatsPanel({ stats }: { stats: SiteStats | null }) {
  if (!stats) return <p style={{ color: MUTED, textAlign: "center", padding: 40 }}>Loading stats…</p>;
  const topPrograms = Object.entries(stats.programTaps).sort((a,b) => b[1]-a[1]).slice(0,8);
  const topCounties = Object.entries(stats.countyViews).sort((a,b) => b[1]-a[1]).slice(0,8);
  const topSearches = Object.entries(stats.searchTerms).sort((a,b) => b[1]-a[1]).slice(0,10);
  const maxP = topPrograms[0]?.[1] ?? 1;
  const maxC = topCounties[0]?.[1] ?? 1;
  return (
    <>
      <div style={{ ...card, background: "#F0F0FF", border: "none" }}><p style={{ margin: 0, fontSize: 13, color: "#374151" }}>Live engagement data. Use this in grant narratives — it shows what your community is actively looking for.</p></div>
      <div style={{ ...card, textAlign: "center" }}>
        <div style={{ fontSize: 32, fontWeight: 800, color: BLUE }}>{stats.weeklyVisits.toLocaleString()}</div>
        <div style={{ fontSize: 12, color: MUTED, textTransform: "uppercase", letterSpacing: "0.1em" }}>Site visits this week</div>
      </div>
      <div style={card}>
        <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 12 }}>📊 Program Engagement</div>
        {topPrograms.length === 0 && <p style={{ color: MUTED, fontSize: 13 }}>Data will appear as visitors use the site.</p>}
        {topPrograms.map(([slug, count]) => (
          <div key={slug} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 700, marginBottom: 4 }}><span style={{ textTransform: "capitalize" }}>{slug.replace(/-/g," ")}</span><span style={{ color: BLUE }}>{count.toLocaleString()}</span></div>
            <div style={{ background: "#E5E7EB", borderRadius: 6, height: 8 }}><div style={{ height: "100%", width: `${(count/maxP)*100}%`, background: BLUE, borderRadius: 6 }} /></div>
          </div>
        ))}
      </div>
      <div style={card}>
        <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 12 }}>📍 County Interest</div>
        {topCounties.length === 0 && <p style={{ color: MUTED, fontSize: 13 }}>No county views yet.</p>}
        {topCounties.map(([county, count]) => (
          <div key={county} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 700, marginBottom: 4 }}><span style={{ textTransform: "capitalize" }}>{county.replace(/-/g," ")} County</span><span style={{ color: MAROON }}>{count.toLocaleString()}</span></div>
            <div style={{ background: "#E5E7EB", borderRadius: 6, height: 8 }}><div style={{ height: "100%", width: `${(count/maxC)*100}%`, background: MAROON, borderRadius: 6 }} /></div>
          </div>
        ))}
      </div>
      {topSearches.length > 0 && (
        <div style={card}>
          <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 12 }}>🔍 Top Search Terms</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {topSearches.map(([term, count]) => (
              <div key={term} style={{ background: "#F0F0FF", border: `1px solid ${BORDER}`, borderRadius: 20, padding: "6px 12px", fontSize: 13, display: "flex", gap: 6 }}><span>{term}</span><span style={{ color: BLUE, fontWeight: 800 }}>{count}</span></div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

// ─── Unchanged editors ────────────────────────────────────────────────────────
function MenuEditor({ v, onChange }: { v: SiteContent["seniorMenu"]; onChange: (v: SiteContent["seniorMenu"]) => void }) {
  const dates = useMemo(() => monthDates(v.month, v.year), [v.month, v.year]);
  const setMeal = (d: string, meal: Meal | null) => { const meals = { ...v.meals }; if (meal) meals[d] = meal; else delete meals[d]; onChange({ ...v, meals }); };
  return (
    <>
      <div style={card}>
        <span style={lbl}>Menu month</span>
        <MonthYear month={v.month} year={v.year} onChange={(m,y) => onChange({ ...v, month: m, year: y })} />
        <span style={{ ...lbl, marginTop: 12 }}>Note shown under the calendar</span>
        <input style={input} value={v.note} onChange={e => onChange({ ...v, note: e.target.value })} />
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
            {meal && (<>
              <span style={lbl}>Main dish</span>
              <input style={input} value={meal.headline} onChange={e => setMeal(d, { ...meal, headline: e.target.value })} placeholder="e.g. Meatloaf" />
              <span style={{ ...lbl, marginTop: 10 }}>Full meal — one item per line</span>
              <textarea style={{ ...input, minHeight: 90 }} value={meal.full.join("\n")} onChange={e => setMeal(d, { ...meal, full: e.target.value.split("\n").map(s => s.trim()).filter(Boolean) })} />
            </>)}
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
        <span style={lbl}>Schedule month</span>
        <MonthYear month={v.month} year={v.year} onChange={(m,y) => onChange({ ...v, month: m, year: y })} />
        <span style={{ ...lbl, marginTop: 12 }}>Note shown under the calendar</span>
        <input style={input} value={v.note} onChange={e => onChange({ ...v, note: e.target.value })} />
        <span style={{ ...lbl, marginTop: 12 }}>Ride line</span>
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
                <button style={{ ...btn("white", MAROON), padding: "0 12px", borderColor: MAROON }} onClick={() => setStops(d, stops.filter((_,j) => j !== i))}>×</button>
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
            <div><span style={lbl}>Name</span><input style={input} value={m.name} onChange={e => set(i, { ...m, name: e.target.value })} /></div>
            <div><span style={lbl}>Title</span><input style={input} value={m.title} onChange={e => set(i, { ...m, title: e.target.value })} /></div>
            <div><span style={lbl}>Phone</span><input style={input} value={m.phone ?? ""} onChange={e => set(i, { ...m, phone: e.target.value })} placeholder="580-…" /></div>
            <div><span style={lbl}>Email</span><input style={input} value={m.email ?? ""} onChange={e => set(i, { ...m, email: e.target.value })} /></div>
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
            {i > 0 && <button style={{ ...btn("white", BLUE), padding: "6px 10px", fontSize: 12 }} onClick={() => { const n = [...v]; [n[i-1],n[i]] = [n[i],n[i-1]]; onChange(n); }}>↑ Move up</button>}
            <button style={{ ...btn("white", MAROON), padding: "6px 10px", fontSize: 12, borderColor: MAROON, marginLeft: "auto" }} onClick={() => onChange(v.filter((_,j) => j !== i))}>Remove</button>
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
        <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.6 }}>To replace a PDF: ask Chris to upload the new file with the <strong>same file name</strong> — the link stays the same.</p>
      </div>
      {v.map((d, i) => (
        <div key={i} style={card}>
          <span style={lbl}>Document name</span><input style={input} value={d.label} onChange={e => set(i, { ...d, label: e.target.value })} />
          <span style={{ ...lbl, marginTop: 10 }}>File link</span><input style={input} value={d.href} onChange={e => set(i, { ...d, href: e.target.value })} />
          <button style={{ ...btn("white", MAROON), padding: "6px 10px", fontSize: 12, borderColor: MAROON, marginTop: 10 }} onClick={() => onChange(v.filter((_,j) => j !== i))}>Remove</button>
        </div>
      ))}
      <button style={{ ...btn(), width: "100%" }} onClick={() => onChange([...v, { label: "", href: "/documents/" }])}>+ Add document</button>
    </>
  );
}
