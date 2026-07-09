import type { RequestOwner } from "@northbridge/workforce-contracts";
import {
  isDirectorTierEnabled,
  isManagerTierEnabled,
  isVpTierEnabled,
} from "@northbridge/workforce-core";
import type { RouteCandidate } from "../types/candidate.js";
import type { RoutePolicy } from "../types/policy.js";
import type { RoutingContext } from "../types/request.js";
import type { RouteReason } from "../types/candidate.js";

export interface PolicyEnforcementResult {
  candidates: RouteCandidate[];
  rejectedReasons: RouteReason[];
}

function isTeamEntitled(
  owner: RequestOwner,
  entitledTeamIds: string[],
): boolean {
  if (owner.type !== "team") return true;
  return entitledTeamIds.includes(owner.id ?? "");
}

function isOwnerTierEnabled(
  owner: RequestOwner,
  context: RoutingContext,
): boolean {
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

export function filterCandidatesByEntitlement(
  candidates: RouteCandidate[],
  entitledTeamIds: string[],
): RouteCandidate[] {
  return candidates.filter((candidate) =>
    isTeamEntitled(candidate.owner, entitledTeamIds),
  );
}

export function filterCandidatesByFeatureFlags(
  candidates: RouteCandidate[],
  context: RoutingContext,
): RouteCandidate[] {
  return candidates.filter((candidate) =>
    isOwnerTierEnabled(candidate.owner, context),
  );
}

export function rejectNordiCandidates(
  candidates: RouteCandidate[],
): RouteCandidate[] {
  return candidates.filter((candidate) => candidate.owner.type !== "nordi");
}

export function applyRoutePolicy(
  candidates: RouteCandidate[],
  context: RoutingContext,
  policy: RoutePolicy,
): PolicyEnforcementResult {
  let filtered = rejectNordiCandidates(candidates);
  const rejectedReasons: RouteReason[] = [];

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

export function detectAmbiguousRouting(
  candidates: RouteCandidate[],
  policy: RoutePolicy,
): boolean {
  if (candidates.length < 2) return false;
  const gap = policy.ambiguityScoreGap ?? DEFAULT_AMBIGUITY_GAP;
  const [first, second] = candidates;
  return Math.abs(first.score.value - second.score.value) <= gap;
}
