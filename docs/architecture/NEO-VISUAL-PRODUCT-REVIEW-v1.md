# Visual Product Review Engine (VPRE) v1

**Package:** `@neos/visual-product-review-engine`  
**Capability ID:** `neos.visual-product-review-engine`  
**Repository:** NEOS — Northbridge Engineering Operating System  
**Mode:** Read-only · Recommendations only · Founder approval required

---

## 1. Purpose

A real executive team evaluates products by **using them** — not by reading source code alone.

VPRE teaches NEO to evaluate products from the **customer's perspective** by analyzing:

- Browser screenshots
- Local screenshots
- Mobile screenshots
- Screen recordings (future)
- Browser automation captures (future)

---

## 2. What NEO inspects

| Area | Customer lens |
|------|-----------------|
| User experience | Does this feel usable on first visit? |
| Information architecture | Can I find what I need? |
| Product clarity | Do I understand what this is for? |
| Trust | Would I feel confident proceeding? |
| Conversion friction | Is the next step obvious? |
| Brand consistency | Does this feel like one product? |
| Navigation | Can I orient quickly? |
| Visual hierarchy | Can I scan effectively? |
| Calls to action | Is there a clear primary action? |
| Customer journey | Does this screen fit the journey step? |
| CAT interaction | Is consultative help visible when expected? |
| Mobile experience | Does mobile add friction? |

---

## 3. Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         NEOS Platform                                │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │           Visual Product Review Engine (VPRE)                  │  │
│  │  Dimension Evaluators → Issue Detector → Executive Reports    │  │
│  └────────────────────────────┬──────────────────────────────────┘  │
└───────────────────────────────┼─────────────────────────────────────┘
                                │ read-only
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
 Browser screenshots    Mobile screenshots      Future: Playwright /
 Local captures                                  Cursor browser / DevTools
        │                       │                       │
        └───────────────────────┴───────────────────────┘
                                ▼
              Product review adapters (expectations only)
        Northbridge Website · Aviator Network · Quadrix
```

### Package layout

```
packages/visual-product-review-engine/
├── src/
│   ├── core/visualProductReviewEngine.ts
│   ├── engines/
│   │   ├── dimensionEvaluators.ts      # 12 dimensions
│   │   ├── issueDetector.ts            # Issues + prioritization
│   │   └── executiveReportGenerator.ts
│   ├── adapters/defaultProductReviewAdapters.ts
│   ├── registry/reviewSourceRegistry.ts
│   ├── governance/readOnlyPolicy.ts
│   └── registration/capabilityRegistration.ts
├── examples/flows/northbridgeWebsiteReview.ts
└── tests/
```

---

## 4. Evaluation dimensions (12)

1. First impression  
2. Product understanding  
3. Trust  
4. Navigation  
5. Information hierarchy  
6. Visual clarity  
7. Conversion path  
8. CAT interaction quality  
9. Accessibility  
10. Mobile experience  
11. Consistency  
12. Business impact  

---

## 5. Per-screen outputs

Every reviewed screen generates:

| Score | Range | Meaning |
|-------|-------|---------|
| UX Score | 0–100 | Overall customer experience |
| Product Understanding Score | 0–100 | Clarity of product purpose |
| Trust Score | 0–100 | Credibility signals |
| Conversion Score | 0–100 | Next-step clarity |
| Friction Score | 0–100 | Lower is better |
| Accessibility Score | 0–100 | Usability for all users |

Every issue includes:

- Screenshot location (screen, capture, viewport, path/url)
- Severity (`critical` → `low`)
- Business impact
- Suggested improvement
- Evidence
- Expected conversion improvement

---

## 6. Governance

```typescript
VPRE_GOVERNANCE = {
  readOnly: true,
  allowsUiModifications: false,
  allowsCodeGeneration: false,
  allowsAutomaticCommits: false,
  allowsAutonomousDesignChanges: false,
  requiresFounderApproval: true,
};
```

- **No UI modifications**
- **No code generation**
- **No automatic commits**
- **No autonomous design changes**
- **Founder approval required** for all recommendations

---

## 7. Future capture integrations

Registered as integration targets (v1 metadata):

- Cursor browser
- Playwright
- Chrome DevTools
- Local screenshots
- Aviator Network
- Quadrix
- Northbridge Website

v1 accepts **rendered UI signals** extracted from captures; future versions will attach vision/automation pipelines.

---

## 8. Example usage

```typescript
import { createVisualProductReviewEngine } from "@neos/visual-product-review-engine";

const engine = createVisualProductReviewEngine();
const report = engine.reviewScreens({
  reviewId: "review-001",
  requesterId: "neos-executive",
  productId: "northbridge-website",
  productName: "Northbridge Website",
  screens: [/* ScreenCapture with RenderedUISignals */],
  timestamp: Date.now(),
});

console.log(report.executiveSummary);
console.log(report.prioritizedIssues);
```

---

## 9. Testing

```bash
npm run build:vpre
npm run test:vpre
```

---

## 10. Recommended next capability

### Digital Product Journey Review System (DPJRS) v1

Evolve VPRE from **individual screen review** into a **complete Digital Product Review System** that observes **entire user journeys**:

| VPRE v1 | DPJRS v1 (next) |
|---------|-----------------|
| Single-screen scores | Multi-step journey maps |
| Static screenshots | Session replay + step sequencing |
| Per-screen friction | Journey drop-off analysis |
| Isolated CAT check | Consultative path quality across journey |
| Screen prioritization | Journey-stage prioritization |

**DPJRS would add:**

1. **Journey capture protocol** — ordered screens with timestamps and intent transitions  
2. **Drop-off detection** — where customers abandon relative to conversion goal  
3. **Cross-screen consistency engine** — brand, navigation, and CTA coherence  
4. **Consultative journey scoring** — CAT visibility and quality across discover → convert  
5. **Executive journey report** — one narrative: "From first visit to consultation intent, here's where we lose customers"  
6. **Playwright / Cursor browser adapter** — automated journey recording  

This completes the executive product review loop: **see the product as customers experience it across the full journey**, not screen by screen in isolation.
