export {
  MARKETING_SPECIALIST_IDS,
  MARKETING_EMPLOYEE_IDS,
  type MarketingSpecialistId,
} from "./constants.js";

export {
  MARKETING_EXECUTION_CAPABILITY_IDS,
  MARKETING_EXECUTION_CAPABILITIES,
  MARKETING_CAPABILITY_ID_SET,
  SPECIALIST_PRIMARY_CAPABILITY,
  resolveMarketingCapabilityForSpecialist,
} from "./capabilities/index.js";

export {
  MARKETING_KNOWLEDGE_MODULES,
  getKnowledgeModuleContent,
  renderKnowledgePackText,
  type KnowledgeModule,
} from "./knowledge/content.js";

export {
  MARKETING_PRODUCTION_PROMPTS,
  getProductionPromptForEmployee,
  renderProductionPromptSection,
  type ProductionPromptSection,
  type ProductionPromptTemplate,
} from "./prompts/production-templates.js";

export {
  createMarketingMockConnectorRegistry,
  createMarketingConnectorRouter,
  MOCK_OUTPUTS,
  type MockCapabilityOutput,
} from "./mock-connectors/index.js";
