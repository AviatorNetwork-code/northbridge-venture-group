import { NextResponse } from "next/server";
import {
  AUTHORITY_OPTIONS,
  BUDGET_OPTIONS,
  BUSINESS_STAGE_OPTIONS,
  CURRENT_SYSTEMS_OPTIONS,
  EMPLOYEE_OPTIONS,
  MAIN_NEED_OPTIONS,
  PAIN_POINT_OPTIONS,
  TIMELINE_OPTIONS,
  evaluateAssessment,
  labelForValue,
  parseAssessmentPayload,
  validateAssessmentPayload,
  type AssessmentPayload,
} from "@/lib/digital-assessment";
import { storeAssessmentLead } from "@/lib/digital-assessment-leads";

function escapeSlackMrkdwn(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function formatList(values: string[], options: readonly { value: string; label: string }[]): string {
  if (values.length === 0) return "—";
  return values.map((value) => labelForValue(options, value)).join(", ");
}

function getSourcePath(request: Request): string | null {
  const referer = request.headers.get("referer");
  if (!referer) return "/digital/assessment";

  try {
    return new URL(referer).pathname;
  } catch {
    return referer;
  }
}

async function sendSlackNotification(
  payload: AssessmentPayload,
  score: number,
  category: string,
  recommendedSolution: string,
  suggestedCallOpening: string,
  leadId?: string | null
): Promise<boolean> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL?.trim();
  if (!webhookUrl) {
    console.warn(
      "[Digital assessment] SLACK_WEBHOOK_URL not configured; skipping Slack notification."
    );
    return false;
  }

  const timestamp = new Date().toISOString();

  const headerFields = [
    { type: "mrkdwn", text: `*Lead category:*\n${escapeSlackMrkdwn(category)}` },
    { type: "mrkdwn", text: `*Score:*\n${score}` },
    {
      type: "mrkdwn",
      text: `*Recommended solution:*\n${escapeSlackMrkdwn(recommendedSolution)}`,
    },
    { type: "mrkdwn", text: `*Submitted:*\n${timestamp}` },
  ];

  if (leadId) {
    headerFields.push({ type: "mrkdwn", text: `*Lead ID:*\n${escapeSlackMrkdwn(leadId)}` });
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      blocks: [
        {
          type: "header",
          text: { type: "plain_text", text: "New Digital Assessment Lead", emoji: true },
        },
        {
          type: "section",
          fields: headerFields,
        },
        {
          type: "section",
          fields: [
            { type: "mrkdwn", text: `*Name:*\n${escapeSlackMrkdwn(payload.name)}` },
            { type: "mrkdwn", text: `*Email:*\n${escapeSlackMrkdwn(payload.email)}` },
            { type: "mrkdwn", text: `*Phone:*\n${escapeSlackMrkdwn(payload.phone || "—")}` },
            { type: "mrkdwn", text: `*Company:*\n${escapeSlackMrkdwn(payload.company)}` },
          ],
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Industry:*\n${escapeSlackMrkdwn(payload.industry || "—")}`,
            },
            {
              type: "mrkdwn",
              text: `*Employees:*\n${escapeSlackMrkdwn(labelForValue(EMPLOYEE_OPTIONS, payload.employees))}`,
            },
            {
              type: "mrkdwn",
              text: `*Business stage:*\n${escapeSlackMrkdwn(labelForValue(BUSINESS_STAGE_OPTIONS, payload.businessStage))}`,
            },
            {
              type: "mrkdwn",
              text: `*Main need:*\n${escapeSlackMrkdwn(labelForValue(MAIN_NEED_OPTIONS, payload.mainNeed))}`,
            },
          ],
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Pain points:*\n${escapeSlackMrkdwn(formatList(payload.painPoints, PAIN_POINT_OPTIONS))}`,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Current systems:*\n${escapeSlackMrkdwn(formatList(payload.currentSystems, CURRENT_SYSTEMS_OPTIONS))}`,
          },
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Budget:*\n${escapeSlackMrkdwn(labelForValue(BUDGET_OPTIONS, payload.budget))}`,
            },
            {
              type: "mrkdwn",
              text: `*Timeline:*\n${escapeSlackMrkdwn(labelForValue(TIMELINE_OPTIONS, payload.timeline))}`,
            },
            {
              type: "mrkdwn",
              text: `*Authority:*\n${escapeSlackMrkdwn(labelForValue(AUTHORITY_OPTIONS, payload.authority))}`,
            },
          ],
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Suggested call opening:*\n${escapeSlackMrkdwn(suggestedCallOpening)}`,
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("[Digital assessment] Slack webhook error:", response.status, errorBody);
    return false;
  }

  return true;
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

    if (!stored) {
      console.warn("[Digital assessment] Lead was not persisted; continuing with success response.");
    }

    const slackSent = await sendSlackNotification(
      payload,
      decision.totalScore,
      decision.category,
      decision.recommendation,
      decision.suggestedCallOpening,
      stored?.id
    );

    if (!slackSent && process.env.SLACK_WEBHOOK_URL?.trim()) {
      console.error("[Digital assessment] Slack notification failed; submission still accepted.");
    }

    return NextResponse.json({
      success: true,
      score: decision.totalScore,
      leadCategory: decision.category,
      recommendedSolution: decision.recommendation,
      suggestedCallOpening: decision.suggestedCallOpening,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
