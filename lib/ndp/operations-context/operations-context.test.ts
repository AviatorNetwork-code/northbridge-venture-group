import { describe, expect, it } from "vitest";
import {
  buildOperationsContextReferences,
  buildOperationsIntelligenceContextForOrg,
  createExampleOperationsIntelligenceLoader,
  resolveConsumedOperationsSections,
  resolveOrganizationContextRef,
  resolveTeamOperationsContextReference,
} from "@/lib/ndp/operations-context";
import { MARKETING_TEAM_ID } from "@/lib/ndp/teams/marketing";

const ORG = "org-acme";
const NOW = "2026-07-09T23:30:00.000Z";

describe("NDP Operations Context adoption", () => {
  it("resolves stable organization context reference keys", () => {
    expect(resolveOrganizationContextRef({ organizationId: ORG })).toBe(
      "operations-intelligence:org-acme:v1.0.0",
    );
  });

  it("builds operations context references for prompt assembly", () => {
    const refs = buildOperationsContextReferences({
      organizationId: ORG,
      customerContextRef: "customer:cust-1",
    });

    expect(refs.organizationContextRef).toContain("operations-intelligence:org-acme");
    expect(refs.customerContextRef).toBe("customer:cust-1");
  });

  it("builds organization intelligence context for any org id", () => {
    const context = buildOperationsIntelligenceContextForOrg(ORG, { now: () => NOW });

    expect(context.organizationId).toBe(ORG);
    expect(context.profile.organizationId).toBe(ORG);
    expect(context.activeServices.length).toBeGreaterThan(0);
    expect(context.builtAt).toBe(NOW);
  });

  it("loads operations intelligence from in-memory loader", async () => {
    const loader = createExampleOperationsIntelligenceLoader([ORG], { now: () => NOW });
    const context = await loader.load(ORG, "cust-1");

    expect(context.organizationId).toBe(ORG);
    expect(context.workforceTeamIds).toContain("team-marketing");
  });

  it("resolves marketing team consumed operations sections from package metadata", () => {
    const reference = resolveTeamOperationsContextReference(MARKETING_TEAM_ID);
    const sections = resolveConsumedOperationsSections(MARKETING_TEAM_ID);

    expect(reference?.teamId).toBe(MARKETING_TEAM_ID);
    expect(sections).toContain("profile");
    expect(sections).toContain("goals");
  });
});

describe("Deprecated lib/ndp/organization shim", () => {
  it("re-exports package symbols", async () => {
    const shim = await import("@/lib/ndp/organization");
    expect(shim.buildOrganizationContext).toBeDefined();
    expect(shim.buildExampleSkywardOrganizationInput).toBeDefined();
  });
});
