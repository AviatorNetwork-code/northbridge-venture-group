import { describe, expect, it } from "vitest";
import {
  buildExampleSkywardOrganizationInput,
  buildOrganizationContext,
  assertValidOrganizationIntelligence,
} from "@northbridge/operations-intelligence";

/**
 * Smoke tests confirming NDP consumes @northbridge/operations-intelligence.
 * Full OIL validation lives in the NEOS package test suite.
 */
describe("Operations Intelligence package consumption", () => {
  it("builds example organization context from package exports", () => {
    const input = buildExampleSkywardOrganizationInput();
    assertValidOrganizationIntelligence(input);

    const context = buildOrganizationContext(input);
    expect(context.activeServices.length).toBeGreaterThan(0);
    expect(context.workforceTeamIds).toContain("team-marketing");
  });
});
