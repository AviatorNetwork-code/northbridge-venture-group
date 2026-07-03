#!/usr/bin/env node
/**
 * Founder Reporting Bridge CLI
 *
 * Examples:
 *   node packages/founder-reporting-bridge/cli.mjs --daily --dry-run
 *   node packages/founder-reporting-bridge/cli.mjs --weekly --dry-run
 *   node packages/founder-reporting-bridge/cli.mjs --critical --message "Aviator build failed" --dry-run
 */
import { createFounderReportingBridge } from "./dist/index.js";

function parseArgs(argv) {
  const args = {
    daily: false,
    weekly: false,
    critical: false,
    pending: false,
    dryRun: false,
    preview: false,
    message: "",
  };

  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--daily") args.daily = true;
    else if (arg === "--weekly") args.weekly = true;
    else if (arg === "--critical") args.critical = true;
    else if (arg === "--pending") args.pending = true;
    else if (arg === "--dry-run") args.dryRun = true;
    else if (arg === "--preview") args.preview = true;
    else if (arg === "--message") args.message = argv[++i] ?? "";
  }

  return args;
}

async function main() {
  const args = parseArgs(process.argv);

  if (args.dryRun) {
    process.env.FOUNDER_REPORTING_DRY_RUN = "true";
  }
  if (args.preview) {
    process.env.FOUNDER_REPORTING_PREVIEW = "true";
  }

  const bridge = createFounderReportingBridge();

  let report;
  if (args.critical) {
    if (!args.message) {
      console.error("Critical alert requires --message");
      process.exit(1);
    }
    report = bridge.generateCriticalAlert(args.message);
  } else if (args.weekly) {
    report = bridge.generateWeeklyReport();
  } else if (args.pending) {
    report = bridge.generatePendingDecisions();
  } else {
    report = bridge.generateDailyBrief();
  }

  if (args.dryRun || args.preview) {
    console.log(bridge.previewReport(report));
    process.exit(0);
  }

  const result = await bridge.sendReport(report);
  if (result.error) {
    console.error(result.error);
    process.exit(1);
  }
  console.log(result.sent ? "Report sent to Slack." : "Report not sent.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
