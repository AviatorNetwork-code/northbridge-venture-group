# Role Matrix

**Status:** Active (Stack 6)  
**Owner:** Northbridge Venture Group

---

## Purpose

Define who may access Northbridge systems at a high level. Implement least privilege; grant only what each role requires.

**Legend:** ✅ Allowed | ⚠️ Limited / case-by-case | ❌ Not allowed | 🔧 Platform owner only

---

## Roles

| Role | Description |
|------|-------------|
| **Owner** | Founding operator; full infrastructure and IP authority |
| **Admin** | Trusted operator; production deploy and secrets management |
| **Developer** | Engineering contributor; PR-based repo access |
| **Contractor** | Time-bound external contributor; scoped access per contract |
| **Marketing** | Public site content; no admin or database |
| **Read-only** | Observe repo or docs without write access |

---

## System access matrix

| System / capability | Owner | Admin | Developer | Contractor | Marketing | Read-only |
|---------------------|-------|-------|-----------|------------|-------------|-----------|
| GitHub repo read | ✅ | ✅ | ✅ | ⚠️ scoped | ⚠️ | ✅ |
| GitHub repo write (branch) | ✅ | ✅ | ✅ | ⚠️ scoped | ❌ | ❌ |
| GitHub merge to `main` | ✅ | ✅ | ⚠️ with review | ⚠️ with review | ❌ | ❌ |
| GitHub org admin | 🔧 | ❌ | ❌ | ❌ | ❌ | ❌ |
| Vercel deploy / env | ✅ | ✅ | ⚠️ preview | ❌ | ❌ | ❌ |
| Vercel production secrets | 🔧 | ✅ | ❌ | ❌ | ❌ | ❌ |
| Supabase dashboard | ✅ | ✅ | ⚠️ read/dev | ⚠️ task-only | ❌ | ❌ |
| Supabase service role key | 🔧 | ✅ | ❌ | ❌ | ❌ | ❌ |
| `/admin` digital leads | ✅ | ✅ | ⚠️ | ❌ | ❌ | ❌ |
| `ADMIN_ACCESS_TOKEN` | ✅ | ✅ | ⚠️ | ❌ | ❌ | ❌ |
| Slack workspace | ✅ | ✅ | ✅ | ⚠️ guest | ⚠️ | ❌ |
| Google Workspace | ✅ | ✅ | ⚠️ | ⚠️ | ⚠️ | ❌ |
| Domain / DNS | 🔧 | ⚠️ | ❌ | ❌ | ❌ | ❌ |
| Resend / email API keys | 🔧 | ✅ | ❌ | ❌ | ❌ | ❌ |
| NBS / NKS / security docs (read) | ✅ | ✅ | ✅ | ⚠️ scoped | ⚠️ | ⚠️ |
| NBS / NKS (edit) | ✅ | ✅ | ✅ | ⚠️ scoped | ⚠️ marketing only | ❌ |
| Client / lead PII export | ✅ | ✅ | ⚠️ need-to-know | ❌ | ❌ | ❌ |

---

## Data classification quick reference

| Class | Examples | Who reads | Who publishes externally |
|-------|----------|-----------|--------------------------|
| **Public** | Marketing pages, published case studies | Anyone | Marketing + Owner approval |
| **Internal** | NBS, NKS, security docs, assessment logic docs | Dev + Admin + scoped contractors | ❌ |
| **Confidential** | Lead records, contact submissions, admin notes | Admin + need-to-know | ❌ |
| **Secret** | API keys, tokens, service role keys | Admin / Owner only | ❌ |

---

## GitHub branch protection (required settings)

Applies to all roles except emergency break-glass by Owner:

| Setting | Value |
|---------|-------|
| Protect `main` | On |
| Require pull request | On |
| Require approvals | ≥ 1 |
| Dismiss stale reviews | Recommended |
| Require status checks | When CI configured |
| Allow force pushes | Off |
| Allow deletions | Off |

---

## Review cadence

| Activity | Frequency |
|----------|-----------|
| Access review (all roles) | Quarterly |
| Contractor access audit | End of each engagement |
| Secret rotation after offboarding | Every offboarding |
| Role matrix update | When systems or roles change |

---

## Related documents

- [ACCESS-CONTROL-STANDARD.md](./ACCESS-CONTROL-STANDARD.md)
- [CONTRACTOR-ACCESS-STANDARD.md](./CONTRACTOR-ACCESS-STANDARD.md)
- [OFFBOARDING-CHECKLIST.md](./OFFBOARDING-CHECKLIST.md)
