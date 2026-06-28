import type { AssessmentDecision, AssessmentPayload } from "@/lib/assessment";
import {
  AUTHORITY_OPTIONS,
  BUDGET_OPTIONS,
  BUSINESS_STAGE_OPTIONS,
  CURRENT_SYSTEMS_OPTIONS,
  EMPLOYEE_OPTIONS,
  MAIN_NEED_OPTIONS,
  PAIN_POINT_OPTIONS,
  TIMELINE_OPTIONS,
  labelForValue,
} from "@/lib/digital-assessment";

const FALLBACK_TO_EMAIL = "hello@northbridgeventuregroup.com";
const SCORE_DISPLAY_MAX = 100;

export type AssessmentNotificationResults = {
  internalEmailSent: boolean;
  clientEmailSent: boolean;
  slackSent: boolean;
};

export type AssessmentSubmissionOutcome = {
  leadId: string | null;
  persisted: boolean;
  notifications: AssessmentNotificationResults;
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeSlackMrkdwn(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function formatList(values: string[], options: readonly { value: string; label: string }[]): string {
  if (values.length === 0) return "—";
  return values.map((value) => labelForValue(options, value)).join(", ");
}

function formatScoreDisplay(score: number): string {
  return `${score}/${SCORE_DISPLAY_MAX}`;
}

function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim() && process.env.RESEND_FROM_EMAIL?.trim());
}

function buildAnswerRows(payload: AssessmentPayload): [string, string][] {
  return [
    ["Full name", payload.name],
    ["Email", payload.email],
    ["Phone", payload.phone || "—"],
    ["Company", payload.company],
    ["Industry", payload.industry || "—"],
    ["Employees", labelForValue(EMPLOYEE_OPTIONS, payload.employees)],
    ["Business stage", labelForValue(BUSINESS_STAGE_OPTIONS, payload.businessStage)],
    ["Main need", labelForValue(MAIN_NEED_OPTIONS, payload.mainNeed)],
    ["Pain points", formatList(payload.painPoints, PAIN_POINT_OPTIONS)],
    ["Current systems", formatList(payload.currentSystems, CURRENT_SYSTEMS_OPTIONS)],
    ["Budget", labelForValue(BUDGET_OPTIONS, payload.budget)],
    ["Timeline", labelForValue(TIMELINE_OPTIONS, payload.timeline)],
    ["Authority", labelForValue(AUTHORITY_OPTIONS, payload.authority)],
  ];
}

function buildTableHtml(rows: [string, string][]): string {
  return rows
    .map(([label, value]) => {
      const safeLabel = escapeHtml(label);
      const safeValue = escapeHtml(value).replace(/\n/g, "<br />");
      return `<tr><td style="padding:8px 12px 8px 0;font-weight:600;vertical-align:top;color:#000;">${safeLabel}</td><td style="padding:8px 0;color:#333;">${safeValue}</td></tr>`;
    })
    .join("");
}

