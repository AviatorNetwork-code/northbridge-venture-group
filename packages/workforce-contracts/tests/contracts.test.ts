import { describe, expect, it } from "vitest";
import {
  createRequestOwner,
  formatRequestOwner,
  organizationSchema,
  parseTeam,
  recommendationSchema,
  requestOwnerSchema,
  safeParseOrganization,
  taskSchema,
  teamSchema,
  validateWithSchema,
} from "../src/index.js";

const NOW = "2026-07-09T20:00:00.000Z";

describe("workforce-contracts", () => {
  it("parses a valid organization with default feature flags", () => {
    const org = organizationSchema.parse({
      id: "org-1",
      name: "Acme Dental",
      createdAt: NOW,
      updatedAt: NOW,
    });

    expect(org.featureFlags.managersEnabled).toBe(false);
    expect(org.featureFlags.directorsEnabled).toBe(false);
    expect(org.featureFlags.vpsEnabled).toBe(false);
  });

  it("rejects organization with unknown fields", () => {
    const result = safeParseOrganization({
      id: "org-1",
      name: "Acme",
      createdAt: NOW,
      updatedAt: NOW,
      nordiEnabled: true,
    });

    expect(result.success).toBe(false);
  });

  it("parses team with roster references", () => {
    const team = parseTeam({
      id: "team-1",
      orgId: "org-1",
      teamProductId: "marketing-team",
      name: "Marketing Team",
      status: "active",
      teamLeadId: "tl-1",
      specialistIds: ["sp-1", "sp-2"],
      createdAt: NOW,
      updatedAt: NOW,
    });

    expect(team.specialistIds).toHaveLength(2);
  });

  it("enforces request owner invariants", () => {
    expect(
      requestOwnerSchema.safeParse({
        orgId: "org-1",
        type: "nordi",
      }).success,
    ).toBe(true);

    expect(
      requestOwnerSchema.safeParse({
        orgId: "org-1",
        type: "nordi",
        id: "should-not-exist",
      }).success,
    ).toBe(false);

    expect(
      requestOwnerSchema.safeParse({
        orgId: "org-1",
        type: "team",
      }).success,
    ).toBe(false);
  });

  it("formats request owner strings", () => {
    expect(formatRequestOwner(createRequestOwner("org-1", "nordi"))).toBe(
      "nordi",
    );
    expect(
      formatRequestOwner(createRequestOwner("org-1", "team", "marketing")),
    ).toBe("team:marketing");
  });

  it("requires recommendation reasons", () => {
    const result = validateWithSchema(recommendationSchema, {
      id: "rec-1",
      orgId: "org-1",
      type: "wait",
      reasons: [],
      createdAt: NOW,
    });

    expect(result.valid).toBe(false);
    expect(result.issues.length).toBeGreaterThan(0);
  });

  it("parses task envelope fields", () => {
    const task = taskSchema.parse({
      id: "task-1",
      orgId: "org-1",
      teamId: "team-1",
      assignedByTeamLeadId: "tl-1",
      status: "pending",
      permissions: { canDo: ["schedule"], cannotDo: ["bill"] },
      context: { note: "reschedule three appointments" },
      createdAt: NOW,
      updatedAt: NOW,
    });

    expect(task.permissions.canDo).toContain("schedule");
  });
});
