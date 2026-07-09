export const DEFAULT_ROUTE_POLICY = {
    requireEntitlement: true,
    enforceFeatureFlags: true,
    minimumScore: 0.5,
    dedupWindowMs: 86_400_000,
    allowNoRoute: true,
    ambiguityScoreGap: 0.05,
};
