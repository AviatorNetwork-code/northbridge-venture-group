# Nordi Persistent Business Relationship (NB-WEB-NORDI-003)

Nordi remembers returning visitors and treats each conversation as an ongoing relationship — not a one-off website session.

## Overview

This milestone builds on [Intelligent Business Discovery](./nordi-intelligent-discovery.md) by adding:

- **Save Conversation** — Nordi-led flow with email or phone identity and optional mock verification
- **Returning customer experience** — natural welcome-back and resume messaging
- **Persistence abstraction** — storage decoupled from UI, ready for future NEO sync
- **Living Business Summary** — richer profile card with relationship metadata

This is **relationship continuity**, not authentication. Verification is optional and mocked for now.

## Architecture

```
components/home/
  HomeConversation.tsx      # UI orchestration
  SaveConversationCard.tsx  # Identity capture + verification
  BusinessSummaryCard.tsx   # Living business summary

lib/nordi/
  storage.ts                # NordiStorageAdapter + LocalNordiStorage
  identity.ts               # Customer identity + mock OTP provider
  conversation-memory.ts    # Memory model, milestones, versioning
  relationship.ts           # Welcome-back, resume, relationship language
  index.ts                  # Public exports
```

### Storage abstraction

`NordiStorageAdapter` defines `load`, `save`, and `clear`. The default implementation is `LocalNordiStorage`, which persists to `localStorage` under `northbridge-nordi-relationship`.

To migrate to NEO later:

```typescript
import { setNordiStorage } from "@/lib/nordi/storage";

setNordiStorage(new NeoNordiStorage(neoClient));
```

UI code continues to call `getNordiStorage()` — no component changes required.

Legacy sessions stored under `northbridge-home-cat` are automatically migrated on first load.

### Conversation memory

`NordiConversationMemory` persists:

| Field | Purpose |
|-------|---------|
| `profile` | Full discovery profile (industry, employees, website analysis, answers) |
| `identity` | Email or phone + verification status |
| `messages` | Conversation transcript |
| `milestones` | Relationship progress markers |
| `knownSince` | When Nordi first learned about this business |
| `lastUpdated` | Last activity timestamp |
| `saved` | Whether the customer completed save flow |

Milestones are derived automatically from profile state:

- `business_identified`
- `website_reviewed`
- `profile_completed`
- `appointment_workflow_discussed`
- `conversation_saved`

## Save Conversation flow

1. Customer taps **Save Conversation**
2. Nordi asks whether to save so they can continue anytime
3. Customer chooses **Email** or **Phone Number**
4. Customer enters contact details
5. Nordi asks: *Would you like to secure future access with a verification code?*
6. **Send Code** → mock 6-digit OTP (replaceable via `NordiVerificationProvider`)
7. **Skip for now** → identity saved without verification

## Returning customer experience

When stored memory exists:

- Messages and profile are restored
- Profile is marked `isReturningVisitor`
- Nordi sends a single welcome-back message:
  - With saved identity: contextual recap (*"Last time we discussed your dental office and appointment scheduling."*)
  - Without identity: milestone-based resume (*"Website reviewed • Business profile completed"*)
- Discovery engine skips already-answered questions and uses relationship language (*"I already know a little about your business."*)

## Business Summary

The secondary **Business Summary** card shows:

- Business type
- Employees
- Locations
- Website status
- Known Since
- Conversation Confidence
- Last Updated

Fields update automatically as discovery progresses.

## Verification (mock)

`lib/nordi/identity.ts` exposes `NordiVerificationProvider` with a `mockVerificationProvider` implementation. Swap this for a real SMS/email OTP service when ready — the save flow UI does not need to change.

## Validation

```bash
npm run lint
npm run build
```

## Success criteria

- First-time visitors feel Nordi understands their business as the conversation unfolds
- Returning visitors feel remembered — not like they're starting over
- Save flow is conversational and optional verification works end-to-end
- Storage is abstracted and NEO-ready
