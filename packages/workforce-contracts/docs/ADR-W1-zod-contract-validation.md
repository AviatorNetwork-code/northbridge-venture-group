# ADR-W1: Zod Runtime Validation for Workforce Contracts

**Status:** Accepted  
**Date:** 2026-07  
**Context:** NEO Phase 1 — `@northbridge/workforce-contracts`

## Decision

Use **Zod** for runtime validation and TypeScript type inference in `@northbridge/workforce-contracts`.

Other NEO contract packages (`assistant-contracts`) use types-only with manual validators. Workforce contracts cross service boundaries (NDP BFF, mobile, orchestrators) and benefit from shared parse/safeParse helpers at API edges.

## Consequences

- **Positive:** Single source of truth for types and validation; consistent `validateWithSchema` / `assertWithSchema` helpers.
- **Positive:** Contract tests can fuzz invalid payloads without product code.
- **Negative:** Adds `zod` as a runtime dependency to workforce-contracts consumers.
- **Constraint:** Business logic remains in `@northbridge/workforce-core` — schemas only in contracts.

## Alternatives considered

1. **Types-only (assistant-contracts pattern)** — rejected for workforce due to multi-service boundary validation needs.
2. **JSON Schema + codegen** — deferred; may add export in Phase 2 for OpenAPI alignment.

## References

- NBS-004: Package boundaries enforced; no business logic in UI apps
- Execution Plan Phase 1 — contract tests for workforce-contracts
