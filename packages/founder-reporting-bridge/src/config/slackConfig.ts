export interface SlackConfig {
  webhookUrl?: string;
  botToken?: string;
  channelId?: string;
  dryRun: boolean;
  preview: boolean;
}

export function loadSlackConfig(env: NodeJS.ProcessEnv = process.env): SlackConfig {
  const dryRun = env.FOUNDER_REPORTING_DRY_RUN === "true" || env.FOUNDER_REPORTING_DRY_RUN === "1";
  const preview = env.FOUNDER_REPORTING_PREVIEW === "true" || env.FOUNDER_REPORTING_PREVIEW === "1";

  const webhookUrl = env.SLACK_WEBHOOK_URL?.trim() || undefined;
  const botToken = env.SLACK_BOT_TOKEN?.trim() || undefined;
  const channelId = env.SLACK_CHANNEL_ID?.trim() || env.SLACK_FOUNDER_CHANNEL_ID?.trim() || undefined;

  if (!dryRun && !preview && !webhookUrl && !(botToken && channelId)) {
    throw new Error(
      "Slack delivery requires SLACK_WEBHOOK_URL or (SLACK_BOT_TOKEN + SLACK_CHANNEL_ID). Use --dry-run or FOUNDER_REPORTING_DRY_RUN=true to preview without credentials.",
    );
  }

  return { webhookUrl, botToken, channelId, dryRun, preview };
}
