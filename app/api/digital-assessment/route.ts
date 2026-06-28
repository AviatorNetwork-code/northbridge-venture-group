import { NextResponse } from "next/server";
import {
  evaluateAssessment,
  parseAssessmentPayload,
  validateAssessmentPayload,
} from "@/lib/digital-assessment";
import { storeAssessmentLead } from "@/lib/digital-assessment-leads";
import {
  dispatchAssessmentNotifications,
  logAssessmentSubmissionOutcome,
} from "@/lib/digital-assessment-notifications";

function getSourcePath(request: Request): string | null {
  const referer = request.headers.get("referer");
  if (!referer) return "/digital/assessment";

  try {
    return new URL(referer).pathname;
  } catch {
    return referer;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = parseAssessmentPayload(body);

    if (!payload) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const validationError = validateAssessmentPayload(payload);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const decision = evaluateAssessment(payload);
    const sourcePath = getSourcePath(request);

    const stored = await storeAssessmentLead({
      payload,
      decision,
      sourcePath,
    });

    const notifications = await dispatchAssessmentNotifications({
      payload,
      decision,
      leadId: stored?.id ?? null,
      sourcePath,
    });

    logAssessmentSubmissionOutcome({
      leadId: stored?.id ?? null,
      persisted: Boolean(stored),
      notifications,
    });

    return NextResponse.json({
      success: true,
      score: decision.totalScore,
      leadCategory: decision.category,
      recommendedSolution: decision.recommendation,
      suggestedCallOpening: decision.suggestedCallOpening,
    });
  } catch (error) {
    console.error("[Digital assessment] Unhandled submission error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
