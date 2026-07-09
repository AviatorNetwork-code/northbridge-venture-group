import { describe, expect, it } from "vitest";
import {
  CapabilityRouteResolver,
  CompositeRouteResolver,
  RuleBasedRouteResolver,
} from "../src/resolvers/index.js";
import type { RoutingRequest } from "../src/types/request.js";
import type { RouteRuleSet } from "../src/types/rules.js";

const ORG = "org-test";
const NOW = "2026-07-09T12:00:00.000Z";

function baseRequest(overrides: Partial<RoutingRequest> = {}): RoutingRequest {
  return {
    requestId: "req-1",
    orgId: ORG,
    channel: "team",
    payload: {},
    entitledTeamIds: ["team-alpha", "team-beta"],
    receivedAt: NOW,
    ...overrides,
  };
}

function baseContext() {
  return {
    orgId: ORG,
    featureFlags: {
      managersEnabled: false,
      directorsEnabled: false,
      vpsEnabled: false,
    },
    entitledTeamIds: ["team-alpha", "team-beta"],
    now: NOW,
  };
}

function sampleRules(): RouteRuleSet {
  return {
    orgId: ORG,
    version: 1,
    rules: [
      {
        ruleId: "rule-acquisition",
        priority: 10,
        match: { capabilityTags: ["capability:customer_acquisition"] },
        routeTo: { ownerType: "team", ownerId: "team-alpha", teamProductId: "tp-1" },
        enabled: true,
      },
      {
        ruleId: "rule-scheduling",
        priority: 10,
        match: { capabilityTags: ["capability:scheduling"] },
        routeTo: { ownerType: "team", ownerId: "team-beta", teamProductId: "tp-2" },
        enabled: true,
      },
      {
        ruleId: "rule-intent-billing",
        priority: 20,
        match: { intentTags: ["intent:billing"] },
        routeTo: { ownerType: "team", ownerId: "team-alpha" },
        enabled: true,
      },
    ],
  };
}

describe("RuleBasedRouteResolver", () => {
  it("routes by intent tag match", async () => {
    const resolver = new RuleBasedRouteResolver();
    const candidates = await resolver.resolve(
      baseRequest({ payload: { intentTags: ["intent:billing"] } }),
      baseContext(),
      sampleRules(),
    );

    expect(candidates).toHaveLength(1);
    expect(candidates[0].owner).toEqual({ orgId: ORG, type: "team", id: "team-alpha" });
    expect(candidates[0].reasons[0].code).toBe("RULE_MATCH");
  });

  it("routes by capability tag match", async () => {
    const resolver = new RuleBasedRouteResolver();
    const candidates = await resolver.resolve(
      baseRequest({ payload: { capabilityTags: ["capability:scheduling"] } }),
      baseContext(),
      sampleRules(),
    );

    expect(candidates[0].owner.id).toBe("team-beta");
  });

  it("returns no candidates when nothing matches", async () => {
    const resolver = new RuleBasedRouteResolver();
    const candidates = await resolver.resolve(
      baseRequest({ payload: { intentTags: ["intent:unknown"] } }),
      baseContext(),
      sampleRules(),
    );

    expect(candidates).toHaveLength(0);
  });

  it("ignores disabled nordi rules", async () => {
    const resolver = new RuleBasedRouteResolver();
    const rules: RouteRuleSet = {
      orgId: ORG,
      version: 1,
      rules: [
        {
          ruleId: "nordi-rule",
          priority: 100,
          match: { intentTags: ["intent:any"] },
          routeTo: { ownerType: "nordi", ownerId: "ignored" },
          enabled: true,
        },
      ],
    };

    const candidates = await resolver.resolve(
      baseRequest({ payload: { intentTags: ["intent:any"] } }),
      baseContext(),
      rules,
    );

    expect(candidates).toHaveLength(0);
  });
});

describe("CapabilityRouteResolver", () => {
  it("scores capability overlap with confidence metadata", async () => {
    const resolver = new CapabilityRouteResolver();
    const candidates = await resolver.resolve(
      baseRequest({
        payload: { capabilityTags: ["capability:customer_acquisition"] },
      }),
      baseContext(),
      sampleRules(),
    );

    expect(candidates[0].score.strategy).toBe("capability-based");
    expect(candidates[0].score.value).toBeGreaterThan(0);
    expect(candidates[0].reasons[0].code).toBe("CAPABILITY_MATCH");
  });
});

describe("CompositeRouteResolver", () => {
  it("merges resolver outputs and ranks by combined score", async () => {
    const resolver = new CompositeRouteResolver([
      new RuleBasedRouteResolver(),
      new CapabilityRouteResolver(),
    ]);

    const candidates = await resolver.resolve(
      baseRequest({
        payload: {
          intentTags: ["intent:billing"],
          capabilityTags: ["capability:customer_acquisition"],
        },
      }),
      baseContext(),
      sampleRules(),
    );

    expect(candidates.length).toBeGreaterThan(0);
    expect(candidates[0].score.strategy).toBe("composite");
    expect(candidates[0].reasons.length).toBeGreaterThan(1);
  });
});
