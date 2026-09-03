// app/api/cms/board-docs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { CMS_KEY, type SiteContent, type BoardDoc } from "@/lib/cms";

const redis = Redis.fromEnv();
const ADMIN_KEY = process.env.ADMIN_PASSWORD ?? "";

function auth(req: NextRequest) {
  return req.headers.get("x-admin-key") === ADMIN_KEY;
}

// POST — admin: add a board document
export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const doc: BoardDoc = {
    id: crypto.randomUUID(),
    title: body.title ?? "Untitled",
    category: body.category ?? "other",
    date: body.date ?? new Date().toISOString().slice(0, 10),
    href: body.href ?? "",
    uploadedBy: body.uploadedBy ?? "admin",
    uploadedAt: new Date().toISOString(),
  };
  const content = await redis.get<SiteContent>(CMS_KEY);
  const current = (content?.boardDocs ?? []) as BoardDoc[];
  current.unshift(doc);
  await redis.set(CMS_KEY, { ...content, boardDocs: current, updatedAt: new Date().toISOString(), updatedBy: doc.uploadedBy });
  return NextResponse.json({ ok: true, id: doc.id });
}

// DELETE — admin: remove a board document
export async function DELETE(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  const content = await redis.get<SiteContent>(CMS_KEY);
  const current = (content?.boardDocs ?? []) as BoardDoc[];
  await redis.set(CMS_KEY, { ...content, boardDocs: current.filter(d => d.id !== id), updatedAt: new Date().toISOString(), updatedBy: "admin" });
  return NextResponse.json({ ok: true });
}
