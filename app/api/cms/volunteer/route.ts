// app/api/cms/volunteer/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { VOLUNTEER_KEY, type VolunteerEntry } from "@/lib/cms";

const redis = Redis.fromEnv();
const ADMIN_KEY = process.env.ADMIN_PASSWORD ?? "";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
function getIP(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? req.headers.get("x-real-ip") ?? "unknown";
}
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) { rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 }); return true; }
  if (entry.count >= 10) return false; // volunteer log slightly more permissive
  entry.count++;
  return true;
}

function auth(req: NextRequest) { return req.headers.get("x-admin-key") === ADMIN_KEY; }
function sanitize(s: unknown, max = 200): string { if (typeof s !== "string") return ""; return s.trim().slice(0, max); }

function validateEntry(body: Record<string, unknown>): string | null {
  if (body._gotcha) return "bot";
  if (!sanitize(body.volunteerName, 100)) return "Volunteer name required";
  if (!sanitize(body.supervisorName, 100)) return "Supervisor name required";
  if (!sanitize(body.center, 50)) return "Center required";
  const hours = parseFloat(String(body.hours ?? "0"));
  if (isNaN(hours) || hours <= 0 || hours > 24) return "Hours must be between 0.5 and 24";
  return null;
}

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const raw = await redis.get<VolunteerEntry[]>(VOLUNTEER_KEY);
  const entries = Array.isArray(raw) ? raw : [];
  return NextResponse.json(entries.sort((a, b) => b.date.localeCompare(a.date)));
}

export async function POST(req: NextRequest) {
  try {
    const ip = getIP(req);
    if (!checkRateLimit(ip)) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    const body = await req.json();
    const err = validateEntry(body);
    if (err === "bot") return NextResponse.json({ ok: true });
    if (err) return NextResponse.json({ error: err }, { status: 400 });

    const entry: VolunteerEntry = {
      id: crypto.randomUUID(),
      ts: new Date().toISOString(),
      volunteerName: sanitize(body.volunteerName, 100),
      supervisorName: sanitize(body.supervisorName, 100),
      program: sanitize(body.program, 50) || "head-start",
      center: sanitize(body.center, 50),
      date: sanitize(body.date, 20) || new Date().toISOString().slice(0, 10),
      hours: Math.min(parseFloat(String(body.hours)) || 0, 24),
      type: (["volunteer","in-kind-space","in-kind-services","public-school-collab"].includes(String(body.type))
        ? body.type : "volunteer") as VolunteerEntry["type"],
      description: sanitize(body.description, 500) || undefined,
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

export async function DELETE(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  const raw = await redis.get<VolunteerEntry[]>(VOLUNTEER_KEY);
  const entries = Array.isArray(raw) ? raw : [];
  await redis.set(VOLUNTEER_KEY, entries.filter(e => e.id !== id));
  return NextResponse.json({ ok: true });
}
