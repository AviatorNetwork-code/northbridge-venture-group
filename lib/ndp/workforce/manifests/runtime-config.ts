import type {
  DigitalEmployeeManifest,
  SpecialistRuntimeConfigPreview,
} from "./types/manifest.js";

/**
 * Produces a specialist-runtime-compatible configuration preview from a manifest.
 * Does not execute tools or load prompts — composition metadata only.
 */
export function buildSpecialistRuntimeConfigPreview(
  manifest: DigitalEmployeeManifest,
): SpecialistRuntimeConfigPreview {
  const requiredToolCapabilities = manifest.toolRequirements
    .filter((entry) => entry.required)
    .map((entry) => entry.capabilityId);

  return {
    specialistDefinitionId: manifest.specialistId,
    employeeId: manifest.employeeId,
    displayName: manifest.displayName,
    teamIds: manifest.teamIds,
    routingCapabilities: manifest.capabilities,
    connectorCapabilityIds: manifest.connectorCapabilities,
    permissions: manifest.permissions,
    memoryPolicy: manifest.memoryPolicy,
    confidencePolicy: manifest.confidencePolicy,
    escalationPolicy: manifest.escalationPolicy,
    requiredToolCapabilities,
    knowledgePackIds: manifest.knowledgePackIds,
  };
}

export function buildSpecialistRuntimeConfigPreviews(
  manifests: DigitalEmployeeManifest[],
): SpecialistRuntimeConfigPreview[] {
  return manifests.map(buildSpecialistRuntimeConfigPreview);
}
