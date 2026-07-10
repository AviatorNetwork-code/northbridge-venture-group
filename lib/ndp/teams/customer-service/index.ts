export {
  CUSTOMER_SERVICE_TEAM_ID,
  CUSTOMER_SERVICE_TEAM_PRODUCT_ID,
  CUSTOMER_SERVICE_TEAM_LEAD_ID,
  CUSTOMER_SERVICE_SPECIALIST_IDS,
  CUSTOMER_SERVICE_EMPLOYEE_IDS,
  type CustomerServiceSpecialistId,
} from "./constants.js";

export {
  CUSTOMER_SERVICE_EXECUTION_CAPABILITIES,
  CUSTOMER_SERVICE_CAPABILITY_ID_SET,
  SPECIALIST_PRIMARY_CAPABILITY,
  resolveCustomerServiceCapabilityForSpecialist,
  MOCK_OUTPUTS,
  getProductionPromptForEmployee,
  renderProductionPromptSection,
  renderKnowledgePackText,
  createCustomerServiceMockConnectorRegistry,
} from "@/lib/ndp/domain/customer-service";

export {
  buildCustomerServiceSpecialistRoster,
  getCustomerServiceManifestForSpecialist,
} from "./runtime/roster.js";
export { CustomerServiceSpecialistSelector } from "./runtime/specialist-selector.js";
export {
  assembleCustomerServiceEmployeeRuntime,
  renderEmployeeRuntimePrompt,
  type CustomerServiceEmployeeRuntimeAssemblyOptions,
} from "./runtime/employee-runtime.js";
export { CustomerServiceTeamSynthesizer } from "./runtime/synthesizer.js";
export { createCustomerServiceTaskExecutor } from "./runtime/task-executor.js";
export {
  createCustomerServiceTeamOrchestrator,
  resolveCustomerServiceTeamLeadId,
  resolveCustomerServiceTeamId,
} from "./runtime/orchestrator.js";
export {
  buildCustomerServiceTeamRuntimeContext,
  type CustomerServiceTeamRuntimeContext,
} from "./runtime/operations-context.js";
export {
  generateCustomerServiceRecommendations,
  CUSTOMER_SUCCESS_POLICY,
  type CustomerServiceRecommendation,
  type CustomerServiceRecommendationCategory,
} from "./recommendations/engine.js";
export {
  CustomerServiceOperationalReportBuilder,
  type CustomerServiceOperationalReport,
} from "./reporting/operational-report.js";
export {
  buildCustomerServiceDashboardModel,
  type CustomerServiceDashboardModel,
  type CustomerServiceDashboardCard,
  type CustomerServiceDashboardCardId,
} from "./dashboard/model.js";
export {
  createCustomerServiceCommunicationRouter,
  buildCustomerServiceRouteRules,
} from "./wiring/communication-router.js";
