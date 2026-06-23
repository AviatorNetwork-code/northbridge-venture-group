# Offboarding Checklist

**Status:** Active (Stack 6)  
**Applies to:** Employees, contractors, and anyone with Northbridge system access

---

## Purpose

Ensure access is removed promptly when a person no longer works with Northbridge. Incomplete offboarding is a security and IP risk.

**Owner:** Designated Northbridge operator (see [ROLE-MATRIX.md](./ROLE-MATRIX.md))  
**Timing:** Complete on or before last day of access; same-day for involuntary termination where possible.

---

## Personnel record

| Field | Value |
|-------|-------|
| Name | |
| Role | Employee / Contractor |
| Last day | |
| Offboarding owner | |
| Date checklist completed | |

---

## Access removal checklist

Mark each item when completed.

### Source control and deployment

- [ ] **GitHub** — Remove from org or repository collaborators; verify no personal PATs documented in shared stores
- [ ] **Vercel** — Remove from team/project; rotate deploy hooks if exposed
- [ ] **Branch protection** — Confirm no lingering bypass permissions for departed user

### Data and backend

- [ ] **Supabase** — Remove project members; review audit log if available
- [ ] **Database exports** — Confirm no personal copies of lead/client data retained (acknowledgment)

### Communication and identity

- [ ] **Slack** — Deactivate or remove from workspace/channels
- [ ] **Google Workspace** (or email) — Suspend account; transfer Drive/docs ownership if needed
- [ ] **Shared calendars / groups** — Remove from Northbridge groups

### Application secrets and APIs

- [ ] **ADMIN_ACCESS_TOKEN** — Rotate if departed person had access
- [ ] **API keys** (Resend, Slack webhook, third-party) — Rotate if shared or exposed
- [ ] **Supabase service role** — Rotate if compromised or widely shared against policy
- [ ] **Domain / DNS registrar** — Remove user access
- [ ] **Other APIs** — Remove keys tied to individual (analytics, monitoring, etc.)

### Internal tools

- [ ] **Admin login** (`/admin/login`) — Token rotated if known to user
- [ ] **Password managers / shared vaults** — Remove user from Northbridge vaults
- [ ] **Cursor / IDE team seats** — Revoke if applicable

---

## IP and data acknowledgment

Departing person acknowledges (where contractually required):

- [ ] Return or delete local clones of private repositories
- [ ] Delete local copies of NBS/NKS/security documentation not required by law
- [ ] No retention of client/lead exports

Store signed acknowledgment per HR/contractor file process.

---

## Post-offboarding verification

- [ ] Attempt login to GitHub org — should fail
- [ ] Review open PRs authored by user — close or reassign
- [ ] Document completion in internal record

---

## Emergency offboarding

If departure is urgent (security concern):

1. Revoke GitHub and Supabase access **immediately**
2. Rotate all shared secrets the person could access
3. Complete remainder of checklist within 24 hours

---

## Related documents

- [ACCESS-CONTROL-STANDARD.md](./ACCESS-CONTROL-STANDARD.md)
- [CONTRACTOR-ACCESS-STANDARD.md](./CONTRACTOR-ACCESS-STANDARD.md)
- [IP-PROTECTION-STANDARD.md](./IP-PROTECTION-STANDARD.md)
