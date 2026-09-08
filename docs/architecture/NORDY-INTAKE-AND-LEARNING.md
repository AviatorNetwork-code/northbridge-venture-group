# Nordy Intake and Learning

## Intake modes

### Engineering & AI (`entryPath=ENGINEERING_AI`)

Conversational discovery of business, industry, problem, workflows, systems, people, impact, outcome, integrations, urgency, budget range, security concerns, and whether Digital is a better fit.

### Digital (`entryPath=DIGITAL`)

Discovery of product type, features, screens, branding, integrations, auth, payments, platforms, timeline, budget range, and classification:

- `DIGITAL_FAST_PATH`
- `DIGITAL_CUSTOM`
- `ESCALATE_ENGINEERING_AI`
- `NOT_FIT`

### Mobile Apps (`entryPath=MOBILE_APPS`)

Mobile-focused Digital intake — audience, day-one job, features, platforms, and launch window.

### Capabilities / Home / Ventures / Explore

Capability discovery and company Q&A. Ventures and Explore avoid forced qualification.

## Lead output

Structured opportunity object (`NordyLeadOpportunity`) with optional fields. Missing fields are allowed.

## Learning (CAP-LEARN-001)

`lib/nordy/learning-emitter.ts` emits governed evidence per meaningful turn:

- agent, project, environment
- intent, route, entry path
- AI escalation + gap class
- retrieval/tool path
- result / correction / outcome
- reusable-gap classification

**No raw transcript persistence by default.**

**Production emit:** gated OFF unless `NORDY_PRODUCTION_LEARNING_EMIT=true`.

AI gap classes include `KNOWLEDGE_MISSING`, `CAPABILITY_UNKNOWN`, `INTENT_AMBIGUOUS`, `AI_REQUIRED_FOR_REASONING`, `PORTFOLIO_CONTEXT_MISSING`, `RETRIEVAL_MISS`.

## Training readiness

Interactions may become training candidates only after capture → validation → privacy filtering → curation → dedupe → evaluation.

**MODEL TRAINING: DISABLED / NOT AUTHORIZED**

## Privacy

Public chat must not casually persist passwords, tokens, financial credentials, auth secrets, unnecessary PII, or confidential portfolio details into learning evidence.

## Weekly agent improvement

Evidence shape is compatible with future NEO weekly agent review. Do not build a second weekly-review system inside the website repo.
