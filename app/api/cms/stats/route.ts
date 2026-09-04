// app/api/cms/stats/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { STATS_KEY, type SiteStats } from "@/lib/cms";

const redis = Redis.fromEnv();
const ADMIN_KEY = process.env.ADMIN_PASSWORD ?? "";

// Rate limit stats to prevent artificial inflation — 60 hits/min per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
function getIP(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? req.headers.get("x-real-ip") ?? "unknown";
}
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) { rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 }); return true; }
  if (entry.count >= 60) return false;
  entry.count++;
  return true;
}

function emptyStats(): SiteStats {
  return { programTaps: {}, countyViews: {}, searchTerms: {}, weeklyVisits: 0, lastReset: new Date().toISOString() };
}

// Valid stat types and known program/county values to prevent injection
const VALID_TYPES = new Set(["program", "county", "search", "visit"]);

export async function GET(req: NextRequest) {
  if (req.headers.get("x-admin-key") !== ADMIN_KEY) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const raw = await redis.get<SiteStats>(STATS_KEY);
  return NextResponse.json(raw ?? emptyStats());
}

export async function POST(req: NextRequest) {
  try {
    const ip = getIP(req);
    if (!checkRateLimit(ip)) return NextResponse.json({ ok: true }); // silent drop, don't expose limit

    const { type, key } = await req.json();

    if (!VALID_TYPES.has(type)) return NextResponse.json({ ok: true }); // ignore unknown types silently

    const raw = await redis.get<SiteStats>(STATS_KEY);
    const stats: SiteStats = raw ? { ...emptyStats(), ...raw } : emptyStats();

    if (type === "program" && key) {
      const k = String(key).toLowerCase().slice(0, 50);
      stats.programTaps[k] = (stats.programTaps[k] ?? 0) + 1;
    } else if (type === "county" && key) {
      const k = String(key).toLowerCase().slice(0, 50);
      stats.countyViews[k] = (stats.countyViews[k] ?? 0) + 1;
    } else if (type === "search" && key) {
      const term = String(key).toLowerCase().trim().slice(0, 40);
      if (term.length > 1) stats.searchTerms[term] = (stats.searchTerms[term] ?? 0) + 1;
    } else if (type === "visit") {
      stats.weeklyVisits = (stats.weeklyVisits ?? 0) + 1;
    }

    await redis.set(STATS_KEY, stats);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
