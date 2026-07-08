# CAT Workforce Advisor — NEO Light Bridge

This document describes the **light bridge** that lets the website's CAT
Workforce Advisor produce **structured** workforce recommendations from
NEO-style domain logic — without running the full NEO installer/provisioning
stack, connecting billing, or requiring Supabase.

> Status: local domain logic (no NEO runtime dependency). Designed so the same
> capability can later move into NEO as a reusable service with no change to the
> website's calling contract.

---

## What was built (NB-WEB-002)

| Piece | Location | Role |
| --- | --- | --- |
| Advisor button (top-center) | `components/CatAdvisor.tsx` | Persistent "Talk to CAT" entry — top-center on desktop, sticky bottom pill on mobile |
| Mock consultation panel | `components/CatAdvisor.tsx` | Chat/consultation UI with quick replies, free-text, and a region (CO/US) toggle |
| API route | `app/api/cat/workforce-advisor/route.ts` | `POST` a business description → structured recommendation JSON; `GET` returns the input contract |
| Domain logic (the bridge) | `lib/workforceAdvisor.ts` | Pure, side-effect-free `recommendWorkforce()` implementing the sizing + trust rules |
| Shared content | `lib/workforce.ts` | Tiers, industries, pricing, Team Tasks reused by the page and the logic |

The website never talks to NEO directly. It calls **one HTTP seam**
(`/api/cat/workforce-advisor`), which today delegates to local logic and later
can proxy to NEO.

---

## Request / response contract

`POST /api/cat/workforce-advisor`

Request body (all fields optional; free-text is parsed server-side):

```jsonc
{
  "message": "we run a dental clinic, appointments and billing are piling up",
  "industry": "dental clinic",       // optional explicit hint
  "requestedPlan": "Team",           // Specialist | Team | Manager | Regional Manager
  "locations": 1,                     // number
  "teamsInUse": 0,                    // number
  "volume": "high",                  // low | medium | high
  "region": "US"                     // CO | US (drives pricing)
}
```

Response:

```jsonc
{
  "ok": true,
  "input": { /* sanitized echo */ },
  "recommendation": {
    "recommendedPlan": "Specialist",
    "requestedPlan": "Team",
    "why": "…smallest useful solution reasoning…",
    "notRecommended": "You selected a full Dental Clinic Team, but I recommend starting with the Appointment Specialist and Billing Specialist first.",
    "nextStep": "Start your Appointment Specialist (from $35/mo, United States early access)…",
    "estimatedTeamTasks": "≈ 100–400 Team Tasks / month",
    "scopeNote": "Appointment Specialist, Billing Specialist are handled by different Specialists…",
    "industry": { "name": "Dental Clinic", "starter": "…", "team": "…", "addManager": "…" },
    "pricing": { "region": "United States", "regionCode": "US", "startingPrice": "from $35/mo", "note": "Early access pricing" },
    "disclaimer": "…no real install or billing is performed."
  }
}
```

The structured shape (`recommendedPlan`, `why`, `notRecommended`, `nextStep`,
`estimatedTeamTasks`) is the stable contract; adding fields is backward
compatible.

---

## Domain rules encoded (authority / scope)

Implemented in `recommendWorkforce()`:

1. **Smallest useful solution.** Defaults to a single **Specialist**; only
   escalates to **Team** on high volume, **Manager** when a full Team/location
   already exists, and **Regional Manager** only with multiple locations.
2. **Never oversell.** If `requestedPlan` outranks the recommendation, the
   `notRecommended` field explains starting smaller (e.g., the dental-clinic
   example). If the customer isn't over-asking, CAT still states it won't push
   the next tier "until your workload clearly needs it."
3. **Scope / authority.** When a message spans multiple specialties (e.g.
   billing *and* scheduling), `scopeNote` explains those belong to **different
   Specialists** and should start as one Specialist, joining later as a Team.
4. **Team Tasks, not tokens.** Capacity is expressed as `estimatedTeamTasks`
   ranges — never tokens or credits.
5. **Pricing.** Colombia and U.S. starting prices come from
   `lib/workforce.ts` (`pricingRegions`), selected by `region`.

Industries currently covered include the four required (restaurant, dental
clinic, drug testing facility, flight school) plus additional Northbridge
verticals; unknown industries fall back to generic Specialist-first guidance.

---

## How this moves into NEO later

The bridge is intentionally shaped like a future NEO capability so migration is
a swap, not a rewrite:

1. **Promote the pure function to a NEO capability.** `recommendWorkforce()` is
   dependency-free and deterministic. It maps directly onto a NEO "workforce
   advisor" capability that owns the canonical workforce taxonomy
   (Specialist → Team → Manager → Regional Manager), industry playbooks, and
   regional pricing.
2. **Move the data to NEO manifests.** `workforceTiers`, `industries`, and
   `pricingRegions` become NEO-managed workforce definitions (versioned in the
   NEO manifest for `platform-northbridge-digital`) instead of static TS. The
   website reads them through the capability rather than bundling them.
3. **Keep the same HTTP seam.** `app/api/cat/workforce-advisor/route.ts` stays
   the website's boundary. Its body simply changes from
   `recommendWorkforce(input)` (local) to calling the NEO capability
   (e.g. via the NEO client used by `scripts/bootstrap-neo.mjs`), keeping the
   request/response contract identical so the front-end is unaffected.
4. **Later, add real provisioning behind a separate, guarded action.** Sizing
   (this bridge) stays read-only and safe. Actually *hiring* a workforce
   (billing, Supabase, provisioning) remains a distinct NEO install action —
   dry-run/preflight first — and is explicitly **out of scope** here.

### Boundaries honored

- No real NEO install or provisioning is run.
- No billing is connected; pricing is "early access / starting at" only.
- No Supabase or other connector is required.
- NEO source is not modified; this repo only adds a local, forward-compatible
  bridge.
