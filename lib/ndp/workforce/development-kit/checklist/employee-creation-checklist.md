# Employee Creation Checklist

Use this checklist for every new Digital Employee. Do not skip steps.

## Phase 1 — Inventory and team assignment

- [ ] **Specialist exists** in `lib/ndp/workforce/catalog/specialists.ts`
  - `id`, `name`, `section`, `mission`, `capabilityTags` defined
- [ ] **Specialist assigned** to at least one team in `lib/ndp/workforce/catalog/teams.ts`
  - Specialist id appears in `team.specialistIds`
- [ ] **Team capability tags** cover the specialist's routing needs
- [ ] **No Nordi** — Nordi is never a Digital Employee

## Phase 2 — Connector capabilities

- [ ] **Execution capabilities identified** for the employee's responsibilities
- [ ] **Capabilities exist** in `lib/ndp/connectors/catalog/capabilities.ts`
  - Add new capability metadata if needed (no provider SDKs)
- [ ] **Permissions align** with `requiredPermission` on each capability
- [ ] **toolRequirements** in manifest mirror `connectorCapabilities`

## Phase 3 — Knowledge packs

- [ ] **Domain fundamentals pack** selected (e.g. `knowledge-pack-marketing-fundamentals`)
- [ ] **Role-specific pack** selected if available (e.g. `knowledge-pack-campaign-planning`)
- [ ] **Universal packs** included: `knowledge-pack-professional-communication`
- [ ] **Organization packs** included: `knowledge-pack-northbridge-communication-standards`
- [ ] **Dependencies resolve** — no circular references
- [ ] **Pack metadata added** to `launch-packs.ts` if creating a new pack

## Phase 4 — Manifest

- [ ] **employeeId** follows `employee-<role>` convention
- [ ] **displayName** is customer-appropriate (no internal jargon)
- [ ] **category** matches specialist `section`
- [ ] **capabilities** use `capability:*` routing tags from inventory
- [ ] **connectorCapabilities** reference execution IDs only (never provider names)
- [ ] **knowledgePackIds** listed on manifest
- [ ] **permissions** defined via `createSpecialistPermissions([...])`
- [ ] **memoryPolicy** set (default or override)
- [ ] **confidencePolicy** set (default or override)
- [ ] **escalationPolicy** targets `team_lead` for launch-visible employees
- [ ] **kpis** defined (defaults via `createDefaultKpis(category)`)
- [ ] **lifecycleStatus** and **launchVisible** set appropriately
- [ ] Manifest entry added to `catalog/launch-manifests.ts`

## Phase 5 — Prompt template

- [ ] **Template category mapped** (marketing → `prompt-template-marketing-specialist`, etc.)
- [ ] **Template manifest compatibility** passes
- [ ] **Template knowledge compatibility** passes
- [ ] **Prompt assembly plan** builds without error

## Phase 6 — Domain content (team implementation phase)

Skip for manifest-only employees. Required when building a production team.

- [ ] Production knowledge content in `lib/ndp/domain/<domain>/knowledge/`
- [ ] Production prompt sections in `lib/ndp/domain/<domain>/prompts/`
- [ ] Mock connectors in `lib/ndp/domain/<domain>/mock-connectors/` (until real providers)

## Phase 6b — Multi-agent team wiring (team implementation phase)

Required when building a customer-facing team. See [Multi-Agent Default Policy v1.0](../../../../docs/northbridge-digital-workforce-multi-agent-default-policy-v1.md).

- [ ] Team orchestrator uses `NDP_DEFAULT_TEAM_LEAD_POLICY` from `lib/ndp/teams/shared/`
- [ ] `IsolatedSpecialistRuntimeFactory` for parallel multi-agent execution
- [ ] Specialist selector delegates to multiple specialists by default
- [ ] `isSimpleTeamRequest()` gates single-specialist exception
- [ ] Team Lead synthesizer hides specialist identities
- [ ] `escalateOnConflict: true` and `customerFacingViaTeamLeadOnly: true`

## Phase 7 — Validation

- [ ] `validateEmployeeReadiness({ employeeId })` returns `ready: true`
- [ ] `manifests.test.ts` passes
- [ ] `knowledge.test.ts` passes
- [ ] `prompts.test.ts` passes
- [ ] `connectors.test.ts` passes
- [ ] Team tests pass (when team runtime exists)
- [ ] Root lint passes

## Phase 8 — Documentation

- [ ] Employee documented in team README or domain README
- [ ] Connector capability mapping documented
- [ ] Any new knowledge packs documented in knowledge README count

## Sign-off criteria

An employee is ready for launch when:

1. All Phase 1–5 and Phase 7 items are complete
2. Readiness validation reports zero failures
3. No provider names appear in manifest or team code
4. Escalation targets team lead for launch-visible employees
