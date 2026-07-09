export interface CapabilityDefinition {
    id: string;
    /** Permission action checked via workforce-core against task.permissions. */
    requiredPermission: string;
    description?: string;
}
export interface CapabilityRegistry {
    listCapabilities(specialistDefinitionId: string): CapabilityDefinition[];
    getCapability(specialistDefinitionId: string, capabilityId: string): CapabilityDefinition | undefined;
    hasCapability(specialistDefinitionId: string, capabilityId: string): boolean;
}
export interface CapabilityValidationResult {
    valid: boolean;
    capabilityId: string;
    reason?: string;
}
