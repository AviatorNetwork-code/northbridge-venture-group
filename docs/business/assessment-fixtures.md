# Assessment Deterministic Fixtures

**Purpose:** Manual regression reference for `lib/assessment/` rule engine parity.  
**No test runner** is configured in this repo; use these fixtures when validating changes.

All expected outputs are produced by `evaluateAssessment(payload)` unless noted.

---

## Fixture 1 — Hot Lead (maximum pain + systems gap)

```json
{
  "name": "Alex Rivera",
  "email": "alex@example.com",
  "phone": "555-0100",
  "company": "Rivera HVAC",
  "industry": "HVAC",
  "employees": "10+",
  "businessStage": "growing",
  "mainNeed": "more-customers",
  "currentSystems": ["no-crm", "manual-spreadsheets"],
  "painPoints": ["lead-follow-up", "manual-work", "poor-online-presence"],
  "budget": "10000-plus",
  "timeline": "asap",
  "authority": "owner-founder"
}
```

| Output | Expected |
|--------|----------|
| `totalScore` | **115** |
| `category` | Hot Lead |
| `recommendation` | Customer Acquisition System |
| `evidence.length` | 7 |

### Evidence breakdown

| ruleId | inputField | points |
|--------|------------|--------|
| SCORE_BUDGET | budget | +25 |
| SCORE_AUTHORITY | authority | +20 |
| SCORE_TIMELINE | timeline | +20 |
| SCORE_EMPLOYEES | employees | +15 |
| SCORE_PAIN_AT_LEAST_ONE | painPoints | +15 |
| SCORE_PAIN_THREE_OR_MORE | painPoints | +10 |
| SCORE_SYSTEMS_GAP | currentSystems | +10 |

### Call opening (prefix)

> Hi Alex Rivera, I reviewed your assessment. It looks like Rivera HVAC is mainly dealing with leads fall through the cracks.

---

## Fixture 2 — Qualified Lead

```json
{
  "name": "Jordan Lee",
  "email": "jordan@example.com",
  "phone": "",
  "company": "Lee Consulting",
  "industry": "Professional services",
  "employees": "5-9",
  "businessStage": "established",
  "mainNeed": "improve-operations",
  "currentSystems": [],
  "painPoints": ["manual-work"],
  "budget": "5000-10000",
  "timeline": "30-days",
  "authority": "executive"
}
```

| Output | Expected |
|--------|----------|
| `totalScore` | **73** |
| `category` | Qualified Lead |
| `recommendation` | Operations & Automation |
| `evidence.length` | 5 |

### Evidence breakdown

| ruleId | points |
|--------|--------|
| SCORE_BUDGET | +18 |
| SCORE_AUTHORITY | +15 |
| SCORE_TIMELINE | +15 |
| SCORE_EMPLOYEES | +10 |
| SCORE_PAIN_AT_LEAST_ONE | +15 |

---

## Fixture 3 — Nurture Lead

```json
{
  "name": "Sam Patel",
  "email": "sam@example.com",
  "phone": "",
  "company": "Patel Design",
  "industry": "Design",
  "employees": "1-4",
  "businessStage": "launching",
  "mainNeed": "better-visibility",
  "currentSystems": [],
  "painPoints": ["no-visibility"],
  "budget": "2500-5000",
  "timeline": "60-90-days",
  "authority": "manager"
}
```

| Output | Expected |
|--------|----------|
| `totalScore` | **44** |
| `category` | Nurture Lead |
| `recommendation` | Business Intelligence |
| `evidence.length` | 5 |

### Evidence breakdown

| ruleId | points |
|--------|--------|
| SCORE_BUDGET | +10 |
| SCORE_AUTHORITY | +8 |
| SCORE_TIMELINE | +8 |
| SCORE_EMPLOYEES | +3 |
| SCORE_PAIN_AT_LEAST_ONE | +15 |

---

## Fixture 4 — Low Fit (budget penalty + non-decision-maker)

```json
{
  "name": "Casey Morgan",
  "email": "casey@example.com",
  "phone": "",
  "company": "Morgan Retail",
  "industry": "Retail",
  "employees": "1-4",
  "businessStage": "idea",
  "mainNeed": "not-sure",
  "currentSystems": ["basic-website"],
  "painPoints": [],
  "budget": "under-2500",
  "timeline": "researching",
  "authority": "not-decision-maker"
}
```

| Output | Expected |
|--------|----------|
| `totalScore` | **-22** |
| `category` | Low Fit |
| `recommendation` | Business Systems Review |
| `evidence.length` | 4 |

### Evidence breakdown

| ruleId | points |
|--------|--------|
| SCORE_BUDGET | -15 |
| SCORE_AUTHORITY | -10 |
| SCORE_TIMELINE | 0 |
| SCORE_EMPLOYEES | +3 |

### Call opening (no pain points — falls back to main need)

> ...mainly dealing with i'm not sure.

---

## Fixture 5 — Recommendation mapping (score-independent)

| mainNeed | recommendation |
|----------|----------------|
| starting-business | Launch System |
| more-customers | Customer Acquisition System |
| improve-operations | Operations & Automation |
| better-visibility | Business Intelligence |
| custom-software | Custom Software |
| not-sure | Business Systems Review |

---

## Category thresholds

| Score | category |
|-------|----------|
| ≥ 80 | Hot Lead |
| 55–79 | Qualified Lead |
| 30–54 | Nurture Lead |
| < 30 | Low Fit |

---

## API response parity (client-visible)

`POST /api/digital-assessment` must continue returning:

```json
{
  "success": true,
  "score": 76,
  "leadCategory": "Qualified Lead",
  "recommendedSolution": "Operations & Automation",
  "suggestedCallOpening": "Hi ..."
}
```

`evidence[]` is **internal only** — not exposed in the API response or assessment UI.

---

## Validation errors (unchanged)

| Condition | error |
|-----------|-------|
| Missing name | Full name is required. |
| Invalid email | Enter a valid email address. |
| Missing company | Company name is required. |
| Invalid enum | Select a team size. / Select a business stage. / etc. |
