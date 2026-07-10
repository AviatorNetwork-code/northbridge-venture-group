# AGENTS.md

## Cursor Cloud specific instructions

Northbridge Venture Group is a static marketing website built with Next.js 14 (App Router), TypeScript, and Tailwind CSS. All pages under `app/` are statically prerendered; there is no backend, database, or authentication.

### Running / building / linting
Standard scripts in `package.json`:
- Dev server: `npm run dev` (serves on http://localhost:3000)
- Build: `npm run build` (all routes prerender as static content)
- Lint: `npm run lint`

Notes:
- There is no test suite; `npm test` is not defined and will fail. The NEO config (`.northbridge/neo.config.json`) references `npm test`, but that is a placeholder for future use.
- `next build` prints a harmless `metadataBase property ... not set` warning; this does not affect functionality.

### NEO reporting helper
`scripts/neo-report.mjs` generates local-only JSON session/repo-status reports (no network calls, no secrets). It is not part of running the app; run it manually only when a NEO report is needed (`node scripts/neo-report.mjs --help`).
