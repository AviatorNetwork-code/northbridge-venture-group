# @northbridge/platform-ai

Provider-agnostic AI platform for Northbridge products — ports, budgets, cost, usage, and redaction.

**v0.1 scope:** ports, budgets, cost estimation, usage events, and redaction helpers. No vendor SDKs — use `@northbridge/ai-gateway` and `@northbridge/ai-providers` for LLM routing.

## Install (monorepo)

```json
{
  "dependencies": {
    "@northbridge/platform-ai": "*"
  }
}
```

For multi-provider LLM traffic, also install `@northbridge/ai-gateway` — see [AI Gateway Platform](../../docs/platform/AI-GATEWAY.md).

## Exported API

| Module | Types | Functions |
|--------|-------|-----------|
| `providers` | `CompletionPort`, `ProviderRequest`, `ProviderResponse`, `UsageLoggerPort`, `ExecutionPorts` | `createMockCompletionPort` |
| `budgets` | `BudgetLimit`, `BudgetLimits`, `BudgetDecision`, `BudgetCheckInput` | `checkBudget`, `getBudgetLimitUsd`, `getMonthKey` |
| `cost` | `TokenUsage`, `CostEstimate`, `ModelRate`, `ModelRateTable` | `buildTokenUsage`, `buildCostEstimate`, `estimateTokenCostUsd` |
| `usage` | `UsageEvent`, `UsageLogRecord`, `UsageEventName` | `buildUsageRecord`, `createUsageEvent`, `createUsageLogRecord` |
| `redaction` | `RedactionResult`, `RedactionPattern` | `sanitizeForModel`, `sanitizeForLogs`, `redactSensitiveValue`, `sanitizePromptText`, `isForbiddenKey`, `DEFAULT_SENSITIVE_VALUE_PATTERNS` |

### Usage helpers

| Function | Returns | Purpose |
|----------|---------|---------|
| `buildUsageRecord()` | `CostEstimate` | Token cost estimate from model + token counts (alias of `buildCostEstimate`) |
| `createUsageLogRecord()` | `UsageLogRecord` | Persistence-shaped record with bucket, scope, and outcome fields |
| `createUsageEvent()` | `UsageEvent` | Lightweight event for logging pipelines |

## Example

```typescript
import {
  checkBudget,
  createMockCompletionPort,
  createUsageLogRecord,
  sanitizeForModel,
  sanitizeForLogs,
} from "@northbridge/platform-ai";

const port = createMockCompletionPort();
const result = await port.complete({
  model: "gpt-4o-mini",
  system: "You are helpful.",
  user: sanitizeForModel("  Hello  ") as string,
});

const budget = checkBudget({
  bucket: "user",
  spentUsd: 0.5,
  estimatedCostUsd: result.usage.estimatedCostUsd,
  limits: {
    defaultLimitUsd: 5,
    limits: [{ bucket: "user", limitUsd: 5 }],
  },
});

const logRecord = createUsageLogRecord({
  budgetBucket: "user",
  userId: "user-1",
  requestScope: "chat",
  requestType: "completion",
  model: "gpt-4o-mini",
  inputTokens: result.usage.inputTokens,
  outputTokens: result.usage.outputTokens,
  outcome: budget.allowed ? "allowed" : "budget_exceeded",
});

console.log(sanitizeForLogs({ note: budget.allowed ? "ok" : budget.reason, logRecord }));
```

## Out of scope (v0.1)

- Vendor SDK adapters (`@northbridge/ai-providers`)
- AI Gateway routing/failover (`@northbridge/ai-gateway`)
- CAT / NEO executors
- FAA, logbook, marketplace, or aviation-specific logic
- Database persistence implementations

## License

UNLICENSED — Northbridge internal use.
