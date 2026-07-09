# Nordi Mobile — Technical Architecture Plan

**Status:** Approved architecture (planning)  
**Platform:** React Native via Expo (managed workflow + EAS Build)  
**Audience:** Active Northbridge Digital customers  
**Backend:** Northbridge Digital Platform (NDP) — single integration surface  
**Date:** July 2026

---

## 1. Executive summary

Nordi Mobile is a **true native iOS and Android customer-success app** for businesses that have already hired Northbridge Digital workforce teams. It is **not** the public Nordi homepage, not a PWA, not Capacitor, and not a WebView wrapper around the marketing site.

The mobile app is a **thin native client**. All business intelligence, conversation policy, recommendations, billing logic, and workforce orchestration remain on NDP. The app renders native screens, authenticates the customer, calls NDP APIs, and displays structured responses.

**Core product principle:** *We succeed when you succeed.*

Customers do not configure workforce through admin forms. They talk to Nordi. Nordi recommends upgrades, downgrades, or no change based on evidence from operational data — never sales pressure.

---

## 2. Technology choice: React Native / Expo

### Why Expo (and not alternatives)

| Option | Verdict |
|--------|---------|
| **Expo + React Native** | **Selected.** Native navigation, native lists, native secure storage, EAS Build for App Store / Play Store, OTA updates for non-native JS fixes, strong TypeScript ecosystem. |
| Capacitor / WebView wrapper | **Rejected.** Violates native requirement; duplicates web UX; poor conversation performance and accessibility. |
| PWA | **Rejected.** No App Store presence, limited push/background, not “true native.” |
| Flutter | Viable but splits stack from existing TypeScript monorepo packages (`@northbridge/assistant-contracts`, etc.). |
| Pure Swift + Kotlin | Maximum native control but doubles UI implementation cost for v1; defer unless Expo hits a hard platform limit. |

### Native requirement compliance

Expo **is** React Native under the hood. The app must:

- Use **React Navigation** (or Expo Router) with native stack / tab navigators — not embedded WebViews for primary flows.
- Use native primitives: `FlatList`, `SectionList`, `TextInput`, `Pressable`, platform sheets, haptics, push via `expo-notifications`.
- Restrict WebView usage to **exceptional cases** (e.g. legal PDF, external payment provider redirect) — never for Dashboard, Nordi chat, or Reports.

### Repository placement (future)

When implementation is approved, add a sibling app package:

```
northbridge-venture-group/
  apps/
    nordi-mobile/          # Expo app (new)
  packages/
    assistant-contracts/   # Shared types only (existing)
    mobile-api-contracts/  # Optional: OpenAPI-generated types for NDP mobile BFF
  docs/
    nordi-mobile-architecture.md  # This document
```

**No mobile folder exists today.** This plan does not authorize implementation until product/engineering sign-off on MVP scope.

---

## 3. System context

```
┌─────────────────────────────────────────────────────────────────┐
│                     Nordi Mobile (iOS / Android)                 │
│  Native screens · Secure token storage · Push · Offline cache   │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS (NDP Mobile BFF)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              Northbridge Digital Platform (NDP)                  │
│  Auth · Tenant · RBAC · Mobile BFF · Rate limits · Audit        │
└─────┬───────────────────┬──────────────────────┬────────────────┘
      │                   │                      │
      ▼                   ▼                      ▼
┌─────────────┐   ┌───────────────┐   ┌─────────────────────────┐
│ Nordi       │   │ NEO / CAT     │   │ Workforce · Billing ·   │
│ Service     │   │ Conversation  │   │ Reports · Connectors    │
│ Layer       │   │ Infrastructure│   │                         │
└─────────────┘   └───────────────┘   └─────────────────────────┘
```

### Responsibility split

