# @northbridge/neo-bridge

Installable NEO communication bridge for Northbridge product repositories.

Products **report** session outcomes to NEO. NEO remains the **only writer** of organizational knowledge. War Room updates are disabled by default.

## Install (product repository)

```bash
pnpm add file:../NEOS\ -\ Northbridge\ Engineering\ Operating\ System/packages/platform/neo-bridge
```

## Product setup

1. Create `.northbridge/neo-bridge.json` (see schema in `schemas/neo-bridge.schema.json`)
2. Store Session Reports in the configured `sessionReportPath`
3. Add script:

```json
{
  "scripts": {
    "send-neo": "northbridge-send-neo"
  }
}
```

## Usage

```bash
pnpm send-neo
pnpm send-neo --level 3
pnpm send-neo --report .northbridge/session-reports/2026-07-05.md
pnpm send-neo --dry-run
```

## Learning levels

| Level | Label |
|------:|-------|
| 1 | Micro Change |
| 2 | Small Improvement |
| 3 | Standard Task |
| 4 | Major Feature |
| 5 | Strategic Milestone |

## Governance

- Product repos never write organizational knowledge directly
- `supportsWarRoom: false` by default
- Pipeline execution runs in NEOS via `tools/neo-learning-pipeline.mjs`

## Documentation

See [NEO Bridge Installable Package](../../docs/platform/NEO-BRIDGE-INSTALLABLE-PACKAGE.md) in NEOS.
