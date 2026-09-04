// app/api/cms/content-blocks/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { CONTENT_BLOCKS_KEY, type ContentBlock } from "@/lib/cms";

const redis = Redis.fromEnv();
const ADMIN_KEY = process.env.ADMIN_PASSWORD ?? "";
function auth(req: NextRequest) { return req.headers.get("x-admin-key") === ADMIN_KEY; }

// GET — public (site needs to read these to render), admin gets full list
export async function GET(req: NextRequest) {
  const raw = await redis.get<ContentBlock[]>(CONTENT_BLOCKS_KEY);
  const blocks = Array.isArray(raw) ? raw : [];
  return NextResponse.json(blocks, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
  });
}

// PUT — admin only, upsert a content block (create or update by id)
export async function PUT(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const raw = await redis.get<ContentBlock[]>(CONTENT_BLOCKS_KEY);
    const blocks = Array.isArray(raw) ? raw : [];
    const idx = blocks.findIndex(b => b.id === body.id);
    const block: ContentBlock = {
      id: body.id,
      section: body.section,
      label: body.label,
      type: body.type ?? "text",
      value: body.value ?? "",
      updatedAt: new Date().toISOString(),
      updatedBy: body.updatedBy ?? "admin",
    };
    if (idx === -1) blocks.push(block); else blocks[idx] = block;
    await redis.set(CONTENT_BLOCKS_KEY, blocks);
    return NextResponse.json({ ok: true, block });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// DELETE — admin only
export async function DELETE(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  const raw = await redis.get<ContentBlock[]>(CONTENT_BLOCKS_KEY);
  const blocks = Array.isArray(raw) ? raw : [];
  await redis.set(CONTENT_BLOCKS_KEY, blocks.filter(b => b.id !== id));
  return NextResponse.json({ ok: true });
}
