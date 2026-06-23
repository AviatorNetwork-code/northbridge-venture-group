-- Stack 3: Northbridge Digital assessment lead persistence
-- Apply via Supabase SQL editor or supabase db push when project is configured.

create table if not exists public.digital_assessment_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  company text,
  answers jsonb not null,
  total_score integer not null,
  lead_category text not null,
  recommended_solution text not null,
  suggested_call_opening text not null,
  evidence jsonb not null,
  source_path text,
  status text not null default 'new',
  internal_notes text
);

create index if not exists digital_assessment_leads_created_at_idx
  on public.digital_assessment_leads (created_at desc);

create index if not exists digital_assessment_leads_lead_category_idx
  on public.digital_assessment_leads (lead_category);

create index if not exists digital_assessment_leads_status_idx
  on public.digital_assessment_leads (status);

comment on table public.digital_assessment_leads is
  'Internal Northbridge Digital assessment submissions. Not exposed to public clients.';
