import { isDirectorTierEnabled, isManagerTierEnabled, isVpTierEnabled, } from "@northbridge/workforce-core";
function isTeamEntitled(owner, entitledTeamIds) {
    if (owner.type !== "team")
        return true;
    return entitledTeamIds.includes(owner.id ?? "");
}
function isOwnerTierEnabled(owner, context) {
    switch (owner.type) {
        case "team":
        case "nordi":
            return true;
        case "manager":
            return isManagerTierEnabled(context.featureFlags);
        case "director":
            return isDirectorTierEnabled(context.featureFlags);
        case "vice_president":
            return isVpTierEnabled(context.featureFlags);
        default:
            return false;
    }
}
export function filterCandidatesByEntitlement(candidates, entitledTeamIds) {
    return candidates.filter((candidate) => isTeamEntitled(candidate.owner, entitledTeamIds));
}
export function filterCandidatesByFeatureFlags(candidates, context) {
    return candidates.filter((candidate) => isOwnerTierEnabled(candidate.owner, context));
}
export function rejectNordiCandidates(candidates) {
    return candidates.filter((candidate) => candidate.owner.type !== "nordi");
}
export function applyRoutePolicy(candidates, context, policy) {
    let filtered = rejectNordiCandidates(candidates);
    const rejectedReasons = [];
    if (policy.requireEntitlement) {
        const before = filtered.length;
        filtered = filterCandidatesByEntitlement(filtered, context.entitledTeamIds);
        if (filtered.length < before) {
            rejectedReasons.push({
                code: "ENTITLEMENT_DENIED",
                description: "One or more candidates rejected due to team entitlement",
            });
        }
    }
    if (policy.enforceFeatureFlags) {
        const before = filtered.length;
        filtered = filterCandidatesByFeatureFlags(filtered, context);
        if (filtered.length < before) {
            rejectedReasons.push({
                code: "FEATURE_FLAG_DENIED",
                description: "One or more candidates rejected due to disabled hierarchy tier",
            });
        }
    }
    const beforeScore = filtered.length;
    filtered = filtered.filter((candidate) => candidate.score.value >= policy.minimumScore);
    if (filtered.length < beforeScore) {
        rejectedReasons.push({
            code: "SCORE_BELOW_MINIMUM",
            description: `Candidates below minimum score ${policy.minimumScore} rejected`,
        });
    }
    return {
        candidates: filtered.sort((a, b) => b.score.value - a.score.value),
        rejectedReasons,
    };
}
const DEFAULT_AMBIGUITY_GAP = 0.05;
export function detectAmbiguousRouting(candidates, policy) {
    if (candidates.length < 2)
        return false;
    const gap = policy.ambiguityScoreGap ?? DEFAULT_AMBIGUITY_GAP;
    const [first, second] = candidates;
    return Math.abs(first.score.value - second.score.value) <= gap;
}
