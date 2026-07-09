# Future Team Creation Workflow

How to build a new Digital Team using Marketing Team Alpha as the reference.

**Do not implement teams in the DEDK phase.** This workflow documents the repeatable pattern for Sales, Customer Service, Financial, and industry teams.

## Overview

```text
Phase A — Platform metadata (per employee)
Phase B — Domain layer (reusable assets)
Phase C — Team layer (orchestration)
Phase D — Integration (Communication Router)
Phase E — Validation
```

## Phase A — Platform metadata

For each specialist on the team:

1. Confirm specialist in `lib/ndp/workforce/catalog/specialists.ts`
2. Assign to team in `lib/ndp/workforce/catalog/teams.ts`
3. Add connector capabilities to `lib/ndp/connectors/catalog/capabilities.ts` if needed
4. Add knowledge pack metadata to `launch-packs.ts` if needed
5. Add manifest to `launch-manifests.ts`
6. Run framework tests

Follow `checklist/employee-creation-checklist.md` for each employee.

## Phase B — Domain layer

Create reusable domain assets at `lib/ndp/domain/<domain>/`:

```
lib/ndp/domain/<domain>/
  constants.ts           # specialist/employee IDs (if domain-scoped)
  index.ts               # domain public exports
  knowledge/content.ts   # production knowledge text
  prompts/production-templates.ts
  capabilities/index.ts  # execution capability mapping
  mock-connectors/index.ts
```

**Separate domain from team.** Domain assets may later be reused by Manager, Director, and VP layers.

## Phase C — Team layer

Create team orchestration at `lib/ndp/teams/<team>/`:

```
lib/ndp/teams/<team>/
  constants.ts           # team ID, lead ID; re-export domain IDs
  index.ts               # public API (re-exports domain + team)
  runtime/
    roster.ts
    specialist-selector.ts
    employee-runtime.ts
    task-executor.ts
    synthesizer.ts
    orchestrator.ts
  recommendations/engine.ts
  reporting/operational-report.ts
  dashboard/model.ts
  wiring/communication-router.ts
  <team>.test.ts
  <team>.integration.test.ts
  README.md
```

Copy structure from `lib/ndp/teams/marketing/`. Replace domain imports and specialist mappings.

## Phase D — Communication Router integration

1. Define route rules mapping capability tags to team ID
2. Create `create<Team>CommunicationRouter()` factory
3. Wire `TeamOrchestratorExecutionHandler` with team orchestrator
4. Resolve team lead ID from team constants

Marketing pattern:

```typescript
import { TeamOrchestratorExecutionHandler } from "@/lib/ndp/conversation-router/adapters/team-orchestrator-handler";
import { createTeamOrchestrator } from "@northbridge/team-orchestrator";

const router = createCommunicationRouter({
  resolveRouteRules: async () => buildMarketingRouteRules(orgId),
  teamHandler: new TeamOrchestratorExecutionHandler({
    orchestrator: createMarketingTeamOrchestrator({ orgId }),
    resolveTeamLeadId: async () => MARKETING_TEAM_LEAD_ID,
  }),
});
```

## Phase E — Validation

Per `checklist/testing-checklist.md`:

- [ ] All employee readiness checks pass
- [ ] Framework tests pass (manifests, knowledge, prompts, connectors)
- [ ] Team unit tests pass
- [ ] Integration test: Nordi request → router → team → single response
- [ ] Team Orchestrator + Specialist Runtime package tests pass
- [ ] Root lint passes

## Team checklist

| Item | Marketing Alpha | New team |
|------|----------------|----------|
| Team catalog entry | `team-marketing` | `team-<name>` |
| Team lead ID | `lead-team-marketing` | `lead-team-<name>` |
| Specialist selector | Tag-based | Adapt tags |
| Synthesizer | Single customer voice | Reuse pattern |
| Mock connectors | 6 marketing caps | Domain-specific |
| Dashboard cards | 9 operational cards | Domain-specific |
| Recommendations | Customer-success-first | Reuse policy |

## What not to duplicate

- Manifest framework (`lib/ndp/workforce/manifests/`)
- Knowledge framework (`lib/ndp/workforce/knowledge/`)
- Prompt template framework (`lib/ndp/workforce/prompts/`)
- Connector registry (`lib/ndp/connectors/`)
- `@northbridge/*` workforce packages

## Organizational layers (future)

When Manager, Director, and VP layers launch:

- Import domain assets from `lib/ndp/domain/<domain>/`
- Add orchestration layer above team (not inside team folder)
- Team Lead remains customer-facing voice at team level
- Higher layers coordinate across teams — they do not replace team structure

## Reference

Marketing Team Alpha commit: `feat(marketing): implement marketing team alpha`

Structure:
- Domain: `lib/ndp/domain/marketing/`
- Team: `lib/ndp/teams/marketing/`
