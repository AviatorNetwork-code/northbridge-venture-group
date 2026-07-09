import type { WorkforceAssignment, WorkforceFeatureFlags, WorkforceRole } from "@northbridge/workforce-contracts";
export interface CreateAssignmentInput {
    id: string;
    orgId: string;
    assigneeRole: WorkforceRole;
    assigneeId: string;
    scopeType: WorkforceAssignment["scopeType"];
    scopeId: string;
    effectiveFrom?: string;
    effectiveTo?: string;
}
export declare function createAssignment(input: CreateAssignmentInput): WorkforceAssignment;
export declare function isAssignmentActive(assignment: WorkforceAssignment, at?: string): boolean;
export declare function listActiveAssignments(assignments: WorkforceAssignment[], filters?: {
    orgId?: string;
    assigneeRole?: WorkforceRole;
    scopeType?: WorkforceAssignment["scopeType"];
    scopeId?: string;
    at?: string;
}): WorkforceAssignment[];
export declare function assertRoleTierEnabled(role: WorkforceRole, flags: WorkforceFeatureFlags): void;
