import type { DigitalEmployeeManifest } from "../../manifests/types/manifest.js";
import type { KnowledgeResolutionPlan } from "../../knowledge/types/resolution.js";
import type {
  ContextReferenceSet,
  MemoryReferenceSet,
  PromptAssemblyPlan,
  PromptAssemblySection,
  PromptValidationIssue,
} from "../types/assembly.js";
import type {
  ManifestSectionId,
  OutputProfile,
  PromptTemplate,
  PromptTemplateRegistry,
} from "../types/template.js";
import {
  PROMPT_TEMPLATE_SECTION_ID_SET,
  getPromptTemplateSection,
} from "../types/section.js";

const OUTPUT_PROFILE_SET = new Set<string>([
  "advisor",
  "specialist",
  "team_lead",
  "internal_analysis",
  "structured_report",
]);

const CONTEXT_PROVIDER_SET = new Set([
  "organization_context",
  "conversation_context",
  "customer_context",
  "memory_context",
  "operational_metrics",
  "team_context",
]);

const MEMORY_PROVIDER_SET = new Set([
  "thread_memory",
  "customer_memory",
  "organization_memory",
  "conversation_history",
]);

export function validatePromptTemplate(
  template: PromptTemplate,
  registry: PromptTemplateRegistry,
): PromptValidationIssue[] {
  const issues: PromptValidationIssue[] = [];

  if (!/^\d+\.\d+\.\d+$/.test(template.version)) {
    issues.push({
      code: "invalid_version",
      message: `Template ${template.templateId} has invalid semver`,
      templateId: template.templateId,
    });
  }

  if (!OUTPUT_PROFILE_SET.has(template.outputStyle)) {
    issues.push({
      code: "invalid_output_profile",
      message: `Template ${template.templateId} has invalid output profile`,
      templateId: template.templateId,
    });
  }

  for (const sectionId of template.sectionOrder) {
    if (!PROMPT_TEMPLATE_SECTION_ID_SET.has(sectionId)) {
      issues.push({
        code: "unknown_section",
        message: `Template ${template.templateId} references unknown section ${sectionId}`,
        templateId: template.templateId,
        sectionId,
      });
    }
  }

  if (template.sectionOrder.length === 0) {
    issues.push({
      code: "missing_sections",
      message: `Template ${template.templateId} must define section order`,
      templateId: template.templateId,
    });
  }

  const uniqueSections = new Set(template.sectionOrder);
  if (uniqueSections.size !== template.sectionOrder.length) {
    issues.push({
      code: "duplicate_section",
      message: `Template ${template.templateId} has duplicate sections in order`,
      templateId: template.templateId,
    });
  }

  for (const provider of template.requiredContextProviders) {
    if (!CONTEXT_PROVIDER_SET.has(provider)) {
      issues.push({
        code: "invalid_context_provider",
        message: `Template ${template.templateId} references invalid context provider ${provider}`,
        templateId: template.templateId,
      });
    }
  }

  for (const provider of template.requiredMemoryProviders) {
    if (!MEMORY_PROVIDER_SET.has(provider)) {
      issues.push({
        code: "invalid_memory_provider",
        message: `Template ${template.templateId} references invalid memory provider ${provider}`,
        templateId: template.templateId,
      });
    }
  }

  if (template.launchVisible && template.lifecycleStatus !== "active") {
    issues.push({
      code: "launch_visibility_conflict",
      message: `Launch-visible template ${template.templateId} must be active`,
      templateId: template.templateId,
    });
  }

  if (!registry.hasTemplate(template.templateId)) {
    issues.push({
      code: "template_not_registered",
      message: `Template ${template.templateId} is not registered`,
      templateId: template.templateId,
    });
  }

  return issues;
}

export function validatePromptTemplateCatalog(
  registry: PromptTemplateRegistry,
): PromptValidationIssue[] {
  return registry
    .listTemplates()
    .flatMap((template) => validatePromptTemplate(template, registry));
}

