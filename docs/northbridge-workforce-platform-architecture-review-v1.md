# Northbridge Workforce Platform — Architecture Review v1.0

**Status:** Approved planning document  
**Date:** 2026-07  
**Scope:** Review of Phases 1–3 platform packages; gate for Phase 4 (`@northbridge/workforce-router`)  
**Verdict:** **PASS with minor refactors recommended** — proceed to Phase 4 planning

**Packages reviewed:**

- `@northbridge/workforce-contracts` (Phase 1)
- `@northbridge/workforce-core` (Phase 1)
- `@northbridge/specialist-runtime` (Phase 2)
- `@northbridge/team-orchestrator` (Phase 3)

**Governance references:**

- [Workforce Execution Plan v1.0](./northbridge-digital-workforce-execution-plan-v1.md)
- [Workforce Communication Protocol v1.0](./northbridge-digital-workforce-communication-protocol-v1.md)
- [Organizational Structure v1.0](./northbridge-digital-workforce-organizational-structure-v1.md)
- NBS-004 — package boundaries enforced; no business logic in UI apps

**Planning only. No code authorized by this document.**

---

## Executive summary

The four implemented packages form a **coherent, layered platform** aligned with Northbridge governance. Dependencies flow in one direction without cycles. Contracts are independent of runtime behavior. No product-specific (Marketing, Dental, Nordi) logic is embedded in platform code.

The platform is **ready for Phase 4** (`@northbridge/workforce-router`) with a small set of **P2 refactors** that should not block router implementation.

---

## 1. Package boundaries

### 1.1 `@northbridge/workforce-contracts`

| Criterion | Assessment |
|-----------|------------|
| Responsibility | Shared Zod schemas + types only |
| Separation | Clear — no business logic |
| Scope | Appropriate breadth for cross-service contracts |

**Strengths:** Single source of truth for `RequestOwner`, `Task`, `TeamReport`, hierarchy entities. Zod parse helpers at API edges (ADR-W1).

**Weaknesses:**

- `RequestOwner` includes `nordi` type — correct for protocol, but router must treat Nordi as **out-of-band** (channel dimension, not a route target evaluated by workforce-router).
- Two escalation shapes exist platform-wide: `Escalation` (contracts) vs `EscalationRequest` (specialist-runtime). Not duplicated within one package, but cross-package alignment deferred.

### 1.2 `@northbridge/workforce-core`

| Criterion | Assessment |
|-----------|------------|
| Responsibility | Organization/team/hierarchy models, permissions, validation |
| Separation | Clear — no Nordi, no execution |
| Scope | Appropriate for Phase 1 |

**Strengths:** Feature-flag dependency chain (`managers → directors → vps`). Permission envelope via `canPerformAction`. Role registry without industry coupling.

**Weaknesses:**

- **Specialist/team product registry not yet implemented** (Execution Plan M1 data migration from Inventory v1.0 still pending). `ROLE_DEFINITIONS` is static; `registerRoleDefinition` mutates a module-level object — acceptable for v0.1 but document immutability expectations for production.
- No routing or dedup primitives yet (expected — Phase 4).

### 1.3 `@northbridge/specialist-runtime`

| Criterion | Assessment |
|-----------|------------|
| Responsibility | Specialist task lifecycle + execution envelope |
| Separation | Clear — domain via injected `TaskExecutor` |
| Scope | Appropriate |

**Strengths:** Adapter boundaries for memory/conversation (ADR-W2). Lifecycle state machine is testable without LLM. Uses workforce-core for permission checks only.

**Weaknesses:**

- `ConfidenceLevel` redefined locally (`high|medium|low`) rather than importing from `@northbridge/assistant-contracts` — intentional decoupling for now; note for future consolidation.
- `InMemoryCapabilityRegistry` ships in runtime package — fine for tests; products should supply registry implementations.

### 1.4 `@northbridge/team-orchestrator`

| Criterion | Assessment |
|-----------|------------|
| Responsibility | Team Lead orchestration — plan, delegate, synthesize, report |
| Separation | Clear — no domain teams |
| Scope | Appropriate for Phase 3 |

**Strengths:** Single team owner enforcement at session start. Delegates execution to specialist-runtime. Conflict detection + escalation paths. `CrossTeamCollaborationAdapter` interface-only (protocol §8).

**Weaknesses:**

- **Partial ownership overlap with future router:** `assignTeamRequestOwner`, `assertSingleOwner` in `runtime/owner.ts` duplicate responsibilities that `@northbridge/workforce-router` will own. **P2 refactor:** orchestrator should consume `RoutingDecision` / `RequestOwner` from router, not assign owners independently.
- **`workforce-core` declared as direct dependency but unused in `src/`** — transitive via specialist-runtime only. **P3 cleanup:** remove direct dep or add validation calls.
- `DefaultConflictDetector` uses keyword polarity heuristics — platform-agnostic but brittle; products should inject `ConflictDetector` for production (already supported).

