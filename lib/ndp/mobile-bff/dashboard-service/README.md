# Authenticated Mobile Dashboard Transport

Server-side transport for native iOS and Android clients consuming the Dashboard BFF contract.

## Endpoint

`GET /api/mobile/v1/dashboard`

### Query parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `organizationId` | Yes | Organization to load |
| `locale` | No | BCP-47 locale (e.g. `en-US`) |
| `timezone` | No | IANA timezone |
| `appVersion` | No | Native app version |
| `dashboardVersion` | No | Requested dashboard engine version |
| `includePlaceholders` | No | Include future dashboard sections |

### Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | `Bearer <token>` |
| `x-correlation-id` | No | Request correlation ID |

The route does **not** accept `customerId` or `activeTeamIds` from the client. Identity and entitlements are resolved server-side.

## Architecture

```
Native App
    ↓
GET /api/mobile/v1/dashboard
    ↓
Authentication
    ↓
Organization authorization
    ↓
Mobile Dashboard Service
    ↓
Dashboard Composition Engine
    ↓
Dashboard BFF Mapping
    ↓
Validated DashboardResponse
```

## Example (development tokens)

```bash
curl -s \
  -H "Authorization: Bearer token-customer-1" \
  "http://localhost:3000/api/mobile/v1/dashboard?organizationId=org-acme&locale=en-US"
```

## HTTP status codes

| Status | Meaning |
|--------|---------|
| 200 | Valid dashboard |
| 400 | Invalid request or unsupported dashboard version |
| 401 | Unauthenticated |
| 403 | Organization access denied |
| 404 | Organization unavailable |
| 409 | Dashboard cannot be composed |
| 500 | Unexpected server failure |

## OIL policy

When Operations Intelligence is unavailable, the dashboard service continues composition without OIL context (`MOBILE_DASHBOARD_OIL_POLICY.allowMissingOperationsIntelligence = true`).

Loader failures return sanitized `409` responses without internal details.

## Observability

Telemetry events (non-blocking):

- `mobile_dashboard_requested`
- `mobile_dashboard_authorized`
- `mobile_dashboard_built`
- `mobile_dashboard_failed`
