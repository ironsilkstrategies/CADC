// app/api/cms/archive/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { ARCHIVE_KEY, type ArchivedItem } from "@/lib/cms";

const redis = Redis.fromEnv();
const ADMIN_KEY = process.env.ADMIN_PASSWORD ?? "";
function auth(req: NextRequest) { return req.headers.get("x-admin-key") === ADMIN_KEY; }

// GET — admin only, list all archived items
export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const raw = await redis.get<ArchivedItem[]>(ARCHIVE_KEY);
  const items = Array.isArray(raw) ? raw : [];
  return NextResponse.json(items.sort((a, b) => b.archivedAt.localeCompare(a.archivedAt)));
}

// POST — admin only, archive an item (moves it here from its original section)
export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const item: ArchivedItem = {
      id: crypto.randomUUID(),
      section: body.section,
      originalId: body.originalId,
      label: body.label,
      payload: body.payload,
      archivedAt: new Date().toISOString(),
      archivedBy: body.archivedBy ?? "admin",
    };
    const raw = await redis.get<ArchivedItem[]>(ARCHIVE_KEY);
    const items = Array.isArray(raw) ? raw : [];
    items.unshift(item);
    await redis.set(ARCHIVE_KEY, items.slice(0, 2000));
    return NextResponse.json({ ok: true, id: item.id });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// DELETE — admin only, permanently remove an archived item (used for both
// "restore" — caller re-POSTs it to its original section then deletes here —
// and true permanent deletion)
export async function DELETE(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  const raw = await redis.get<ArchivedItem[]>(ARCHIVE_KEY);
  const items = Array.isArray(raw) ? raw : [];
  await redis.set(ARCHIVE_KEY, items.filter(i => i.id !== id));
  return NextResponse.json({ ok: true });
}
