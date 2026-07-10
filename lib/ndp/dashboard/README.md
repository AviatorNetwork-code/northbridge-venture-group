# Dashboard Composition Engine

Reusable engine that builds a structured `DashboardModel` for any Northbridge Digital organization. This layer does **not** render UI — it composes dashboard sections from operational inputs.

## Inputs

- Organization ID
- Active (hired) team IDs
- Team operational reports
- Operations Intelligence context (optional)
- Multi-Team Operations View (optional — built automatically when omitted)

## Output

`DashboardModel` with:

- Dynamic sections (team-owned cards, cross-team cards, always-available sections)
- Aggregated alerts (source team, severity, category, timestamp preserved)
- Presented recommendations (text unchanged; attribution, confidence, approval, evidence preserved)
- Metadata (freshness, confidence summary, active/missing sections)

## Entry Point

```typescript
import { buildDashboardModel } from "@/lib/ndp/dashboard";

const dashboard = buildDashboardModel({
  organizationId: "org-acme",
  activeTeamIds: ["team-marketing", "team-sales"],
  teamReports: [marketingReport, salesReport],
  operationsIntelligence: oilContext, // optional
  now: "2026-07-09T23:00:00.000Z",
});
```

## Section Composition

| Section | When shown |
|---------|------------|
| Organization Overview | Always |
| Active Digital Teams | Always |
| Recent Activity | Always |
| Alerts | Always |
| Marketing | `team-marketing` hired |
| Sales | `team-sales` hired |
| Customer Service | `team-customer-service` hired |
| Financial | `team-financial` hired |
| Cross-Team | More than one hired team |
| Manager / Director / Executive / AI Insights | Placeholder only (not implemented) |

## Nordi Integration

```typescript
import { buildNordiDashboardContext, answerNordiDashboardQuestion } from "@/lib/ndp/dashboard";

const nordiContext = buildNordiDashboardContext(dashboard);
const answer = answerNordiDashboardQuestion(dashboard, "Which team needs attention?");
```

Nordi may summarize the dashboard model. It must not fabricate cards, invent KPIs, or change team ownership.

## Architecture

```
teamReports + activeTeamIds
        │
        ▼
buildMultiTeamOperationsView (when not pre-built)
        │
        ├── buildAlwaysAvailableSections
        ├── buildTeamSection (per hired team)
        ├── buildCrossTeamSection (>1 team)
        ├── aggregateAlerts + alerts section
        └── presentRecommendations (top-level on model)
        │
        ▼
   DashboardModel + metadata
```
