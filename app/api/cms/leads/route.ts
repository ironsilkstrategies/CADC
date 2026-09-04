// app/api/cms/leads/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { LEADS_KEY, type IntakeLead } from "@/lib/cms";

const redis = Redis.fromEnv();
const ADMIN_KEY = process.env.ADMIN_PASSWORD ?? "";

// ── Rate limiting (in-memory, resets on cold start) ───────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;       // max submissions
const RATE_WINDOW = 60_000; // per 60 seconds per IP

function getIP(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim()
    ?? req.headers.get("x-real-ip")
    ?? "unknown";
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

function auth(req: NextRequest) {
  return req.headers.get("x-admin-key") === ADMIN_KEY;
}

// ── Validation ────────────────────────────────────────────────────────────────
function sanitize(s: unknown, max = 200): string {
  if (typeof s !== "string") return "";
  return s.trim().slice(0, max);
}

function validateLead(body: Record<string, unknown>): string | null {
  // Honeypot — bots fill this, humans don't
  if (body._gotcha) return "bot";
  // At least program must be present
  if (!body.program) return "Missing program";
  // If name provided, phone or email must also be provided
  if (body.name && !body.phone && !body.email) return "Contact info required";
  // Phone basic format check
  if (body.phone && typeof body.phone === "string") {
    const digits = body.phone.replace(/\D/g, "");
    if (digits.length > 0 && digits.length < 7) return "Invalid phone number";
  }
  return null;
}

// GET /api/cms/leads — admin only
export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const raw = await redis.get<IntakeLead[]>(LEADS_KEY);
  const leads = Array.isArray(raw) ? raw : [];
  return NextResponse.json(leads.sort((a, b) => b.ts.localeCompare(a.ts)));
}

// POST /api/cms/leads — public with rate limiting + validation
export async function POST(req: NextRequest) {
  try {
    const ip = getIP(req);
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await req.json();
    const validationError = validateLead(body);
    if (validationError === "bot") return NextResponse.json({ ok: true }); // silent drop
    if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

    const lead: IntakeLead = {
      id: crypto.randomUUID(),
      ts: new Date().toISOString(),
      program: sanitize(body.program, 50),
      county: sanitize(body.county, 50) || undefined,
      name: sanitize(body.name, 100) || undefined,
      phone: sanitize(body.phone, 20) || undefined,
      email: sanitize(body.email, 100) || undefined,
      step: sanitize(body.step, 50) || "contact",
      notes: sanitize(body.notes, 500) || undefined,
      status: "new",
    };

    const raw = await redis.get<IntakeLead[]>(LEADS_KEY);
    const leads = Array.isArray(raw) ? raw : [];
    leads.unshift(lead);
    await redis.set(LEADS_KEY, leads.slice(0, 500));
    return NextResponse.json({ ok: true, id: lead.id });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}

// PATCH /api/cms/leads — admin only
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
