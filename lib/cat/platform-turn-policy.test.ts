import { describe, expect, it } from "vitest";
import { resolveDiscoveryTurnPolicy } from "./platform-turn-policy";

describe("platform-turn-policy", () => {
  it("asks when required discovery fields are missing", () => {
    const decision = resolveDiscoveryTurnPolicy({
      industry: "dental",
      answeredQuestions: [],
    });
    expect(decision.action).toBe("ask");
  });

  it("confirms when website permission is pending", () => {
    const decision = resolveDiscoveryTurnPolicy({
      industry: "dental",
      employeeCount: 2,
      communicationChannels: ["Phone"],
      answeredQuestions: ["general-team-size", "general-customer-contact", "general-friction"],
      websitePermissionAsked: true,
      websitePermissionGranted: false,
    });
    expect(decision.action).toBe("confirm");
  });
});
