# NVG Website Delivery — Founder Merge & Deploy Authorization

**Date:** 2026-09-11  
**Authorization:** Founder — website merge YES · production deploy YES (corporate site only)

## Prior state

- Branch/PR: `cursor/nvg-website-nordy-2-completion-440f` / PR #21 (was draft; prior note said no merge/deploy)
- Production `main` HEAD: `366d07b8` (Nordi / Northbridge Digital framing)
- Live domain already pointed at Vercel; sitemap missing on old production

## Completion gaps closed in this pass

- Removed root `canonical: "/"` bug; per-page canonicals via `lib/seo.ts`
- Organization + WebSite JSON-LD
- Favicon / app icons
- SEO unit tests
- Delivery runbook + SEO baseline docs
- Marked PR ready for review under founder authorization

## Classification target after public verify

`NORTHBRIDGE_WEBSITE_LIVE_VERIFIED` or `NORTHBRIDGE_WEBSITE_DEPLOYED_WITH_GAPS`
