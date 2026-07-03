# @neos/founder-reporting-bridge

Read-only bridge connecting NEO intelligence to Founder Slack briefings.

## Quick start

```bash
# Build first
npm run build --workspace=@neos/founder-reporting-bridge

# Preview daily brief (no Slack credentials required)
node packages/founder-reporting-bridge/cli.mjs --daily --dry-run

# Preview weekly report
node packages/founder-reporting-bridge/cli.mjs --weekly --dry-run

# Preview critical alert
node packages/founder-reporting-bridge/cli.mjs --critical --message "Aviator build failed" --dry-run
```

## Environment variables

| Variable | Purpose |
|----------|---------|
| `SLACK_WEBHOOK_URL` | Incoming webhook (preferred for v1) |
| `SLACK_BOT_TOKEN` | Bot token (alternative) |
| `SLACK_CHANNEL_ID` | Channel for bot delivery |
| `FOUNDER_REPORTING_DRY_RUN` | `true` to preview without sending |
| `FOUNDER_REPORTING_PREVIEW` | `true` to output JSON payload |

**No hardcoded webhook URLs.**

## Documentation

See [NEO-FOUNDER-REPORTING-BRIDGE-v1.md](../../docs/architecture/NEO-FOUNDER-REPORTING-BRIDGE-v1.md).
