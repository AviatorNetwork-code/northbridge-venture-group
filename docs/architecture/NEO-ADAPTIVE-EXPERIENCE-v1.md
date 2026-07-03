# NEO Adaptive Experience Engine (AEE) v1

**Package:** `@neos/adaptive-experience-engine`  
**Capability ID:** `neos.adaptive-experience-engine`  
**Repository:** NEOS — Northbridge Engineering Operating System  
**Mode:** Read-only · Recommendations only · Founder approval required

---

## 1. Purpose

NEO today understands engineering, business impact, executive priorities, customer journeys, and visitor intent.

AEE v1 adds the next layer: **recommending how products should adapt to different users** — without modifying products autonomously.

| Traditional analytics | AEE |
|----------------------|-----|
| What did users click? | What experience should we recommend? |
| Page views | Personalized onboarding, navigation, CTAs |
| Session duration | Next-best-action and conversation strategy |

**This is NOT a website feature.** It is a reusable Northbridge platform capability consumable by every operating company.

---

## 2. Design Principles

1. **Product-agnostic core** — adapter-only integration
2. **Read-only governance** — no UI updates, prompt changes, personalization, commits, tasks, or execution
3. **Founder approval mandatory** — every recommendation flagged
4. **Executive Intelligence integration** — AEE feeds EI before customer-facing recommendations
5. **Deterministic v1** — evidence-based scoring, no autonomous AI calls

---

## 3. Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         NEOS Platform                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │ VII         │  │ CEI         │  │ Business Impact Engine  │ │
│  └──────┬──────┘  └──────┬──────┘  └───────────┬─────────────┘ │
│         └────────────────┼───────────────────────┘               │
│                          ▼                                        │
│              ┌───────────────────────────┐                        │
│              │ Adaptive Experience Engine │  ← READ ONLY          │
│              └─────────────┬─────────────┘                        │
│                            │                                      │
│   Experience Analyzer · Recommendation Engine · Risk Evaluator   │
│   Personalization Scoring · Business/Customer Impact Estimators    │
└──────────────────────────────────────────────────────────────────┘
                             ▲
                             │ adapters only
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
  Northbridge Website   Aviator Network        Quadrix
```

### Package layout

```
packages/adaptive-experience-engine/
├── src/
│   ├── core/adaptiveExperienceEngine.ts
│   ├── engines/
│   ├── governance/readOnlyPolicy.ts
│   ├── registration/capabilityRegistration.ts
│   ├── schemas/
│   └── types/
├── examples/samples/productSamples.ts
└── tests/
```

---

## 4. Inputs

| Source | Signal |
|--------|--------|
| Customer Experience Intelligence | Pain points, friction, experience score |
| Visitor Intent Intelligence | Primary/secondary intent, confidence |
| Business Impact Engine | Value score, conversion probability |
| Executive Intelligence | Strategic priorities |
| Organization Understanding | Operating company context |
| Founder Decision Learning | Approved/rejected recommendation areas |
| Customer Journey Intelligence | Entry, repeat visits, objectives |
| Product telemetry | Navigation, features, sessions |
| Conversation analytics | CAT guidance score, unanswered questions |
| Experiment outcomes | Uplift, variant confidence |

---

## 5. Core Responsibilities

Analyzes:

- Visitor intent
- Customer maturity (new / returning / engaged / at-risk)
- Journey friction
- Conversation health
- Feature adoption
- Navigation behavior
- Repeat visits
- Business and customer goal alignment
- Executive priority alignment

Generates recommendations for:

- Onboarding
- Navigation
- Next best action
- Content ordering
- Conversation strategy
- CTA placement
- Feature discovery
- Education flow
- Support
- Personalized product suggestions

---

## 6. Outputs

Every plan includes:

| Output | Description |
|--------|-------------|
| **Adaptive Experience Plan** | Full recommendation set |
| **Personalization Confidence** | 0–1 confidence in personalization fit |
| **Expected Business Impact** | Organizational value estimate |
| **Expected Customer Impact** | Customer value estimate |
| **Executive Summary** | Plain-language summary for leadership |
| **Risk Assessment** | Low/medium/high with mitigation factors |
| **Evidence Quality** | Input completeness score |
| **Dependencies** | Missing upstream capabilities |
| **Required Founder Approval** | Always `true` |

Every recommendation includes:

- Experience Score
- Business Impact Score
- Customer Value Score
- Engineering Effort (low / medium / high)
- Confidence
- Evidence
- Expected ROI
- Opportunity Cost
- Strategic Alignment

---

## 7. Sample Recommendations

### Northbridge Website

**Intent:** Learning about AI

**Recommendation:** Show AI product overview before consulting services.

**Reason:** Highest predicted engagement based on visitor intent and previous journeys.

### Aviator Network

**Intent:** Student preparing for Commercial Pilot

**Recommendation:** Promote Logbook Scanner before Marketplace.

**Reason:** Improves activation probability.

### Quadrix

**Intent:** Returning player after seven days

**Recommendation:** Resume progression immediately instead of tutorial.

**Reason:** Higher retention probability.

Samples live in `examples/samples/productSamples.ts`.

---

## 8. Adapter Contract

```typescript
interface AdaptiveExperienceAdapter {
  productId: string;
  displayName: string;
  getExperienceContext(): ProductExperienceContext;
  normalizeTelemetry(raw: unknown): TelemetryEvent[];
  getRecommendationTemplates?(context, inputs): Partial<ExperienceRecommendation>[];
}
```

Product-specific logic stays in adapters. Core never imports product implementations.

---

## 9. Governance

| Rule | Enforcement |
|------|-------------|
| Read-only | `AEE_GOVERNANCE.readOnly = true` |
| No automatic UI updates | Blocked by `assertReadOnlyOperation()` |
| No automatic prompt updates | Blocked |
| No automatic personalization | Blocked |
| No commits / tasks / execution | Blocked |
| Founder approval required | All recommendations flagged |

---

## 10. Integration Flow

```
VII (intent) ──┐
CEI (behavior) ├──► AEE ──► Executive Intelligence ──► Founder Dashboard
BIE (value) ───┘              (reviews before presenting)
                                      │
                                      ▼
                              Founder Decision Learning
                              (evaluates outcomes later)
