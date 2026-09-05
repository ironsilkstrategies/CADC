// app/api/cms/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { CMS_KEY, CMS_KEY_ES, DEFAULT_CONTENT, type SiteContent } from "@/lib/cms";
import { publishDueItems } from "@/app/api/cms/schedule/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const redis = Redis.fromEnv();

// Public read — ?lang=es serves Gemini-translated Spanish version from KV.
// Also runs publishDueItems() on every GET so scheduled content goes live
// passively on site traffic — no cron required.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lang = searchParams.get("lang");

  // Run schedule checker on every public fetch (fast-path if nothing pending)
  try { await publishDueItems(); } catch { /* never block a public page load */ }

  if (lang === "es") {
    try {
      const esData = await redis.get<SiteContent>(CMS_KEY_ES);
      if (!esData) return NextResponse.json({ es: false }, { headers: { "Cache-Control": "no-store" } });
      return NextResponse.json(esData, { headers: { "Cache-Control": "no-store" } });
    } catch {
      return NextResponse.json({ es: false }, { headers: { "Cache-Control": "no-store" } });
    }
  }

  // English (default)
  try {
    const data = await redis.get<SiteContent>(CMS_KEY);
    return NextResponse.json(data ?? DEFAULT_CONTENT, {
      headers: { "Cache-Control": "no-store" }
    });
  } catch {
    return NextResponse.json(DEFAULT_CONTENT, {
      headers: { "Cache-Control": "no-store" }
    });
  }
}

// Protected write — saves English content, fires Gemini translation if spanishToggle on.
export async function POST(req: NextRequest) {
  const key = req.headers.get("x-admin-key");
  if (!process.env.ADMIN_PASSWORD || key !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as Partial<SiteContent> & { updatedBy?: string };
  const current = (await redis.get<SiteContent>(CMS_KEY)) ?? DEFAULT_CONTENT;
  const next: SiteContent = {
    ...current, ...body,
    updatedAt: new Date().toISOString(),
    updatedBy: body.updatedBy || "admin",
  };

  await redis.set(CMS_KEY, next);
  await redis.lpush(`${CMS_KEY}:history`, JSON.stringify(next));
  await redis.ltrim(`${CMS_KEY}:history`, 0, 19);

  // Fire-and-forget Spanish translation when spanishToggle is on
  if (next.features?.spanishToggle) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cadc-brnc.vercel.app";
    fetch(`${siteUrl}/api/cms/translate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": key! },
      body: JSON.stringify({ content: next }),
    }).catch(err => console.error("[cms POST] Translation trigger failed:", err));
  }

  return NextResponse.json({ ok: true, updatedAt: next.updatedAt });
}

// Login check
export async function HEAD(req: NextRequest) {
  const key = req.headers.get("x-admin-key");
  const ok = !!process.env.ADMIN_PASSWORD && key === process.env.ADMIN_PASSWORD;
  return new NextResponse(null, { status: ok ? 204 : 401 });
}
