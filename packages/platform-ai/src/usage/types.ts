/** Persisted usage log row — product adapters map to their database schema. */
export interface UsageLogRecord {
  budgetBucket: string;
  userId: string | null;
  actorUserId: string | null;
  requestScope: string;
  requestType: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
  outcome: "allowed" | "rejected";
  metadata?: Record<string, unknown>;
}

export type UsageEventName =
  | "ai_request_started"
  | "ai_completion"
  | "ai_budget_denied"
  | "ai_request_rejected";

/** Lightweight analytics/telemetry event — no product-specific payloads. */
export interface UsageEvent {
  event: UsageEventName;
  timestamp: string;
  bucket: string;
  model?: string;
  estimatedCostUsd?: number;
  metadata?: Record<string, unknown>;
}