| Layer | Owns |
|-------|------|
| **Nordi Mobile** | Native UX, session tokens, local cache, push handling, privacy toggles UI, rendering API payloads |
| **NDP** | Authentication, authorization, tenant isolation, API versioning, routing, aggregation, audit |
| **Nordi service** | Northbridge Digital voice, customer-success framing, service upgrade/downgrade/no-change recommendations, business analysis |
| **NEO / CAT** | Reusable conversation infrastructure: turn policy, interruption handling, progressive delivery contracts, tool orchestration hooks |
| **Workforce / Billing services** | Operational reports, team status, invoices, usage — consumed by NDP, not directly by heuristic logic in the app |

### Relationship to public website Nordi

| Surface | User | Mode | `currentModule` (conceptual) |
|---------|------|------|------------------------------|
| northbridge.com `/` | Prospects / new visitors | Discovery, trust-first, optional save | `homepage` |
| Nordi Mobile | Paying customers | Success, operations, service guidance | `mobile-customer` |

The mobile app **must not** expose public-sales flows: no “Schedule a Call,” no hire funnel, no exploratory website permission for strangers.

---

## 4. Frontend / native app layers

### 4.1 Layer diagram

```
┌──────────────────────────────────────────────┐
│ Screens (Dashboard, Nordi, Reports, …)       │  ← Native UI only
├──────────────────────────────────────────────┤
│ Feature modules (dashboard/, nordi/, …)      │  ← View models, no business rules
├──────────────────────────────────────────────┤
│ Design system (tokens, NordiMobileButton…)   │  ← Northbridge brand
├──────────────────────────────────────────────┤
│ Navigation (Expo Router / React Navigation)    │
├──────────────────────────────────────────────┤
│ State: TanStack Query + Zustand (UI-only)    │  ← Server state from NDP
├──────────────────────────────────────────────┤
│ NDP API client (fetch + auth interceptor)    │  ← Thin; OpenAPI-typed
├──────────────────────────────────────────────┤
│ Platform services                            │
│  · expo-secure-store (tokens)                │
│  · expo-notifications (push)                 │
│  · expo-local-authentication (optional)      │
│  · netinfo (offline banner)                  │
└──────────────────────────────────────────────┘
```

### 4.2 Navigation structure (MVP)

Bottom tabs (native):

1. **Dashboard** — Home; team operational summaries
2. **Conversations** — Segmented: Workforce | Team | Nordi
3. **Reports** — Historical operational reports
4. **Account** — Billing, Settings, Privacy

Deep links: `nordi://conversation/{id}`, `nordi://report/{id}` (universal links later).

### 4.3 Screen inventory

| Screen | Purpose | Native components |
|--------|---------|-------------------|
| **Dashboard** | Operational snapshot for hired teams | ScrollView + cards, pull-to-refresh, skeleton loaders |
| **Workforce conversations** | Threads with deployed specialists/teams | FlatList, native composer |
| **Team conversations** | Team-level operational threads | FlatList |
| **Nordi conversation** | Primary customer-success advisor | Message list, typing indicator, optional progressive segments from API |
| **Reports** | PDF/list summaries | SectionList, share sheet |
| **Billing** | Invoices, plan summary (read-only) | List, no self-serve plan editing in v1 |
| **Settings** | Profile, notifications, sign out | Native forms |
| **Privacy settings** | Conversation learning consent, data controls | Toggles → NDP PATCH only |

### 4.4 Explicitly excluded UI (product rules)

- **No** “Schedule a Call”
- **No** “Manage Team” or “Add Employee” admin screens
- **No** workforce hire/catalog browser (that stays in operations onboarding for internal/sales paths)
- **No** manager/director/VP cards on dashboard at public launch — **teams only**
- Service changes happen **through Nordi conversation**, not configuration wizards

---

## 5. Backend / NDP integration

### 5.1 Mobile BFF pattern

NDP exposes a **Mobile BFF** (`/api/mobile/v1/*`) that:

- Authenticates JWT / refresh tokens scoped to `customer_account_id`
- Aggregates dashboard payloads (one round trip for home screen)
- Routes Nordi messages to Nordi service with `channel: "mobile"`
- Enforces RBAC (customer user sees only their tenant)
- Returns **render-ready DTOs** (cards, message segments, report summaries) — not raw engine internals

