"use client";

// ─── CADC Staff Admin — /admin ────────────────────────────────────────────────
// Phone-friendly editor for the content directors change most often.
// Reached via the hidden door (tap the © line in the footer 5 times) or /admin.
// Auth: single shared password (ADMIN_PASSWORD env var on Vercel), stored in
// sessionStorage for the tab only. Saves go to Vercel KV via /api/cms.
//
// Navigation: four grouped sections replace the flat tab strip.
//   CONTENT    — what staff updates week to week
//   OPERATIONS — leads, bookings, volunteer hours, stats
//   SITE TOOLS — upload, media, archive, inline content editor
//   SYSTEM     — features, schedule, impact PDF

import { useEffect, useMemo, useState } from "react";
import {
  DEFAULT_CONTENT, DEFAULT_SITE_TEXT, DEFAULT_PROGRAM_TAGLINES,
  fetchLeads, fetchStats, fetchVolunteer, fetchBookings,
  type SiteContent, type SiteFeatures, type SiteText, type BoardDoc, type ScheduledItem, type Meal, type MarketStop, type StaffMember,
  type PublicDoc, type IntakeLead, type SiteStats, type VolunteerEntry,
  type TransitBooking, fetchSchedule,
  fetchMedia, fetchArchive, fetchContentBlocks,
  type MediaAsset, type ArchivedItem, type ContentBlock,
} from "@/lib/cms";
import { UploadPanel, MediaLibraryPanel, ArchivePanel, ContentEditorPanel } from "./panels/site-builder";
import { markAdminViewerSession, clearAdminViewerSession } from "@/components/InlineEditBar";

