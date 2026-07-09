import type { WorkforceRole } from "@northbridge/workforce-contracts";
export interface RoleDefinition {
    role: WorkforceRole;
    label: string;
    description: string;
    /** Minimum organizational tier required before this role can be provisioned. */
    minimumTier: "team" | "manager" | "director" | "vice_president";
    customerVisible: boolean;
}
declare const ROLE_DEFINITIONS: Record<WorkforceRole, RoleDefinition>;
export declare function getRoleDefinition(role: WorkforceRole): RoleDefinition;
export declare function listRoleDefinitions(): RoleDefinition[];
export declare function isRoleRegistered(role: string): role is WorkforceRole;
export declare function registerRoleDefinition(definition: RoleDefinition, registry?: Record<WorkforceRole, RoleDefinition>): void;
export { ROLE_DEFINITIONS };
