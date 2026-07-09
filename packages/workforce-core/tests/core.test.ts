import { describe, expect, it } from "vitest";
import {
  assertCanPerformAction,
  assertFeatureFlagDependency,
  buildOrganizationHierarchy,
  createOrganization,
  createTeam,
  getRoleDefinition,
  mergeSpecialistPermissions,
  normalizeFeatureFlags,
  validateOrganizationStructure,
} from "../src/index.js";

const NOW = "2026-07-09T20:00:00.000Z";

describe("workforce-core", () => {
  it("creates organization with launch-default feature flags", () => {
    const org = createOrganization({
      id: "org-1",
      name: "Acme",
      now: NOW,
    });

    expect(org.featureFlags.managersEnabled).toBe(false);
  });

  it("validates team and team lead binding", () => {
    const org = createOrganization({ id: "org-1", name: "Acme", now: NOW });
    const teamLead = {
      id: "tl-1",
      orgId: "org-1",
      teamId: "team-1",
      role: "team_lead" as const,
      status: "active" as const,
    };
    const team = createTeam({
      id: "team-1",
      orgId: "org-1",
      teamProductId: "marketing-team",
      name: "Marketing Team",
      teamLead,
      now: NOW,
    });

    const valid = validateOrganizationStructure({
      organization: org,
      teams: [team],
      teamLeads: [teamLead],
      hierarchy: buildOrganizationHierarchy({ orgId: org.id, teams: [team], generatedAt: NOW }),
    });

    expect(valid.valid).toBe(true);
  });

  it("rejects managers in hierarchy when feature flag is off", () => {
    const org = createOrganization({ id: "org-1", name: "Acme", now: NOW });
    const hierarchy = buildOrganizationHierarchy({ orgId: org.id, teams: [], generatedAt: NOW });
    hierarchy.managers = [{ managerId: "mgr-1", supervisedTeamIds: [] }];

    const result = validateOrganizationStructure({
      organization: org,
      teams: [],
      hierarchy,
    });

    expect(result.valid).toBe(false);
    expect(result.issues.some((issue) => issue.code === "tier_gated")).toBe(true);
  });

  it("enforces specialist permission envelope", () => {
    const permissions = mergeSpecialistPermissions(
      { canDo: ["schedule"], cannotDo: [] },
      { cannotDo: ["bill"] },
    );

    expect(() => assertCanPerformAction(permissions, "bill")).toThrow();
    expect(() => assertCanPerformAction(permissions, "schedule")).not.toThrow();
  });

  it("exposes role registry metadata", () => {
    const teamLead = getRoleDefinition("team_lead");
    const specialist = getRoleDefinition("specialist");

    expect(teamLead.customerVisible).toBe(true);
    expect(specialist.customerVisible).toBe(false);
  });

  it("requires director flag chain", () => {
    const flags = normalizeFeatureFlags({
      directorsEnabled: true,
      managersEnabled: false,
    });
    expect(() => assertFeatureFlagDependency(flags)).toThrow();
  });
});
