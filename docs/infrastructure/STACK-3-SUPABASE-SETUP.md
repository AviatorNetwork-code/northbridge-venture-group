# Stack 3 — Supabase Setup for Digital Assessment Leads

**Status:** Implementation guide  
**Applies when:** Persisting assessment submissions to `digital_assessment_leads`

No Supabase project was configured in the repo at Stack 3 implementation time. Runtime code degrades gracefully when credentials are missing.

---

## 1. Create Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. Note the **Project URL** and **service role** key (Settings → API).
3. Do **not** commit keys to the repository.

---

## 2. Apply migration

Run the SQL in:

```
supabase/migrations/20250622100000_digital_assessment_leads.sql
```

Via Supabase SQL editor or CLI:

```bash
supabase db push
```

---

## 3. Vercel environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server-side inserts and admin reads (keep secret) |
| `ADMIN_ACCESS_TOKEN` | Yes (prod) | Shared token for `/admin` access |
| `SLACK_WEBHOOK_URL` | No | Slack notifications (optional) |

`NEXT_PUBLIC_SUPABASE_URL` may be used instead of `SUPABASE_URL` if preferred.

---

## 4. Row Level Security

Stack 3 uses the **service role** key only on the server. Do not expose the service role key to the browser.

Recommended:

- Enable RLS on `digital_assessment_leads`
- No public policies (service role bypasses RLS)

Example (optional hardening):

```sql
alter table public.digital_assessment_leads enable row level security;
```

---

## 5. Admin access

1. Set a strong `ADMIN_ACCESS_TOKEN` in Vercel.
2. Visit `/admin/login` and sign in with the token.
3. Review leads at `/admin/digital-leads`.

**Production guard:** If `ADMIN_ACCESS_TOKEN` is unset in production, `/admin/*` redirects to `/` (not publicly exposed).

**TODO:** Replace shared-token cookie auth with SSO or Supabase Auth before broad team use.

---

## 6. Failure behavior

| Condition | Public assessment | Slack | Database |
|-----------|-------------------|-------|----------|
| Supabase not configured | Success | Works if configured | Skipped, warning logged |
| Insert fails | Success | Works if configured | Warning logged |
| Slack not configured | Success | Skipped | Works if configured |
| Admin not configured (prod) | N/A | N/A | Routes hidden |

Public API response shape is unchanged. `evidence[]` and lead IDs are **not** returned to clients.

---

## 7. Verification

1. Submit `/digital/assessment` with Supabase configured.
2. Confirm row in `digital_assessment_leads`.
3. Confirm Slack message includes **Lead ID** when stored.
4. Open `/admin/digital-leads/{id}` after admin login.

Run `npm run lint` and `npm run build` after env changes.

For production deployment checklist and smoke tests, see `docs/infrastructure/STACK-4-PRODUCTION-CHECKLIST.md`.
