export {
  FINANCIAL_TEAM_ID,
  FINANCIAL_TEAM_PRODUCT_ID,
  FINANCIAL_TEAM_LEAD_ID,
  FINANCIAL_SPECIALIST_IDS,
  FINANCIAL_EMPLOYEE_IDS,
  type FinancialSpecialistId,
} from "./constants.js";

export {
  FINANCIAL_EXECUTION_CAPABILITIES,
  FINANCIAL_CAPABILITY_ID_SET,
  SPECIALIST_PRIMARY_CAPABILITY,
  resolveFinancialCapabilityForSpecialist,
  MOCK_OUTPUTS,
  getProductionPromptForEmployee,
  renderProductionPromptSection,
  renderKnowledgePackText,
  createFinancialMockConnectorRegistry,
} from "@/lib/ndp/domain/financial";

export {
  buildFinancialSpecialistRoster,
  getFinancialManifestForSpecialist,
} from "./runtime/roster.js";
export { FinancialSpecialistSelector } from "./runtime/specialist-selector.js";
export {
  assembleFinancialEmployeeRuntime,
  renderEmployeeRuntimePrompt,
  type FinancialEmployeeRuntimeAssemblyOptions,
} from "./runtime/employee-runtime.js";
export { FinancialTeamSynthesizer } from "./runtime/synthesizer.js";
export { createFinancialTaskExecutor } from "./runtime/task-executor.js";
export {
  createFinancialTeamOrchestrator,
  resolveFinancialTeamLeadId,
  resolveFinancialTeamId,
} from "./runtime/orchestrator.js";
export {
  buildFinancialTeamRuntimeContext,
  type FinancialTeamRuntimeContext,
} from "./runtime/operations-context.js";
export {
  generateFinancialRecommendations,
  CUSTOMER_SUCCESS_POLICY,
  type FinancialRecommendation,
  type FinancialRecommendationCategory,
} from "./recommendations/engine.js";
export {
  FinancialOperationalReportBuilder,
  type FinancialOperationalReport,
} from "./reporting/operational-report.js";
export {
  buildFinancialDashboardModel,
  type FinancialDashboardModel,
  type FinancialDashboardCard,
  type FinancialDashboardCardId,
} from "./dashboard/model.js";
export {
  createFinancialCommunicationRouter,
  buildFinancialRouteRules,
} from "./wiring/communication-router.js";
