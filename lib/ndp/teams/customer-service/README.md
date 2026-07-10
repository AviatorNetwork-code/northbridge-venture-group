# Customer Service Team Alpha

Third production-ready Digital Team on the Northbridge Workforce Platform. Reference implementation for customer experience workflows.

**Multi-agent default:** Customer Service Team Alpha delegates to multiple specialists by default. Team Lead (`lead-team-customer-service`) is the single customer-facing voice.

**Operations Intelligence:** Team consumes `@northbridge/operations-intelligence` via `@/lib/ndp/operations-context`. Real providers are intentionally deferred; OIL uses in-memory/example data.

## Structure

### Domain layer (`lib/ndp/domain/customer-service/`)

- `knowledge/` — production knowledge pack content
- `prompts/` — production prompt template sections
- `capabilities/` — customer service execution capabilities and specialist mapping
- `mock-connectors/` — mock connector execution (no external CRM/email/SMS providers)

### Team layer (`lib/ndp/teams/customer-service/`)

- `runtime/` — roster, selector, executor, synthesizer, orchestrator
- `recommendations/` — customer-success-first recommendation engine
- `dashboard/` — operational dashboard model
- `reporting/` — Team Lead operational reporting
- `wiring/` — Communication Router integration

## Digital Employees

- **Team Lead** (`lead-team-customer-service`) — single external voice; orchestrates specialists in parallel by default
- **Customer Service Specialist** — inquiry response and complaint handling
- **Reception Specialist** — inbound triage and first contact
- **Appointment Specialist** — scheduling and rescheduling
- **Reminder Specialist** — reminder planning and no-show reduction
- **Customer Success Specialist** — satisfaction review and retention

## Nordi Flow

```
Customer request → Communication Router → Customer Service Team Lead → Specialists (parallel, multi-agent) → Single synthesized response
```

## Usage

```typescript
import { createCustomerServiceCommunicationRouter } from "@/lib/ndp/teams/customer-service";

const router = createCustomerServiceCommunicationRouter({
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
    message: "I need help with customer inquiries.",
    intentTags: ["intent:operational"],
    capabilityTags: ["capability:customer_service"],
    receivedAt: new Date().toISOString(),
  },
});
```
