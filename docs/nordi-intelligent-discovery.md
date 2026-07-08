# Nordi Intelligent Business Discovery

This document describes how the Nordi homepage performs deterministic business discovery without an LLM, using the existing NEO runtime and discovery engine.

## Overview

The homepage (`app/(home)/page.tsx`) renders `HomeConversation`, which sends every customer message to the NEO client with `currentModule: "homepage"`. The mock/local NEO provider routes homepage traffic to `processDiscoveryMessage()` in `lib/cat/discovery-engine.ts`.

No product cards, pricing, or specialist catalog appear on the homepage. The conversation is the product.

## Conversation flow

1. **Introduction** — Nordi types the fixed opening script (trust-first, no sales language).
2. **Persistent actions** — About Northbridge, Save Conversation, and Request a Call remain visible in the chat header area.
3. **Natural input** — The customer describes their business in free text (e.g. dental office, HVAC company, flight school, two restaurants).
4. **Industry detection** — The discovery engine extracts industry, team size, locations, and communication channels from each message.
5. **Dynamic follow-ups** — Industry-specific questions are selected from `lib/cat/industry-questions.ts` based on detected industry and questions not yet answered.
6. **Website permission** — After at least two industry-specific answers (or when industry questions are exhausted), Nordi asks: *"Would you like me to take a quick look at your public website while we continue?"*
7. **Website analysis** — If accepted, the customer pastes a URL. Nordi immediately posts *"Analyzing website…"* and calls `POST /api/website-analyze` in the background while the conversation continues.
8. **Findings** — When analysis completes, Nordi returns observation-only bullet findings via `formatWebsiteFindings()`. No products are mentioned.
9. **Support areas** — After sufficient context, Nordi may say: *"Based on what I've learned so far, I have high confidence these areas could benefit from additional support."* This is not a product recommendation.

## Discovery engine integration

| File | Role |
|------|------|
| `lib/cat/discovery-engine.ts` | Main state machine: message parsing, question selection, website permission, support-area framing |
| `lib/cat/industry-questions.ts` | Question bank keyed by industry (dental, HVAC, aviation, hospitality, healthcare, general) |
| `lib/cat/discovery-types.ts` | Profile schema: answered questions, discovery answers, website permission flags |
| `lib/cat/profile-confidence.ts` | Computes live Business Profile card fields and industry confidence |
| `lib/neo/mock-client.ts` | Routes `currentModule: "homepage"` to the discovery engine |
| `lib/neo/providers/local-provider.ts` | Bypasses remote CAT for homepage; uses mock discovery engine |

### Question selection

Questions are **not** hardcoded conversation trees. The engine:

- Detects industry from natural language
- Loads matching entries from `INDUSTRY_QUESTION_BANK`
- Skips questions whose `id` is in `profile.answeredQuestions`
- Stores the pending question id and records the next user reply as the answer

Examples:

- **Dental** — online booking, provider count, appointment reminders
- **HVAC** — technician count, scheduling method, emergency service
- **Aviation** — instructor count, scheduling software, online student booking

## Website analysis integration

| File | Role |
|------|------|
| `app/api/website-analyze/route.ts` | Server route; fetches public HTML and runs analysis |
| `lib/cat/website-analysis.ts` | Parses HTML for services, booking flows, contact methods, Google Business links, etc. |
| `formatWebsiteFindings()` | Formats observation bullets for Nordi to speak naturally |

Analysis runs **only after explicit permission**. The customer is never blocked waiting; Nordi posts progress immediately and continues asking discovery questions when appropriate.

## Updated homepage experience

| Component | Role |
|------|------|
| `components/home/NordiHeader.tsx` | Top-centered NORDI wordmark + burger menu |
| `components/home/HomeConversation.tsx` | Chat orchestration, NEO calls, website analysis UX |
| `components/home/BusinessProfileCard.tsx` | Live-updating Business / Employees / Locations / Website / Industry Confidence |
| `components/home/NordiAvatar.tsx` | Nordi message avatar (not public CAT branding) |

### Business Profile card

The card appears once discovery begins and updates on every profile change:

- **Business** — detected industry label
- **Employees** — extracted team size
- **Locations** — extracted location count (defaults to 1 when industry is known)
- **Website** — Not connected / Analyzing / Connected
- **Industry Confidence** — Learning → Medium → High → Very High

## Validation

```bash
npm run lint
npm run build
```

## Design principles

- Conversation remains primary; the profile card supports, never replaces, the chat.
- Website analysis feels seamless but always follows permission.
- Observations only during discovery — no *"You need these products."*
- Specialists and workforce recommendations are introduced only in later phases (Operations Center / hire flow), not on the homepage.
