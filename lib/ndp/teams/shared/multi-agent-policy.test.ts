import { describe, expect, it } from "vitest";
import {
  ensureMultiAgentSelection,
  isSimpleTeamRequest,
  NDP_DEFAULT_TEAM_LEAD_POLICY,
  NDP_MULTI_AGENT_LAUNCH_TEAM_IDS,
  resolveDelegationExecutionMode,
} from "./multi-agent-policy.js";

describe("NDP multi-agent default policy", () => {
  it("defines all nine launch teams", () => {
    expect(NDP_MULTI_AGENT_LAUNCH_TEAM_IDS).toHaveLength(9);
    expect(NDP_MULTI_AGENT_LAUNCH_TEAM_IDS).toContain("team-marketing");
    expect(NDP_MULTI_AGENT_LAUNCH_TEAM_IDS).toContain("team-general-service");
  });

  it("uses parallel execution and Team Lead-only customer voice by default", () => {
    expect(NDP_DEFAULT_TEAM_LEAD_POLICY.delegationExecutionMode).toBe("parallel");
    expect(NDP_DEFAULT_TEAM_LEAD_POLICY.customerFacingViaTeamLeadOnly).toBe(true);
    expect(NDP_DEFAULT_TEAM_LEAD_POLICY.escalateOnConflict).toBe(true);
  });

  it("classifies broad requests as not simple", () => {
    expect(
      isSimpleTeamRequest({
        message: "I want more customers.",
        capabilityTags: ["capability:customer_acquisition"],
      }),
    ).toBe(false);

    expect(
      isSimpleTeamRequest({
        message: "Help us improve our marketing strategy.",
      }),
    ).toBe(false);
  });

  it("classifies narrow KPI lookups as simple", () => {
    expect(
      isSimpleTeamRequest({
        message: "What is our cost per lead?",
        capabilityTags: ["capability:analytics"],
      }),
    ).toBe(true);

    expect(
      isSimpleTeamRequest({
        message: "Show me the current campaign CTR",
        capabilityTags: ["capability:analytics"],
      }),
    ).toBe(true);
  });

  it("honors explicit simple request scope metadata", () => {
    expect(
      isSimpleTeamRequest({
        message: "Broad sounding message",
        metadata: { requestScope: "simple" },
      }),
    ).toBe(true);
  });

  it("ensures multi-agent minimum for broad requests", () => {
    const result = ensureMultiAgentSelection(new Set(["sp-a"]), {
      simple: false,
      available: ["sp-a", "sp-b", "sp-c"],
      broadDefault: ["sp-b", "sp-c"],
      minSpecialists: 2,
    });

    expect(result).toHaveLength(2);
    expect(result).toContain("sp-a");
    expect(result).toContain("sp-b");
  });

  it("does not expand selection for simple requests", () => {
    const result = ensureMultiAgentSelection(new Set(["sp-a"]), {
      simple: true,
      available: ["sp-a", "sp-b"],
      broadDefault: ["sp-b"],
      minSpecialists: 2,
    });

    expect(result).toEqual(["sp-a"]);
  });

  it("resolves sequential execution when ordering metadata is set", () => {
    expect(resolveDelegationExecutionMode({ executionOrder: "sequential" })).toBe(
      "sequential",
    );
    expect(resolveDelegationExecutionMode()).toBe("parallel");
  });
});
