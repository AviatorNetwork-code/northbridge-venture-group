import type { CostEstimate } from "../cost/types.js";
import type { UsageLogRecord } from "../usage/types.js";

/** Request payload for an LLM completion call. */
export interface ProviderRequest {
  model: string;
  system: string;
  user: string;
  metadata?: Record<string, unknown>;
}

/** Response from an LLM completion call. */
export interface ProviderResponse {
  text: string;
  usage: CostEstimate;
  metadata?: Record<string, unknown>;
}

/** Swappable LLM completion port — no vendor SDK in core. */
export interface CompletionPort {
  complete(request: ProviderRequest): Promise<ProviderResponse>;
}

/** Optional usage persistence port for product adapters. */
export interface UsageLoggerPort {
  insert(record: UsageLogRecord): Promise<{ id: string } | { error: string }>;
  getMonthlySpendUsd(bucket: string, monthKey: string): Promise<number>;
}

/** Bundle of execution ports injected by product runtime. */
export interface ExecutionPorts {
  completion: CompletionPort;
  usageLogger?: UsageLoggerPort;
}
