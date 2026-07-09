import type { RouteResolver } from "../types/resolver.js";
import type { RouteCandidate } from "../types/candidate.js";
import type { RouteRuleSet } from "../types/rules.js";
import type { RoutingContext, RoutingRequest } from "../types/request.js";
export declare class RuleBasedRouteResolver implements RouteResolver {
    readonly strategyId = "rule-based";
    resolve(request: RoutingRequest, _context: RoutingContext, rules: RouteRuleSet): Promise<RouteCandidate[]>;
}
