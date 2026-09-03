// app/api/cms/grant-impact/route.ts
// Generates a quarterly impact summary as plain-text HTML → PDF-printable page
// Admin only. Returns HTML that the browser can print to PDF.
import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import {
  STATS_KEY, LEADS_KEY, VOLUNTEER_KEY, BOOKINGS_KEY,
  type SiteStats, type IntakeLead, type VolunteerEntry, type TransitBooking,
} from "@/lib/cms";

const redis = Redis.fromEnv();
const ADMIN_KEY = process.env.ADMIN_PASSWORD ?? "";

export async function GET(req: NextRequest) {
  if (req.headers.get("x-admin-key") !== ADMIN_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [stats, leadsRaw, volunteerRaw, bookingsRaw] = await Promise.all([
    redis.get<SiteStats>(STATS_KEY),
    redis.get<IntakeLead[]>(LEADS_KEY),
    redis.get<VolunteerEntry[]>(VOLUNTEER_KEY),
    redis.get<TransitBooking[]>(BOOKINGS_KEY),
  ]);

  const leads = Array.isArray(leadsRaw) ? leadsRaw : [];
  const volunteer = Array.isArray(volunteerRaw) ? volunteerRaw : [];
  const bookings = Array.isArray(bookingsRaw) ? bookingsRaw : [];

  const now = new Date();
  const quarter = Math.ceil((now.getMonth() + 1) / 3);
  const year = now.getFullYear();

  // Aggregate stats
  const totalVisits = stats?.weeklyVisits ?? 0;
  const topPrograms = Object.entries(stats?.programTaps ?? {}).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const topCounties = Object.entries(stats?.countyViews ?? {}).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const topSearches = Object.entries(stats?.searchTerms ?? {}).sort((a, b) => b[1] - a[1]).slice(0, 8);

  const leadsByStatus = leads.reduce((acc, l) => { acc[l.status] = (acc[l.status] ?? 0) + 1; return acc; }, {} as Record<string, number>);
  const leadsByProgram = leads.reduce((acc, l) => { acc[l.program] = (acc[l.program] ?? 0) + 1; return acc; }, {} as Record<string, number>);

  const totalVolHours = volunteer.reduce((s, e) => s + e.hours, 0);
  const volDollarValue = volunteer.filter(e => e.type === "volunteer").reduce((s, e) => s + e.hours * 29, 0);

  const bookingsByStatus = bookings.reduce((acc, b) => { acc[b.status] = (acc[b.status] ?? 0) + 1; return acc; }, {} as Record<string, number>);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>CADC Digital Impact Report — Q${quarter} ${year}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Georgia', serif; color: #111; background: white; padding: 40px; max-width: 800px; margin: 0 auto; }
  h1 { font-size: 24px; color: #CC0000; margin-bottom: 4px; }
  h2 { font-size: 16px; color: #0101FF; margin: 28px 0 10px; border-bottom: 2px solid #0101FF; padding-bottom: 4px; }
  h3 { font-size: 13px; color: #CC0000; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px; }
  .header { border-bottom: 3px solid #CC0000; padding-bottom: 16px; margin-bottom: 24px; }
  .subtitle { font-size: 13px; color: #6B7280; margin-top: 4px; }
  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 16px 0; }
  .stat-box { border: 1px solid #E5E7EB; border-radius: 8px; padding: 14px; text-align: center; }
  .stat-num { font-size: 28px; font-weight: bold; color: #0101FF; }
  .stat-label { font-size: 11px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 4px; }
  table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 13px; }
  th { background: #F3F4F6; text-align: left; padding: 8px 10px; font-size: 11px; text-transform: uppercase; color: #6B7280; }
  td { padding: 8px 10px; border-bottom: 1px solid #F3F4F6; }
  .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #E5E7EB; font-size: 11px; color: #9CA3AF; }
  @media print { body { padding: 20px; } }
</style>
</head>
<body>
<div class="header">
  <h1>CADC Digital Impact Report</h1>
  <div class="subtitle">Q${quarter} ${year} · Community Action Development Corporation · cadcok.org · Generated ${now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</div>
</div>

<h2>📊 Site Engagement</h2>
<div class="grid">
  <div class="stat-box"><div class="stat-num">${totalVisits.toLocaleString()}</div><div class="stat-label">Site Visits</div></div>
  <div class="stat-box"><div class="stat-num">${Object.values(stats?.programTaps ?? {}).reduce((a, b) => a + b, 0).toLocaleString()}</div><div class="stat-label">Program Taps</div></div>
  <div class="stat-box"><div class="stat-num">${Object.values(stats?.countyViews ?? {}).reduce((a, b) => a + b, 0).toLocaleString()}</div><div class="stat-label">County Views</div></div>
</div>

${topPrograms.length > 0 ? `
<h3>Top Programs by Engagement</h3>
<table><thead><tr><th>Program</th><th>Taps</th></tr></thead><tbody>
${topPrograms.map(([slug, count]) => `<tr><td style="text-transform:capitalize">${slug.replace(/-/g, " ")}</td><td>${count.toLocaleString()}</td></tr>`).join("")}
</tbody></table>` : ""}

${topCounties.length > 0 ? `
<h3>Top Counties by Interest</h3>
<table><thead><tr><th>County</th><th>Views</th></tr></thead><tbody>
${topCounties.map(([county, count]) => `<tr><td style="text-transform:capitalize">${county.replace(/-/g, " ")} County</td><td>${count.toLocaleString()}</td></tr>`).join("")}
</tbody></table>` : ""}

${topSearches.length > 0 ? `
<h3>What Residents Are Searching For</h3>
<table><thead><tr><th>Search Term</th><th>Searches</th></tr></thead><tbody>
${topSearches.map(([term, count]) => `<tr><td>${term}</td><td>${count.toLocaleString()}</td></tr>`).join("")}
</tbody></table>` : ""}

<h2>📥 Community Intake & Follow-Up</h2>
<div class="grid">
  <div class="stat-box"><div class="stat-num">${leads.length.toLocaleString()}</div><div class="stat-label">Total Inquiries</div></div>
  <div class="stat-box"><div class="stat-num">${(leadsByStatus["enrolled"] ?? 0).toLocaleString()}</div><div class="stat-label">Enrolled</div></div>
  <div class="stat-box"><div class="stat-num">${(leadsByStatus["contacted"] ?? 0).toLocaleString()}</div><div class="stat-label">Followed Up</div></div>
</div>

${Object.keys(leadsByProgram).length > 0 ? `
<h3>Inquiries by Program</h3>
<table><thead><tr><th>Program</th><th>Inquiries</th></tr></thead><tbody>
${Object.entries(leadsByProgram).sort((a,b) => b[1]-a[1]).map(([prog, count]) => `<tr><td style="text-transform:capitalize">${prog.replace(/-/g," ")}</td><td>${count}</td></tr>`).join("")}
</tbody></table>` : ""}

${bookings.length > 0 ? `
<h2>🚌 Transit Ride Requests</h2>
<div class="grid">
  <div class="stat-box"><div class="stat-num">${bookings.length}</div><div class="stat-label">Total Requests</div></div>
  <div class="stat-box"><div class="stat-num">${(bookingsByStatus["completed"] ?? 0)}</div><div class="stat-label">Completed</div></div>
  <div class="stat-box"><div class="stat-num">${(bookingsByStatus["confirmed"] ?? 0)}</div><div class="stat-label">Confirmed</div></div>
</div>` : ""}

${volunteer.length > 0 ? `
<h2>🤝 Volunteer & In-Kind Contributions</h2>
<div class="grid">
  <div class="stat-box"><div class="stat-num">${totalVolHours.toFixed(1)}</div><div class="stat-label">Total Hours</div></div>
  <div class="stat-box"><div class="stat-num">$${(volDollarValue/1000).toFixed(1)}K</div><div class="stat-label">Est. Value</div></div>
  <div class="stat-box"><div class="stat-num">${volunteer.length}</div><div class="stat-label">Log Entries</div></div>
</div>` : ""}

<div class="footer">
  Generated by IronSilk Strategies for Community Action Development Corporation · cadcok.org · ${now.toISOString()}
  <br>This report reflects digital engagement data captured through the cadcok.org platform. For questions contact ironsilkstrategies@gmail.com.
</div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `inline; filename="cadc-impact-q${quarter}-${year}.html"`,
    },
  });
}
