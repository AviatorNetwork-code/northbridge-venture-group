# @northbridge/assistant-contracts

**Task:** NB-ASSIST-002  
**Version:** 0.1.0  
**Status:** Types only — no runtime logic

Shared TypeScript contracts for the [Northbridge Assistant Platform](../../docs/architecture/NORTHBRIDGE-ASSISTANT-PLATFORM-v1.md).

## Install

Monorepo workspace package. Import from `@northbridge/assistant-contracts`.

## Exports

| Contract | Module |
|----------|--------|
| `AssistantContext` | Context Engine |
| `AssistantIntent` | Intent Engine |
| `AssistantToolMetadata`, `AssistantToolResult` | Tool Registry |
| `AssistantRichCard` | Rich Response System |
| `AssistantExplanation` | Explainability Engine |
| `OperationalDraft` | Intelligence Stack / NOP handoff |
| `ConfirmationState` | Confirmation Framework |
| `AssistantProviderRequest`, `AssistantProviderResponse` | Provider Layer |
| `AssistantSafetyCertification` | NBS-011 |

## Scripts

```bash
npm run typecheck -w @northbridge/assistant-contracts
npm run test -w @northbridge/assistant-contracts
npm run build -w @northbridge/assistant-contracts
```

## Adapter extensions

See `src/examples/adapter-extensions.ts` for type-only extension patterns.