const BLUE = "#0101FF", MAROON = "#CC0000", BORDER = "#e5e7eb", MUTED = "#6b7280";
const GREEN = "#059669", AMBER = "#D97706";
const card: React.CSSProperties = { background: "white", border: `1px solid ${BORDER}`, borderRadius: 14, padding: 16, marginBottom: 14 };
const input: React.CSSProperties = { width: "100%", fontSize: 16, padding: "12px 12px", border: `1px solid ${BORDER}`, borderRadius: 10, boxSizing: "border-box", fontFamily: "inherit" };
const lbl: React.CSSProperties = { color: MAROON, fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 6px", display: "block" };
const btn = (bg = BLUE, fg = "white"): React.CSSProperties => ({ background: bg, color: fg, border: bg === "white" ? `1px solid ${BLUE}` : "none", borderRadius: 10, padding: "12px 18px", fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "inherit" });

type Tab = "announce" | "menu" | "market" | "staff" | "docs" | "board-docs" | "site-text"
         | "leads" | "bookings" | "volunteer" | "stats"
         | "upload" | "media" | "archive" | "content"
         | "features" | "schedule" | "impact";

// ─── Navigation structure ─────────────────────────────────────────────────────
type TabStatus = "live" | "needs-work" | "locked";
interface TabDef { id: Tab; label: string; icon: string; who: string; status: TabStatus; note?: string }
interface Section { id: string; label: string; color: string; tabs: TabDef[] }

const NAV: Section[] = [
  {
    id: "content", label: "Content", color: BLUE,
    tabs: [
      { id: "announce",  label: "Alert Banner",   icon: "🚨", who: "Leslea",  status: "live" },
      { id: "menu",      label: "Senior Menu",    icon: "🍽️", who: "Laura",   status: "live" },
      { id: "market",    label: "Market",         icon: "🛒", who: "Scott",   status: "live" },
      { id: "staff",     label: "Staff",          icon: "👤", who: "Leslea",  status: "live" },
      { id: "docs",      label: "Documents",      icon: "📄", who: "Leslea",  status: "live" },
      { id: "board-docs",label: "Board Docs",     icon: "📁", who: "Tiffany", status: "live" },
      { id: "site-text", label: "Site Text",      icon: "🔤", who: "Leslea",  status: "live" },
    ],
  },
  {
    id: "operations", label: "Operations", color: GREEN,
    tabs: [
      { id: "leads",     label: "Intake Leads",   icon: "📥", who: "All",     status: "live" },
      { id: "bookings",  label: "Transit Rides",  icon: "🚌", who: "Gilbert", status: "live" },
      { id: "volunteer", label: "Volunteer Hrs",  icon: "🤝", who: "Robin",   status: "live" },
      { id: "stats",     label: "Site Stats",     icon: "📊", who: "Leslea",  status: "live" },
    ],
  },
  {
    id: "tools", label: "Site Tools", color: AMBER,
    tabs: [
      { id: "upload",  label: "Upload Files",    icon: "📤", who: "All",    status: "live" },
      { id: "media",   label: "Media Library",   icon: "🖼️", who: "All",    status: "live" },
      { id: "archive", label: "Archive",          icon: "🗄️", who: "Leslea", status: "live" },
      { id: "content", label: "Inline Content",  icon: "✏️", who: "Leslea", status: "needs-work", note: "Edit bars not yet dropped into public pages" },
    ],
  },
  {
    id: "system", label: "System", color: MUTED,
    tabs: [
      { id: "features", label: "Features",       icon: "⚡", who: "Leslea", status: "live" },
      { id: "schedule", label: "Scheduled",      icon: "🗓️", who: "Leslea", status: "live" },
      { id: "impact",   label: "Impact PDF",     icon: "📈", who: "Leslea", status: "live" },
    ],
  },
];

const ALL_TABS = NAV.flatMap(s => s.tabs);

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

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status, small }: { status: TabStatus; small?: boolean }) {
  const map: Record<TabStatus, [string, string, string]> = {
    "live":       ["✅", GREEN,  "Live"],
    "needs-work": ["🔧", AMBER,  "Needs work"],
    "locked":     ["🔒", MUTED,  "Locked"],
  };
  const [icon, color, label] = map[status];
  return (
    <span style={{ background: `${color}18`, color, border: `1px solid ${color}40`, borderRadius: 20, padding: small ? "2px 7px" : "3px 9px", fontSize: small ? 10 : 11, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 3, whiteSpace: "nowrap" }}>
      {icon} {label}
    </span>
  );
}

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
  const [schedule, setSchedule] = useState<ScheduledItem[]>([]);
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [archived, setArchived] = useState<ArchivedItem[]>([]);
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [navOpen, setNavOpen] = useState(false);

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
    fetchSchedule(key).then(setSchedule);
    fetchMedia(key).then(setMedia);
    fetchArchive(key).then(setArchived);
    fetchContentBlocks(key).then(setBlocks);
  }, [authed, key]);

  async function login() {
    const r = await fetch("/api/cms", { method: "HEAD", headers: { "x-admin-key": key } });
    if (r.status === 204) {
      sessionStorage.setItem("cadc-admin-key", key);
      sessionStorage.setItem("cadc-admin-name", name);
      localStorage.setItem("cadc_admin_key", key);
      markAdminViewerSession();
      setAuthed(true); setStatus("");
    }
    else setStatus("That password didn't work. Check with Leslea or Chris.");
  }
  function logout() {
    sessionStorage.clear();
    localStorage.removeItem("cadc_admin_key");
    clearAdminViewerSession();
    setAuthed(false); setKey("");
  }
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

  const isContentTab = ["announce","menu","market","staff","docs","board-docs","site-text","features"].includes(tab);
  const currentTabDef = ALL_TABS.find(t => t.id === tab);
  const currentSection = NAV.find(s => s.tabs.some(t => t.id === tab));
  const newLeadCount = leads.filter(l => l.status === "new").length;
  const pendingBookingCount = bookings.filter(b => b.status === "new").length;

  return (
    <div style={{ minHeight: "100vh", background: "#F8F9FF", fontFamily: "'Space Grotesk','Inter',sans-serif", color: "#111827" }}>

      {/* ── Sticky top bar ── */}
      <div style={{ position: "sticky", top: 0, zIndex: 20, background: "white", borderBottom: `1px solid ${BORDER}`, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setNavOpen(o => !o)}
            style={{ background: navOpen ? BLUE : "white", color: navOpen ? "white" : BLUE, border: `1px solid ${navOpen ? BLUE : BORDER}`, borderRadius: 8, width: 36, height: 36, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {navOpen ? "✕" : "☰"}
          </button>
          <img src="/images/cadc-logo.png" alt="CADC" style={{ height: 28 }} />
          <div>
            <div style={{ fontWeight: 800, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
              {currentTabDef?.icon} {currentTabDef?.label}
              {currentTabDef && <StatusBadge status={currentTabDef.status} small />}
            </div>
            <div style={{ fontSize: 11, color: MUTED }}>Signed in as {name || "staff"}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {isContentTab && <button style={{ ...btn(dirty ? MAROON : BLUE), padding: "10px 16px" }} onClick={save} disabled={!dirty}>{dirty ? "Save changes" : "Saved"}</button>}
          <button style={{ ...btn("white", BLUE), padding: "10px 12px" }} onClick={logout}>Sign out</button>
        </div>
      </div>

      {status && <div style={{ background: status.startsWith("✓") ? "#E4E4FF" : "#FFE4E4", color: status.startsWith("✓") ? BLUE : MAROON, padding: "10px 14px", fontWeight: 700, fontSize: 13, textAlign: "center" }}>{status}</div>}

      {/* ── Slide-out nav panel ── */}
      {navOpen && (
        <div style={{ position: "fixed", top: 57, left: 0, right: 0, bottom: 0, zIndex: 19, display: "flex" }}>
          {/* backdrop */}
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)" }} onClick={() => setNavOpen(false)} />
          {/* panel */}
          <div style={{ position: "relative", width: 280, maxWidth: "85vw", background: "white", overflowY: "auto", padding: "12px 0 40px", borderRight: `1px solid ${BORDER}` }}>
            {NAV.map(section => (
              <div key={section.id} style={{ marginBottom: 8 }}>
                <div style={{ padding: "8px 16px 4px", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.14em", color: section.color }}>
                  {section.label}
                </div>
                {section.tabs.map(t => {
                  const isActive = tab === t.id;
                  const hasBadge = (t.id === "leads" && newLeadCount > 0) || (t.id === "bookings" && pendingBookingCount > 0);
                  return (
                    <button key={t.id} onClick={() => { setTab(t.id); setNavOpen(false); }}
                      style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "11px 16px", background: isActive ? `${section.color}12` : "transparent", border: "none", borderLeft: `3px solid ${isActive ? section.color : "transparent"}`, cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
                      <span style={{ fontSize: 18, flexShrink: 0 }}>{t.icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: isActive ? 800 : 600, fontSize: 14, color: isActive ? section.color : "#111827", display: "flex", alignItems: "center", gap: 6 }}>
                          {t.label}
                          {hasBadge && (
                            <span style={{ background: MAROON, color: "white", borderRadius: 20, fontSize: 10, fontWeight: 800, padding: "1px 7px" }}>
                              {t.id === "leads" ? newLeadCount : pendingBookingCount}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: 11, color: MUTED }}>{t.who}</div>
                      </div>
                      <StatusBadge status={t.status} small />
                    </button>
                  );
                })}
              </div>
            ))}

            {/* Status legend */}
            <div style={{ margin: "16px 16px 0", padding: "12px 14px", background: "#F9FAFB", borderRadius: 10, border: `1px solid ${BORDER}` }}>
              <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: MUTED, marginBottom: 8 }}>Status key</div>
              {(["live","needs-work","locked"] as TabStatus[]).map(s => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <StatusBadge status={s} small />
                  <span style={{ fontSize: 11, color: "#374151" }}>
                    {s === "live" ? "Fully wired, ready to use" : s === "needs-work" ? "Built but needs verification or finishing" : "Contract scope — not yet activated"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Main content ── */}
      <div style={{ padding: 14, maxWidth: 720, margin: "0 auto" }}>
        {loading && <p style={{ color: MUTED }}>Loading…</p>}

        {/* Section label + last-updated line for content tabs */}
        {currentSection && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.14em", color: currentSection.color }}>
              {currentSection.label} › {currentTabDef?.label}
            </span>
            {isContentTab && (
              <span style={{ fontSize: 11, color: MUTED }}>
                By <strong>{currentTabDef?.who}</strong> · Last saved {new Date(content.updatedAt).toLocaleDateString()} by {content.updatedBy}
              </span>
            )}
          </div>
        )}

        {/* Needs-work notice */}
        {currentTabDef?.status === "needs-work" && currentTabDef.note && (
          <div style={{ ...card, background: "#FFFBEB", border: `1px solid ${AMBER}`, padding: "10px 14px", marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 18 }}>🔧</span>
            <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.5 }}><strong>Status:</strong> {currentTabDef.note}</p>
          </div>
        )}

        {tab === "features"   && <FeaturesEditor   v={content.features ?? { transitBooking: false, intakeLeads: false, volunteerLog: false }} onChange={v => update("features" as keyof SiteContent, v)} content={content} adminKey={key} />}
        {tab === "announce"   && <AnnounceEditor   v={content.announcement}  onChange={v => update("announcement", v)} />}
        {tab === "menu"       && <MenuEditor        v={content.seniorMenu}    onChange={v => update("seniorMenu", v)} />}
        {tab === "market"     && <MarketEditor      v={content.marketSchedule} onChange={v => update("marketSchedule", v)} />}
        {tab === "staff"      && <StaffEditor       v={content.staff}         onChange={v => update("staff", v)} />}
        {tab === "docs"       && <DocsEditor        v={content.documents}     onChange={v => update("documents", v)} />}
        {tab === "leads"      && <LeadsPanel        leads={leads}             onUpdateStatus={updateLeadStatus} />}
        {tab === "bookings"   && <BookingsPanel     bookings={bookings}       onUpdateStatus={updateBookingStatus} />}
        {tab === "volunteer"  && <VolunteerPanel    entries={volunteer}       adminKey={key} onDelete={deleteVolunteer} onAdd={e => setVolunteer(v => [e, ...v])} />}
        {tab === "stats"      && <StatsPanel        stats={stats} leads={leads} bookings={bookings} volunteer={volunteer} adminKey={key} onReset={() => { fetchStats(key).then(setStats); fetchLeads(key).then(setLeads); fetchBookings(key).then(setBookings); fetchVolunteer(key).then(setVolunteer); }} />}
        {tab === "schedule"   && <SchedulePanel     schedule={schedule} adminKey={key} onUpdate={setSchedule} />}
        {tab === "board-docs" && <BoardDocsAdminPanel content={content} adminKey={key} onChange={v => update("boardDocs" as keyof SiteContent, v)} />}
        {tab === "site-text"  && (
          <>
            <SiteTextEditor   v={{ ...DEFAULT_SITE_TEXT,        ...(content.siteText        ?? {}) }} onChange={v => update("siteText" as keyof SiteContent, v)} />
            <TaglinesEditor   v={{ ...DEFAULT_PROGRAM_TAGLINES, ...(content.programTaglines ?? {}) }} onChange={v => update("programTaglines" as keyof SiteContent, v)} />
          </>
        )}
        {tab === "impact"     && <ImpactPanel       adminKey={key} />}
        {tab === "upload"     && <UploadPanel       adminKey={key} />}
        {tab === "media"      && <MediaLibraryPanel  media={media} adminKey={key} onChange={() => fetchMedia(key).then(setMedia)} />}
        {tab === "archive"    && <ArchivePanel       archived={archived} adminKey={key} onChange={() => fetchArchive(key).then(setArchived)} />}
        {tab === "content"    && (
          <>
            <div style={{ ...card, background: "#F0F0FF", border: `1px solid ${BLUE}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ margin: 0, fontSize: 13, color: "#374151" }}>✏️ You can also edit content directly on the live site — visit cadcok.org while signed in here and look for pencil icons.</p>
              <a href="/" target="_blank" rel="noopener noreferrer" style={{ flexShrink: 0, marginLeft: 12, background: BLUE, color: "white", borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 700, textDecoration: "none" }}>Open Site →</a>
            </div>
            <ContentEditorPanel blocks={blocks} adminKey={key} onChange={() => fetchContentBlocks(key).then(setBlocks)} />
          </>
        )}
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
function StatsPanel({ stats, leads, bookings, volunteer, adminKey, onReset }: { stats: SiteStats | null; leads: IntakeLead[]; bookings: TransitBooking[]; volunteer: VolunteerEntry[]; adminKey: string; onReset: () => void }) {
  if (!stats) return <p style={{ color: MUTED, textAlign: "center", padding: 40 }}>Loading stats…</p>;
  const topPrograms = Object.entries(stats.programTaps).sort((a,b) => b[1]-a[1]);
  const topCounties = Object.entries(stats.countyViews).sort((a,b) => b[1]-a[1]).slice(0,10);
  const topSearches = Object.entries(stats.searchTerms).sort((a,b) => b[1]-a[1]).slice(0,12);
  const maxP = topPrograms[0]?.[1] ?? 1;
  const maxC = topCounties[0]?.[1] ?? 1;
  const totalTaps = Object.values(stats.programTaps).reduce((a,b) => a+b, 0);
  const totalCounty = Object.values(stats.countyViews).reduce((a,b) => a+b, 0);
  const newLeads = leads.filter(l => l.status === "new").length;
  const contactedLeads = leads.filter(l => l.status === "contacted").length;
  const enrolledLeads = leads.filter(l => l.status === "enrolled").length;
  const pendingBookings = bookings.filter(b => b.status === "new").length;
  const totalVolHours = volunteer.reduce((s, e) => s + e.hours, 0);
  const topProgram = topPrograms[0];
  const topCounty = topCounties[0];
  const now = new Date();
  const dayName = now.toLocaleDateString("en-US", { weekday: "long" });
  return (
    <>
      <div style={{ ...card, background: "linear-gradient(135deg, #0101FF 0%, #1a1aff 100%)", border: "none", color: "white" }}>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 6 }}>
          📅 Weekly Summary — as of {dayName}, {now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </div>
        <p style={{ margin: "0 0 12px", fontSize: 14, color: "white", lineHeight: 1.7 }}>
          Your site has had <strong style={{ color: "white" }}>{stats.weeklyVisits.toLocaleString()} visits</strong> this week
          {totalTaps > 0 && <>, with <strong style={{ color: "white" }}>{totalTaps.toLocaleString()} program taps</strong></>}
          {topProgram && <> — <strong style={{ color: "white" }}>{topProgram[0].replace(/-/g," ")}</strong> leading with {topProgram[1]} taps</>}.
          {topCounty && <> <strong style={{ color: "white" }}>{topCounty[0].replace(/-/g," ")} County</strong> is your most active service area ({topCounty[1]} views).</>}
          {newLeads > 0 && <> You have <strong style={{ color: "white" }}>{newLeads} new intake lead{newLeads !== 1 ? "s" : ""}</strong> awaiting follow-up.</>}
          {pendingBookings > 0 && <> <strong style={{ color: "white" }}>{pendingBookings} ride request{pendingBookings !== 1 ? "s" : ""}</strong> need confirmation.</>}
        </p>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Check this every Monday morning or Friday afternoon for your weekly pulse.</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {[
          { icon: "👥", label: "Site Visits", value: stats.weeklyVisits.toLocaleString(), sub: "this week", color: BLUE },
          { icon: "👆", label: "Program Taps", value: totalTaps.toLocaleString(), sub: "all programs", color: BLUE },
          { icon: "🗺️", label: "County Views", value: totalCounty.toLocaleString(), sub: "map interactions", color: MAROON },
          { icon: "📥", label: "Total Leads", value: leads.length.toLocaleString(), sub: `${newLeads} new`, color: GREEN },
          { icon: "🚌", label: "Ride Requests", value: bookings.length.toLocaleString(), sub: `${pendingBookings} pending`, color: AMBER },
          { icon: "🤝", label: "Vol. Hours", value: totalVolHours.toFixed(1), sub: "logged total", color: GREEN },
        ].map(({ icon, label, value, sub, color }) => (
          <div key={label} style={{ ...card, padding: "12px 10px", textAlign: "center" }}>
            <div style={{ fontSize: 18, marginBottom: 4 }}>{icon}</div>
            <div style={{ fontSize: 20, fontWeight: 900, color, lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: MUTED, marginTop: 3 }}>{label}</div>
            <div style={{ fontSize: 10, color: MUTED, marginTop: 2 }}>{sub}</div>
          </div>
        ))}
      </div>
      <div style={card}>
        <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 4 }}>📊 Program Engagement</div>
        <div style={{ fontSize: 11, color: MUTED, marginBottom: 14 }}>Every program tap this week, sorted by interest.</div>
        {topPrograms.length === 0
          ? <p style={{ color: MUTED, fontSize: 13 }}>Data will appear as visitors use the site.</p>
          : topPrograms.map(([slug, count]) => {
            const pct = Math.round((count / totalTaps) * 100);
            return (
              <div key={slug} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, textTransform: "capitalize" }}>{slug.replace(/-/g," ")}</span>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: MUTED }}>{pct}%</span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: BLUE }}>{count.toLocaleString()}</span>
                  </div>
                </div>
                <div style={{ background: "#E5E7EB", borderRadius: 6, height: 10 }}>
                  <div style={{ height: "100%", width: `${(count/maxP)*100}%`, background: BLUE, borderRadius: 6, transition: "width 0.5s ease" }} />
                </div>
              </div>
            );
          })}
      </div>
      <div style={card}>
        <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 4 }}>🗺️ County Interest</div>
        <div style={{ fontSize: 11, color: MUTED, marginBottom: 14 }}>High views = high need in that area.</div>
        {topCounties.length === 0
          ? <p style={{ color: MUTED, fontSize: 13 }}>No county views yet.</p>
          : topCounties.map(([county, count]) => (
            <div key={county} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                <span style={{ textTransform: "capitalize" }}>{county.replace(/-/g," ")} County</span>
                <span style={{ color: MAROON }}>{count.toLocaleString()}</span>
              </div>
              <div style={{ background: "#E5E7EB", borderRadius: 6, height: 8 }}>
                <div style={{ height: "100%", width: `${(count/maxC)*100}%`, background: MAROON, borderRadius: 6 }} />
              </div>
            </div>
          ))}
      </div>
      {leads.length > 0 && (
        <div style={card}>
          <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 14 }}>📥 Intake Lead Breakdown</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
            {[{ label: "New", value: newLeads, color: BLUE },{ label: "Contacted", value: contactedLeads, color: AMBER },{ label: "Enrolled", value: enrolledLeads, color: GREEN },{ label: "Total", value: leads.length, color: MUTED }].map(({ label, value, color }) => (
              <div key={label} style={{ background: "#F9FAFB", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 8px", textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 900, color }}>{value}</div>
                <div style={{ fontSize: 10, color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
          {(() => {
            const byProg = leads.reduce((acc, l) => { acc[l.program] = (acc[l.program] ?? 0) + 1; return acc; }, {} as Record<string,number>);
            return Object.entries(byProg).sort((a,b) => b[1]-a[1]).map(([prog, count]) => (
              <div key={prog} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${BORDER}`, fontSize: 13 }}>
                <span style={{ textTransform: "capitalize", fontWeight: 600 }}>{prog.replace(/-/g," ")}</span>
                <span style={{ fontWeight: 800, color: BLUE }}>{count} lead{count !== 1 ? "s" : ""}</span>
              </div>
            ));
          })()}
        </div>
      )}
      {topSearches.length > 0 && (
        <div style={card}>
          <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 14 }}>🔍 What Your Community Is Searching For</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {topSearches.map(([term, count]) => (
              <div key={term} style={{ background: "#F0F0FF", border: `1px solid ${BORDER}`, borderRadius: 20, padding: "6px 14px", fontSize: 13, display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontWeight: 600 }}>{term}</span>
                <span style={{ color: BLUE, fontWeight: 800, fontSize: 12 }}>×{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{ ...card, background: "#F0FFF4", border: `1px solid ${GREEN}` }}>
        <div style={{ fontWeight: 800, fontSize: 13, color: GREEN, marginBottom: 8 }}>📝 Grant Narrative Helper</div>
        <div style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "12px 14px", fontSize: 12, color: "#374151", lineHeight: 1.7, fontStyle: "italic" }}>
          "In the current reporting period, the cadcok.org digital platform recorded {stats.weeklyVisits.toLocaleString()} community site visits
          {totalTaps > 0 ? `, ${totalTaps.toLocaleString()} program engagement interactions` : ""}
          {topProgram ? `, with ${topProgram[0].replace(/-/g," ")} generating the highest community interest` : ""}.
          {leads.length > 0 ? ` ${leads.length} residents submitted program interest forms, ${enrolledLeads} of whom were successfully enrolled in services.` : ""}
          {totalCounty > 0 ? ` Community members from ${Object.keys(stats.countyViews).length} counties actively searched for CADC services.` : ""}"
        </div>
      </div>
      <div style={{ ...card, border: `1px solid ${MAROON}`, background: "#FFF8F8" }}>
        <div style={{ fontWeight: 800, fontSize: 13, color: MAROON, marginBottom: 6 }}>🚀 Launch Reset Controls</div>
        <p style={{ fontSize: 12, color: "#374151", margin: "0 0 14px", lineHeight: 1.6 }}>Use these when switching from the preview site to cadcok.org. Clears test data so the live site starts clean. Each reset requires confirmation — this cannot be undone.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[["stats","Stats","Visits, program taps, county views, searches"],["leads","Leads","All inquiry form submissions"],["bookings","Bookings","All ride booking submissions"],["volunteer","Volunteer Hours","All logged volunteer hour entries"]].map(([target, label, desc]) => (
            <div key={target} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "white", borderRadius: 8, border: `1px solid ${BORDER}` }}>
              <div><div style={{ fontWeight: 700, fontSize: 13 }}>{label}</div><div style={{ fontSize: 11, color: MUTED }}>{desc}</div></div>
              <ResetButton target={target} label={label} adminKey={adminKey} onReset={onReset} />
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "#FFF0F0", borderRadius: 8, border: "1px solid #FCA5A5" }}>
            <div><div style={{ fontWeight: 700, fontSize: 13, color: MAROON }}>Reset Everything</div><div style={{ fontSize: 11, color: MUTED }}>Stats + leads + bookings + hours + schedule</div></div>
            <ResetButton target="all" label="All Data" adminKey={adminKey} onReset={onReset} />
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Menu Editor ──────────────────────────────────────────────────────────────
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