The website repo’s `local-provider.ts` already anticipates NDP routes such as `/api/cat/send`, `/api/workforce`, `/api/operations/snapshot`. Mobile should **not** call those raw operations endpoints directly; the BFF stabilizes contracts for app store longevity.

### 5.2 Request flow: Nordi message

```
Mobile App
  POST /api/mobile/v1/nordi/messages { sessionId, text }
    → NDP Mobile BFF (auth, tenant)
      → Nordi Service (customer-success policy, recommendation framing)
        → NEO/CAT conversation infrastructure (turn policy, interruptions)
      ← structured reply + cards + recommendation DTO (if any)
    ← MobileConversationResponse
Mobile renders native bubbles + action chips (no HTML)
```

### 5.3 Request flow: Dashboard

```
Mobile App
  GET /api/mobile/v1/dashboard
    → NDP aggregates:
        · hired_teams[] (only teams for launch)
        · per-team operational_report summary
        · if teams.length === 1 → single-team detail layout flag
        · if teams.length > 1  → summarized cards + drill-down IDs
        · nordi_insight optional (one sentence, from Nordi service)
    ← DashboardResponse
```

**Manager recommendation rule (platform, not app):** After **3–6 months** of operational data, Nordi service may attach a `recommended_addition: { tier: "manager", evidence: [...] }` object to dashboard or Nordi replies. The app **displays** it; it does not compute eligibility.

### 5.4 Shared contracts (types only)

Import from monorepo packages — **types and DTO validators only**:

- `@northbridge/assistant-contracts` — message/card/explanation shapes
- Future `@northbridge/mobile-api-contracts` — OpenAPI-generated from NDP mobile spec

**Never copy** `discovery-engine.ts`, `consultant-voice`, `platform-turn-policy`, or workforce recommendation engines into the app.

---

## 6. Logic that must stay out of the mobile app

| Must remain server-side | Reason |
|-------------------------|--------|
| Discovery / industry question selection | Public homepage concern; mobile assumes known customer |
| Consultant voice / cadence generation | Nordi service |
| Upgrade / downgrade / no-change recommendation logic | Customer-success integrity |
| Billing calculations, proration, invoice generation | Compliance |
| Workforce deployment, task limits, pricing tiers | Single source of truth |
| Conversation turn policy & interruption detection | NEO/CAT |
| Conversation learning ingestion & approval | CAT Learning Center |
| Website analysis | Not applicable to mobile customer app |
| Manager/director/VP eligibility timing (3–6 mo rule) | Nordi + analytics pipeline |
| RBAC / tenant isolation | NDP |
| Push notification content decisions (what to alert) | NDP + Nordi rules |

### What the app **may** do locally

- Cache last dashboard snapshot for offline read (TTL, stale banner)
- Persist auth tokens in Secure Store
- Optimistic UI for message send (**rollback on API failure**)
- Format dates/currency for locale
- Map API enums to display labels (static i18n tables)
- Privacy toggle UI → immediate PATCH to NDP

---

## 7. Suggested API endpoints (NDP Mobile v1)

Base path: `/api/mobile/v1`

### Auth & session

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/login` | Email/password or magic link exchange → `{ accessToken, refreshToken, expiresIn }` |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Revoke refresh token |
| GET | `/me` | Customer profile, account name, hired scope |

### Dashboard & workforce

| Method | Path | Description |
|--------|------|-------------|
| GET | `/dashboard` | Aggregated home: teams, summaries, optional Nordi insight |
| GET | `/teams` | Hired teams only (launch: no manager tier in list) |
| GET | `/teams/{teamId}/report` | Latest operational report for one team |
| GET | `/teams/{teamId}/conversations` | Team conversation threads |
| GET | `/workforce/conversations` | Workforce-level threads |
| GET | `/conversations/{id}` | Thread detail + paginated messages |
| POST | `/conversations/{id}/messages` | Send message (non-Nordi workforce/team channels) |

### Nordi (customer-success)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/nordi/session` | Active Nordi session metadata + recent messages |
| POST | `/nordi/messages` | Send user message; returns reply segments + cards |
| GET | `/nordi/recommendations` | Active service recommendations (upgrade/downgrade/none) |
| POST | `/nordi/recommendations/{id}/acknowledge` | Customer acknowledged (no self-serve apply in v1) |

