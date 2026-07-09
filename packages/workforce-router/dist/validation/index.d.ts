import type { RequestOwner } from "@northbridge/workforce-contracts";
export { filterCandidatesByEntitlement, filterCandidatesByFeatureFlags, } from "../policy/enforce.js";
export { buildDedupKey, checkDedup, InMemoryDedupStore } from "./dedup.js";
export type { DedupStore, DedupRecord } from "./dedup.js";
export declare function assertSingleRouteOwner(owner: RequestOwner | undefined): asserts owner is RequestOwner;
export declare function ownersEqual(a: RequestOwner, b: RequestOwner): boolean;
