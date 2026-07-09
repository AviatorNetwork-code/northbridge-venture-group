import type { RequestOwnerType } from "@northbridge/workforce-contracts";
import type { RoutingChannel } from "./request.js";
export interface RouteRule {
    ruleId: string;
    priority: number;
    match: {
        intentTags?: string[];
        capabilityTags?: string[];
        channel?: RoutingChannel;
    };
    routeTo: {
        ownerType: RequestOwnerType;
        ownerId: string;
        teamProductId?: string;
    };
    enabled: boolean;
}
export interface RouteRuleSet {
    orgId: string;
    version: number;
    rules: RouteRule[];
}
