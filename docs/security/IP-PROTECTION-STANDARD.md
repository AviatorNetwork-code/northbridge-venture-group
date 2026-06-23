# IP Protection Standard

**Status:** Active (Stack 6)  
**Owner:** Northbridge Venture Group

---

## Purpose

Protect Northbridge intellectual property (IP) including proprietary documentation, software, assessment logic, client data, and future advisory systems (CAT).

---

## Proprietary materials

The following are **Northbridge proprietary** unless explicitly marked otherwise or released under a license:

| Asset | Location / system | External sharing |
|-------|-------------------|------------------|
| **NBS** (Northbridge Business Standards) | `docs/business/`, `AGENTS.md` | Internal only |
| **NKS** (Northbridge Knowledge System) | `docs/knowledge/` | Internal only |
| **CAT** (future advisory layer) | Not implemented | Internal only when built |
| **Security standards** | `docs/security/` | Internal only |
| **Assessment rule engine** | `lib/assessment/` | Code in private repo; behavior documented in NBS |
| **Admin lead data** | Supabase, `/admin` | Internal only; client PII protected |
| **Templates and playbooks** | `docs/templates/` | Internal only |
| **Brand and marketing copy** | `app/`, components | Public only when published on official site |

Do not publish, sell, or share proprietary docs with clients, contractors, or third parties without written authorization.

---

## Client and lead data

| Data type | Classification | Rules |
|-----------|----------------|-------|
| Assessment submissions | Business confidential | Store in Supabase; restrict admin access |
| Contact form inquiries | Business confidential | Resend delivery; no public exposure |
| Internal notes on leads | Internal only | Never render on public site |
| Scores, evidence, categories | Internal only | Never client-facing per NBS-201 |

Export of lead data for integrations requires approval and secure handling.

---

## Code and repository

- Repository is **private** under Northbridge GitHub organization control.
- Contributions are subject to [EMPLOYEE-CONTRIBUTION-STANDARD.md](./EMPLOYEE-CONTRIBUTION-STANDARD.md) and contractor IP terms.
- Open-sourcing any portion requires explicit owner approval and license review.
- Forks and copies outside org control must not contain secrets or full proprietary doc sets.

---

## AI and automation

| Rule | Detail |
|------|--------|
| No external training | Do not submit proprietary NBS/NKS content to public AI training or unsecured third-party tools without approval |
| No paste of secrets | Never include env vars, tokens, or PII in AI prompts logged externally |
| Agent output | AI-generated content based on proprietary docs remains Northbridge IP |
| Client-facing AI | Requires separate product/security review |

---

## Trademarks and brand

- "Northbridge Venture Group", "Northbridge Digital", and venture names are used consistently with public brand guidelines.
- Do not imply partnership or endorsement without authorization.

---

## Incident response (summary)

If proprietary material or secrets are exposed:

1. Revoke/rotate affected credentials immediately.
2. Remove exposed content from public channels if applicable.
3. Document incident internally.
4. Follow [OFFBOARDING-CHECKLIST.md](./OFFBOARDING-CHECKLIST.md) if personnel-related.

Detailed incident runbook may be added in a future stack.

---

## Related documents

- [ACCESS-CONTROL-STANDARD.md](./ACCESS-CONTROL-STANDARD.md)
- [CONTRACTOR-ACCESS-STANDARD.md](./CONTRACTOR-ACCESS-STANDARD.md)
- `docs/knowledge/NKS-001-NORTHBRIDGE-KNOWLEDGE-SYSTEM.md`
