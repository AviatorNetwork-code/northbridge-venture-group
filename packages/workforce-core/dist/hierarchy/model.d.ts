import type { OrganizationHierarchy, Team, TeamHierarchyNode, WorkforceFeatureFlags } from "@northbridge/workforce-contracts";
export interface BuildHierarchyInput {
    orgId: string;
    teams: Team[];
    version?: number;
    generatedAt?: string;
}
export declare function buildOrganizationHierarchy(input: BuildHierarchyInput): OrganizationHierarchy;
export declare function mergeHierarchyLayers(base: OrganizationHierarchy, layers: Pick<OrganizationHierarchy, "managers" | "directors" | "vicePresidents">, flags: WorkforceFeatureFlags): OrganizationHierarchy;
export declare function findTeamInHierarchy(hierarchy: OrganizationHierarchy, teamId: string): TeamHierarchyNode | undefined;
