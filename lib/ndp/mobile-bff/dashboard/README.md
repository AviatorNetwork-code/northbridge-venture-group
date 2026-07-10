# Native Dashboard BFF Contract

Backend-for-frontend contract between native mobile clients and the Dashboard Composition Engine.

This layer defines request/response models, DTOs, mapping, validation, serialization, and versioning. It does **not** implement HTTP routes, GraphQL, or authentication.

## Flow

```
Native App
    ↓
Dashboard BFF (this contract)
    ↓
Dashboard Composition Engine
    ↓
Multi-Team Operations View
    ↓
Team Reports
```

Native clients receive a ready-to-render model. They must not rebuild sections, aggregate recommendations, merge reports, or infer KPIs.

## Usage

```typescript
import { buildDashboardModel } from "@/lib/ndp/dashboard";
import {
  mapDashboardModelToResponse,
  validateDashboardRequest,
  validateDashboardResponse,
  validateResponseIntegrity,
  serializeDashboardResponse,
} from "@/lib/ndp/mobile-bff/dashboard";

const request = {
  organizationId: "org-acme",
  customerId: "customer-1",
  activeTeamIds: ["team-marketing", "team-sales"],
  locale: "en-US",
  timezone: "America/New_York",
};

const requestValidation = validateDashboardRequest(request);
if (!requestValidation.valid) throw new Error("Invalid request");

const model = buildDashboardModel({
  organizationId: request.organizationId,
  activeTeamIds: request.activeTeamIds,
  teamReports,
});

const response = mapDashboardModelToResponse(model, { request });
validateDashboardResponse(response);
validateResponseIntegrity(response);

const payload = serializeDashboardResponse(response);
```

## Versioning

| Field | Purpose |
|-------|---------|
| `schemaVersion` | Wire format version for native clients |
| `apiVersion` | BFF contract version |
| `metadata.dashboardVersion` | Dashboard Composition Engine version |

All three are supported independently for backward-compatible evolution.

## Internal Field Policy

Mapping strips internal-only fields from card payloads:

- Specialist and team-lead identifiers
- Report and orchestration metadata
- Operations context references (unless `includeDebugMetadata`)
- Routing and execution internals

## Future Expansion

Response includes reserved placeholders (not implemented):

- `offlineSync`
- `pagination`
- `widgetRefresh`
- `deltaUpdates`
- `liveSubscriptions`

Use `includePlaceholders: true` on requests to include future dashboard sections (Manager, Director, Executive, AI Insights).
