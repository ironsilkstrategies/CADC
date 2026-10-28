// app/api/cms/reset/route.ts
// Launch reset — clears test data (stats, leads, bookings, volunteer hours,
// scheduled items) so the live site starts clean. Site content is never touched.

import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { STATS_KEY, LEADS_KEY, BOOKINGS_KEY, VOLUNTEER_KEY, SCHEDULE_KEY } from "@/lib/cms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const redis = Redis.fromEnv();

const TARGETS: Record<string, string[]> = {
  stats: [STATS_KEY],
  leads: [LEADS_KEY],
  bookings: [BOOKINGS_KEY],
  volunteer: [VOLUNTEER_KEY],
  all: [STATS_KEY, LEADS_KEY, BOOKINGS_KEY, VOLUNTEER_KEY, SCHEDULE_KEY],
};

export async function DELETE(req: NextRequest) {
  const key = req.headers.get("x-admin-key");
  if (!process.env.ADMIN_PASSWORD || key !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: { target?: string; confirm?: string } = {};
  try { body = await req.json(); } catch { /* empty body */ }
  if (body.confirm !== "RESET_CONFIRMED") {
    return NextResponse.json({ error: "Confirmation required" }, { status: 400 });
  }
  const keys = TARGETS[body.target ?? ""];
  if (!keys) return NextResponse.json({ error: "Unknown target" }, { status: 400 });
  try {
    await redis.del(...keys);
    return NextResponse.json({ ok: true, cleared: body.target });
  } catch (err) {
    console.error("[cms reset] failed:", err);
    return NextResponse.json({ error: "Reset failed" }, { status: 500 });
  }
}
