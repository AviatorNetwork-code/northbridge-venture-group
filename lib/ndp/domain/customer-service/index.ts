export {
  CUSTOMER_SERVICE_SPECIALIST_IDS,
  CUSTOMER_SERVICE_EMPLOYEE_IDS,
  type CustomerServiceSpecialistId,
} from "./constants.js";

export {
  CUSTOMER_SERVICE_EXECUTION_CAPABILITY_IDS,
  CUSTOMER_SERVICE_EXECUTION_CAPABILITIES,
  CUSTOMER_SERVICE_CAPABILITY_ID_SET,
  SPECIALIST_PRIMARY_CAPABILITY,
  resolveCustomerServiceCapabilityForSpecialist,
} from "./capabilities/index.js";

export {
  CUSTOMER_SERVICE_KNOWLEDGE_MODULES,
  getKnowledgeModuleContent,
  renderKnowledgePackText,
  type KnowledgeModule,
} from "./knowledge/content.js";

export {
  CUSTOMER_SERVICE_PRODUCTION_PROMPTS,
  getProductionPromptForEmployee,
  renderProductionPromptSection,
  type ProductionPromptSection,
  type ProductionPromptTemplate,
} from "./prompts/production-templates.js";

export {
  createCustomerServiceMockConnectorRegistry,
  createCustomerServiceConnectorRouter,
  MOCK_OUTPUTS,
  type MockCapabilityOutput,
} from "./mock-connectors/index.js";