// ─── Market Editor ────────────────────────────────────────────────────────────
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

// ─── Staff Editor ─────────────────────────────────────────────────────────────
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

// ─── Docs Editor ──────────────────────────────────────────────────────────────
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

// ─── Features Editor ──────────────────────────────────────────────────────────
function FeaturesEditor({ v, onChange, content, adminKey }: { v: SiteFeatures; onChange: (v: SiteFeatures) => void; content: SiteContent; adminKey: string }) {
  const safe = { ...{ spanishToggle: false, transitBooking: false, intakeLeads: false, volunteerLog: false, faqAccordion: false, boardPortal: false, contentScheduling: false, grantPdf: false }, ...v };
  const [translatePhase, setTranslatePhase] = useState<"idle"|"running"|"done"|"error">("idle");
  const [translateDetail, setTranslateDetail] = useState("");

  async function runTranslate() {
    setTranslatePhase("running"); setTranslateDetail("");
    try {
      const r = await fetch("/api/cms/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
        body: JSON.stringify({ content }),
      });
      const j = await r.json();
      if (r.ok && j.ok) { setTranslatePhase("done"); setTranslateDetail(`Translated at ${new Date(j.translatedAt).toLocaleTimeString()}`); }
      else { setTranslatePhase("error"); setTranslateDetail(j.error ?? "Unknown error"); }
    } catch (err) { setTranslatePhase("error"); setTranslateDetail(String(err)); }
  }

  const baseFeatures: { key: keyof SiteFeatures; label: string; desc: string; icon: string }[] = [
    { key: "spanishToggle", label: "Spanish / English Toggle", icon: "🌐", desc: "Shows the ES/EN language toggle in the site header. Turn on when Spanish translations are fully ready." },
  ];
  const premiumFeatures: { key: keyof SiteFeatures; label: string; desc: string; icon: string }[] = [
    { key: "transitBooking",    label: "Online Ride Booking",          icon: "🚌", desc: "Online ride request form on Transit → Schedule a Ride. Off = call button only." },
    { key: "intakeLeads",       label: "Follow-Up Capture",            icon: "📥", desc: "Follow-up contact form on eligibility pages. Sends inquiries to the Intake Leads tab." },
    { key: "volunteerLog",      label: "Public Volunteer Hour Logger",  icon: "🤝", desc: "Shows 'Log My Hours' in Head Start → Log Hours AND the full Volunteer Hub (⭐) in Board & Leadership." },
    { key: "faqAccordion",      label: "Head Start FAQ",               icon: "❓", desc: "FAQ accordion section on Head Start program page. Robin requested — toggle on when content is ready." },
    { key: "boardPortal",       label: "Board Document Portal",        icon: "📁", desc: "Board Documents sub-area in Board & Leadership — Tiffany uploads agendas, minutes, resolutions." },
    { key: "contentScheduling", label: "Content Scheduling",           icon: "🗓️", desc: "Scheduled content publishing system — stage updates to go live automatically on a future date." },
    { key: "grantPdf",          label: "Grant Impact PDF",             icon: "📈", desc: "Quarterly impact report generator in the admin panel. Pulls all site data into a grant-ready PDF." },
  ];

  function Toggle({ f }: { f: { key: keyof SiteFeatures; label: string; desc: string; icon: string } }) {
    const on = !!safe[f.key];
    return (
      <div style={{ ...card, display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div style={{ fontSize: 26, flexShrink: 0 }}>{f.icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontWeight: 800, fontSize: 14 }}>{f.label}</span>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", flexShrink: 0 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: on ? GREEN : MUTED }}>{on ? "ON" : "Off"}</span>
              <div onClick={() => onChange({ ...safe, [f.key]: !on })}
                style={{ width: 44, height: 24, borderRadius: 12, cursor: "pointer", background: on ? GREEN : "#D1D5DB", position: "relative", transition: "background 0.2s ease" }}>
                <div style={{ position: "absolute", top: 2, left: on ? 22 : 2, width: 20, height: 20, borderRadius: "50%", background: "white", transition: "left 0.2s ease", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
              </div>
            </label>
          </div>
          <p style={{ fontSize: 12, color: "#6B7280", margin: 0, lineHeight: 1.5 }}>{f.desc}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={{ ...card, background: "#F0F0FF", border: "none" }}>
        <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.6 }}>
          Toggle site features on or off instantly — no code change, no deploy. <strong>Base features</strong> are part of the core contract. <strong>Premium features</strong> are amendment scope — turn on when the contract is signed. Save after any change.
        </p>
      </div>
      <p style={{ color: MAROON, fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", margin: "4px 0 8px" }}>Base Features</p>
      {baseFeatures.map(f => <Toggle key={f.key} f={f} />)}

      {safe.spanishToggle && (
        <div style={{ ...card, background: "#F0F0FF", border: `1.5px solid ${BLUE}`, padding: "14px 16px" }}>
          <div style={{ fontWeight: 800, fontSize: 13, color: BLUE, marginBottom: 6 }}>🌐 Spanish Translation (Gemini AI)</div>
          <p style={{ margin: "0 0 12px", fontSize: 12, color: "#374151", lineHeight: 1.6 }}>
            Translation runs automatically when you save. Use this to re-translate manually — e.g. after updating the Senior Menu, Market Schedule, or Site Text.
          </p>
          {translatePhase === "idle" && (
            <button onClick={runTranslate} style={{ ...btn(), width: "100%", fontSize: 13 }}>🔄 Re-translate to Spanish Now</button>
          )}
          {translatePhase === "running" && (
            <div style={{ textAlign: "center", padding: "10px 0", fontSize: 13, color: BLUE, fontWeight: 700 }}>⏳ Translating via Gemini… (5–15 seconds)</div>
          )}
          {translatePhase === "done" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ color: GREEN, fontWeight: 800, fontSize: 13 }}>✅ Translation complete — {translateDetail}</div>
              <button onClick={() => setTranslatePhase("idle")} style={{ ...btn("white", BLUE), fontSize: 12, padding: "8px 14px" }}>Translate Again</button>
            </div>
          )}
          {translatePhase === "error" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ color: MAROON, fontWeight: 700, fontSize: 13 }}>❌ {translateDetail}</div>
              <button onClick={() => setTranslatePhase("idle")} style={{ ...btn("white", MAROON), fontSize: 12, padding: "8px 14px", borderColor: MAROON }}>Try Again</button>
            </div>
          )}
        </div>
      )}
      <p style={{ color: MAROON, fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", margin: "16px 0 8px" }}>⭐ Premium — Amendment Scope</p>
      <div style={{ ...card, background: "#FFF8E7", border: `1px solid ${AMBER}`, padding: "10px 14px", marginBottom: 12 }}>
        <p style={{ margin: 0, fontSize: 12, color: "#374151" }}>These features are built and ready. They activate when the amended contract is signed. Turning one on before the amendment is signed is at your discretion.</p>
      </div>
      {premiumFeatures.map(f => <Toggle key={f.key} f={f} />)}
      <p style={{ color: MAROON, fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", margin: "16px 0 8px" }}>📋 Forms & Intake — Amendment Scope</p>
      <div style={{ ...card, background: "#FFF8E7", border: `1px solid ${AMBER}`, padding: "10px 14px", marginBottom: 12 }}>
        <p style={{ margin: 0, fontSize: 12, color: "#374151" }}>Each form feeds directly into the Intake Leads tab. Every submission becomes a documented outreach touchpoint for grant reporting.</p>
      </div>
      {([
        { key: "formServiceScreener",        label: "Universal Service Screener",      icon: "🔍", desc: "\"Find Your Benefits\" — 6 questions that surface which CADC programs a resident qualifies for." },
        { key: "formHeadStartPreEnroll",     label: "Head Start Pre-Enrollment Form",  icon: "🏫", desc: "Captures family interest before ChildPlus. Robin's team gets a lead queue to follow up." },
        { key: "formWeatherizationInterest", label: "Weatherization Interest Form",    icon: "🏠", desc: "Waitlist intake for Robert's program. Captures address, household, utility info." },
        { key: "formVitaAppointment",        label: "VITA Appointment Request",        icon: "📋", desc: "Tax season appointment intake — name, phone, county, return type, language preference." },
        { key: "formVolunteerInterest",      label: "Volunteer Interest Form",         icon: "🤝", desc: "Public volunteer pipeline — feeds the volunteer hour tracker." },
        { key: "formCommunityNeeds",         label: "Community Needs Survey",          icon: "📊", desc: "Quarterly 8-question survey. Results feed the grant impact dashboard." },
      ] as { key: keyof SiteFeatures; label: string; icon: string; desc: string }[]).map(f => <Toggle key={f.key} f={f} />)}
    </>
  );
}

// ─── Schedule Panel ───────────────────────────────────────────────────────────
function SchedulePanel({ schedule, adminKey, onUpdate }: { schedule: ScheduledItem[]; adminKey: string; onUpdate: (s: ScheduledItem[]) => void }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", section: "announcement" as ScheduledItem["section"], publishAt: "", expiresAt: "" });
  const [saving, setSaving] = useState(false);
  const now = new Date().toISOString();
  async function cancel(id: string) {
    await fetch("/api/cms/schedule", { method: "PATCH", headers: { "Content-Type": "application/json", "x-admin-key": adminKey }, body: JSON.stringify({ id, status: "cancelled" }) });
    onUpdate(schedule.map(s => s.id === id ? { ...s, status: "cancelled" } : s));
  }
  async function remove(id: string) {
    await fetch("/api/cms/schedule", { method: "DELETE", headers: { "Content-Type": "application/json", "x-admin-key": adminKey }, body: JSON.stringify({ id }) });
    onUpdate(schedule.filter(s => s.id !== id));
  }
  const upcoming = schedule.filter(s => s.status === "scheduled" && s.publishAt > now);
  const published = schedule.filter(s => s.status === "published");
  return (
    <>
      <div style={{ ...card, background: "#F0F0FF", border: "none" }}>
        <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.6 }}>Stage content updates in advance. A scheduled item goes live automatically at the date and time you set — no login required at publish time.</p>
      </div>
      <button style={{ ...btn(), width: "100%", marginBottom: 14 }} onClick={() => setShowForm(!showForm)}>{showForm ? "✕ Cancel" : "+ Schedule an Update"}</button>
      {showForm && (
        <div style={card}>
          <span style={lbl}>Title (internal — staff only)</span>
          <input style={{ ...input, marginBottom: 10 }} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. October Senior Menu" />
          <span style={lbl}>What are you scheduling?</span>
          <select style={{ ...input, marginBottom: 10 }} value={form.section} onChange={e => setForm(f => ({ ...f, section: e.target.value as ScheduledItem["section"] }))}>
            <option value="announcement">Alert Banner</option>
            <option value="seniorMenu">Senior Nutrition Menu</option>
            <option value="marketSchedule">Community Market Schedule</option>
            <option value="staff">Staff Directory</option>
            <option value="documents">Documents</option>
            <option value="boardDocs">Board Documents</option>
          </select>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
            <div><span style={lbl}>Publish date & time *</span><input style={input} type="datetime-local" value={form.publishAt} onChange={e => setForm(f => ({ ...f, publishAt: e.target.value }))} /></div>
            <div><span style={lbl}>Auto-expire (optional)</span><input style={input} type="datetime-local" value={form.expiresAt} onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))} /></div>
          </div>
          <p style={{ fontSize: 12, color: MUTED, margin: "0 0 14px" }}>Note: Contact Chris to set up the full content payload for complex items like menus.</p>
          <button style={{ ...btn(), width: "100%" }} onClick={async () => {
            if (!form.title || !form.publishAt) return;
            setSaving(true);
            const r = await fetch("/api/cms/schedule", { method: "POST", headers: { "Content-Type": "application/json", "x-admin-key": adminKey }, body: JSON.stringify({ ...form, publishAt: new Date(form.publishAt).toISOString(), expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : undefined, createdBy: "admin", payload: {} }) });
            if (r.ok) { const j = await r.json(); onUpdate([...schedule, { ...form, id: j.id, publishAt: new Date(form.publishAt).toISOString(), status: "scheduled", createdBy: "admin", createdAt: new Date().toISOString(), payload: {} }]); setShowForm(false); }
            setSaving(false);
          }} disabled={saving}>{saving ? "Saving…" : "Schedule Update"}</button>
        </div>
      )}
      {upcoming.length > 0 && (
        <div style={card}>
          <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 12, color: BLUE }}>🗓️ Upcoming ({upcoming.length})</div>
          {upcoming.map(s => (
            <div key={s.id} style={{ padding: "10px 0", borderBottom: `1px solid ${BORDER}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div><div style={{ fontWeight: 700, fontSize: 14 }}>{s.title}</div><div style={{ fontSize: 11, color: MUTED }}>{s.section} · {new Date(s.publishAt).toLocaleString()}</div></div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => cancel(s.id)} style={{ ...btn("white", AMBER), padding: "4px 10px", fontSize: 11, border: `1px solid ${AMBER}` }}>Cancel</button>
                  <button onClick={() => remove(s.id)} style={{ ...btn("white", MAROON), padding: "4px 10px", fontSize: 11, borderColor: MAROON }}>×</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {published.length > 0 && (
        <div style={card}>
          <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 12, color: GREEN }}>✅ Published ({published.length})</div>
          {published.slice(0, 10).map(s => (
            <div key={s.id} style={{ padding: "8px 0", borderBottom: `1px solid ${BORDER}`, fontSize: 13 }}>
              <span style={{ fontWeight: 700 }}>{s.title}</span><span style={{ color: MUTED, marginLeft: 8 }}>{new Date(s.publishAt).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      )}
      {upcoming.length === 0 && published.length === 0 && <p style={{ color: MUTED, textAlign: "center", padding: 40 }}>No scheduled updates yet.</p>}
    </>
  );
}

// ─── Board Docs Admin Panel ───────────────────────────────────────────────────
const BD_CATS = [
  { key: "agenda",         label: "Meeting Agenda" },
  { key: "minutes",        label: "Meeting Minutes" },
  { key: "resolution",     label: "Resolution" },
  { key: "policy-council", label: "Policy Council" },
  { key: "annual-report",  label: "Annual Report" },
  { key: "other",          label: "Other" },
] as const;

function BoardDocsAdminPanel({ content, adminKey, onChange }: { content: SiteContent; adminKey: string; onChange: (v: BoardDoc[]) => void }) {
  const docs = content.boardDocs ?? [];
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", category: "agenda" as BoardDoc["category"], date: new Date().toISOString().slice(0, 10), href: "" });
  const [saving, setSaving] = useState(false);
  async function add() {
    if (!form.title || !form.href) return;
    setSaving(true);
    const r = await fetch("/api/cms/board-docs", { method: "POST", headers: { "Content-Type": "application/json", "x-admin-key": adminKey }, body: JSON.stringify({ ...form, uploadedBy: "admin" }) });
    if (r.ok) { const { id } = await r.json(); onChange([{ ...form, id, uploadedBy: "admin", uploadedAt: new Date().toISOString() }, ...docs]); setForm(f => ({ ...f, title: "", href: "" })); setShowForm(false); }
    setSaving(false);
  }
  async function remove(id: string) {
    await fetch("/api/cms/board-docs", { method: "DELETE", headers: { "Content-Type": "application/json", "x-admin-key": adminKey }, body: JSON.stringify({ id }) });
    onChange(docs.filter(d => d.id !== id));
  }
  return (
    <>
      <div style={{ ...card, background: "#F0F0FF", border: "none" }}>
        <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.6 }}>Upload board agendas, minutes, and resolutions. Files must be uploaded to <strong>/documents/board/</strong> in the repo first — then paste the link here.</p>
      </div>
      <button style={{ ...btn(), width: "100%", marginBottom: 14 }} onClick={() => setShowForm(!showForm)}>{showForm ? "✕ Cancel" : "+ Add Board Document"}</button>
      {showForm && (
        <div style={card}>
          <span style={lbl}>Document title</span>
          <input style={{ ...input, marginBottom: 10 }} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Board Meeting Minutes — September 2026" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
            <div><span style={lbl}>Category</span>
              <select style={input} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as BoardDoc["category"] }))}>
                {BD_CATS.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
            </div>
            <div><span style={lbl}>Meeting date</span><input style={input} type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></div>
          </div>
          <span style={lbl}>File path</span>
          <input style={{ ...input, marginBottom: 14 }} value={form.href} onChange={e => setForm(f => ({ ...f, href: e.target.value }))} placeholder="/documents/board/minutes-sept-2026.pdf" />
          <button style={{ ...btn(), width: "100%" }} onClick={add} disabled={saving}>{saving ? "Saving…" : "Add Document"}</button>
        </div>
      )}
      {docs.length === 0 && !showForm && <p style={{ color: MUTED, textAlign: "center", padding: 40 }}>No board documents posted yet.</p>}
      {docs.map(doc => (
        <div key={doc.id} style={{ ...card, padding: 12, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.title}</div>
            <div style={{ fontSize: 11, color: MUTED }}>{doc.category} · {doc.date}</div>
          </div>
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            <a href={doc.href} target="_blank" rel="noopener noreferrer" style={{ ...btn("white", BLUE), padding: "6px 10px", fontSize: 11, textDecoration: "none" }}>View</a>
            <button onClick={() => remove(doc.id)} style={{ ...btn("white", MAROON), padding: "6px 10px", fontSize: 11, borderColor: MAROON }}>×</button>
          </div>
        </div>
      ))}
    </>
  );
}

// ─── Impact PDF Panel ─────────────────────────────────────────────────────────
function ImpactPanel({ adminKey }: { adminKey: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function generate() {
    setLoading(true); setError("");
    const r = await fetch("/api/cms/grant-impact", { headers: { "x-admin-key": adminKey } });
    if (!r.ok) { setError("Failed to generate. Try again."); setLoading(false); return; }
    const html = await r.text();
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `cadc-impact-report-${new Date().toISOString().slice(0,7)}.html`;
    a.click(); URL.revokeObjectURL(url);
    setLoading(false);
  }
  return (
    <div style={{ ...card, background: "#F0FFF4", border: `1px solid ${GREEN}` }}>
      <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 8, color: GREEN }}>📈 Quarterly Impact Report</div>
      <p style={{ margin: "0 0 14px", fontSize: 13, color: "#374151", lineHeight: 1.6 }}>
        Generate a one-page impact summary from all site data — engagement stats, intake leads, volunteer hours, and transit requests. Opens as an HTML file you can print to PDF.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 16 }}>
        {[["📊","Site engagement"],["📥","Intake & follow-up"],["🤝","Volunteer match"]].map(([icon, label]) => (
          <div key={label as string} style={{ background: "white", border: `1px solid ${GREEN}`, borderRadius: 8, padding: 10, fontSize: 11, textAlign: "center" }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>
            <div style={{ color: "#374151", lineHeight: 1.4 }}>{label}</div>
          </div>
        ))}
      </div>
      <button style={{ ...btn(GREEN), width: "100%", fontSize: 15 }} onClick={generate} disabled={loading}>
        {loading ? "Generating…" : "📥 Download Impact Report"}
      </button>
      {error && <p style={{ color: MAROON, fontSize: 13, marginTop: 10 }}>{error}</p>}
      <p style={{ fontSize: 11, color: MUTED, marginTop: 10 }}>Use File → Print → Save as PDF to create the final PDF document.</p>
    </div>
  );
}

// ─── Reset Button ─────────────────────────────────────────────────────────────
function ResetButton({ target, label, adminKey, onReset }: { target: string; label: string; adminKey: string; onReset: () => void }) {
  const [phase, setPhase] = useState<"idle"|"confirm"|"resetting"|"done"|"err">("idle");
  async function doReset() {
    setPhase("resetting");
    const r = await fetch("/api/cms/reset", { method: "DELETE", headers: { "Content-Type": "application/json", "x-admin-key": adminKey }, body: JSON.stringify({ target, confirm: "RESET_CONFIRMED" }) }).catch(() => null);
    if (r?.ok) { setPhase("done"); setTimeout(() => { setPhase("idle"); onReset(); }, 2000); }
    else setPhase("err");
  }
  if (phase === "confirm") return (
    <div style={{ background: "#FFF0F0", border: "1px solid #FCA5A5", borderRadius: 10, padding: "12px 14px", marginBottom: 14 }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: "#CC0000", margin: "0 0 10px" }}>⚠️ Are you sure? This cannot be undone.</p>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={doReset} style={{ flex: 1, background: "#CC0000", color: "white", border: "none", borderRadius: 8, padding: "10px", fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Yes, Reset {label}</button>
        <button onClick={() => setPhase("idle")} style={{ flex: 1, background: "white", color: "#374151", border: "1px solid #E5E7EB", borderRadius: 8, padding: "10px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
      </div>
    </div>
  );
  if (phase === "resetting") return <div style={{ padding: "10px 0", fontSize: 13, color: MUTED, fontWeight: 600 }}>Resetting…</div>;
  if (phase === "done") return <div style={{ padding: "10px 0", fontSize: 13, color: GREEN, fontWeight: 700 }}>✅ {label} cleared successfully.</div>;
  if (phase === "err") return <div style={{ padding: "10px 0", fontSize: 13, color: MAROON, fontWeight: 700 }}>Error resetting. Try again.</div>;
  return (
    <button onClick={() => setPhase("confirm")} style={{ background: "white", color: MAROON, border: `1px solid ${MAROON}`, borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
      🔄 Reset {label}
    </button>
  );
}

// ─── Site Text Editor ─────────────────────────────────────────────────────────
// Edits the fields in SiteText — footer tagline, survey URL/text, phone, address, socials.
// Each field that changes across seasons (survey year, phone) is here.
function SiteTextEditor({ v, onChange }: { v: SiteText; onChange: (v: SiteText) => void }) {
  const set = (k: keyof SiteText, val: string) => onChange({ ...v, [k]: val });
  return (
    <>
      <div style={{ ...card, background: "#F0F0FF", border: "none" }}>
        <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.6 }}>
          These are the text fields across the site that shouldn't require a code change to update. Edit here and save — the live site updates immediately.
        </p>
      </div>

      <div style={card}>
        <span style={lbl}>Footer tagline</span>
        <p style={{ fontSize: 11, color: MUTED, margin: "0 0 8px" }}>Shows below the CADC logo in the footer. Use a line break (\n) to split into two lines.</p>
        <textarea style={{ ...input, minHeight: 72 }} value={v.footerTagline} onChange={e => set("footerTagline", e.target.value)} />
      </div>

      <div style={card}>
        <span style={lbl}>Survey banner text</span>
        <p style={{ fontSize: 11, color: MUTED, margin: "0 0 8px" }}>The red banner across the top of every page. Update the year and text here when the survey changes.</p>
        <input style={{ ...input, marginBottom: 10 }} value={v.surveyBannerText} onChange={e => set("surveyBannerText", e.target.value)} placeholder="2026 Community Needs Survey — Make Your Voice Heard →" />
        <span style={lbl}>Survey link URL</span>
        <input style={input} value={v.surveyUrl} onChange={e => set("surveyUrl", e.target.value)} placeholder="https://www.surveymonkey.com/r/…" />
      </div>

      <div style={card}>
        <span style={lbl}>Main CADC phone number</span>
        <p style={{ fontSize: 11, color: MUTED, margin: "0 0 8px" }}>Shows in the header call button and footer. Format: 580-335-5588</p>
        <input style={input} value={v.mainPhone} onChange={e => set("mainPhone", e.target.value)} placeholder="580-335-5588" />
      </div>

      <div style={card}>
        <span style={lbl}>Head office address</span>
        <p style={{ fontSize: 11, color: MUTED, margin: "0 0 8px" }}>Shows in the footer Contact column. Use \n to split into two lines.</p>
        <textarea style={{ ...input, minHeight: 72 }} value={v.headOfficeAddress} onChange={e => set("headOfficeAddress", e.target.value)} />
      </div>

      <div style={card}>
        <span style={lbl}>Facebook URL</span>
        <input style={{ ...input, marginBottom: 10 }} value={v.facebookUrl} onChange={e => set("facebookUrl", e.target.value)} placeholder="https://www.facebook.com/…" />
        <span style={lbl}>Instagram URL</span>
        <input style={input} value={v.instagramUrl} onChange={e => set("instagramUrl", e.target.value)} placeholder="https://www.instagram.com/…" />
      </div>
    </>
  );
}

// ─── Program Taglines Editor ──────────────────────────────────────────────────
// Edits the tagline shown under each program name in the orbit and content panels.
// Keys match ProgramData.slug in CADCOrbitSite.tsx.
const PROGRAM_SLUGS: { slug: string; name: string }[] = [
  { slug: "head-start",       name: "Head Start & Early Head Start" },
  { slug: "transit",          name: "Red River Transit" },
  { slug: "weatherization",   name: "Weatherization" },
  { slug: "senior-nutrition", name: "Senior Nutrition" },
  { slug: "community-market", name: "Community Market" },
  { slug: "tax-help",         name: "VITA Free Tax Help" },
  { slug: "employment",       name: "Employment & Workforce" },
  { slug: "board",            name: "Board & Leadership" },
  { slug: "advantage",        name: "Advantage Home Delivered Meals" },
];

function TaglinesEditor({ v, onChange }: { v: Record<string, string>; onChange: (v: Record<string, string>) => void }) {
  const set = (slug: string, val: string) => onChange({ ...v, [slug]: val });
  return (
    <>
      <div style={{ ...card, background: "#FFF8E7", border: `1px solid ${AMBER}`, padding: "10px 14px" }}>
        <p style={{ margin: 0, fontSize: 12, color: "#374151", lineHeight: 1.6 }}>
          These taglines appear under each program name in the orbit and program header. Keep them short — one line, under 70 characters. They often include stats from the annual report.
        </p>
      </div>
      {PROGRAM_SLUGS.map(({ slug, name }) => (
        <div key={slug} style={card}>
          <span style={lbl}>{name}</span>
          <input
            style={input}
            value={v[slug] ?? DEFAULT_PROGRAM_TAGLINES[slug] ?? ""}
            onChange={e => set(slug, e.target.value)}
            placeholder={DEFAULT_PROGRAM_TAGLINES[slug]}
          />
          <p style={{ fontSize: 10, color: MUTED, margin: "6px 0 0" }}>
            {(v[slug] ?? "").length}/70 characters
          </p>
        </div>
      ))}
    </>
  );
}