function buildEvidenceHtml(decision: AssessmentDecision): string {
  const rows = decision.evidence
    .map((item) => {
      const points = item.points > 0 ? `+${item.points}` : String(item.points);
      return `<tr>
        <td style="padding:6px 12px 6px 0;font-family:monospace;font-size:12px;color:#555;">${escapeHtml(item.ruleId)}</td>
        <td style="padding:6px 12px 6px 0;color:#333;">${escapeHtml(item.rationale)}</td>
        <td style="padding:6px 0;color:#333;font-weight:600;">${escapeHtml(points)}</td>
      </tr>`;
    })
    .join("");

  return `
    <h3 style="color:#000;margin:24px 0 8px;font-size:16px;">Score breakdown</h3>
    <table style="border-collapse:collapse;width:100%;">
      <thead>
        <tr>
          <th style="text-align:left;padding:6px 12px 6px 0;color:#666;font-size:12px;">Rule</th>
          <th style="text-align:left;padding:6px 12px 6px 0;color:#666;font-size:12px;">Rationale</th>
          <th style="text-align:left;padding:6px 0;color:#666;font-size:12px;">Points</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function buildInternalNotificationHtml(
  payload: AssessmentPayload,
  decision: AssessmentDecision,
  leadId: string | null,
  sourcePath: string | null
): string {
  const companyLabel = payload.company || payload.name;

  return `
    <div style="font-family:system-ui,sans-serif;max-width:640px;">
      <h2 style="color:#B11226;margin:0 0 8px;">New Business Diagnostic submission</h2>
      <p style="margin:0 0 16px;color:#333;">
        <strong>${escapeHtml(companyLabel)}</strong> — Score ${escapeHtml(formatScoreDisplay(decision.totalScore))}
        (${escapeHtml(decision.category)})
      </p>
      <table style="border-collapse:collapse;width:100%;margin-bottom:8px;">
        <tr>
          <td style="padding:8px 12px 8px 0;font-weight:600;color:#000;">Recommended solution</td>
          <td style="padding:8px 0;color:#333;">${escapeHtml(decision.recommendation)}</td>
        </tr>
        <tr>
          <td style="padding:8px 12px 8px 0;font-weight:600;color:#000;">Lead ID</td>
          <td style="padding:8px 0;color:#333;">${escapeHtml(leadId || "Not stored — check Supabase configuration")}</td>
        </tr>
        <tr>
          <td style="padding:8px 12px 8px 0;font-weight:600;color:#000;">Source path</td>
          <td style="padding:8px 0;color:#333;">${escapeHtml(sourcePath || "—")}</td>
        </tr>
      </table>
      <h3 style="color:#000;margin:24px 0 8px;font-size:16px;">Contact &amp; business details</h3>
      <table style="border-collapse:collapse;width:100%;">${buildTableHtml(buildAnswerRows(payload))}</table>
      ${buildEvidenceHtml(decision)}
      <h3 style="color:#000;margin:24px 0 8px;font-size:16px;">Suggested call opening</h3>
      <p style="margin:0;color:#333;line-height:1.5;">${escapeHtml(decision.suggestedCallOpening)}</p>
    </div>
  `;
}

function buildClientConfirmationHtml(
  payload: AssessmentPayload,
  decision: AssessmentDecision
): string {
  const firstName = payload.name.trim().split(/\s+/)[0] || payload.name;

  return `
    <div style="font-family:system-ui,sans-serif;max-width:560px;">
      <h2 style="color:#B11226;margin:0 0 16px;">Thank you for completing the Business Diagnostic</h2>
      <p style="color:#333;line-height:1.6;margin:0 0 16px;">
        Hi ${escapeHtml(firstName)},
      </p>
      <p style="color:#333;line-height:1.6;margin:0 0 16px;">
        We received your responses for <strong>${escapeHtml(payload.company || "your business")}</strong>.
        Our team will review your results and recommend the best next step.
      </p>
      <p style="color:#333;line-height:1.6;margin:0 0 8px;">
        <strong>Your diagnostic summary score:</strong> ${escapeHtml(formatScoreDisplay(decision.totalScore))}
      </p>
      <p style="color:#333;line-height:1.6;margin:0 0 16px;">
        <strong>Recommended focus area:</strong> ${escapeHtml(decision.recommendation)}
      </p>
      <p style="color:#555;line-height:1.6;margin:0;font-size:14px;">
        If you have urgent questions, reply to this email or contact us at
        <a href="mailto:hello@northbridgeventuregroup.com" style="color:#B11226;">hello@northbridgeventuregroup.com</a>.
      </p>
      <p style="color:#555;line-height:1.6;margin:16px 0 0;font-size:14px;">
        — Northbridge Digital
      </p>
    </div>
  `;
}

async function sendResendEmail(input: {
  to: string[];
  replyTo?: string;
  subject: string;
  html: string;
  logLabel: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();

  if (!apiKey || !from) {
    console.warn(`[Digital assessment] Resend not configured; skipping ${input.logLabel}.`);
    return false;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: input.to,
      reply_to: input.replyTo,
      subject: input.subject,
      html: input.html,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`[Digital assessment] Resend error (${input.logLabel}):`, response.status, errorBody);
    return false;
  }

  return true;
}

export async function sendAssessmentInternalEmail(
  payload: AssessmentPayload,
  decision: AssessmentDecision,
  leadId: string | null,
  sourcePath: string | null
): Promise<boolean> {
  if (!isResendConfigured()) return false;

  const to = process.env.CONTACT_TO_EMAIL?.trim() || FALLBACK_TO_EMAIL;
  const companyLabel = payload.company || payload.name;

  return sendResendEmail({
    to: [to],
    replyTo: payload.email,
    subject: `Business Diagnostic: ${companyLabel} (${formatScoreDisplay(decision.totalScore)})`,
    html: buildInternalNotificationHtml(payload, decision, leadId, sourcePath),
    logLabel: "internal notification",
  });
}

export async function sendAssessmentClientConfirmationEmail(
  payload: AssessmentPayload,
  decision: AssessmentDecision
): Promise<boolean> {
  if (!isResendConfigured()) return false;

  return sendResendEmail({
    to: [payload.email],
    subject: "Your Business Diagnostic submission — Northbridge Digital",
    html: buildClientConfirmationHtml(payload, decision),
    logLabel: "client confirmation",
  });
}

export async function sendAssessmentSlackNotification(
  payload: AssessmentPayload,
  decision: AssessmentDecision,
  leadId: string | null
): Promise<boolean> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL?.trim();
  if (!webhookUrl) {
    console.warn(
      "[Digital assessment] SLACK_WEBHOOK_URL not configured; skipping Slack notification."
    );
    return false;
  }

  const companyLabel = payload.company || payload.name;
  const headerText = `New Business Diagnostic submitted (Score: ${formatScoreDisplay(decision.totalScore)}) by ${companyLabel}.`;
  const timestamp = new Date().toISOString();

  const headerFields = [
    { type: "mrkdwn", text: `*Lead category:*\n${escapeSlackMrkdwn(decision.category)}` },
    { type: "mrkdwn", text: `*Score:*\n${formatScoreDisplay(decision.totalScore)}` },
    {
      type: "mrkdwn",
      text: `*Recommended solution:*\n${escapeSlackMrkdwn(decision.recommendation)}`,
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
      text: headerText,
      blocks: [
        {
          type: "header",
          text: { type: "plain_text", text: headerText, emoji: true },
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
            text: `*Suggested call opening:*\n${escapeSlackMrkdwn(decision.suggestedCallOpening)}`,
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

export async function dispatchAssessmentNotifications(input: {
  payload: AssessmentPayload;
  decision: AssessmentDecision;
  leadId: string | null;
  sourcePath: string | null;
}): Promise<AssessmentNotificationResults> {
  const [internalEmailSent, clientEmailSent, slackSent] = await Promise.all([
    sendAssessmentInternalEmail(input.payload, input.decision, input.leadId, input.sourcePath),
    sendAssessmentClientConfirmationEmail(input.payload, input.decision),
    sendAssessmentSlackNotification(input.payload, input.decision, input.leadId),
  ]);

  return { internalEmailSent, clientEmailSent, slackSent };
}

export function logAssessmentSubmissionOutcome(outcome: AssessmentSubmissionOutcome): void {
  const { leadId, persisted, notifications } = outcome;
  const channels = {
    persisted,
    internalEmail: notifications.internalEmailSent,
    clientEmail: notifications.clientEmailSent,
    slack: notifications.slackSent,
  };

  const anyNotification =
    notifications.internalEmailSent || notifications.clientEmailSent || notifications.slackSent;

  if (!persisted && !anyNotification) {
    console.error("[Digital assessment] Submission accepted but no persistence or notifications succeeded.", {
      leadId,
      channels,
    });
    return;
  }

  if (!persisted) {
    console.error("[Digital assessment] Lead was not persisted; notifications may be the only record.", {
      leadId,
      channels,
    });
  }

  if (!notifications.internalEmailSent) {
    console.error("[Digital assessment] Internal email was not sent.", { leadId, channels });
  }

  if (!notifications.clientEmailSent) {
    console.error("[Digital assessment] Client confirmation email was not sent.", { leadId, channels });
  }

  if (process.env.SLACK_WEBHOOK_URL?.trim() && !notifications.slackSent) {
    console.error("[Digital assessment] Slack notification failed.", { leadId, channels });
  }

  console.info("[Digital assessment] Submission processed.", { leadId, channels });
}
