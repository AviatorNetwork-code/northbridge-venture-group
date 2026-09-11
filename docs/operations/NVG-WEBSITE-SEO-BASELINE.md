# NVG Website — SEO Baseline

**Captured:** 2026-09-11  
**Production URL:** https://northbridgeventuregroup.com  
**Purpose:** Lightweight baseline for future comparison. Does **not** claim rankings.

## Indexability vs indexing

| Distinction | Status |
|-------------|--------|
| `SITE_IS_INDEXABLE` | Target after this delivery: **YES** (robots allow, sitemap public, pages indexable, HTTPS) |
| `SEARCH_ENGINE_HAS_INDEXED_SITE` | **UNKNOWN / NOT CLAIMED** until Search Console / Bing / SERP evidence |

## Core page URLs

| Path | Expected title (pattern) |
|------|--------------------------|
| `/` | Northbridge Venture Group \| Companies, Software & Intelligent Systems |
| `/about` | About \| Northbridge Venture Group |
| `/ventures` | Ventures \| Northbridge Venture Group |
| `/engineering-ai` | Engineering & AI \| Northbridge Venture Group |
| `/digital` | Northbridge Digital \| Northbridge Venture Group |
| `/mobile-apps` | Mobile App Launch \| Northbridge Venture Group |
| `/capabilities` | Capabilities \| Northbridge Venture Group |
| `/contact` | Contact \| Northbridge Venture Group |
| `/help` | Help \| Northbridge Venture Group |
| `/privacy` | Privacy \| Northbridge Venture Group |

## Robots / sitemap / canonical

| Check | Expected |
|-------|----------|
| `ROBOTS_ALLOWED` | Allow `/`; disallow `/operations/`, `/api/` |
| `SITEMAP_PUBLIC` | `https://northbridgeventuregroup.com/sitemap.xml` |
| `CANONICAL_DOMAIN_CORRECT` | `https://northbridgeventuregroup.com` (apex) |
| `NO_NOINDEX` on marketing | Marketing pages `index,follow` |
| `WWW/NON-WWW` | www → apex 308 |
| `HTTP→HTTPS` | Redirect / edge HTTPS |

## Structured data

- Organization schema
- WebSite schema

## Accessibility / performance (smoke)

| Check | Notes |
|-------|-------|
| Accessibility | Nordy dialog: focus trap, restore, labelled title, reduced-motion scroll (branch). Full a11y audit not claimed. |
| Performance | Next.js App Router static/SSR marketing pages; measure with Lighthouse after deploy if needed. |
| Mobile | Responsive Tailwind layouts; smoke at mobile + desktop widths. |

## Search Console / Bing

| Item | Status |
|------|--------|
| Google Search Console | **NOT VERIFIED IN THIS SESSION** — do not create paid accounts or change ownership silently |
| Bing Webmaster | **UNKNOWN** |

Launch does **not** require Search Console. After launch, founder may verify property ownership separately.

## Known SEO gaps (acceptable post-launch)

1. Search engines may take time to discover/index — do not promise rank.
2. Contact form is mailto-based (no server lead store) — fine for launch; CRM destination still founder decision.
3. Live NEO retrieve (`NEXT_PUBLIC_NEO_BASE_URL`) optional for public crawlability.
4. Some legacy pages (`/partner`, `/clients`) retain older Nordi-product framing; refine copy later without blocking launch.
5. Next.js 14.2.18 has published security advisories — schedule framework upgrade separately from this content launch.
6. Cloudflare managed robots signals may append AI-crawler rules in front of app `robots.ts`.

## Update rule

After each production website deploy, refresh this baseline with production HEAD, deploy time, and observed robots/sitemap/title samples. Keep evidence levels honest (`VERIFIED` vs `REPORTED`).
