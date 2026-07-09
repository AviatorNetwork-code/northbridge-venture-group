import type { KnowledgeLayerType } from "../../knowledge/types/category.js";
import type { PromptTemplateSectionId } from "./section.js";

export type PromptTemplateCategory =
  | "marketing"
  | "sales"
  | "customer_service"
  | "financial"
  | "team_lead"
  | "general";

export type ApplicableRole = "specialist" | "team_lead";

export type OutputProfile =
  | "advisor"
  | "specialist"
  | "team_lead"
  | "internal_analysis"
  | "structured_report";

export type ManifestSectionId =
  | "employeeId"
  | "displayName"
  | "role"
  | "teamIds"
  | "capabilities"
  | "connectorCapabilities"
  | "permissions"
  | "memoryPolicy"
  | "kpis"
  | "escalationPolicy"
  | "confidencePolicy"
  | "knowledgePackIds"
  | "toolRequirements";

export type ContextProviderId =
  | "organization_context"
  | "conversation_context"
  | "customer_context"
  | "memory_context"
  | "operational_metrics"
  | "team_context";

export type MemoryProviderId =
  | "thread_memory"
  | "customer_memory"
  | "organization_memory"
  | "conversation_history";

export type PromptLifecycleStatus = "draft" | "active" | "deprecated" | "archived";

export interface PromptTemplate {
  templateId: string;
  displayName: string;
  category: PromptTemplateCategory;
  version: string;
  description: string;
  applicableRoles: ApplicableRole[];
  applicableTeams: string[];
  sectionOrder: PromptTemplateSectionId[];
  requiredManifestSections: ManifestSectionId[];
  requiredKnowledgeLayers: KnowledgeLayerType[];
  requiredContextProviders: ContextProviderId[];
  requiredMemoryProviders: MemoryProviderId[];
  requiredConnectorSections: PromptTemplateSectionId[];
  outputStyle: OutputProfile;
  lifecycleStatus: PromptLifecycleStatus;
  launchVisible: boolean;
  metadata?: Record<string, unknown>;
}

export interface PromptTemplateRegistry {
  getTemplate(templateId: string): PromptTemplate | undefined;
  hasTemplate(templateId: string): boolean;
  listTemplates(): PromptTemplate[];
}
