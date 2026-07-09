import type { RequestOwner } from "@northbridge/workforce-contracts";
export interface RouteScore {
    value: number;
    confidence: "high" | "medium" | "low";
    strategy: string;
}
export interface RouteReason {
    code: string;
    description: string;
    ruleId?: string;
    evidenceRef?: string;
}
export interface RouteCandidate {
    owner: RequestOwner;
    score: RouteScore;
    reasons: RouteReason[];
    teamProductId?: string;
    capabilityTags?: string[];
}
export declare function scoreToConfidence(value: number): RouteScore["confidence"];
export declare function createRouteScore(value: number, strategy: string): RouteScore;
