// app/api/cms/schedule/route.ts
// Content scheduling — stage updates with a publish date
import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { SCHEDULE_KEY, CMS_KEY, type ScheduledItem, type SiteContent } from "@/lib/cms";

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

// ─── Publish checker — called by a cron or on each CMS fetch ─────────────────
// Checks if any scheduled items are due and applies their payload to SiteContent
export async function publishDueItems() {
  const now = new Date().toISOString();
  const raw = await redis.get<ScheduledItem[]>(SCHEDULE_KEY);
  const items = Array.isArray(raw) ? raw : [];
  const due = items.filter(i => i.status === "scheduled" && i.publishAt <= now);
  if (due.length === 0) return;

  const content = await redis.get<SiteContent>(CMS_KEY);
  let updated = content ?? {};

  for (const item of due) {
    (updated as Record<string, unknown>)[item.section] = item.payload;
    item.status = "published";
  }

  // Handle expirations
  const expired = items.filter(i => i.status === "published" && i.expiresAt && i.expiresAt <= now);
  for (const item of expired) { item.status = "expired"; }

  await redis.set(CMS_KEY, { ...updated, updatedAt: now, updatedBy: "scheduler" });
  await redis.set(SCHEDULE_KEY, items);
}
