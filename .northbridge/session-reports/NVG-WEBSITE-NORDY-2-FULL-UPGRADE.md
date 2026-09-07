# NVG Website + Nordy 2.0 Full Upgrade — Session Report

## Status

`NVG_WEBSITE_NORDY_UPGRADE_DRAFT_READY_FOR_FOUNDER_REVIEW`

`NEO_LIVE_CROSS_REPO_VERIFICATION_PENDING`

## A. Starting site

Conversation-first homepage (`HomeConversation` / Nordi product surface). Marketing pages positioned Northbridge Digital + Nordi as flagship. Nav: About, Services, Ventures(`/portfolio`), Products, Contact. `/digital` redirected to `/`. No three-card intent system. No PostHog marketing analytics. No sitemap/robots. Nordi discovery was deterministic homepage conversation without Engineering/Digital entryPath intake.

## B. Strategy applied

Approved prompt strategy supersedes conversation-only homepage doctrine. Implemented KEEP→CONNECT→EXTEND: retained Nordi brand, discovery packages, learning consent infrastructure, NEO client adapters; replaced public homepage with marketing three-card architecture; extended Nordy 2.0 intake as overlay launcher.

## C. Visual system

Illumination L0–L3, illuminated buttons, intent cards, hero atmosphere, restrained border sweep, Manrope/Source Serif, premium dark technology aesthetic (not neon/game).

## D. Three-card architecture

Explore / Engineering & AI / Digital cards on homepage with analytics hooks and Nordy entryPath launch.

## E. Ventures

`/ventures` with Aviation sector (Aviator Network, AirTax Financial) + Digital venture. No empty Games/Logistics/Technology categories. Quadrix answered cautiously (not over-claimed).

## F. Engineering & AI

Dedicated `/engineering-ai` outcomes page + offer model (no invented pricing).

## G. Digital

Dedicated `/digital` (redirect removed) — speed/quality/predictable scope.

## H. Mobile App Launch

`/mobile-apps` with fast-path scope and App Store timing disclaimer.

## I. Nordy architecture

`lib/nordy/*` presentation, engine, knowledge, capability registry, continuity, AI adapter, learning emitter, analytics, environment, NEO retrieval boundary, launcher UI.

## J. Company knowledge

Public verified Q&A set with classification tags; INTERNAL_ONLY refused.

## K. AI escalation

`@northbridge/platform-ai` mock completion port; gap classes emitted.

## L. Conversation continuity

Multi-turn fact merge without re-asking known HVAC/booking/payments context.

## M. Learning

CAP-LEARN-001 emitter; no raw transcripts by default.

## N. Training readiness

`TRAINING_AUTHORIZED = false`

## O. Privacy

Sensitive probe refusal; generalized learning evidence.

## P. Analytics

First-party event bus + PostHog passthrough if present.

## Q. SEO

Metadata, OG/Twitter, robots, sitemap, Organization JSON-LD.

## R. Performance

CSS illumination preferred over heavy animation libs; homepage JS modest (~106kB first load).

## S. Tests

- `lib/nordy/engine.test.ts`
- `lib/nordy/regression.test.ts` (100-turn suite)
- Full vitest: **302 passed**
- Lint: pass (1 pre-existing warning)
- Build: pass (`typescript.ignoreBuildErrors` for PRE_EXISTING NDP debt)

## T. Screenshots

Captured during visual QA after draft PR.

## U. Preview

Automatic preview via PR; Nordy environment resolver maps Vercel preview → `PREVIEW`.

## V. NEO connectivity

`NEO_LIVE_CROSS_REPO_VERIFICATION_PENDING` — local stub `@northbridge/operations-intelligence` when sibling NEOS path absent.

## W. Branch / PR

Branch: `cursor/nvg-website-nordy-2-completion-440f`  
HEAD: `fb626cf`  
Draft PR: https://github.com/AviatorNetwork-code/northbridge-venture-group/pull/21

## X. Remaining blockers

1. Live NEO GitHub App / cross-repo E2E
2. PRE_EXISTING NDP TypeScript debt (~48 errors) gated via next.config
3. Real CRM lead persistence still mailto/local patterns
4. PostHog not wired with API key (adapter ready)
5. Quadrix public evidence still limited — cautious answers only
