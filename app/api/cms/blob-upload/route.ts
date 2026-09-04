// app/api/cms/blob-upload/route.ts
// Stores an uploaded file (base64) to Vercel Blob and returns its public URL.
// Requires: npm install @vercel/blob, and BLOB_READ_WRITE_TOKEN env var
// (auto-provided when you enable Vercel Blob storage on the project).

import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

const ADMIN_KEY = process.env.ADMIN_PASSWORD ?? "";
function auth(req: NextRequest) { return req.headers.get("x-admin-key") === ADMIN_KEY; }

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { filename, mimeType, base64 } = await req.json();
    if (!filename || !base64) return NextResponse.json({ error: "Missing file data" }, { status: 400 });

    const buffer = Buffer.from(base64, "base64");
    const safeFilename = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;

    const blob = await put(safeFilename, buffer, {
      access: "public",
      contentType: mimeType,
    });

    return NextResponse.json({ ok: true, url: blob.url });
  } catch (err) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
