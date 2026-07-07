# NB-VAL-004 — First Real NEO Bootstrap

**Mission:** Prove that a brand-new operating-company repo can discover, clone, build, and consume the **real** private NEO platform via `npm run neo:bootstrap` — no local stub, no fake CLI.

**Constraints honored:** NEO source not modified · website not redesigned · no real manifest install (dry-run only) · no secrets exposed · no simulated repos or CLI stubs — only the real repository URL was used.

**Validated at:** 2026-07-07T22:33Z (UTC) · branch `cursor/nb-val-004-real-bootstrap-24b8` (contains the NB-FIX-003 bootstrap).

---

## Executive result

`npm run neo:bootstrap` runs end-to-end and behaves correctly, but it **cannot reach the real NEO installer preflight** because the target NEO repository is **not accessible to this Cloud Agent**. The blocker is at **repository discovery/access**, *not* at connector credentials.

Per the mission's success criteria, this is a **non-acceptable** remaining blocker: it must be resolved (grant access / confirm repo identity) before a first-time operator can reach preflight.

---

## 1. GitHub access verification (no guessing)

The Cloud Agent authenticates with a **GitHub App installation token** (`ghs_…`, account `cursor`). Evidence:

| Probe | Command | Result |
| --- | --- | --- |
| Auth type | `gh auth status` | Logged in, token `ghs_…` (App installation token) |
| NEO repo (REST) | `gh api repos/AviatorNetwork-code/northbridge-engineering-operating-system` | **HTTP 404 Not Found** |
| Installation scope | `gh api /installation/repositories` | `total_count = 1` → only `AviatorNetwork-code/northbridge-venture-group` |
| Control repo (REST) | `gh api repos/AviatorNetwork-code/northbridge-venture-group` | **200 OK** (`private: false`) |
| NEO clone (authenticated) | `git clone …northbridge-engineering-operating-system.git` | `remote: Repository not found` / `fatal … not found` (exit 128) |
| NEO clone (unauthenticated) | `git -c credential.helper= ls-remote …` | `remote: Repository not found` (exit 128) |

Full transcript: `/opt/cursor/artifacts/neo_access_diagnostics.log`.

### Cause classification

Ruled **out** (with evidence):

- **Missing token** — ruled out. A valid token is present and works: the control repo is reachable via both REST (200) and git.
- **Network restriction** — ruled out. GitHub is reachable; we receive genuine GitHub `404 / "Repository not found"` application responses (not DNS/timeout/connection errors), and the control repo clones/queries fine.
- **Wrong remote** — ruled out at the URL level. The URL used is exactly the one specified by the mission and stored in `.northbridge/neo.config.json` (`neo.repoUrl`).

Confirmed cause:

- **Missing GitHub App access (insufficient repository grant).** The installation backing this agent is scoped to **exactly one** repository (`northbridge-venture-group`); `northbridge-engineering-operating-system` is **not** in the installation's repository selection, so the token has no visibility into it.
- GitHub returns **404 (not 403)** for private repos the caller can't see, so a 404 cannot by itself distinguish *"repo does not exist"* from *"repo exists but this token has no access."* The **unauthenticated** probe is also 404, which additionally rules out the repo being **public**.

**Bottom line:** either the NEO repo does not exist under that exact owner/name, or (more likely, given the naming) it exists privately and this agent's GitHub App installation has not been granted access to it. This agent cannot resolve that from inside the sandbox — it requires an access/identity change by a repo/org admin.

---

## 2. Clone real NEO

**Not possible** with current access. The clone was attempted (authenticated, into `.neo/northbridge-engineering-operating-system`) and failed with `Repository not found` (exit 128). Consequently `git remote -v`, current branch, and HEAD commit **cannot be reported** — there is no local NEO working tree. No stub or simulated repo was substituted (per the rules).

---

## 3. Bootstrap (real repository, no stub)

Command executed exactly as specified, against the real URL, with no `.neo/` and no stub present:

```bash
npm run neo:bootstrap
```

Output (full copy: `/opt/cursor/artifacts/neo_real_bootstrap.log`):

```
  NEO availability
  ✗ NEO repo                     missing
  ✗ Clone status                 failed: remote: Repository not found.
  • Install status               skipped (NEO repo missing)
  • Build status                 skipped (NEO repo missing)
  ✗ CLI status                   unavailable (no `neo` binary found)

  Dry-run validation (platform-northbridge-digital, org org-northbridge-digital)
  ! manifest validate            unknown (CLI unavailable)
  ! manifest plan --dry-run      unknown (CLI unavailable)
  ! install --dry-run            unknown (CLI unavailable)
  ...
  ✗ Install blocked              yes
      - NEO CLI is unavailable
      - 4 connector credential(s) missing
```

The bootstrap orchestration itself works correctly: it resolved the config, attempted the real clone, surfaced the real git error, and produced an honest, actionable report.

---

## 4. Verification checklist

| Step | Status | Detail |
| --- | --- | --- |
| ✓ NEO cloned | ❌ | `Repository not found` (exit 128) — no access |
| ✓ dependencies installed | ⛔ not reached | requires a cloned NEO tree |
| ✓ CLI built | ⛔ not reached | requires a cloned NEO tree |
| ✓ neo available | ❌ | no `neo` binary (CLI never built) |
| ✓ manifest validates | ⛔ not reached | CLI unavailable |
| ✓ plan generated | ⛔ not reached | CLI unavailable |
| ✓ dry-run reaches installer preflight | ❌ | blocked at repository access, before preflight |

