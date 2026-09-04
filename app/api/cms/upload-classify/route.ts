// app/api/cms/upload-classify/route.ts
// Takes an uploaded file's metadata + a text excerpt (for PDFs) or the image
// itself (for photos, base64), asks Gemini what it is and where it belongs
// on the CADC site, and returns a structured suggestion for admin to confirm.
//
// Requires env var: GEMINI_API_KEY (free tier — https://aistudio.google.com/apikey)

import { NextRequest, NextResponse } from "next/server";

const ADMIN_KEY = process.env.ADMIN_PASSWORD ?? "";
const GEMINI_KEY = process.env.GEMINI_API_KEY ?? "";
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

function auth(req: NextRequest) { return req.headers.get("x-admin-key") === ADMIN_KEY; }

const CADC_SECTIONS = `
Available CADC site sections a file can be routed to:
- "seniorMenu" — monthly senior nutrition meal calendars (PDF/text with daily meals)
- "marketSchedule" — Community Market stop schedules (dates, times, locations)
- "staff" — staff directory photos or updated contact info
- "boardDocs" — board meeting agendas, minutes, resolutions, policy council documents
- "documents" — compliance PDFs (Title VI, EEO, Affirmative Action, Annual Report, audits)
- "media-staff-photo" — a headshot/photo of a specific staff member
- "media-hero" — a general program/event photo for hero banners or galleries
- "media-head-start" — Head Start classroom, center, or activity photos
- "media-testimonial" — a client/family story or testimonial document
- "announcement" — urgent notice, closure, or alert content
- "unknown" — cannot confidently determine; needs human review
`;

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!GEMINI_KEY) {
    return NextResponse.json({
      contentType: "unknown", targetSection: "unknown", confidence: "low",
      reasoning: "AI classification is not configured (missing GEMINI_API_KEY). Please file this manually.",
    });
  }

  try {
    const body = await req.json();
    const { filename, mimeType, textExcerpt, imageBase64 } = body;

    const parts: any[] = [
      {
        text: `You are a filing assistant for a Community Action Agency (CADC) website in Southwest Oklahoma. A staff member just uploaded a file. Determine what it is and which site section it belongs in.

${CADC_SECTIONS}

Filename: ${filename}
MIME type: ${mimeType}
${textExcerpt ? `Text excerpt from the document:\n${textExcerpt.slice(0, 3000)}` : ""}

Respond ONLY with valid JSON in this exact shape, no markdown, no explanation outside the JSON:
{
  "contentType": "<short label, e.g. 'September senior menu' or 'Robin Harris staff photo'>",
  "targetSection": "<one of the section keys above>",
  "confidence": "high" | "medium" | "low",
  "reasoning": "<one sentence explaining why>",
  "extractedData": <if this is a menu or schedule PDF, extract structured data as {date: {...}} pairs you can confidently read; otherwise null>
}`
      }
    ];

    if (imageBase64) {
      parts.push({ inline_data: { mime_type: mimeType, data: imageBase64 } });
    }

    const geminiRes = await fetch(`${GEMINI_URL}?key=${GEMINI_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: { temperature: 0.1, responseMimeType: "application/json" },
      }),
    });

    if (!geminiRes.ok) {
      return NextResponse.json({
        contentType: "unknown", targetSection: "unknown", confidence: "low",
        reasoning: "AI classification service unavailable right now. Please file this manually.",
      });
    }

    const geminiJson = await geminiRes.json();
    const rawText = geminiJson?.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
    let parsed;
    try { parsed = JSON.parse(rawText); } catch { parsed = null; }

    if (!parsed || !parsed.targetSection) {
      return NextResponse.json({
        contentType: "unknown", targetSection: "unknown", confidence: "low",
        reasoning: "Could not confidently classify this file. Please file it manually.",
      });
    }

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({
      contentType: "unknown", targetSection: "unknown", confidence: "low",
      reasoning: "An error occurred during classification. Please file this manually.",
    });
  }
}
