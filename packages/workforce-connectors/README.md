# @northbridge/workforce-connectors

Reusable connector abstraction for the Northbridge Workforce Platform.

Specialists request **capabilities**. Connectors satisfy capabilities. The platform never depends on external SDKs.

```text
Specialist → Capability Request → Connector Registry → Connector → External System
```

## Scope

- Capability registration and discovery
- Connector registration, health, permissions, configuration
- Capability routing without exposing provider identity

## Out of scope

- Real provider implementations (Google, Stripe, Meta, etc.)
- MCP server installs
- Product-specific connector credentials

## Usage (interfaces only)

Products register capabilities and connector implementations, then route via `DefaultConnectorRouter`.

## References

- ADR-W12 — package boundaries
- External Patterns Research v1.0 — connector gateway patterns
