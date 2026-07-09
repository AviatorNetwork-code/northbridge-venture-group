# ADR-W9: workforce-router vs communication-router

**Status:** Accepted  
**Date:** 2026-07  
**Context:** NEO Phase 4 — `@northbridge/workforce-router`

## Decision

Implement ownership routing as `@northbridge/workforce-router` (workforce platform). The Communication Protocol's `@northbridge/communication-router` name maps to a **composition** at NDP:

```
NDP Conversation Router = workforce-router + conversation-engine + presentation-policy
```

## Consequences

- **Positive:** Workforce platform stays independent of conversation transport.
- **Positive:** Aviator Network and other products can use workforce-router without conversation-engine.
- **Negative:** NDP must compose multiple packages for full customer thread routing.

## References

- Workforce Communication Protocol v1.0 — §12
- Phase 4 Design — ADR-W9
