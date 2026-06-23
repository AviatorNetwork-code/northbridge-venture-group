# Northbridge Security Documentation

**Status:** Stack 6 — documentation infrastructure  
**Scope:** Access control, IP protection, and operational security standards  
**Runtime:** No auth implementation in Stack 6; standards only

---

## Purpose

This folder defines how Northbridge protects systems, data, and intellectual property. These documents apply to employees, contractors, AI agents, and anyone with repository or infrastructure access.

---

## Document index

| Document | Purpose |
|----------|---------|
| [ACCESS-CONTROL-STANDARD.md](./ACCESS-CONTROL-STANDARD.md) | Least privilege, company-owned accounts, role-based access |
| [IP-PROTECTION-STANDARD.md](./IP-PROTECTION-STANDARD.md) | Proprietary NBS/NKS/CAT, code, and client data |
| [EMPLOYEE-CONTRIBUTION-STANDARD.md](./EMPLOYEE-CONTRIBUTION-STANDARD.md) | Work-for-hire, repo contributions, confidentiality |
| [CONTRACTOR-ACCESS-STANDARD.md](./CONTRACTOR-ACCESS-STANDARD.md) | Contractor onboarding, IP assignment, limited access |
| [OFFBOARDING-CHECKLIST.md](./OFFBOARDING-CHECKLIST.md) | Access removal across all platforms |
| [ROLE-MATRIX.md](./ROLE-MATRIX.md) | Who may access what |

---

## Core principles

1. **Company-owned accounts only** — production and shared services use Northbridge-owned identities, not personal accounts where avoidable.
2. **Least privilege** — grant minimum access required for the role; review periodically.
3. **No secrets in git** — API keys, tokens, and credentials live in platform secret stores only.
4. **No direct push to `main`** — changes via pull request with review.
5. **Internal data stays internal** — admin leads, assessment evidence, and proprietary docs are not public.
6. **Runtime auth changes need a separate stack** — documenting standards does not implement them.

---

## Relationship to other doc layers

| Layer | Location | Security relevance |
|-------|----------|-------------------|
| NBS | `docs/business/` | Operating rules including assessment protection |
| NKS | `docs/knowledge/` | Proprietary knowledge — not for external distribution |
| CAT | Future | Proprietary reasoning layer when implemented |
| Infrastructure | `docs/infrastructure/` | Env vars, Supabase, deployment |

---

## AI agent rules (summary)

- Do not expose proprietary docs (NBS, NKS, security standards) outside authorized contexts.
- Do not recommend sharing secrets, admin tokens, or service role keys.
- Runtime auth/security implementation requires separate approved stack.

Full rules in `AGENTS.md` Stack 6 section.

---

## Change control

Security standard updates require review by someone with **Owner** or **Admin** role (see [ROLE-MATRIX.md](./ROLE-MATRIX.md)). Implementation of controls may require infrastructure changes documented in a future stack.
