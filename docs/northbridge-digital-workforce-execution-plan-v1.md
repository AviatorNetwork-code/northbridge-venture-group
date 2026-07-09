# NEO Execution Plan — Northbridge Digital Digital Workforce v1.0

**Type:** Engineering planning document (no implementation authorized)  
**Owner:** NEO (reusable platform) + Northbridge Digital (product behavior)  
**Status:** Draft for engineering review  
**Source of truth (product):**

- [Nordi Mobile Architecture](./nordi-mobile-architecture.md)
- [Workforce Inventory v1.0](./northbridge-digital-workforce-inventory-v1.md)
- [Organizational Structure v1.0](./northbridge-digital-workforce-organizational-structure-v1.md)
- [Workforce Communication Protocol v1.0](./northbridge-digital-workforce-communication-protocol-v1.md)

**Doctrine:** *We succeed when you succeed.*

---

## 1. Executive summary

Northbridge Digital sells **teams**, not chatbots. Engineering must build a platform where:

- **Specialists** are reusable NEO capabilities (never industry-specific implementations).
- **Teams** are Northbridge Digital products composed from specialists + industry context.
- **Nordi** sits outside the customer hierarchy and drives evidence-based recommendations.
- **Launch** exposes Teams + Team Leads + Specialists only; Managers/Directors/VPs are schema-ready but feature-gated.

This plan sequences **10 phases** from platform foundations through mobile integration and a Cursor-executable milestone roadmap. It separates **NEO-owned reusable packages** from **NDP/NBD-owned product services** and identifies risks, decisions, and validation gates.

---

## 2. Ownership model

| Layer | Owner | Examples |
|-------|-------|----------|
| Reusable contracts & engines | **NEO** | `@northbridge/workforce-core`, `@northbridge/conversation-engine`, `@northbridge/assistant-contracts` |
| Platform APIs & tenancy | **NDP** | Auth, org isolation, Mobile BFF, billing integration |
| Product voice & recommendations | **Northbridge Digital (Nordi service)** | Upgrade/downgrade framing, customer-success policy |
| Customer surfaces | **NBD product** | Public Nordi homepage, Operations hire flow (internal), Nordi Mobile |
| Institutional learning | **NEO** | `@northbridge/neo-bridge`, learning pipeline |

**Rule:** If two products could use it unchanged → NEO package. If it encodes Northbridge Digital customer-success policy → Nordi/NDP product service.

---

## 3. Current state assessment

| Asset | State | Gap vs v1.0 docs |
|-------|-------|------------------|
| `lib/workforce/catalog.ts` | Mock hire catalog | Roster ≠ Inventory v1.0; includes managers in UI paths |
| `packages/conversation-engine` | Turn policy, interruptions | Not wired to workforce routing |
| `packages/assistant-contracts` | Types only | Missing workforce/org contracts |
| `lib/nordi/*` | Public discovery + voice | No customer-workforce orchestration mode |
| `lib/neo/providers/local-provider.ts` | Anticipated NDP routes | No workforce entity API |
| Nordi Mobile architecture | Planned | No `apps/nordi-mobile` |
| Workforce Inventory / Org Structure | **Approved** | Not reflected in code |

**First engineering action after plan approval:** align catalog *definitions* (data, not UX) to Inventory v1.0 — still product work, not specialist runtime.

---

## 4. Target architecture (logical)

