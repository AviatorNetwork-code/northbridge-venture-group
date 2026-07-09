import { createRequestOwner } from "@northbridge/workforce-contracts";
import { createRouteScore } from "../types/candidate.js";
function countTagOverlap(requestTags, ruleTags) {
    if (!requestTags?.length || !ruleTags?.length)
        return 0;
    const ruleSet = new Set(ruleTags);
    return requestTags.filter((tag) => ruleSet.has(tag)).length;
}
function ruleMatchesRequest(rule, request) {
    if (!rule.enabled)
        return false;
    if (rule.routeTo.ownerType === "nordi")
        return false;
    if (rule.match.channel && rule.match.channel !== request.channel) {
        return false;
    }
    const intentOverlap = countTagOverlap(request.payload.intentTags, rule.match.intentTags);
    const capabilityOverlap = countTagOverlap(request.payload.capabilityTags, rule.match.capabilityTags);
    const requiresIntent = Boolean(rule.match.intentTags?.length);
    const requiresCapability = Boolean(rule.match.capabilityTags?.length);
    if (requiresIntent && intentOverlap === 0)
        return false;
    if (requiresCapability && capabilityOverlap === 0)
        return false;
    if (!requiresIntent && !requiresCapability && !rule.match.channel)
        return false;
    return true;
}
function scoreRuleMatch(rule, request) {
    const intentOverlap = countTagOverlap(request.payload.intentTags, rule.match.intentTags);
    const capabilityOverlap = countTagOverlap(request.payload.capabilityTags, rule.match.capabilityTags);
    const intentTotal = rule.match.intentTags?.length ?? 0;
    const capabilityTotal = rule.match.capabilityTags?.length ?? 0;
    const matchParts = [];
    if (intentTotal > 0) {
        matchParts.push(intentOverlap / intentTotal);
    }
    if (capabilityTotal > 0) {
        matchParts.push(capabilityOverlap / capabilityTotal);
    }
    if (rule.match.channel) {
        matchParts.push(1);
    }
    const matchRatio = matchParts.length > 0
        ? matchParts.reduce((sum, part) => sum + part, 0) / matchParts.length
        : 0.5;
    const priorityBoost = Math.min(rule.priority, 100) / 200;
    return Math.min(1, matchRatio * 0.75 + priorityBoost);
}
export class RuleBasedRouteResolver {
    strategyId = "rule-based";
    async resolve(request, _context, rules) {
        const candidates = [];
        for (const rule of rules.rules) {
            if (!ruleMatchesRequest(rule, request))
                continue;
            if (rule.routeTo.ownerType === "nordi")
                continue;
            const owner = createRequestOwner(request.orgId, rule.routeTo.ownerType, rule.routeTo.ownerId);
            const scoreValue = scoreRuleMatch(rule, request);
            candidates.push({
                owner,
                score: createRouteScore(scoreValue, this.strategyId),
                reasons: [
                    {
                        code: "RULE_MATCH",
                        description: `Matched routing rule ${rule.ruleId}`,
                        ruleId: rule.ruleId,
                    },
                ],
                teamProductId: rule.routeTo.teamProductId,
                capabilityTags: rule.match.capabilityTags,
            });
        }
        return candidates.sort((a, b) => b.score.value - a.score.value);
    }
}
