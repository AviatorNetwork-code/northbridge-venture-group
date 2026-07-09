# @northbridge/workforce-observability

Reusable workforce telemetry primitives for the Northbridge platform.

## Event types

- `customer_request`
- `routing_decision`
- `team_execution`
- `specialist_execution`
- `tool_execution`
- `escalation`
- `team_synthesis`
- `customer_response`

## Common fields

`timestamp`, `correlationId`, `orgId`, `teamId`, `specialistId`, `durationMs`, `confidence`, `status`, `metadata`

## Out of scope

- Dashboards
- Vendor APM backends (Datadog, Langfuse, etc.) — products wire emitters

## References

- ADR-W13 — observability boundaries
