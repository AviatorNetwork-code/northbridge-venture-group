# ADR-NDP-1: Communication Router product composition

**Status:** Accepted  
**Date:** 2026-07  
**Context:** NDP Phase 5 — Northbridge Digital Communication Router

## Decision

Implement the Communication Router as **product composition** in `lib/ndp/conversation-router/`, not as a new `@northbridge/*` platform package.

The router composes:

1. `@northbridge/workforce-router` — ownership, dedup, audit (platform)
2. `@northbridge/team-orchestrator` — team execution path (platform, via adapter)
3. `@northbridge/conversation-engine` — turn policy (via adapter)
4. `lib/nordi/*` — Nordi voice, memory, consent (product, injectable handler)

Nordi ownership decisions remain in the **product layer** per ADR-W10.

## Consequences

- **Positive:** Platform packages stay product-agnostic.
- **Positive:** Aviator Network can compose the same platform without NBD Nordi code.
- **Positive:** Clear NDP ownership boundary for customer experience.
- **Negative:** Products must inject loaders, rule sets, and handlers — not turnkey.

## References

- ADR-W9 — workforce-router vs communication-router
- ADR-W10 — router excludes Nordi
- Workforce Communication Protocol v1.0 — §4, §5
