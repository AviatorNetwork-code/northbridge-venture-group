"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { trackEvent } from "@/lib/analytics";
import {
  AUTHORITY_OPTIONS,
  BUDGET_OPTIONS,
  BUSINESS_STAGE_OPTIONS,
  CURRENT_SYSTEMS_OPTIONS,
  EMPLOYEE_OPTIONS,
  FIELD_LIMITS,
  MAIN_NEED_OPTIONS,
  PAIN_POINT_OPTIONS,
  TIMELINE_OPTIONS,
  isQualifiedLead,
  type AuthorityValue,
  type BudgetValue,
  type BusinessStageValue,
  type CurrentSystemValue,
  type DigitalAssessmentPayload,
  type EmployeeValue,
  type LeadCategory,
  type MainNeedValue,
  type PainPointValue,
  type RecommendedSolution,
  type TimelineValue,
} from "@/lib/digital-assessment";

const STEPS = [
  { id: "contact", title: "Contact info" },
  { id: "profile", title: "Business profile" },
  { id: "stage", title: "Business stage" },
  { id: "need", title: "Main need" },
  { id: "systems", title: "Current systems" },
  { id: "pain", title: "Pain points" },
  { id: "budget", title: "Budget" },
  { id: "timeline", title: "Timeline" },
  { id: "authority", title: "Decision authority" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

type FormState = {
  name: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  employees: EmployeeValue | "";
  businessStage: BusinessStageValue | "";
  mainNeed: MainNeedValue | "";
  currentSystems: CurrentSystemValue[];
  painPoints: PainPointValue[];
  budget: BudgetValue | "";
  timeline: TimelineValue | "";
  authority: AuthorityValue | "";
};

const INITIAL_STATE: FormState = {
  name: "",
  email: "",
  phone: "",
  company: "",
  industry: "",
  employees: "",
  businessStage: "",
  mainNeed: "",
  currentSystems: [],
  painPoints: [],
  budget: "",
  timeline: "",
  authority: "",
};

type SubmitResult = {
  score: number;
  leadCategory: LeadCategory;
  recommendedSolution: RecommendedSolution;
};

function isValidNeed(value: string | null): value is MainNeedValue {
  return MAIN_NEED_OPTIONS.some((option) => option.value === value);
}

function SelectionCard({
  selected,
  label,
  description,
  onClick,
}: {
  selected: boolean;
  label: string;
  description?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`nb-selection-card transition-all ${
        selected
          ? "border-northbridge-red bg-northbridge-red/10 shadow-card"
          : "border-white/10 bg-northbridge-charcoal hover:border-northbridge-red/40"
      }`}
      aria-pressed={selected}
    >
      <span className="block font-semibold text-white">{label}</span>
      {description && <span className="mt-1 block text-sm text-white/60">{description}</span>}
    </button>
  );
}

function MultiSelectionCard({
  selected,
  label,
  onClick,
}: {
  selected: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-4 py-3 min-h-[2.75rem] text-left text-sm font-medium transition-colors ${
        selected
          ? "border-northbridge-red bg-northbridge-red/10 text-white"
          : "border-white/10 bg-northbridge-charcoal text-white/80 hover:border-northbridge-red/40"
      }`}
      aria-pressed={selected}
    >
      {label}
    </button>
  );
}

export function DigitalAssessment() {
  const searchParams = useSearchParams();
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [startedTracked, setStartedTracked] = useState(false);

  const currentStep = STEPS[stepIndex];
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  useEffect(() => {
    const need = searchParams.get("need");
    if (isValidNeed(need)) {
      setForm((prev) => ({ ...prev, mainNeed: need }));
    }
  }, [searchParams]);

  useEffect(() => {
    if (!startedTracked) {
      trackEvent("assessment_started", { source: "digital_assessment" });
      setStartedTracked(true);
    }
  }, [startedTracked]);

  const updateField = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const toggleMulti = useCallback(
    (key: "currentSystems" | "painPoints", value: CurrentSystemValue | PainPointValue) => {
      setForm((prev) => {
        const list = prev[key] as (CurrentSystemValue | PainPointValue)[];
        const exists = list.includes(value);
        return {
          ...prev,
          [key]: exists ? list.filter((item) => item !== value) : [...list, value],
        };
      });
    },
    []
  );

  const validateStep = useCallback(
    (stepId: StepId): boolean => {
      const nextErrors: Partial<Record<keyof FormState, string>> = {};

      switch (stepId) {
        case "contact":
          if (!form.name.trim()) nextErrors.name = "Full name is required.";
          else if (form.name.length > FIELD_LIMITS.name) nextErrors.name = "Full name is too long.";
          if (!form.email.trim()) nextErrors.email = "Email is required.";
          else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            nextErrors.email = "Enter a valid email address.";
          }
          if (!form.company.trim()) nextErrors.company = "Company name is required.";
          else if (form.company.length > FIELD_LIMITS.company) {
            nextErrors.company = "Company name is too long.";
          }
          if (form.phone.length > FIELD_LIMITS.phone) {
            nextErrors.phone = "Phone number is too long.";
          }
          break;
        case "profile":
          if (!form.employees) nextErrors.employees = "Select a team size.";
          if (form.industry.length > FIELD_LIMITS.industry) {
            nextErrors.industry = "Industry is too long.";
          }
          break;
        case "stage":
          if (!form.businessStage) nextErrors.businessStage = "Select a business stage.";
          break;
        case "need":
          if (!form.mainNeed) nextErrors.mainNeed = "Select your primary need.";
          break;
        case "budget":
          if (!form.budget) nextErrors.budget = "Select a budget range.";
          break;
        case "timeline":
          if (!form.timeline) nextErrors.timeline = "Select a timeline.";
          break;
        case "authority":
          if (!form.authority) nextErrors.authority = "Select your decision authority.";
          break;
        default:
          break;
      }

      setErrors(nextErrors);
      return Object.keys(nextErrors).length === 0;
    },
    [form]
  );

  const goNext = useCallback(() => {
    if (!validateStep(currentStep.id)) return;
    trackEvent("assessment_step_completed", {
      step: currentStep.id,
      step_index: stepIndex + 1,
    });
    setStepIndex((prev) => Math.min(prev + 1, STEPS.length - 1));
  }, [currentStep.id, stepIndex, validateStep]);

  const goBack = useCallback(() => {
    setStepIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const payload = useMemo((): DigitalAssessmentPayload | null => {
    if (
      !form.employees ||
      !form.businessStage ||
      !form.mainNeed ||
      !form.budget ||
      !form.timeline ||
      !form.authority
    ) {
      return null;
    }

    return {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      company: form.company.trim(),
      industry: form.industry.trim(),
      employees: form.employees,
      businessStage: form.businessStage,
      mainNeed: form.mainNeed,
      currentSystems: form.currentSystems,
      painPoints: form.painPoints,
      budget: form.budget,
      timeline: form.timeline,
      authority: form.authority,
    };
  }, [form]);

  const handleSubmit = async () => {
    for (const step of STEPS) {
      if (!validateStep(step.id)) {
        setStepIndex(STEPS.findIndex((s) => s.id === step.id));
        return;
      }
    }

    if (!payload) return;

    setStatus("submitting");
    setServerError(null);

    try {
      const res = await fetch("/api/digital-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setServerError(
          typeof data.error === "string" ? data.error : "Something went wrong. Please try again."
        );
        return;
      }

      const leadCategory = data.leadCategory as LeadCategory;
      const qualified = isQualifiedLead(leadCategory);

      trackEvent("assessment_submitted", {
        score: data.score,
        lead_category: leadCategory,
        recommended_solution: data.recommendedSolution,
      });

      if (qualified) {
        trackEvent("assessment_qualified", { score: data.score, lead_category: leadCategory });
      } else {
        trackEvent("assessment_disqualified", { score: data.score, lead_category: leadCategory });
      }

      setResult({
        score: data.score,
        leadCategory,
        recommendedSolution: data.recommendedSolution,
      });
      setStatus("success");
    } catch {
      setStatus("error");
      setServerError("Something went wrong. Please try again.");
    }
  };

  if (status === "success" && result) {
    const qualified = isQualifiedLead(result.leadCategory);

    return (
      <div className="nb-card p-8 sm:p-10 max-w-2xl mx-auto" role="status" aria-live="polite">
        <p className="nb-eyebrow">Business Diagnostic complete</p>
        <h2 className="mt-3 text-2xl font-bold text-white">Business Diagnostic submitted.</h2>
        <p className="mt-4 text-white/70 leading-relaxed">
          Northbridge will review your responses and recommend the best next step.
        </p>
        <p className="mt-4 text-sm text-white/50">
          Recommended focus:{" "}
          <span className="text-white/80 font-medium">{result.recommendedSolution}</span>
        </p>

        {qualified ? (
          <div className="mt-8 rounded-xl border border-northbridge-red/30 bg-northbridge-red/5 p-6">
            <p className="font-semibold text-white">You may be a strong fit for a strategy call.</p>
            <p className="mt-2 text-sm text-white/65 leading-relaxed">
              Based on your profile, Northbridge can move quickly to understand your systems and
              priorities. Book a call to discuss the recommended path.
            </p>
            <Link href="/contact" className="mt-5 inline-flex btn-primary">
              Book Strategy Call
            </Link>
          </div>
        ) : (
          <div className="mt-8 rounded-xl border border-white/10 bg-northbridge-black/40 p-6">
            <p className="font-semibold text-white">We&apos;ll follow up after review.</p>
            <p className="mt-2 text-sm text-white/65 leading-relaxed">
              Your responses help us prioritize the right recommendation. Explore our client
              projects while Northbridge reviews your assessment.
            </p>
            <div className="mt-5 flex flex-wrap gap-4">
              <Link href="/digital" className="btn-secondary">
                Back to Northbridge Digital
              </Link>
              <Link
                href="/case-studies"
                className="text-sm font-semibold text-northbridge-red hover:underline self-center"
              >
                View client projects →
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto min-w-0 w-full">
      <div className="mb-8">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between text-sm text-white/60 mb-2">
          <span>
            Step {stepIndex + 1} of {STEPS.length}
          </span>
          <span className="text-white/50 sm:text-right">{currentStep.title}</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-northbridge-red transition-all duration-300"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={stepIndex + 1}
            aria-valuemin={1}
            aria-valuemax={STEPS.length}
            aria-label="Assessment progress"
          />
        </div>
      </div>

      <div className="nb-card p-5 sm:p-6 lg:p-8">
        {currentStep.id === "contact" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-white">Contact information</h2>
              <p className="mt-2 text-sm text-white/60">How should Northbridge reach you?</p>
            </div>
            <div>
              <label htmlFor="name" className="nb-label">
                Full name <span className="text-northbridge-red">*</span>
              </label>
              <input
                id="name"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                maxLength={FIELD_LIMITS.name}
                className={errors.name ? "nb-input-error" : "nb-input"}
                autoComplete="name"
              />
              {errors.name && <p className="mt-1.5 text-sm text-northbridge-red">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="email" className="nb-label">
                Email <span className="text-northbridge-red">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                maxLength={FIELD_LIMITS.email}
                className={errors.email ? "nb-input-error" : "nb-input"}
                autoComplete="email"
              />
              {errors.email && (
                <p className="mt-1.5 text-sm text-northbridge-red">{errors.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="phone" className="nb-label">
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                maxLength={FIELD_LIMITS.phone}
                className={errors.phone ? "nb-input-error" : "nb-input"}
                autoComplete="tel"
              />
              {errors.phone && (
                <p className="mt-1.5 text-sm text-northbridge-red">{errors.phone}</p>
              )}
            </div>
            <div>
              <label htmlFor="company" className="nb-label">
                Company <span className="text-northbridge-red">*</span>
              </label>
              <input
                id="company"
                value={form.company}
                onChange={(e) => updateField("company", e.target.value)}
                maxLength={FIELD_LIMITS.company}
                className={errors.company ? "nb-input-error" : "nb-input"}
                autoComplete="organization"
              />
              {errors.company && (
                <p className="mt-1.5 text-sm text-northbridge-red">{errors.company}</p>
              )}
            </div>
          </div>
        )}

        {currentStep.id === "profile" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-white">Business profile</h2>
              <p className="mt-2 text-sm text-white/60">Tell us about your organization.</p>
            </div>
            <div>
              <label htmlFor="industry" className="nb-label">
                Industry
              </label>
              <input
                id="industry"
                value={form.industry}
                onChange={(e) => updateField("industry", e.target.value)}
                maxLength={FIELD_LIMITS.industry}
                placeholder="e.g. HVAC, professional services, aviation"
                className="nb-input"
              />
            </div>
            <div>
              <p className="nb-label mb-3">
                Team size <span className="text-northbridge-red">*</span>
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {EMPLOYEE_OPTIONS.map((option) => (
                  <SelectionCard
                    key={option.value}
                    selected={form.employees === option.value}
                    label={option.label}
                    onClick={() => updateField("employees", option.value)}
                  />
                ))}
              </div>
              {errors.employees && (
                <p className="mt-2 text-sm text-northbridge-red">{errors.employees}</p>
              )}
            </div>
          </div>
        )}

        {currentStep.id === "stage" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-white">Business stage</h2>
              <p className="mt-2 text-sm text-white/60">Where is the business today?</p>
            </div>
            <div className="grid gap-3">
              {BUSINESS_STAGE_OPTIONS.map((option) => (
                <SelectionCard
                  key={option.value}
                  selected={form.businessStage === option.value}
                  label={option.label}
                  onClick={() => updateField("businessStage", option.value)}
                />
              ))}
            </div>
            {errors.businessStage && (
              <p className="text-sm text-northbridge-red">{errors.businessStage}</p>
            )}
          </div>
        )}

        {currentStep.id === "need" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-white">Main need</h2>
              <p className="mt-2 text-sm text-white/60">What is the primary outcome you need?</p>
            </div>
            <div className="grid gap-3">
              {MAIN_NEED_OPTIONS.map((option) => (
                <SelectionCard
                  key={option.value}
                  selected={form.mainNeed === option.value}
                  label={option.label}
                  onClick={() => updateField("mainNeed", option.value)}
                />
              ))}
            </div>
            {errors.mainNeed && (
              <p className="text-sm text-northbridge-red">{errors.mainNeed}</p>
            )}
          </div>
        )}

        {currentStep.id === "systems" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-white">Current systems</h2>
              <p className="mt-2 text-sm text-white/60">Select all that apply (optional).</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {CURRENT_SYSTEMS_OPTIONS.map((option) => (
                <MultiSelectionCard
                  key={option.value}
                  selected={form.currentSystems.includes(option.value)}
                  label={option.label}
                  onClick={() => toggleMulti("currentSystems", option.value)}
                />
              ))}
            </div>
          </div>
        )}

        {currentStep.id === "pain" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-white">Pain points</h2>
              <p className="mt-2 text-sm text-white/60">What is creating friction today? (optional)</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {PAIN_POINT_OPTIONS.map((option) => (
                <MultiSelectionCard
                  key={option.value}
                  selected={form.painPoints.includes(option.value)}
                  label={option.label}
                  onClick={() => toggleMulti("painPoints", option.value)}
                />
              ))}
            </div>
          </div>
        )}

        {currentStep.id === "budget" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-white">Budget</h2>
              <p className="mt-2 text-sm text-white/60">
                Approximate investment range for the right solution.
              </p>
            </div>
            <div className="grid gap-3">
              {BUDGET_OPTIONS.map((option) => (
                <SelectionCard
                  key={option.value}
                  selected={form.budget === option.value}
                  label={option.label}
                  onClick={() => updateField("budget", option.value)}
                />
              ))}
            </div>
            {errors.budget && <p className="text-sm text-northbridge-red">{errors.budget}</p>}
          </div>
        )}

        {currentStep.id === "timeline" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-white">Timeline</h2>
              <p className="mt-2 text-sm text-white/60">When do you need to move forward?</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {TIMELINE_OPTIONS.map((option) => (
                <SelectionCard
                  key={option.value}
                  selected={form.timeline === option.value}
                  label={option.label}
                  onClick={() => updateField("timeline", option.value)}
                />
              ))}
            </div>
            {errors.timeline && <p className="text-sm text-northbridge-red">{errors.timeline}</p>}
          </div>
        )}

        {currentStep.id === "authority" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-white">Decision authority</h2>
              <p className="mt-2 text-sm text-white/60">Who are you in the buying process?</p>
            </div>
            <div className="grid gap-3">
              {AUTHORITY_OPTIONS.map((option) => (
                <SelectionCard
                  key={option.value}
                  selected={form.authority === option.value}
                  label={option.label}
                  onClick={() => updateField("authority", option.value)}
                />
              ))}
            </div>
            {errors.authority && (
              <p className="text-sm text-northbridge-red">{errors.authority}</p>
            )}
          </div>
        )}

        {status === "error" && serverError && (
          <p className="mt-6 text-sm font-medium text-northbridge-red" role="alert">
            {serverError}
          </p>
        )}

        <div className="nb-form-actions">
          <button
            type="button"
            onClick={goBack}
            disabled={stepIndex === 0 || status === "submitting"}
            className="min-h-[2.75rem] px-2 text-sm font-semibold text-white/70 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed sm:px-0"
          >
            ← Back
          </button>

          {stepIndex < STEPS.length - 1 ? (
            <button type="button" onClick={goNext} className="btn-primary nb-form-actions-primary">
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={status === "submitting"}
              className="btn-primary nb-form-actions-primary"
            >
              {status === "submitting" ? "Submitting…" : "Submit Business Diagnostic"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
