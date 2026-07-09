import type { CapabilityDefinition, CapabilityRegistry } from "../types/capabilities.js";
import type { SpecialistPermissions } from "@northbridge/workforce-contracts";
import type { CapabilityValidationResult } from "../types/capabilities.js";
export declare class InMemoryCapabilityRegistry implements CapabilityRegistry {
    private readonly byDefinition;
    register(specialistDefinitionId: string, capabilities: CapabilityDefinition[]): void;
    listCapabilities(specialistDefinitionId: string): CapabilityDefinition[];
    getCapability(specialistDefinitionId: string, capabilityId: string): CapabilityDefinition | undefined;
    hasCapability(specialistDefinitionId: string, capabilityId: string): boolean;
}
export declare function validateCapability(registry: CapabilityRegistry, specialistDefinitionId: string, capabilityId: string, permissions: SpecialistPermissions): CapabilityValidationResult;
