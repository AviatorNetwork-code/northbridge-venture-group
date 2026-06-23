import type { AssessmentDecision, AssessmentPayload, ScoringEvidence } from "@/lib/assessment";
import { type LeadListFilters } from "@/lib/admin-lead-filters";
import { getSupabaseAdminClient, isSupabaseConfigured } from "@/lib/supabase/server";

export type DigitalAssessmentLeadStatus =
  | "new"
  | "reviewed"
  | "contacted"
  | "proposal_needed"
  | "proposal_sent"
  | "closed_won"
  | "closed_lost";

export type DigitalAssessmentLeadRow = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  answers: AssessmentPayload;
  total_score: number;
  lead_category: string;
  recommended_solution: string;
  suggested_call_opening: string;
  evidence: ScoringEvidence[];
  source_path: string | null;
  status: string;
  internal_notes: string | null;
};

export type StoreAssessmentLeadInput = {
  payload: AssessmentPayload;
  decision: AssessmentDecision;
  sourcePath?: string | null;
};

export async function storeAssessmentLead(
  input: StoreAssessmentLeadInput
): Promise<{ id: string } | null> {
  if (!isSupabaseConfigured()) {
    console.warn(
      "[Digital assessment] Supabase is not configured; skipping lead persistence."
    );
    return null;
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) return null;

  const { payload, decision, sourcePath } = input;

  const { data, error } = await supabase
    .from("digital_assessment_leads")
    .insert({
      name: payload.name,
      email: payload.email,
      phone: payload.phone || null,
      company: payload.company || null,
      answers: payload,
      total_score: decision.totalScore,
      lead_category: decision.category,
      recommended_solution: decision.recommendation,
      suggested_call_opening: decision.suggestedCallOpening,
      evidence: decision.evidence,
      source_path: sourcePath ?? null,
      status: "new",
    })
    .select("id")
    .single();

  if (error) {
    console.error("[Digital assessment] Failed to persist lead:", error.message);
    return null;
  }

  return data ? { id: data.id as string } : null;
}

export async function listAssessmentLeads(
  filters: LeadListFilters = {}
): Promise<DigitalAssessmentLeadRow[]> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return [];

  let query = supabase.from("digital_assessment_leads").select("*");

  if (filters.status) {
    query = query.eq("status", filters.status);
  }
  if (filters.lead_category) {
    query = query.eq("lead_category", filters.lead_category);
  }
  if (filters.recommended_solution) {
    query = query.eq("recommended_solution", filters.recommended_solution);
  }
  if (filters.q) {
    const term = `%${filters.q}%`;
    query = query.or(`name.ilike.${term},company.ilike.${term},email.ilike.${term}`);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    console.error("[Digital assessment] Failed to list leads:", error.message);
    return [];
  }

  return (data ?? []) as DigitalAssessmentLeadRow[];
}

export async function getAssessmentLeadById(id: string): Promise<DigitalAssessmentLeadRow | null> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("digital_assessment_leads")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[Digital assessment] Failed to fetch lead:", error.message);
    return null;
  }

  return (data as DigitalAssessmentLeadRow | null) ?? null;
}

export async function updateAssessmentLeadNotes(
  id: string,
  internalNotes: string
): Promise<boolean> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return false;

  const { error } = await supabase
    .from("digital_assessment_leads")
    .update({ internal_notes: internalNotes })
    .eq("id", id);

  if (error) {
    console.error("[Digital assessment] Failed to update notes:", error.message);
    return false;
  }

  return true;
}

export async function updateAssessmentLeadStatus(
  id: string,
  status: DigitalAssessmentLeadStatus
): Promise<boolean> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return false;

  const { error } = await supabase
    .from("digital_assessment_leads")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("[Digital assessment] Failed to update status:", error.message);
    return false;
  }

  return true;
}