export function validateTemplateManifestCompatibility(
  template: PromptTemplate,
  manifest: DigitalEmployeeManifest,
): PromptValidationIssue[] {
  const issues: PromptValidationIssue[] = [];

  if (
    template.applicableRoles.length > 0 &&
    !template.applicableRoles.includes(manifest.role)
  ) {
    issues.push({
      code: "role_incompatible",
      message: `Template ${template.templateId} is not compatible with role ${manifest.role}`,
      templateId: template.templateId,
      employeeId: manifest.employeeId,
    });
  }

  if (template.applicableTeams.length > 0) {
    const hasTeam = manifest.teamIds.some((teamId) =>
      template.applicableTeams.includes(teamId),
    );
    if (!hasTeam) {
      issues.push({
        code: "team_incompatible",
        message: `Template ${template.templateId} is not compatible with employee teams`,
        templateId: template.templateId,
        employeeId: manifest.employeeId,
      });
    }
  }

  for (const sectionId of template.requiredManifestSections) {
    if (!manifestHasSection(manifest, sectionId)) {
      issues.push({
        code: "missing_manifest_section",
        message: `Manifest ${manifest.employeeId} missing required section ${sectionId}`,
        templateId: template.templateId,
        employeeId: manifest.employeeId,
        sectionId,
      });
    }
  }

  if (
    template.requiredConnectorSections.includes("available_connector_capabilities") &&
    manifest.connectorCapabilities.length === 0
  ) {
    issues.push({
      code: "missing_connector_capabilities",
      message: `Manifest ${manifest.employeeId} must declare connector capabilities`,
      templateId: template.templateId,
      employeeId: manifest.employeeId,
    });
  }

  return issues;
}

export function validateTemplateKnowledgeCompatibility(
  template: PromptTemplate,
  knowledgePlan: KnowledgeResolutionPlan,
  employeeId: string,
): PromptValidationIssue[] {
  const issues: PromptValidationIssue[] = [];
  const resolvedLayers = new Set(
    knowledgePlan.resolvedPacks.map((entry) => entry.layer),
  );

  for (const layer of template.requiredKnowledgeLayers) {
    if (!resolvedLayers.has(layer)) {
      issues.push({
        code: "missing_knowledge_layer",
        message: `Knowledge plan for ${employeeId} missing required layer ${layer}`,
        templateId: template.templateId,
        employeeId,
        knowledgeLayer: layer,
      });
    }
  }

  if (
    template.sectionOrder.includes("knowledge_packs") &&
    knowledgePlan.resolvedPacks.length === 0
  ) {
    issues.push({
      code: "missing_knowledge_packs",
      message: `Knowledge plan for ${employeeId} must resolve at least one pack`,
      templateId: template.templateId,
      employeeId,
    });
  }

  return issues;
}

export function assertValidPromptTemplateCatalog(
  registry: PromptTemplateRegistry,
): void {
  const issues = validatePromptTemplateCatalog(registry);
  if (issues.length > 0) {
    throw new Error(
      `Prompt template catalog validation failed: ${issues.map((issue) => issue.message).join("; ")}`,
    );
  }
}

function manifestHasSection(
  manifest: DigitalEmployeeManifest,
  sectionId: ManifestSectionId,
): boolean {
  switch (sectionId) {
    case "employeeId":
      return Boolean(manifest.employeeId);
    case "displayName":
      return Boolean(manifest.displayName);
    case "role":
      return Boolean(manifest.role);
    case "teamIds":
      return manifest.teamIds.length > 0;
    case "capabilities":
      return manifest.capabilities.length > 0;
    case "connectorCapabilities":
      return manifest.connectorCapabilities.length > 0;
    case "permissions":
      return manifest.permissions.canDo.length > 0;
    case "memoryPolicy":
      return Boolean(manifest.memoryPolicy);
    case "kpis":
      return manifest.kpis.length > 0;
    case "escalationPolicy":
      return Boolean(manifest.escalationPolicy);
    case "confidencePolicy":
      return Boolean(manifest.confidencePolicy);
    case "knowledgePackIds":
      return manifest.knowledgePackIds.length > 0;
    case "toolRequirements":
      return manifest.toolRequirements.length > 0;
    default:
      return false;
  }
}

export type { OutputProfile };
