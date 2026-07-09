# Digital Employee Development Kit (DEDK)

Developer and product scaffolding for creating Northbridge Digital Employees consistently.

**This is not a runtime engine.** It is a structured checklist, guide, and validation layer that ensures every new Digital Employee follows the same platform composition model established by Marketing Team Alpha.

**Multi-agent default:** All customer-facing teams operate multi-agent by default. Team Lead is the single external voice; specialists work internally. See [Multi-Agent Default Policy v1.0](../../../docs/northbridge-digital-workforce-multi-agent-default-policy-v1.md).

## Reference implementation

Marketing Team Alpha (`lib/ndp/teams/marketing/`) is the canonical end-to-end example. Domain assets live in `lib/ndp/domain/marketing/`; team orchestration lives in `lib/ndp/teams/marketing/`.

Use Marketing Campaign Specialist (`employee-marketing-campaign`) as the baseline employee example throughout this kit.

## Composition model

Every Digital Employee is assembled from platform layers — never custom one-off code:

```text
Workforce Inventory Specialist
        │
        ▼
Digital Employee Manifest
        │
        ├── Team Catalog assignment (teamIds)
        ├── Routing capabilities (capability:*)
        ├── Connector capabilities (execution IDs)
        ├── Knowledge Pack references
        ├── Permissions, memory, confidence, escalation, KPIs
        │
        ▼
Knowledge Resolution Plan
        │
        ▼
Prompt Template + Assembly Plan
        │
        ▼
Domain content (optional, per team/domain)
        │
        ▼
Team runtime wiring (orchestrator, executor, router)
```

## Kit contents

| Resource | Path | Purpose |
|----------|------|---------|
| Employee creation checklist | `checklist/employee-creation-checklist.md` | Step-by-step creation workflow |
| Testing checklist | `checklist/testing-checklist.md` | Required tests before merge |
| Manifest authoring guide | `guides/manifest-authoring-guide.md` | How to write manifests |
| Knowledge pack selection guide | `guides/knowledge-pack-selection-guide.md` | How to choose packs |
| Prompt template selection guide | `guides/prompt-template-selection-guide.md` | How to choose templates |
| Connector capability guide | `guides/connector-capability-guide.md` | How to reference execution capabilities |
| Marketing Campaign example | `examples/marketing-campaign-specialist.md` | Full worked example |
| Future team workflow | `workflow/future-team-creation-workflow.md` | Creating a new Digital Team (multi-agent-first) |
| Multi-agent policy | `lib/ndp/teams/shared/multi-agent-policy.ts` | Default Team Lead policy and request classification |
| Readiness validation | `validation/employee-readiness.ts` | Aggregated validation helper |

## Quick start

```typescript
import { validateEmployeeReadiness } from "@/lib/ndp/workforce/development-kit";

const report = validateEmployeeReadiness({
  employeeId: "employee-marketing-campaign",
});

console.log(report.ready); // true when all checks pass
console.log(report.checks);
```

## Creation order

Always follow this sequence:

1. **Inventory** — confirm or add specialist in `lib/ndp/workforce/catalog/specialists.ts`
2. **Team assignment** — assign specialist to team(s) in `lib/ndp/workforce/catalog/teams.ts`
3. **Connector capabilities** — confirm execution IDs exist in `lib/ndp/connectors/catalog/capabilities.ts`
4. **Knowledge packs** — confirm or add pack metadata in `lib/ndp/workforce/knowledge/catalog/launch-packs.ts`
5. **Manifest** — add entry in `lib/ndp/workforce/manifests/catalog/launch-manifests.ts`
6. **Domain content** — add production knowledge/prompts in `lib/ndp/domain/<domain>/` (when building a team)
7. **Team runtime** — wire orchestrator in `lib/ndp/teams/<team>/` (when building a team)
8. **Validate** — run readiness check and framework tests

## What DEDK does not do

- Execute tools or connect to external providers
- Generate LLM prompts at runtime
- Create new teams or employees automatically
- Modify `@northbridge/*` workforce packages
- Build production UI

## Boundaries

| Layer | Location | DEDK role |
|-------|----------|-----------|
| Workforce Inventory | `lib/ndp/workforce/catalog/` | Reference |
| Manifests | `lib/ndp/workforce/manifests/` | Author |
| Knowledge Packs | `lib/ndp/workforce/knowledge/` | Select |
| Prompt Templates | `lib/ndp/workforce/prompts/` | Select |
| Connectors | `lib/ndp/connectors/` | Reference |
| Domain content | `lib/ndp/domain/<domain>/` | Author (team phase) |
| Team runtime | `lib/ndp/teams/<team>/` | Wire (team phase) |

## Related modules

- `lib/ndp/workforce/manifests/README.md` — Manifest framework
- `lib/ndp/workforce/knowledge/README.md` — Knowledge Pack framework
- `lib/ndp/workforce/prompts/README.md` — Prompt Template framework
- `lib/ndp/teams/marketing/README.md` — Marketing Team Alpha reference
