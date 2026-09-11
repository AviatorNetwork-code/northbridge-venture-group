# NVG Website Architecture

Canonical public-site architecture for Northbridge Venture Group after the Nordy 2.0 upgrade.

## Positioning

Northbridge Venture Group is the front door for:

1. Northbridge Ventures
2. Northbridge Engineering & AI
3. Northbridge Digital
4. Northbridge Operating Ventures (understated until public-ready)

NEO is **not** a commercial division. NEO is the shared engineering, intelligence, learning, capability, governance, and project-connection layer underneath Northbridge.

## Information architecture

| Route | Role |
| --- | --- |
| `/` | Marketing homepage + three intent cards + Nordy host |
| `/about` | Who we are |
| `/ventures` | Verified portfolio (Aviation first) |
| `/engineering-ai` | Premium systems / AI services |
| `/digital` | Predictable-scope Digital offerings |
| `/mobile-apps` | Mobile App Launch product |
| `/capabilities` | Capability index |
| `/contact` | Contact / handoff |
| `/portfolio` → `/ventures` | Legacy redirect |
| `/services` → `/capabilities` | Legacy redirect |

Operations routes under `/operations/*` remain product surfaces (`noindex`).

## Homepage conversion model

1. Hero — “Northbridge builds companies, software, and intelligent systems.”
2. Three primary intent cards:
   - Explore Northbridge
   - Engineering & AI → Nordy `entryPath=ENGINEERING_AI`
   - Northbridge Digital → Nordy `entryPath=DIGITAL`
3. Capability proof, ventures, division sections, process, why Northbridge, final CTA

## Visual system

- Brand tokens: `lib/brand/tokens.ts`
- Illumination hierarchy: L0–L3 via `.illum-l*` in `app/globals.css`
- Components: `IlluminatedButton`, `IntentCard`, `NordyLauncher`, `NordyHost`
- Motion respects `prefers-reduced-motion`
- Typography: Manrope + Source Serif 4 (not Inter)

## Analytics

First-party event adapter in `lib/nordy/analytics.ts` with PostHog passthrough when `window.posthog` exists. Events include homepage/intent/Nordy qualification signals.

## SEO

Root metadata, Open Graph, Twitter cards, `robots.ts`, `sitemap.ts`, Organization JSON-LD.

## Related docs

- `docs/architecture/NORDY-NEO-INTEGRATION.md`
- `docs/architecture/NORDY-INTAKE-AND-LEARNING.md`
- Canonical NEO doctrine remains owned by the NEOS repository.
