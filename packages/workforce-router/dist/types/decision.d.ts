import type { RequestOwner } from "@northbridge/workforce-contracts";
import type { RouteAudit } from "./audit.js";
import type { RouteCandidate } from "./candidate.js";
import type { RouteReason } from "./candidate.js";
export type RoutingDecisionStatus = "assigned" | "no_route" | "deferred";
export interface RoutingDecision {
    requestId: string;
    orgId: string;
    status: RoutingDecisionStatus;
    owner?: RequestOwner;
    candidates: RouteCandidate[];
    selectedReasons: RouteReason[];
    audit: RouteAudit;
}
