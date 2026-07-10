# Multi-Team Operations View

Neutral aggregation layer for cross-team operational visibility across hired Digital Teams.

**Not a manager.** Does not assign work, coordinate teams autonomously, or become a customer-facing employee.

## Purpose

Summarizes existing Team Lead operational intelligence for:

- Customer dashboard data models
- Nordi analysis context
- Cross-team conflict detection
- Future manager recommendation evidence

```text
Marketing Team Lead Report ───────┐
Sales Team Lead Report ───────────┤
Customer Service Team Report ─────┼→ Multi-Team Operations View
Financial Team Lead Report ───────┘
```

## Structure

| Module | Role |
|--------|------|
| `types.ts` | Normalized report, snapshot, signal, dashboard, and manager evidence models |
| `adapters.ts` | Normalizes Marketing, Sales, Customer Service, and Financial team reports |
| `signals.ts` | Cross-team signal and recommendation conflict detection |
| `manager-evidence.ts` | Future manager recommendation metadata (inactive by default) |
| `dashboard.ts` | Dashboard data model (no UI) |
| `builder.ts` | `buildMultiTeamOperationsView()` entry point |
| `nordi.ts` | Nordi analysis context — analyst role, not organizational manager |
| `observability.ts` | Telemetry-compatible event preparation |

## Usage

```typescript
import { buildMultiTeamOperationsView, buildNordiOperationsAnalysisContext } from "@/lib/ndp/operations-view";

const view = buildMultiTeamOperationsView({
  organizationId: "org-acme",
  hiredTeamIds: ["team-marketing", "team-sales"],
  teamReports: [marketingReport, salesReport],
});

const nordiContext = buildNordiOperationsAnalysisContext(view);
```

## Constraints

- Team report ownership is preserved
- Incompatible recommendations are flagged, not merged
- Manager recommendation remains inactive until evidence thresholds are met
- Real providers, UI, and Manager runtime are out of scope
