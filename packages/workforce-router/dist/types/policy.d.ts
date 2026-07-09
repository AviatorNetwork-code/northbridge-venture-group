export interface RoutePolicy {
    /** Reject candidates for teams not in entitledTeamIds */
    requireEntitlement: boolean;
    /** Reject manager/director/vp candidates when flags off */
    enforceFeatureFlags: boolean;
    /** Minimum score to accept a candidate */
    minimumScore: number;
    /** Dedup window ms — reject if same topic+owner within window */
    dedupWindowMs?: number;
    /** Allow ambiguous → no route (product handles clarification) */
    allowNoRoute: boolean;
    /** Score gap required between top candidates to avoid ambiguity */
    ambiguityScoreGap?: number;
}
