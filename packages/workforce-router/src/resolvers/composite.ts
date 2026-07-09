import type { RouteResolver } from "../types/resolver.js";
import type { RouteCandidate } from "../types/candidate.js";
import type { RoutingRequest, RoutingContext } from "../types/request.js";
import type { RouteRuleSet } from "../types/rules.js";
import { createRouteScore } from "../types/candidate.js";

function ownerKey(candidate: RouteCandidate): string {
  const { owner } = candidate;
  return `${owner.type}:${owner.id ?? ""}`;
}

function mergeReasons(
  existing: RouteCandidate["reasons"],
  incoming: RouteCandidate["reasons"],
): RouteCandidate["reasons"] {
  const seen = new Set(existing.map((reason) => `${reason.code}:${reason.ruleId ?? ""}`));
  const merged = [...existing];
  for (const reason of incoming) {
    const key = `${reason.code}:${reason.ruleId ?? ""}`;
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(reason);
    }
  }
  return merged;
}

export class CompositeRouteResolver implements RouteResolver {
  readonly strategyId = "composite";

  constructor(private readonly resolvers: RouteResolver[]) {
    if (resolvers.length === 0) {
      throw new Error("CompositeRouteResolver requires at least one resolver");
    }
  }

  async resolve(
    request: RoutingRequest,
    context: RoutingContext,
    rules: RouteRuleSet,
  ): Promise<RouteCandidate[]> {
    const merged = new Map<string, RouteCandidate>();

    for (const resolver of this.resolvers) {
      const candidates = await resolver.resolve(request, context, rules);
      for (const candidate of candidates) {
        const key = ownerKey(candidate);
        const existing = merged.get(key);
        if (!existing) {
          merged.set(key, candidate);
          continue;
        }

        const combinedScore = Math.min(
          1,
          existing.score.value * 0.5 + candidate.score.value * 0.5 + 0.05,
        );
        merged.set(key, {
          ...existing,
          score: createRouteScore(combinedScore, this.strategyId),
          reasons: mergeReasons(existing.reasons, candidate.reasons),
          teamProductId: existing.teamProductId ?? candidate.teamProductId,
          capabilityTags: existing.capabilityTags ?? candidate.capabilityTags,
        });
      }
    }

    return [...merged.values()].sort((a, b) => b.score.value - a.score.value);
  }
}
