import type { SpecialistPermissions } from "@northbridge/workforce-contracts";
export interface ConnectorPermissionEnvelope {
    orgId: string;
    specialistId?: string;
    teamId?: string;
    permissions: SpecialistPermissions;
}
export interface ConnectorPermissionResult {
    allowed: boolean;
    reason?: string;
}