### Reports & billing

| Method | Path | Description |
|--------|------|-------------|
| GET | `/reports` | Paginated report index |
| GET | `/reports/{reportId}` | Report detail (structured + optional PDF URL) |
| GET | `/billing/summary` | Current plan, next invoice date, amount due |
| GET | `/billing/invoices` | Invoice list |
| GET | `/billing/invoices/{id}` | Invoice detail / PDF link |

### Settings & privacy

| Method | Path | Description |
|--------|------|-------------|
| GET | `/settings` | Notification prefs, locale |
| PATCH | `/settings` | Update allowed prefs |
| GET | `/privacy/consent` | Conversation learning consent record |
| PATCH | `/privacy/consent` | Update consent (mirrors web `conversationLearningConsent`) |
| GET | `/privacy/data-export` | Request export (async job id) |
| DELETE | `/privacy/account-data` | Account data deletion request (store compliance) |

### Push & device

| Method | Path | Description |
|--------|------|-------------|
| POST | `/devices/register` | `{ pushToken, platform, appVersion }` |
| DELETE | `/devices/{deviceId}` | Unregister on logout |

### Health

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | App connectivity check (unauthenticated ping) |

All responses: `{ data, meta?, errors? }` with stable schema versioning (`X-API-Version: 1`).

---

## 8. Dashboard behavior specification

### Single hired team

- Dashboard opens directly into **that team’s operational report** (tasks completed, response times, open items, week-over-week delta).
- Nordi insight card optional at top: one plain-language sentence tied to report data.

### Multiple hired teams

- Dashboard shows **summary card per team** (name, status, key metric, alert badge).
- Tap → team detail report (native push navigation).
- No cross-team aggregation charts in MVP unless NDP provides a pre-computed summary object.

### Launch visibility rule

- API returns `teams[]` only; filter manager/director/VP tiers **server-side** for launch.
- When Nordi recommends a manager (post 3–6 months), recommendation appears as a **Nordi card** in conversation or dashboard insight — not as a new tab or hire UI.

---

## 9. App Store & Play Store readiness

### Apple App Store

- **App category:** Business
- **Login required:** Yes — demo account for App Review (`review@northbridge.digital` + seeded tenant)
- **Privacy Nutrition Labels:** Declare contact info, identifiers, usage data; link to privacy policy URL
- **Account deletion:** In-app path via Settings → Privacy (triggers NDP deletion workflow)
- **Encryption:** HTTPS only; declare ITSAppUsesNonExemptEncryption if applicable
- **Push:** Explain operational alerts (report ready, Nordi follow-up) — not marketing spam
- **Review notes:** B2B customer app; no public signup; Nordi is advisor not sales bot

### Google Play

- **Data safety form:** Align with Apple declarations
- **Target API level:** Current Play requirements via EAS build profile
- **Content rating:** Everyone / Business appropriate
- **Foreground service:** Only if background sync added later — avoid in MVP

### Shared compliance

- Privacy policy + terms URLs (existing `/privacy`, customer terms)
- Conversation learning consent (same semantic model as web)
- No misleading “free trial” or public hire CTAs
- Accessibility: VoiceOver / TalkBack labels on all interactive elements
- Crash reporting (Sentry) with PII scrubbing — configure server-side

### Build & release pipeline

- **EAS Build** profiles: `development`, `preview`, `production`
- **EAS Submit** to App Store Connect + Play Console
- Versioning: semver + build number; API version independent
- OTA (Expo Updates): JS/asset fixes only — native changes require store build

---

## 10. Security architecture

- **OAuth2-style tokens:** Short-lived access + refresh; refresh rotation on NDP
- **Storage:** `expo-secure-store` for tokens; never AsyncStorage for secrets
- **Certificate pinning:** Phase 2 — evaluate after MVP
- **Jailbreak/root:** Optional detection → warn, don’t block v1
- **Tenant isolation:** Every API call scoped by JWT claims; BFF validates
- **Audit:** NDP logs mobile actions (login, consent changes, recommendation acks)