```
┌─────────────────────────────────────────────────────────────────┐
│ Surfaces: Public Nordi · Operations (internal) · Nordi Mobile    │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│ NDP — Northbridge Digital Platform                               │
│  Tenant · Auth · Mobile BFF · Workforce API · Billing · Metrics  │
└─────┬──────────────────┬─────────────────────┬──────────────────┘
      │                  │                     │
      ▼                  ▼                     ▼
┌─────────────┐  ┌───────────────┐   ┌─────────────────────────┐
│ Nordi       │  │ Workforce     │   │ Recommendation          │
│ Service     │  │ Orchestration │   │ Engine (evidence-based)   │
│ (NBD)       │  │ Service (NDP) │   │ (NBD policy + NEO core)   │
└──────┬──────┘  └───────┬───────┘   └───────────┬─────────────┘
       │                 │                         │
       └────────────┬────┴─────────────────────────┘
                    ▼
┌─────────────────────────────────────────────────────────────────┐
│ NEO Reusable Packages                                            │
│  workforce-core · specialist-runtime · team-orchestrator         │
│  conversation-engine · conversation-state · assistant-contracts  │
│  presentation-policy · platform-ai · metrics-primitives          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Phase 1 — Platform foundations

**Goal:** Establish tenancy, identity, and API boundaries before any workforce runtime ships.

### Scope

1. **NDP tenant model** — `Organization`, `CustomerAccount`, `Subscription`, `Entitlement`
2. **Workforce entitlement** — hired teams as first-class entitlements (not specialist SKU lists in customer UI)
3. **API versioning** — `/api/v1` platform + `/api/mobile/v1` BFF (per mobile architecture)
4. **Event bus contract** — `workforce.task.completed`, `team.report.generated`, `recommendation.created` (schema only in v1)
5. **Audit log** — all hire changes, recommendation acks, consent changes
6. **Feature flags** — `managers_enabled`, `directors_enabled`, `vps_enabled` default **false**

### NEO packages (new/extended)

| Package | Deliverable |
|---------|-------------|
| `@northbridge/workforce-contracts` | Types: `Organization`, `TeamEntitlement`, `SpecialistAssignment`, `HierarchyLevel` |
| `@northbridge/tenant-primitives` | Shared IDs, timestamps, audit fields (or extend assistant-contracts) |

### NBD / NDP work

- NDP auth integration (customer accounts)
- Entitlement service reading subscription state
- Migrate mock `local-provider` paths toward real NDP handlers (incremental)

### Dependencies

- None (blocking for all later phases)

### Validation

- Contract tests for workforce-contracts
- Tenant isolation integration tests (org A cannot read org B)
- OpenAPI published for Mobile BFF skeleton

### Exit criteria

- [ ] Organization can have 0..N team entitlements
- [ ] Feature flags gate manager+ tiers in all APIs
- [ ] Audit trail for entitlement changes

---

## Phase 2 — Specialist architecture

**Goal:** Reusable specialist framework — not industry-specific agents.

### Definitions

| Concept | Description |
|---------|-------------|
| **Specialist definition** | Static catalog entry from Inventory v1.0 (id, mission, capabilities, constraints) |
| **Specialist instance** | Runtime binding: `specialistDefId + tier + orgId` |
| **Specialist memory** | Scoped store: task history, customer context slices, **no** cross-org leakage |
| **Permissions** | `canDo` / `cannotDo` from definition + org policy overlay |
| **Communication** | Messages via conversation-engine; tools via platform-ai registry |

### Specialist lifecycle

```
Defined (catalog) → Provisioned (on team hire) → Active → Suspended → Deprovisioned
```

- **Provisioned:** Team Lead receives specialist in roster
- **Active:** Accepts tasks within permission envelope
- **Suspended:** Billing or policy hold
- **Deprovisioned:** Team removed or specialist swapped (memory archived per retention policy)

### NEO packages

| Package | Responsibility |
|---------|----------------|
| `@northbridge/workforce-core` | Specialist definition registry, lifecycle state machine |
| `@northbridge/specialist-runtime` | Task execution envelope, permission checks, memory adapter interface |
| `@northbridge/platform-ai` | Model/tool invocation (existing; extend tool registry) |
| `@northbridge/conversation-state` | Per-thread state (existing) |

### NBD work

- Load Inventory v1.0 into `workforce-core` registry (data migration from `catalog.ts`)
- **Do not** implement industry-specific specialist classes

### Validation

- Unit: permission denial when action ∉ `canDo`
- Unit: same specialist definition usable in Marketing Team and Dental Office Team
- Integration: specialist instance isolated per org

### Exit criteria

- [ ] All Inventory v1.0 specialists registered by id
- [ ] Lifecycle transitions audited
- [ ] Memory adapter interface documented (Postgres/Redis TBD in NDP)

---

## Phase 3 — Team architecture

**Goal:** Teams as products — Team Lead orchestrates specialists.

### Team Lead responsibilities (platform)

- Route incoming work to appropriate specialist
- Aggregate specialist outputs into **team report** DTO
- Maintain **team shared context** (goals, active campaigns, SLAs — org-provided)
- Enforce workload caps per tier (Essential/Pro/Elite from existing tier model)
- Escalate to Nordi (not to customer hierarchy) when policy requires human or Northbridge review

### Specialist orchestration

```
Inbound (customer message, connector event, scheduled job)
  → Team Lead router
    → Specialist task
      → Result → Team memory + report metrics
