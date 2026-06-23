import type { LeadCategory, RecommendedSolution } from "@/lib/assessment";

export const LEAD_STATUS_VALUES = [
  "new",
  "reviewed",
  "contacted",
  "proposal_needed",
  "proposal_sent",
  "closed_won",
  "closed_lost",
] as const;

export type LeadStatusValue = (typeof LEAD_STATUS_VALUES)[number];

export const LEAD_STATUS_SET = new Set<string>(LEAD_STATUS_VALUES);

export const LEAD_STATUS_LABELS: Record<LeadStatusValue, string> = {
  new: "New",
  reviewed: "Reviewed",
  contacted: "Contacted",
  proposal_needed: "Proposal needed",
  proposal_sent: "Proposal sent",
  closed_won: "Closed won",
  closed_lost: "Closed lost",
};

export const LEAD_CATEGORY_VALUES: LeadCategory[] = [
  "Hot Lead",
  "Qualified Lead",
  "Nurture Lead",
  "Low Fit",
];

export const RECOMMENDED_SOLUTION_VALUES: RecommendedSolution[] = [
  "Launch System",
  "Customer Acquisition System",
  "Operations & Automation",
  "Business Intelligence",
  "Custom Software",
  "Business Systems Review",
];

export type LeadListFilters = {
  status?: string;
  lead_category?: string;
  recommended_solution?: string;
  q?: string;
};

export function sanitizeSearchQuery(value: string): string {
  return value.trim().replace(/[%_,]/g, " ").slice(0, 120);
}

export function parseLeadListFilters(searchParams: Record<string, string | string[] | undefined>): LeadListFilters {
  const pick = (key: string): string | undefined => {
    const raw = searchParams[key];
    const value = Array.isArray(raw) ? raw[0] : raw;
    return typeof value === "string" && value.trim() ? value.trim() : undefined;
  };

  return {
    status: pick("status"),
    lead_category: pick("lead_category"),
    recommended_solution: pick("recommended_solution"),
    q: pick("q") ? sanitizeSearchQuery(pick("q")!) : undefined,
  };
}

export function isValidLeadStatus(value: string): value is LeadStatusValue {
  return LEAD_STATUS_SET.has(value);
}
