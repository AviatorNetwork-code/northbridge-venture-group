# Lead Qualification Rules

**Status:** Active  
**Source of truth:** `lib/digital-assessment.ts` — `calculateLeadScore`, `getLeadCategory`, `isQualifiedLead`

Scoring is **deterministic** and **server-side only**. The same payload always produces the same score and category.

---

## Lead Categories

| Score range | Category | Internal meaning | Customer-facing treatment |
|-------------|----------|------------------|---------------------------|
| 80+ | **Hot Lead** | Strong fit — prioritize outreach | Strong strategy-call CTA on success screen |
| 55–79 | **Qualified Lead** | Good fit — schedule discovery | Strong strategy-call CTA on success screen |
| 30–54 | **Nurture Lead** | Potential — review before outreach | Soft follow-up CTA; no score shown |
| Under 30 | **Low Fit** | Weak fit or misaligned constraints | Soft follow-up CTA; no score shown |

`isQualifiedLead(category)` returns `true` for Hot Lead and Qualified Lead only.

**Customer-facing rule:** Never display category names or numeric scores in the assessment UI. Categories are for Slack, CRM, and internal playbooks.

---

## Scoring Model

Starting score: **0**. Sum applicable components below.

### Budget (`budget`)

| Value | Label | Points |
|-------|-------|--------|
| `10000-plus` | $10,000+ | +25 |
| `5000-10000` | $5,000 – $10,000 | +18 |
| `2500-5000` | $2,500 – $5,000 | +10 |
| `under-2500` | Under $2,500 | **-15** |

### Decision authority (`authority`)

| Value | Label | Points |
|-------|-------|--------|
| `owner-founder` | Owner / founder | +20 |
| `executive` | Executive | +15 |
| `manager` | Manager | +8 |
| `not-decision-maker` | Not the decision maker | **-10** |

### Timeline (`timeline`)

| Value | Label | Points |
|-------|-------|--------|
| `asap` | ASAP | +20 |
| `30-days` | Within 30 days | +15 |
| `60-90-days` | 60–90 days | +8 |
| `researching` | Just researching | +0 |

### Team size (`employees`)

| Value | Label | Points |
|-------|-------|--------|
| `10+` | 10+ employees | +15 |
| `5-9` | 5–9 employees | +10 |
| `1-4` | 1–4 employees | +3 |

### Pain points (`painPoints`)

| Condition | Points |
|-----------|--------|
| At least one pain point selected | +15 |
| Three or more pain points selected | +10 (stacks with above) |

### Systems gap (`currentSystems`)

| Condition | Points |
|-----------|--------|
| Any of: `no-crm`, `no-analytics`, `manual-spreadsheets`, `disconnected-tools` | +10 |

**Not scored directly:** `businessStage`, `mainNeed`, `industry`, contact fields. These inform recommendation and call prep, not the numeric score.

---

## Recommended Solution (Separate from Score)

`getRecommendedSolution(payload)` maps `mainNeed` → solution category. **Score does not change the recommended solution.**

See `NORTHBRIDGE-DIGITAL-SERVICE-TAXONOMY.md` for the mapping table.

---

## Qualification Workflow

```
Assessment submitted
        ↓
Server validates payload
        ↓
calculateLeadScore(payload)
        ↓
getLeadCategory(score)
        ↓
getRecommendedSolution(payload)
        ↓
buildSuggestedCallOpening(payload)
        ↓
Slack notification (if configured) + API JSON response
        ↓
Client shows success UI (no score; qualified vs nurture CTAs)
```

---

## Analytics Mapping

| Event | Trigger |
|-------|---------|
| `assessment_qualified` | `leadCategory` ∈ { Hot Lead, Qualified Lead } |
| `assessment_disqualified` | `leadCategory` ∈ { Nurture Lead, Low Fit } |

---

## AI and Future Automation Boundaries

- **Allowed (future):** Summarize assessment responses for Slack/CRM; suggest alternate call-opening phrasing for human edit
- **Not allowed:** LLM-adjusted scores; dynamic category thresholds; auto-generated quotes or pricing; bypassing `validateAssessmentPayload`
- **Quotes:** Always require human review before client delivery

---

## Example Score Calculation

Payload:

- Budget: $10,000+ (+25)
- Authority: Owner/founder (+20)
- Timeline: ASAP (+20)
- Employees: 10+ (+15)
- Pain points: 3 selected (+15 +10)
- Systems: no-crm selected (+10)

**Total: 115 → Hot Lead**

---

## Change Control

Scoring weights and category thresholds live in `lib/digital-assessment.ts`. Changes require:

1. Code update
2. Update to this document
3. Regression check via `npm run build`

Do not duplicate scoring logic in client components or external services without importing the canonical functions.
