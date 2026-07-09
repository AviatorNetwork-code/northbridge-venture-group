# @northbridge/workforce-core

Reusable workforce platform core for NEO Phase 1.

**Platform logic only — no Nordi, no product UI, no customer-specific behavior.**

## Responsibilities

- Organization model (create, update, feature flags)
- Team model (roster binding, lifecycle status)
- Hierarchy model (build, merge gated layers)
- Assignment model (scope, active window)
- Role registry (Team Lead, Specialist, Manager, Director, VP)
- Permissions (canDo / cannotDo envelope, org policy overlay)
- Organization structure validation

## Dependencies

- `@northbridge/workforce-contracts` — all shared types and Zod schemas

## Usage

```typescript
import {
  createOrganization,
  createTeam,
  buildOrganizationHierarchy,
  validateOrganizationStructure,
  canPerformAction,
} from "@northbridge/workforce-core";
```

## Source of truth

- [Workforce Execution Plan v1.0](../../docs/northbridge-digital-workforce-execution-plan-v1.md) — Phase 1 / M1
- [Workforce Communication Protocol v1.0](../../docs/northbridge-digital-workforce-communication-protocol-v1.md)

## Scripts

```bash
npm run typecheck
npm run test
npm run build
```
