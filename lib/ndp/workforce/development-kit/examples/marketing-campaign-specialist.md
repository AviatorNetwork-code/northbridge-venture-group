# Example: Marketing Campaign Specialist

Canonical reference Digital Employee. Use this as the template for all future employees.

## Identity

| Field | Value |
|-------|-------|
| Employee ID | `employee-marketing-campaign` |
| Display name | Marketing Campaign Specialist |
| Specialist ID | `marketing-campaign-specialist` |
| Category | `marketing` |
| Team | `team-marketing` |

## Inventory reference

From `lib/ndp/workforce/catalog/specialists.ts`:

```typescript
{
  id: "marketing-campaign-specialist",
  name: "Marketing Campaign Specialist",
  section: "marketing",
  mission: "Plans and manages marketing campaigns",
  capabilityTags: ["capability:customer_acquisition", "capability:analytics"],
}
```

## Manifest

From `lib/ndp/workforce/manifests/catalog/launch-manifests.ts`:

```typescript
manifest({
  employeeId: "employee-marketing-campaign",
  displayName: "Marketing Campaign Specialist",
  category: "marketing",
  specialistId: "marketing-campaign-specialist",
  capabilities: ["capability:customer_acquisition", "capability:analytics"],
  connectorCapabilities: [
    "marketing.ad.create",
    "marketing.ad.read",
    "campaign.create",
    "campaign.review",
  ],
  knowledgePackIds: [
    "knowledge-pack-professional-communication",
    "knowledge-pack-marketing-fundamentals",
    "knowledge-pack-campaign-planning",
    "knowledge-pack-northbridge-communication-standards",
  ],
  permissions: createSpecialistPermissions(["marketing:write"]),
}),
```

## Policies (defaults applied)

| Policy | Value |
|--------|-------|
| Memory | Thread scope, loads conversation + customer context |
| Confidence | Minimum `medium`, partial results allowed |
| Escalation | → `team_lead`, on conflict/low confidence/permission denied |
| KPIs | `marketing-task-completion-rate`, `marketing-average-response-time`, `marketing-escalation-rate` |

## Knowledge packs resolved

Direct references plus transitive dependencies:

```text
Professional Communication
  └── (dependency chain via Marketing Fundamentals)
Marketing Fundamentals
  └── Business Operations Fundamentals
        └── Business Writing
              └── Professional Communication
Campaign Planning
  └── Marketing Fundamentals
Northbridge Communication Standards
  └── Professional Communication
```

## Prompt template

- Template: `prompt-template-marketing-specialist`
- Output style: `specialist`
- Production content: `lib/ndp/domain/marketing/prompts/production-templates.ts`

## Connector capabilities

| Capability | Permission | Mock output |
|------------|------------|-------------|
| `campaign.create` | `marketing:write` | Draft campaign plan |
| `campaign.review` | `marketing:read` | Active campaign review |
| `marketing.ad.create` | `marketing:write` | (catalog capability) |
| `marketing.ad.read` | `marketing:read` | (catalog capability) |

Primary runtime capability: `campaign.create` (via `SPECIALIST_PRIMARY_CAPABILITY`)

## Team runtime wiring

| Component | Location |
|-----------|----------|
| Specialist selector | `lib/ndp/teams/marketing/runtime/specialist-selector.ts` |
| Task executor | `lib/ndp/teams/marketing/runtime/task-executor.ts` |
| Runtime assembly | `lib/ndp/teams/marketing/runtime/employee-runtime.ts` |
| Mock connectors | `lib/ndp/domain/marketing/mock-connectors/` |

## Readiness validation

```typescript
import { validateEmployeeReadiness } from "@/lib/ndp/workforce/development-kit";

const report = validateEmployeeReadiness({
  employeeId: "employee-marketing-campaign",
});

// report.ready === true
// report.suggestedPromptTemplateId === "prompt-template-marketing-specialist"
// report.resolvedKnowledgePackCount > 0
// report.connectorCapabilityCount === 4
```

## Checklist completion

| Phase | Status |
|-------|--------|
| Inventory + team | ✓ |
| Connector capabilities | ✓ |
| Knowledge packs | ✓ |
| Manifest | ✓ |
| Prompt template | ✓ |
| Domain content | ✓ |
| Team runtime | ✓ |
| Tests | ✓ |

## Replicating for a new employee

1. Copy the manifest pattern — change ids, capabilities, and knowledge packs
2. Confirm inventory specialist exists and is on the target team
3. Map responsibilities to connector capabilities
4. Select knowledge packs per the knowledge pack selection guide
5. Run `validateEmployeeReadiness({ employeeId })`
6. When building a team, add production prompts and mock connector outputs in the domain layer
