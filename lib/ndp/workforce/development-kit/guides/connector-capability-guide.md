# Connector Capability Guide

Digital Employees request **execution capabilities** — never provider names.

## Concept

```text
Digital Employee Manifest
        │
        ▼
connectorCapabilities: ["campaign.create", "crm.contact.create"]
        │
        ▼
Connector Registry (metadata)
        │
        ▼
Connector Router → Provider (future)
```

At launch, marketing capabilities use mock connectors in `lib/ndp/domain/marketing/mock-connectors/`.

## Capability catalog

Execution capabilities live in:

```
lib/ndp/connectors/catalog/capabilities.ts
```

Each capability defines:

| Field | Purpose |
|-------|---------|
| `id` | Execution ID referenced by manifests |
| `label` | Human-readable name |
| `description` | What the capability does |
| `category` | scheduling, crm, accounting, messaging, marketing, storage |
| `requiredPermission` | Permission envelope for runtime |
| `tags` | Discovery and routing helpers |

## Selecting capabilities for an employee

1. List the employee's operational responsibilities
2. Map each responsibility to an execution capability
3. Confirm capability exists in catalog (add metadata if new)
4. Align manifest `permissions.canDo` with `requiredPermission` values
5. List all capabilities in `connectorCapabilities` and `toolRequirements`

## Marketing example

| Responsibility | Capability |
|----------------|------------|
| Campaign planning | `campaign.create` |
| Campaign review | `campaign.review` |
| Ad management | `marketing.ad.create`, `marketing.ad.read` |
| Content planning | `content.plan` |
| Content calendar | `content.calendar` |
| Performance analysis | `marketing.analyze` |
| Budget review | `budget.review` |

## Routing tag mapping

Capabilities are also mapped to routing tags for Communication Router:

```typescript
ROUTING_TAG_TO_EXECUTION_CAPABILITIES["capability:customer_acquisition"]
// → marketing.ad.create, campaign.create, campaign.review, budget.review, ...
```

When adding capabilities, update routing mappings if the capability serves a routing tag.

## Permissions alignment

Manifest permissions must include required permissions for all connector capabilities:

```typescript
// Capability requires marketing:write
permissions: createSpecialistPermissions(["marketing:write"])

// Multiple permissions
permissions: createSpecialistPermissions(["marketing:write", "finance:read"])
```

Runtime denies execution when `canDo` lacks the required permission.

## Adding a new capability

1. Add entry to `NDP_EXECUTION_CAPABILITIES` in `capabilities.ts`
2. Update `ROUTING_TAG_TO_EXECUTION_CAPABILITIES` if applicable
3. Reference from employee manifest(s)
4. Implement mock connector in domain layer (team phase)
5. Run `connectors.test.ts`

Do not add provider SDK code to the connector catalog.

## Mock connectors (launch pattern)

Marketing Team Alpha demonstrates mock execution:

```typescript
import { createMarketingMockConnectorRegistry } from "@/lib/ndp/domain/marketing";

const registry = createMarketingMockConnectorRegistry();
```

Mock connectors:
- Register capabilities in `InMemoryConnectorRegistry`
- Return deterministic outputs for workflow validation
- Are replaced by real providers in a future phase

## Validation

```typescript
import { NDP_EXECUTION_CAPABILITY_ID_SET } from "@/lib/ndp/connectors";

for (const cap of manifest.connectorCapabilities) {
  expect(NDP_EXECUTION_CAPABILITY_ID_SET.has(cap)).toBe(true);
}
```

Manifest validation runs this automatically via `validateEmployeeManifest()`.

## Do not

- Reference provider names (`google-ads`, `mailchimp`) in manifests
- Bypass Connector Registry in team runtime
- Add SDK execution to catalog metadata
- Create per-customer capabilities
