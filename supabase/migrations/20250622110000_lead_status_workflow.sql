-- Stack 4: normalize legacy lead statuses for workflow expansion

update public.digital_assessment_leads
set status = 'reviewed'
where status = 'reviewing';

update public.digital_assessment_leads
set status = 'closed_lost'
where status = 'closed';

comment on column public.digital_assessment_leads.status is
  'Workflow: new, reviewed, contacted, proposal_needed, proposal_sent, closed_won, closed_lost';
