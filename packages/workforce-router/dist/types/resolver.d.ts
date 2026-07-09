import type { RoutingRequest, RoutingContext } from "../types/request.js";
import type { RouteCandidate } from "../types/candidate.js";
import type { RouteRuleSet } from "../types/rules.js";
export interface RouteResolver {
    readonly strategyId: string;
    resolve(request: RoutingRequest, context: RoutingContext, rules: RouteRuleSet): Promise<RouteCandidate[]>;
}
/** Future extension point for AI-assisted routing (not implemented in MVP). */
export interface AiAssistedRouteResolver extends RouteResolver {
    readonly strategyId: "ai-assisted";
}
