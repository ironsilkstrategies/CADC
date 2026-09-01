import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { CMS_KEY, DEFAULT_CONTENT, type SiteContent } from "@/lib/cms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Public read — the site calls this on load
export async function GET() {
  try {
    const data = await kv.get<SiteContent>(CMS_KEY);
    return NextResponse.json(data ?? DEFAULT_CONTENT, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json(DEFAULT_CONTENT, { headers: { "Cache-Control": "no-store" } });
  }
}

// Protected write — requires x-admin-key matching ADMIN_PASSWORD env var
export async function POST(req: NextRequest) {
  const key = req.headers.get("x-admin-key");
  if (!process.env.ADMIN_PASSWORD || key !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json()) as Partial<SiteContent> & { updatedBy?: string };
  const current = (await kv.get<SiteContent>(CMS_KEY)) ?? DEFAULT_CONTENT;
  const next: SiteContent = {
    ...current, ...body,
    updatedAt: new Date().toISOString(),
    updatedBy: body.updatedBy || "admin",
  };
  await kv.set(CMS_KEY, next);
  // keep last 20 versions for rollback
  await kv.lpush(`${CMS_KEY}:history`, JSON.stringify(next));
  await kv.ltrim(`${CMS_KEY}:history`, 0, 19);
  return NextResponse.json({ ok: true, updatedAt: next.updatedAt });
}

// Verify password only (login check)
export async function HEAD(req: NextRequest) {
  const key = req.headers.get("x-admin-key");
  const ok = !!process.env.ADMIN_PASSWORD && key === process.env.ADMIN_PASSWORD;
  return new NextResponse(null, { status: ok ? 204 : 401 });
}
