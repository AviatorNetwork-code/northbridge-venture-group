# Northbridge Knowledge System (NKS)

**Status:** Stack 5 — infrastructure scaffold  
**Standard:** [NKS-001-NORTHBRIDGE-KNOWLEDGE-SYSTEM.md](./NKS-001-NORTHBRIDGE-KNOWLEDGE-SYSTEM.md)

---

## What this is

NKS is **what Northbridge knows** — curated knowledge for discovery, call prep, and future advisory tooling. It is not the public website and not the assessment rule engine.

| System | Role |
|--------|------|
| **NBS** | How Northbridge works (`docs/business/`) |
| **NKS** | What Northbridge knows (`docs/knowledge/`) |
| **CAT** (future) | How Northbridge reasons with NBS + NKS |

---

## How to use this folder

1. Read **NKS-001** before adding or editing entries.
2. Use templates in `docs/templates/` for new content.
3. Tag unverified content **TODO — Research Required**.
4. Do not invent industry statistics, benchmarks, or compliance claims.
5. After client engagements, add **lessons learned** and update relevant entries.

---

## Top-level index

| Folder | Purpose |
|--------|---------|
| [universal/](./universal/) | Cross-industry domains (sales, ops, finance, etc.) |
| [industries/](./industries/) | Industry playbooks |
| [constraints/](./constraints/) | Diagnostic gaps (no CRM, manual workflows, etc.) |
| [solutions/](./solutions/) | Northbridge solution categories |
| [kpis/](./kpis/) | Metric definitions |
| [software/](./software/) | Software category patterns |
| [patterns/](./patterns/) | Recurring business situations |
| [case-studies/](./case-studies/) | Verified engagement stories |
| [research/](./research/) | Research backlog |
| [glossary/](./glossary/) | Shared terminology |

---

## CAT usage (future)

When CAT is approved in a later stack, it may:

- Retrieve NKS entries by industry, constraint, or solution
- Combine NKS context with NBS rules and assessment outputs
- Flag TODO entries as non-authoritative

CAT must **not** treat TODO scaffolds as verified facts or override deterministic assessment scoring.

---

## Runtime boundary

**No application code reads NKS in Stack 5.** Wiring the site or admin UI to NKS requires separate approval and NBS update.
