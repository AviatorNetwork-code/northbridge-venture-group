import { createHash } from "node:crypto";
export function buildDedupKey(orgId, normalizedTopic, ownerId) {
    const material = [orgId, normalizedTopic.trim().toLowerCase(), ownerId ?? ""].join("|");
    return createHash("sha256").update(material).digest("hex");
}
export class InMemoryDedupStore {
    records = new Map();
    find(dedupKey, windowMs, now) {
        const record = this.records.get(dedupKey);
        if (!record)
            return null;
        const ageMs = Date.parse(now) - Date.parse(record.recordedAt);
        if (ageMs > windowMs) {
            this.records.delete(dedupKey);
            return null;
        }
        return record.owner;
    }
    record(record) {
        this.records.set(record.dedupKey, record);
    }
}
export function checkDedup(store, input) {
    return store.find(input.dedupKey, input.windowMs, input.now);
}
