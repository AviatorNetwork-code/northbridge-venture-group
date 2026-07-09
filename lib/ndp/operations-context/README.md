# NDP Operations Context

Northbridge Digital adapter for `@northbridge/operations-intelligence`.

Operations Intelligence is owned by NEO. This module wires the platform package into NDP product layers without duplicating the operational model.

## Usage

```typescript
import {
  buildOperationsIntelligenceContextForOrg,
  buildOperationsContextReferences,
  createExampleOperationsIntelligenceLoader,
} from "@/lib/ndp/operations-context";
```

## Integration points

| Consumer | Usage |
|----------|-------|
| Communication Router | Optional `operationsIntelligenceLoader` → `ConversationContext.operationsIntelligence` |
| Marketing Team | Prompt assembly refs, runtime context metadata, operational reporting |
| Prompt Assembly | `organizationContextRef` via `buildOperationsContextReferences()` |

## Deprecated shim

`lib/ndp/organization/` re-exports the package for backward compatibility. Import from `@northbridge/operations-intelligence` or `@/lib/ndp/operations-context` instead.
