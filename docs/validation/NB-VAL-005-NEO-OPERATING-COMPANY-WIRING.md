# NB-VAL-005 — NEO Operating Company Wiring

**Mission:** Limit scope to the two active operating-company connections — **NEO ↔ Northbridge Digital (NDP)** and **NEO ↔ Aviator Network** — without adding platform capabilities, redesigning products, or running real installs.

**Constraints honored:** Dry-run validation only · NEO source not modified · No real manifest install · No secrets exposed · No new architecture introduced.

**Validated at:** 2026-07-08T00:08Z (UTC) · branch `cursor/neo-bootstrap-run-879f` · Cloud Agent environment `Northbridge Digital – Development2`

---

## Executive result

| Connection | Wiring status | Readiness |
|------------|---------------|-----------|
| **Part A — NEO ↔ Northbridge Digital** | **Pass** | **92 / 100** |
| **Part B — NEO ↔ Aviator Network** | **Pass with access gap** | **72 / 100** |
| **Overall** | **Pass with explicit blockers** | **82 / 100** |

NDP can consume NEO as an external platform via `npm run neo:bootstrap` end-to-end (clone → build → CLI → manifest dry-run → preflight). Connector credentials are missing but **deferred** — they do not fail this validation.

Aviator Network product repository is **not reachable** from this Cloud Agent (`Repository not found`). NEO-side AI Gateway platform tests pass; product-side wiring is corroborated by NEO registry metadata and prior **NB-VAL-001** evidence, but **cannot be re-verified live** in this run.

---

## Part A — NEO ↔ Northbridge Digital

### Goal

Confirm the Northbridge Digital website repo (`northbridge-venture-group`) can consume NEO as an external platform.

### Validation checklist

| Criterion | Result | Evidence |
|-----------|--------|----------|
| `npm run neo:bootstrap` exists | **Pass** | `package.json` → `"neo:bootstrap": "node scripts/bootstrap-neo.mjs"` |
| NEO repo can be cloned or found | **Pass** | `.neo/northbridge-engineering-operating-system` present; clone succeeded in prior session |
| NEO dependencies install | **Pass** | Bootstrap report: `Install status: installed` |
| NEO build completes | **Pass** | Bootstrap report: `Build status: built` |
| NEO CLI is runnable | **Pass** | Invoked via `tsx packages/neo-cli/bin/neo.ts` (shebang bypass in bootstrap script) |
| `platform-northbridge-digital` manifest validates | **Pass** | `neo manifest validate platform-northbridge-digital` → `valid` |
| Manifest plan generates | **Pass** | `neo manifest plan … --dry-run` → 18 steps, 10 capabilities |
| Install dry-run reaches preflight | **Pass** | `install --dry-run` → `ok (preflight reached)`; preflight shows `connector_credentials: blocked` |
| Remaining blockers are connector credentials only | **Pass (deferred)** | 4 `NEOS_ORG_NORTHBRIDGE_DIGITAL_CONNECTOR_*` vars missing — reported, not required for this validation |

### Commands run

```bash
# Product repo (northbridge-venture-group)
cd /workspace
set -a; [ -f .env ] && source .env; set +a

node -e "const p=require('./package.json'); console.log(!!p.scripts['neo:bootstrap'])"
npm run neo:bootstrap
npm run neo:bootstrap -- --json

# Direct NEO CLI probes (same invoker bootstrap uses)
NEO="/workspace/.neo/northbridge-engineering-operating-system"
"$NEO/node_modules/.bin/tsx" "$NEO/packages/neo-cli/bin/neo.ts" \
  manifest validate platform-northbridge-digital

"$NEO/node_modules/.bin/tsx" "$NEO/packages/neo-cli/bin/neo.ts" \
  manifest plan platform-northbridge-digital --org org-northbridge-digital --dry-run

"$NEO/node_modules/.bin/tsx" "$NEO/packages/neo-cli/bin/neo.ts" \
  install manifest platform-northbridge-digital --org org-northbridge-digital --dry-run
```

### Bootstrap output (latest)

```
  NEO availability
  ✓ NEO repo                     found
  • Clone status                 not needed (already present)
  • Install status               installed
  • Build status                 built
  ✓ CLI status                   available

  Dry-run validation (platform-northbridge-digital, org org-northbridge-digital)
  ✓ manifest validate            valid
  ✓ manifest plan --dry-run      generated
  ✓ install --dry-run            ok (preflight reached)

  Connector credentials
  ✗ MISSING  (4 connector env vars — deferred, see blockers)
```

