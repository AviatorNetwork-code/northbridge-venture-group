import { describe, expect, it } from "vitest";
import { createRequestOwner } from "@northbridge/workforce-contracts";
import {
  applyRoutePolicy,
  detectAmbiguousRouting,
  filterCandidatesByEntitlement,
  filterCandidatesByFeatureFlags,
} from "../src/policy/enforce.js";
import { createRouteScore } from "../src/types/candidate.js";
import type { RouteCandidate } from "../src/types/candidate.js";
import { DEFAULT_ROUTE_POLICY } from "../src/policy/defaults.js";

const ORG = "org-test";

function candidate(
  type: "team" | "manager" | "director" | "vice_president",
  id: string,
  score = 0.9,
): RouteCandidate {
  return {
    owner: createRequestOwner(ORG, type, id),
    score: createRouteScore(score, "test"),
    reasons: [{ code: "TEST", description: "test candidate" }],
  };
}

describe("applyRoutePolicy", () => {
  it("filters unentitled team candidates", () => {
    const result = applyRoutePolicy(
      [candidate("team", "team-unlisted"), candidate("team", "team-listed", 0.8)],
      {
        orgId: ORG,
        featureFlags: {
          managersEnabled: false,
          directorsEnabled: false,
          vpsEnabled: false,
        },
        entitledTeamIds: ["team-listed"],
        now: new Date().toISOString(),
      },
      DEFAULT_ROUTE_POLICY,
    );

    expect(result.candidates).toHaveLength(1);
    expect(result.candidates[0].owner.id).toBe("team-listed");
    expect(result.rejectedReasons.some((r) => r.code === "ENTITLEMENT_DENIED")).toBe(true);
  });

  it("rejects manager candidates when feature flag is off", () => {
    const result = applyRoutePolicy(
      [candidate("manager", "mgr-1")],
      {
        orgId: ORG,
        featureFlags: {
          managersEnabled: false,
          directorsEnabled: false,
          vpsEnabled: false,
        },
        entitledTeamIds: [],
        now: new Date().toISOString(),
      },
      DEFAULT_ROUTE_POLICY,
    );

    expect(result.candidates).toHaveLength(0);
    expect(result.rejectedReasons.some((r) => r.code === "FEATURE_FLAG_DENIED")).toBe(true);
  });

  it("accepts future hierarchy owner types when flags are enabled", () => {
    const result = applyRoutePolicy(
      [candidate("manager", "mgr-1"), candidate("director", "dir-1"), candidate("vice_president", "vp-1")],
      {
        orgId: ORG,
        featureFlags: {
          managersEnabled: true,
          directorsEnabled: true,
          vpsEnabled: true,
        },
        entitledTeamIds: [],
        now: new Date().toISOString(),
      },
      DEFAULT_ROUTE_POLICY,
    );

    expect(result.candidates).toHaveLength(3);
  });

  it("rejects candidates below minimum score", () => {
    const result = applyRoutePolicy(
      [candidate("team", "team-listed", 0.2)],
      {
        orgId: ORG,
        featureFlags: {
          managersEnabled: false,
          directorsEnabled: false,
          vpsEnabled: false,
        },
        entitledTeamIds: ["team-listed"],
        now: new Date().toISOString(),
      },
      DEFAULT_ROUTE_POLICY,
    );

    expect(result.candidates).toHaveLength(0);
    expect(result.rejectedReasons.some((r) => r.code === "SCORE_BELOW_MINIMUM")).toBe(true);
  });
});

describe("detectAmbiguousRouting", () => {
  it("detects close top scores as ambiguous", () => {
    const ambiguous = detectAmbiguousRouting(
      [candidate("team", "team-a", 0.81), candidate("team", "team-b", 0.8)],
      DEFAULT_ROUTE_POLICY,
    );
    expect(ambiguous).toBe(true);
  });

  it("does not flag clear winner", () => {
    const ambiguous = detectAmbiguousRouting(
      [candidate("team", "team-a", 0.95), candidate("team", "team-b", 0.6)],
      DEFAULT_ROUTE_POLICY,
    );
    expect(ambiguous).toBe(false);
  });
});

describe("filter helpers", () => {
  it("filterCandidatesByEntitlement keeps only entitled teams", () => {
    const filtered = filterCandidatesByEntitlement(
      [candidate("team", "a"), candidate("team", "b")],
      ["b"],
    );
    expect(filtered).toHaveLength(1);
    expect(filtered[0].owner.id).toBe("b");
  });

  it("filterCandidatesByFeatureFlags respects manager tier", () => {
    const filtered = filterCandidatesByFeatureFlags([candidate("manager", "mgr-1")], {
      orgId: ORG,
      featureFlags: {
        managersEnabled: true,
        directorsEnabled: false,
        vpsEnabled: false,
      },
      entitledTeamIds: [],
      now: new Date().toISOString(),
    });
    expect(filtered).toHaveLength(1);
  });
});
