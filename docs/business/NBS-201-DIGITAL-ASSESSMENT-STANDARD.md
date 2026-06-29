# NBS-201 — Digital Assessment Standard

**Status:** Active  
**Owner:** Northbridge Digital  
**Applies to:** `lib/digital-assessment.ts`, `components/DigitalAssessment.tsx`, `app/api/digital-assessment/route.ts`, `app/digital/assessment/page.tsx`

---

## Purpose

The Northbridge Digital Business Assessment is a mobile-first, multi-step lead-intelligence funnel. It captures structured business context, computes a **deterministic lead score server-side**, recommends a solution category, and routes internal follow-up via Slack (when configured).

This standard defines behavior, data contract, and protection rules. Implementation in the repo is the source of truth unless this document is explicitly updated alongside code changes.

---

## Funnel Entry Points

| Route | Role |
|-------|------|
| `/services` | Services hub — Northbridge Digital entry with solution cards |
| `/digital` | Full microsite positioning |
| `/digital/assessment` | Assessment UI |
| `/digital/assessment?need={value}` | Pre-selects main need from `MAIN_NEED_OPTIONS` |

Solution category cards use `lib/digital-solutions.ts` and link with `?need=` query params.

---

## Assessment Steps (9)

| # | Step ID | Title | Required |
|---|---------|-------|----------|
| 1 | `contact` | Contact info | name, email, company |
| 2 | `profile` | Business profile | employees; industry optional |
| 3 | `stage` | Business stage | businessStage |
| 4 | `need` | Main need | mainNeed |
| 5 | `systems` | Current systems | optional (multi-select) |
| 6 | `pain` | Pain points | optional (multi-select) |
| 7 | `budget` | Budget | budget |
| 8 | `timeline` | Timeline | timeline |
| 9 | `authority` | Decision authority | authority |

Progress indicator and card-style selections are required UX patterns. Step validation runs client-side for UX; **authoritative validation and scoring run server-side**.

---

## Payload Schema

Canonical type: `DigitalAssessmentPayload` in `lib/digital-assessment.ts`.

```ts
{
  name: string;
  email: string;
  phone: string;           // optional
  company: string;
  industry: string;        // optional
  employees: EmployeeValue;
  businessStage: BusinessStageValue;
  mainNeed: MainNeedValue;
  currentSystems: CurrentSystemValue[];
  painPoints: PainPointValue[];
  budget: BudgetValue;
  timeline: TimelineValue;
  authority: AuthorityValue;
}
```

Field length limits: `FIELD_LIMITS` in `lib/digital-assessment.ts`.

---

## API Contract

**Endpoint:** `POST /api/digital-assessment`

### Request

JSON body matching `DigitalAssessmentPayload`.

### Success response (200)

```json
{
  "success": true,
  "score": 72,
  "leadCategory": "Qualified Lead",
  "recommendedSolution": "Customer Acquisition System",
  "suggestedCallOpening": "Hi ..."
}
```

### Error response (400)

```json
{ "error": "Human-readable validation message" }
```

### Server behavior

1. `parseAssessmentPayload(body)`
2. `validateAssessmentPayload(payload)` — reject invalid enums and missing required fields
3. `evaluateAssessment(payload)` — deterministic score, category, recommendation, opening, evidence
4. `storeAssessmentLead(...)` — persist to Supabase when configured; **do not fail** submission if storage errors
5. Send internal team email and client confirmation via Resend when configured; **do not fail** submission if email errors
6. Send Slack notification if `SLACK_WEBHOOK_URL` is set; include **Lead ID** when stored; **do not fail** if missing or if Slack errors
7. Log channel outcomes (`persisted`, `internalEmail`, `clientEmail`, `slack`) for Vercel function logs
8. Return JSON success (unchanged public shape)

---

## Persistence and Internal Review (Stack 3)

Assessment submissions are **public**. Evidence review is **internal only**.

| Surface | Audience | Exposes score / evidence |
|---------|----------|--------------------------|
| `/digital/assessment` success UI | Prospect | No score; recommended focus only |
| `POST /api/digital-assessment` JSON | Client (analytics) | Score/category in JSON for events — **not rendered to user** |
| `digital_assessment_leads` table | Internal | Full payload, score, evidence |
| `/admin/digital-leads` | Northbridge team | Full review UI |
| Slack notification | Internal | Score, category, lead ID when stored |

### Storage

Table: `digital_assessment_leads` (see `supabase/migrations/20250622100000_digital_assessment_leads.sql`)

Stored after `evaluateAssessment()`:

- Contact fields, `answers` (jsonb), `total_score`, `lead_category`, `recommended_solution`, `suggested_call_opening`, `evidence` (jsonb), `source_path`, `status`, `internal_notes`

Setup: `docs/infrastructure/STACK-3-SUPABASE-SETUP.md`

### Failure behavior

If Supabase is unconfigured or insert fails: log warning, return current success response, continue Slack when configured.

---

## Customer-Facing Success State

After submission, the UI **must** show:

> Assessment submitted. Northbridge will review your responses and recommend the best next step.

Additional rules:

- May show **recommended focus** (solution category name) — e.g. "Customer Acquisition System"
- **Must not** show numeric lead score to the customer
- **Must not** show pricing, quotes, timelines with dollar amounts, or proposal language
- **Hot Lead / Qualified Lead** → stronger CTA to book strategy call (`/contact`)
- **Nurture Lead / Low Fit** → softer CTA to wait for review or explore resources

See `components/DigitalAssessment.tsx` success branch and `isQualifiedLead()` in `lib/digital-assessment.ts`.

---

## Internal Outputs (Slack)

When `SLACK_WEBHOOK_URL` is configured, the notification includes:

- Lead category and score
- Recommended solution
- Contact info (name, email, phone, company)
- Business info (industry, employees, stage, main need)
- Pain points and current systems
- Budget, timeline, authority
- Suggested call opening (from `buildSuggestedCallOpening`)
- Lead ID (when persisted to Supabase)

---

## Analytics Events

Tracked via `lib/analytics.ts` / `trackEvent()`:

| Event | When |
|-------|------|
| `assessment_started` | Funnel loaded |
| `assessment_step_completed` | User advances past a validated step |
| `assessment_submitted` | Successful API response |
| `assessment_qualified` | Category is Hot Lead or Qualified Lead |
| `assessment_disqualified` | Category is Nurture Lead or Low Fit |

---

## Protection Rules (NBS-201)

1. **Deterministic scoring** — Score is a pure function of payload fields in `calculateLeadScore`. No LLM, randomness, or client-side override.
2. **Server authority** — API recomputes score and category on every submission; never trust client-supplied score.
3. **No auto-quotes** — Assessment output is diagnostic and directional only. Quotes require human review (see `CALL-OPENING-PLAYBOOK.md`).
4. **AI boundary (future)** — AI may rephrase call openings or summarize Slack payloads for internal use; it must not change score, category, or recommended solution without a code change to `lib/digital-assessment.ts`.
5. **Enum safety** — Only values defined in option constants are accepted; unknown values fail validation.

---

## Related Documents

- `NORTHBRIDGE-DIGITAL-SERVICE-TAXONOMY.md` — solution mapping
- `LEAD-QUALIFICATION-RULES.md` — scoring tables
- `CALL-OPENING-PLAYBOOK.md` — follow-up scripts
- `AGENTS.md` — repo-level rules for agents and contributors

---

## Change Control

Any change to steps, enums, scoring weights, category thresholds, or success-state copy requires:

1. Code change in canonical `lib/` files
2. Update to this document and affected business docs
3. `npm run lint` and `npm run build` passing
