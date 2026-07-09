# @northbridge/assistant-cards

**Task:** NB-ASSIST-004  
**Version:** 0.1.0

Rich card **schema validation** for the [Northbridge Assistant Platform](../../docs/architecture/NORTHBRIDGE-ASSISTANT-PLATFORM-v1.md).

## Why this package exists

`AssistantResponsePlanner` outputs structured cards before product adapters render them in Assistant Shell. Validation at this boundary ensures:

- No raw provider JSON reaches user-facing UX
- Confirmation-gated cards include required actions (NBS-011 L3+)
- Warning/error cards include severity (Confidence Model alignment)
- Invalid planner output fails safely with a fallback error card

## Relationships

| Layer | Package |
|-------|---------|
| Contracts | `@northbridge/assistant-contracts` |
| Router / planner | `@northbridge/assistant-router` |
| **Validation (this package)** | `@northbridge/assistant-cards` |
| Rendering | Product adapters + Assistant Shell (future) |

Product adapters **normalize and validate** planner output before render. They do not fork the schema.

## AssistantRichCard v1.0

Required fields: `schema_version`, `id`, `type`, `title`, `body`

| Card type | Notes |
|-----------|-------|
| `explanation` | Why / rationale |
| `recommendation` | Suggested next step |
| `confirmation_request` | Requires `actions` |
| `tool_result` | Normalized tool output |
| `warning` | Requires `severity` |
| `error` | Requires `severity` |
| `next_steps` | Ordered guidance |

## Public API

```typescript
import {
  ASSISTANT_RICH_CARD_SCHEMA_VERSION,
  validateAssistantRichCard,
  validateAssistantRichCards,
  assertAssistantRichCard,
  createSafeInvalidCardFallback,
  validateNormalizedPlannerCards,
} from "@northbridge/assistant-cards";

const result = validateAssistantRichCard(candidate);
if (!result.valid) {
  const safe = createSafeInvalidCardFallback(result.issues);
}
```

## Scripts

```bash
npm run typecheck -w @northbridge/assistant-cards
npm run test -w @northbridge/assistant-cards
npm run build -w @northbridge/assistant-cards
```

## Governance

- [Northbridge Assistant Platform v1](../../docs/architecture/NORTHBRIDGE-ASSISTANT-PLATFORM-v1.md)
- NBS-011 — confirmation_request cards enforce gated actions
- [Confidence Model](../../docs/founder/CONFIDENCE-MODEL.md) — severity + metadata.confidence

## Safety rationale

Invalid cards must **never** crash Assistant Shell or expose unverified model output. Use `createSafeInvalidCardFallback` for user-visible error states.
