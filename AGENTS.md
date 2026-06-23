# Northbridge Venture Group — Repository Operating System

This repository is the Northbridge Venture Group marketing site and Northbridge Digital lead-intelligence funnel. Keep changes focused, professional, and production-minded.

**Stack 1 scope:** repo operating system, information architecture, and assessment protection.  
**Stack 3 scope:** assessment lead persistence and internal admin review (Supabase + protected `/admin` routes).  
**Stack 4 scope:** admin usability (filters, workflow status, call prep), production checklist, public smoke tests.

Do not add MCP, SurveyJS, Refine, OpenAI Agents unless explicitly requested in a later stack.

---

## Information Architecture

| Surface | Meaning | Primary routes | Source of truth |
|---------|---------|----------------|-----------------|
| **Ventures** | Northbridge-owned products and platforms only | `/ventures`, home ventures section | `lib/ventures.ts` |
| **Services** | Northbridge Digital client offerings | `/services` | `app/services/page.tsx`, `lib/digital-solutions.ts` |
| **Digital microsite** | Full Northbridge Digital positioning | `/digital` | `app/digital/page.tsx` |
| **Assessment** | Lead-intelligence funnel | `/digital/assessment` | `components/DigitalAssessment.tsx`, `lib/digital-assessment.ts` |
| **Clients** | Organizations Northbridge has served | `/clients` | `lib/clients.ts` |

### Ventures vs Services (non-negotiable)

- **Ventures** = owned/internal products (e.g. Aviator Network, Quadrix, AirTax Financial, Future Ventures).
- **Services** = Northbridge Digital — customer acquisition, operations, visibility, custom software, and launch systems for client organizations.
- **Never** list Northbridge Digital as a venture card. Client services belong under Services and `/digital`.
- Coming-soon ventures use `comingSoon: true` in `lib/ventures.ts` and render as non-link cards.

---

## Stack

- Next.js 14 App Router under `app/`
- TypeScript with strict typing
- Tailwind CSS — follow existing `nb-*` utility patterns
- Shared UI in `components/`; shared data and business logic in `lib/`
- API routes under `app/api/`

---

## Business Documentation (read before changing assessment or Digital)

| Document | Purpose |
|----------|---------|
| `docs/business/NBS-201-DIGITAL-ASSESSMENT-STANDARD.md` | Assessment funnel standard, steps, API contract, protection rules |
| `docs/business/NORTHBRIDGE-DIGITAL-SERVICE-TAXONOMY.md` | Solution categories, recommended solutions, customer vs internal language |
| `docs/business/LEAD-QUALIFICATION-RULES.md` | Deterministic scoring, lead categories, qualification thresholds |
| `docs/business/CALL-OPENING-PLAYBOOK.md` | Internal call scripts by lead category and recommended solution |
| `docs/infrastructure/STACK-3-SUPABASE-SETUP.md` | Supabase migration and env setup for lead persistence |
| `docs/infrastructure/STACK-4-PRODUCTION-CHECKLIST.md` | Pre-deploy env, migrations, smoke tests |

When assessment scoring, recommendation logic, or customer-facing copy changes, update the corresponding business doc in the same PR.

---

## Digital Assessment — Protection Rules

The assessment is a **deterministic, server-side** lead-intelligence system. Treat `lib/digital-assessment.ts` as canonical.

### Must preserve

1. **Server-side scoring** — `calculateLeadScore`, `getLeadCategory`, and `getRecommendedSolution` run in `app/api/digital-assessment/route.ts`. Client code must not be the source of truth for score or category.
2. **No client-facing quotes or pricing** — Success UI shows recommended *focus area* only (e.g. "Customer Acquisition System"), never dollar amounts, line items, or proposals.
3. **Human-reviewed quotes** — Any future quote or proposal generation requires explicit human review before delivery. AI may summarize assessments and draft call openings; it must not auto-send quotes.
4. **Slack is optional** — Missing `SLACK_WEBHOOK_URL` logs a warning and returns success. Do not fail submissions when Slack is unconfigured.
5. **Validation** — Required fields and enum values are validated server-side via `validateAssessmentPayload`.
6. **Public vs internal** — Assessment submission is public; score, category, evidence, and internal notes are for Slack, Supabase, and `/admin` only. Never render evidence or numeric score in the assessment UI.
7. **Persistence optional** — Missing Supabase credentials must not block successful assessment submission.

