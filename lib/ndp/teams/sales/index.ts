export {
  SALES_TEAM_ID,
  SALES_TEAM_PRODUCT_ID,
  SALES_TEAM_LEAD_ID,
  SALES_SPECIALIST_IDS,
  SALES_EMPLOYEE_IDS,
  type SalesSpecialistId,
} from "./constants.js";

export {
  SALES_EXECUTION_CAPABILITIES,
  SALES_CAPABILITY_ID_SET,
  SPECIALIST_PRIMARY_CAPABILITY,
  resolveSalesCapabilityForSpecialist,
  MOCK_OUTPUTS,
  getProductionPromptForEmployee,
  renderProductionPromptSection,
  renderKnowledgePackText,
  createSalesMockConnectorRegistry,
} from "@/lib/ndp/domain/sales";

export { buildSalesSpecialistRoster, getSalesManifestForSpecialist } from "./runtime/roster.js";
export { SalesSpecialistSelector } from "./runtime/specialist-selector.js";
export {
  assembleSalesEmployeeRuntime,
  renderEmployeeRuntimePrompt,
  type SalesEmployeeRuntimeAssemblyOptions,
} from "./runtime/employee-runtime.js";
export { SalesTeamSynthesizer } from "./runtime/synthesizer.js";
export { createSalesTaskExecutor } from "./runtime/task-executor.js";
export {
  createSalesTeamOrchestrator,
  resolveSalesTeamLeadId,
  resolveSalesTeamId,
} from "./runtime/orchestrator.js";
export {
  buildSalesTeamRuntimeContext,
  type SalesTeamRuntimeContext,
} from "./runtime/operations-context.js";
export {
  generateSalesRecommendations,
  CUSTOMER_SUCCESS_POLICY,
  type SalesRecommendation,
  type SalesRecommendationCategory,
} from "./recommendations/engine.js";
export {
  SalesOperationalReportBuilder,
  type SalesOperationalReport,
} from "./reporting/operational-report.js";
export {
  buildSalesDashboardModel,
  type SalesDashboardModel,
  type SalesDashboardCard,
  type SalesDashboardCardId,
} from "./dashboard/model.js";
export {
  createSalesCommunicationRouter,
  buildSalesRouteRules,
} from "./wiring/communication-router.js";
