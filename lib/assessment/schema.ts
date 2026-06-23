export const FIELD_LIMITS = {
  name: 120,
  company: 160,
  email: 254,
  phone: 40,
  industry: 120,
} as const;

export const EMPLOYEE_OPTIONS = [
  { value: "1-4", label: "1–4 employees", score: 3 },
  { value: "5-9", label: "5–9 employees", score: 10 },
  { value: "10+", label: "10+ employees", score: 15 },
] as const;

export const BUSINESS_STAGE_OPTIONS = [
  { value: "idea", label: "Idea or pre-launch" },
  { value: "launching", label: "Launching (0–12 months)" },
  { value: "growing", label: "Growing and scaling" },
  { value: "established", label: "Established operation" },
] as const;

export const MAIN_NEED_OPTIONS = [
  { value: "more-customers", label: "I need more customers" },
  { value: "improve-operations", label: "I need to improve operations" },
  { value: "better-visibility", label: "I need better visibility" },
  { value: "custom-software", label: "I need custom software" },
  { value: "starting-business", label: "I'm starting my business" },
  { value: "not-sure", label: "I'm not sure" },
] as const;

export const CURRENT_SYSTEMS_OPTIONS = [
  { value: "no-crm", label: "No CRM" },
  { value: "no-analytics", label: "No analytics or reporting" },
  { value: "manual-spreadsheets", label: "Manual spreadsheets" },
  { value: "disconnected-tools", label: "Disconnected tools" },
  { value: "basic-website", label: "Basic website only" },
  { value: "crm-in-place", label: "CRM in place" },
  { value: "automation-in-place", label: "Some automation in place" },
] as const;

export const PAIN_POINT_OPTIONS = [
  { value: "lead-follow-up", label: "Leads fall through the cracks" },
  { value: "manual-work", label: "Too much repetitive manual work" },
  { value: "no-visibility", label: "No clear view of performance" },
  { value: "slow-processes", label: "Processes are slow or error-prone" },
  { value: "poor-online-presence", label: "Weak online presence or lead flow" },
  { value: "tool-sprawl", label: "Tools don't talk to each other" },
  { value: "scaling-blockers", label: "Growth is blocked by systems" },
] as const;

export const BUDGET_OPTIONS = [
  { value: "under-2500", label: "Under $2,500", score: -15 },
  { value: "2500-5000", label: "$2,500 – $5,000", score: 10 },
  { value: "5000-10000", label: "$5,000 – $10,000", score: 18 },
  { value: "10000-plus", label: "$10,000+", score: 25 },
] as const;

export const TIMELINE_OPTIONS = [
  { value: "asap", label: "ASAP", score: 20 },
  { value: "30-days", label: "Within 30 days", score: 15 },
  { value: "60-90-days", label: "60–90 days", score: 8 },
  { value: "researching", label: "Just researching", score: 0 },
] as const;

export const AUTHORITY_OPTIONS = [
  { value: "owner-founder", label: "Owner / founder", score: 20 },
  { value: "executive", label: "Executive", score: 15 },
  { value: "manager", label: "Manager", score: 8 },
  { value: "not-decision-maker", label: "Not the decision maker", score: -10 },
] as const;

export type EmployeeValue = (typeof EMPLOYEE_OPTIONS)[number]["value"];
export type BusinessStageValue = (typeof BUSINESS_STAGE_OPTIONS)[number]["value"];
export type MainNeedValue = (typeof MAIN_NEED_OPTIONS)[number]["value"];
export type CurrentSystemValue = (typeof CURRENT_SYSTEMS_OPTIONS)[number]["value"];
export type PainPointValue = (typeof PAIN_POINT_OPTIONS)[number]["value"];
export type BudgetValue = (typeof BUDGET_OPTIONS)[number]["value"];
export type TimelineValue = (typeof TIMELINE_OPTIONS)[number]["value"];
export type AuthorityValue = (typeof AUTHORITY_OPTIONS)[number]["value"];

export type RecommendedSolution =
  | "Launch System"
  | "Customer Acquisition System"
  | "Operations & Automation"
  | "Business Intelligence"
  | "Custom Software"
  | "Business Systems Review";

export type LeadCategory = "Hot Lead" | "Qualified Lead" | "Nurture Lead" | "Low Fit";

export type AssessmentPayload = {
  name: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  employees: EmployeeValue;
  businessStage: BusinessStageValue;
  mainNeed: MainNeedValue;
  currentSystems: CurrentSystemValue[];
  painPoints: PainPointValue[];
  budget: BudgetValue;
  timeline: TimelineValue;
  authority: AuthorityValue;
};

/** @deprecated Use AssessmentPayload — kept for compatibility */
export type DigitalAssessmentPayload = AssessmentPayload;

export const SYSTEMS_GAP_VALUES = new Set<CurrentSystemValue>([
  "no-crm",
  "no-analytics",
  "manual-spreadsheets",
  "disconnected-tools",
]);

export const EMPLOYEE_SET = new Set<string>(EMPLOYEE_OPTIONS.map((o) => o.value));
export const STAGE_SET = new Set<string>(BUSINESS_STAGE_OPTIONS.map((o) => o.value));
export const NEED_SET = new Set<string>(MAIN_NEED_OPTIONS.map((o) => o.value));
export const SYSTEMS_SET = new Set<string>(CURRENT_SYSTEMS_OPTIONS.map((o) => o.value));
export const PAIN_SET = new Set<string>(PAIN_POINT_OPTIONS.map((o) => o.value));
export const BUDGET_SET = new Set<string>(BUDGET_OPTIONS.map((o) => o.value));
export const TIMELINE_SET = new Set<string>(TIMELINE_OPTIONS.map((o) => o.value));
export const AUTHORITY_SET = new Set<string>(AUTHORITY_OPTIONS.map((o) => o.value));

export function labelForValue<T extends { value: string; label: string }>(
  options: readonly T[],
  value: string
): string {
  return options.find((o) => o.value === value)?.label ?? value;
}
