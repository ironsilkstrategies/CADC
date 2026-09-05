// app/api/cms/grant-impact/route.ts
// Generates a grant-ready HTML impact report from all site data in KV.
// Returns an HTML string the admin downloads and prints to PDF.
// Auth required — admin only.

import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import {
  CMS_KEY, STATS_KEY, LEADS_KEY, VOLUNTEER_KEY, BOOKINGS_KEY,
  type SiteContent, type SiteStats, type IntakeLead,
  type VolunteerEntry, type TransitBooking,
} from "@/lib/cms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const redis = Redis.fromEnv();
const ADMIN_KEY = process.env.ADMIN_PASSWORD ?? "";

function auth(req: NextRequest) {
  return req.headers.get("x-admin-key") === ADMIN_KEY;
}

const HEAD_START_MATCH_GOAL = 1_075_417;
const VOL_HOURLY_RATE = 29;

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Pull all data in parallel
  const [rawContent, rawStats, rawLeads, rawVolunteer, rawBookings] = await Promise.all([
    redis.get<SiteContent>(CMS_KEY),
    redis.get<SiteStats>(STATS_KEY),
    redis.get<IntakeLead[]>(LEADS_KEY),
    redis.get<VolunteerEntry[]>(VOLUNTEER_KEY),
    redis.get<TransitBooking[]>(BOOKINGS_KEY),
  ]);

  const content = rawContent ?? null;
  const stats = rawStats ?? { programTaps: {}, countyViews: {}, searchTerms: {}, weeklyVisits: 0, lastReset: "" };
  const leads: IntakeLead[] = Array.isArray(rawLeads) ? rawLeads : [];
  const volunteer: VolunteerEntry[] = Array.isArray(rawVolunteer) ? rawVolunteer : [];
  const bookings: TransitBooking[] = Array.isArray(rawBookings) ? rawBookings : [];

  // ── Computed metrics ──────────────────────────────────────────────────────
  const totalTaps = Object.values(stats.programTaps).reduce((a, b) => a + b, 0);
  const topPrograms = Object.entries(stats.programTaps).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const topCounties = Object.entries(stats.countyViews).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const totalCountyViews = Object.values(stats.countyViews).reduce((a, b) => a + b, 0);
  const uniqueCounties = Object.keys(stats.countyViews).length;

  const newLeads = leads.filter(l => l.status === "new").length;
  const contactedLeads = leads.filter(l => l.status === "contacted").length;
  const enrolledLeads = leads.filter(l => l.status === "enrolled").length;
  const enrollmentRate = leads.length > 0 ? Math.round((enrolledLeads / leads.length) * 100) : 0;

  const totalVolHours = volunteer.reduce((s, e) => s + e.hours, 0);
  const volunteerDollarValue = volunteer.filter(e => e.type === "volunteer").reduce((s, e) => s + e.hours * VOL_HOURLY_RATE, 0)
    + volunteer.filter(e => e.type !== "volunteer").reduce((s, e) => s + e.hours, 0);
  const matchPct = Math.min(100, (volunteerDollarValue / HEAD_START_MATCH_GOAL) * 100);

  const confirmedRides = bookings.filter(b => b.status === "confirmed" || b.status === "completed").length;
  const completedRides = bookings.filter(b => b.status === "completed").length;

  const byProgram = leads.reduce((acc, l) => { acc[l.program] = (acc[l.program] ?? 0) + 1; return acc; }, {} as Record<string, number>);
  const topLeadPrograms = Object.entries(byProgram).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const reportDate = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const reportMonth = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

  // ── HTML report ───────────────────────────────────────────────────────────
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CADC Digital Impact Report — ${reportMonth}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #111827; background: white; font-size: 13px; line-height: 1.5; }

  .page { max-width: 900px; margin: 0 auto; padding: 40px 48px; }

  /* Header */
  .header { display: flex; align-items: flex-start; justify-content: space-between; border-bottom: 3px solid #0101FF; padding-bottom: 20px; margin-bottom: 28px; }
  .header-left h1 { font-size: 22px; font-weight: 800; color: #0101FF; margin-bottom: 4px; }
  .header-left p { font-size: 12px; color: #6b7280; }
  .header-right { text-align: right; }
  .header-right .org { font-size: 14px; font-weight: 800; color: #111827; }
  .header-right .date { font-size: 11px; color: #6b7280; margin-top: 2px; }
  .maroon-bar { height: 4px; background: #CC0000; border-radius: 2px; margin-bottom: 28px; }

  /* Section headers */
  .section-label { font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.16em; color: #CC0000; margin-bottom: 10px; }
  .section-title { font-size: 15px; font-weight: 800; color: #111827; margin-bottom: 4px; }
  .section-sub { font-size: 11px; color: #6b7280; margin-bottom: 16px; }

  /* KPI grid */
  .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 28px; }
  .kpi-card { border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px 12px; text-align: center; }
  .kpi-value { font-size: 26px; font-weight: 900; line-height: 1; margin-bottom: 4px; }
  .kpi-label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #6b7280; }
  .kpi-sub { font-size: 10px; color: #9ca3af; margin-top: 3px; }

  /* Bar charts */
  .bar-section { margin-bottom: 28px; }
  .bar-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
  .bar-label { font-size: 11px; font-weight: 600; width: 160px; flex-shrink: 0; text-transform: capitalize; color: #374151; }
  .bar-track { flex: 1; height: 10px; background: #f3f4f6; border-radius: 5px; overflow: hidden; }
  .bar-fill { height: 100%; border-radius: 5px; }
  .bar-count { font-size: 11px; font-weight: 800; width: 36px; text-align: right; flex-shrink: 0; }

  /* Two-col layout */
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 28px; }
  .col-card { border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; }
  .col-card-title { font-size: 11px; font-weight: 800; color: #0101FF; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.06em; }

  /* Progress bar */
  .progress-section { margin-bottom: 28px; }
  .progress-track { height: 16px; background: #e5e7eb; border-radius: 8px; overflow: hidden; margin: 8px 0; }
  .progress-fill { height: 100%; border-radius: 8px; }
  .progress-meta { display: flex; justify-content: space-between; font-size: 11px; color: #6b7280; }

  /* Narrative block */
  .narrative { background: #F0F0FF; border-left: 4px solid #0101FF; border-radius: 0 10px 10px 0; padding: 16px 20px; margin-bottom: 28px; font-size: 12px; line-height: 1.8; color: #374151; font-style: italic; }

  /* Lead status row */
  .status-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 16px; }
  .status-chip { border-radius: 8px; padding: 10px 8px; text-align: center; }
  .status-chip .val { font-size: 20px; font-weight: 900; }
  .status-chip .lbl { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 2px; }

  /* Footer */
  .footer { border-top: 1px solid #e5e7eb; padding-top: 16px; margin-top: 32px; display: flex; justify-content: space-between; font-size: 10px; color: #9ca3af; }

  /* Print */
  @media print {
    body { font-size: 12px; }
    .page { padding: 20px 28px; }
    .kpi-value { font-size: 22px; }
    @page { margin: 0.6in; size: letter; }
  }
</style>
</head>
<body>
<div class="page">

  <!-- Header -->
  <div class="header">
    <div class="header-left">
      <h1>Digital Impact Report</h1>
      <p>Community Action Development Corporation · cadcok.org</p>
    </div>
    <div class="header-right">
      <div class="org">CADC — Southwest Oklahoma</div>
      <div class="date">Generated ${reportDate}</div>
    </div>
  </div>
  <div class="maroon-bar"></div>

  <!-- Site Engagement KPIs -->
  <div class="section-label">Site Engagement</div>
  <div class="section-title">Website Activity Overview</div>
  <div class="section-sub">Traffic, program interest, and geographic reach tracked via cadcok.org</div>
  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="kpi-value" style="color:#0101FF">${stats.weeklyVisits.toLocaleString()}</div>
      <div class="kpi-label">Site Visits</div>
      <div class="kpi-sub">current period</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-value" style="color:#0101FF">${totalTaps.toLocaleString()}</div>
      <div class="kpi-label">Program Taps</div>
      <div class="kpi-sub">all programs</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-value" style="color:#CC0000">${totalCountyViews.toLocaleString()}</div>
      <div class="kpi-label">County Views</div>
      <div class="kpi-sub">${uniqueCounties} counties active</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-value" style="color:#059669">${leads.length.toLocaleString()}</div>
      <div class="kpi-label">Intake Inquiries</div>
      <div class="kpi-sub">${enrolledLeads} enrolled</div>
    </div>
  </div>

  <!-- Program breakdown -->
  ${topPrograms.length > 0 ? `
  <div class="bar-section">
    <div class="section-label">Program Interest</div>
    <div class="section-title">Top Programs by Engagement</div>
    <div class="section-sub">Programs ranked by visitor interaction — reflects community need and awareness</div>
    ${topPrograms.map(([slug, count]) => {
      const pct = totalTaps > 0 ? Math.round((count / totalTaps) * 100) : 0;
      const maxCount = topPrograms[0][1];
      const barPct = Math.round((count / maxCount) * 100);
      return `<div class="bar-row">
        <div class="bar-label">${slug.replace(/-/g, " ")}</div>
        <div class="bar-track"><div class="bar-fill" style="width:${barPct}%;background:#0101FF"></div></div>
        <div class="bar-count" style="color:#0101FF">${count}</div>
      </div>`;
    }).join("")}
  </div>
  ` : ""}

  <!-- Two column: Counties + Lead programs -->
  <div class="two-col">
    ${topCounties.length > 0 ? `
    <div class="col-card">
      <div class="col-card-title">Top Counties by Service Interest</div>
      ${topCounties.map(([county, count]) => {
        const maxC = topCounties[0][1];
        const barPct = Math.round((count / maxC) * 100);
        return `<div class="bar-row" style="margin-bottom:6px">
          <div class="bar-label" style="width:110px;font-size:10px">${county.replace(/-/g, " ")} Co.</div>
          <div class="bar-track" style="height:8px"><div class="bar-fill" style="width:${barPct}%;background:#CC0000"></div></div>
          <div class="bar-count" style="font-size:10px;color:#CC0000">${count}</div>
        </div>`;
      }).join("")}
    </div>
    ` : "<div></div>"}

    ${topLeadPrograms.length > 0 ? `
    <div class="col-card">
      <div class="col-card-title">Inquiries by Program</div>
      ${topLeadPrograms.map(([prog, count]) => `
        <div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #f3f4f6;font-size:11px">
          <span style="text-transform:capitalize;font-weight:600;color:#374151">${prog.replace(/-/g, " ")}</span>
          <span style="font-weight:800;color:#0101FF">${count} lead${count !== 1 ? "s" : ""}</span>
        </div>
      `).join("")}
    </div>
    ` : "<div></div>"}
  </div>

  <!-- Intake leads -->
  <div class="section-label">Client Intake</div>
  <div class="section-title">Program Inquiry & Enrollment Tracking</div>
  <div class="section-sub">Residents who submitted interest forms through cadcok.org — documented outreach touchpoints</div>
  <div class="status-grid" style="margin-bottom:20px">
    <div class="status-chip" style="background:#FFF8E7">
      <div class="val" style="color:#D97706">${newLeads}</div>
      <div class="lbl" style="color:#D97706">New</div>
    </div>
    <div class="status-chip" style="background:#E4E4FF">
      <div class="val" style="color:#0101FF">${contactedLeads}</div>
      <div class="lbl" style="color:#0101FF">Contacted</div>
    </div>
    <div class="status-chip" style="background:#F0FFF4">
      <div class="val" style="color:#059669">${enrolledLeads}</div>
      <div class="lbl" style="color:#059669">Enrolled</div>
    </div>
    <div class="status-chip" style="background:#F9FAFB">
      <div class="val" style="color:#111827">${enrollmentRate}%</div>
      <div class="lbl" style="color:#6b7280">Enroll Rate</div>
    </div>
  </div>

  <!-- Volunteer hours -->
  <div class="section-label">Head Start — In-Kind Match</div>
  <div class="section-title">Volunteer Hours & Federal Match Progress</div>
  <div class="section-sub">FY2026 goal: $1,075,417 · Federal rate: $${VOL_HOURLY_RATE}/hr</div>
  <div class="kpi-grid" style="margin-bottom:14px">
    <div class="kpi-card">
      <div class="kpi-value" style="color:#111827">${totalVolHours.toFixed(1)}</div>
      <div class="kpi-label">Total Hours</div>
      <div class="kpi-sub">logged</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-value" style="color:#059669">$${Math.round(volunteerDollarValue / 1000)}K</div>
      <div class="kpi-label">Match Value</div>
      <div class="kpi-sub">est. federal value</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-value" style="color:${matchPct >= 80 ? "#059669" : matchPct >= 50 ? "#D97706" : "#CC0000"}">${matchPct.toFixed(1)}%</div>
      <div class="kpi-label">of Goal</div>
      <div class="kpi-sub">$1,075,417 target</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-value" style="color:#0101FF">${volunteer.length}</div>
      <div class="kpi-label">Log Entries</div>
      <div class="kpi-sub">documented</div>
    </div>
  </div>
  <div class="progress-section">
    <div class="progress-track">
      <div class="progress-fill" style="width:${matchPct}%;background:${matchPct >= 80 ? "#059669" : matchPct >= 50 ? "#D97706" : "#CC0000"}"></div>
    </div>
    <div class="progress-meta">
      <span>$${Math.round(volunteerDollarValue).toLocaleString()} documented</span>
      <span>$1,075,417 goal</span>
    </div>
  </div>

  <!-- Transit -->
  ${bookings.length > 0 ? `
  <div class="section-label">Red River Transportation</div>
  <div class="section-title">Online Ride Request Activity</div>
  <div class="section-sub">Requests submitted through cadcok.org — part of documented ridership record</div>
  <div class="kpi-grid" style="margin-bottom:28px">
    <div class="kpi-card">
      <div class="kpi-value" style="color:#0101FF">${bookings.length}</div>
      <div class="kpi-label">Total Requests</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-value" style="color:#059669">${confirmedRides}</div>
      <div class="kpi-label">Confirmed</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-value" style="color:#059669">${completedRides}</div>
      <div class="kpi-label">Completed</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-value" style="color:#D97706">${bookings.filter(b => b.status === "new").length}</div>
      <div class="kpi-label">Pending</div>
    </div>
  </div>
  ` : ""}

  <!-- Grant narrative -->
  <div class="section-label">Grant Narrative</div>
  <div class="section-title">Ready-to-Use Language for Grant Reports</div>
  <div class="narrative">
    "In the current reporting period, the Community Action Development Corporation's digital platform (cadcok.org)
    recorded ${stats.weeklyVisits.toLocaleString()} community site visits${totalTaps > 0 ? `, with ${totalTaps.toLocaleString()} program engagement interactions` : ""}${topPrograms.length > 0 ? `, with ${topPrograms[0][0].replace(/-/g, " ")} generating the highest community interest` : ""}.
    ${uniqueCounties > 0 ? `Community members from ${uniqueCounties} counties across Southwest Oklahoma actively accessed CADC service information, reflecting broad regional reach and demonstrated community need.` : ""}
    ${leads.length > 0 ? `A total of ${leads.length} residents submitted program interest forms through the platform; of these, ${contactedLeads} received documented follow-up contact and ${enrolledLeads} were successfully enrolled in CADC services, representing a ${enrollmentRate}% enrollment conversion rate.` : ""}
    ${totalVolHours > 0 ? `Head Start in-kind match documentation recorded ${totalVolHours.toFixed(1)} volunteer and in-kind hours, representing an estimated federal match value of $${Math.round(volunteerDollarValue).toLocaleString()} — ${matchPct.toFixed(1)}% of the FY2026 match goal of $1,075,417.` : ""}
    ${bookings.length > 0 ? `Red River Transportation received ${bookings.length} online ride requests through the platform, of which ${confirmedRides} were confirmed and ${completedRides} completed, contributing to the program's documented ridership record.` : ""}"
  </div>

  <!-- Footer -->
  <div class="footer">
    <span>Community Action Development Corporation · cadcok.org · Frederick, Oklahoma</span>
    <span>Generated ${reportDate} · Confidential — for grant reporting use only</span>
  </div>

</div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `attachment; filename="cadc-impact-report-${new Date().toISOString().slice(0, 7)}.html"`,
      "Cache-Control": "no-store",
    },
  });
}
