export {
  FINANCIAL_SPECIALIST_IDS,
  FINANCIAL_EMPLOYEE_IDS,
  type FinancialSpecialistId,
} from "./constants.js";

export {
  FINANCIAL_EXECUTION_CAPABILITY_IDS,
  FINANCIAL_EXECUTION_CAPABILITIES,
  FINANCIAL_CAPABILITY_ID_SET,
  SPECIALIST_PRIMARY_CAPABILITY,
  resolveFinancialCapabilityForSpecialist,
} from "./capabilities/index.js";

export {
  FINANCIAL_KNOWLEDGE_MODULES,
  getKnowledgeModuleContent,
  renderKnowledgePackText,
  type KnowledgeModule,
} from "./knowledge/content.js";

export {
  FINANCIAL_PRODUCTION_PROMPTS,
  getProductionPromptForEmployee,
  renderProductionPromptSection,
  type ProductionPromptSection,
  type ProductionPromptTemplate,
} from "./prompts/production-templates.js";

export {
  createFinancialMockConnectorRegistry,
  createFinancialConnectorRouter,
  MOCK_OUTPUTS,
  type MockCapabilityOutput,
} from "./mock-connectors/index.js";
