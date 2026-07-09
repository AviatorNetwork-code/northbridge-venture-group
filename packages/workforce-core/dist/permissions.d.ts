import type { SpecialistPermissions, WorkforceFeatureFlags } from "@northbridge/workforce-contracts";
export interface PermissionCheckResult {
    allowed: boolean;
    reason?: string;
}
export declare function mergeSpecialistPermissions(base: SpecialistPermissions, overlay?: Partial<SpecialistPermissions>): SpecialistPermissions;
export declare function canPerformAction(permissions: SpecialistPermissions, action: string): PermissionCheckResult;
export declare function assertCanPerformAction(permissions: SpecialistPermissions, action: string): void;
export interface OrgPolicyOverlay {
    deniedActions?: string[];
}
export declare function applyOrgPolicyOverlay(permissions: SpecialistPermissions, policy?: OrgPolicyOverlay): SpecialistPermissions;
export declare function permissionsAllowCustomerCommunication(permissions: SpecialistPermissions, flags: WorkforceFeatureFlags): boolean;
