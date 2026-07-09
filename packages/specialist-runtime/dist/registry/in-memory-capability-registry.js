import { canPerformAction } from "@northbridge/workforce-core";
export class InMemoryCapabilityRegistry {
    byDefinition = new Map();
    register(specialistDefinitionId, capabilities) {
        this.byDefinition.set(specialistDefinitionId, [...capabilities]);
    }
    listCapabilities(specialistDefinitionId) {
        return [...(this.byDefinition.get(specialistDefinitionId) ?? [])];
    }
    getCapability(specialistDefinitionId, capabilityId) {
        return this.listCapabilities(specialistDefinitionId).find((capability) => capability.id === capabilityId);
    }
    hasCapability(specialistDefinitionId, capabilityId) {
        return this.getCapability(specialistDefinitionId, capabilityId) !== undefined;
    }
}
export function validateCapability(registry, specialistDefinitionId, capabilityId, permissions) {
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
