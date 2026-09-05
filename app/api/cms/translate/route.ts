// app/api/cms/translate/route.ts
// Translates dynamic CMS content to Spanish via Gemini 1.5 Flash.
// Called automatically after admin saves content (fire-and-forget).
// Cached result stored in KV as cadc:content:es — served instantly to visitors.

import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { CMS_KEY_ES, DEFAULT_SITE_TEXT, DEFAULT_PROGRAM_TAGLINES, type SiteContent } from "@/lib/cms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const redis = Redis.fromEnv();

// Only these fields need Gemini translation.
// Phones, emails, URLs, feature flags, dates, KV keys stay as-is.
interface TranslatableSlice {
  announcement: { text: string };
  seniorMenu: { note: string; meals: Record<string, { headline: string; full: string[] }> };
  marketSchedule: { note: string; transportation: string; stops: Record<string, { time: string; location: string }[]> };
  staff: { name: string; title: string }[];
  documents: { label: string }[];
  siteText: {
    footerTagline: string;
    surveyBannerText: string;
  };
  programTaglines: Record<string, string>;
}

function extractTranslatableSlice(content: SiteContent): TranslatableSlice {
  const st = { ...DEFAULT_SITE_TEXT, ...(content.siteText ?? {}) };
  const pt = { ...DEFAULT_PROGRAM_TAGLINES, ...(content.programTaglines ?? {}) };
  return {
    announcement: { text: content.announcement.text },
    seniorMenu: { note: content.seniorMenu.note, meals: content.seniorMenu.meals },
    marketSchedule: {
      note: content.marketSchedule.note,
      transportation: content.marketSchedule.transportation,
      stops: content.marketSchedule.stops,
    },
    staff: content.staff.map(s => ({ name: s.name, title: s.title })),
    documents: content.documents.map(d => ({ label: d.label })),
    siteText: {
      footerTagline: st.footerTagline,
      surveyBannerText: st.surveyBannerText,
    },
    programTaglines: pt,
  };
}

const SYSTEM_PROMPT = `You are a professional Spanish translator for a community services organization in rural Oklahoma.

RULES — follow exactly:
1. Return ONLY valid JSON matching the exact structure you receive. No markdown, no code fences, no explanation.
2. Translate all string VALUES to natural, plain Spanish. Keep all JSON KEYS in English.
3. DO NOT translate proper nouns: CADC, Head Start, Early Head Start, Advantage, VITA, ChildPlus, Red River, Red River Transit, Red River Transportation.
4. DO NOT translate Oklahoma town/city names: Frederick, Hobart, Lawton, Cache, Ryan, Ringling, Temple, Erick, Sayre, Hammon, Grandfield, Burns Flat, Cordell, Sentinel, Corn, Canute, Lone Wolf, Geronimo, Chattanooga, Tipton, Randlett, Fletcher, Sterling, Mt. View.
5. DO NOT translate phone numbers, email addresses, URLs, or file paths.
6. DO NOT translate time ranges (e.g. "9:30–11:30") or date strings (e.g. "2026-09-01").
7. Keep food item translations natural — these are senior meal names, not technical terms.
8. Staff titles should be translated formally (e.g. "Executive Director" → "Directora/Director Ejecutiva/o").
9. Program taglines: keep them concise — match the length and style of the original.
10. The audience is Spanish-speaking residents of rural Southwest Oklahoma. Use clear, accessible language — not formal academic Spanish.`;

export async function POST(req: Request) {
  const adminKey = req.headers.get("x-admin-key");
  if (!adminKey || adminKey !== process.env.ADMIN_PASSWORD) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ ok: false, error: "GEMINI_API_KEY not set" }, { status: 500 });
  }

  let content: SiteContent;
  try {
    const body = await req.json();
    content = body.content as SiteContent;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  const slice = extractTranslatableSlice(content);

  let translated: TranslatableSlice;
  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ parts: [{ text: JSON.stringify(slice, null, 2) }] }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 8192,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!geminiRes.ok) {
      const err = await geminiRes.text();
      console.error("[translate] Gemini error:", err);
      return NextResponse.json({ ok: false, error: "Gemini API error", detail: err }, { status: 502 });
    }

    const geminiData = await geminiRes.json();
    const rawText: string = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const clean = rawText.replace(/```json|```/g, "").trim();
    translated = JSON.parse(clean) as TranslatableSlice;
  } catch (err) {
    console.error("[translate] Parse error:", err);
    return NextResponse.json({ ok: false, error: "Failed to parse Gemini response" }, { status: 502 });
  }

  // Merge translated slice back into full content — everything else stays English
  const esContent: SiteContent = {
    ...content,
    announcement: {
      ...content.announcement,
      text: translated.announcement.text,
    },
    seniorMenu: {
      ...content.seniorMenu,
      note: translated.seniorMenu.note,
      meals: translated.seniorMenu.meals,
    },
    marketSchedule: {
      ...content.marketSchedule,
      note: translated.marketSchedule.note,
      transportation: translated.marketSchedule.transportation,
      stops: translated.marketSchedule.stops,
    },
    staff: content.staff.map((s, i) => ({
      ...s,
      title: translated.staff[i]?.title ?? s.title,
    })),
    documents: content.documents.map((d, i) => ({
      ...d,
      label: translated.documents[i]?.label ?? d.label,
    })),
    siteText: {
      ...DEFAULT_SITE_TEXT,
      ...(content.siteText ?? {}),
      // Translate only the two visible text fields — URLs, phone, address stay English
      footerTagline: translated.siteText?.footerTagline ?? content.siteText?.footerTagline ?? DEFAULT_SITE_TEXT.footerTagline,
      surveyBannerText: translated.siteText?.surveyBannerText ?? content.siteText?.surveyBannerText ?? DEFAULT_SITE_TEXT.surveyBannerText,
    },
    programTaglines: {
      ...DEFAULT_PROGRAM_TAGLINES,
      ...(content.programTaglines ?? {}),
      ...translated.programTaglines,
    },
  };

  try {
    await redis.set(CMS_KEY_ES, esContent);
  } catch (err) {
    console.error("[translate] KV write error:", err);
    return NextResponse.json({ ok: false, error: "KV write failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, translatedAt: new Date().toISOString() });
}
