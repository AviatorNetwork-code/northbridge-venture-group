import type { FounderReport, SlackMessagePayload, SlackBlock } from "../types/report.js";
import { deliveryCadence } from "../engines/priorityClassifier.js";
import { sanitizeReportContent, validateNoSensitiveContent } from "../governance/readOnlyPolicy.js";

const PRIORITY_EMOJI: Record<string, string> = {
  critical: ":rotating_light:",
  high: ":large_orange_diamond:",
  normal: ":large_blue_diamond:",
  low: ":white_circle:",
};

export function formatFounderReportForSlack(report: FounderReport): SlackMessagePayload {
  const emoji = PRIORITY_EMOJI[report.priority] ?? ":memo:";
  const lines: string[] = [
    `${emoji} *${escapeSlack(report.title)}*`,
    `_Priority: ${report.priority} (${deliveryCadence(report.priority)})_`,
    `_Generated: ${new Date(report.generatedAt).toISOString()}_`,
    "",
  ];

  for (const section of report.sections) {
    lines.push(`*${escapeSlack(section.heading)}*`);
    for (const item of section.items) {
      lines.push(`• ${escapeSlack(item)}`);
    }
    lines.push("");
  }

  lines.push(`*Next suggested action:* ${escapeSlack(report.nextSuggestedAction)}`);
  lines.push("");
  lines.push(`_${escapeSlack(report.governanceNotice)}_`);

  const text = sanitizeReportContent(lines.join("\n"));
  validateNoSensitiveContent(text);

  const blocks: SlackBlock[] = [
    {
      type: "header",
      text: { type: "plain_text", text: report.title.slice(0, 150), emoji: true },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Priority:* \`${report.priority}\` · ${deliveryCadence(report.priority)}`,
      },
    },
    ...report.sections.slice(0, 8).map(
      (section): SlackBlock => ({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${escapeSlack(section.heading)}*\n${section.items.map((i) => `• ${escapeSlack(i)}`).join("\n")}`.slice(
            0,
            3000,
          ),
        },
      }),
    ),
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Next suggested action:*\n${escapeSlack(report.nextSuggestedAction)}`,
      },
    },
    {
      type: "context",
      elements: [{ type: "mrkdwn", text: escapeSlack(report.governanceNotice) }],
    },
  ];

  return { text, blocks };
}

function escapeSlack(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function previewSlackPayload(payload: SlackMessagePayload): string {
  return JSON.stringify(payload, null, 2);
}
