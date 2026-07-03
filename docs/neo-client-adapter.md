# NEO client adapter for Northbridge Website

This repository uses a lightweight local adapter for Northbridge Engineering Operations (NEO) reporting.

## Scope
- Emits local JSON reports only.
- Uses the `.northbridge` adapter contract for session reports and repository status snapshots.
- Does not install any NEO runtime, copy NEO packages, or add CAT runtime.
- Does not modify website behavior or the public-facing UI.

## Files
- `.northbridge/neo.config.json` defines the client identity and report settings.
- `.northbridge/session-report.schema.json` defines the session report schema.
- `.northbridge/repo-status.schema.json` defines the repository status schema.
- `scripts/neo-report.mjs` generates the reports locally.

## Usage
```bash
node scripts/neo-report.mjs --repo-status --skip-validation
node scripts/neo-report.mjs --summary "Updated website adapter" --area app --pr-comment
```

## Governance notes
- Reports contain no secrets, no customer data, and no production writes.
- The adapter is intended for local-only ingestion and should never send live API traffic from this repository.
