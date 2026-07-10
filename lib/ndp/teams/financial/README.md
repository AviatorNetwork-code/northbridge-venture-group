# Financial Team Alpha

Fourth production-ready Digital Team on the Northbridge Workforce Platform. Reference implementation for billing, receivables, and financial reporting workflows.

**Multi-agent default:** Financial Team Alpha delegates to multiple specialists by default. Team Lead (`lead-team-financial`) is the single customer-facing voice.

**Operations Intelligence:** Team consumes `@northbridge/operations-intelligence` via `@/lib/ndp/operations-context`. Real providers are intentionally deferred; OIL uses in-memory/example data.

## Structure

### Domain layer (`lib/ndp/domain/financial/`)

- `knowledge/` — production knowledge pack content
- `prompts/` — production prompt template sections
- `capabilities/` — financial execution capabilities and specialist mapping
- `mock-connectors/` — mock connector execution (no external accounting providers)

### Team layer (`lib/ndp/teams/financial/`)

- `runtime/` — roster, selector, executor, synthesizer, orchestrator
- `recommendations/` — customer-success-first recommendation engine
- `dashboard/` — operational dashboard model
- `reporting/` — Team Lead operational reporting
- `wiring/` — Communication Router integration

## Digital Employees

- **Team Lead** (`lead-team-financial`) — single external voice; orchestrates specialists in parallel by default
- **Financial Specialist** — financial analysis and expense awareness
- **Billing Specialist** — billing review and invoice preparation
- **Accounts Receivable Specialist** — receivables review and payment follow-up
- **Financial Reporting Specialist** — P&L, balance sheet, and cash flow reporting

## Nordi Flow

```
Customer request → Communication Router → Financial Team Lead → Specialists (parallel, multi-agent) → Single synthesized response
```

## Usage

```typescript
import { createFinancialCommunicationRouter } from "@/lib/ndp/teams/financial";

const router = createFinancialCommunicationRouter({
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
    message: "I need help with our finances.",
    intentTags: ["intent:operational"],
    capabilityTags: ["capability:finance"],
    receivedAt: new Date().toISOString(),
  },
});
```
