// app/api/cms/bookings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { BOOKINGS_KEY, type TransitBooking } from "@/lib/cms";

const redis = Redis.fromEnv();
const ADMIN_KEY = process.env.ADMIN_PASSWORD ?? "";

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
function getIP(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? req.headers.get("x-real-ip") ?? "unknown";
}
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) { rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 }); return true; }
  if (entry.count >= 3) return false; // max 3 booking requests per minute
  entry.count++;
  return true;
}

function auth(req: NextRequest) { return req.headers.get("x-admin-key") === ADMIN_KEY; }
function sanitize(s: unknown, max = 200): string { if (typeof s !== "string") return ""; return s.trim().slice(0, max); }

function validateBooking(body: Record<string, unknown>): string | null {
  if (body._gotcha) return "bot";
  if (!sanitize(body.name, 100)) return "Name required";
  if (!sanitize(body.phone, 20)) return "Phone required";
  if (!sanitize(body.pickupAddress, 200)) return "Pickup address required";
  if (!sanitize(body.destination, 200)) return "Destination required";
  if (!sanitize(body.requestedDate, 20)) return "Date required";
  // Phone must have at least 7 digits
  const digits = String(body.phone ?? "").replace(/\D/g, "");
  if (digits.length < 7) return "Invalid phone number";
  return null;
}

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const raw = await redis.get<TransitBooking[]>(BOOKINGS_KEY);
  const bookings = Array.isArray(raw) ? raw : [];
  return NextResponse.json(bookings.sort((a, b) => b.ts.localeCompare(a.ts)));
}

export async function POST(req: NextRequest) {
  try {
    const ip = getIP(req);
    if (!checkRateLimit(ip)) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    const body = await req.json();
    const err = validateBooking(body);
    if (err === "bot") return NextResponse.json({ ok: true });
    if (err) return NextResponse.json({ error: err }, { status: 400 });

    const booking: TransitBooking = {
      id: crypto.randomUUID(),
      ts: new Date().toISOString(),
      name: sanitize(body.name, 100),
      phone: sanitize(body.phone, 20),
      pickupAddress: sanitize(body.pickupAddress, 200),
      destination: sanitize(body.destination, 200),
      requestedDate: sanitize(body.requestedDate, 20),
      requestedTime: sanitize(body.requestedTime, 20),
      accessibility: sanitize(body.accessibility, 50) || "none",
      status: "new",
      notes: sanitize(body.notes, 500) || undefined,
    };

    const raw = await redis.get<TransitBooking[]>(BOOKINGS_KEY);
    const bookings = Array.isArray(raw) ? raw : [];
    bookings.unshift(booking);
    await redis.set(BOOKINGS_KEY, bookings.slice(0, 1000));
    return NextResponse.json({ ok: true, id: booking.id });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, status, notes } = await req.json();
  const raw = await redis.get<TransitBooking[]>(BOOKINGS_KEY);
  const bookings = Array.isArray(raw) ? raw : [];
  const idx = bookings.findIndex(b => b.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  bookings[idx] = { ...bookings[idx], status, notes: notes ?? bookings[idx].notes };
  await redis.set(BOOKINGS_KEY, bookings);
  return NextResponse.json({ ok: true });
}
