import { describe, expect, it } from "vitest";
import { createRequestOwner } from "@northbridge/workforce-contracts";
import {
  buildDedupKey,
  createDefaultCompositeResolver,
  createWorkforceRouter,
  RuleBasedRouteResolver,
  WorkforceRouterError,
} from "../src/index.js";
import type { RouteRuleSet } from "../src/types/rules.js";
import type { RoutingRequest } from "../src/types/request.js";

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
    traceId: "trace-123",
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
        routeTo: { ownerType: "team", ownerId: "team-alpha" },
        enabled: true,
      },
      {
        ruleId: "rule-scheduling",
        priority: 10,
        match: { capabilityTags: ["capability:scheduling"] },
        routeTo: { ownerType: "team", ownerId: "team-beta" },
        enabled: true,
      },
      {
        ruleId: "rule-ops",
        priority: 5,
        match: { capabilityTags: ["capability:technical_operations"] },
        routeTo: { ownerType: "team", ownerId: "team-alpha" },
        enabled: true,
      },
      {
        ruleId: "rule-manager",
        priority: 50,
        match: { intentTags: ["intent:escalation"] },
        routeTo: { ownerType: "manager", ownerId: "mgr-1" },
        enabled: true,
      },
    ],
  };
}

describe("DefaultWorkforceRouter", () => {
  it("assigns team owner for capability match", async () => {
    const router = createWorkforceRouter({
      resolver: createDefaultCompositeResolver(),
    });

    const decision = await router.route({
      request: baseRequest({
        payload: { capabilityTags: ["capability:scheduling"] },
      }),
      context: baseContext(),
      rules: sampleRules(),
    });

    expect(decision.status).toBe("assigned");
    expect(decision.owner).toEqual({
      orgId: ORG,
      type: "team",
      id: "team-beta",
    });
    expect(decision.audit.routerVersion).toBe(1);
    expect(decision.audit.strategyIds).toContain("composite");
    expect(decision.audit.traceId).toBe("trace-123");
  });

  it("returns no_route when no rules match", async () => {
    const router = createWorkforceRouter({
      resolver: new RuleBasedRouteResolver(),
    });

    const decision = await router.route({
      request: baseRequest({ payload: { intentTags: ["intent:unknown"] } }),
      context: baseContext(),
      rules: sampleRules(),
    });

    expect(decision.status).toBe("no_route");
    expect(decision.owner).toBeUndefined();
    expect(decision.selectedReasons.some((r) => r.code === "NO_MATCH")).toBe(true);
  });

  it("defers ambiguous top candidates", async () => {
    const rules: RouteRuleSet = {
      orgId: ORG,
      version: 1,
      rules: [
        {
          ruleId: "rule-a",
          priority: 10,
          match: { capabilityTags: ["capability:shared"] },
          routeTo: { ownerType: "team", ownerId: "team-alpha" },
          enabled: true,
        },
        {
          ruleId: "rule-b",
          priority: 10,
          match: { capabilityTags: ["capability:shared"] },
          routeTo: { ownerType: "team", ownerId: "team-beta" },
          enabled: true,
        },
      ],
    };

    const router = createWorkforceRouter({
      resolver: new RuleBasedRouteResolver(),
    });

    const decision = await router.route({
      request: baseRequest({ payload: { capabilityTags: ["capability:shared"] } }),
      context: baseContext(),
      rules,
    });

    expect(decision.status).toBe("deferred");
    expect(decision.selectedReasons.some((r) => r.code === "AMBIGUOUS_ROUTE")).toBe(true);
  });

  it("denies manager routing when feature flag is off", async () => {
    const router = createWorkforceRouter({
      resolver: new RuleBasedRouteResolver(),
    });

    const decision = await router.route({
      request: baseRequest({ payload: { intentTags: ["intent:escalation"] } }),
      context: baseContext(),
      rules: sampleRules(),
    });

    expect(decision.status).toBe("no_route");
    expect(decision.selectedReasons.some((r) => r.code === "FEATURE_FLAG_DENIED")).toBe(true);
  });

  it("returns existing owner for duplicate topic within dedup window", async () => {
    const router = createWorkforceRouter({
      resolver: new RuleBasedRouteResolver(),
    });

    const first = await router.route({
      request: baseRequest({
        dedupTopic: "topic-scheduling",
        payload: { capabilityTags: ["capability:scheduling"] },
      }),
      context: baseContext(),
      rules: sampleRules(),
    });

    const second = await router.route({
      request: baseRequest({
        requestId: "req-2",
        dedupTopic: "topic-scheduling",
        payload: { capabilityTags: ["capability:customer_acquisition"] },
      }),
      context: baseContext(),
      rules: sampleRules(),
    });

    expect(first.status).toBe("assigned");
    expect(second.status).toBe("assigned");
    expect(second.owner).toEqual(first.owner);
    expect(second.selectedReasons[0].code).toBe("DEDUP_MATCH");
  });

  it("transfers owner with audit trail", async () => {
    const router = createWorkforceRouter({
      resolver: new RuleBasedRouteResolver(),
    });

    const from = createRequestOwner(ORG, "team", "team-alpha");
    const to = createRequestOwner(ORG, "team", "team-beta");

    const decision = await router.transferOwner({
      orgId: ORG,
      requestId: "req-transfer",
      from,
      to,
      reason: "Customer requested scheduling team",
    });

    expect(decision.status).toBe("assigned");
    expect(decision.owner).toEqual(to);
    expect(decision.audit.previousOwner).toEqual(from);
    expect(decision.audit.strategyIds).toContain("transfer");
  });

  it("rejects nordi transfer targets", async () => {
    const router = createWorkforceRouter({
      resolver: new RuleBasedRouteResolver(),
    });

    await expect(
      router.transferOwner({
        orgId: ORG,
        requestId: "req-transfer",
        from: createRequestOwner(ORG, "team", "team-alpha"),
        to: createRequestOwner(ORG, "nordi"),
        reason: "invalid",
      }),
    ).rejects.toBeInstanceOf(WorkforceRouterError);
  });

  it("rejects transfer when source and destination are identical", async () => {
    const router = createWorkforceRouter({
      resolver: new RuleBasedRouteResolver(),
    });

    const owner = createRequestOwner(ORG, "team", "team-alpha");

    await expect(
      router.transferOwner({
        orgId: ORG,
        requestId: "req-transfer",
        from: owner,
        to: owner,
        reason: "noop",
      }),
    ).rejects.toMatchObject({ code: "owner_conflict" });
  });

  it("buildDedupKey is stable for normalized topics", () => {
    const keyA = buildDedupKey(ORG, "Topic-A");
    const keyB = buildDedupKey(ORG, "topic-a");
    expect(keyA).toBe(keyB);
  });

  it("selects highest scoring candidate when scores differ", async () => {
    const router = createWorkforceRouter({
      resolver: new RuleBasedRouteResolver(),
    });

    const decision = await router.route({
      request: baseRequest({
        payload: {
          capabilityTags: ["capability:technical_operations"],
          intentTags: ["intent:escalation"],
        },
      }),
      context: {
        ...baseContext(),
        featureFlags: {
          managersEnabled: true,
          directorsEnabled: false,
          vpsEnabled: false,
        },
      },
      rules: sampleRules(),
      policy: {
        requireEntitlement: true,
        enforceFeatureFlags: true,
        minimumScore: 0.3,
        allowNoRoute: true,
        ambiguityScoreGap: 0.01,
      },
    });

    expect(decision.status).toBe("assigned");
    expect(decision.owner?.type).toBe("manager");
  });
});
