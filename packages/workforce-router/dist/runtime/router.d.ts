import type { RequestOwner } from "@northbridge/workforce-contracts";
import { CapabilityRouteResolver, CompositeRouteResolver, RuleBasedRouteResolver } from "../resolvers/index.js";
import type { RoutingDecision } from "../types/decision.js";
import type { RoutePolicy } from "../types/policy.js";
import type { RoutingRequest, RoutingContext } from "../types/request.js";
import type { RouteResolver } from "../types/resolver.js";
import type { RouteRuleSet } from "../types/rules.js";
import { type DedupStore } from "../validation/dedup.js";
export interface RouteInput {
    request: RoutingRequest;
    context: RoutingContext;
    rules: RouteRuleSet;
    policy?: RoutePolicy;
}
export interface TransferOwnerInput {
    orgId: string;
    requestId: string;
    from: RequestOwner;
    to: RequestOwner;
    reason: string;
}
export interface CheckDedupInput {
    orgId: string;
    dedupKey: string;
    windowMs: number;
}
export interface WorkforceRouter {
    route(input: RouteInput): Promise<RoutingDecision>;
    transferOwner(input: TransferOwnerInput): Promise<RoutingDecision>;
    checkDedup?(input: CheckDedupInput & {
        now?: string;
    }): RequestOwner | null;
}
export interface WorkforceRouterDependencies {
    resolver: RouteResolver;
    dedupStore?: DedupStore;
    defaultPolicy?: RoutePolicy;
}
export declare class DefaultWorkforceRouter implements WorkforceRouter {
    private readonly resolver;
    private readonly dedupStore;
    private readonly defaultPolicy;
    constructor(deps: WorkforceRouterDependencies);
    route(input: RouteInput): Promise<RoutingDecision>;
    transferOwner(input: TransferOwnerInput): Promise<RoutingDecision>;
    checkDedup(input: CheckDedupInput & {
        now?: string;
    }): RequestOwner | null;
}
export declare function createWorkforceRouter(deps: WorkforceRouterDependencies): WorkforceRouter;
export declare function createDefaultCompositeResolver(): RouteResolver;
export { CapabilityRouteResolver, CompositeRouteResolver, RuleBasedRouteResolver, };
