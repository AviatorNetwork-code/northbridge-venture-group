# ADR-W10: Router excludes Nordi

**Status:** Accepted  
**Date:** 2026-07  
**Context:** NEO Phase 4 — `@northbridge/workforce-router`

## Decision

`@northbridge/workforce-router` never returns `RequestOwner { type: "nordi" }`. Nordi ownership is determined by the **product layer** when ingress is relationship/strategic (Communication Protocol §4).

## Mechanism

- Product rules with `ownerType: "nordi"` are ignored by resolvers.
- `transferOwner()` rejects Nordi as source or destination.
- `RoutingRequest.channel` distinguishes ingress; router evaluates operational paths only.

## Consequences

- **Positive:** Preserves "Nordi outside customer hierarchy."
- **Positive:** Platform package has zero Nordi coupling.

## References

- Workforce Communication Protocol v1.0 — §4
- Phase 4 Design — ADR-W10
