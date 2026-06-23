# Access Control Standard

**Status:** Active (Stack 6)  
**Owner:** Northbridge Venture Group  
**Applies to:** All personnel, contractors, and systems with Northbridge access

---

## Purpose

Define minimum access control expectations for Northbridge repositories, infrastructure, and internal tools. Stack 6 documents standards only; enforcement is via platform configuration and process.

---

## Company-owned accounts

| Rule | Requirement |
|------|-------------|
| Production services | Must use Northbridge-owned org accounts (GitHub org, Vercel team, Supabase project, domain registrar, etc.) |
| Personal accounts | Must not be sole owner of production resources |
| Shared credentials | Prohibited except where platform requires a single service account — then rotate and store in secret manager |
| Email / identity | Work access tied to company-approved identity where available |

---

## Least privilege

1. Grant the **minimum** role needed to perform assigned work.
2. **Time-bound** access for contractors — expire or remove at engagement end.
3. **Separate** production vs development privileges where platforms support it.
4. **Review** access quarterly or after role changes.
5. **Admin** roles (Supabase service role, Vercel owner, GitHub admin) limited to owners/trusted operators.

See [ROLE-MATRIX.md](./ROLE-MATRIX.md) for role definitions.

---

## GitHub

| Control | Requirement |
|---------|-------------|
| Branch protection on `main` | **Required** — enable in GitHub repository settings |
| Direct push to `main` | **Prohibited** for all contributors |
| Pull requests | **Required** for merges to `main` |
| PR review | **At least one approval** from someone other than the author (or org policy) |
| Force push to `main` | **Disabled** |
| Status checks | Enable CI/lint/build checks when configured |
| Secret scanning | Enable where available; never commit secrets |

### Contributor workflow

1. Branch from `main` (feature/fix branch).
2. Open PR with clear description.
3. Pass review and checks.
4. Squash or merge per org convention — never bypass protection rules.

---

## Application and data access

| Surface | Access level | Notes |
|---------|--------------|-------|
| Public website | Public read | No internal data in responses |
| `/digital/assessment` | Public submit | No score/evidence in UI |
| `/admin/*` | Restricted | `ADMIN_ACCESS_TOKEN` today; replace with SSO (TODO) |
| Supabase `digital_assessment_leads` | Server-only | Service role key never in client |
| Slack webhooks | Server-only env | Optional notifications |
| Resend / contact | Server-only env | Email delivery |

Admin and client lead data access is **restricted** to authorized Northbridge personnel only.

---

## Secrets management

| Do | Don't |
|----|-------|
| Store secrets in Vercel env, Supabase dashboard, GitHub Actions secrets | Commit `.env` with real values |
| Use distinct tokens per environment where possible | Share production tokens in chat or docs |
| Rotate after offboarding or suspected leak | Paste tokens in PRs, issues, or AI prompts |

Reference: `AGENTS.md` Safety section.

---

## Runtime implementation boundary

Documenting this standard **does not** implement authentication. Changes to middleware, SSO, RLS policies, or admin auth require a **separate implementation stack** with NBS update and security review.

---

## Related documents

- [ROLE-MATRIX.md](./ROLE-MATRIX.md)
- [OFFBOARDING-CHECKLIST.md](./OFFBOARDING-CHECKLIST.md)
- [IP-PROTECTION-STANDARD.md](./IP-PROTECTION-STANDARD.md)
- `docs/infrastructure/STACK-4-PRODUCTION-CHECKLIST.md`
