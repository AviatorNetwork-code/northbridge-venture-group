import type { RoutePolicy } from "../types/policy.js";

export const DEFAULT_ROUTE_POLICY: RoutePolicy = {
  requireEntitlement: true,
  enforceFeatureFlags: true,
  minimumScore: 0.5,
  dedupWindowMs: 86_400_000,
  allowNoRoute: true,
  ambiguityScoreGap: 0.05,
};
