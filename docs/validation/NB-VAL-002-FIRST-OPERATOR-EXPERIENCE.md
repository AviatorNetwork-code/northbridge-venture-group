# NB-VAL-002 — First Operating Company Installer UX Validation

**Mission:** Validate the experience of consuming NEO from this operating-company product repo (Northbridge Venture Group / Northbridge Digital website).

**Constraints honored:** No changes to NEO. No website redesign. No real install. Dry-run only. This document is validation-only; no product or NEO behavior was modified.

**Validated at:** 2026-07-07T22:15Z (UTC)

---

## 1. Repo context

| Field | Value |
| --- | --- |
| Repo path | `/workspace` |
| Remote | `github.com/AviatorNetwork-code/northbridge-venture-group` |
| Branch (validation) | `cursor/nb-val-002-first-operator-experience-24b8` (off `main`) |
| Base commit | `ebc8a3a` |
| Working tree | clean at validation start |

```bash
$ pwd
/workspace
$ git rev-parse --abbrev-ref HEAD
cursor/nb-val-002-first-operator-experience-24b8
$ git status
On branch cursor/nb-val-002-first-operator-experience-24b8
nothing to commit, working tree clean
```

---

## 2. `.northbridge/neo.config.json`

**Status: EXISTS** — no minimal config needed to be created.

```bash
$ ls -la .northbridge/
neo.config.json
repo-status.schema.json
session-report.schema.json
```

Key fields (`.northbridge/neo.config.json`):

- `client.id`: `northbridge-website`, `displayName`: `Northbridge Website`
- `adapter.kind`: `neo-client-lightweight` — "Local JSON session and repo-status reports for NEO ingestion (no runtime, no live API)."
- `ingest.mode`: `local-only`, `ingest.liveApiEnabled`: `false`
- `ingest.apiEndpointPlaceholder`: `https://neo.northbridgeventuregroup.com/api/v1/ingest/session-report`
- `ingest.apiEndpointNote`: "Not active. Future NEO central ingest will accept session-report.schema.json payloads with service credentials issued by Northbridge Intelligence Team."

**Minor finding:** the config's `$schema` points to `./neo.config.schema.json`, which does **not** exist in `.northbridge/`. Only `session-report.schema.json` and `repo-status.schema.json` are present. This is a dangling reference (non-blocking for reporting, but confusing to a new operator).

---

## 3. How this repo points to NEO

This repo consumes NEO through a **lightweight, local-only client adapter** — not through a NEO CLI, runtime, or manifest/install system.

| Mechanism | Present? | Notes |
| --- | --- | --- |
| Local NEO adapter script | Yes | `scripts/neo-report.mjs` — generates local JSON reports only (`--help` documented) |
| Adapter config | Yes | `.northbridge/neo.config.json` |
| Report schemas | Yes | `.northbridge/session-report.schema.json`, `.northbridge/repo-status.schema.json` |
| Adapter docs | Yes | `docs/neo-client-adapter.md` |
| NEO CLI (`neo`) | **No** | Not installed anywhere on this machine |
| NEO repo / runtime path | **No** | No NEO repo, package, or runtime present |
| Manifest concept (`platform-northbridge-digital`) | **No** | No manifest file/registry anywhere in repo or system |
| Org concept (`org-northbridge-digital`) | **No** | Not referenced anywhere in repo |
| Live API ingest | **No** (by design) | `liveApiEnabled: false`; endpoint is a documented placeholder, explicitly "Not active" |

`docs/neo-client-adapter.md` explicitly states the adapter "Does not install any NEO runtime, copy NEO packages, or add CAT runtime." So this repo's relationship to NEO is **reporting-only / future-ingest**, by design.

---

## 4. Commands run

All four requested `neo` invocations were executed exactly as specified.

```bash
$ neo manifest validate platform-northbridge-digital
neo: command not found
[exit code: 127]

$ neo manifest plan platform-northbridge-digital --org org-northbridge-digital --dry-run
neo: command not found
[exit code: 127]

$ neo install manifest platform-northbridge-digital --org org-northbridge-digital --dry-run
neo: command not found
[exit code: 127]
```

(The task listed three `neo ...` commands under "Run:"; all three were run. There is no fourth distinct command.)

---

## 5. What is missing (`neo` is absent)

| Requirement | Present? | Evidence |
| --- | --- | --- |
| **NEO repo path** | No | `find /` for `neo` / `neo-*` dirs → none (node_modules excluded) |
| **CLI build** (`neo` binary) | No | `which neo` → exit 1; `command -v neo` → empty; no `neo` in any global/local bin |
| **PATH** | No | `neo` not on `$PATH` (`/usr/local/cargo/bin:/exec-daemon:...:/usr/bin:/bin`) |
| **Credentials** | No | No `NEO_*` / `NORTHBRIDGE_*` env vars set; config notes future service credentials are "issued by Northbridge Intelligence Team" and none are provisioned |

