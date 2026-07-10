# Sales Team Alpha

Second production-ready Digital Team on the Northbridge Workforce Platform. Reference implementation for revenue conversion workflows.

**Multi-agent default:** Sales Team Alpha delegates to multiple specialists by default. Team Lead (`lead-team-sales`) is the single customer-facing voice.

**Operations Intelligence:** Team consumes `@northbridge/operations-intelligence` via `@/lib/ndp/operations-context`.

## Structure

### Domain layer (`lib/ndp/domain/sales/`)

- `knowledge/` — production knowledge pack content
- `prompts/` — production prompt template sections
- `capabilities/` — sales execution capabilities and specialist mapping
- `mock-connectors/` — mock connector execution (no external CRMs)

### Team layer (`lib/ndp/teams/sales/`)

- `runtime/` — roster, selector, executor, synthesizer, orchestrator
- `recommendations/` — customer-success-first recommendation engine
- `dashboard/` — operational dashboard model
- `reporting/` — Team Lead operational reporting
- `wiring/` — Communication Router integration

## Digital Employees

- **Team Lead** (`lead-team-sales`) — single external voice; orchestrates specialists in parallel by default
- **Sales Specialist** — pipeline strategy and conversion analysis
- **Lead Qualification Specialist** — lead scoring and prioritization
- **Proposal & Quote Specialist** — proposal structure and pricing presentation
- **Follow-up Specialist** — follow-up cadence and re-engagement
- **CRM Specialist** — CRM hygiene and pipeline record quality

## Nordi Flow

```
Customer request → Communication Router → Sales Team Lead → Specialists (parallel, multi-agent) → Single synthesized response
```

## Usage

```typescript
import { createSalesCommunicationRouter } from "@/lib/ndp/teams/sales";

const router = createSalesCommunicationRouter({
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
    message: "I need help converting leads.",
    intentTags: ["intent:operational"],
    capabilityTags: ["capability:sales_pipeline"],
    receivedAt: new Date().toISOString(),
  },
});
```
