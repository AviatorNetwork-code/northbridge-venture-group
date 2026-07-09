# @northbridge/workforce-contracts

Shared contracts for the NEO Workforce Platform (Phase 1).

**Contracts only — no business logic, no product behavior.**

## Scope

Defines Zod schemas and TypeScript types for:

- `Organization`, `Team`, role entities (`TeamLead`, `Specialist`, `Manager`, `Director`, `VicePresident`)
- `WorkforceRole`, `WorkforceAssignment`, `OrganizationHierarchy`
- `Recommendation`, `OperationalMetric`, `TeamReport`
- `Task`, `TaskResult`, `Escalation`, `RequestOwner`

## Usage

```typescript
import {
  organizationSchema,
  parseTeam,
  createRequestOwner,
  validateWithSchema,
} from "@northbridge/workforce-contracts";
```

## Source of truth

- [Workforce Execution Plan v1.0](../../docs/northbridge-digital-workforce-execution-plan-v1.md)
- [Workforce Communication Protocol v1.0](../../docs/northbridge-digital-workforce-communication-protocol-v1.md)
- [Organizational Structure v1.0](../../docs/northbridge-digital-workforce-organizational-structure-v1.md)

## Scripts

```bash
npm run typecheck
npm run test
npm run build
```

## ADR

See [ADR-W1](./docs/ADR-W1-zod-contract-validation.md).
