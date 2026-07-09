# Northbridge Digital Workforce — Multi-Agent Default Policy v1.0

**Status:** Approved planning document  
**Owner:** Northbridge Digital Platform  
**Applies to:** All customer-facing Digital Teams at launch

**Companion documents:**

- [Communication Protocol v1.0](./northbridge-digital-workforce-communication-protocol-v1.md)
- [Workforce Execution Plan v1.0](./northbridge-digital-workforce-execution-plan-v1.md)
- [Multi-Agent Reference Implementation](../lib/ndp/teams/marketing/README.md) — Marketing Team Alpha

**Implementation:** `lib/ndp/teams/shared/multi-agent-policy.ts`

---

## 1. Purpose

Every customer-facing Northbridge Digital Team operates **multi-agent by default**.

Controlled multi-agent execution means:

- Team Lead delegates to **multiple specialists** whenever the request is not simple
- Specialists work **internally** — never as customer-facing voices
- Team Lead **synthesizes** all results into **one** customer response
- Conflicts are **detected and escalated** before delivery
- Parallel execution is used where safe; sequential where ordering matters

This policy applies to all launch teams:

| Team ID | Name |
|---------|------|
| `team-marketing` | Marketing Team |
| `team-sales` | Sales Team |
| `team-customer-service` | Customer Service Team |
| `team-financial` | Financial Team |
| `team-flight-school` | Flight School Team |
| `team-dental-office` | Dental Office Team |
| `team-law-firm` | Law Firm Team |
| `team-hvac` | HVAC Team |
| `team-general-service` | General Service Business Team |

---

## 2. Core rules

| Rule | Requirement |
|------|-------------|
| Single external voice | Team Lead is the **only** customer-facing identity |
| No specialist chatter | Specialists never speak directly to the customer |
| No free-form agent chatter | No inter-specialist dialogue exposed externally |
| One owner per request | Every request has exactly one team owner |
| Multi-agent default | Delegate to multiple specialists unless request is simple |
| Synthesized response | One consolidated reply per customer turn |
| Conflict handling | Detect conflicts; escalate when policy requires |
| No delegation exposure | Customer never sees specialist names or task splits |

---

## 3. Default Team Lead policy

All NDP teams use `NDP_DEFAULT_TEAM_LEAD_POLICY`:

```typescript
{
  maxConcurrentDelegations: 8,
  delegationExecutionMode: "parallel",      // default — parallel where safe
  synthesizeOnPartialFailure: true,
  escalateOnConflict: true,
  requireAllSpecialistsComplete: false,
  customerFacingViaTeamLeadOnly: true,
}
```

Sequential execution is permitted when:

- A specialist output is a **dependency** for the next (documented in team selector)
- `metadata.executionOrder: "sequential"` is set on the request
- Tool side effects require ordering (create before update)

---

## 4. Request classification

### 4.1 Broad request (multi-agent default)

Broad requests delegate to **two or more** specialists.

Examples:

- "I want more customers."
- "Help us improve our marketing."
- "Our pipeline is stalling."
- "We need better customer response times."

Triggers:

- Multiple capability tags
- Open statements without narrow scope
- Cross-functional intent (growth, strategy, operations)
- Default fallback when scope is unclear

### 4.2 Simple request (single specialist exception)

Simple requests may delegate to **one** specialist.

Examples:

- "What is our cost per lead?"
- "Show me the current campaign CTR."
- "What is the status of invoice 1042?"

Triggers:

- Narrow factual or status lookup
- Single metric query
- `metadata.requestScope: "simple"` (explicit product flag)

**Simple requests are the exception — not the default.**

---

## 5. Execution modes

| Mode | When to use |
|------|-------------|
| **Parallel** | Default. Independent specialist tasks (analysis + budget + content planning) |
| **Sequential** | Output of specialist A required before specialist B; ordered side effects |

Teams use `IsolatedSpecialistRuntimeFactory` when running parallel delegations.

---

## 6. Synthesis and conflicts

### 6.1 Synthesis

- Team Lead synthesizer merges successful specialist summaries
- Customer receives one cohesive response
- Evidence may be cited; internal delegation is not

### 6.2 Conflict detection

- `DefaultConflictDetector` compares specialist outputs on shared `topicKey`
- Conflicting recommendations on the same topic trigger escalation when `escalateOnConflict: true`
- Customer does not receive competing messages from multiple specialists

---

## 7. Architecture alignment

```text
Customer Request
      │
      ▼
Communication Router  (one owner)
      │
      ▼
Team Lead Orchestrator
      │
      ├── Specialist A  ─┐
      ├── Specialist B  ─┼─ parallel (default) or sequential
      └── Specialist C  ─┘
      │
      ▼
Conflict Detector
      │
      ▼
Team Lead Synthesizer  →  ONE customer response
```

| Platform package | Role |
|------------------|------|
| `@northbridge/team-orchestrator` | Delegation, parallel/sequential execution, synthesis |
| `@northbridge/specialist-runtime` | Isolated specialist task execution |
| `lib/ndp/conversation-router` | Single owner routing |
| `lib/ndp/teams/shared/` | NDP multi-agent default policy |

---

## 8. Team implementation requirements

Every new team (per DEDK workflow) must:

1. Import `NDP_DEFAULT_TEAM_LEAD_POLICY` from `lib/ndp/teams/shared/`
2. Use `IsolatedSpecialistRuntimeFactory` for parallel multi-agent execution
3. Implement `SpecialistSelector` that selects **multiple specialists by default**
4. Implement `isSimpleTeamRequest()` check for single-specialist exception
5. Use a Team Lead synthesizer that hides specialist identities
6. Test broad requests delegate to ≥2 specialists
7. Test simple requests may delegate to 1 specialist
8. Test customer response is single-voice

---

## 9. Anti-patterns

| Anti-pattern | Why it fails |
|--------------|--------------|
| Single specialist for every request | Misses cross-functional value of teams |
| Specialists replying to customer | Breaks Communication Protocol |
| Exposing delegation in synthesis | Erodes "customers hire teams" doctrine |
| Ignoring conflicts | Customer receives contradictory advice |
| Always sequential | Unnecessary latency for independent work |
| Always parallel when ordered | Race conditions on dependent tasks |

---

## 10. Migration

| Team | Status |
|------|--------|
| Marketing Team Alpha | Reference implementation — multi-agent default active |
| Sales, CS, Financial, industry teams | Apply policy at implementation (not built yet) |

No changes to `@northbridge/*` workforce package defaults. NDP product layer sets policy via `NDP_DEFAULT_TEAM_LEAD_POLICY`.

---

## 11. Validation

```bash
npx vitest run lib/ndp/teams/
cd packages/team-orchestrator && npm test
cd packages/specialist-runtime && npm test
```

Tests must prove:

- Broad team requests delegate to multiple specialists
- Simple requests may use one specialist
- Synthesis produces single Team Lead response
- Specialist IDs not exposed to customer
