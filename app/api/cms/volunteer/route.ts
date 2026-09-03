// app/api/cms/volunteer/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { VOLUNTEER_KEY, type VolunteerEntry } from "@/lib/cms";

const redis = Redis.fromEnv();
const ADMIN_KEY = process.env.ADMIN_PASSWORD ?? "";

function auth(req: NextRequest) {
  return req.headers.get("x-admin-key") === ADMIN_KEY;
}

// GET — admin only, returns all entries
export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const raw = await redis.get<VolunteerEntry[]>(VOLUNTEER_KEY);
  const entries = Array.isArray(raw) ? raw : [];
  return NextResponse.json(entries.sort((a, b) => b.date.localeCompare(a.date)));
}

// POST — public (staff submits from any device), logs a volunteer entry
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const entry: VolunteerEntry = {
      id: crypto.randomUUID(),
      ts: new Date().toISOString(),
      volunteerName: body.volunteerName ?? "",
      supervisorName: body.supervisorName ?? "",
      program: body.program ?? "head-start",
      center: body.center ?? "",
      date: body.date ?? new Date().toISOString().slice(0, 10),
      hours: parseFloat(body.hours) || 0,
      type: body.type ?? "volunteer",
      description: body.description,
    };
    const raw = await redis.get<VolunteerEntry[]>(VOLUNTEER_KEY);
    const entries = Array.isArray(raw) ? raw : [];
    entries.unshift(entry);
    await redis.set(VOLUNTEER_KEY, entries.slice(0, 2000));
    return NextResponse.json({ ok: true, id: entry.id });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// DELETE — admin only, remove an entry by id
export async function DELETE(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  const raw = await redis.get<VolunteerEntry[]>(VOLUNTEER_KEY);
  const entries = Array.isArray(raw) ? raw : [];
  await redis.set(VOLUNTEER_KEY, entries.filter(e => e.id !== id));
  return NextResponse.json({ ok: true });
}
