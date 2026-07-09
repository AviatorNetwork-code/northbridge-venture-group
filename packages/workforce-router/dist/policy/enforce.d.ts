import type { RouteCandidate } from "../types/candidate.js";
import type { RoutePolicy } from "../types/policy.js";
import type { RoutingContext } from "../types/request.js";
import type { RouteReason } from "../types/candidate.js";
export interface PolicyEnforcementResult {
    candidates: RouteCandidate[];
    rejectedReasons: RouteReason[];
}
export declare function filterCandidatesByEntitlement(candidates: RouteCandidate[], entitledTeamIds: string[]): RouteCandidate[];
export declare function filterCandidatesByFeatureFlags(candidates: RouteCandidate[], context: RoutingContext): RouteCandidate[];
export declare function rejectNordiCandidates(candidates: RouteCandidate[]): RouteCandidate[];
export declare function applyRoutePolicy(candidates: RouteCandidate[], context: RoutingContext, policy: RoutePolicy): PolicyEnforcementResult;
export declare function detectAmbiguousRouting(candidates: RouteCandidate[], policy: RoutePolicy): boolean;
