# Northbridge Digital Team Catalog

Product configuration layer for launch team definitions (NDP Phase 6).

**Metadata only** — no specialist prompts, tools, billing UI, or domain execution behavior.

## Source of truth

- [Workforce Inventory v1.0](../../../docs/northbridge-digital-workforce-inventory-v1.md)

## Principle

> Specialists are reusable. Teams are products.

This module defines **what customers can hire** and **how teams route work** — not how specialists execute it.

## Launch teams (9)

| Team ID | Name | Service category |
|---------|------|------------------|
| `team-marketing` | Marketing Team | marketing |
| `team-sales` | Sales Team | sales |
| `team-customer-service` | Customer Service Team | customer-experience |
| `team-financial` | Financial Team | financial |
| `team-flight-school` | Flight School Team | aviation |
| `team-dental-office` | Dental Office Team | dental |
| `team-law-firm` | Law Firm Team | legal |
| `team-hvac` | HVAC Team | hvac |
| `team-general-service` | General Service Business Team | general |

Each team includes:

- **Team Lead** — single external voice (orchestrated by `@northbridge/team-orchestrator`)
- **Specialists** — inventory ids only
- **Capability tags** — for `@northbridge/workforce-router`
- **Routing tags** — for NDP Communication Router rule sets
- **Launch visibility** — `launchVisible: true` at launch
- **Future layers** — manager/director/VP refs feature-gated (`launchVisible: false`)

## Module layout

```text
lib/ndp/workforce/catalog/
  teams.ts           Launch team definitions
  specialists.ts     Inventory v1.0 specialist metadata
  capabilities.ts    Capability tag registry
  routing-tags.ts    Routing tag registry
  index.ts           Validation + RouteRuleSet builder
  catalog.test.ts    Consistency tests
```

## Usage

```typescript
import {
  getLaunchTeam,
  listLaunchVisibleTeams,
  buildRouteRuleSetFromCatalog,
  assertValidNdpTeamCatalog,
} from "@/lib/ndp/workforce/catalog";

assertValidNdpTeamCatalog();

const marketing = getLaunchTeam("team-marketing");
const routeRules = buildRouteRuleSetFromCatalog(orgId);

// Wire into Communication Router resolveRouteRules
```

## Integration points

| Consumer | Usage |
|----------|--------|
| NDP Communication Router | `buildRouteRuleSetFromCatalog()` |
| Workforce Router | Capability-based rules from catalog |
| Team Orchestrator | Specialist roster ids per hired team (future wiring) |
| Hire / billing UI | Separate from this module (not Phase 6) |

## Out of scope (Phase 6)

- Specialist prompts and LLM behavior
- Tool / connector integrations
- Manager/Director/VP customer visibility
- Nordi catalog entries (Nordi is outside customer hierarchy)
- Modifications to `@northbridge/*` platform packages

## Related documents

- [Workforce Inventory v1.0](../../../docs/northbridge-digital-workforce-inventory-v1.md)
- [Communication Protocol v1.0](../../../docs/northbridge-digital-workforce-communication-protocol-v1.md)
- [Execution Plan M1](../../../docs/northbridge-digital-workforce-execution-plan-v1.md)
