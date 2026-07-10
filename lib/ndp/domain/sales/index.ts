export {
  SALES_SPECIALIST_IDS,
  SALES_EMPLOYEE_IDS,
  type SalesSpecialistId,
} from "./constants.js";

export {
  SALES_EXECUTION_CAPABILITY_IDS,
  SALES_EXECUTION_CAPABILITIES,
  SALES_CAPABILITY_ID_SET,
  SPECIALIST_PRIMARY_CAPABILITY,
  resolveSalesCapabilityForSpecialist,
} from "./capabilities/index.js";

export {
  SALES_KNOWLEDGE_MODULES,
  getKnowledgeModuleContent,
  renderKnowledgePackText,
  type KnowledgeModule,
} from "./knowledge/content.js";

export {
  SALES_PRODUCTION_PROMPTS,
  getProductionPromptForEmployee,
  renderProductionPromptSection,
  type ProductionPromptSection,
  type ProductionPromptTemplate,
} from "./prompts/production-templates.js";

export {
  createSalesMockConnectorRegistry,
  createSalesConnectorRouter,
  MOCK_OUTPUTS,
  type MockCapabilityOutput,
} from "./mock-connectors/index.js";
