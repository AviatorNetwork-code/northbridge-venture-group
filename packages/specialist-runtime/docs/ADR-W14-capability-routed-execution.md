# ADR-W14: Capability-Routed Specialist Execution

**Status:** Accepted  
**Date:** 2026-07  
**Context:** NEO — `@northbridge/specialist-runtime` enhancement

## Decision

Add optional capability-routed execution path:

1. `CapabilityToolRouter` — invokes `@northbridge/workforce-connectors`
2. `createCapabilityRoutedTaskExecutor` — `TaskExecutor` that routes by capability id
3. `createObservabilityExecutionHooks` — optional telemetry via `@northbridge/workforce-observability`

Existing direct `TaskExecutor` injection remains unchanged (backward compatible).

## Consequences

- **Positive:** Specialists no longer depend on provider-specific tool surfaces
- **Positive:** Products can migrate executors incrementally
- **Negative:** Additional package dependencies on connectors + observability

## Out of scope

- Changes to team-orchestrator or workforce-router
- Real connector providers

## References

- ADR-W2, ADR-W12, ADR-W13