```bash
$ which neo; echo "exit: $?"
exit: 1
$ command -v neo            # (empty)
$ env | grep -iE 'neo|northbridge'   # (empty)
```

**Root blocker:** There is no NEO CLI, no NEO runtime, and no manifest/install subsystem available to this repo. The only NEO integration surface that exists here is the local reporting adapter (`node scripts/neo-report.mjs`), which is unrelated to `neo manifest`/`neo install`.

---

## 6. Installer UX evaluation

Because `neo` is not installed, the "installer UX" being evaluated is effectively the **failure/first-contact UX** a new operator hits.

- **Are errors understandable?** Partially. `neo: command not found` (exit 127) is a standard shell error and technically clear, but it comes from the shell, **not** from NEO. It gives the operator zero guidance: no install instructions, no link, no hint that a NEO CLI is even expected. An operator who was told "consume NEO from this repo" gets no bridge from the repo's docs to an actual `neo` tool.
- **Are connector credential requirements clear?** No. Nothing in the repo enumerates required connector credentials for an install. `neo.config.json` only mentions future ingest "service credentials issued by Northbridge Intelligence Team" with no scopes, names, env-var conventions, or request process. There is no `.env.example` or credential checklist.
- **Is the dry-run honest?** Cannot be exercised — the CLI never runs, so no plan/dry-run output is produced. The `--dry-run` flag is passed straight through to a non-existent binary. (The one honest, working dry-run in this repo is the unrelated `node scripts/neo-report.mjs --dry-run` reporting path.)
- **Would a new operator know what to do next?** No. Repo docs describe only the local reporting adapter. There is no "install NEO CLI", no NEO repo pointer, no version pin, and no `platform-northbridge-digital` / `org-northbridge-digital` manifest to point at. A new operator following the mission would be stuck immediately after the first command.

### UX Score

**2 / 10** — First-operator installer experience.

Rationale: The repo has clean, well-documented *reporting* integration, but for the *installer* journey the operator hits an immediate dead end (`command not found`) with no discoverability path to obtain, configure, or authenticate the `neo` CLI, and no manifest/org objects to target. The +2 (rather than 0) credits that the config and adapter docs are honest about being local-only and clearly signal that live NEO is "not active yet."

---

## 7. Recommended fixes

Prioritized, non-destructive, and scoped to this product repo (NEO itself untouched):

1. **Bridge doc from adapter → real NEO CLI.** In `docs/neo-client-adapter.md`, add a short "Consuming NEO (CLI)" section that states plainly whether the `neo` CLI is expected in this repo yet. Today it is not, so say so and link to where the CLI/manifest workflow will live.
2. **Pin the NEO source.** Record the NEO repo path/URL and required CLI version (e.g., in `neo.config.json` under a new `cli` block or a `docs/neo-cli.md`). A new operator should be able to find and build/install `neo` from the repo alone.
3. **Provide install + PATH guidance.** Add explicit install steps (how to build the CLI, where it lands, how to add it to `PATH`) so `neo manifest validate ...` is runnable.
4. **Document connector credentials.** Add a credentials checklist / `.env.example` listing the exact env var names, scopes, and the request path ("issued by Northbridge Intelligence Team"), instead of a single prose sentence.
5. **Define the manifest/org objects.** There is no `platform-northbridge-digital` manifest or `org-northbridge-digital` reference anywhere. Add (or link to) the manifest that these commands are supposed to target, or document that manifests live in the NEO repo and how to reference them.
6. **Fix the dangling `$schema` reference.** `neo.config.json` references `./neo.config.schema.json`, which is absent. Either add the schema file or update the `$schema` to a valid location.
7. **Improve first-contact error UX (NEO-side follow-up, out of scope here).** Track separately: when NEO is expected but missing, a wrapper/README snippet could detect `command not found` and print install guidance rather than leaving the operator with a bare shell error.

---

## Summary of return items

- **Commands run:** the 3 `neo manifest validate` / `neo manifest plan --dry-run` / `neo install manifest --dry-run` invocations (§4), plus discovery commands (§1, §3, §5).
- **Outputs:** all `neo` commands → `neo: command not found`, exit 127.
- **Blockers:** no NEO CLI, no NEO repo/runtime, no manifest/org objects, no credentials, `neo` not on PATH; dangling `$schema` in config.
- **UX score:** 2 / 10 for the first-operator installer experience.
- **Recommended fixes:** see §7 (bridge doc, pin NEO source, install/PATH guidance, credential checklist, define manifest/org objects, fix `$schema`, improve missing-CLI error UX).
