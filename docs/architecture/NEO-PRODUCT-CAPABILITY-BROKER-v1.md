# Product Capability Broker (PCB) v1

**Package:** `@neos/product-capability-broker`  
**Capability ID:** `neos.product-capability-broker`  
**Repository:** NEOS — Northbridge Engineering Operating System  
**Mode:** Read-only · Product-owned knowledge · No autonomous product changes

---

## 1. Purpose

Website CAT should not pretend to know every Northbridge product in detail.

Instead, consultative assistants follow a federated intelligence model:

1. **Understand** the visitor
2. **Identify** which product may fit
3. **Ask** the authoritative product assistant via PCB
4. **Receive** a structured capability response
5. **Translate** into a public-safe customer answer
6. **Recommend** the appropriate next action

This prevents hallucination and keeps product knowledge owned by each product team.

---

## 2. Core idea

Each product has its own **product CAT / capability source of truth**.

| Requester | Target | Example topics |
|-----------|--------|----------------|
| Website CAT | Aviator CAT | Flight schools, CFIs, logbook, marketplace |
| Website CAT | Quadrix CAT | Gameplay, education use, multiplayer, retention |
| Website CAT | AirTax CAT | Aviation tax/financial service fit |
| Future assistants | Any registered product | Same broker protocol |

---

## 3. Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         NEOS Platform                                │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              Product Capability Broker (PCB)                   │  │
│  │  Registry → Adapter dispatch → Validator → Guardrails → Synth │  │
│  └────────────────────────────┬─────────────────────────────────┘  │
└───────────────────────────────┼─────────────────────────────────────┘
                                │ read-only requests
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
 Aviator Network          Quadrix                 Northbridge Digital
 capability adapter       capability adapter      Services adapter
        │                       │                       │
        ▼                       ▼                       ▼
 Product-owned            Product-owned             Product-owned
 knowledge source         knowledge source          knowledge source
```

### Package layout

```
packages/product-capability-broker/
├── src/
│   ├── core/productCapabilityBroker.ts
│   ├── registry/productRegistry.ts
│   ├── engines/
│   │   ├── capabilityResponseValidator.ts
│   │   ├── disclosureGuardrails.ts
│   │   └── publicSafeSynthesis.ts
│   ├── adapters/defaultProductAdapters.ts
│   ├── governance/readOnlyPolicy.ts
│   ├── registration/capabilityRegistration.ts
│   ├── schemas/
│   └── types/
├── examples/flows/websiteCatAviatorFlow.ts
└── tests/
```

---

## 4. Required concepts

| Concept | Implementation |
|---------|----------------|
| Product registry | `ProductRegistry` |
| Capability request | `ProductCapabilityRequest` |
| Capability response | `ProductCapabilityResponse` |
| Capability confidence | `high` \| `medium` \| `low` |
| Current vs planned vs unsupported | Separate arrays + validator overlap check |
| Public-safe synthesis | `synthesizePublicAnswer()` |
| Low-confidence escalation | `escalationRequired` + synthesis follow-up |
| Hallucination guardrails | Validator + unsupported claim blocking |
| Product ownership metadata | `ProductOwnershipMetadata` on each adapter |
| Roadmap disclosure rules | `enforceRoadmapDisclosureRules()` |

---

## 5. Request schema

```typescript
interface ProductCapabilityRequest {
  requestId: string;
  requesterId: string;
  targetProductId: string;
  visitorIntent: string;
  visitorContext: VisitorContext;
  question: string;
  requiredConfidence: "high" | "medium" | "low";
  publicFacing: boolean;
  allowedDisclosureLevel: DisclosureLevel;
  timestamp: number;
}
```

---

## 6. Response schema

```typescript
interface ProductCapabilityResponse {
  responseId: string;
  targetProductId: string;
  answeredBy: string;
  currentCapabilities: CapabilityItem[];
  plannedCapabilities: CapabilityItem[];
  unsupportedClaims: UnsupportedClaim[];
  recommendedPositioning: string;
  recommendedCTA: string;
  confidence: "high" | "medium" | "low";
  evidence: CapabilityEvidence[];
  escalationRequired: boolean;
  publicSafeSummary: string;
  privateNotes?: string;
  lastUpdated: number;
}
```

---

## 7. Disclosure levels

| Level | Use |
|-------|-----|
| `public` | Visitor-facing website copy |
| `sales_safe` | Consultant conversations, soft-close |
| `partner_safe` | Partner discussions — not public web |
| `internal_only` | Engineering / product ops — never public |

Rules:

- Public answers never expose internal architecture (NEO/NEOS/governance)
- Planned features must be labeled planned / not yet available
- Unsupported claims are explicitly blocked from synthesized answers
- Low-confidence responses recommend human follow-up

---

## 8. Example flow

**Visitor:** "Can Aviator Network help my flight school get students?"

**Website CAT → PCB request → Aviator adapter**

**Aviator response (structured):**

- **Current:** marketplace positioning, instructor/student discovery, profiles, training requests, logbook foundation
- **Planned:** deeper school workspace, analytics, advanced CAT workflows
- **Unsupported:** guaranteed student acquisition, FAA endorsement, replacing ops software without setup

**Public-safe synthesized answer:**

> Aviator Network can help improve visibility and connection workflows for aviation training, but it should not be presented as a guaranteed student acquisition system.

---

## 9. Initial product adapters

| Adapter | Product ID | Status |
|---------|-----------|--------|
| Aviator Network | `aviator-network` | Full v1 adapter |
| Quadrix | `quadrix` | Full v1 adapter |
| Northbridge Digital Services | `northbridge-services` | Full v1 adapter |
| AirTax Financial | `airtax-financial` | Placeholder — escalates by default |
| Generic future product | dynamic | Low-confidence fallback |

---

## 10. Governance

```typescript
PCB_GOVERNANCE = {
  readOnly: true,
  allowsAutomaticProductChanges: false,
  allowsPublicRoadmapCommitments: false,
  allowsAutonomousCapabilityInvention: false,
  requiresProductOwnership: true,
  requiresFounderApprovalForRoadmapChanges: true,
};
```

- Broker is **read-only**
- No autonomous product changes
- No automatic public roadmap commitments
- Website CAT **synthesizes, does not invent**

---

## 11. Capability registry

Register in NEOS:

```typescript
import { registerPCBCapability } from "@neos/product-capability-broker";

registerPCBCapability(neosCapabilityRegistry);
```

Capability ID: `neos.product-capability-broker`

---

## 12. Testing

```bash
npm run build:pcb
npm run test:pcb
```

---

## 13. Recommended next mission (Northbridge Website repo)

**Mission:** Connect Website CAT to Product Capability Broker via thin adapter

Implement in `northbridge-venture-group` on branch `cursor/website-cat-pcb-adapter-v1-c8f7`:

1. Add `@neos/product-capability-broker` workspace dependency (or vendored thin client)
2. Create `lib/cat/productCapabilityClient.ts` — maps consultative session state to `ProductCapabilityRequest`
3. In `consultantStrategy.ts` recommend stage: call PCB before exposing product recommendation
4. Replace hard-coded product reasoning with `BrokeredCapabilityResult.publicAnswer`
5. Surface `blockedClaims` and `escalationRequired` in consultant response metadata
6. Keep all NEOS/PCB internals out of public UI — only synthesized answers shown
7. Add tests: flight school question must use broker answer, not invented claims

This connects consultative selling (Website) to federated product intelligence (NEOS) without exposing platform internals publicly.
