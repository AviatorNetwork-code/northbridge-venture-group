export {
  MARKETING_TEAM_ID,
  MARKETING_TEAM_PRODUCT_ID,
  MARKETING_TEAM_LEAD_ID,
  MARKETING_SPECIALIST_IDS,
  MARKETING_EMPLOYEE_IDS,
  type MarketingSpecialistId,
} from "./constants.js";

export {
  MARKETING_EXECUTION_CAPABILITIES,
  MARKETING_CAPABILITY_ID_SET,
  SPECIALIST_PRIMARY_CAPABILITY,
  resolveMarketingCapabilityForSpecialist,
} from "@/lib/ndp/domain/marketing";

export {
  MARKETING_KNOWLEDGE_MODULES,
  getKnowledgeModuleContent,
  renderKnowledgePackText,
} from "@/lib/ndp/domain/marketing";

export {
  MARKETING_PRODUCTION_PROMPTS,
  getProductionPromptForEmployee,
  renderProductionPromptSection,
} from "@/lib/ndp/domain/marketing";

export {
  createMarketingMockConnectorRegistry,
  createMarketingConnectorRouter,
  MOCK_OUTPUTS,
} from "@/lib/ndp/domain/marketing";

export {
  buildMarketingSpecialistRoster,
  getMarketingManifestForSpecialist,
} from "./runtime/roster.js";

export { MarketingSpecialistSelector } from "./runtime/specialist-selector.js";

export {
  assembleMarketingEmployeeRuntime,
  renderEmployeeRuntimePrompt,
} from "./runtime/employee-runtime.js";

export { MarketingTeamSynthesizer } from "./runtime/synthesizer.js";
export { createMarketingTaskExecutor } from "./runtime/task-executor.js";

export {
  createMarketingTeamOrchestrator,
  resolveMarketingTeamLeadId,
  resolveMarketingTeamId,
} from "./runtime/orchestrator.js";

export {
  generateMarketingRecommendations,
  CUSTOMER_SUCCESS_POLICY,
  type MarketingRecommendation,
  type MarketingRecommendationCategory,
} from "./recommendations/engine.js";

export {
  MarketingOperationalReportBuilder,
  type MarketingOperationalReport,
} from "./reporting/operational-report.js";

export {
  buildMarketingDashboardModel,
  type MarketingDashboardModel,
  type MarketingDashboardCard,
  type MarketingDashboardCardId,
} from "./dashboard/model.js";

export {
  createMarketingCommunicationRouter,
  buildMarketingRouteRules,
} from "./wiring/communication-router.js";
