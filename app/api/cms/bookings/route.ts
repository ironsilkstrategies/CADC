// app/api/cms/bookings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { BOOKINGS_KEY, type TransitBooking } from "@/lib/cms";

const redis = Redis.fromEnv();
const ADMIN_KEY = process.env.ADMIN_PASSWORD ?? "";

function auth(req: NextRequest) {
  return req.headers.get("x-admin-key") === ADMIN_KEY;
}

// GET — admin only
export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const raw = await redis.get<TransitBooking[]>(BOOKINGS_KEY);
  const bookings = Array.isArray(raw) ? raw : [];
  return NextResponse.json(bookings.sort((a, b) => b.ts.localeCompare(a.ts)));
}

// POST — public, submit a booking request
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const booking: TransitBooking = {
      id: crypto.randomUUID(),
      ts: new Date().toISOString(),
      name: body.name ?? "",
      phone: body.phone ?? "",
      pickupAddress: body.pickupAddress ?? "",
      destination: body.destination ?? "",
      requestedDate: body.requestedDate ?? "",
      requestedTime: body.requestedTime ?? "",
      accessibility: body.accessibility ?? "none",
      status: "new",
      notes: body.notes,
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

// PATCH — admin updates booking status
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
