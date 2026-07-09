import type { DigitalEmployeeManifest } from "../../manifests/types/manifest.js";
import type { KnowledgeResolutionPlan } from "../../knowledge/types/resolution.js";
import type {
  ContextReferenceSet,
  MemoryReferenceSet,
  PromptAssemblyPlan,
  PromptAssemblySection,
} from "../types/assembly.js";
import type { PromptTemplate } from "../types/template.js";
import { getPromptTemplateSection } from "../types/section.js";
import {
  validateTemplateKnowledgeCompatibility,
  validateTemplateManifestCompatibility,
} from "../validation/template-validation.js";

export interface BuildPromptAssemblyPlanInput {
  manifest: DigitalEmployeeManifest;
  knowledgePlan: KnowledgeResolutionPlan;
  template: PromptTemplate;
  contextReferences?: ContextReferenceSet;
  memoryReferences?: MemoryReferenceSet;
}

/**
 * Builds a Prompt Assembly Plan describing how runtime prompt sections would be combined.
 * Does not generate LLM prompt text or concatenate content.
 */
export function buildPromptAssemblyPlan(
  input: BuildPromptAssemblyPlanInput,
): PromptAssemblyPlan {
  const {
    manifest,
    knowledgePlan,
    template,
    contextReferences = {},
    memoryReferences = {},
  } = input;

  const manifestIssues = validateTemplateManifestCompatibility(template, manifest);
  const knowledgeIssues = validateTemplateKnowledgeCompatibility(
    template,
    knowledgePlan,
    manifest.employeeId,
  );

  if (manifestIssues.length > 0 || knowledgeIssues.length > 0) {
    const messages = [...manifestIssues, ...knowledgeIssues].map(
      (issue) => issue.message,
    );
    throw new Error(`Prompt assembly plan validation failed: ${messages.join("; ")}`);
  }

  const sectionOrder: PromptAssemblySection[] = template.sectionOrder.map(
    (sectionId, index) => {
      const definition = getPromptTemplateSection(sectionId);
      const { sourceType, sourceKeys } = resolveSectionSources(
        sectionId,
        manifest,
        knowledgePlan,
        contextReferences,
        memoryReferences,
        template,
      );

      return {
        sectionId,
        displayName: definition?.displayName ?? sectionId,
        order: index + 1,
        sourceType,
        sourceKeys,
      };
    },
  );

  return {
    employeeId: manifest.employeeId,
    templateId: template.templateId,
    templateDisplayName: template.displayName,
    outputStyle: template.outputStyle,
    sectionOrder,
    knowledgePacksReferenced: knowledgePlan.resolvedPacks.map(
      (entry) => entry.knowledgePackId,
    ),
    manifestSectionsUsed: template.requiredManifestSections,
    contextProvidersRequired: template.requiredContextProviders,
    memoryProvidersRequired: template.requiredMemoryProviders,
    connectorCapabilitySectionsRequired: template.requiredConnectorSections,
  };
}

function resolveSectionSources(
  sectionId: string,
  manifest: DigitalEmployeeManifest,
  knowledgePlan: KnowledgeResolutionPlan,
  contextReferences: ContextReferenceSet,
  memoryReferences: MemoryReferenceSet,
  template: PromptTemplate,
): { sourceType: PromptAssemblySection["sourceType"]; sourceKeys: string[] } {
  switch (sectionId) {
    case "identity":
      return {
        sourceType: "manifest",
        sourceKeys: ["employeeId", "displayName", "role", "teamIds"],
      };
    case "responsibilities":
      return {
        sourceType: "manifest",
        sourceKeys: ["specialistId", "capabilities"],
      };
    case "objectives":
      return {
        sourceType: "manifest",
        sourceKeys: ["capabilities", "kpis"],
      };
    case "operating_principles":
      return {
        sourceType: "manifest",
        sourceKeys: ["confidencePolicy", "escalationPolicy"],
      };
    case "organization_context":
      return {
        sourceType: "context_reference",
        sourceKeys: contextReferences.organizationContextRef
          ? [contextReferences.organizationContextRef]
          : ["organization_context"],
      };
    case "customer_context":
      return {
        sourceType: "context_reference",
        sourceKeys: contextReferences.customerContextRef
          ? [contextReferences.customerContextRef]
          : ["customer_context"],
      };
    case "conversation_context":
      return {
        sourceType: "context_reference",
        sourceKeys: contextReferences.conversationContextRef
          ? [contextReferences.conversationContextRef]
          : ["conversation_context"],
      };
    case "memory_context":
      return {
        sourceType: "memory_reference",
        sourceKeys: [
          ...(memoryReferences.threadMemoryRef ? [memoryReferences.threadMemoryRef] : []),
          ...(memoryReferences.conversationHistoryRef
            ? [memoryReferences.conversationHistoryRef]
            : []),
          "memoryPolicy",
        ],
      };
    case "knowledge_packs":
      return {
        sourceType: "knowledge_plan",
        sourceKeys: knowledgePlan.resolvedPacks.map(
          (entry) => entry.knowledgePackId,
        ),
      };
    case "available_capabilities":
      return {
        sourceType: "manifest",
        sourceKeys: manifest.capabilities,
      };
    case "available_connector_capabilities":
      return {
        sourceType: "manifest",
        sourceKeys: manifest.connectorCapabilities,
      };
    case "kpis":
      return {
        sourceType: "manifest",
        sourceKeys: manifest.kpis.map((entry) => entry.id),
      };
    case "escalation_rules":
      return {
        sourceType: "manifest",
        sourceKeys: ["escalationPolicy"],
      };
    case "communication_style":
      return {
        sourceType: "template_metadata",
        sourceKeys: [template.outputStyle],
      };
    case "constraints":
      return {
        sourceType: "manifest",
        sourceKeys: ["permissions", "toolRequirements"],
      };
    case "output_instructions":
      return {
        sourceType: "template_metadata",
        sourceKeys: [template.outputStyle, template.templateId],
      };
    default:
      return { sourceType: "template_metadata", sourceKeys: [sectionId] };
  }
}
