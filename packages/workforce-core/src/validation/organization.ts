import type {
  Organization,
  OrganizationHierarchy,
  Team,
  TeamLead,
  WorkforceAssignment,
  WorkforceFeatureFlags,
} from "@northbridge/workforce-contracts";
import { organizationSchema, teamSchema } from "@northbridge/workforce-contracts";
import { assertFeatureFlagDependency } from "../feature-flags.js";
import { findTeamInHierarchy } from "../hierarchy/model.js";

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

function issue(
  code: string,
  message: string,
  path?: string,
): OrganizationValidationIssue {
  return { code, message, path };
}

export function validateOrganizationEntity(
  organization: unknown,
): OrganizationValidationResult {
  const parsed = organizationSchema.safeParse(organization);
  if (parsed.success) {
    return { valid: true, issues: [] };
  }
  return {
    valid: false,
    issues: parsed.error.issues.map((entry) =>
      issue("invalid_organization", entry.message, entry.path.join(".")),
    ),
  };
}

export function validateOrganizationStructure(
  input: ValidateOrganizationStructureInput,
): OrganizationValidationResult {
  const issues: OrganizationValidationIssue[] = [];
  const flags = input.organization.featureFlags;

  try {
    assertFeatureFlagDependency(flags);
  } catch (error) {
    issues.push(
      issue(
        "invalid_feature_flags",
        error instanceof Error ? error.message : "Invalid feature flags",
        "organization.featureFlags",
      ),
    );
  }

  for (const team of input.teams) {
    const parsed = teamSchema.safeParse(team);
    if (!parsed.success) {
      issues.push(
        issue(
          "invalid_team",
          parsed.error.issues[0]?.message ?? "Invalid team",
          `teams.${team.id}`,
        ),
      );
      continue;
    }
    if (team.orgId !== input.organization.id) {
      issues.push(
        issue(
          "org_mismatch",
          `Team ${team.id} belongs to org ${team.orgId}, expected ${input.organization.id}`,
          `teams.${team.id}.orgId`,
        ),
      );
    }
  }

  const teamIds = new Set(input.teams.map((team) => team.id));

  for (const teamLead of input.teamLeads ?? []) {
    if (teamLead.orgId !== input.organization.id) {
      issues.push(
        issue(
          "org_mismatch",
          `Team Lead ${teamLead.id} org mismatch`,
          `teamLeads.${teamLead.id}.orgId`,
        ),
      );
    }
    if (!teamIds.has(teamLead.teamId)) {
      issues.push(
        issue(
          "missing_team",
          `Team Lead ${teamLead.id} references unknown team ${teamLead.teamId}`,
          `teamLeads.${teamLead.id}.teamId`,
        ),
      );
    }
  }

  for (const team of input.teams) {
    const lead = (input.teamLeads ?? []).find((entry) => entry.id === team.teamLeadId);
    if (!lead) {
      issues.push(
        issue(
          "missing_team_lead",
          `Team ${team.id} references missing Team Lead ${team.teamLeadId}`,
          `teams.${team.id}.teamLeadId`,
        ),
      );
    } else if (lead.teamId !== team.id) {
      issues.push(
        issue(
          "team_lead_mismatch",
          `Team Lead ${lead.id} is not bound to team ${team.id}`,
          `teams.${team.id}.teamLeadId`,
        ),
      );
    }
  }

  if (input.hierarchy) {
    if (input.hierarchy.orgId !== input.organization.id) {
      issues.push(
        issue(
          "org_mismatch",
          "Hierarchy orgId does not match organization",
          "hierarchy.orgId",
        ),
      );
    }

    for (const node of input.hierarchy.teams) {
      if (!teamIds.has(node.teamId)) {
        issues.push(
          issue(
            "missing_team",
            `Hierarchy references unknown team ${node.teamId}`,
            `hierarchy.teams.${node.teamId}`,
          ),
        );
      }
    }

    issues.push(
      ...validateGatedHierarchyLayers(input.hierarchy, flags),
    );
  }

  for (const assignment of input.assignments ?? []) {
    if (assignment.orgId !== input.organization.id) {
      issues.push(
        issue(
          "org_mismatch",
          `Assignment ${assignment.id} org mismatch`,
          `assignments.${assignment.id}.orgId`,
        ),
      );
    }
    if (assignment.scopeType === "team" && !teamIds.has(assignment.scopeId)) {
      issues.push(
        issue(
          "missing_team",
          `Assignment ${assignment.id} references unknown team scope ${assignment.scopeId}`,
          `assignments.${assignment.id}.scopeId`,
        ),
      );
    }
  }

  return { valid: issues.length === 0, issues };
}

export function validateGatedHierarchyLayers(
  hierarchy: OrganizationHierarchy,
  flags: WorkforceFeatureFlags,
): OrganizationValidationIssue[] {
  const issues: OrganizationValidationIssue[] = [];

  if (hierarchy.managers?.length && !flags.managersEnabled) {
    issues.push(
      issue(
        "tier_gated",
        "Managers present in hierarchy but managersEnabled is false",
        "hierarchy.managers",
      ),
    );
  }
  if (hierarchy.directors?.length && !flags.directorsEnabled) {
    issues.push(
      issue(
        "tier_gated",
        "Directors present in hierarchy but directorsEnabled is false",
        "hierarchy.directors",
      ),
    );
  }
  if (hierarchy.vicePresidents?.length && !flags.vpsEnabled) {
    issues.push(
      issue(
        "tier_gated",
        "Vice Presidents present in hierarchy but vpsEnabled is false",
        "hierarchy.vicePresidents",
      ),
    );
  }

  for (const node of hierarchy.managers ?? []) {
    for (const teamId of node.supervisedTeamIds) {
      if (!findTeamInHierarchy(hierarchy, teamId)) {
        issues.push(
          issue(
            "missing_team",
            `Manager ${node.managerId} supervises unknown team ${teamId}`,
            `hierarchy.managers.${node.managerId}`,
          ),
        );
      }
    }
  }

  return issues;
}

export function assertValidOrganizationStructure(
  input: ValidateOrganizationStructureInput,
): void {
  const result = validateOrganizationStructure(input);
  if (!result.valid) {
    const detail = result.issues
      .map((entry) => `${entry.code}: ${entry.message}`)
      .join("; ");
    throw new Error(`Invalid organization structure — ${detail}`);
  }
}
