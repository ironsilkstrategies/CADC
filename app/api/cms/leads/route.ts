// app/api/cms/leads/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { LEADS_KEY, type IntakeLead } from "@/lib/cms";

const redis = Redis.fromEnv();
const ADMIN_KEY = process.env.ADMIN_PASSWORD ?? "";

function auth(req: NextRequest) {
  return req.headers.get("x-admin-key") === ADMIN_KEY;
}

// GET /api/cms/leads — admin only, returns all leads sorted newest first
export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const raw = await redis.get<IntakeLead[]>(LEADS_KEY);
  const leads = Array.isArray(raw) ? raw : [];
  return NextResponse.json(leads.sort((a, b) => b.ts.localeCompare(a.ts)));
}

// POST /api/cms/leads — public, submits a new intake lead
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const lead: IntakeLead = {
      id: crypto.randomUUID(),
      ts: new Date().toISOString(),
      program: body.program ?? "unknown",
      county: body.county,
      name: body.name,
      phone: body.phone,
      email: body.email,
      step: body.step ?? "contact",
      notes: body.notes,
      status: "new",
    };
    const raw = await redis.get<IntakeLead[]>(LEADS_KEY);
    const leads = Array.isArray(raw) ? raw : [];
    leads.unshift(lead);
    // Keep max 500 leads
    await redis.set(LEADS_KEY, leads.slice(0, 500));
    return NextResponse.json({ ok: true, id: lead.id });
  } catch {
    return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
  }
}

// PATCH /api/cms/leads — admin only, update lead status
export async function PATCH(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, status, notes } = await req.json();
  const raw = await redis.get<IntakeLead[]>(LEADS_KEY);
  const leads = Array.isArray(raw) ? raw : [];
  const idx = leads.findIndex(l => l.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  leads[idx] = { ...leads[idx], status, notes: notes ?? leads[idx].notes };
  await redis.set(LEADS_KEY, leads);
  return NextResponse.json({ ok: true });
}
