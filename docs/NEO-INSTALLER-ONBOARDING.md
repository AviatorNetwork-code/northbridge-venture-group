# NEO Installer Onboarding

This guide lets an operator consume **NEO** from this product repo without knowing
NEO internals. It closes the operator-onboarding gap identified in
[`docs/validation/NB-VAL-002-FIRST-OPERATOR-EXPERIENCE.md`](./validation/NB-VAL-002-FIRST-OPERATOR-EXPERIENCE.md).

> **Dry-run only.** Nothing here performs a real install. Every NEO manifest
> install is executed with `--dry-run`. The bootstrap builds/verifies the NEO
> CLI and validates the manifest so a maintainer can later run the real install
> deliberately.

---

## What is NEO?

**NEO** (Northbridge Engineering Operating System) is Northbridge's internal
platform for provisioning and operating org infrastructure via declarative
**manifests**. A manifest such as `platform-northbridge-digital` describes the
platform an org (`org-northbridge-digital`) should have, and NEO's `neo` CLI can
`validate`, `plan`, and `install` it against the org's connectors (Supabase,
GitHub, Vercel, …).

## Why does this repo consume NEO?

This repo (the Northbridge Venture Group / Northbridge Digital website) is a
**NEO consumer**: it is one of the operating-company platforms NEO manages. The
repo already ships a lightweight local **reporting** adapter (`.northbridge/` +
`scripts/neo-report.mjs`). NB-FIX-003 adds the missing **installer bootstrap** so
an operator can go from a clean checkout to a validated NEO dry-run with a single
command — without hunting for the NEO repo, build steps, or credential names.

---

## Quick start

```bash
npm run neo:bootstrap
```

That runs [`scripts/bootstrap-neo.mjs`](../scripts/bootstrap-neo.mjs), which:

1. Reads [`.northbridge/neo.config.json`](../.northbridge/neo.config.json).
2. Resolves the NEO repo path from `neo.localPath`.
3. Clones NEO from `neo.repoUrl` if it is missing.
4. Inside NEO: installs dependencies, builds the CLI, and verifies `neo` works.
5. From this repo, runs the dry-run validation commands (see below).
6. Prints a human-readable status report and the exact next command to run.

The script is **idempotent** — safe to run repeatedly. It never prints secret
values; it only reports whether each credential is set.

### Options

| Flag | Effect |
| --- | --- |
| `--skip-clone` | Do not clone NEO even if missing (use what's on disk) |
| `--skip-build` | Skip NEO install/build; use an existing build |
| `--json` | Also print the machine-readable status report |
| `--help` | Show usage |

---

## Where NEO is cloned

NEO is cloned to the path in `neo.localPath` (default
`.neo/northbridge-engineering-operating-system`, relative to this repo root).
The `.neo/` directory is **gitignored**, so the cloned NEO tree never lands in
this repo's history. Change the location by editing `neo.localPath` in
`.northbridge/neo.config.json`.

The NEO source and build commands are configured (not hard-coded) under `neo` in
that file:

```json
"neo": {
  "repoUrl": "https://github.com/AviatorNetwork-code/northbridge-engineering-operating-system.git",
  "defaultBranch": "main",
  "localPath": ".neo/northbridge-engineering-operating-system",
  "cli": { "bin": "neo", "installCommand": "npm install", "buildCommand": "npm run build", "verifyCommand": "neo --version" }
}
```

> This repo does **not** modify NEO. The bootstrap only clones and builds NEO
> locally; if NEO's real build commands differ, update the `neo.cli` block here.

---

## How to configure credentials

The dry-run plan/install need connector credentials for `org-northbridge-digital`.
Provide them via a local `.env` file (gitignored):

```bash
cp .env.example .env
# then edit .env and fill in the values
```

Required connector credentials (declared in `.northbridge/neo.config.json` under
`connectors.requiredCredentials`, mirrored in `.env.example`):

| Env var | Purpose |
| --- | --- |
| `NEOS_ORG_NORTHBRIDGE_DIGITAL_CONNECTOR_SUPABASE_PROJECT_URL` | Supabase project URL |
| `NEOS_ORG_NORTHBRIDGE_DIGITAL_CONNECTOR_SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (secret) |
| `NEOS_ORG_NORTHBRIDGE_DIGITAL_CONNECTOR_GITHUB_ACCESS_TOKEN` | GitHub access token |
| `NEOS_ORG_NORTHBRIDGE_DIGITAL_CONNECTOR_VERCEL_ACCESS_TOKEN` | Vercel access token |

**Never commit real secrets.** `.env` is gitignored; only `.env.example`
(with empty values) is tracked. Request the actual values from the Northbridge
Intelligence Team — this repo makes **no assumptions** about their contents.

---

## Dry-run validation commands

Once the CLI is available, the bootstrap runs these from this repo:

```bash
neo manifest validate platform-northbridge-digital
neo manifest plan platform-northbridge-digital --org org-northbridge-digital --dry-run
neo install manifest platform-northbridge-digital --org org-northbridge-digital --dry-run
```

## How to interpret a blocked dry-run

The report ends with **`Install blocked: yes/no`** and a list of reasons. Common
states:

| Report shows | Meaning | What to do |
| --- | --- | --- |
| `NEO repo: missing`, `Clone status: failed …` | NEO couldn't be fetched (no access / wrong URL) | Confirm access to `neo.repoUrl` (git credentials / repo visibility), then re-run |
| `CLI status: unavailable` | NEO cloned but the CLI didn't build/verify | Check the install/build output; adjust `neo.cli` commands; re-run |
| `manifest validate: invalid` | The manifest failed NEO validation | Read the note printed under "Notes"; fix the manifest in NEO; re-run |
| `MISSING <ENV VAR>` | A connector credential is not set | Fill it in `.env` (see `.env.example`); re-run |
| `Install blocked: no` | All dry-run checks passed | A maintainer can perform the real install deliberately (omit `--dry-run`) |

The report always prints a **Next command** line telling you exactly what to do
next.

## How to rerun validation

Just run it again — it's idempotent:

```bash
npm run neo:bootstrap
```

NEO is only re-cloned if missing. Use `--skip-clone` / `--skip-build` to re-run
just the validation against an existing NEO build.

---

## Why the real install is not run automatically

- **Safety:** a real `neo install manifest` mutates live org infrastructure
  (Supabase/GitHub/Vercel). That must be a deliberate, reviewed human action, not
  a side effect of onboarding.
- **Credentials:** real installs require approved connector secrets that this
  repo does not assume or store.
- **Separation of duties:** this product repo *consumes* NEO; applying changes is
  a NEO-maintainer operation. The bootstrap therefore stops at a validated
  **dry-run** and hands off with a clear next step.
