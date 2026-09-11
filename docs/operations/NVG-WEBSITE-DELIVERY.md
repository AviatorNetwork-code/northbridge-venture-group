# Northbridge Venture Group — Public Website Delivery Runbook

**Status:** Operational  
**Owner:** Founder / Marketing content owner (copy) · Engineering agents (implementation)  
**Canonical repository:** `AviatorNetwork-code/northbridge-venture-group`  
**Production branch:** `main`  
**Production URL:** https://northbridgeventuregroup.com  
**Alternate host:** https://northbridge-venture-group.vercel.app → redirects to production domain  
**Deployment provider:** Vercel project `northbridgeventure/northbridge-venture-group` (GitHub integration)

## Purpose

Repeatable process to update, verify, merge, deploy, and confirm the public corporate website for **Northbridge Venture Group** only.

This runbook does **not** authorize changes to Aviator Network, Quadrix, CAST, Easy Divorce, benchmarks, unrelated databases, payments, or model training.

## Architecture (keep existing work)

```text
KEEP → CONNECT → EXTEND → CONSOLIDATE → BUILD_NEW
```

Do not rebuild the marketing site or Nordy/Nordi stack from scratch when finishing an in-flight website PR.

## Local build commands

```bash
npm install
npm run lint
npm test
npm run build
npm run start
```

## Delivery sequence

1. **Discover truth** — confirm repo, `main` HEAD, open website PR/branch, Vercel production vs preview, and live domain response.
2. **Preserve work** — inspect the intended website branch vs `main`; do not merge unrelated draft experiments (ops center, NDP hiring MVPs, NEOS package drafts).
3. **Close only necessary gaps** — SEO readiness, content honesty, security/privacy, tests, docs.
4. **Test** — lint, vitest, production `next build`, smoke public routes.
5. **Merge** — founder-authorized website PR into `main` only.
6. **Deploy** — Vercel production deploy from `main` (Git integration). Do not create a replacement host unless the current one is unusable.
7. **Verify public site** — hit https://northbridgeventuregroup.com directly (not only CI).
8. **Record baseline** — see `docs/operations/NVG-WEBSITE-SEO-BASELINE.md`.

## Domain / hosting (non-secret)

| Item | Value |
|------|-------|
| Apex domain | `northbridgeventuregroup.com` |
| WWW | `www.northbridgeventuregroup.com` → 308 to apex |
| HTTP→HTTPS | Handled by Vercel / Cloudflare edge |
| DNS / CDN | Cloudflare in front of Vercel (observed) |
| Domain ownership path | Founder-controlled DNS / registrar (credentials not stored in repo) |

## SEO checklist (pre-merge)

- [ ] Unique titles + useful meta descriptions on public pages
- [ ] Per-page canonical URLs (never all pages → `/`)
- [ ] `robots.ts` allows `/`, disallows `/operations/` and `/api/`
- [ ] `sitemap.xml` lists public marketing URLs only
- [ ] `metadataBase` / OG / Twitter use production domain (not staging)
- [ ] No accidental `noindex` on marketing pages
- [ ] Organization + WebSite JSON-LD present and accurate
- [ ] Favicon / app icons present
- [ ] Image alt text on meaningful images
- [ ] Internal links descriptive; redirects for renamed routes (`/portfolio` → `/ventures`)

## Release verification checklist (post-deploy)

- [ ] Homepage 200, expected NVG branding (not stale Nordi-only title)
- [ ] Nav works: About, Ventures, Engineering & AI, Digital, Capabilities, Contact
- [ ] Mobile + desktop smoke
- [ ] HTTPS valid; www→apex canonicalization
- [ ] `/robots.txt` and `/sitemap.xml` public 200
- [ ] Canonical tags + titles/meta present
- [ ] No staging banner / benchmark / test content
- [ ] Contact path (Nordi CTA + mailto form) works
- [ ] Operations routes remain disallowed / noindex

## Rollback

1. In Vercel → project → Deployments → promote prior **Production** deployment, **or**
2. `git revert` the merge commit on `main` and push (triggers redeploy).

Do not force-push `main`.

## Content ownership

| Concern | Owner |
|---------|-------|
| Public copy / claims | Founder (or designated marketing owner) |
| Implementation / SEO plumbing | Engineering agent assigned to NVG website |
| Nordy learning emit / NEO live URL | Founder-gated env (`NORDY_PRODUCTION_LEARNING_EMIT`, `NEXT_PUBLIC_NEO_BASE_URL`) |

## Where to propose website work

1. Open a PR against `AviatorNetwork-code/northbridge-venture-group` `main`.
2. Keep scope to the public corporate site unless separately authorized.
3. Prefer extending the existing marketing + Nordy surfaces over new parallel sites.
4. Record delivery notes in `.northbridge/session-reports/` and update this runbook when process changes.

## Related docs

- `docs/architecture/NVG-WEBSITE-ARCHITECTURE.md`
- `docs/architecture/NORDY-NEO-INTEGRATION.md`
- `docs/architecture/NORDY-INTAKE-AND-LEARNING.md`
- `docs/operations/NVG-WEBSITE-SEO-BASELINE.md`
