// app/api/cms/volunteer-hours/route.ts
// Public endpoint — returns total volunteer hours only, no PII
import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { VOLUNTEER_KEY, type VolunteerEntry } from "@/lib/cms";

const redis = Redis.fromEnv();

// Rate limit — 30 reads/min per IP (the hub polls on mount)
const rlMap = new Map<string, { count: number; resetAt: number }>();
function getIP(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
}
function allow(ip: string): boolean {
  const now = Date.now();
  const e = rlMap.get(ip);
  if (!e || now > e.resetAt) { rlMap.set(ip, { count: 1, resetAt: now + 60_000 }); return true; }
  if (e.count >= 30) return false;
  e.count++; return true;
}

export async function GET(req: NextRequest) {
  if (!allow(getIP(req))) return NextResponse.json({ totalHours: 0 }, { status: 429 });
  try {
    const raw = await redis.get<VolunteerEntry[]>(VOLUNTEER_KEY);
    const entries = Array.isArray(raw) ? raw : [];
    const totalHours = entries.reduce((s, e) => s + (e.hours ?? 0), 0);
    return NextResponse.json(
      { totalHours: Math.round(totalHours * 10) / 10 },
      { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }
    );
  } catch {
    return NextResponse.json({ totalHours: 0 });
  }
}
