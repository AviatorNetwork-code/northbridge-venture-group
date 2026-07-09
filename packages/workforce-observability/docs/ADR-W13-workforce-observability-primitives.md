# ADR-W13: Workforce Observability Primitives

**Status:** Accepted  
**Date:** 2026-07  
**Context:** NEO — `@northbridge/workforce-observability`

## Decision

Provide platform-level telemetry types and emitters without binding to a vendor backend:

1. Zod-validated `WorkforceEvent` schema
2. `WorkforceTelemetryEmitter` interface
3. `InMemoryWorkforceTelemetryEmitter` for tests
4. Builder helpers for correlation and event IDs

## Consequences

- **Positive:** Consistent event shape across router, orchestrator, runtime
- **Positive:** Products can forward events to OTel or internal pipelines
- **Negative:** No automatic instrumentation — packages opt in via hooks

## Out of scope

- Dashboards, alerting, PII redaction processors

## References

- External Patterns Research v1.0 — 4-layer instrumentation stack
