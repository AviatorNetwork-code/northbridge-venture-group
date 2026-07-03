import type { SlackConfig } from "../config/slackConfig.js";
import type { SlackDeliveryResult, SlackMessagePayload } from "../types/report.js";
import { previewSlackPayload } from "../formatters/slackMessageFormatter.js";
import { assertReadOnlyOperation } from "../governance/readOnlyPolicy.js";

export async function deliverToSlack(
  payload: SlackMessagePayload,
  config: SlackConfig,
): Promise<SlackDeliveryResult> {
  assertReadOnlyOperation("send_report");

  if (config.dryRun || config.preview) {
    return {
      sent: false,
      dryRun: config.dryRun,
      preview: config.preview,
      channel: config.channelId,
      payload,
    };
  }

  if (config.webhookUrl) {
    try {
      const response = await fetch(config.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: payload.text, blocks: payload.blocks }),
      });

      if (!response.ok) {
        return {
          sent: false,
          dryRun: false,
          preview: false,
          payload,
          error: `Slack webhook returned ${response.status}`,
        };
      }

      return { sent: true, dryRun: false, preview: false, payload };
    } catch (error) {
      return {
        sent: false,
        dryRun: false,
        preview: false,
        payload,
        error: error instanceof Error ? error.message : "Unknown delivery error",
      };
    }
  }

  if (config.botToken && config.channelId) {
    try {
      const response = await fetch("https://slack.com/api/chat.postMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.botToken}`,
        },
        body: JSON.stringify({
          channel: config.channelId,
          text: payload.text,
          blocks: payload.blocks,
        }),
      });

      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!data.ok) {
        return {
          sent: false,
          dryRun: false,
          preview: false,
          channel: config.channelId,
          payload,
          error: data.error ?? "Slack API error",
        };
      }

      return {
        sent: true,
        dryRun: false,
        preview: false,
        channel: config.channelId,
        payload,
      };
    } catch (error) {
      return {
        sent: false,
        dryRun: false,
        preview: false,
        channel: config.channelId,
        payload,
        error: error instanceof Error ? error.message : "Unknown delivery error",
      };
    }
  }

  return {
    sent: false,
    dryRun: false,
    preview: false,
    payload,
    error: "No Slack credentials configured",
  };
}

export { previewSlackPayload };