```

### Team memory layers

| Layer | Scope | Owner |
|-------|-------|-------|
| Team shared context | All specialists on team | Team Lead service |
| Specialist private memory | Single specialist instance | Specialist runtime |
| Customer profile slice | Org-level facts Nordi/teams may read | NDP profile service |

### NEO packages

| Package | Responsibility |
|---------|----------------|
| `@northbridge/team-orchestrator` | Team Lead routing, workload distribution, report aggregation |
| `@northbridge/workforce-core` | Team product definitions (roster templates from Inventory) |

### NBD work

- Team product templates: Marketing, Sales, CS, Financial, industry teams (Flight School, Dental, Law, HVAC, General Service)
- Team operational report schema (dashboard/mobile consumption)

### Validation

- Simulation: multi-specialist task chain produces single team report
- Load: Team Lead respects task tier limits
- Regression: team roster matches Inventory v1.0 for each product id

### Exit criteria

- [ ] Each launch team product instantiable from template
- [ ] Team report generated on schedule + on-demand
- [ ] No customer UI to manage individual specialists

---

## Phase 4 — Nordi integration

**Goal:** Nordi represents Northbridge Digital **outside** customer org chart.

**Behavioral spec:** [Workforce Communication Protocol v1.0](./northbridge-digital-workforce-communication-protocol-v1.md) (Layers 0–1, routing, conflict resolution).

### Nordi communication matrix

| Channel | Nordi role | Implementation |
|---------|------------|----------------|
| Customer ↔ Nordi | Relationship, analysis, recommendations | Nordi service + consultant voice (existing patterns) |
| Nordi ↔ Team Lead | Operational queries, cross-team synthesis | Internal API: `nordi.broadcastToTeamLeads()` |
| Nordi ↔ Customer (about teams) | Explains team reports; never impersonates Team Lead | Clear attribution in message metadata |
| Team ↔ Customer | Operational work | Team conversation threads (not Nordi voice) |

### Hard rules

- Nordi messages carry `actor: "nordi"`; team messages carry `actor: "team:{teamId}"`
- Nordi **never** appears in org hierarchy table
- Recommendations stored as `Recommendation` entities with evidence[], not inline chat only

### NBD work

- `NordiService` mode: `public-discovery` vs `customer-success` (mobile + post-hire)
- Recommendation handoff from Recommendation Engine (Phase 8)
- Remove/public-gate sales CTAs in customer-success mode (no Schedule a Call)

### NEO work

- Extend `@northbridge/conversation-engine` with `channel` + `actor` metadata
- `@northbridge/presentation-policy` rules for attribution labels

### Validation

- E2E: customer thread never shows Nordi as "CEO" or "Manager"
- E2E: Nordi can reference team report data with citation to team id

### Exit criteria

- [ ] Actor attribution on all messages
- [ ] Nordi service modes documented and enforced at NDP router

---

## Phase 5 — Dashboard architecture

**Goal:** Adaptive dashboards — launch = teams only.

### Dashboard modes

| Customer state | Dashboard behavior |
|----------------|-------------------|
| 1 team hired | Full operational report for that team |
| N teams hired | Summary cards + drill-down per team |
| Manager entitled (future, flag) | Department rollup slot — hidden until flag + recommendation accepted |
| Director / VP (future) | Executive rollup slots — schema present, UI hidden |

### Data sources

- `GET /dashboard` aggregates team reports (Mobile BFF + web customer portal)
- Nordi insight: optional 1-sentence summary from Recommendation Engine (non-blocking)

### NBD work

- Dashboard DTO versioned (`DashboardResponseV1`)
- Web customer portal (post-launch) shares DTO with mobile — no duplicate aggregation

### NEO work

- `@northbridge/workforce-contracts`: `DashboardSlot`, `HierarchyVisibility` enum

### Validation

- Fixture: 1-team vs 3-team layouts from same API
- Flag off: manager slots never returned in payload

### Exit criteria

- [ ] Launch dashboard team-only
- [ ] Forward-compatible JSON schema for manager+ slots

---

## Phase 6 — Conversation architecture

**Goal:** Clear routing and ownership for all conversation types.

### Conversation types

| Type | Owner | Participants | Storage key |
|------|-------|--------------|-------------|
| `nordi-customer` | Nordi service | Customer, Nordi | `orgId + sessionId` |
| `team-customer` | Team Lead | Customer, team (as unit) | `orgId + teamId + threadId` |
| `workforce-internal` | Team Lead | Specialists (internal) | Not customer-visible |
| `manager-customer` (future) | Manager | Customer, manager persona | Gated |

### Routing rules

1. Customer message in Nordi app **default thread** → `nordi-customer`
2. Customer message in team context → `team-customer` for that `teamId`
3. Team Lead may delegate to specialist internally; customer sees team identity unless policy exposes specialist (default: **team only**)
4. Nordi may **reference** team threads but does not mutate team ownership

### NEO packages

- `@northbridge/conversation-engine` — routing policy plugin interface
- `@northbridge/core-conversation` — thread + participant model

### NBD work

- NDP Conversation Router service
- Public homepage remains `homepage` discovery module — separate from customer workforce conversations

### Validation

- Thread ownership tests
- No cross-tenant thread leakage
- Mobile + web use same thread ids

### Exit criteria

- [ ] Conversation router deployed with 2 active types (nordi-customer, team-customer)
- [ ] Manager type registered but returns 403 until entitled

---

## Phase 7 — Data architecture

**Goal:** Persistent model for orgs, teams, specialists, hierarchy, metrics, recommendations.

### Core entities

```
Organization
  ├── CustomerUsers[]
  ├── Subscription / Entitlements
  ├── TeamInstances[]
  │     ├── teamProductId (from Inventory)
  │     ├── TeamLead (runtime)
  │     └── SpecialistInstances[]
  ├── HierarchyNodes[] (teams at launch; managers+ later)
  ├── OperationalMetrics[] (time-series)
  ├── TeamReports[]
  ├── Recommendations[]
  └── ConversationThreads[]
