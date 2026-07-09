export type PromptTemplateSectionId =
  | "identity"
  | "responsibilities"
  | "objectives"
  | "operating_principles"
  | "organization_context"
  | "customer_context"
  | "conversation_context"
  | "memory_context"
  | "knowledge_packs"
  | "available_capabilities"
  | "available_connector_capabilities"
  | "kpis"
  | "escalation_rules"
  | "communication_style"
  | "constraints"
  | "output_instructions";

export interface PromptTemplateSectionDefinition {
  sectionId: PromptTemplateSectionId;
  displayName: string;
  description: string;
  orderWeight: number;
}

export const PROMPT_TEMPLATE_SECTIONS: PromptTemplateSectionDefinition[] = [
  {
    sectionId: "identity",
    displayName: "Identity",
    description: "Employee role, name, and team affiliation",
    orderWeight: 10,
  },
  {
    sectionId: "responsibilities",
    displayName: "Responsibilities",
    description: "Role responsibilities derived from manifest and team context",
    orderWeight: 20,
  },
  {
    sectionId: "objectives",
    displayName: "Objectives",
    description: "Task objectives and success criteria",
    orderWeight: 30,
  },
  {
    sectionId: "operating_principles",
    displayName: "Operating Principles",
    description: "Confidence and escalation operating principles",
    orderWeight: 40,
  },
  {
    sectionId: "organization_context",
    displayName: "Organization Context",
    description: "Organization-level context reference",
    orderWeight: 50,
  },
  {
    sectionId: "customer_context",
    displayName: "Customer Context",
    description: "Customer profile and relationship context reference",
    orderWeight: 60,
  },
  {
    sectionId: "conversation_context",
    displayName: "Conversation Context",
    description: "Active conversation thread context reference",
    orderWeight: 70,
  },
  {
    sectionId: "memory_context",
    displayName: "Memory Context",
    description: "Memory policy and loaded memory reference",
    orderWeight: 80,
  },
  {
    sectionId: "knowledge_packs",
    displayName: "Knowledge Packs",
    description: "Ordered knowledge pack references from resolution plan",
    orderWeight: 90,
  },
  {
    sectionId: "available_capabilities",
    displayName: "Available Capabilities",
    description: "Routing capability tags available to the employee",
    orderWeight: 100,
  },
  {
    sectionId: "available_connector_capabilities",
    displayName: "Available Connector Capabilities",
    description: "Connector execution capabilities available to the employee",
    orderWeight: 110,
  },
  {
    sectionId: "kpis",
    displayName: "KPIs",
    description: "Key performance indicators from manifest",
    orderWeight: 120,
  },
  {
    sectionId: "escalation_rules",
    displayName: "Escalation Rules",
    description: "Escalation policy from manifest",
    orderWeight: 130,
  },
  {
    sectionId: "communication_style",
    displayName: "Communication Style",
    description: "Output style and communication conventions",
    orderWeight: 140,
  },
  {
    sectionId: "constraints",
    displayName: "Constraints",
    description: "Permission boundaries and operational constraints",
    orderWeight: 150,
  },
  {
    sectionId: "output_instructions",
    displayName: "Output Instructions",
    description: "Structured output formatting instructions",
    orderWeight: 160,
  },
];

export const PROMPT_TEMPLATE_SECTION_ID_SET = new Set(
  PROMPT_TEMPLATE_SECTIONS.map((entry) => entry.sectionId),
);

export function getPromptTemplateSection(
  sectionId: PromptTemplateSectionId,
): PromptTemplateSectionDefinition | undefined {
  return PROMPT_TEMPLATE_SECTIONS.find((entry) => entry.sectionId === sectionId);
}
