import { createRequestOwner } from "@northbridge/workforce-contracts";
import { createRouteScore } from "../types/candidate.js";
function capabilityOverlap(requestTags, ruleTags) {
    if (!requestTags?.length || !ruleTags?.length) {
        return { overlap: 0, total: ruleTags?.length ?? 0 };
    }
    const ruleSet = new Set(ruleTags);
    const overlap = requestTags.filter((tag) => ruleSet.has(tag)).length;
    return { overlap, total: ruleTags.length };
}
function ruleHasCapabilityMatch(rule, request) {
    if (!rule.enabled)
        return false;
    if (rule.routeTo.ownerType === "nordi")
        return false;
    if (!rule.match.capabilityTags?.length)
        return false;
    if (!request.payload.capabilityTags?.length)
        return false;
    return capabilityOverlap(request.payload.capabilityTags, rule.match.capabilityTags).overlap > 0;
}
export class CapabilityRouteResolver {
    strategyId = "capability-based";
    async resolve(request, _context, rules) {
        const candidates = [];
        for (const rule of rules.rules) {
            if (!ruleHasCapabilityMatch(rule, request))
                continue;
            const { overlap, total } = capabilityOverlap(request.payload.capabilityTags, rule.match.capabilityTags);
            const owner = createRequestOwner(request.orgId, rule.routeTo.ownerType, rule.routeTo.ownerId);
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
