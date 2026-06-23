# Analytics — Google Tag Manager

**Status:** Active  
**Applies to:** Northbridge Venture Group public site

Google Analytics and other marketing tags are managed **through Google Tag Manager (GTM)**. This application does not load GA directly.

---

## Environment variable

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_GTM_ID` | Production | GTM container ID (e.g. `GTM-T6TMPWP5`) |

Set in Vercel for production:

```env
NEXT_PUBLIC_GTM_ID=GTM-T6TMPWP5
```

When unset or invalid, GTM is not loaded (safe for local development).

The container ID is public by design (`NEXT_PUBLIC_*` is exposed to the browser). Do not store secrets in GTM env vars.

---

## Implementation

- **Package:** `@next/third-parties` (aligned with the Next.js version)
- **Script:** `GoogleTagManager` from `@next/third-parties/google` in `app/layout.tsx`
- **Noscript:** `GtmNoScript` server component immediately after `<body>` for non-JS clients
- **Validation:** `lib/gtm.ts` reads `NEXT_PUBLIC_GTM_ID` and accepts only `GTM-*` format IDs

GTM scripts load after hydration via Next.js `Script` — no direct GA snippet, no inline third-party scripts in page components.

---

## Custom events (dataLayer)

Client code can push events with `trackEvent()` in `lib/analytics.ts`. When GTM is active, events flow to `window.dataLayer` for tag configuration in the GTM UI.

Example events already used by the Digital assessment funnel:

- Assessment step views and submissions (internal event names; configure GTM triggers to match)

Configure corresponding triggers and tags in the GTM container — not in this repository.

---

## Verification

1. Set `NEXT_PUBLIC_GTM_ID` in Vercel and redeploy.
2. Open the site and use [Tag Assistant](https://tagassistant.google.com/) or GTM Preview mode.
3. Confirm `gtm.js` loads and the dataLayer initializes.
4. Do not commit real webhook keys or service role keys when testing locally.

---

## CSP note

This project does not set a restrictive Content-Security-Policy header today. If CSP is added later, allow:

- `https://www.googletagmanager.com`
- `https://www.google-analytics.com` (if GA tags are fired via GTM)

Update CSP in `next.config` or edge middleware when introduced.
