import { NextResponse } from "next/server";
import { fetchAndAnalyzeWebsite, normalizeWebsiteUrl } from "@/lib/cat/website-analysis";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { url?: string };
    const normalized = body.url ? normalizeWebsiteUrl(body.url) : null;

    if (!normalized) {
      return NextResponse.json({ error: "A valid public website URL is required." }, { status: 400 });
    }

    const analysis = await fetchAndAnalyzeWebsite(normalized);
    return NextResponse.json(analysis);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Website analysis failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
