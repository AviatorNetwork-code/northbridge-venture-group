# NEO Visitor Intent Intelligence (VII) v1

**Package:** `@neos/visitor-intent-intelligence`  
**Capability ID:** `neos.visitor-intent-intelligence`  
**Repository:** NEOS — Northbridge Engineering Operating System  
**Mode:** Read-only · Recommendations only · Founder approval required

---

## 1. Purpose

Traditional analytics answer: **"What did users click?"**

Visitor Intent Intelligence (VII) answers:

| Question | VII Capability |
|----------|----------------|
| Why did they come? | Intent inference |
| What were they trying to accomplish? | Goal detection |
| Did they succeed? | Outcome classification |
| What prevented success? | Friction + journey analysis |
| How should CAT respond differently? | Conversation evaluation |

VII transforms anonymous interactions into meaningful customer understanding across **all Northbridge products** — not only websites.

---

## 2. Design Principles

1. **Adapter-only integration** — No product-specific logic in the core engine.
2. **Read-only governance** — No automatic website, CAT, commit, or PR changes.
3. **Recommendations only** — All behavioral changes require Founder approval.
4. **Cross-product reuse** — One engine, many product adapters.
5. **Deterministic v1** — No expensive AI calls; inference is evidence-based.

---

## 3. Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        NEOS Platform                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │ CEI Input    │  │ PEE Input    │  │ CPLS Input           │ │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘ │
│         └─────────────────┼─────────────────────┘               │
│                           ▼                                      │
│              ┌────────────────────────────┐                      │
│              │ Visitor Intent Intelligence │  ← READ ONLY         │
│              │  (Core Engine)              │                      │
│              └─────────────┬──────────────┘                      │
│                            │                                     │
│     ┌──────────────────────┼──────────────────────┐             │
│     ▼                      ▼                      ▼             │
│ Intent Engine      Confidence Engine      Journey Engine        │
│ Conversation Eval  Business Correlation   Executive Reporting   │
└─────────────────────────────────────────────────────────────────┘
                            ▲
                            │ adapters only
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
 Northbridge Website   Aviator Network      Quadrix
 (product adapter)     (product adapter)    (product adapter)
```

### Package layout

```
packages/visitor-intent-intelligence/
├── src/
│   ├── core/visitorIntentIntelligence.ts   # Orchestrator
│   ├── engines/                            # Specialized engines
│   ├── adapters/adapterContract.ts         # Default intent catalog
│   ├── governance/readOnlyPolicy.ts        # Governance enforcement
│   ├── registration/capabilityRegistration.ts
│   ├── schemas/                            # JSON schemas
│   └── types/                              # Shared types
├── examples/adapters/referenceAdapters.ts  # Reference only (not in core)
└── tests/
```

---

## 4. Core Engines

### 4.1 Intent Inference Engine

Estimates per session:

- Primary intent
- Secondary intent
- Confidence score
- Supporting evidence
- Conflicting evidence
- Confidence progression over time

**Core intent categories:**

- `learn_about_company`
- `explore_products`
- `compare_services`
- `evaluate_ai_capabilities`
- `request_software_development`
- `become_customer`
- `become_partner`
- `career_exploration`
- `flight_training`
- `find_instructor`
- `find_flight_school`
- `learn_about_cat`
- `general_research`
- `unknown_intent`

Adapters may define **additional intents** (e.g. `aviator-network.instructor_search`).

### 4.2 Confidence Engine

Tracks visitor confidence signals:

- `increasing_confidence`
- `uncertainty`
- `hesitation`
- `confusion`
- `frustration`
- `disengagement`
- `successful_completion`

Outputs current score, trend (rising/stable/falling), and dominant signal.

### 4.3 Journey Understanding Engine

Tracks:

- Entry point
- Discovery path
- CAT interactions
- Navigation sequence
- Time-to-understanding
- Time-to-value
- Abandoned pages
- Completed objectives
- Unanswered questions
- Decision points
- Friction events

### 4.4 Conversation Evaluator

Evaluates CAT performance:

- Intent identification accuracy
- Follow-up question quality
- Conversation length
- Information relevance
- Personalization
- Next-best-action guidance

Generates **CAT improvement recommendations**.

### 4.5 Outcome Classifier

Classifies visitor outcomes:

- `completed_objective`
- `partially_completed`
- `abandoned`
- `more_engaged`
- `requested_contact`
- `requested_demo`
- `entered_marketplace`
- `started_onboarding`
- `scheduled_training`
- `returned_later`

### 4.6 Business Correlation Engine

Correlates intent with:

- Lead generation
- Activation
- Subscriptions
- Marketplace activity
- Customer lifetime value indicators
- Retention signals
- Conversion

### 4.7 Executive Reporting Engine

Generates:

| Metric | Description |
|--------|-------------|
| Intent Distribution | Breakdown by intent category |
| Visitor Success Score | Average outcome success |
| Intent Accuracy Score | Average inference confidence |
| CAT Guidance Score | Average conversation evaluation |
| Journey Completion Rate | Objectives achieved / sessions |
| Top Unanswered Questions | Most frequent unresolved questions |
| Highest Friction Intent | Intent with most friction events |
| Highest Value Intent | Intent with highest business value |
| Recommended CAT Improvements | Actionable CAT recommendations |
| Recommended Product Improvements | Content/navigation/workflow recommendations |

---

## 5. Adapter Contract

Products integrate through `VisitorIntentAdapter`:

```typescript
interface VisitorIntentAdapter {
  productId: string;
  displayName: string;
  getIntentCatalog(): IntentDefinition[];
  normalizeEvent(raw: unknown, sessionId: string): VIIEvent | null;
  extractSignals(context: AdapterContext): AdapterSignals;
  mapSignalsToEvidence(signals, catalog): IntentEvidence[];
  extractBusinessSignals?(context): BusinessSignal[];
  detectCompletedObjectives?(context): string[];
  detectFriction?(context): FrictionEvent[];
  classifyOutcomeHints?(context): Partial<OutcomeAssessment>;
}
```

Reference implementations (not imported by core):

- `examples/adapters/referenceAdapters.ts`
  - `northbridgeWebsiteAdapter`
  - `aviatorNetworkAdapter`
  - `quadrixAdapter`

Product teams implement adapters in their own repositories.

---

## 6. Integration Surfaces

### Inputs (read-only consumption)

| Source | Purpose |
|--------|---------|
| Customer Experience Intelligence | Experience scores, pain points |
| Product Evolution Engine | Feature gaps, friction patterns |
| Continuous Product Learning System | Observed behavioral patterns |
| Conversation Intelligence | CAT transcripts |
| Product adapter events | Normalized telemetry |

### Outputs (recommendations only)

| Target | Payload |
|--------|---------|
| Founder Dashboard | Executive reports |
| Executive Intelligence | Aggregated metrics |
| Customer Experience Intelligence | Journey + friction insights |
| Product Evolution Engine | Product improvement recommendations |
| CAT Improvement Recommendations | Conversation evaluation results |

All outputs wrapped in `VIIOutputEnvelope` with:

```typescript
governance: { readOnly: true, requiresFounderApproval: true }
```

---

## 7. Governance

| Rule | Enforcement |
|------|-------------|
| Read-only | `VII_GOVERNANCE.readOnly = true` |
| No automatic website changes | `assertReadOnlyOperation()` blocks writes |
| No automatic CAT prompt changes | Same |
| No commits / PRs | Same |
| Founder approval required | All recommendations flagged |

---

## 8. Usage

```typescript
import { VisitorIntentIntelligence } from "@neos/visitor-intent-intelligence";
import { northbridgeWebsiteAdapter } from "./myWebsiteAdapter";

