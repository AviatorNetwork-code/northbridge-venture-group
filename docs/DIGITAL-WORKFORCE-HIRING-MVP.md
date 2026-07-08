# Digital Workforce Hiring MVP (NB-NDP-001)

The first customer-facing flow for **hiring** a Northbridge Digital Workforce:
discover → recommendation → onboarding (connectors) → hire. It reuses the
existing workforce model (it does **not** invent a separate one) and is safe for
production builds — **no real billing, no live OAuth, no real customer data, no
backend beyond mock API routes.**

## Flow

Route: **`/workforce/hire`** (`components/HireFlow.tsx`), a 4-step client wizard.
CAT's top-center Workforce Advisor entry is present on the page throughout.

1. **Discovery** — industry, workload (Just starting / Steady / Slammed),
   number of locations, pricing region (Colombia / United States).
2. **Recommendation + Catalog + Pricing** — calls the advisor
   (`POST /api/cat/workforce-advisor`) and shows the trust-first result:
   *start with a Specialist, grow into a Team, Manager not needed yet.* The
   workforce catalog (Specialists / Teams / Managers) is shown with the
   recommended tier highlighted, plus the Colombia + U.S. pricing preview.
3. **Onboarding** — connector checklist split into **required / recommended /
   optional**, with **mock** Connect buttons (Google Calendar, Gmail, WhatsApp,
   Stripe, HubSpot). Connecting only toggles local UI state.
4. **Hire** — review summary, then **Start setup** or **Request early access**.
   Posts to `POST /api/workforce/hire`, which returns a mock confirmation with a
   reference id. No payment, no provisioning.

## Reused workforce model (single source of truth)

| Concept | Where |
| --- | --- |
| Tiers (Specialist → Team → Manager → Regional Manager) | `lib/workforce.ts` `workforceTiers` |
| Catalog (concrete Specialists/Teams/Managers) | `lib/workforce.ts` `workforceCatalog` |
| Industries (restaurant, dental clinic, drug testing facility, flight school, …) | `lib/workforce.ts` `industries` |
| Pricing (Colombia + U.S.) | `lib/workforce.ts` `pricingRegions` |
| Recommendation logic (smallest useful, no oversell, scope) | `lib/workforceAdvisor.ts` |
| Connector Platform + Onboarding checklist | `lib/neo/connectors.ts` |

## Mapping to NEO platform packages

NEO is not reachable from this repo yet (see
`docs/validation/NB-VAL-004-REAL-BOOTSTRAP.md`), so these are **local
stand-ins** shaped to match the NEO contracts. When NEO access is available,
each becomes a thin client over the corresponding package with no change to the
website's calling seams (`/api/cat/*`, `/api/workforce/*`).

| NEO package | Local stand-in today | Migration |
| --- | --- | --- |
| **Workforce Experience Layer** | `/workforce`, `/workforce/hire`, CAT panel | Stays in the website; consumes NEO capabilities via the API routes |
| **Workforce Specialists** | `workforceCatalog`, `workforceTiers` (`lib/workforce.ts`) | Catalog served from the NEO Workforce Specialists package (versioned in the `platform-northbridge-digital` manifest) |
| **Customer Onboarding** | `onboardingChecklist()` + `/api/workforce/hire` | Onboarding intake + checklist owned by the NEO Customer Onboarding package (dry-run/preflight first) |
| **Connector Platform** | `connectors` + mock Connect buttons (`lib/neo/connectors.ts`) | Real connector definitions + OAuth handled by NEO Connector Platform; website keeps the same connector ids |
| **Messaging Platform** | CAT consultation panel (`components/CatAdvisor.tsx`) | Backed by NEO Messaging Platform for real Specialist/Team/Manager conversations |
| **Work Item Runtime** | `estimatedTeamTasks` capacity ranges | Real Team Task execution + capacity accounting from the NEO Work Item Runtime |

### Seams that stay stable

- `POST /api/cat/workforce-advisor` — recommendation (today: local
  `recommendWorkforce()`; later: NEO Workforce Experience/Specialists).
- `POST /api/workforce/hire` — onboarding intake (today: mock confirmation;
  later: NEO Customer Onboarding, still dry-run/preflight before any real
  provisioning or billing).

## Boundaries honored

- No real billing or payment.
- No live OAuth — connectors are mocked in the UI.
- No real customer data; the hire intake does not persist anything.
- No backend beyond the two mock Next.js route handlers.
- NEO source is not modified; only forward-compatible local contracts are added.
