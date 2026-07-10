import {
  buildKnowledgeResolutionPlan,
  createKnowledgePackRegistry,
  NDP_LAUNCH_KNOWLEDGE_PACKS,
} from "@/lib/ndp/workforce/knowledge";
import type { DigitalEmployeeManifest } from "@/lib/ndp/workforce/manifests";
import {
  buildPromptAssemblyPlan,
  getPromptTemplate,
} from "@/lib/ndp/workforce/prompts";
import { buildSpecialistRuntimeConfigPreview } from "@/lib/ndp/workforce/manifests";
import { buildOperationsContextReferences } from "@/lib/ndp/operations-context";
import {
  renderKnowledgePackText,
  getProductionPromptForEmployee,
  renderProductionPromptSection,
} from "@/lib/ndp/domain/customer-service";
import { CUSTOMER_SERVICE_TEAM_ID } from "../constants.js";

const knowledgeRegistry = createKnowledgePackRegistry(NDP_LAUNCH_KNOWLEDGE_PACKS);

export interface CustomerServiceEmployeeRuntimeAssemblyOptions {
  organizationId?: string;
  contextVersion?: string;
}

export interface CustomerServiceEmployeeRuntimeAssembly {
  employeeId: string;
  specialistId: string;
  runtimeConfigPreview: ReturnType<typeof buildSpecialistRuntimeConfigPreview>;
  knowledgePlan: ReturnType<typeof buildKnowledgeResolutionPlan>;
  promptAssemblyPlan: ReturnType<typeof buildPromptAssemblyPlan>;
  productionPromptVersion: string;
  knowledgeContentRefs: string[];
  organizationContextRef?: string;
}

export function assembleCustomerServiceEmployeeRuntime(
  manifest: DigitalEmployeeManifest,
  options?: CustomerServiceEmployeeRuntimeAssemblyOptions,
): CustomerServiceEmployeeRuntimeAssembly {
  const knowledgePlan = buildKnowledgeResolutionPlan({
    manifest,
    registry: knowledgeRegistry,
    teamId: CUSTOMER_SERVICE_TEAM_ID,
  });

  const template =
    getPromptTemplate("prompt-template-customer-service-specialist") ??
    getPromptTemplate("prompt-template-team-lead")!;

  const contextReferences = options?.organizationId
    ? buildOperationsContextReferences({
        organizationId: options.organizationId,
        contextVersion: options.contextVersion,
      })
    : undefined;

  const promptAssemblyPlan = buildPromptAssemblyPlan({
    manifest,
    knowledgePlan,
    template,
    contextReferences,
  });

  const productionPrompt = getProductionPromptForEmployee(manifest.employeeId);

  return {
    employeeId: manifest.employeeId,
    specialistId: manifest.specialistId,
    runtimeConfigPreview: buildSpecialistRuntimeConfigPreview(manifest),
    knowledgePlan,
    promptAssemblyPlan,
    productionPromptVersion: productionPrompt?.version ?? "1.0.0",
    knowledgeContentRefs: knowledgePlan.resolvedPacks
      .map((entry) => entry.knowledgePackId)
      .filter((packId) => renderKnowledgePackText(packId).length > 0),
    organizationContextRef: contextReferences?.organizationContextRef,
  };
}

export function renderEmployeeRuntimePrompt(manifest: DigitalEmployeeManifest): string {
  const assembly = assembleCustomerServiceEmployeeRuntime(manifest);
  const productionSections = [
    renderProductionPromptSection(manifest.employeeId, "identity"),
    renderProductionPromptSection(manifest.employeeId, "responsibilities"),
    renderProductionPromptSection(manifest.employeeId, "constraints"),
    renderProductionPromptSection(manifest.employeeId, "output_instructions"),
  ].filter((entry): entry is string => Boolean(entry));

  const knowledgeText = assembly.knowledgeContentRefs
    .map((packId) => renderKnowledgePackText(packId))
    .filter(Boolean)
    .join("\n\n");

  return [...productionSections, knowledgeText].filter(Boolean).join("\n\n");
}
