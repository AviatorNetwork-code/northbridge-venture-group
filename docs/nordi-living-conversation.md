# Nordi Living Conversation Experience (NB-WEB-NORDI-004)

Nordi should feel like someone is actively thinking with you — not an instant-response chatbot.

## Overview

This milestone improves conversation quality without adding business capabilities, specialists, or product sales. It builds on [Persistent Business Relationship](./nordi-persistent-relationship.md).

## Architecture

```
lib/nordi/
  thinking-states.ts        # Deterministic thinking phases (300–1200 ms)
  human-language.ts         # Natural acknowledgments and transitions
  confidence.ts             # Confidence levels + reasons
  cards.ts                  # Observation / insight card builders
  conversation-presenter.ts # Progressive delivery sequences

components/home/
  NordiThinkingIndicator.tsx
  NordiMessageBubble.tsx
  NordiObservationCard.tsx
  NordiInsightCard.tsx
  NordiSnapshotCard.tsx
  CatTypewriter.tsx         # Variable typing speed
```

The **discovery engine** produces structured results (`thinkingContext`, `progressiveReply`, `cards`). The **presenter** converts those into timed UI sequences. UI remains separate from discovery logic.

## Thinking states

Deterministic labels selected from context:

| Context | Example labels |
|---------|----------------|
| `general` | Thinking…, One moment… |
| `reviewing-business` | Reviewing your business… |
| `analyzing-shared` | Analyzing what you've shared… |
| `comparing` | Comparing this with similar businesses… |
| `website` | Reviewing your website… |
| `preparing` | Preparing observations… |

Duration is seeded from `sessionId + messageIndex` (300–1200 ms). Never random in the LLM sense — reproducible per session.

## Progressive responses

Long or transitional replies split into natural beats:

```
Thinking…
→ I noticed something.
→ Before I explain…
→ [Question]
```

The presenter inserts brief pauses between segments. Website analysis uses a dedicated multi-step sequence with observation cards.

## Observation cards

After website review, Nordi may show:

- **Observation card** — website found, services count, booking, contact form, Google Business
- **Conversation Insight card** — top signal with confidence + reason

Cards appear inline in the conversation — not as a dashboard.

## Confidence standard

Every insight card includes:

- **Confidence** — Very High / High / Medium / Low
- **Why?** — explicit reason (e.g. *Only website evidence is available*)

Confidence never overstates certainty.

## Human conversation

Discovery engine acknowledgments rotate deterministically:

- "That helps."
- "Perfect."
- "One more thing."
- "I think I'm beginning to understand your business."

Robotic transitions like "Next question" are avoided.

## Typing

`CatTypewriter` uses per-message speed (12–22 ms/char) and short pauses after punctuation — seeded from message ID for consistency.

## Validation

```bash
npm run lint
npm run build
```

## Success criteria

A customer should leave thinking: *"This feels like someone is actually working with me."*

Not: *"This is another chatbot."*
