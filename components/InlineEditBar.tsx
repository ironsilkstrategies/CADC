// components/InlineEditBar.tsx
// Wraps any content block on the LIVE public site. When an admin is logged
// in (checked via a lightweight session cookie set on /admin login), a small
// pencil icon appears on hover/tap. Clicking opens an inline editor that
// saves directly to the content-blocks API — no trip to /admin required.
//
// Usage on the public site:
//   <EditableText id="head-start.hero.title" section="head-start" label="Hero Title" fallback="Give your child a strong start.">
//     <h1>Give your child a strong start.</h1>
//   </EditableText>

"use client";
import { useState, useEffect, useCallback } from "react";
import type { ContentBlock } from "@/lib/cms";

// ─── Admin session check ──────────────────────────────────────────────────────
// Set this cookie when admin logs in via the hidden /admin secret-tap flow.
// A simple presence check is enough — the actual API calls still require
// the real x-admin-key header, so this only controls whether edit UI shows.
function useIsAdminViewer(): boolean {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const hasSession = typeof document !== "undefined" && document.cookie.includes("cadc_admin_view=1");
    setIsAdmin(hasSession);
  }, []);
  return isAdmin;
}

// Call this from the admin login success handler to enable inline editing
// site-wide without needing to pass adminKey through every page:
export function markAdminViewerSession() {
  document.cookie = "cadc_admin_view=1; path=/; max-age=86400"; // 24hr
}
export function clearAdminViewerSession() {
  document.cookie = "cadc_admin_view=0; path=/; max-age=0";
}

interface EditableProps {
  id: string;              // e.g. "head-start.hero.title"
  section: string;         // e.g. "head-start"
  label: string;           // shown in the tiny edit tooltip
  type?: "text" | "richtext" | "image" | "stat";
  fallback: string;        // what renders if no override is saved yet
  children?: React.ReactNode; // the normal rendered content (used when not editing)
  as?: "span" | "div" | "p" | "h1" | "h2" | "h3";
}

export function EditableText({ id, section, label, type = "text", fallback, children, as = "span" }: EditableProps) {
  const isAdmin = useIsAdminViewer();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(fallback);
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Pull any saved override for this block id
    fetch("/api/cms/content-blocks")
      .then(r => r.ok ? r.json() : [])
      .then((blocks: ContentBlock[]) => {
        const match = blocks.find(b => b.id === id);
        if (match) setValue(match.value);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [id]);

  const save = useCallback(async () => {
    // adminKey is read from a short-lived localStorage token set at /admin login —
    // falls back gracefully (save button disabled) if not present.
    const adminKey = typeof window !== "undefined" ? localStorage.getItem("cadc_admin_key") ?? "" : "";
    if (!adminKey) { alert("Admin session expired — please log in again at /admin"); return; }

    await fetch("/api/cms/content-blocks", {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify({ id, section, label, type, value, updatedBy: "admin" }),
    });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [id, section, label, type, value]);

  const Tag = as;

  if (!isAdmin) {
    // Normal visitor — render override value if loaded, else fallback/children
    return loaded && value !== fallback
      ? <Tag>{value}</Tag>
      : <>{children ?? <Tag>{fallback}</Tag>}</>;
  }

  // Admin viewer — wrap with edit affordance
  return (
    <span style={{ position: "relative", display: "inline-block", outline: editing ? "2px dashed #0101FF" : "none", outlineOffset: 3, borderRadius: 4 }}>
      {editing ? (
        type === "richtext" ? (
          <textarea
            autoFocus
            value={value}
            onChange={e => setValue(e.target.value)}
            style={{ minWidth: 240, minHeight: 80, fontSize: "inherit", fontFamily: "inherit", padding: 6, border: "1.5px solid #0101FF", borderRadius: 6 }}
          />
        ) : (
          <input
            autoFocus
            value={value}
            onChange={e => setValue(e.target.value)}
            style={{ fontSize: "inherit", fontFamily: "inherit", fontWeight: "inherit", padding: "2px 6px", border: "1.5px solid #0101FF", borderRadius: 6, minWidth: 160 }}
          />
        )
      ) : (
        <Tag>{value}</Tag>
      )}

      {editing ? (
        <span style={{ display: "inline-flex", gap: 4, marginLeft: 6, verticalAlign: "middle" }}>
          <button onClick={save} title="Save"
            style={{ background: "#059669", color: "white", border: "none", borderRadius: 4, width: 22, height: 22, fontSize: 12, cursor: "pointer", lineHeight: 1 }}>✓</button>
          <button onClick={() => { setEditing(false); }} title="Cancel"
            style={{ background: "#9CA3AF", color: "white", border: "none", borderRadius: 4, width: 22, height: 22, fontSize: 12, cursor: "pointer", lineHeight: 1 }}>✕</button>
        </span>
      ) : (
        <button onClick={() => setEditing(true)} title={`Edit: ${label}`}
          style={{
            marginLeft: 6, background: "#0101FF", color: "white", border: "none", borderRadius: 4,
            width: 20, height: 20, fontSize: 10, cursor: "pointer", verticalAlign: "middle", lineHeight: 1,
            opacity: 0.7,
          }}>✏️</button>
      )}
      {saved && <span style={{ marginLeft: 6, color: "#059669", fontSize: 11, fontWeight: 700 }}>Saved</span>}
    </span>
  );
}

// ─── Global "Admin Mode" indicator bar ────────────────────────────────────────
// Drop this once near the root of the public site layout. Shows a small
// persistent strip when admin viewing is active, with a way to exit it.
export function AdminModeIndicator() {
  const isAdmin = useIsAdminViewer();
  if (!isAdmin) return null;
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 9998,
      background: "#0101FF", color: "white", fontSize: 12, fontWeight: 700,
      padding: "6px 16px", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
    }}>
      ✏️ Admin Edit Mode — click any pencil icon to edit content directly
      <button onClick={() => { clearAdminViewerSession(); window.location.reload(); }}
        style={{ background: "rgba(255,255,255,0.2)", color: "white", border: "none", borderRadius: 6, padding: "3px 10px", fontSize: 11, cursor: "pointer" }}>
        Exit Edit Mode
      </button>
    </div>
  );
}