```

### Hierarchy rules

- `HierarchyNode.level` ∈ `{ team, manager, director, vp }` — only `team` enabled at launch
- Parent/child edges validated by Organizational Structure v1.0 rules
- **No customer-editable org chart** — edges change only via entitlement + recommendation acceptance

### Reporting

- Team report: tasks completed, response latency, open items, period comparison
- Org rollup (future): aggregated when manager exists

### NEO work

- `@northbridge/workforce-contracts` entity definitions + JSON schema
- Migration tooling patterns (versioned)

### NDP work

- Postgres (or equivalent) persistence
- Metrics pipeline (batch + near-real-time for dashboard)

### Validation

- Schema migration tests
- ER diagram reviewed against Inventory + Org Structure docs

### Exit criteria

- [ ] ERD approved
- [ ] TeamInstance maps 1:1 to team product template
- [ ] Recommendation stores evidence[] immutable audit

---

## Phase 8 — Recommendation engine

**Goal:** Evidence-based organizational guidance — customer success over revenue.

### Recommendation types

| Type | Example trigger |
|------|-----------------|
| `add_team` | Operational load + gap in Inventory coverage |
| `remove_team` | Sustained underutilization |
| `add_manager` | ≥3 teams + cross-team coordination friction (3–6 mo data) |
| `wait` | Insufficient evidence |
| `operational_change` | Process fix without org change |
| `downgrade_tier` | Tier over-provisioned vs usage |

### Engine architecture

```
Metrics + TeamReports + Conversation signals
  → Evidence builder (NEO: pure functions)
  → Policy evaluator (NBD: customer-success rules)
  → Recommendation draft + confidence
  → Nordi presentation layer
  → Customer ack (no auto-apply for manager+ ; team changes per product policy)
