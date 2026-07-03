# SEO Intelligence Engine (SIE) v1

**Package:** `@neos/seo-intelligence`  
**Capability ID:** `neos.seo-intelligence`  
**Repository:** NEOS — Northbridge Engineering Operating System  
**Mode:** Read-only · Recommendations only · Founder approval required

---

## 1. Purpose

NEO behaves like an **experienced SEO strategist**, not an article writer.

Before recommending content creation, SIE determines:

| Question | SIE capability |
|----------|----------------|
| What are customers searching for? | Search intent classification |
| Which questions are unanswered? | Opportunity detection |
| Which products solve those problems? | Product mapping (+ PCB verification) |
| Does content already exist? | Existing content audit |
| What is the business impact? | SEO Business Score (0–100) |
| What format should we use? | Content recommendation |
| What would the page look like? | Draft generator (not published) |

**Only then** does it recommend creating a page.

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         NEOS Platform                                │
│  Business Impact · Product Capability Broker · Executive Intelligence│
│                              │                                       │
│              ┌───────────────▼────────────────┐                      │
│              │   SEO Intelligence Engine       │  ← READ ONLY         │
│              │  Intent → Audit → Map → Score   │                      │
│              │  → Recommend → Draft → Report   │                      │
│              └───────────────┬────────────────┘                      │
└──────────────────────────────┼──────────────────────────────────────┘
                               ▼
              Northbridge Website · Aviator Network · Future products
```

### Package layout

```
packages/seo-intelligence/
├── src/
│   ├── core/seoIntelligenceEngine.ts
│   ├── engines/
│   │   ├── searchIntentClassifier.ts
│   │   ├── opportunityDetector.ts
│   │   ├── contentAuditEngine.ts
│   │   ├── productMappingEngine.ts
│   │   ├── businessImpactScorer.ts
│   │   ├── contentRecommender.ts
│   │   ├── draftGenerator.ts
│   │   └── executiveReportGenerator.ts
│   ├── integrations/neosIntegrations.ts
│   ├── governance/readOnlyPolicy.ts
│   └── registration/capabilityRegistration.ts
└── tests/
```

---

## 3. Core capabilities

### 3.1 Search intent classification

- Informational
- Commercial
- Transactional
- Navigational
- Comparison
- Local

### 3.2 Opportunity detection

Seed high-value examples:

- "How to start a flight school"
- "Best pilot logbook app"
- "FAA medical guide"
- "CFI scheduling software"

### 3.3 Existing content audit

- Detect existing pages
- Avoid duplicate content
- Flag improvement candidates

### 3.4 Product mapping

Maps to: Aviator Network, Northbridge Digital Services, AI & Automation, AirTax, Quadrix, or **honest no-fit**.

Product Capability Broker integration verifies claims before recommendations.

### 3.5 SEO Business Score (0–100)

Factors: search demand, buyer intent, revenue potential, customer value, strategic alignment, competition, maintenance cost.

### 3.6 Content format recommendations

Landing page, knowledge article, comparison page, industry guide, FAQ, tool page, resource library, case study.

### 3.7 Draft generator (not published)

- SEO title, meta description, URL slug
- H1–H3 outline
- Internal linking suggestions
- CTA recommendations
- Product references
- FAQ schema + JSON-LD suggestions

### 3.8 Executive report

Every recommendation includes: opportunity score, business impact, traffic value, conversion impact, complexity, product, why now, opportunity cost if delayed.

---

## 4. Governance

```typescript
SIE_GOVERNANCE = {
  readOnly: true,
  allowsAutomaticPublishing: false,
  allowsCmsModifications: false,
  allowsCommits: false,
  requiresFounderApproval: true,
};
```

---

## 5. Example usage

```typescript
import { createSEOIntelligenceEngine } from "@neos/seo-intelligence";

const engine = createSEOIntelligenceEngine();
const report = await engine.analyze({
  analysisId: "analysis-001",
  requesterId: "neos-strategist",
  productScope: "Northbridge aviation",
  keywords: ["how to start a flight school", "best pilot logbook app"],
  existingContent: [],
  timestamp: Date.now(),
});
```

---

## 6. Testing

```bash
npm run build:sie
npm run test:sie
```

---

## 7. Recommended next capability

### Organic Growth Intelligence Platform (OGIP) v1

Evolve SIE from **pre-publication strategy** into a complete platform that monitors outcomes after content ships:

| SIE v1 (now) | OGIP v1 (next) |
|--------------|----------------|
| Pre-publish opportunity scoring | Post-publish ranking monitoring |
| Traffic value estimates | Measured traffic + conversion attribution |
| Content recommendations | Content decay detection |
| One-time executive reports | Continuous update recommendations |
| Business score at creation | Business score from **real outcomes** |

**OGIP would add:**

1. **Ranking monitor** — track keyword positions over time (Search Console / API adapters)  
2. **Conversion attribution** — connect pages to qualified leads and revenue, not traffic alone  
3. **Content decay detector** — flag pages losing rankings, freshness, or conversion rate  
4. **Update recommender** — evidence-based refresh vs. retire vs. consolidate decisions  
5. **Competitive movement alerts** — when competitors capture target keywords  
6. **Executive growth dashboard** — organic ROI narrative for Founder decisions  

This completes the organic growth loop: **identify → create → measure → maintain → prioritize by business outcomes**.
