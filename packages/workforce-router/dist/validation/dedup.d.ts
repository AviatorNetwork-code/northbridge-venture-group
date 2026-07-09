import type { RequestOwner } from "@northbridge/workforce-contracts";
export declare function buildDedupKey(orgId: string, normalizedTopic: string, ownerId?: string): string;
export interface DedupRecord {
    dedupKey: string;
    owner: RequestOwner;
    recordedAt: string;
}
export interface DedupStore {
    find(dedupKey: string, windowMs: number, now: string): RequestOwner | null;
    record(record: DedupRecord): void;
}
export declare class InMemoryDedupStore implements DedupStore {
    private readonly records;
    find(dedupKey: string, windowMs: number, now: string): RequestOwner | null;
    record(record: DedupRecord): void;
}
export declare function checkDedup(store: DedupStore, input: {
    orgId: string;
    dedupKey: string;
    windowMs: number;
    now: string;
}): RequestOwner | null;
