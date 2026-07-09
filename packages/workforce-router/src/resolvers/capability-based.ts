import { createRequestOwner } from "@northbridge/workforce-contracts";
import type { RouteResolver } from "../types/resolver.js";
import type { RouteCandidate } from "../types/candidate.js";
import { createRouteScore } from "../types/candidate.js";
import type { RouteRule, RouteRuleSet } from "../types/rules.js";
import type { RoutingContext, RoutingRequest } from "../types/request.js";

function capabilityOverlap(
  requestTags: string[] | undefined,
  ruleTags: string[] | undefined,
): { overlap: number; total: number } {
  if (!requestTags?.length || !ruleTags?.length) {
    return { overlap: 0, total: ruleTags?.length ?? 0 };
  }
  const ruleSet = new Set(ruleTags);
  const overlap = requestTags.filter((tag) => ruleSet.has(tag)).length;
  return { overlap, total: ruleTags.length };
}

function ruleHasCapabilityMatch(rule: RouteRule, request: RoutingRequest): boolean {
  if (!rule.enabled) return false;
  if (rule.routeTo.ownerType === "nordi") return false;
  if (!rule.match.capabilityTags?.length) return false;
  if (!request.payload.capabilityTags?.length) return false;

  return capabilityOverlap(request.payload.capabilityTags, rule.match.capabilityTags).overlap > 0;
}

export class CapabilityRouteResolver implements RouteResolver {
  readonly strategyId = "capability-based";

  async resolve(
    request: RoutingRequest,
    _context: RoutingContext,
    rules: RouteRuleSet,
  ): Promise<RouteCandidate[]> {
    const candidates: RouteCandidate[] = [];

    for (const rule of rules.rules) {
      if (!ruleHasCapabilityMatch(rule, request)) continue;

      const { overlap, total } = capabilityOverlap(
        request.payload.capabilityTags,
        rule.match.capabilityTags,
      );

      const owner = createRequestOwner(
        request.orgId,
        rule.routeTo.ownerType,
        rule.routeTo.ownerId,
      );

      const scoreValue = Math.min(1, overlap / total + Math.min(rule.priority, 50) / 200);
      candidates.push({
        owner,
        score: createRouteScore(scoreValue, this.strategyId),
        reasons: [
          {
            code: "CAPABILITY_MATCH",
            description: `Matched ${overlap}/${total} capability tags via rule ${rule.ruleId}`,
            ruleId: rule.ruleId,
            evidenceRef: request.payload.capabilityTags?.join(","),
          },
        ],
        teamProductId: rule.routeTo.teamProductId,
        capabilityTags: rule.match.capabilityTags,
      });
    }

    return candidates.sort((a, b) => b.score.value - a.score.value);
  }
}