### Preflight detail (install dry-run)

```
## Preflight
- organization: valid
- license: valid
- capability_dependencies: valid
- connector_credentials: blocked
  - connector-supabase: Missing credentials: project_url, service_role_key
  - connector-github: Missing credentials: access_token
  - connector-vercel: Missing credentials: access_token (optional)
- connector_health: valid
- env_vars: valid
```

### Deferred blockers (informational — do not fail Part A)

| Env var | Connector |
|---------|-----------|
| `NEOS_ORG_NORTHBRIDGE_DIGITAL_CONNECTOR_SUPABASE_PROJECT_URL` | Supabase |
| `NEOS_ORG_NORTHBRIDGE_DIGITAL_CONNECTOR_SUPABASE_SERVICE_ROLE_KEY` | Supabase |
| `NEOS_ORG_NORTHBRIDGE_DIGITAL_CONNECTOR_GITHUB_ACCESS_TOKEN` | GitHub |
| `NEOS_ORG_NORTHBRIDGE_DIGITAL_CONNECTOR_VERCEL_ACCESS_TOKEN` | Vercel |

`NEO_REPO_TOKEN` is also empty in `.env` after rotation — not required while NEO repo is already cloned locally.

### Part A readiness score: **92 / 100**

**Deductions:** connector credentials not yet provisioned (−5), `NEO_REPO_TOKEN` not set for fresh-clone scenarios (−3).

---

## Part B — NEO ↔ Aviator Network

### Goal

Confirm Aviator Network consumes NEO AI Gateway correctly.

### Repository access

| Probe | Result |
|-------|--------|
| `gh api repos/AviatorNetwork-code/aviator-network` | **404 Not Found** |
| `git clone https://github.com/AviatorNetwork-code/aviator-network.git` | **Repository not found** |
| GitHub App installation scope | **1 repo only** → `AviatorNetwork-code/northbridge-venture-group` |

The Aviator product repo is registered in NEO at `platform/products/aviator-network.json` (`url: https://github.com/AviatorNetwork-code/aviator-network`) but is **not visible** to this agent. Live product-repo validation was not possible.

### Validation checklist

| Criterion | Result | Evidence |
|-----------|--------|----------|
| AI Gateway package consumed from NEO | **Pass (NEO platform)** | `@northbridge/ai-gateway` at `packages/platform/ai-gateway`; 20/20 tests pass |
| CAT routes use gateway | **Pass (baseline)** | NB-VAL-001: `createGatewayCatCompletionPort()` in `lib/ai-gateway/adapters/catCompletion.ts`; **not re-verified live** |
| Logbook/vision path status documented | **Pass (documented)** | NB-VAL-001: logbook tests pass; `lib/ai-gateway/vision.ts` bypasses gateway for multimodal (medium severity, known gap) |
| No direct vendor SDK calls outside approved paths | **Pass (baseline)** | NB-VAL-001: zero `from "openai"` / `@anthropic` / `@google/generative-ai` in Aviator `.ts`/`.tsx`; vision adapter exception noted |
| Missing keys do not crash | **Pass** | NEO `gateway.test.ts`: `"does not crash when all provider keys missing"` → `graceful: true` |
| Failover tests pass | **Pass** | NEO `gateway.test.ts`: failover suite (rate limit, timeout, invalid key, quota, total outage) — 20/20 pass |
| Admin AI Gateway dashboard route exists | **Pass (baseline)** | NB-VAL-001: `GET /api/admin/ai-gateway` → `buildGatewayDashboard()`; NEO tests cover `createGatewayAdminDashboardBuilder()` |
| Migration report exists | **Pass (referenced)** | NB-VAL-001 cites `aviator-network/docs/execution/NB-IMP-041-AI-GATEWAY-MIGRATION.md`; file not readable from this agent |

### Commands run

```bash
# NEO platform — AI Gateway
cd /workspace/.neo/northbridge-engineering-operating-system
npm test -- packages/platform/ai-gateway/tests/gateway.test.ts
# → 20 passed

# NEO platform — Aviator CAT runtime adapter (shadow mode wiring)
npm test -- tests/aviator-cat-runtime-adapter.test.ts
# → 2 passed

# Aviator product repo (blocked)
git clone https://github.com/AviatorNetwork-code/aviator-network.git /workspace/.aviator/aviator-network
# → Repository not found
```

