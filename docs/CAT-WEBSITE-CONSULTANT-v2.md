# CAT Website Consultant v2

Transforms CAT from a website Q&A assistant into a **digital solutions consultant** focused on customer understanding and qualified conversion—not conversation volume.

**Version:** 2.0 (consultant mode)  
**Scope:** Northbridge Website (public-facing)

---

## Mission

A visitor who arrives knowing nothing about Northbridge should leave understanding:

- What Northbridge is
- Why Northbridge is different
- Which product fits their needs
- Why they should trust the company
- What action to take next

**Success metric:** customer understanding and business conversion—not chat quality alone.

---

## v1 → v2: Ten Highest-Impact Improvements

Analysis of CAT Website Assistant v1 identified these improvements (all implemented in v2):

| # | Improvement | v1 Gap | v2 Solution |
|---|-------------|--------|-------------|
| 1 | **Stateful visitor profile** | Each message treated independently | `ConsultantSessionState` accumulates industry, goals, problems, urgency |
| 2 | **Stage-driven conversation flow** | Static FAQ dumps | Six stages: Understand → Educate → Discover Fit → Build Trust → Recommend → Convert |
| 3 | **Product recommendation engine** | Keyword → topic only | `productRecommendationEngine.ts` scores fit across 6 Northbridge products |
| 4 | **Natural discovery questions** | Never asks follow-ups | Stage-appropriate follow-up questions without interrogation |
| 5 | **Trust-building layer** | Information-only responses | Transparency, reasoning, uncertainty admission, no overselling |
| 6 | **Conversion-aware CTA sequencing** | Same CTAs every response | Stage-specific CTAs aligned to recommendation confidence |
| 7 | **Session success metrics** | Basic event hooks only | Product understanding, confidence, trust, conversion probability scores |
| 8 | **Conversation intelligence capture** | Not captured | FAQs, objections, buying signals, friction, competitive mentions |
| 9 | **Conversion analytics funnel** | 6 basic events | 15 events including qualified lead, stage transition, NEO export |
| 10 | **Progressive education** | Long single-shot answers | Trimmed stage messages + recommendation cards + follow-ups |

---

## Conversation Philosophy

### 1. Understand
Learn visitor type, industry, problems, goals, experience, urgency—naturally, not interrogatively.

### 2. Educate
Explain Northbridge mission, portfolio, value, and differentiation without jargon.

### 3. Discover Product Fit
Match to: Aviator Network, Northbridge Services, AI Solutions, Partnership, Quadrix, AirTax Financial—or honestly state no fit.

### 4. Build Trust
Transparent reasoning, expertise signals, uncertainty admission, no exaggerated claims.

### 5. Recommend
When confidence is high: product, benefits, timeline, ROI, alternatives.

### 6. Convert
Guide toward consultation, contact, exploration, or app—without pressure.

---

## Architecture

```
components/cat/
  CatWebsiteAssistant.tsx
  CatPanel.tsx              # Session state + analytics
  CatMessage.tsx            # Stage labels + recommendation cards
  CatLauncher.tsx

lib/cat/
  websiteConsultant flow:
    consultantStrategy.ts       # Orchestrator
    conversationStages.ts       # Stage logic
    intentDetection.ts          # Profile + intent extraction
    productRecommendationEngine.ts
    trustFramework.ts
    conversationIntelligence.ts
    successMetrics.ts
    neoIntegration.ts           # Anonymous NEO export
  websiteAssistant.ts           # Public API (consultant mode)
  websiteKnowledge.ts           # Public-safe knowledge base
  analytics.ts                  # Extended event hooks
```

---

## Product Recommendation Engine

Products scored by fit signals, industry, visitor type:

| Product | Best for |
|---------|----------|
| Aviator Network | Aviation training, flight schools, pilots, instructors |
| Northbridge Digital Services | Websites, platforms, automation, infrastructure |
| AI & Automation Solutions | Practical AI/automation workflows |
| Venture Partnership | Founders building platform ventures |
| Quadrix Assessment | Readiness evaluation when path is unclear |
| AirTax Financial | Aviation financial/tax services |

---

## Success Metrics

Tracked per session via `successMetrics.ts`:

- Product Understanding Score
- Visitor Confidence Score
- Recommendation Acceptance Rate
- CTA Click-through Rate
- Meeting Booking Rate
- Qualified Lead Rate
- Conversation Completion Rate
- Conversation Satisfaction
- Customer Understanding Improvement

---

## Analytics Events

| Event | When |
|-------|------|
| `cat_stage_transition` | Conversation stage advances |
| `cat_product_recommended` | Product fit recommendation generated |
| `cat_follow_up_asked` | Discovery question included |
| `cat_understanding_signal_captured` | Intent/profile signal detected |
| `cat_session_scores_updated` | Success scores change |
| `cat_qualified_lead_signal` | Qualified lead criteria met |
| `cat_conversion_intent` | Convert stage reached |
| `cat_conversation_completed` | Session closed with metrics |
| `cat_neo_export` | Anonymous payload exported |

Plus v1 events: `cat_opened`, `cat_closed`, `cat_message_sent`, `cat_cta_clicked`, etc.

---

## NEO Integration

On session close, anonymous payload exported via:

- CustomEvent: `northbridge:cat-neo-export`
- Analytics event: `cat_neo_export`

Targets (read-only, no PII):

- Visitor Intent Intelligence
- Customer Experience Intelligence
- Adaptive Experience Engine
- Business Impact Engine
- Executive Intelligence
- Founder Decision Learning

---

## Governance

- No fabricated information
- No misleading marketing or fake urgency
- No hidden persuasion
- Respect user privacy (anonymous exports)
- Escalate to human contact when appropriate
- No NEO/NEOS exposure in customer-facing copy

---

## Validation

```bash
npm run test:cat
npm run lint
npm run build
```

Tests: `lib/cat/consultant.test.ts`, `lib/cat/websiteAssistant.test.ts`

---

## Rollout Notes

1. v2 replaces v1 static FAQ mode with consultant mode by default
2. Runtime adapter mode is now `"consultant"` (was `"static"`)
3. Wire `setCatAnalyticsHandler()` to analytics backend when ready
4. NEO packages consume `northbridge:cat-neo-export` events
5. No live AI API calls—deterministic consultant logic only
