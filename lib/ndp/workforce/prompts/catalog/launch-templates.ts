import type { PromptTemplate } from "../types/template.js";
import type { PromptTemplateSectionId } from "../types/section.js";

const SPECIALIST_BASE_SECTIONS: PromptTemplateSectionId[] = [
  "identity",
  "responsibilities",
  "objectives",
  "operating_principles",
  "organization_context",
  "customer_context",
  "conversation_context",
  "memory_context",
  "knowledge_packs",
  "available_capabilities",
  "available_connector_capabilities",
  "kpis",
  "escalation_rules",
  "communication_style",
  "constraints",
  "output_instructions",
];

function specialistTemplate(input: {
  templateId: string;
  displayName: string;
  category: PromptTemplate["category"];
  description: string;
  applicableTeams: string[];
  requiredKnowledgeLayers: PromptTemplate["requiredKnowledgeLayers"];
  outputStyle?: PromptTemplate["outputStyle"];
}): PromptTemplate {
  return {
    templateId: input.templateId,
    displayName: input.displayName,
    category: input.category,
    version: "1.0.0",
    description: input.description,
    applicableRoles: ["specialist"],
    applicableTeams: input.applicableTeams,
    sectionOrder: SPECIALIST_BASE_SECTIONS,
    requiredManifestSections: [
      "employeeId",
      "displayName",
      "role",
      "teamIds",
      "capabilities",
      "connectorCapabilities",
      "permissions",
      "memoryPolicy",
      "kpis",
      "escalationPolicy",
      "confidencePolicy",
      "knowledgePackIds",
      "toolRequirements",
    ],
    requiredKnowledgeLayers: input.requiredKnowledgeLayers,
    requiredContextProviders: [
      "organization_context",
      "conversation_context",
      "customer_context",
      "team_context",
    ],
    requiredMemoryProviders: ["thread_memory", "conversation_history"],
    requiredConnectorSections: ["available_connector_capabilities"],
    outputStyle: input.outputStyle ?? "specialist",
    lifecycleStatus: "active",
    launchVisible: true,
  };
}

const TEAM_LEAD_SECTIONS: PromptTemplateSectionId[] = [
  "identity",
  "responsibilities",
  "objectives",
  "operating_principles",
  "organization_context",
  "conversation_context",
  "memory_context",
  "knowledge_packs",
  "available_capabilities",
  "kpis",
  "escalation_rules",
  "communication_style",
  "constraints",
  "output_instructions",
];

/**
 * Launch prompt template metadata — no production wording or prompt text.
 */
export const NDP_LAUNCH_PROMPT_TEMPLATES: PromptTemplate[] = [
  specialistTemplate({
    templateId: "prompt-template-marketing-specialist",
    displayName: "Marketing Specialist",
    category: "marketing",
    description: "Assembly template for marketing Digital Employees",
    applicableTeams: ["team-marketing"],
    requiredKnowledgeLayers: ["universal", "business", "domain", "organization"],
    outputStyle: "specialist",
  }),
  specialistTemplate({
    templateId: "prompt-template-sales-specialist",
    displayName: "Sales Specialist",
    category: "sales",
    description: "Assembly template for sales Digital Employees",
    applicableTeams: ["team-sales"],
    requiredKnowledgeLayers: ["universal", "business", "domain", "organization"],
    outputStyle: "advisor",
  }),
  specialistTemplate({
    templateId: "prompt-template-customer-service-specialist",
    displayName: "Customer Service Specialist",
    category: "customer_service",
    description: "Assembly template for customer service Digital Employees",
    applicableTeams: ["team-customer-service", "team-general-service"],
    requiredKnowledgeLayers: ["universal", "organization"],
    outputStyle: "specialist",
  }),
  specialistTemplate({
    templateId: "prompt-template-financial-specialist",
    displayName: "Financial Specialist",
    category: "financial",
    description: "Assembly template for financial Digital Employees",
    applicableTeams: ["team-financial"],
    requiredKnowledgeLayers: ["universal", "business", "domain", "organization"],
    outputStyle: "structured_report",
  }),
  {
    templateId: "prompt-template-team-lead",
    displayName: "Team Lead",
    category: "team_lead",
    version: "1.0.0",
    description: "Assembly template for Team Lead orchestration and synthesis",
    applicableRoles: ["team_lead"],
    applicableTeams: [],
    sectionOrder: TEAM_LEAD_SECTIONS,
    requiredManifestSections: [
      "employeeId",
      "displayName",
      "role",
      "teamIds",
      "capabilities",
      "escalationPolicy",
      "confidencePolicy",
      "kpis",
    ],
    requiredKnowledgeLayers: ["universal", "organization"],
    requiredContextProviders: [
      "organization_context",
      "conversation_context",
      "team_context",
      "operational_metrics",
    ],
    requiredMemoryProviders: ["thread_memory", "organization_memory"],
    requiredConnectorSections: [],
    outputStyle: "team_lead",
    lifecycleStatus: "active",
    launchVisible: true,
    metadata: { orchestrationRole: true },
  },
];

export const NDP_LAUNCH_PROMPT_TEMPLATE_ID_SET = new Set(
  NDP_LAUNCH_PROMPT_TEMPLATES.map((entry) => entry.templateId),
);

export function getPromptTemplate(
  templateId: string,
): PromptTemplate | undefined {
  return NDP_LAUNCH_PROMPT_TEMPLATES.find(
    (entry) => entry.templateId === templateId,
  );
}

export function listLaunchVisiblePromptTemplates(): PromptTemplate[] {
  return NDP_LAUNCH_PROMPT_TEMPLATES.filter((entry) => entry.launchVisible);
}
