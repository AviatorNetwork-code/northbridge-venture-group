import {
  AUTHORITY_SET,
  BUDGET_SET,
  EMPLOYEE_SET,
  FIELD_LIMITS,
  NEED_SET,
  PAIN_SET,
  STAGE_SET,
  SYSTEMS_SET,
  TIMELINE_SET,
  type AssessmentPayload,
  type AuthorityValue,
  type BudgetValue,
  type BusinessStageValue,
  type CurrentSystemValue,
  type EmployeeValue,
  type MainNeedValue,
  type PainPointValue,
  type TimelineValue,
} from "./schema";

function isValidEmail(email: string): boolean {
  return email.length <= FIELD_LIMITS.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function parseStringArray(value: unknown, allowed: Set<string>): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => allowed.has(item));
}

export function parseAssessmentPayload(body: unknown): AssessmentPayload | null {
  if (!body || typeof body !== "object") return null;
  const data = body as Record<string, unknown>;

  const employees = typeof data.employees === "string" ? data.employees.trim() : "";
  const businessStage = typeof data.businessStage === "string" ? data.businessStage.trim() : "";
  const mainNeed = typeof data.mainNeed === "string" ? data.mainNeed.trim() : "";
  const budget = typeof data.budget === "string" ? data.budget.trim() : "";
  const timeline = typeof data.timeline === "string" ? data.timeline.trim() : "";
  const authority = typeof data.authority === "string" ? data.authority.trim() : "";

  return {
    name: typeof data.name === "string" ? data.name.trim() : "",
    email: typeof data.email === "string" ? data.email.trim() : "",
    phone: typeof data.phone === "string" ? data.phone.trim() : "",
    company: typeof data.company === "string" ? data.company.trim() : "",
    industry: typeof data.industry === "string" ? data.industry.trim() : "",
    employees: employees as EmployeeValue,
    businessStage: businessStage as BusinessStageValue,
    mainNeed: mainNeed as MainNeedValue,
    currentSystems: parseStringArray(data.currentSystems, SYSTEMS_SET) as CurrentSystemValue[],
    painPoints: parseStringArray(data.painPoints, PAIN_SET) as PainPointValue[],
    budget: budget as BudgetValue,
    timeline: timeline as TimelineValue,
    authority: authority as AuthorityValue,
  };
}

export function validateAssessmentPayload(payload: AssessmentPayload): string | null {
  if (!payload.name) return "Full name is required.";
  if (!payload.email) return "Email is required.";
  if (!payload.company) return "Company name is required.";
  if (!payload.employees || !EMPLOYEE_SET.has(payload.employees)) return "Select a team size.";
  if (!payload.businessStage || !STAGE_SET.has(payload.businessStage)) {
    return "Select a business stage.";
  }
  if (!payload.mainNeed || !NEED_SET.has(payload.mainNeed)) return "Select your primary need.";
  if (!payload.budget || !BUDGET_SET.has(payload.budget)) return "Select a budget range.";
  if (!payload.timeline || !TIMELINE_SET.has(payload.timeline)) return "Select a timeline.";
  if (!payload.authority || !AUTHORITY_SET.has(payload.authority)) {
    return "Select your decision authority.";
  }

  if (payload.name.length > FIELD_LIMITS.name) return "Full name is too long.";
  if (payload.company.length > FIELD_LIMITS.company) return "Company name is too long.";
  if (payload.email.length > FIELD_LIMITS.email) return "Email is too long.";
  if (payload.phone.length > FIELD_LIMITS.phone) return "Phone number is too long.";
  if (payload.industry.length > FIELD_LIMITS.industry) return "Industry is too long.";

  if (!isValidEmail(payload.email)) return "Enter a valid email address.";

  return null;
}
