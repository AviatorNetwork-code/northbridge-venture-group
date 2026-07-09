# ADR-W11: Pluggable RouteResolver strategies

**Status:** Accepted  
**Date:** 2026-07  
**Context:** NEO Phase 4 — `@northbridge/workforce-router`

## Decision

Routing uses the strategy pattern via `RouteResolver`:

| Resolver | Phase |
|----------|-------|
| `RuleBasedRouteResolver` | MVP |
| `CapabilityRouteResolver` | MVP |
| `CompositeRouteResolver` | MVP |
| `AiAssistedRouteResolver` | Future |

Products and NDP compose resolvers; the router evaluates candidates uniformly through `RoutePolicy`.

## Consequences

- **Positive:** Rule-based MVP without locking platform to AI.
- **Positive:** New strategies added without breaking `WorkforceRouter` API.
- **Negative:** Products must supply meaningful `RouteRuleSet` data for deterministic routing.

## References

- Phase 4 Design — §5.7, ADR-W11
