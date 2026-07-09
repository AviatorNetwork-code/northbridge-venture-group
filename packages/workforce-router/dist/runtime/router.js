import { randomUUID } from "node:crypto";
import { normalizeFeatureFlags } from "@northbridge/workforce-core";
import { DEFAULT_ROUTE_POLICY } from "../policy/defaults.js";
import { applyRoutePolicy, detectAmbiguousRouting, } from "../policy/enforce.js";
import { CapabilityRouteResolver, CompositeRouteResolver, RuleBasedRouteResolver, } from "../resolvers/index.js";
import { WORKFORCE_ROUTER_VERSION } from "../types/audit.js";
import { buildDedupKey, checkDedup, InMemoryDedupStore, } from "../validation/dedup.js";
import { assertSingleRouteOwner, ownersEqual } from "../validation/index.js";
import { WorkforceRouterError } from "./errors.js";
function createAudit(input) {
    return {
        auditId: randomUUID(),
        requestId: input.requestId,
        orgId: input.orgId,
        routerVersion: WORKFORCE_ROUTER_VERSION,
        strategyIds: input.strategyIds,
        timestamp: input.timestamp,
        traceId: input.traceId,
        dedupKey: input.dedupKey,
        previousOwner: input.previousOwner,
    };
}
function validateRouteInput(input) {
    if (input.request.orgId !== input.context.orgId) {
        throw new WorkforceRouterError("invalid_request", "RoutingRequest orgId must match RoutingContext orgId");
    }
    if (input.rules.orgId !== input.request.orgId) {
        throw new WorkforceRouterError("invalid_request", "RouteRuleSet orgId must match RoutingRequest orgId");
    }
}
export class DefaultWorkforceRouter {
    resolver;
    dedupStore;
    defaultPolicy;
    constructor(deps) {
        this.resolver = deps.resolver;
        this.dedupStore = deps.dedupStore ?? new InMemoryDedupStore();
        this.defaultPolicy = deps.defaultPolicy ?? DEFAULT_ROUTE_POLICY;
    }
    async route(input) {
        validateRouteInput(input);
        const policy = { ...this.defaultPolicy, ...input.policy };
        const context = {
            ...input.context,
            featureFlags: normalizeFeatureFlags(input.context.featureFlags),
            entitledTeamIds: input.context.entitledTeamIds.length > 0
                ? input.context.entitledTeamIds
                : input.request.entitledTeamIds,
        };
        const now = context.now;
        let dedupKey;
        if (input.request.dedupTopic) {
            dedupKey = buildDedupKey(input.request.orgId, input.request.dedupTopic);
            const windowMs = policy.dedupWindowMs ?? 0;
            if (windowMs > 0) {
                const existingOwner = checkDedup(this.dedupStore, {
                    orgId: input.request.orgId,
                    dedupKey,
                    windowMs,
                    now,
                });
                if (existingOwner) {
                    return {
                        requestId: input.request.requestId,
                        orgId: input.request.orgId,
                        status: "assigned",
                        owner: existingOwner,
                        candidates: [],
                        selectedReasons: [
                            {
                                code: "DEDUP_MATCH",
                                description: "Existing owner returned for duplicate topic within dedup window",
                            },
                        ],
                        audit: createAudit({
                            requestId: input.request.requestId,
                            orgId: input.request.orgId,
                            strategyIds: [this.resolver.strategyId],
                            timestamp: now,
                            traceId: context.traceId,
                            dedupKey,
                        }),
                    };
                }
            }
        }
        const rawCandidates = await this.resolver.resolve(input.request, context, input.rules);
        const { candidates, rejectedReasons } = applyRoutePolicy(rawCandidates, context, policy);
        const strategyIds = [this.resolver.strategyId];
        const auditBase = {
            requestId: input.request.requestId,
            orgId: input.request.orgId,
            strategyIds,
            timestamp: now,
            traceId: context.traceId,
            dedupKey,
        };
        if (candidates.length === 0) {
            return {
                requestId: input.request.requestId,
                orgId: input.request.orgId,
                status: policy.allowNoRoute ? "no_route" : "deferred",
                candidates: rawCandidates,
                selectedReasons: rejectedReasons.length
                    ? rejectedReasons
                    : [{ code: "NO_MATCH", description: "No eligible routing candidates" }],
                audit: createAudit(auditBase),
            };
        }
        if (detectAmbiguousRouting(candidates, policy) && policy.allowNoRoute) {
            return {
                requestId: input.request.requestId,
                orgId: input.request.orgId,
                status: "deferred",
                candidates,
                selectedReasons: [
                    {
                        code: "AMBIGUOUS_ROUTE",
                        description: "Top candidates scored within ambiguity threshold",
                    },
                    ...rejectedReasons,
                ],
                audit: createAudit(auditBase),
            };
        }
        const selected = candidates[0];
        assertSingleRouteOwner(selected.owner);
        if (dedupKey && policy.dedupWindowMs) {
            this.dedupStore.record({
                dedupKey,
                owner: selected.owner,
                recordedAt: now,
            });
        }
        return {
            requestId: input.request.requestId,
            orgId: input.request.orgId,
            status: "assigned",
            owner: selected.owner,
            candidates,
            selectedReasons: [...selected.reasons, ...rejectedReasons],
            audit: createAudit(auditBase),
        };
    }
    async transferOwner(input) {
        if (input.from.orgId !== input.orgId || input.to.orgId !== input.orgId) {
            throw new WorkforceRouterError("transfer_mismatch", "Transfer owners must belong to the same orgId");
        }
        if (ownersEqual(input.from, input.to)) {
            throw new WorkforceRouterError("owner_conflict", "Transfer source and destination owners must differ");
        }
        if (input.from.type === "nordi" || input.to.type === "nordi") {
            throw new WorkforceRouterError("nordi_not_routable", "Workforce router must not assign or transfer Nordi ownership");
        }
        assertSingleRouteOwner(input.to);
        const now = new Date().toISOString();
        return {
            requestId: input.requestId,
            orgId: input.orgId,
            status: "assigned",
            owner: input.to,
            candidates: [
                {
                    owner: input.to,
                    score: {
                        value: 1,
                        confidence: "high",
                        strategy: "transfer",
                    },
                    reasons: [
                        {
                            code: "OWNER_TRANSFER",
                            description: input.reason,
                        },
                    ],
                },
            ],
            selectedReasons: [
                {
                    code: "OWNER_TRANSFER",
                    description: input.reason,
                },
            ],
            audit: createAudit({
                requestId: input.requestId,
                orgId: input.orgId,
                strategyIds: ["transfer"],
                timestamp: now,
                previousOwner: input.from,
            }),
        };
    }
    checkDedup(input) {
        return checkDedup(this.dedupStore, {
            orgId: input.orgId,
            dedupKey: input.dedupKey,
            windowMs: input.windowMs,
            now: input.now ?? new Date().toISOString(),
        });
    }
}
export function createWorkforceRouter(deps) {
    return new DefaultWorkforceRouter(deps);
}
export function createDefaultCompositeResolver() {
    return new CompositeRouteResolver([
        new RuleBasedRouteResolver(),
        new CapabilityRouteResolver(),
    ]);
}
export { CapabilityRouteResolver, CompositeRouteResolver, RuleBasedRouteResolver, };
