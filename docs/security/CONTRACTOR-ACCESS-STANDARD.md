# Contractor Access Standard

**Status:** Active (Stack 6)  
**Owner:** Northbridge Venture Group

---

## Purpose

Define minimum requirements before contractors, freelancers, or agencies receive access to Northbridge systems or repositories.

> **Note:** Legal terms (IP assignment, confidentiality, data processing) must be executed in **written contract** before access is granted. This standard is operational; signed agreements prevail.

---

## Before access is granted

| Requirement | Status |
|-------------|--------|
| Signed agreement with **IP assignment** to Northbridge | Required |
| Signed **confidentiality / NDA** | Required |
| Defined **scope of work** and duration | Required |
| **Least-privilege** access plan per [ROLE-MATRIX.md](./ROLE-MATRIX.md) | Required |
| Emergency contact and offboarding date documented | Required |

**No repository, Vercel, Supabase, Slack, or admin access until contracts are executed.**

---

## IP assignment and confidentiality

Contractors must agree that:

1. Work product created for Northbridge (code, docs, designs, configurations) is **assigned to Northbridge** or licensed exclusively per contract.
2. **NBS, NKS, security docs, and client data** are confidential and not reused for other clients without permission.
3. Pre-existing contractor IP (tools, libraries) must be **disclosed in writing** before incorporation.
4. Contractor may not retain copies of proprietary materials after engagement ends except as law requires.

---

## Access provisioning

| System | Contractor default | Notes |
|--------|-------------------|-------|
| GitHub | Collaborator on specific repo(s) only | No org admin; branch protection applies |
| Vercel | No access unless deploy duty required | Prefer Northbridge employee deploys |
| Supabase | No access unless DB task required | Never share service role key casually |
| Slack | Guest/single-channel if needed | No `#general` with secrets |
| Google Workspace | As needed for scope | Company account preferred |
| `/admin` routes | **No** unless explicit ops task | Temporary token only with expiry |
| Domain / DNS | **No** unless explicit | Owner approval required |

Use time-limited access and remove promptly at end of engagement.

---

## Working rules

- Use **PR workflow** — no direct push to `main`.
- Do not commit secrets or client exports.
- Do not share proprietary docs outside approved channels.
- Report suspected security issues to Northbridge contact immediately.

---

## Offboarding

Complete [OFFBOARDING-CHECKLIST.md](./OFFBOARDING-CHECKLIST.md) on last day or immediately upon termination. Verify:

- GitHub access revoked
- All platform access removed
- Confirmation that local copies of proprietary materials are deleted (acknowledged in writing)

---

## Related documents

- [ACCESS-CONTROL-STANDARD.md](./ACCESS-CONTROL-STANDARD.md)
- [IP-PROTECTION-STANDARD.md](./IP-PROTECTION-STANDARD.md)
- [EMPLOYEE-CONTRIBUTION-STANDARD.md](./EMPLOYEE-CONTRIBUTION-STANDARD.md)