---

## 11. MVP milestone (first release)

### MVP goal

Ship a **customer-success cockpit** for existing paying accounts: see team performance, talk to Nordi, read reports, view billing, manage privacy — with **zero duplicated business logic** in the client.

### MVP scope (in)

- [ ] Expo app shell: auth, tabs, native navigation
- [ ] Dashboard (1 team + multi-team summaries, teams only)
- [ ] Nordi conversation (single thread, native UI, server-driven replies)
- [ ] Workforce + team conversation **read** + basic reply
- [ ] Reports list + detail
- [ ] Billing summary + invoice list (read-only)
- [ ] Settings + privacy consent (NDP-backed)
- [ ] Push: report ready + Nordi reply notifications
- [ ] NDP Mobile BFF v1 endpoints (section 7)
- [ ] App Store + Play Store submission (TestFlight / internal testing first)

### MVP scope (out)

- Manager/director/VP dashboard tiers
- In-app workforce hiring or plan changes
- Schedule a Call / human escalation CTA
- Offline message compose queue (read-only offline OK)
- Biometric login (nice-to-have → v1.1)
- iPad-optimized layouts (iPhone-first)
- Widgets / Live Activities

### Success metrics

- Customer opens app ≥3×/week during first month
- ≥60% of service change discussions start in Nordi thread (not support email)
- Dashboard load p95 < 2s on NDP BFF
- Crash-free sessions > 99.5%

### Estimated phasing

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| **0 — Plan** | Current | This document + OpenAPI sketch + design mocks |
| **1 — Foundation** | 4–6 weeks | Expo repo, auth, NDP BFF skeleton, Nordi + Dashboard |
| **2 — Core tabs** | 4 weeks | Conversations, Reports, Billing read-only |
| **3 — Hardening** | 3 weeks | Push, privacy, accessibility, store assets |
| **4 — Beta** | 2–4 weeks | Founder + 3–5 customer pilots, TestFlight/Play internal |
| **5 — Launch** | 1 week | Store submission, review demo account |

---

## 12. Open decisions (before implementation)

1. **NDP repository location** — Same monorepo vs dedicated platform repo for Mobile BFF
2. **Auth provider** — Clerk, Auth0, or NDP-native (customer accounts already exist how?)
3. **Real-time transport** — Polling vs WebSocket for conversation updates (recommend WebSocket in v1.1; polling OK for MVP)
4. **OpenAPI source of truth** — Generate `@northbridge/mobile-api-contracts` from NDP spec
5. **Brand assets** — App icon, splash, store screenshots (Northbridge red `#B11226`, black background)

---

## 13. References (current codebase)

| Asset | Relevance |
|-------|-----------|
| `lib/neo/providers/local-provider.ts` | Anticipated NDP route shapes (`/api/cat/send`, workforce, operations) |
| `lib/neo/types.ts` | `NeoRequest` / `NeoResponse` — inspiration for mobile DTOs, not copied logic |
| `lib/cat/discovery-engine.ts` | **Website only** — not used by mobile |
| `lib/nordi/consultant-voice/` | **Server only** — Nordi service on NDP |
| `packages/conversation-engine/` | NEO/CAT infrastructure — server only |
| `lib/nordi/conversation-learning-consent.ts` | Privacy model to mirror via `/privacy/consent` |
| `docs/nordi-intelligent-discovery.md` | Public homepage discovery — explicitly out of scope for mobile |

---

## 14. Summary

Nordi Mobile is a **native Expo app** that acts as a **thin client** to NDP. NDP routes customer interactions into the **Nordi service layer** for success-first guidance and into **NEO/CAT** for reusable conversation mechanics. The app shows **team-level operational truth** on the Dashboard, keeps **managers hidden at launch**, and drives **service changes through conversation** — not admin UI.

**No implementation code is included in this repository yet.** Proceed to Phase 1 when NDP Mobile BFF ownership and MVP sign-off are confirmed.
