import { createHash } from "node:crypto";
import type { RequestOwner } from "@northbridge/workforce-contracts";

export function buildDedupKey(
  orgId: string,
  normalizedTopic: string,
  ownerId?: string,
): string {
  const material = [orgId, normalizedTopic.trim().toLowerCase(), ownerId ?? ""].join("|");
  return createHash("sha256").update(material).digest("hex");
}

export interface DedupRecord {
  dedupKey: string;
  owner: RequestOwner;
  recordedAt: string;
}

export interface DedupStore {
  find(dedupKey: string, windowMs: number, now: string): RequestOwner | null;
  record(record: DedupRecord): void;
}

export class InMemoryDedupStore implements DedupStore {
  private readonly records = new Map<string, DedupRecord>();

  find(dedupKey: string, windowMs: number, now: string): RequestOwner | null {
    const record = this.records.get(dedupKey);
    if (!record) return null;

    const ageMs = Date.parse(now) - Date.parse(record.recordedAt);
    if (ageMs > windowMs) {
      this.records.delete(dedupKey);
      return null;
    }

    return record.owner;
  }

  record(record: DedupRecord): void {
    this.records.set(record.dedupKey, record);
  }
}

export function checkDedup(
  store: DedupStore,
  input: { orgId: string; dedupKey: string; windowMs: number; now: string },
): RequestOwner | null {
  return store.find(input.dedupKey, input.windowMs, input.now);
}
