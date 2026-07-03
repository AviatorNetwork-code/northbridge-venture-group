export {
  FounderReportingBridge,
  createFounderReportingBridge,
  FRB_GOVERNANCE,
} from "./core/founderReportingBridge.js";
export { loadSlackConfig } from "./config/slackConfig.js";
export type { SlackConfig } from "./config/slackConfig.js";
export {
  formatFounderReportForSlack,
  previewSlackPayload,
} from "./formatters/slackMessageFormatter.js";
export {
  classifyPriority,
  deliveryCadence,
  shouldSendImmediately,
} from "./engines/priorityClassifier.js";
export {
  generateDailyFounderBrief,
  generateWeeklyNorthbridgeReport,
} from "./engines/dailyBriefGenerator.js";
export {
  generateCriticalAlert,
  generatePendingDecisionsReport,
} from "./engines/criticalAlertGenerator.js";
export {
  createSampleReportSources,
  aggregateSources,
} from "./adapters/reportSourceAdapters.js";
export { deliverToSlack } from "./delivery/slackDelivery.js";
export {
  registerFRBCapability,
  getFRBCapabilityRegistration,
  FRB_CAPABILITY,
} from "./registration/capabilityRegistration.js";
export type {
  ReportType,
  ReportPriority,
  ReportSourceId,
  ReportSourceInput,
  FounderReport,
  SlackDeliveryResult,
  SlackMessagePayload,
} from "./types/index.js";