const vii = new VisitorIntentIntelligence(northbridgeWebsiteAdapter);

vii.ingestEvent({ type: "page_view", path: "/services", timestamp: Date.now() });
vii.ingestEvent({
  type: "cat_message_sent",
  timestamp: Date.now(),
  metadata: { content: "I run a flight school" },
});

const session = vii.analyzeSession();
const report = vii.generateExecutiveReport([session]);
const recommendations = vii.getRecommendations(session);
```

### Capability registration

```typescript
import { registerVIICapability } from "@neos/visitor-intent-intelligence";

registerVIICapability(neoCapabilityRegistry);
```

---

## 9. Schemas

| Schema | Path |
|--------|------|
| Session Intelligence | `src/schemas/session-intelligence.schema.json` |
| Executive Report | `src/schemas/executive-report.schema.json` |
| Capability Registration | `src/schemas/capability-registration.schema.json` |

---

## 10. Success Criteria

NEO can answer:

- ✅ Why did this visitor come?
- ✅ Did they accomplish their goal?
- ✅ Did CAT understand their intent?
- ✅ Did CAT guide them effectively?
- ✅ Which visitor intents generate the highest business value?
- ✅ Which intents experience the most friction?
- ✅ Which conversations should CAT handle differently?
- ✅ Which product improvements would help visitors succeed faster?
- ✅ How should future CAT interactions evolve?

---

## 11. Validation

```bash
npm run build --workspace=@neos/visitor-intent-intelligence
npm run test --workspace=@neos/visitor-intent-intelligence
```

---

## 12. Recommended Next Capability

### Adaptive Journey Personalization Engine (AJPE) v1

VII v1 **observes and recommends**. The next evolution requires a capability that **closes the loop** under governance:

**Adaptive Journey Personalization Engine (AJPE)** would:

1. **Consume VII outputs** — intent, confidence, friction, and CAT scores per session
2. **Maintain a visitor context model** — persistent, privacy-safe profile across sessions and products
3. **Generate personalized journey plans** — dynamic content ordering, CAT conversation strategies, and CTA prioritization
4. **Propose adaptations through governance** — present diffs to Founder Dashboard for approval before any CAT prompt, content, or workflow changes
5. **Measure adaptation impact** — A/B comparison of VII scores before/after approved changes

This evolves CAT from an **intelligent assistant** (reactive, session-bound) into an **adaptive digital consultant** (proactive, cross-session, cross-product) while preserving NEOS read-only governance until Founder approval.

**Dependency chain:**

```
VII v1 (observe) → AJPE v1 (propose personalizations) → CAT Runtime v2 (execute approved adaptations)
```

AJPE should remain adapter-based, product-agnostic, and governance-gated — extending VII rather than replacing it.

---

## 13. Rollout Notes

1. Deploy VII as a NEOS package; product teams add adapters in their repos.
2. Wire CAT analytics events (e.g. `cat_opened`, `cat_message_sent`) into product adapters.
3. Connect VII outputs to Founder Dashboard when executive reporting UI is ready.
4. Do not enable live AI inference without explicit Founder approval.
5. Keep example adapters in `examples/` — never import them from core.