```

### Principles

- Every recommendation includes `evidence[]`, `confidence`, `alternativeActions[]`
- Revenue impact **excluded** from scoring function
- Explicit `wait` outcome is first-class (not failure)

### NEO packages

- `@northbridge/recommendation-core` — evidence structs, scoring hooks (generic)
- `@northbridge/metrics-primitives` — normalized operational signals

### NBD work

- Nordi policy file: weights, thresholds, copy templates
- CAT Learning integration for approved recommendation patterns (future)

### Validation

- Fixture scenarios from Org Structure doc (manager recommendation copy)
- Test: high revenue + low utilization → `remove_team` or `downgrade`, not upsell
- Test: insufficient data → `wait`

### Exit criteria

- [ ] Recommendation API stable
- [ ] Nordi presents recommendations with evidence
- [ ] No auto-promotion to manager without acceptance + flag

---

## Phase 9 — Native mobile integration

**Goal:** Workforce surfaces in Nordi Mobile per [mobile architecture](./nordi-mobile-architecture.md).

### Integration points

| Mobile screen | NDP endpoint | Workforce dependency |
|---------------|--------------|----------------------|
| Dashboard | `GET /mobile/v1/dashboard` | Phase 3 team reports, Phase 5 DTO |
| Team conversations | `GET/POST .../teams/{id}/conversations` | Phase 6 router |
| Nordi conversation | `POST .../nordi/messages` | Phase 4 Nordi service |
| Reports | `GET .../reports` | Phase 3 report archive |
| Billing | `GET .../billing/*` | Phase 1 entitlements |
| Recommendations | via Nordi + optional `GET .../nordi/recommendations` | Phase 8 |

### Rules

- Mobile remains thin — no workforce logic
- Launch UI: teams only (no manager screens)
- Push notifications: team report ready, Nordi reply, recommendation available

### Dependencies

- Phases 1–6 minimum for MVP mobile workforce
- Phase 8 for recommendation cards (can ship MVP without, add in v1.1)

### Validation

- Contract tests: mobile DTO ↔ workforce services
- Manual: TestFlight with seeded org (1 team + 3 teams layouts)

### Exit criteria

- [ ] Mobile MVP checklist from mobile architecture doc satisfied
- [ ] Workforce data flows end-to-end through NDP BFF

---

## Phase 10 — Engineering roadmap (Cursor-executable milestones)

Milestones ordered for parallel work where safe. Each is scoped for 1–3 week sprints.

### M1 — Contracts & registry (NEO)

| Field | Detail |
|-------|--------|
| **Dependencies** | Phase 1 started |
| **NEO packages** | `@northbridge/workforce-contracts`, `@northbridge/workforce-core` (definitions only) |
| **NBD** | Import Inventory v1.0 YAML/TS registry |
| **Deliverables** | All specialists + team products as data; feature flags in contracts |
| **Validation** | Snapshot tests match inventory doc tables |
| **Order** | **1** |

### M2 — NDP tenant + entitlements (NDP)

| Field | Detail |
|-------|--------|
| **Dependencies** | M1 |
| **NEO** | tenant-primitives |
| **NBD** | Entitlement API, audit log |
| **Deliverables** | `POST/GET /orgs/{id}/teams` entitlement CRUD |
| **Validation** | Integration tests, OpenAPI |
| **Order** | **2** |

### M3 — Specialist runtime skeleton (NEO)

| Field | Detail |
|-------|--------|
| **Dependencies** | M1, M2 |
| **NEO** | `@northbridge/specialist-runtime` |
| **NBD** | Wire to NDP provisioning on team hire |
| **Deliverables** | Lifecycle + permission envelope |
| **Validation** | Unit + integration |
| **Order** | **3** |

### M4 — Team orchestrator + reports (NEO + NDP)

| Field | Detail |
|-------|--------|
| **Dependencies** | M3 |
| **NEO** | `@northbridge/team-orchestrator` |
| **NBD** | Team report generator job |
| **Deliverables** | Team Lead routes mock task → report DTO |
| **Validation** | Golden report fixtures per team product |
| **Order** | **4** |

### M5 — Conversation router (NEO + NDP)

| Field | Detail |
|-------|--------|
| **Dependencies** | M4 |
| **NEO** | `@northbridge/workforce-router` (platform ownership engine); conversation-engine plugins |
| **NBD** | NDP Conversation Router (composes workforce-router + conversation-engine + presentation-policy) |
| **Deliverables** | nordi-customer + team-customer threads; enforces single-`RequestOwner` invariant per Communication Protocol v1.0 |
| **Validation** | Routing tests, attribution metadata, ownership matrix scenarios |
| **Order** | **5** |
| **Design** | [Architecture Review v1.0](./northbridge-workforce-platform-architecture-review-v1.md), [Workforce Router Phase 4 Design v1.0](./northbridge-workforce-router-phase-4-design-v1.md) |

### M6 — Nordi customer-success mode (NBD)

| Field | Detail |
|-------|--------|
| **Dependencies** | M5 |
| **NEO** | presentation-policy |
| **NBD** | Nordi service split public vs customer |
| **Deliverables** | No sales CTAs; team attribution |
| **Validation** | E2E conversation tests |
| **Order** | **6** |

### M7 — Dashboard API (NDP)

| Field | Detail |
|-------|--------|
| **Dependencies** | M4 |
| **NEO** | workforce-contracts Dashboard DTO |
| **NBD** | BFF aggregation |
| **Deliverables** | 1-team and N-team responses |
| **Validation** | Contract tests + mobile architecture alignment |
| **Order** | **7** (parallel with M6) |

### M8 — Recommendation engine v1 (NEO + NBD)

| Field | Detail |
|-------|--------|
| **Dependencies** | M4, M7, 90d metrics optional (can use synthetic) |
| **NEO** | `@northbridge/recommendation-core` |
| **NBD** | Policy rules + Nordi copy |
| **Deliverables** | add_team, remove_team, wait, downgrade |
| **Validation** | Scenario test suite (customer-success cases) |
| **Order** | **8** |

### M9 — Manager schema + gating (NEO + NDP)

| Field | Detail |
|-------|--------|
| **Dependencies** | M8 |
| **NEO** | hierarchy types, disabled code paths |
| **NBD** | Feature flag enforcement everywhere |
| **Deliverables** | Manager recommendation only; no UI |
| **Validation** | Flag off → 403 on all manager endpoints |
| **Order** | **9** |

### M10 — Nordi Mobile MVP (NBD)

| Field | Detail |
|-------|--------|
| **Dependencies** | M6, M7 |
| **NEO** | mobile-api-contracts (optional generated) |
| **NBD** | `apps/nordi-mobile` Expo app |
| **Deliverables** | Dashboard, Nordi chat, team threads read/reply |
| **Validation** | Mobile architecture checklist, store beta |
| **Order** | **10** |

### M11 — Align legacy hire flow (NBD)

| Field | Detail |
|-------|--------|
| **Dependencies** | M1–M4 |
| **NBD** | Refactor `lib/workforce/catalog.ts` to read from workforce-core registry; operations/internal only |
| **Deliverables** | Single source of truth with Inventory v1.0 |
| **Validation** | Diff test: roster ⊆ inventory |
| **Order** | **11** (can start after M1) |

### M12 — Operational metrics pipeline (NDP)

| Field | Detail |
|-------|--------|
| **Dependencies** | M4 |
| **NEO** | metrics-primitives |
| **NDP** | Ingestion + rollups |
| **Deliverables** | Metrics feeding M8 |
| **Validation** | Dashboard numbers match source tasks |
| **Order** | **12** (ongoing) |

---

## 5. Reusable platform work summary (NEO)

| Package | Phase | Priority |
|---------|-------|----------|
| `@northbridge/workforce-contracts` | 1, 7 | P0 |
| `@northbridge/workforce-core` | 2, 3 | P0 |
| `@northbridge/specialist-runtime` | 2 | P0 |
| `@northbridge/team-orchestrator` | 3 | P0 |
| `@northbridge/recommendation-core` | 8 | P1 |
| `@northbridge/metrics-primitives` | 7, 8 | P1 |
| `@northbridge/conversation-engine` (extend) | 4, 6 | P0 |
| `@northbridge/presentation-policy` (extend) | 4 | P1 |
| `@northbridge/mobile-api-contracts` | 9 | P1 |

---

## 6. Northbridge Digital–specific work summary

| Workstream | Phase |
|------------|-------|
| Nordi customer-success service | 4, 6 |
| Inventory registry ingestion | 2 |
| Team product templates | 3 |
| Recommendation policy (customer-first) | 8 |
| NDP Mobile BFF | 9 |
| Dashboard aggregation | 5, 7 |
| Public homepage discovery (existing) | Out of scope for workforce MVP |
| Legacy operations hire UI alignment | M11 |

---

## 7. Architectural decisions (ADRs to write)

| ID | Decision | Recommendation |
|----|----------|----------------|
| ADR-W1 | Specialist = definition + instance | Adopt; never industry subclass |
| ADR-W2 | Team Lead as orchestrator service | Adopt; not a persona customers hire separately at launch |
| ADR-W3 | Nordi outside hierarchy | Adopt; enforce via actor metadata |
| ADR-W4 | Manager+ feature flags | Adopt; default off |
| ADR-W5 | Recommendation auto-apply | **Never** for manager+; team changes require product-defined acceptance |
| ADR-W6 | Persistence | NDP Postgres primary; specialist memory adapter abstracted |
| ADR-W7 | Mobile integration | NDP BFF only; no direct engine calls |
| ADR-W8 | Single registry source | workforce-core reads Inventory v1.0 ids |

---

## 8. Risks and mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Legacy `catalog.ts` diverges from Inventory | Wrong teams shipped | M1 + M11; CI snapshot vs doc |
| Duplicating discovery engine in mobile | Drift, bugs | Mobile BFF only; ban engine imports in app |
| Revenue-biased recommendations | Trust loss | Separate policy layer; automated tests forbid revenue features |
| Premature manager UI | Violates launch scope | Feature flags + API 403 + mobile hiding |
| Specialist industry coupling | Breaks reuse | Code review + registry lint rules |
| NDP not ready for local-provider routes | Blocked integration | M2 early; keep mock adapter until parity |
| Metrics insufficient for manager rec | Bad advice | `wait` as default; minimum data window 3–6 mo |

---

## 9. Recommended implementation order

```
Phase 1 (M1, M2) ──► Phase 2 (M3) ──► Phase 3 (M4, M12)
                              │
                              ├──► Phase 6 (M5) ──► Phase 4 (M6)
                              │
                              └──► Phase 5 (M7) ──► Phase 9 (M10)
                                        │
Phase 7 (data) embedded in M2–M4 ───────┤
                                        ▼
                              Phase 8 (M8) ──► Phase manager gating (M9)
```

**Public launch critical path:** M1 → M2 → M3 → M4 → M5 → M6 → M7 → M10  
**Recommendation engine:** M8 can follow launch by 4–8 weeks if `wait`-heavy Nordi acceptable initially.

---

## 10. Governance alignment

| Standard | Application |
|----------|-------------|
| Northbridge Technology Doctrine | Reuse over rewrite; NEO owns shared engines |
| NBS-004 | Package boundaries enforced; no business logic in UI apps |
| NBS-011 (safety) | Specialist `cannotDo` enforced at runtime |
| Neo-bridge | Session reports for engineering learning — not customer data |
| Customer-success doctrine | Recommendation engine excludes revenue optimization |

---

## 11. Validation strategy (program-level)

| Level | What |
|-------|------|
| **Contract** | workforce-contracts, mobile DTOs, OpenAPI |
| **Unit** | Permissions, lifecycle, recommendation scenarios |
| **Integration** | NDP tenant isolation, conversation routing |
| **E2E** | Hire team → task → report → dashboard → Nordi recommendation |
| **Compliance** | No manager UI at launch; Nordi attribution |
| **Docs** | Inventory + Org Structure tables match registry exports |

---

## 12. Out of scope (this program)

- Public homepage discovery redesign (existing Nordi)
- Automatic code changes from CAT Learning approvals
- VP/Director UI
- Customer self-serve org chart editor
- In-app workforce hiring for mobile customers (changes via Nordi conversation only)

---

## 13. Related documents

- [Workforce Communication Protocol v1.0](./northbridge-digital-workforce-communication-protocol-v1.md) — behavioral spec for routing, ownership, and reporting
- [Northbridge Digital Workforce Inventory v1.0](./northbridge-digital-workforce-inventory-v1.md)
- [Northbridge Digital Workforce Organizational Structure v1.0](./northbridge-digital-workforce-organizational-structure-v1.md)
- [Nordi Mobile Architecture](./nordi-mobile-architecture.md)
- [Nordi Intelligent Discovery](./nordi-intelligent-discovery.md) — public web only

---

## 14. Next steps (after plan approval)

1. Engineering review + sign-off on ADR-W1–W8  
2. Create NEO tickets for M1–M3 (parallelizable)  
3. NDP squad owns M2, M7, M12  
4. NBD product squad owns M6, M8, M10  
5. **Do not implement** until milestone explicitly authorized  

**Planning only. No code authorized by this document.**
