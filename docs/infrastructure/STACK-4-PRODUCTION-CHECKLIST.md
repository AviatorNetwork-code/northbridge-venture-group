# Stack 4 — Production Checklist

**Status:** Active  
**Applies to:** Northbridge Venture Group site + Northbridge Digital assessment funnel

Use this checklist before and after each production deployment.

---

## 1. Vercel environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `SUPABASE_URL` | Yes (persistence) | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes (persistence) | Server-side lead storage and admin reads — **secret** |
| `ADMIN_ACCESS_TOKEN` | Yes (admin) | Shared token for `/admin/login` — **secret** |
| `SLACK_WEBHOOK_URL` | No | Internal Slack notifications for new assessments |
| `RESEND_API_KEY` | Yes (contact) | Contact form email delivery |
| `RESEND_FROM_EMAIL` | Yes (contact) | Verified sender for Resend |
| `CONTACT_TO_EMAIL` | No | Contact form recipient override |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical site URL for metadata |
| `SMOKE_BASE_URL` | No | Override for smoke script (defaults to `http://localhost:3000`) |

Never commit secret values. Set all production secrets in Vercel only.

---

## 2. Supabase migrations

Apply in order via Supabase SQL editor or CLI:

1. `supabase/migrations/20250622100000_digital_assessment_leads.sql`
2. `supabase/migrations/20250622110000_lead_status_workflow.sql`

Verify table exists:

```sql
select id, created_at, lead_category, status from digital_assessment_leads limit 5;
```

See also: `docs/infrastructure/STACK-3-SUPABASE-SETUP.md`

---

## 3. Admin access

| Item | Value |
|------|-------|
| Login | `/admin/login` |
| Lead list | `/admin/digital-leads` |
| Lead detail | `/admin/digital-leads/{id}` |

**Production guard:** If `ADMIN_ACCESS_TOKEN` is unset, `/admin/*` redirects to `/`.

**TODO:** Replace shared-token cookie auth with SSO or Supabase Auth before broad team use. Do not reuse this pattern for client portals.

---

## 4. Lead workflow statuses (internal)

`new` → `reviewed` → `contacted` → `proposal_needed` → `proposal_sent` → `closed_won` / `closed_lost`

Updated from the lead detail page. Internal only — never shown on public assessment UI.

---

## 5. Pre-deploy verification

```bash
npm run lint
npm run build
npm run start
```

In a second terminal:

```bash
npm run smoke:public
```

Against production after deploy:

```bash
SMOKE_BASE_URL=https://northbridgeventuregroup.com npm run smoke:public
```

### Smoke assertions

| Route | Check |
|-------|-------|
| `/` | HTTP 200 |
| `/ventures` | Owned venture cards present; **no** Northbridge Digital venture card |
| `/services` | Contains Northbridge Digital |
| `/digital` | HTTP 200 |
| `/digital/assessment` | Assessment loads; no internal score/evidence copy |

---

## 6. Post-deploy manual checks

1. Submit a test assessment on `/digital/assessment`.
2. Confirm row in `digital_assessment_leads` (Supabase).
3. Confirm Slack notification (if configured) includes Lead ID.
4. Sign in at `/admin/login` and review lead in Call Prep section.
5. Update workflow status and internal notes.
6. Confirm public success screen does **not** show score or evidence.

---

## 7. Protection rules (unchanged)

- Assessment scoring remains deterministic in `lib/assessment/`.
- Public users never see score, category labels, evidence, or internal notes.
- Quotes and proposals require human review — no auto-pricing.

---

## Related documents

- `AGENTS.md`
- `docs/business/NBS-201-DIGITAL-ASSESSMENT-STANDARD.md`
- `docs/infrastructure/STACK-3-SUPABASE-SETUP.md`
