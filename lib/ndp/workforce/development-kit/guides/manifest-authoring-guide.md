# Manifest Authoring Guide

Manifests define Digital Employees. They are metadata configuration — not behavior code.

## File location

Add launch manifests to:

```
lib/ndp/workforce/manifests/catalog/launch-manifests.ts
```

Use the existing `manifest()` helper — it auto-derives `teamIds` from Team Catalog assignments.

## Required fields

| Field | Source | Notes |
|-------|--------|-------|
| `employeeId` | Author | `employee-<role-slug>` |
| `displayName` | Author | Customer-facing name |
| `category` | Inventory `section` | `marketing`, `sales`, `customer-experience`, `financial` |
| `specialistId` | Inventory | Must exist in `specialists.ts` |
| `capabilities` | Inventory `capabilityTags` | Routing tags: `capability:*` |
| `connectorCapabilities` | Connector Registry | Execution IDs only |
| `knowledgePackIds` | Knowledge catalog | Ordered references; dependencies auto-resolve |
| `permissions` | Policy defaults | `createSpecialistPermissions([...])` |
| `memoryPolicy` | Policy defaults | `createSpecialistMemoryPolicy()` or override |
| `confidencePolicy` | Policy defaults | `createSpecialistConfidencePolicy()` or override |
| `escalationPolicy` | Policy defaults | `createSpecialistEscalationPolicy()` — target `team_lead` at launch |
| `kpis` | Policy defaults | `createDefaultKpis(category)` |
| `toolRequirements` | Auto | Derived from `connectorCapabilities` via `tools()` helper |

## Authoring pattern

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

## Policy defaults

Import from `lib/ndp/workforce/manifests/defaults/policies.ts`:

| Policy | Default behavior |
|--------|------------------|
| Memory | Thread scope, standard retention, loads conversation + customer context |
| Confidence | Minimum `medium`, partial results allowed |
| Escalation | Escalate on conflict, low confidence, permission denied → `team_lead` |
| KPIs | Task completion rate, response time, escalation rate per category |

Override only when the role has a documented reason (e.g. financial roles may require higher confidence).

## Validation rules

`validateEmployeeManifest()` enforces:

- Specialist exists in Workforce Inventory
- Team assignment matches Team Catalog
- Routing capabilities are known `capability:*` tags
- Connector capabilities exist in Connector Registry
- Knowledge pack references are valid
- Memory, confidence, escalation, and KPI policies are present
- Nordi never appears as an employee
- Launch-visible employees escalate to team lead (not manager)

## Common mistakes

| Mistake | Fix |
|---------|-----|
| Provider name in manifest | Use execution capability ID (`crm.contact.create`) |
| Specialist not on team | Add to `teams.ts` specialistIds first |
| Missing knowledge pack | Add pack metadata before referencing |
| Empty capabilities | Copy from inventory `capabilityTags` |
| Manager escalation at launch | Set `target: "team_lead"` |

## Runtime preview

After authoring, verify composition:

```typescript
import { buildSpecialistRuntimeConfigPreview } from "@/lib/ndp/workforce/manifests";

const preview = buildSpecialistRuntimeConfigPreview(manifest);
```

Preview is metadata only — no execution.

## Do not include in manifests

- Prompt text
- Knowledge article content
- Provider SDK references
- Custom runtime code
- Customer-specific data