### 1.5 Is any package doing too much?

**No.** Each package has a distinct layer. The only boundary blur is **owner assignment** split between future router and current team-orchestrator — addressed in Phase 4 design.

---

## 2. Dependency graph

### 2.1 Actual dependencies (from `package.json`)

```text
workforce-contracts          (no workforce deps)
        ↓
workforce-core               → workforce-contracts
        ↓
specialist-runtime           → workforce-contracts, workforce-core
        ↓
team-orchestrator            → workforce-contracts, workforce-core, specialist-runtime
```

### 2.2 Verification

| Check | Result |
|-------|--------|
| Reverse dependencies | **None** |
| Circular references | **None** |
| Product-specific imports | **None** |
| UI / Next.js imports | **None** |
| Nordi imports | **None** |

### 2.3 Proposed graph after Phase 4

```text
workforce-contracts
        ↓
workforce-core
        ↓
workforce-router             → workforce-contracts, workforce-core
        ↓ (routing decision consumed by)
team-orchestrator            → specialist-runtime, workforce-router (types/decision only)
specialist-runtime           (unchanged layer)
```

**Rule:** `workforce-router` must **not** depend on `team-orchestrator` or `specialist-runtime`. Routing precedes execution.

---

## 3. Public APIs

### 3.1 Well-designed abstractions

| Package | Extension points |
|---------|------------------|
| workforce-contracts | Parse/validate helpers, `RequestOwner`, entity schemas |
| workforce-core | Org/team factories, permission checks, hierarchy builders |
| specialist-runtime | `TaskExecutor`, `SpecialistMemoryAdapter`, `CapabilityRegistry`, `RuntimePolicy` |
| team-orchestrator | `SpecialistSelector`, `TeamSynthesizer`, `SpecialistRoster`, `ConflictDetector` |

### 3.2 Missing abstractions (Phase 4+)

| Gap | Recommended package |
|-----|---------------------|
| Request ownership + transfer + dedup | `@northbridge/workforce-router` |
| Cross-team collaboration sessions | `@northbridge/collaboration-session` (future) |
| Conflict arbitration to customer | `@northbridge/conflict-arbitrator` (future) |
| Team/specialist catalog registry | `@northbridge/workforce-core` extension (M1 data) |
| Specialist definition registry | workforce-core (Execution Plan Phase 2 gap) |

### 3.3 Overexposed / leaky details

| Item | Risk | Recommendation |
|------|------|----------------|
| `ROLE_DEFINITIONS` mutable export | Products could mutate global registry | P3: document copy-on-register or freeze in v0.2 |
| `DefaultTeamOrchestrator` class exported | Leaks implementation | Acceptable — factory `createTeamOrchestrator` is primary API |
| `buildDelegatedTask` exported | Useful for tests/integration | Keep; move to optional `/internal` export in v0.2 if needed |
| dist/ committed | Large diffs | Consistent with `assistant-contracts`; acceptable |

### 3.4 Future compatibility

| Concern | Status |
|---------|--------|
| Manager/Director/VP owners | Schema-ready in contracts; feature-gated in core |
| Protocol version field | `communicationProtocolVersion` defined in protocol doc; not yet on all message paths — add in router audit |
| Multi-tenant isolation | `orgId` on all entities — good |
| Operating company reuse | **Yes** — no Northbridge Digital-specific types |

---

## 4. Governance compliance

| Standard | Compliance | Notes |
|----------|------------|-------|
| Technology Doctrine (reuse over rewrite) | ✅ | Packages are reusable; adapters for memory/conversation |
| NBS-004 (package boundaries) | ✅ | No business logic in app layer from these packages |
| Execution Plan Phases 1–3 | ✅ | M1–M4 NEO deliverables met for platform skeleton |
| Org Structure v1.0 | ✅ | Nordi excluded from hierarchy; team launch focus |
| Communication Protocol v1.0 | ⚠️ Partial | Single-owner invariant enforced in team-orchestrator; **router/dedup/transfer not yet implemented** |

### Deviations

