# Analytics — Google Tag Manager & Microsoft Clarity

**Status:** Active  
**Applies to:** Northbridge Venture Group public site

Google Analytics and other marketing tags are managed **through Google Tag Manager (GTM)**. This application does not load GA directly.

Microsoft Clarity runs as a **separate, first-party integration** for session recordings and heatmaps. It does not replace GTM and is not loaded through GTM by default.

---

## Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_GTM_ID` | Production | GTM container ID (e.g. `GTM-T6TMPWP5`) |
| `NEXT_PUBLIC_CLARITY_ID` | Production | Microsoft Clarity project ID (e.g. `xbme0f046y`) |

Set in Vercel for production:

```env
NEXT_PUBLIC_GTM_ID=GTM-T6TMPWP5
NEXT_PUBLIC_CLARITY_ID=xbme0f046y
```

When unset or invalid, each service is skipped independently (safe for local development).

These IDs are public by design (`NEXT_PUBLIC_*` is exposed to the browser). Do not store secrets in analytics env vars.

---

## Google Tag Manager

### Implementation

- **Package:** `@next/third-parties` (aligned with the Next.js version)
- **Script:** `GoogleTagManager` from `@next/third-parties/google` in `app/layout.tsx`
- **Noscript:** `GtmNoScript` server component immediately after `<body>` for non-JS clients
- **Validation:** `lib/gtm.ts` reads `NEXT_PUBLIC_GTM_ID` and accepts only `GTM-*` format IDs

GTM scripts load after hydration via Next.js `Script` — no direct GA snippet, no inline third-party scripts in page components.

### Custom events (dataLayer)

Client code can push events with `trackEvent()` in `lib/analytics.ts`. When GTM is active, events flow to `window.dataLayer` for tag configuration in the GTM UI.

Configure corresponding triggers and tags in the GTM container — not in this repository.

### GTM verification

1. Set `NEXT_PUBLIC_GTM_ID` in Vercel and redeploy.
2. Use [Tag Assistant](https://tagassistant.google.com/) or GTM Preview mode.
3. Confirm `gtm.js` loads and the dataLayer initializes.

---

## Microsoft Clarity

### Implementation

- **Component:** `MicrosoftClarity` in `components/analytics/MicrosoftClarity.tsx`
- **Layout:** Rendered once in `app/layout.tsx` when `NEXT_PUBLIC_CLARITY_ID` is valid
- **Loader:** Official Clarity bootstrap snippet via `next/script` with `strategy="afterInteractive"`
- **Validation:** `lib/clarity.ts` accepts alphanumeric project IDs only
- **Duplicate guard:** Single layout mount + fixed script id (`_microsoft-clarity`); Clarity’s bootstrap uses `window.clarity` queue if called again

Clarity loads independently of GTM. You may also deploy Clarity via GTM if preferred — in that case leave `NEXT_PUBLIC_CLARITY_ID` unset here to avoid double-loading.

### Clarity verification

1. Set `NEXT_PUBLIC_CLARITY_ID` in Vercel and redeploy.
2. Open the site and check the Clarity dashboard for live sessions (may take a few minutes).
3. In DevTools → Network, confirm a request to `https://www.clarity.ms/tag/<project-id>`.

---

## CSP note

This project does not set a restrictive Content-Security-Policy header today. If CSP is added later, allow:

- `https://www.googletagmanager.com`
- `https://www.google-analytics.com` (if GA tags are fired via GTM)
- `https://www.clarity.ms`
- `https://*.clarity.ms` (Clarity scripts and beacons)

Update CSP in `next.config` or edge middleware when introduced.
