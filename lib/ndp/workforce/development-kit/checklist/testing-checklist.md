# Testing Checklist

Run these tests before merging any Digital Employee or team work.

## Required framework tests

```bash
# From repo root
npx vitest run lib/ndp/workforce/manifests/manifests.test.ts
npx vitest run lib/ndp/workforce/knowledge/knowledge.test.ts
npx vitest run lib/ndp/workforce/prompts/prompts.test.ts
npx vitest run lib/ndp/connectors/connectors.test.ts
npx vitest run lib/ndp/workforce/development-kit/validation/employee-readiness.test.ts
```

Or run all NDP tests:

```bash
npx vitest run lib/ndp
```

## Team tests (when team runtime exists)

```bash
npx vitest run lib/ndp/teams/<team>/
```

Example for Marketing Team Alpha:

```bash
npx vitest run lib/ndp/teams/marketing/
```

## Workforce package tests

```bash
cd packages/team-orchestrator && npm test
cd packages/specialist-runtime && npm test
```

## Lint

```bash
npm run lint
```

## Per-employee validation

```typescript
import { assertEmployeeReadiness } from "@/lib/ndp/workforce/development-kit";

assertEmployeeReadiness({ employeeId: "employee-<your-employee>" });
```

## What each test suite verifies

| Suite | Verifies |
|-------|----------|
| `manifests.test.ts` | Manifest catalog integrity, team/specialist/connector references |
| `knowledge.test.ts` | Pack catalog, dependency graph, employee references |
| `prompts.test.ts` | Template catalog, assembly plans, manifest/knowledge compatibility |
| `connectors.test.ts` | Execution capability registry, routing tag mappings |
| `employee-readiness.test.ts` | DEDK aggregated readiness validation |
| Team tests | End-to-end orchestration, mock connectors, router wiring |

## New employee test additions

When adding a manifest-only employee:

- [ ] Existing framework tests pass without modification (unless pack/template count changes)
- [ ] Add readiness assertion for the new `employeeId` in team or DEDK tests if it is a reference employee

When adding a production team:

- [ ] Create `lib/ndp/teams/<team>/<team>.test.ts`
- [ ] Create `lib/ndp/teams/<team>/<team>.integration.test.ts` for Communication Router wiring
- [ ] Test specialist selection, mock connector execution, synthesis, and dashboard model

## Failure response

| Failure | Action |
|---------|--------|
| `unknown_specialist` | Add specialist to inventory or fix manifest `specialistId` |
| `unknown_connector_capability` | Add capability to connector catalog |
| `unknown_knowledge_pack` | Add pack metadata or fix manifest reference |
| Prompt assembly validation | Fix knowledge layers or switch template category |
| Team test failure | Check mock connector permissions and capability routing |

## Out of scope

- Full repo test suite (unrelated Nordi/localization failures may exist)
- Root build (may be blocked by unrelated work)
- External provider integration tests
