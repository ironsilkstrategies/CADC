import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { CMS_KEY, DEFAULT_CONTENT, type SiteContent } from "@/lib/cms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const redis = Redis.fromEnv();

// Public read
export async function GET() {
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

// Protected write
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
  return NextResponse.json({ ok: true, updatedAt: next.updatedAt });
}

// Login check
export async function HEAD(req: NextRequest) {
  const key = req.headers.get("x-admin-key");
  const ok = !!process.env.ADMIN_PASSWORD && key === process.env.ADMIN_PASSWORD;
  return new NextResponse(null, { status: ok ? 204 : 401 });
}
