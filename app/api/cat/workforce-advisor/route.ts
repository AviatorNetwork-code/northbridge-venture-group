import { NextResponse } from "next/server";
import {
  recommendWorkforce,
  type AdvisorInput,
  type WorkforceLevel,
} from "@/lib/workforceAdvisor";

// NEO light bridge endpoint. Stateless, no side effects: it maps a business
// description to a structured, trust-first workforce recommendation. This is
// the seam that will later proxy to a NEO-hosted workforce capability.
export const dynamic = "force-dynamic";

const VALID_PLANS: WorkforceLevel[] = [
  "Specialist",
  "Team",
  "Manager",
  "Regional Manager",
];

function sanitize(body: unknown): AdvisorInput {
  const b = (body ?? {}) as Record<string, unknown>;
  const input: AdvisorInput = {};
  if (typeof b.message === "string") input.message = b.message.slice(0, 1000);
  if (typeof b.industry === "string") input.industry = b.industry.slice(0, 200);
  if (typeof b.requestedPlan === "string" && VALID_PLANS.includes(b.requestedPlan as WorkforceLevel)) {
    input.requestedPlan = b.requestedPlan as WorkforceLevel;
  }
  if (typeof b.locations === "number" && Number.isFinite(b.locations)) {
    input.locations = Math.max(0, Math.min(1000, Math.floor(b.locations)));
  }
  if (typeof b.teamsInUse === "number" && Number.isFinite(b.teamsInUse)) {
    input.teamsInUse = Math.max(0, Math.min(1000, Math.floor(b.teamsInUse)));
  }
  if (b.volume === "low" || b.volume === "medium" || b.volume === "high") {
    input.volume = b.volume;
  }
  if (b.region === "CO" || b.region === "US") input.region = b.region;
  return input;
}

export async function POST(request: Request) {
  let body: unknown = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  const input = sanitize(body);
  const recommendation = recommendWorkforce(input);
  return NextResponse.json({ ok: true, input, recommendation });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "cat-workforce-advisor",
    description:
      "NEO light bridge — POST a business description to receive a structured workforce recommendation.",
    accepts: {
      message: "string",
      industry: "string",
      requestedPlan: VALID_PLANS,
      locations: "number",
      teamsInUse: "number",
      volume: ["low", "medium", "high"],
      region: ["CO", "US"],
    },
  });
}