### Safe extension patterns (future stacks)

- Add analytics, CRM export, or AI summarization **after** server-side score/category are computed — never replace them.
- Mirror scoring rules in tests that import `lib/digital-assessment.ts` directly.
- Keep customer-facing labels in option constants; use internal diagnostic terms only in Slack, playbooks, and internal docs.

### Do not (without explicit approval)

- Move scoring to the client or an LLM
- Expose raw lead scores to customers
- Auto-generate or auto-send pricing proposals
- Add SurveyJS, Refine admin, or MCP tools without explicit approval

---

## Stack 3 — Lead Persistence

- Table: `digital_assessment_leads` — migration in `supabase/migrations/`
- Server library: `lib/digital-assessment-leads.ts`, `lib/supabase/server.ts`
- Admin routes: `/admin/digital-leads`, `/admin/digital-leads/[id]`, `/admin/login`
- Auth: `ADMIN_ACCESS_TOKEN` cookie session via `middleware.ts` (TODO: replace with SSO)
- Env: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_ACCESS_TOKEN`
- Setup guide: `docs/infrastructure/STACK-3-SUPABASE-SETUP.md`

---

## Stack 4 — Admin Usability and Deployment

- Admin filters: status, lead category, recommendation, search (name/company/email)
- Workflow statuses: `new`, `reviewed`, `contacted`, `proposal_needed`, `proposal_sent`, `closed_won`, `closed_lost`
- Call Prep section on lead detail with copy-opening button
- Public smoke: `npm run smoke:public` (requires running server)
- Checklist: `docs/infrastructure/STACK-4-PRODUCTION-CHECKLIST.md`

### Deployment rules

- **Public taxonomy smoke tests must pass** before reporting production readiness (`npm run smoke:public` against staging or production URL).
- **Admin lead data is internal-only** — never expose score, category, evidence, or internal notes in public routes or assessment UI.
- **Shared-token admin auth is temporary** — do not reuse for client portals; replace with SSO or Supabase Auth before broad team access.

---

## Brand And Design

- Palette: Black `#000000`, White `#ffffff`, Deep red `#B11226`
- Professional, enterprise tone — no gimmicky or overly promotional language
- Clean, restrained layouts appropriate for a venture group and client-services brand

---

## Contact Form

- Posts to `app/api/contact/route.ts`
- Email via Resend (`RESEND_API_KEY`, `RESEND_FROM_EMAIL`; optional `CONTACT_TO_EMAIL`)
- Never expose secrets in client code, user-facing logs, commits, or rendered pages
- Return success only when email delivery is confirmed (or deliberate fallback is logged)

---

## Digital Assessment API

- `POST /api/digital-assessment` — validates payload, evaluates server-side, persists when Supabase configured, notifies Slack when configured
- Env: `SLACK_WEBHOOK_URL` (optional), `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (optional persistence)
- Implementation: `app/api/digital-assessment/route.ts`

---

## Analytics

- `lib/analytics.ts` — `trackEvent()` pushes to `window.dataLayer` when present
- Assessment events: `assessment_started`, `assessment_step_completed`, `assessment_submitted`, `assessment_qualified`, `assessment_disqualified`

---

## Deployment

- Deployed on Vercel
- Compatible with Next.js App Router conventions
- Do not depend on local-only files or uncommitted env for production behavior

---

## Verification

- Run `npm run lint` when TypeScript, React, routing, or styling changes
- Run `npm run build` before reporting production readiness
- Report clearly if verification cannot be run

---

## Safety

- Do not commit secrets or generated credentials
- Do not print secret values while debugging
- Keep changes limited to requested scope
- Do not change deployment settings, environment variables, or external integrations unless explicitly asked
