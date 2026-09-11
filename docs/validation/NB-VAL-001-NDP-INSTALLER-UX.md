# NB-VAL-001 — Northbridge Digital Platform Installer UX Validation

| Field | Value |
|-------|-------|
| **Validation ID** | NB-VAL-001 |
| **Title** | NDP Installer UX Validation (Dry Run) |
| **Date** | 2026-07-07 |
| **Last updated** | 2026-07-07 (Run 2 — NEO bootstrap attempt) |
| **Agent run** | [Ndp installer ux validation](https://cursor.com/agents/bc-21c2e3ec-b5b3-46aa-a03b-38071f7d2cd0) |
| **Scope** | Installer UX validation only — no website build, no real install |
| **NEO expected path** | `/neo` |
| **NEO remote (expected)** | `https://github.com/AviatorNetwork-code/northbridge-engineering-operating-system.git` |

---

## 1. Objective

Validate the Northbridge Digital Platform (NDP) installer experience against the **existing Northbridge Digital website repository** as the real install target. This run exercises the installer contract (`neo.config.json` wiring + `neo` CLI dry-run commands) without modifying public website behavior or performing a live platform install.

---

## 2. Target Repository Identification

| Property | Value |
|----------|-------|
| **Repository** | `AviatorNetwork-code/northbridge-venture-group` |
| **Local path** | `/workspace` |
| **Remote** | `https://github.com/AviatorNetwork-code/northbridge-venture-group` |
| **Role** | Northbridge Venture Group corporate website (includes `/digital` — Northbridge Digital capability page) |
| **Package name** | `northbridge-venture-group` |
| **Tech stack** | Next.js 14, TypeScript, Tailwind CSS |

### Git state at validation time

```
Branch:  cursor/ndp-installer-ux-validation-2cd0 (created from main)
Base:    main @ ebc8a3a (Add NEO client adapter)
Remote:  origin/main — up to date at start of run
Status:  clean on main; installer config change staged on feature branch
```

No new repository was created. The existing website repo is the validation target.

---

## 3. Installer Configuration

### 3.1 Change applied

Updated `.northbridge/neo.config.json` to add an `installer` block pointing at the local NEO central repository checkout:

```json
"installer": {
  "neoPath": "../neo",
  "manifestId": "platform-northbridge-digital",
  "orgId": "org-northbridge-digital",
  "mode": "dry-run-validation",
  "note": "Points to the local NEO central repository sibling checkout used by the platform installer CLI."
}
```

### 3.2 Path resolution

| Config value | Resolved absolute path | Exists? |
|--------------|------------------------|---------|
| `installer.neoPath` → `../neo` | `/neo` | **Directory exists; git checkout missing** |

The existing lightweight client adapter fields (`client`, `adapter`, `reporting`, `ingest`, `governance`) were preserved unchanged.

### 3.3 Referenced but missing artifacts

| Artifact | Status |
|----------|--------|
| `.northbridge/neo.config.schema.json` | Referenced by `$schema`; not present in website repo |
| Local NEO central repo at `/neo` | `/neo` created; clone failed (repo not found) |
| `neo` CLI on `PATH` | Not installed (blocked by missing repo) |

---

## 4. Command Execution (Dry Run — Run 1)

All commands were run from the website repository root (`/workspace`).

### 4.1 `neo manifest validate platform-northbridge-digital`

```text
$ neo manifest validate platform-northbridge-digital
--: line 1: neo: command not found
```

| Result | Detail |
|--------|--------|
| **Exit code** | 127 |
| **Outcome** | **BLOCKED** — `neo` CLI not available |

### 4.2 `neo manifest plan platform-northbridge-digital --org org-northbridge-digital --dry-run`

```text
$ neo manifest plan platform-northbridge-digital --org org-northbridge-digital --dry-run
--: line 1: neo: command not found
```

| Result | Detail |
|--------|--------|
| **Exit code** | 127 |
| **Outcome** | **BLOCKED** — `neo` CLI not available |

### 4.3 `neo install manifest platform-northbridge-digital --org org-northbridge-digital --dry-run`

```text
$ neo install manifest platform-northbridge-digital --org org-northbridge-digital --dry-run
--: line 1: neo: command not found
```

| Result | Detail |
|--------|--------|
| **Exit code** | 127 |
| **Outcome** | **BLOCKED** — `neo` CLI not available |

---

## 5. Environment Prerequisites Check

| Prerequisite | Expected | Observed | Impact |
|--------------|----------|----------|--------|
| Website validation target | `northbridge-venture-group` @ `/workspace` | Present | OK |
| `neo.config.json` installer wiring | `neoPath` → local NEO repo | Added (`../neo`) | OK (config only) |
| Local NEO central repository | Sibling checkout at `/neo` | **Missing** | Blocks all CLI steps |
| `neo` platform installer CLI | On `PATH` or via `neoPath` | **Missing** | Blocks all CLI steps |
| `platform-northbridge-digital` manifest | In NEO repo manifests | Not reachable | Cannot validate |
| `org-northbridge-digital` org context | Recognized by installer | Not reachable | Cannot plan/install |

### NEO repository discovery

The following were searched and **not found** in this cloud environment:

- Filesystem paths: `/neo`, `/workspace/../neo`, `/opt`, `/home/ubuntu`, `/tmp`
- GitHub org `AviatorNetwork-code` repos: `neo`, `neos`, `NEO`, `northbridge-digital-platform`, `northbridge-engineering-operations`
- Global `neo` binary, npm packages `@neos/cli`, `@northbridge/neo`, `northbridge-neo`
- Git history in website repo for `neo manifest`, `neoPath`, `platform-northbridge-digital`

The website repo contains a **lightweight NEO client adapter** (`scripts/neo-report.mjs`, session/repo-status schemas) but not the central NEO platform installer.

---

## 6. UX Observations (Config-Layer Only)

Because the `neo` CLI could not be invoked, installer UX could only be assessed at the **client configuration layer**:

| Area | Observation | Severity |
|------|-------------|----------|
| **Target repo clarity** | Website repo is a well-defined, existing install target with prior `.northbridge` adapter work | Low risk |
| **Config discoverability** | `.northbridge/neo.config.json` already exists; installer block extends it without breaking adapter fields | Low risk |
| **Path convention** | `../neo` sibling layout is conventional but undocumented in-repo; resolves to `/neo` here | Medium — needs documented clone/setup step |
| **Schema reference** | `$schema` points to missing `neo.config.schema.json` — no IDE/runtime validation of installer fields | Medium |
| **Prerequisite gap** | No in-repo signal when NEO checkout or CLI is absent; failure is a shell `command not found` | High — poor operator UX |
| **Manifest/org IDs** | `platform-northbridge-digital` / `org-northbridge-digital` are specified only in this validation branch config, not verified against a manifest registry | Unknown until NEO repo available |

### What was intentionally not done

- No website build or redesign
- No `neo install` without `--dry-run`
- No NEOS package installation onto the website repo
- No modification to public pages (`app/digital`, etc.)

---

## 7. Validation Verdict

| Step | Status |
|------|--------|
| Locate existing Northbridge Digital website repo | **PASS** |
| Confirm path, branch, status | **PASS** |
| Add `.northbridge/neo.config.json` installer wiring | **PASS** (config change on feature branch) |
| `neo manifest validate …` | **BLOCKED** (exit 127) |
| `neo manifest plan … --dry-run` | **BLOCKED** (exit 127) |
| `neo install manifest … --dry-run` | **BLOCKED** (exit 127) |

**Overall (Run 1): INCOMPLETE — blocked on missing NEO central repository and `neo` CLI.**

---

## 8. NEO Bootstrap Attempt (Run 2)

Run 2 attempted to bootstrap the NEO central repository inside the cloud validation environment per the expected layout:

| Step | Command / action | Result |
|------|------------------|--------|
| 1 | `sudo mkdir -p /neo && sudo chown ubuntu:ubuntu /neo` | **PASS** — `/neo` writable |
| 2 | `git clone https://github.com/AviatorNetwork-code/northbridge-engineering-operating-system.git /neo` | **FAIL** — `remote: Repository not found` (exit 128) |
| 3 | `gh repo clone AviatorNetwork-code/northbridge-engineering-operating-system /neo` | **FAIL** — GraphQL: Could not resolve to a Repository |
| 4 | `gh api repos/AviatorNetwork-code/northbridge-engineering-operating-system` | **FAIL** — HTTP 404 |
| 5 | `curl -sI https://github.com/AviatorNetwork-code/northbridge-engineering-operating-system` | **FAIL** — HTTP 404 |
| 6 | GraphQL inventory of `AviatorNetwork-code` repositories | Only 3 repos visible (see below) |
| 7 | Install NEO dependencies in `/neo` | **SKIPPED** — no checkout |
| 8 | Build `packages/neo-cli` | **SKIPPED** — no checkout |
| 9 | Verify `neo` CLI | **SKIPPED** — no checkout |
| 10 | Re-run dry-run installer commands from `/workspace` | **SKIPPED** — `neo` unavailable |

### GitHub account inventory (`AviatorNetwork-code`)

GraphQL query on 2026-07-07 returned only these repositories:

| Repository | Private | Updated |
|------------|---------|---------|
| `northbridge-venture-group` | no | 2026-07-03 |
| `airtax-financial` | no | 2026-03-13 |
| `royal-international-flight-school` | no | 2026-02-05 |

`northbridge-engineering-operating-system` is **not present** in this account (public or private) with the cloud-agent GitHub token in use.

### Failure classification (Run 2)

| Category | Applies? | Evidence |
|----------|----------|----------|
| **Missing NEO repo** | **YES** | Clone returns `Repository not found`; GitHub API 404; not in account repo list |
| Missing CLI build | No (not reached) | Cannot install/build without checkout |
| Missing env vars | No evidence | No installer env vars referenced before clone failure |
| Missing connector credentials | No evidence | Clone fails before any connector/auth step |
| Installer validation issue | No (not reached) | `neo` commands never executed |

**Primary blocker: missing NEO repo** — the expected GitHub remote does not exist or is not accessible to this cloud agent.

### Planned `neo` invocation (once `/neo` is cloned)

When the NEO checkout is available, use one of:

```bash
# Option A — add neo-cli bin to PATH for the session
export PATH="/neo/packages/neo-cli/bin:$PATH"
cd /workspace

# Option B — direct bin path (if present after build)
/neo/packages/neo-cli/bin/neo --version

# Option C — package manager script from NEO repo root (if defined)
cd /neo && npm run neo -- --version
```

Then from `/workspace`:

```bash
neo manifest validate platform-northbridge-digital
neo manifest plan platform-northbridge-digital --org org-northbridge-digital --dry-run
neo install manifest platform-northbridge-digital --org org-northbridge-digital --dry-run
```

---

## 9. Unblock Checklist (for follow-up run)

1. **Create or publish** `AviatorNetwork-code/northbridge-engineering-operating-system` on GitHub, or grant the Cursor cloud-agent GitHub app read access if the repo is private under another owner.
2. Clone to `/neo`:
   ```bash
   git clone https://github.com/AviatorNetwork-code/northbridge-engineering-operating-system.git /neo
   ```
3. In `/neo`: install dependencies, build `packages/neo-cli`, verify `neo --version`.
4. Expose CLI to `/workspace` sessions (`export PATH="/neo/packages/neo-cli/bin:$PATH"` or documented equivalent).
5. Provide `.northbridge/neo.config.schema.json` (from NEO repo) so installer fields are schema-validated.
6. Re-run from `/workspace`:

   ```bash
   neo manifest validate platform-northbridge-digital
   neo manifest plan platform-northbridge-digital --org org-northbridge-digital --dry-run
   neo install manifest platform-northbridge-digital --org org-northbridge-digital --dry-run
   ```

7. Update this document with CLI stdout/stderr, plan diff summary, and installer UX notes (error messages, dry-run clarity, idempotency signals).

---

## 10. Validation Verdict (Run 2)

| Step | Status |
|------|--------|
| Create `/neo` mount path | **PASS** |
| Clone NEO repo | **FAIL** — repository not found |
| Install NEO dependencies | **SKIPPED** |
| Build `neo` CLI | **SKIPPED** |
| `neo manifest validate …` | **SKIPPED** (blocked) |
| `neo manifest plan … --dry-run` | **SKIPPED** (blocked) |
| `neo install manifest … --dry-run` | **SKIPPED** (blocked) |

**Overall (Run 2): INCOMPLETE — blocked on missing NEO repo at the expected GitHub remote.**

---

## 11. Artifacts

| Artifact | Location |
|----------|----------|
| Installer config change | `.northbridge/neo.config.json` |
| This validation report | `docs/validation/NB-VAL-001-NDP-INSTALLER-UX.md` |
| Feature branch | `cursor/ndp-installer-ux-validation-2cd0` |
