# CAT Consultative Selling v1

Upgrade from product recommendation to professional consultative sales guidance. CAT discovers, clarifies, educates, recommends, handles objections, and soft-closes — without hard selling or immediate pitching.

## Sales flow

| Stage | Purpose | Visitor sees |
|-------|---------|--------------|
| `discover` | Understand situation | Discovery questions (industry, launch context) |
| `clarify` | Pinpoint priorities | Challenge / goal questions |
| `teach` | Share relevant context | Trust-building explanations, product context |
| `recommend` | Match product to need | Fit-based recommendation with reasoning |
| `handle_objections` | Address concerns | Acknowledgment + honest response templates |
| `close_softly` | Suggest next step | Contact / learn-more CTAs, no pressure |
| `follow_up` | Capture intent | Meeting / contact guidance |

## Rules enforced

- No hard selling, fake urgency, or exaggerated claims
- No internal NEO/CAT/package/governance language in visitor-facing copy
- Honest no-fit when portfolio match is weak
- Product recommendations gated until discovery + clarification complete
- Escalate to contact/meeting when lead qualification score is high

## Architecture

```
lib/cat/
├── consultantStrategy.ts      # Orchestrates consultative turns
├── conversationStages.ts      # 7-stage progression logic
├── discoveryStrategy.ts       # Aviation + general discovery questions
├── objectionHandling.ts       # Detection + response templates
├── leadQualification.ts       # Scoring model + soft-close trigger
├── softCloseSequencing.ts     # CTA sequencing + recommendation gate
├── consultantTypes.ts         # Session, sales, qualification types
└── analytics.ts               # Sales event helpers
```

### Recommendation gate

`canExposeRecommendation()` in `softCloseSequencing.ts` prevents product cards and pitch copy until:

1. Clarification is complete (`primaryChallenge` or equivalent captured)
2. Stage is `recommend`, `close_softly`, or `follow_up`
3. No active unresolved objection

The product engine may compute fit internally on any turn; exposure is UI/copy gated.

### Lead qualification

`scoreLeadQualification()` produces a 0–1 score from:

- Budget signals
- Urgency
- Problem clarity
- Authority signals (owner/founder, consultation intent)
- Session trust score

`isQualified` triggers `qualified_lead_detected` analytics and enables soft-close CTAs.

## Analytics events

| Event | When fired |
|-------|------------|
| `discovery_started` | First discovery progress on a session |
| `clarification_requested` | Clarify stage with launch context but no challenge yet |
| `product_fit_detected` | Recommendation exposed after gating passes |
| `objection_detected` | Price, timing, competitor, etc. detected |
| `objection_handled` | Visitor acknowledges objection response |
| `close_recommended` | Stage transitions to soft close |
| `qualified_lead_detected` | Lead qualification threshold met |

Events are emitted via `salesAnalyticsEvents` on consultant responses and tracked in `CatPanel`.

## Example conversations

### Flight school (required behavior)

**Visitor:** I'm thinking about starting a flight school.

**CAT (discover):** Are you launching a new school, modernizing an existing one, or still exploring the idea?

**Visitor:** Launching a new school.

**CAT (clarify):** What is your biggest challenge right now: student acquisition, operations, scheduling, instructor management, or training visibility?

**Visitor:** Student acquisition is our biggest challenge.

**CAT (recommend):** Based on what you have shared, Aviator Network is likely the best fit because it connects pilots, instructors, and training workflows in one marketplace — which supports visibility and enrollment for new schools.

---

### Price objection

**Visitor:** This sounds too expensive for us right now.

**CAT (handle_objections):** Budget is a fair and important consideration. Northbridge scopes work in structured tiers so you know timeline and cost upfront. A brief consultation can clarify whether a starter engagement or platform build is appropriate — without pressure to commit. I won't suggest spending beyond what fits your situation.

---

### Informational query (still consultative)

**Visitor:** What is Aviator Network?

**CAT (discover + teach):** Aviator Network is a Northbridge venture — a digital marketplace connecting pilots and flight instructors. It includes instructor and student profiles, marketplace search, messaging, a digital logbook, wallet and credit features, and admin dashboards. If you are evaluating fit for your situation: What industry are you in, and what prompted you to explore Northbridge today?

---

### Qualified lead soft close

**Visitor:** I'd like pricing and a consultation meeting.

**CAT (close_softly / follow_up):** If you would like to explore this further, here are appropriate next steps — no pressure. A brief consultation with Northbridge is the best way to clarify fit and timing.

## Testing

```bash
npm run test:cat
```

Key tests:

- No Aviator Network pitch on first flight-school message
- Challenge question after launch context
- Recommendation only after discovery + clarification
- Objection detection without hard-sell language
- `discovery_started` and `qualified_lead_detected` analytics

## Related docs

- [CAT Website Consultant v2](./CAT-WEBSITE-CONSULTANT-v2.md) — prior consultant iteration
- [CAT Website Assistant v1](./CAT-WEBSITE-ASSISTANT-v1.md) — original FAQ assistant
