# ADR-W3: Team Orchestrator Boundaries

**Status:** Accepted  
**Date:** 2026-07  
**Context:** NEO Phase 3 — `@northbridge/team-orchestrator`

## Decision

Implement Team Lead orchestration as a **coordination engine** that:

1. Enforces **single `RequestOwner`** per team request (`team:{teamId}`)
2. Delegates execution to `@northbridge/specialist-runtime` — never domain logic directly
3. Synthesizes one team outcome — specialists never customer-facing at launch
4. Emits `TeamReport` using workforce-contracts schema via injectable builder
5. Exposes `CrossTeamCollaborationAdapter` as **interface only** in Phase 3

## Consequences

- **Positive:** All team products (Marketing, Dental, etc.) share one orchestration engine.
- **Positive:** Communication Protocol Layer 2 rules enforced in one place.
- **Negative:** Product must inject selector, synthesizer, and roster — orchestrator is not turnkey for one industry.
- **Deferred:** Nordi router, manager tiers, collaboration session implementation.

## References

- Workforce Communication Protocol v1.0 — §4 routing, §8 collaboration
- Execution Plan Phase 3 — Team architecture
