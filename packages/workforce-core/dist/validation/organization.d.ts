import type { Organization, OrganizationHierarchy, Team, TeamLead, WorkforceAssignment, WorkforceFeatureFlags } from "@northbridge/workforce-contracts";
export interface OrganizationValidationIssue {
    code: string;
    message: string;
    path?: string;
}
export interface OrganizationValidationResult {
    valid: boolean;
    issues: OrganizationValidationIssue[];
}
export interface ValidateOrganizationStructureInput {
    organization: Organization;
    teams: Team[];
    teamLeads?: TeamLead[];
    assignments?: WorkforceAssignment[];
    hierarchy?: OrganizationHierarchy;
}
export declare function validateOrganizationEntity(organization: unknown): OrganizationValidationResult;
export declare function validateOrganizationStructure(input: ValidateOrganizationStructureInput): OrganizationValidationResult;
export declare function validateGatedHierarchyLayers(hierarchy: OrganizationHierarchy, flags: WorkforceFeatureFlags): OrganizationValidationIssue[];
export declare function assertValidOrganizationStructure(input: ValidateOrganizationStructureInput): void;
