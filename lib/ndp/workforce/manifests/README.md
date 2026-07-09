# Digital Employee Manifest Framework

Product configuration infrastructure for defining Northbridge Digital Employees by manifest — not custom code.

## Concepts

| Concept | Description |
|---------|-------------|
| **Specialist** | Workforce Inventory entry — reusable role metadata (`specialistId`, mission, routing capability tags) |
| **Digital Employee** | Product-facing employee instance defined by a manifest — policies, tools, KPIs, launch visibility |
| **Team Lead** | Orchestration owner for a team; receives escalations from specialists at launch |
| **Team** | Team Catalog product grouping specialists under a Team Lead |
| **Nordi** | Platform assistant — not a Digital Employee and never appears in manifests |

```text
Workforce Inventory Specialist
        │
        ▼
Digital Employee Manifest  ──►  Team Catalog teamIds
        │
        ├── routing capabilities (capability:*)
        ├── connector capabilities (schedule.create, crm.contact.create, …)
        ├── permissions, memory, KPIs, escalation, confidence
        └── launch visibility + lifecycle status
        │
        ▼
Specialist Runtime Config Preview (future wiring)
```

## Manifest schema

```typescript
interface DigitalEmployeeManifest {
  employeeId: string;
  displayName: string;
  role: "specialist";
  category: SpecialistInventorySection;
  teamIds: string[];
  specialistId: string;
  capabilities: string[];              // routing tags: capability:*
  connectorCapabilities: string[];     // execution IDs from Connector Registry
  permissions: PermissionPolicy;
  memoryPolicy: MemoryPolicy;
  kpis: KpiDefinition[];
  escalationPolicy: EscalationPolicy;
  confidencePolicy: ConfidencePolicy;
  toolRequirements: ToolCapabilityRequirement[];
  lifecycleStatus: "draft" | "active" | "deprecated" | "archived";
  launchVisible: boolean;
  featureFlags?: Partial<WorkforceFeatureFlags>;
  metadata?: Record<string, unknown>;
}
```

## Example manifest

```typescript
{
  employeeId: "employee-appointment",
  displayName: "Appointment Specialist",
  role: "specialist",
  category: "customer-experience",
  teamIds: ["team-customer-service", "team-general-service"],
  specialistId: "appointment-specialist",
  capabilities: ["capability:scheduling"],
  connectorCapabilities: ["schedule.create", "schedule.update", "schedule.cancel"],
  permissions: { canDo: ["execute_task", "scheduling:write"], cannotDo: ["bypass_escalation"] },
  memoryPolicy: { scope: "thread", retention: "standard", loadConversationContext: true, ... },
  kpis: [{ id: "customer-experience-task-completion-rate", label: "Task completion rate", ... }],
  escalationPolicy: { escalateOnConflict: true, target: "team_lead", ... },
  confidencePolicy: { minimumConfidence: "medium", requireHighForCustomerFacing: false, ... },
  toolRequirements: [
    { capabilityId: "schedule.create", required: true },
    { capabilityId: "schedule.update", required: true },
    { capabilityId: "schedule.cancel", required: true },
  ],
  lifecycleStatus: "active",
  launchVisible: true,
}
```

Digital Employees reference **Knowledge Pack IDs** via `knowledgePackIds` (see `lib/ndp/workforce/knowledge/`). Specialists request capabilities — never provider names.

## Launch manifests

Nineteen metadata-only manifests cover reusable cross-industry launch specialists:

- Marketing (5): Campaign, Content & Posts, Brand, Analytics, Advertising Budget
- Sales (5): Sales, Lead Qualification, Proposal & Quote, Follow-up, CRM
- Customer Experience (5): Customer Service, Reception, Appointment, Reminder, Customer Success
- Financial (4): Financial, Billing, Accounts Receivable, Financial Reporting

No prompts. No tool execution. No provider SDKs.

## Validation

`validateEmployeeManifests()` ensures every manifest:

- maps to an existing Workforce Inventory specialist
- belongs to at least one Team Catalog team (with matching specialist assignment)
- references valid routing capabilities (`capability:*`)
- references valid connector capabilities from the Connector Registry
- defines memory, confidence, escalation, and KPI policies
- excludes Nordi
- excludes launch-visible managers, directors, and VPs

## Runtime config preview

`buildSpecialistRuntimeConfigPreview()` produces a composition-ready shape for future `@northbridge/specialist-runtime` wiring without executing tools or loading prompts.

## Adding a future Digital Employee

1. Add or confirm the specialist exists in `lib/ndp/workforce/catalog/specialists.ts`.
2. Assign the specialist to teams in `lib/ndp/workforce/catalog/teams.ts`.
3. Confirm connector capabilities exist in `lib/ndp/connectors/`.
4. Add a manifest entry to `catalog/launch-manifests.ts`.
5. Run `manifests.test.ts` — validation must pass.

Do not add prompts, SDK integrations, or provider names to manifests.

## Boundaries

- No real employee behavior
- No production prompts
- No tool execution or provider connections
- No changes to reusable `@northbridge/*` workforce packages
- No Communication Router or Team Orchestrator behavior changes

## Related modules

| Module | Role |
|--------|------|
| `lib/ndp/workforce/catalog/` | Team and specialist inventory |
| `lib/ndp/connectors/` | Connector capability registry |
| `lib/ndp/conversation-router/` | Customer request routing |
| `@northbridge/specialist-runtime` | Future execution wiring target |
