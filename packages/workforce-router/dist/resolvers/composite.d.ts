import type { RouteResolver } from "../types/resolver.js";
import type { RouteCandidate } from "../types/candidate.js";
import type { RoutingRequest, RoutingContext } from "../types/request.js";
import type { RouteRuleSet } from "../types/rules.js";
export declare class CompositeRouteResolver implements RouteResolver {
    private readonly resolvers;
    readonly strategyId = "composite";
    constructor(resolvers: RouteResolver[]);
    resolve(request: RoutingRequest, context: RoutingContext, rules: RouteRuleSet): Promise<RouteCandidate[]>;
}