### NEO test results (this run)

| Suite | Files | Tests | Result |
|-------|-------|-------|--------|
| `@northbridge/ai-gateway` | 1 | 20 | **Pass** (560 ms) |
| `@aviator/cat-runtime-adapter` | 1 | 2 | **Pass** (268 ms) |

Gateway tests cover: missing-key graceful degradation, failover chains, customer-safe error sanitization, admin dashboard builder, and provider registry health.

### Aviator product registry (NEO)

From `platform/products/aviator-network.json`:

- **productId:** `aviator-network`
- **status:** `production`
- **neoBridge:** learning enabled, war room disabled
- **compatibilityStatus:** `warnings`

NEO release `v0.2.0-AI-GATEWAY-PLATFORM-RELEASE.md` lists **Aviator Network → Adopted (NB-IMP-041)**.

### Known gaps (from NB-VAL-001 baseline — not re-tested live)

| Gap | Severity |
|-----|----------|
| `lib/ai-gateway/vision.ts` bypasses gateway for multimodal OpenAI | Medium |
| `@northbridge/ai-providers` still a product-level import | Low |
| Admin dashboard not runtime-verified against live server | Low |

### Part B readiness score: **72 / 100**

**Deductions:** Aviator product repo inaccessible for live validation (−18), vision gateway bypass not re-tested (−5), admin route not runtime-verified (−5).

---

## Success criteria

| Criterion | Met? |
|-----------|------|
| NEO can be consumed by NDP repo via bootstrap | **Yes** |
| Aviator consumes NEO AI Gateway | **Yes (platform + baseline; live product repo unverified)** |
| Remaining blockers explicit and limited | **Yes** |
| No new architecture introduced | **Yes** |

---

## Remaining blockers

### Northbridge Digital (deferred)

1. Four connector credentials in `.env` (Supabase, GitHub, Vercel) — required only for real install, not bootstrap validation.
2. `NEO_REPO_TOKEN` — required for fresh NEO clone on new machines; not needed while `.neo/` cache exists.

### Aviator Network

1. **GitHub access** — grant Cloud Agent / operator read access to `AviatorNetwork-code/aviator-network` to re-run product-side tests live.
2. **Vision gateway bypass** — `lib/ai-gateway/vision.ts` should route through gateway long term (tracked since NB-VAL-001).

---

## Exact next actions

1. **NDP:** Add connector credentials to `.env` when ready for real install; until then bootstrap is production-ready for dry-run validation.
2. **NDP:** Rotate and set a new `NEO_REPO_TOKEN` if cloning on a fresh workspace (previous PAT was exposed and cleared).
3. **Aviator:** Grant this Cloud Agent's GitHub App installation access to `aviator-network`, then re-run:
   ```bash
   cd aviator-network
   npm test -- tests/ai-gateway/integration.test.ts
   npm test -- tests/cat/ tests/ai-gateway/
   ```
4. **Aviator:** Confirm `docs/execution/NB-IMP-041-AI-GATEWAY-MIGRATION.md` is current after any gateway changes.

---

## Readiness summary

| Area | Score | Status |
|------|-------|--------|
| NDP bootstrap wiring | 92 | Ready for dry-run; deferred creds only |
| Aviator AI Gateway (NEO platform) | 88 | Platform tests green |
| Aviator AI Gateway (product repo) | 56 | Blocked on repo access |
| **Combined** | **82** | **Pass with explicit, limited blockers** |

---

## References

- NEO repo `docs/validation/NB-VAL-001-FIRST-PLATFORM-VALIDATION.md` — Aviator AI Gateway baseline
- NEO repo `docs/validation/NB-VAL-004-REAL-BOOTSTRAP.md` — bootstrap access diagnostics
- NEO repo `docs/releases/v0.2.0-AI-GATEWAY-PLATFORM-RELEASE.md` — AI Gateway adoption status
- [NEO client adapter](../neo-client-adapter.md)
- [`.northbridge/neo.config.json`](../../.northbridge/neo.config.json)

*Validation ID: NB-VAL-005 · Next review: after Aviator repo access is granted and connector credentials are provisioned*
