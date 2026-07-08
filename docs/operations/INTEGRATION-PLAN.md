# NB-WEB-OPS-001 — AI Operations Center Integration Plan

## Architecture

```
Northbridge Digital Website (presentation layer)
        │
        ▼
lib/neo/platform.ts  →  getNeoPlatform()
        │
        ▼
NEO Platform Packages (intelligence + operations)
  • @neos/workforce
  • @neos/collaboration
  • @neos/work-items
  • @neos/connector-platform
  • @neos/customer-onboarding
  • @neos/messaging
  • @neos/institutional-learning
  • @neos/analytics (executive + command services)
```

The website **does not** own business logic, connector OAuth, workflow engines, or domain models. It renders NEO service snapshots through typed contracts in `lib/neo/contracts/`.

## Current state (v1 foundation)

| Layer | Status |
|-------|--------|
| Operations shell | `/operations/*` — 8 sections with sidebar navigation |
| NEO client | `getNeoPlatform()` with mock provider (`lib/neo/providers/mock.ts`) |
| Marketing site | Unchanged content; route group `(marketing)` preserves Header/Footer |
| Live NEO packages | Not linked — mock data until `neo install manifest` bindings |

## Swapping mocks for live NEO packages

### 1. Install NEO platform bindings

From the website repo after NEO central checkout at `/neo`:

```bash
export PATH="/neo/packages/neo-cli/bin:$PATH"
cd /workspace
neo install manifest platform-northbridge-digital --org org-northbridge-digital --dry-run
# remove --dry-run when ready for real binding
```

### 2. Link workspace packages

Add to `package.json` (paths per NEO monorepo layout):

```json
{
  "workspaces": ["packages/*"],
  "dependencies": {
    "@neos/workforce": "file:../neo/packages/workforce",
    "@neos/collaboration": "file:../neo/packages/collaboration",
    "@neos/work-items": "file:../neo/packages/work-items",
    "@neos/connector-platform": "file:../neo/packages/connector-platform",
    "@neos/customer-onboarding": "file:../neo/packages/customer-onboarding",
    "@neos/messaging": "file:../neo/packages/messaging",
    "@neos/institutional-learning": "file:../neo/packages/institutional-learning"
  }
}
```

### 3. Replace type mirrors

Delete `lib/neo/types/index.ts` mirrors and re-export from packages:

```typescript
export type * from "@neos/workforce";
export type * from "@neos/connector-platform";
// …
```

### 4. Register live providers

Create `lib/neo/providers/live.ts` that implements `NeoPlatformServices` by delegating to NEO package clients. Wire in `lib/neo/platform.ts`:

```typescript
import { liveNeoPlatform } from "@/lib/neo/providers/live";
import { mockNeoPlatform } from "@/lib/neo/providers/mock";

const platform =
  process.env.NEO_LIVE === "true" ? liveNeoPlatform : mockNeoPlatform;
```

## Live connector integration (phased)

| Phase | Connectors | Website surface |
|-------|------------|-----------------|
| 1 | HubSpot, Slack, Google Workspace | Connector Center grid + health badges |
| 2 | WhatsApp Business, Telegram | Communications unified inbox |
| 3 | Salesforce, custom APIs | Available apps + Connect flow |
| 4 | OAuth refresh + permission audits | Workflow Center approvals |

Connector **Connect** buttons call `@neos/connector-platform` initiation endpoints — never website-side OAuth logic.

## CAT / Command Center

| Component | v1 | Live |
|-----------|-----|------|
| Quick command tiles | Static prompts from mock | `@neos/institutional-learning` suggestions |
| Ask CAT input | Disabled in mock mode | CAT runtime adapter from NEO |
| System health | Mock snapshot | NEO platform health API |

## Auth (future)

Operations Center routes are currently unauthenticated for foundation validation. Production requires:

- Customer org context (`org-northbridge-digital` pattern)
- Session middleware on `/operations/*`
- Role-based nav filtering from `@neos/workforce` permissions

## Routes

| Route | Section |
|-------|---------|
| `/operations` | Executive Dashboard |
| `/operations/workforce` | Digital Workforce |
| `/operations/connectors` | Connector Center |
| `/operations/onboarding` | Customer Onboarding |
| `/operations/workflows` | Workflow Center |
| `/operations/communications` | Communications |
| `/operations/command` | AI Command Center |
| `/operations/analytics` | Analytics |

## Non-goals (this deliverable)

- No new NEO platform packages created
- No website-side duplication of workflow or connector logic
- No marketing site redesign
- No real install or production connector credentials
