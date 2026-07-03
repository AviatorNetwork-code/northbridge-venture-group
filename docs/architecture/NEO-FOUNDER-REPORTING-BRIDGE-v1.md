# Founder Reporting Bridge (FRB) v1

**Package:** `@neos/founder-reporting-bridge`  
**Capability ID:** `neos.founder-reporting-bridge`  
**Repository:** NEOS — Northbridge Engineering Operating System  
**Mode:** Read-only · Reports only · Founder approval required

---

## 1. Purpose

NEO stops being passive. It actively briefs the Founder when important engineering, product, customer, or business intelligence changes occur — via **structured Slack reports**.

The bridge is **read-only**:

- Does not execute tasks
- Does not approve work
- Does not modify product repos
- Does not expose secrets or customer private data
- Does not send private code

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Connected Northbridge Repos                         │
│  Aviator NEO · Quadrix NEO · Website NEO · Founder Dashboard        │
│  Executive Intelligence · CEI · CAT Analytics · PCB · Memory        │
└───────────────────────────────┬─────────────────────────────────────┘
                                │ read-only inputs
                ┌───────────────▼────────────────┐
                │  Founder Reporting Bridge       │
                │  Aggregate → Classify → Format  │
                └───────────────┬────────────────┘
                                ▼
                     Slack (channel or DM)
                     Future: email · push · dashboard
```

### Package layout

```
packages/founder-reporting-bridge/
├── cli.mjs
├── src/
│   ├── core/founderReportingBridge.ts
│   ├── engines/          # Brief, alert, priority
│   ├── formatters/       # Slack markdown-safe
│   ├── delivery/         # Webhook / bot API
│   ├── adapters/         # Report source aggregation
│   └── governance/
├── examples/payloads/
└── tests/
```

---

## 3. Report sources

| Source ID | Origin |
|-----------|--------|
| `aviator_network_neo` | Aviator Network NEO reports |
| `quadrix_neo` | Quadrix NEO reports |
| `northbridge_website_neo` | Northbridge Website NEO reports |
| `founder_dashboard` | Founder Dashboard outputs |
| `executive_intelligence` | Executive Intelligence recommendations |
| `customer_experience_intelligence` | CEI reports |
| `cat_website_analytics` | CAT analytics summaries |
| `product_capability_broker` | PCB findings |
| `institutional_memory` | Institutional Memory updates |

---

## 4. Report types

1. **Daily Founder Brief**
2. **Critical Alert**
3. **Product Intelligence Report**
4. **CAT Conversation Summary**
5. **Engineering Session Summary**
6. **Pending Founder Decisions**
7. **Weekly Northbridge Report**

---

## 5. Priority levels

| Priority | Cadence |
|----------|---------|
| `critical` | Send immediately |
| `high` | Same-day report |
| `normal` | Daily digest |
| `low` | Weekly digest |

---

## 6. Daily Founder Brief sections

- What changed today
- Highest-value recommendation
- Pending decisions
- Product health
- CAT / customer insights
- Engineering progress
- Risks
- Next suggested action

---

## 7. Critical alerts

Triggered for:

- Broken build
- Failed deployment
- High-impact customer friction
- Missing conversion path
- AI cost spike
- Security / governance concern
- Blocked high-priority mission

---

## 8. Slack configuration

Environment variables only — **no hardcoded webhooks**.

```bash
export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/..."
# OR
export SLACK_BOT_TOKEN="xoxb-..."
export SLACK_CHANNEL_ID="C..."

# Preview without sending
export FOUNDER_REPORTING_DRY_RUN=true
```

### CLI

```bash
node packages/founder-reporting-bridge/cli.mjs --daily --dry-run
node packages/founder-reporting-bridge/cli.mjs --weekly --dry-run
node packages/founder-reporting-bridge/cli.mjs --critical --message "Aviator build failed" --dry-run
```

---

## 9. Governance

```typescript
FRB_GOVERNANCE = {
  readOnly: true,
  allowsTaskExecution: false,
  allowsWorkApproval: false,
  allowsProductRepoModification: false,
  allowsSecretExposure: false,
  allowsCustomerPrivateData: false,
  requiresFounderApprovalForActions: true,
};
```

Content sanitization blocks secrets, credentials, and sensitive patterns before delivery.

---

## 10. Testing

```bash
npm run build:frb
npm run test:frb
```

---

## 11. Safest next implementation step

### Thin Slack emitter in existing repos (read-only, env-only)

Connect FRB to existing Slack setups **without duplicating webhook logic**:

1. **Northbridge Website** — add `scripts/emit-neo-daily-brief.mjs` that:
   - Imports `@neos/founder-reporting-bridge`
   - Reads NEO export JSON from `lib/cat/neoIntegration` (anonymous session summaries only)
   - Maps to `ReportSourceInput[]` — no PII, no code
   - Calls `cli.mjs --daily --dry-run` in CI first; enable live send only when `SLACK_WEBHOOK_URL` is set in GitHub Actions secrets

2. **Aviator Network** — same pattern with Aviator-specific NEO report adapter

3. **Do NOT** embed webhook URLs in repos — use GitHub Actions / Vercel env secrets only

4. **Start with `--dry-run` in CI** on every main merge; Founder manually promotes to live Slack when payload format is approved

This is the safest path: reuse existing Slack infrastructure, validate payloads in CI, and keep all credentials in environment secrets.

---

## 12. Recommended future capability

**Founder Command Center v1** — two-way bridge where Founder can acknowledge decisions in Slack (still read-only execution; approvals queue for human action only).
