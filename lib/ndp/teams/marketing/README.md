# Marketing Team Alpha

First production-ready Digital Team on the Northbridge Workforce Platform. Reference implementation for all future teams.

**Multi-agent default:** Marketing Team Alpha delegates to multiple specialists by default. Team Lead (`lead-team-marketing`) is the single customer-facing voice. See [Multi-Agent Default Policy v1.0](../../../docs/northbridge-digital-workforce-multi-agent-default-policy-v1.md).

## Structure

### Domain layer (`lib/ndp/domain/marketing/`)

Reusable marketing domain assets shared across teams and future organizational layers:

- `knowledge/` — production knowledge pack content
- `prompts/` — production prompt template sections
- `capabilities/` — marketing execution capabilities and specialist mapping
- `mock-connectors/` — mock connector execution (no external APIs)

### Team layer (`lib/ndp/teams/marketing/`)

Team-specific orchestration and operational wiring:

- `runtime/` — roster, selector, executor, synthesizer, orchestrator (multi-agent default)
- `recommendations/` — customer-success-first recommendation engine
- `dashboard/` — operational dashboard model
- `reporting/` — Team Lead operational reporting
- `wiring/` — Communication Router integration

## Digital Employees

- **Team Lead** (`lead-team-marketing`) — single external voice; orchestrates specialists in parallel by default
- **Marketing Campaign Specialist** — campaign planning and audience recommendations
- **Content & Posts Specialist** — content calendar and social planning
- **Brand Specialist** — brand consistency and tone verification
- **Marketing Analytics Specialist** — KPI review and trend detection
- **Advertising Budget Specialist** — budget allocation and ROI analysis

## Platform Integration

Each Digital Employee connects through:

1. **Manifest** — `@/lib/ndp/workforce/manifests`
2. **Knowledge Packs** — `@/lib/ndp/domain/marketing/knowledge`
3. **Prompt Templates** — `@/lib/ndp/domain/marketing/prompts`
4. **Runtime Assembly** — `runtime/employee-runtime.ts`
5. **Mock Connectors** — `@/lib/ndp/domain/marketing/mock-connectors`
6. **Team Orchestrator** — `runtime/orchestrator.ts`
7. **Communication Router** — `wiring/communication-router.ts`

## Nordi Flow

```
Customer request → Communication Router → Marketing Team Lead → Specialists (parallel, multi-agent) → Single synthesized response
```

Internal delegation is never exposed to the customer. Broad requests delegate to two or more specialists; simple KPI lookups may use one specialist.

## Usage

```typescript
import { createMarketingCommunicationRouter } from "@/lib/ndp/teams/marketing";

const router = createMarketingCommunicationRouter({
  orgId: "org-acme",
  customerId: "cust-1",
});

const response = await router.handleRequest({
  request: {
    requestId: "req-1",
    orgId: "org-acme",
    customerId: "cust-1",
    threadId: "thread-1",
    channel: "nordi-thread",
    message: "I want more customers.",
    intentTags: ["intent:operational"],
    capabilityTags: ["capability:customer_acquisition"],
    receivedAt: new Date().toISOString(),
  },
});
```

Domain assets can also be imported directly:

```typescript
import { renderKnowledgePackText } from "@/lib/ndp/domain/marketing";
```
