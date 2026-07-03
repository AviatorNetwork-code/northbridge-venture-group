# CAT Website Assistant v1

Public-facing customer guidance assistant for the Northbridge Venture Group website.

## Overview

CAT Website Assistant v1 is a lightweight, deterministic guidance experience embedded on every page. It helps visitors understand Northbridge, discover the right product or service, and reach the correct next action—without exposing internal architecture or requiring a live CAT runtime.

**Version:** 1.0 (static mode)  
**Scope:** Customer-facing website only

## What CAT Does

- Answers common questions about Northbridge, ventures, and services
- Recommends next steps (explore offerings, contact, partnership conversation)
- Surfaces CTAs to existing site routes and external venture links
- Captures lead intent signals via analytics event hooks

## What CAT Does Not Expose

CAT must never reference or describe:

- NEO / NEOS
- Internal package architecture
- Internal governance systems
- Reusable technology strategy
- Private engineering doctrine

CAT speaks only as the **Northbridge website assistant**.

## Architecture

```
components/cat/
  CatWebsiteAssistant.tsx   # Root client widget (launcher + panel)
  CatLauncher.tsx           # Floating entry point button
  CatPanel.tsx              # Chat / guided assistant panel
  CatMessage.tsx            # Individual message bubble + CTAs

lib/cat/
  websiteAssistantTypes.ts  # Shared types and adapter interface
  websiteKnowledge.ts       # Public-safe knowledge base + CTAs
  websiteAssistant.ts       # Deterministic response engine + adapter
  analytics.ts              # Event hook layer
```

### Runtime Adapter Boundary

`CatRuntimeAdapter` in `websiteAssistantTypes.ts` defines the integration point for a future live CAT runtime:

```typescript
interface CatRuntimeAdapter {
  mode: "static" | "runtime";
  respond: (input: string, context?: CatConversationContext) => Promise<CatAssistantResponse>;
}
```

v1 ships with `staticCatAdapter` (keyword matching against `websiteKnowledge.ts`). To swap in live runtime later:

```typescript
import { setCatRuntimeAdapter } from "@/lib/cat/websiteAssistant";

setCatRuntimeAdapter({
  mode: "runtime",
  respond: async (input, context) => {
    // Future: call approved CAT runtime API
  },
});
```

No secrets, no AI API calls, and no external dependencies are required for v1.

## Knowledge Base

Public-safe content lives in `lib/cat/websiteKnowledge.ts`:

| Topic ID | Example triggers |
|----------|------------------|
| `northbridge-overview` | "What does Northbridge do?" |
| `product-fit` | "Which product is right for me?" |
| `flight-school` | "I run a flight school" |
| `ai-business` | "AI for my business" |
| `aviator-network` | "What is Aviator Network?" |
| `quadrix` | "What is Quadrix?" |
| `services` | Website development, pricing |
| `partner` | Partnership, founder collaboration |
| `contact` | Email, consultation |
| `ventures` | Portfolio, AirTax, platforms |

## CTAs

| CTA | Route | Notes |
|-----|-------|-------|
| Explore Services | `/services` | Primary services path |
| View Ventures | `/portfolio` | Ventures / products |
| Contact Northbridge | `/contact` | Lead capture path |
| Partner With Us | `/partner` | Partnership inquiries |
| Visit Aviator Network | `https://aviatornetwork.com` | External venture |
| About Northbridge | `/about` | Company background |

**Note:** `/products` and `/assessment` are not yet implemented as standalone routes. v1 maps product discovery to `/services` and `/portfolio`, and assessment interest to `/contact`.

## Analytics Events

Events are emitted via `trackCatEvent()` and a browser `CustomEvent` (`northbridge:cat-analytics`) for optional backend wiring.

| Event | When fired |
|-------|------------|
| `cat_opened` | Assistant panel opened |
| `cat_closed` | Assistant panel closed |
| `cat_question_selected` | Quick-question chip clicked |
| `cat_message_sent` | User typed and sent a message |
| `cat_recommendation_generated` | Response includes a recommendation |
| `cat_cta_clicked` | User clicks an in-chat CTA link |

Register a handler when analytics backend is ready:

```typescript
import { setCatAnalyticsHandler } from "@/lib/cat/analytics";

setCatAnalyticsHandler((payload) => {
  // Send to analytics backend
});
```

## Accessibility

- Launcher button: `aria-expanded`, `aria-controls`, descriptive `aria-label`
- Panel: `role="dialog"`, `aria-modal`, labelled title
- Message log: `aria-live="polite"`
- Keyboard: Escape closes panel; input receives focus on open
- Mobile: Panel adapts to small viewports with safe-area insets

## Integration

Mounted globally in `app/layout.tsx` via `<CatWebsiteAssistant />`, after `<Footer />`. Uses `z-[60]` to sit above the fixed header (`z-50`).

## Validation

Run before deploy:

```bash
npm run lint
npm run build
node --import tsx lib/cat/websiteAssistant.test.ts   # if tsx available
```

Or run the Node test via the project script:

```bash
npm run test:cat
```

Uses `tsx` (dev dependency) to run TypeScript unit tests in `lib/cat/websiteAssistant.test.ts`.

## Rollout Notes

1. **Conservative v1:** Static responses only—no live AI, no secrets.
2. **No core copy changes:** Existing page content is untouched.
3. **Quadrix:** Described at a high level; no public URL yet—CTA routes to contact.
4. **Future work:** Live CAT runtime adapter, `/assessment` route, analytics backend, lead form capture inside panel.

## File Inventory (v1)

| File | Purpose |
|------|---------|
| `components/cat/CatWebsiteAssistant.tsx` | Widget root |
| `components/cat/CatLauncher.tsx` | Floating button |
| `components/cat/CatPanel.tsx` | Chat panel UI |
| `components/cat/CatMessage.tsx` | Message rendering |
| `lib/cat/websiteAssistantTypes.ts` | Types |
| `lib/cat/websiteKnowledge.ts` | Knowledge + CTAs |
| `lib/cat/websiteAssistant.ts` | Response logic |
| `lib/cat/analytics.ts` | Event hooks |
| `lib/cat/websiteAssistant.test.ts` | Unit tests |
| `app/layout.tsx` | Global mount point |