**Remaining real blocker (single, primary):** repository access to `AviatorNetwork-code/northbridge-engineering-operating-system`. Everything downstream is gated on this.

---

## 5. Connector validation

Blocking is **not yet** limited to credentials — the primary blocker is repository access (above). Credentials are a **secondary, not-yet-reached** blocker. For completeness, all four declared connector variables are currently unset:

- `NEOS_ORG_NORTHBRIDGE_DIGITAL_CONNECTOR_SUPABASE_PROJECT_URL` — missing
- `NEOS_ORG_NORTHBRIDGE_DIGITAL_CONNECTOR_SUPABASE_SERVICE_ROLE_KEY` — missing
- `NEOS_ORG_NORTHBRIDGE_DIGITAL_CONNECTOR_GITHUB_ACCESS_TOKEN` — missing
- `NEOS_ORG_NORTHBRIDGE_DIGITAL_CONNECTOR_VERCEL_ACCESS_TOKEN` — missing

(No secret values were read or printed — only presence was checked.)

---

## 6. Operator experience scores

First-time operator, scale 1–10 (10 = best):

| Dimension | Score | Rationale |
| --- | --- | --- |
| Repository discovery | 2 | Repo URL is configured, but the agent cannot access it and a 404 gives no way to tell "missing" from "no access." The single-repo installation scope is the real gap. |
| Bootstrap | 8 | One command; idempotent; resolves config, attempts the real clone, and degrades gracefully with an honest report. |
| CLI setup | N/A (not reached) | Cannot be exercised until NEO is accessible; logic is in place and previously verified against a controlled build. |
| Documentation | 8 | `docs/NEO-INSTALLER-ONBOARDING.md` explains the flow, clone location, credentials, and blocked-state interpretation clearly. |
| Error clarity | 6 | The bootstrap surfaces the real `Repository not found` and a next command, but does not distinguish *non-existent* vs *no-access*, nor mention GitHub App installation scope. |
| Credential guidance | 8 | `.env.example` + report list the exact missing variables; no assumptions about values. |
| **Overall operator experience** | **5** | The consumer side is solid; the experience is blocked entirely by an external access/identity gap at repository discovery. |

---

## 7. Recommendations (only those that improve first-time experience)

1. **Grant repository access to the agent's GitHub App installation.** Add `northbridge-engineering-operating-system` to the installation's selected repositories for `AviatorNetwork-code` (currently only `northbridge-venture-group` is granted). This is the direct unblock.
2. **Or provide a repo-scoped clone token as a secret.** If broadening the App installation isn't desired, supply a dedicated read token (e.g. a `NEO_REPO_TOKEN` secret) and have the bootstrap use it only for the clone. This keeps NEO access explicit and least-privilege.
3. **Confirm the exact NEO repo owner/name.** Because a 404 also covers "does not exist," verify the slug `AviatorNetwork-code/northbridge-engineering-operating-system` is correct before assuming it's purely an access issue.
4. **Improve bootstrap error clarity for 404s (small, in-repo change).** When `git clone` returns `Repository not found`, print a hint that distinguishes likely causes ("repo may not exist, or this token/GitHub App installation lacks access") and point to the access-grant / token steps. This raises the "Error clarity" score without changing NEO.
5. **Optionally let the bootstrap accept a clone token from config/env** so operators in restricted environments can supply access without editing global git credentials.

Recommendations 4–5 are optional enhancements to `scripts/bootstrap-neo.mjs` in *this* repo (NEO untouched); 1–3 are external access/identity actions required to actually reach preflight.

---

## Bootstrap timeline

| # | Action | Outcome |
| --- | --- | --- |
| 1 | `gh auth status` | Installation token confirmed (`ghs_…`) |
| 2 | `gh api repos/.../northbridge-engineering-operating-system` | 404 Not Found |
| 3 | `gh api /installation/repositories` | Only 1 repo granted (control repo) |
| 4 | `gh api repos/.../northbridge-venture-group` | 200 OK (token + network proven) |
| 5 | `git clone` NEO (authenticated) | exit 128, `Repository not found` |
| 6 | `git ls-remote` NEO (unauthenticated) | exit 128, `Repository not found` (not public) |
| 7 | `npm run neo:bootstrap` (real, no stub) | Honest blocked report; stops at clone, before preflight |

---

## Return summary

- **Commands executed / outputs:** §1, §3, and the two artifact logs (`neo_access_diagnostics.log`, `neo_real_bootstrap.log`).
- **Bootstrap timeline:** see table above.
- **Remaining blockers:** one primary — no access to the NEO repository (missing GitHub App installation grant, or repo does not exist under that owner). Credentials are a not-yet-reached secondary blocker.
- **UX score:** overall **5/10** (consumer tooling solid; blocked at repository discovery).
- **Recommendations:** grant App access / provide clone token / confirm repo slug (required); improve 404 error messaging and optional clone-token support (nice-to-have).

> Success criterion not yet met: the only acceptable remaining blockers are external credentials, but the current blocker is **repository access**. Once the agent (or operator) can clone the real NEO repo, re-run `npm run neo:bootstrap` to proceed to dependency install → CLI build → manifest validate/plan → installer preflight.
