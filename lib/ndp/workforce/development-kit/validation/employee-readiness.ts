import type { DigitalEmployeeManifest } from "../../manifests/types/manifest.js";
import type { ManifestValidationIssue } from "../../manifests/types/manifest.js";
import {
  buildSpecialistRuntimeConfigPreview,
  getManifestBySpecialistId,
  getLaunchEmployeeManifest,
  validateEmployeeManifest,
  NDP_LAUNCH_EMPLOYEE_MANIFESTS,
} from "../../manifests/index.js";
import {
  buildKnowledgeResolutionPlan,
  createKnowledgePackRegistry,
  NDP_LAUNCH_KNOWLEDGE_PACKS,
} from "../../knowledge/index.js";
import {
  buildPromptAssemblyPlan,
  createPromptTemplateRegistry,
  getPromptTemplate,
  NDP_LAUNCH_PROMPT_TEMPLATES,
  validateTemplateKnowledgeCompatibility,
  validateTemplateManifestCompatibility,
} from "../../prompts/index.js";
import { getInventorySpecialist } from "../../catalog/index.js";

export type EmployeeReadinessCheckId =
  | "inventory_specialist"
  | "manifest_validation"
  | "knowledge_resolution"
  | "prompt_template_compatibility"
  | "prompt_assembly_plan"
  | "runtime_config_preview";

export interface EmployeeReadinessCheck {
  id: EmployeeReadinessCheckId;
  label: string;
  passed: boolean;
  issues: string[];
}

export interface EmployeeReadinessReport {
  employeeId: string;
  specialistId: string;
  displayName: string;
  ready: boolean;
  checks: EmployeeReadinessCheck[];
  suggestedPromptTemplateId?: string;
  resolvedKnowledgePackCount?: number;
  connectorCapabilityCount?: number;
}

const CATEGORY_PROMPT_TEMPLATE: Record<string, string> = {
  marketing: "prompt-template-marketing-specialist",
  sales: "prompt-template-sales-specialist",
  "customer-experience": "prompt-template-customer-service-specialist",
  financial: "prompt-template-financial-specialist",
};

const knowledgeRegistry = createKnowledgePackRegistry(NDP_LAUNCH_KNOWLEDGE_PACKS);
const templateRegistry = createPromptTemplateRegistry(NDP_LAUNCH_PROMPT_TEMPLATES);

export interface ValidateEmployeeReadinessInput {
  manifest?: DigitalEmployeeManifest;
  employeeId?: string;
  specialistId?: string;
  teamId?: string;
}

/**
 * Aggregates platform validation for a Digital Employee definition.
 * Scaffolding helper — does not execute tools or load production content.
 */
