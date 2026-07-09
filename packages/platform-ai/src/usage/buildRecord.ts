import { buildCostEstimate } from "../cost/estimate.js";
import type { ModelRateTable } from "../cost/types.js";
import type { UsageEvent, UsageEventName, UsageLogRecord } from "./types.js";

export function buildPlatformUsageRecord(
  model: string,
  inputTokens: number,
  outputTokens: number,
  rates?: ModelRateTable,
) {
  return buildCostEstimate(model, inputTokens, outputTokens, rates);
}

export function createUsageLogRecord(
  input: Omit<
    UsageLogRecord,
    "inputTokens" | "outputTokens" | "totalTokens" | "estimatedCostUsd"
  > & {
    inputTokens: number;
    outputTokens: number;
    rates?: ModelRateTable;
  },
): UsageLogRecord {
  const estimate = buildPlatformUsageRecord(
    input.model,
    input.inputTokens,
    input.outputTokens,
    input.rates,
  );
  return {
    budgetBucket: input.budgetBucket,
    userId: input.userId,
    actorUserId: input.actorUserId,
    requestScope: input.requestScope,
    requestType: input.requestType,
    model: input.model,
    inputTokens: estimate.usage.inputTokens,
    outputTokens: estimate.usage.outputTokens,
    totalTokens: estimate.usage.totalTokens,
    estimatedCostUsd: estimate.estimatedCostUsd,
    outcome: input.outcome,
    metadata: input.metadata,
  };
}

export function createUsageEvent(input: {
  event: UsageEventName;
  bucket: string;
  model?: string;
  estimatedCostUsd?: number;
  metadata?: Record<string, unknown>;
  timestamp?: Date;
}): UsageEvent {
  return {
    event: input.event,
    timestamp: (input.timestamp ?? new Date()).toISOString(),
    bucket: input.bucket,
    model: input.model,
    estimatedCostUsd: input.estimatedCostUsd,
    metadata: input.metadata,
  };
}
