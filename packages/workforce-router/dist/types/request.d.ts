import type { WorkforceFeatureFlags, RequestOwner } from "@northbridge/workforce-contracts";
export type RoutingChannel = "team" | "platform" | "connector" | "scheduled";
export interface RoutingRequestPayload {
    textRef?: string;
    intentTags?: string[];
    capabilityTags?: string[];
    metadata?: Record<string, unknown>;
}
export interface RoutingRequest {
    requestId: string;
    orgId: string;
    /** Source channel — router uses for policy, not for Nordi logic */
    channel: RoutingChannel;
    /** Normalized intent signals — product may pre-classify or pass raw refs */
    payload: RoutingRequestPayload;
    /** Teams entitled for this org at routing time */
    entitledTeamIds: string[];
    receivedAt: string;
    /** Optional dedup topic key — product supplies normalized topic */
    dedupTopic?: string;
}
export interface RoutingContext {
    orgId: string;
    featureFlags: WorkforceFeatureFlags;
    entitledTeamIds: string[];
    activeOwners?: RequestOwner[];
    now: string;
    traceId?: string;
}
