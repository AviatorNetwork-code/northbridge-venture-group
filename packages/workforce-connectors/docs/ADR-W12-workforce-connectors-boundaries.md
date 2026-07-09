# ADR-W12: Workforce Connectors Boundaries

**Status:** Accepted  
**Date:** 2026-07  
**Context:** NEO — `@northbridge/workforce-connectors`

## Decision

Introduce a platform connector layer where:

1. Specialists request **capabilities**, not vendor tools
2. **ConnectorRegistry** resolves capabilities to connectors
3. **ConnectorRouter** executes without exposing provider SDKs to runtime callers
4. Configuration references credential stores — no inline secrets

## Consequences

- **Positive:** Clean boundary for future NDP connector implementations
- **Positive:** Permission checks reuse workforce-core
- **Negative:** Products must implement `Connector` interfaces for each integration

## Out of scope

- MCP servers, OAuth flows, vendor SDKs, dashboard UI

## References

- External Patterns Research v1.0
- ADR-W2 specialist-runtime boundaries