export function validateEmployeeReadiness(
  input: ValidateEmployeeReadinessInput,
): EmployeeReadinessReport {
  const manifest = resolveManifest(input);
  const checks: EmployeeReadinessCheck[] = [];

  const inventorySpecialist = getInventorySpecialist(manifest.specialistId);
  checks.push({
    id: "inventory_specialist",
    label: "Workforce Inventory specialist exists",
    passed: Boolean(inventorySpecialist),
    issues: inventorySpecialist
      ? []
      : [`Specialist ${manifest.specialistId} is not in Workforce Inventory`],
  });

  const manifestIssues = validateEmployeeManifest(manifest, {
    manifests: NDP_LAUNCH_EMPLOYEE_MANIFESTS,
  });
  checks.push({
    id: "manifest_validation",
    label: "Manifest passes framework validation",
    passed: manifestIssues.length === 0,
    issues: manifestIssues.map(formatManifestIssue),
  });

  const teamId = input.teamId ?? manifest.teamIds[0];
  let knowledgePlan;
  let knowledgeIssues: string[] = [];
  try {
    knowledgePlan = buildKnowledgeResolutionPlan({
      manifest,
      registry: knowledgeRegistry,
      teamId,
    });
    if (knowledgePlan.resolvedPacks.length === 0) {
      knowledgeIssues.push("Knowledge resolution plan resolved zero packs");
    }
  } catch (error) {
    knowledgeIssues.push(
      error instanceof Error ? error.message : "Knowledge resolution failed",
    );
  }

  checks.push({
    id: "knowledge_resolution",
    label: "Knowledge resolution plan builds successfully",
    passed: Boolean(knowledgePlan) && knowledgeIssues.length === 0,
    issues: knowledgeIssues,
  });

  const templateId = CATEGORY_PROMPT_TEMPLATE[manifest.category];
  const template = templateId ? getPromptTemplate(templateId) : undefined;
  const promptCompatibilityIssues: string[] = [];

  if (!template) {
    promptCompatibilityIssues.push(
      `No launch prompt template mapped for category ${manifest.category}`,
    );
  } else if (knowledgePlan) {
    promptCompatibilityIssues.push(
      ...validateTemplateManifestCompatibility(template, manifest).map(
        (issue) => issue.message,
      ),
      ...validateTemplateKnowledgeCompatibility(
        template,
        knowledgePlan,
        manifest.employeeId,
      ).map((issue) => issue.message),
    );
  }

  checks.push({
    id: "prompt_template_compatibility",
    label: "Prompt template is compatible with manifest and knowledge",
    passed: promptCompatibilityIssues.length === 0,
    issues: promptCompatibilityIssues,
  });

  let assemblyIssues: string[] = [];
  if (template && knowledgePlan) {
    try {
      buildPromptAssemblyPlan({ manifest, knowledgePlan, template });
    } catch (error) {
      assemblyIssues.push(
        error instanceof Error ? error.message : "Prompt assembly plan failed",
      );
    }
  } else {
    assemblyIssues.push("Skipped — missing template or knowledge plan");
  }

  checks.push({
    id: "prompt_assembly_plan",
    label: "Prompt assembly plan builds successfully",
    passed: assemblyIssues.length === 0,
    issues: assemblyIssues,
  });

  let runtimePreviewIssues: string[] = [];
  try {
    const preview = buildSpecialistRuntimeConfigPreview(manifest);
    if (!preview.specialistDefinitionId) {
      runtimePreviewIssues.push("Runtime config preview missing specialistDefinitionId");
    }
  } catch (error) {
    runtimePreviewIssues.push(
      error instanceof Error ? error.message : "Runtime config preview failed",
    );
  }

  checks.push({
    id: "runtime_config_preview",
    label: "Specialist runtime config preview builds successfully",
    passed: runtimePreviewIssues.length === 0,
    issues: runtimePreviewIssues,
  });

  return {
    employeeId: manifest.employeeId,
    specialistId: manifest.specialistId,
    displayName: manifest.displayName,
    ready: checks.every((check) => check.passed),
    checks,
    suggestedPromptTemplateId: templateId,
    resolvedKnowledgePackCount: knowledgePlan?.resolvedPacks.length,
    connectorCapabilityCount: manifest.connectorCapabilities.length,
  };
}

export function assertEmployeeReadiness(
  input: ValidateEmployeeReadinessInput,
): EmployeeReadinessReport {
  const report = validateEmployeeReadiness(input);
  if (!report.ready) {
    const failures = report.checks
      .filter((check) => !check.passed)
      .flatMap((check) => check.issues);
    throw new Error(
      `Digital Employee readiness check failed for ${report.employeeId}: ${failures.join("; ")}`,
    );
  }
  return report;
}

function resolveManifest(
  input: ValidateEmployeeReadinessInput,
): DigitalEmployeeManifest {
  if (input.manifest) {
    return input.manifest;
  }
  if (input.employeeId) {
    const manifest = getLaunchEmployeeManifest(input.employeeId);
    if (!manifest) {
      throw new Error(`Unknown employeeId ${input.employeeId}`);
    }
    return manifest;
  }
  if (input.specialistId) {
    const manifest = getManifestBySpecialistId(input.specialistId);
    if (!manifest) {
      throw new Error(`No manifest found for specialistId ${input.specialistId}`);
    }
    return manifest;
  }
  throw new Error("validateEmployeeReadiness requires manifest, employeeId, or specialistId");
}

function formatManifestIssue(issue: ManifestValidationIssue): string {
  return issue.message;
}

export { CATEGORY_PROMPT_TEMPLATE };
