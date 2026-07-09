# ADR-W2: Specialist Runtime Adapter Boundaries

**Status:** Accepted  
**Date:** 2026-07  
**Context:** NEO Phase 2 — `@northbridge/specialist-runtime`

## Decision

Implement specialist execution as a **domain-agnostic lifecycle orchestrator** with:

1. **Contracts from workforce-contracts** — no duplicate Zod schemas
2. **Permissions from workforce-core** — `canPerformAction` at capability validation
3. **Memory via `SpecialistMemoryAdapter`** — no persistence in this package
4. **Conversation via `SpecialistConversationAdapter`** — no conversation-engine imports
5. **Domain behavior via `TaskExecutor`** — products inject execution logic

## Consequences

- **Positive:** Same runtime for Marketing, Sales, Dental, Aviation specialists.
- **Positive:** Clear extension point — products ship executors + capability maps only.
- **Positive:** Testable lifecycle without LLM or industry fixtures.
- **Negative:** Orchestrators (Team Lead) must live in a future `@northbridge/team-orchestrator` package.

## Out of scope (explicit)

- Nordi, Team Lead routing, recommendation engine, dashboard, mobile
- Industry-specific prompts or catalog data
- Direct imports of `@northbridge/conversation-state` or `@northbridge/conversation-engine`

## References

- Execution Plan Phase 2 — specialist lifecycle
- Communication Protocol Layer 3 — TaskEnvelope / TaskResult
