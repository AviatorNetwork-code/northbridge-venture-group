import type { ContextProviderId, MemoryProviderId } from "./template.js";

export interface ContextReferenceSet {
  organizationContextRef?: string;
  conversationContextRef?: string;
  customerContextRef?: string;
  teamContextRef?: string;
  operationalMetricsRef?: string;
}

export interface MemoryReferenceSet {
  threadMemoryRef?: string;
  customerMemoryRef?: string;
  organizationMemoryRef?: string;
  conversationHistoryRef?: string;
}

export interface PromptAssemblySection {
  sectionId: string;
  displayName: string;
  order: number;
  sourceType:
    | "manifest"
    | "knowledge_plan"
    | "context_reference"
    | "memory_reference"
    | "template_metadata";
  sourceKeys: string[];
}

export interface PromptAssemblyPlan {
  employeeId: string;
  templateId: string;
  templateDisplayName: string;
  outputStyle: string;
  sectionOrder: PromptAssemblySection[];
  knowledgePacksReferenced: string[];
  manifestSectionsUsed: string[];
  contextProvidersRequired: ContextProviderId[];
  memoryProvidersRequired: MemoryProviderId[];
  connectorCapabilitySectionsRequired: string[];
}

export interface PromptValidationIssue {
  code: string;
  message: string;
  templateId?: string;
  employeeId?: string;
  sectionId?: string;
  knowledgeLayer?: string;
}