```

Executive Intelligence consumes AEE **before** presenting customer-facing recommendations.

---

## 11. Usage

```typescript
import { AdaptiveExperienceEngine } from "@neos/adaptive-experience-engine";
import { northbridgeWebsiteAdapter, northbridgeWebsiteSampleInput } from "./myAdapter";

const aee = new AdaptiveExperienceEngine(northbridgeWebsiteAdapter);
const plan = aee.generatePlan(northbridgeWebsiteSampleInput);

// plan.recommendations — read-only, requires Founder approval
// plan.executiveSummary — for Executive Intelligence
```

Register with NEOS:

```typescript
import { registerAEECapability } from "@neos/adaptive-experience-engine";
registerAEECapability(neoCapabilityRegistry);
```

---

## 12. Schemas

| Schema | Path |
|--------|------|
| Adaptive Experience Plan | `src/schemas/adaptive-experience-plan.schema.json` |
| Executive Recommendation | `src/schemas/executive-recommendation.schema.json` |
| Capability Registration | `src/schemas/capability-registration.schema.json` |

---

## 13. Validation

```bash
npm run build:aee
npm run test:aee
```

---

## 14. Success Criteria

- ✅ NEO evolves from understanding behavior to recommending better experiences
- ✅ Engine is product-agnostic and reusable
- ✅ No autonomous product modifications
- ✅ Founder approval remains final authority

---

## 15. Recommended Next Capability

### Organizational Intelligence Orchestrator (OIO) v1

AEE v1 **recommends** adaptive experiences. The next platform capability should **unify all NEOS intelligence into a single organizational operating layer**:

**Organizational Intelligence Orchestrator (OIO)** would:

1. **Fuse all NEOS capabilities** — Engineering Operations, Business Impact, VII, AEE, CEI, Executive Intelligence, Founder Decision Learning, Organization Understanding
2. **Maintain a cross-company intelligence graph** — relationships between products, customers, ventures, and strategic priorities
3. **Generate unified organizational briefings** — daily/weekly Founder and executive views spanning every operating company
4. **Coordinate recommendation lifecycles** — track AEE recommendations from proposal → Founder approval → implementation → outcome measurement
5. **Enable governed execution handoffs** — when Founder approves, OIO routes approved recommendations to the correct product team workflow without autonomous execution
6. **Close the learning loop** — feed implementation outcomes back into VII, AEE, and Founder Decision Learning

This moves NEOS from a collection of intelligence capabilities toward a **complete Organizational Intelligence Platform** spanning every Northbridge operating company.

**Dependency chain:**

```
VII (understand) → AEE (recommend) → OIO (orchestrate + govern + learn) → Product Teams (execute with approval)
```

OIO does not replace individual engines — it orchestrates them into a coherent organizational nervous system.

---

## 16. Rollout Notes

1. Wire VII session outputs into AEE `visitorIntent` input field
2. Connect CEI friction signals into `customerExperience`
3. Route AEE plans to Executive Intelligence before Founder Dashboard
4. Product teams implement adapters in their repos (samples provided)
5. Do not enable autonomous experience changes without Founder approval workflow
