// app/api/cms/stats/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { STATS_KEY, type SiteStats } from "@/lib/cms";

const redis = Redis.fromEnv();
const ADMIN_KEY = process.env.ADMIN_PASSWORD ?? "";

function emptyStats(): SiteStats {
  return {
    programTaps: {},
    countyViews: {},
    searchTerms: {},
    weeklyVisits: 0,
    lastReset: new Date().toISOString(),
  };
}

// GET /api/cms/stats — admin only
export async function GET(req: NextRequest) {
  if (req.headers.get("x-admin-key") !== ADMIN_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const raw = await redis.get<SiteStats>(STATS_KEY);
  return NextResponse.json(raw ?? emptyStats());
}

// POST /api/cms/stats — public, increments a counter
// body: { type: "program"|"county"|"search"|"visit", key?: string }
export async function POST(req: NextRequest) {
  try {
    const { type, key } = await req.json();
    const raw = await redis.get<SiteStats>(STATS_KEY);
    const stats: SiteStats = raw ? { ...emptyStats(), ...raw } : emptyStats();

    if (type === "program" && key) {
      stats.programTaps[key] = (stats.programTaps[key] ?? 0) + 1;
    } else if (type === "county" && key) {
      stats.countyViews[key] = (stats.countyViews[key] ?? 0) + 1;
    } else if (type === "search" && key) {
      const term = key.toLowerCase().trim().slice(0, 40);
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
