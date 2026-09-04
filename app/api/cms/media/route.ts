// app/api/cms/media/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { MEDIA_KEY, type MediaAsset } from "@/lib/cms";

const redis = Redis.fromEnv();
const ADMIN_KEY = process.env.ADMIN_PASSWORD ?? "";
function auth(req: NextRequest) { return req.headers.get("x-admin-key") === ADMIN_KEY; }

// GET — admin only, list all media (excludes archived unless ?includeArchived=1)
export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const includeArchived = req.nextUrl.searchParams.get("includeArchived") === "1";
  const raw = await redis.get<MediaAsset[]>(MEDIA_KEY);
  const all = Array.isArray(raw) ? raw : [];
  const filtered = includeArchived ? all : all.filter(m => !m.archivedAt);
  return NextResponse.json(filtered.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt)));
}

// POST — admin only, register a new media asset (after blob upload)
export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const asset: MediaAsset = {
      id: crypto.randomUUID(),
      url: body.url,
      filename: body.filename,
      mimeType: body.mimeType,
      sizeBytes: body.sizeBytes ?? 0,
      kind: body.kind ?? "other",
      tags: body.tags ?? [],
      altText: body.altText,
      uploadedBy: body.uploadedBy ?? "admin",
      uploadedAt: new Date().toISOString(),
      aiSuggestion: body.aiSuggestion,
    };
    const raw = await redis.get<MediaAsset[]>(MEDIA_KEY);
    const media = Array.isArray(raw) ? raw : [];
    media.unshift(asset);
    await redis.set(MEDIA_KEY, media.slice(0, 5000));
    return NextResponse.json({ ok: true, asset });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// PATCH — admin only, update tags/alt text, or archive/restore
export async function PATCH(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, ...updates } = await req.json();
  const raw = await redis.get<MediaAsset[]>(MEDIA_KEY);
  const media = Array.isArray(raw) ? raw : [];
  const idx = media.findIndex(m => m.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  media[idx] = { ...media[idx], ...updates };
  await redis.set(MEDIA_KEY, media);
  return NextResponse.json({ ok: true });
}

// DELETE — admin only, permanent delete (use PATCH with archivedAt for soft-delete)
export async function DELETE(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  const raw = await redis.get<MediaAsset[]>(MEDIA_KEY);
  const media = Array.isArray(raw) ? raw : [];
  await redis.set(MEDIA_KEY, media.filter(m => m.id !== id));
  return NextResponse.json({ ok: true });
}
