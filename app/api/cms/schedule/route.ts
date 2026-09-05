// app/api/cms/schedule/route.ts
// Content scheduling — stage updates with a publish date.
// publishDueItems() is called on every GET to /api/cms (the main CMS route)
// so scheduled content goes live without needing a dedicated cron job.
// It's also exported here so the main CMS route can import it directly.

import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { SCHEDULE_KEY, CMS_KEY, type ScheduledItem, type SiteContent } from "@/lib/cms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const redis = Redis.fromEnv();
const ADMIN_KEY = process.env.ADMIN_PASSWORD ?? "";

function auth(req: NextRequest) {
  return req.headers.get("x-admin-key") === ADMIN_KEY;
}

// GET — admin: returns all scheduled items
export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const raw = await redis.get<ScheduledItem[]>(SCHEDULE_KEY);
  const items = Array.isArray(raw) ? raw : [];
  return NextResponse.json(items.sort((a, b) => a.publishAt.localeCompare(b.publishAt)));
}

// POST — admin: create a new scheduled item
export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const item: ScheduledItem = {
    id: crypto.randomUUID(),
    title: body.title ?? "Untitled",
    section: body.section,
    publishAt: body.publishAt,
    expiresAt: body.expiresAt,
    payload: body.payload,
    status: "scheduled",
    createdBy: body.createdBy ?? "admin",
    createdAt: new Date().toISOString(),
  };
  const raw = await redis.get<ScheduledItem[]>(SCHEDULE_KEY);
  const items = Array.isArray(raw) ? raw : [];
  items.push(item);
  await redis.set(SCHEDULE_KEY, items);
  return NextResponse.json({ ok: true, id: item.id });
}

// PATCH — admin: update status or cancel
export async function PATCH(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, status } = await req.json();
  const raw = await redis.get<ScheduledItem[]>(SCHEDULE_KEY);
  const items = Array.isArray(raw) ? raw : [];
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  items[idx] = { ...items[idx], status };
  await redis.set(SCHEDULE_KEY, items);
  return NextResponse.json({ ok: true });
}

// DELETE — admin: remove a scheduled item
export async function DELETE(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  const raw = await redis.get<ScheduledItem[]>(SCHEDULE_KEY);
  const items = Array.isArray(raw) ? raw : [];
  await redis.set(SCHEDULE_KEY, items.filter(i => i.id !== id));
  return NextResponse.json({ ok: true });
}

// ─── Publish checker ──────────────────────────────────────────────────────────
// Called by the main /api/cms GET on every public page load.
// No cron needed — runs passively on site traffic.
// Fast-path: if nothing is scheduled, returns immediately with zero KV writes.
export async function publishDueItems(): Promise<void> {
  const now = new Date().toISOString();

  // Fast path — skip if no scheduled items exist
  const raw = await redis.get<ScheduledItem[]>(SCHEDULE_KEY);
  const items = Array.isArray(raw) ? raw : [];
  const due = items.filter(i => i.status === "scheduled" && i.publishAt <= now);
  const expired = items.filter(i => i.status === "published" && i.expiresAt && i.expiresAt <= now);

  if (due.length === 0 && expired.length === 0) return; // nothing to do

  // Apply due items to SiteContent
  const content = await redis.get<SiteContent>(CMS_KEY);
  const updated: Record<string, unknown> = { ...(content as Record<string, unknown> ?? {}) };

  for (const item of due) {
    updated[item.section] = item.payload;
    item.status = "published";
  }
  for (const item of expired) {
    item.status = "expired";
  }

  await Promise.all([
    redis.set(CMS_KEY, { ...updated, updatedAt: now, updatedBy: "scheduler" }),
    redis.set(SCHEDULE_KEY, items),
  ]);
}
