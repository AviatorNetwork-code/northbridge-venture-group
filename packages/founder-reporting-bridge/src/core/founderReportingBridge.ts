import { aggregateSources, createSampleReportSources } from "../adapters/reportSourceAdapters.js";
import { loadSlackConfig, type SlackConfig } from "../config/slackConfig.js";
import { deliverToSlack, previewSlackPayload } from "../delivery/slackDelivery.js";
import {
  generateDailyFounderBrief,
  generateWeeklyNorthbridgeReport,
} from "../engines/dailyBriefGenerator.js";
import {
  generateCriticalAlert,
  generatePendingDecisionsReport,
} from "../engines/criticalAlertGenerator.js";
import { formatFounderReportForSlack } from "../formatters/slackMessageFormatter.js";
import { assertReadOnlyOperation, FRB_GOVERNANCE } from "../governance/readOnlyPolicy.js";
import type {
  FounderReport,
  ReportSourceInput,
  SlackDeliveryResult,
} from "../types/report.js";

export interface FounderReportingBridgeOptions {
  slackConfig?: SlackConfig;
  sources?: ReportSourceInput[];
}

export class FounderReportingBridge {
  private readonly slackConfig: SlackConfig;
  private readonly defaultSources: ReportSourceInput[];

  constructor(options: FounderReportingBridgeOptions = {}) {
    this.slackConfig =
      options.slackConfig ??
      loadSlackConfig(
        process.env.FOUNDER_REPORTING_DRY_RUN || process.env.FOUNDER_REPORTING_PREVIEW
          ? process.env
          : { ...process.env, FOUNDER_REPORTING_DRY_RUN: "true" },
      );
    this.defaultSources = options.sources ?? createSampleReportSources();
  }

  generateDailyBrief(sources?: ReportSourceInput[]): FounderReport {
    assertReadOnlyOperation("generate_report");
    return generateDailyFounderBrief(aggregateSources(sources ?? this.defaultSources));
  }

  generateWeeklyReport(sources?: ReportSourceInput[]): FounderReport {
    assertReadOnlyOperation("generate_report");
    return generateWeeklyNorthbridgeReport(aggregateSources(sources ?? this.defaultSources));
  }

  generateCriticalAlert(message: string, sources?: ReportSourceInput[]): FounderReport {
    assertReadOnlyOperation("generate_report");
    return generateCriticalAlert(message, aggregateSources(sources ?? []));
  }

  generatePendingDecisions(sources?: ReportSourceInput[]): FounderReport {
    assertReadOnlyOperation("generate_report");
    return generatePendingDecisionsReport(aggregateSources(sources ?? this.defaultSources));
  }

  async sendReport(report: FounderReport): Promise<SlackDeliveryResult> {
    const payload = formatFounderReportForSlack(report);
    return deliverToSlack(payload, this.slackConfig);
  }

  previewReport(report: FounderReport): string {
    const payload = formatFounderReportForSlack(report);
    return previewSlackPayload(payload);
  }
}

export function createFounderReportingBridge(
  options?: FounderReportingBridgeOptions,
): FounderReportingBridge {
  return new FounderReportingBridge(options);
}

export { FRB_GOVERNANCE };