1. **Naming:** Communication Protocol §12 recommends `@northbridge/communication-router`; Execution Plan M5 says "NDP Conversation Router." Phase 4 introduces **`@northbridge/workforce-router`** as the **platform ownership engine**; NDP/conversation layer composes it with `conversation-engine`. See [ADR-W9](./northbridge-workforce-router-phase-4-design-v1.md#adr-w9-workforce-router-vs-communication-router).

2. **Owner assignment in team-orchestrator:** Protocol assigns routing to NDP Router; team-orchestrator currently self-assigns team owner. **P2:** refactor when workforce-router lands.

3. **Inventory registry (M1):** Not yet in workforce-core — product data migration outstanding; does not block router.

---

## 5. Extensibility for operating companies

| Operating company | Platform modification required? |
|-------------------|--------------------------------|
| Northbridge Digital | No — inject product rules, executors, selectors |
| Aviator Network | No — same packages, different route rules + roster |
| Airline Scheduling | No — capability-tagged routing rules |
| Future Healthcare | No — entitlements + rules only |
| Future Workforce products | No |

**Requirement for all products:** Provide `RoutePolicy` rules, `SpecialistRoster`, `TaskExecutor`, and entitlements — never fork platform packages.

---

## 6. Strengths

1. **Clean layered architecture** with testable state machines at specialist and team levels.
2. **Contract-first design** — Zod at boundaries, TypeScript inference throughout.
3. **Injection over inheritance** — no industry subclasses; aligns with ADR-W1.
4. **Protocol alignment** — Team Lead as external voice; specialists internal; single owner per team session.
5. **Feature-gated hierarchy** — managers/directors/VPs schema-ready, default off.
6. **Comprehensive unit tests** — 7 + 6 + 9 = 22 tests across platform packages.
7. **ADRs per phase** — W1 (Zod), W2 (specialist boundaries), W3 (team boundaries).

---

## 7. Weaknesses

1. No central **workforce-router** — ownership/dedup/transfer incomplete vs protocol.
2. No **specialist/team catalog registry** in workforce-core (Inventory v1.0 not loaded).
3. Duplicate **owner helpers** in team-orchestrator pending router extraction.
4. **Escalation model split** across contracts vs specialist-runtime vs team-orchestrator.
5. **Unused direct dependency** team-orchestrator → workforce-core.

---

## 8. Technical debt

| ID | Item | Priority | Block Phase 4? |
|----|------|----------|----------------|
| TD-W1 | Extract owner assignment to workforce-router | P0 | No — Phase 4 implements it |
| TD-W2 | Remove or use team-orchestrator → workforce-core direct dep | P3 | No |
| TD-W3 | Load Inventory v1.0 into workforce-core registry | P1 | No |
| TD-W4 | Unify escalation DTO mapping layer | P2 | No |
| TD-W5 | Align ConfidenceLevel with assistant-contracts | P3 | No |
| TD-W6 | Orchestrator accepts RoutingDecision input | P2 | After router MVP |

---

## 9. Architectural risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Router conflated with Nordi/conversation routing | Medium | High | ADR-W9/W10; strict package boundaries |
| Products embed industry logic in route rules | Medium | Medium | Rule schema uses capability tags, not industry ids |
| Duplicate owner logic during migration | High | Medium | TD-W1/W6; deprecate orchestrator owner helpers |
| AI routing locks platform early | Low | Medium | `RouteResolver` strategy interface; AI is one resolver |
| team-orchestrator becomes "god orchestrator" | Low | High | Router owns ownership only; orchestrator owns execution |

---

## 10. Recommended refactors (priority)

| Priority | Refactor | When |
|----------|----------|------|
| **P0** | Implement `@northbridge/workforce-router` | Phase 4 (this plan) |
| **P1** | Inventory registry in workforce-core | Phase 2 completion / M11 |
| **P2** | team-orchestrator consumes `RoutingDecision`; remove duplicate owner assignment | Phase 4 follow-up |
| **P2** | Escalation mapping adapter (runtime → contracts) | Phase 5 |
| **P3** | Remove unused workforce-core dep from team-orchestrator | Phase 4 cleanup |
| **P3** | Freeze or namespace `ROLE_DEFINITIONS` | v0.2 |

### Explicit statement

**Changes are not required before starting Phase 4.** The recommended P0 work *is* Phase 4. P1–P3 items are incremental improvements that do not invalidate the current architecture.

---

## 11. Related documents

- [Workforce Router Phase 4 Design v1.0](./northbridge-workforce-router-phase-4-design-v1.md)
- [Workforce Communication Protocol v1.0](./northbridge-digital-workforce-communication-protocol-v1.md)
- [Workforce Execution Plan v1.0](./northbridge-digital-workforce-execution-plan-v1.md)

---

## 12. Document control

| Version | Date | Notes |
|---------|------|-------|
| 1.0 | 2026-07 | Initial review — Phases 1–3 PASS; Phase 4 authorized |

**Planning only. No code authorized.**
