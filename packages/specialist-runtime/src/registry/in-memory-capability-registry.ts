import type {
  CapabilityDefinition,
  CapabilityRegistry,
} from "../types/capabilities.js";
import { canPerformAction } from "@northbridge/workforce-core";
import type { SpecialistPermissions } from "@northbridge/workforce-contracts";
import type { CapabilityValidationResult } from "../types/capabilities.js";

export class InMemoryCapabilityRegistry implements CapabilityRegistry {
  private readonly byDefinition = new Map<string, CapabilityDefinition[]>();

  register(specialistDefinitionId: string, capabilities: CapabilityDefinition[]): void {
    this.byDefinition.set(specialistDefinitionId, [...capabilities]);
  }

  listCapabilities(specialistDefinitionId: string): CapabilityDefinition[] {
    return [...(this.byDefinition.get(specialistDefinitionId) ?? [])];
  }

  getCapability(
    specialistDefinitionId: string,
    capabilityId: string,
  ): CapabilityDefinition | undefined {
    return this.listCapabilities(specialistDefinitionId).find(
      (capability) => capability.id === capabilityId,
    );
  }

  hasCapability(specialistDefinitionId: string, capabilityId: string): boolean {
    return this.getCapability(specialistDefinitionId, capabilityId) !== undefined;
  }
}

export function validateCapability(
  registry: CapabilityRegistry,
  specialistDefinitionId: string,
  capabilityId: string,
  permissions: SpecialistPermissions,
): CapabilityValidationResult {
  const capability = registry.getCapability(specialistDefinitionId, capabilityId);
  if (!capability) {
    return {
      valid: false,
      capabilityId,
      reason: `Capability '${capabilityId}' is not registered for specialist definition '${specialistDefinitionId}'`,
    };
  }

  const permission = canPerformAction(permissions, capability.requiredPermission);
  if (!permission.allowed) {
    return {
      valid: false,
      capabilityId,
      reason: permission.reason,
    };
  }

  return { valid: true, capabilityId };
}
