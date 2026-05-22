"use client";

import { useState } from "react";
import { FIELD_LIMITS, PROJECT_TYPES } from "@/lib/contact";

const BUDGET_RANGES = [
  "Under $2,500",
  "$2,500 – $5,000",
  "$5,000 – $10,000",
  "$10,000 – $25,000",
  "$25,000+",
] as const;

const inputClass = "nb-input";
const inputErrorClass = "nb-input-error";
const labelClass = "nb-label";

type FieldErrors = {
  name?: string;
  email?: string;
  projectType?: string;
  message?: string;
  company?: string;
  phone?: string;
  budgetRange?: string;
};

function validateForm(data: FormData): FieldErrors {
  const errors: FieldErrors = {};
  const name = String(data.get("name") ?? "").trim();
  const company = String(data.get("company") ?? "").trim();
  const email = String(data.get("email") ?? "").trim();
  const phone = String(data.get("phone") ?? "").trim();
  const projectType = String(data.get("projectType") ?? "").trim();
  const budgetRange = String(data.get("budgetRange") ?? "").trim();
  const message = String(data.get("message") ?? "").trim();

  if (!name) errors.name = "Full name is required.";
  else if (name.length > FIELD_LIMITS.name) errors.name = "Full name is too long.";

  if (!email) errors.email = "Email is required.";
  else if (email.length > FIELD_LIMITS.email) errors.email = "Email is too long.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (company.length > FIELD_LIMITS.company) errors.company = "Company name is too long.";
  if (phone.length > FIELD_LIMITS.phone) errors.phone = "Phone number is too long.";

  if (!projectType) errors.projectType = "Select a project type.";
  else if (projectType.length > FIELD_LIMITS.projectType) {
    errors.projectType = "Project type is too long.";
  }

  if (budgetRange.length > FIELD_LIMITS.budgetRange) {
    errors.budgetRange = "Budget range is too long.";
  }

  if (!message) errors.message = "Message is required.";
  else if (message.length > FIELD_LIMITS.message) errors.message = "Message is too long.";

  return errors;
}

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const fieldErrors = validateForm(data);

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      setStatus("idle");
      setServerError(null);
      return;
    }

    setErrors({});
    setServerError(null);
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          company: data.get("company"),
          email: data.get("email"),
          phone: data.get("phone"),
          projectType: data.get("projectType"),
          budgetRange: data.get("budgetRange"),
          message: data.get("message"),
        }),
      });

      const payload = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
        setServerError(
          typeof payload.error === "string"
            ? payload.error
            : "Something went wrong. Please try again."
        );
      }
    } catch {
      setStatus("error");
      setServerError("Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="nb-card p-8 sm:p-10" role="status" aria-live="polite">
        <p className="nb-eyebrow">Inquiry captured</p>
        <h2 className="mt-3 text-2xl font-bold text-white">Your project inquiry is in.</h2>
        <p className="mt-4 text-white/70 leading-relaxed max-w-lg">
          Your details have been submitted through our lead capture system. We will review scope,
          project type, and context—then respond within one to two business days.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-8 text-sm font-semibold text-northbridge-red hover:underline"
        >
          Submit another inquiry
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="nb-card p-6 sm:p-8 lg:p-10 space-y-6"
      aria-labelledby="inquiry-form-heading"
    >
      <div className="border-b border-white/10 pb-6">
        <h2 id="inquiry-form-heading" className="text-xl font-bold text-white">
          Project inquiry
        </h2>
        <p className="mt-2 text-sm text-white/60 leading-relaxed max-w-xl">
          Structured lead capture—qualify your project so we can respond with the right next step.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2 sm:grid sm:grid-cols-2 sm:gap-6">
          <div>
            <label htmlFor="name" className={labelClass}>
              Full name <span className="text-northbridge-red">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              maxLength={FIELD_LIMITS.name}
              className={errors.name ? inputErrorClass : inputClass}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <p id="name-error" className="mt-1.5 text-sm text-northbridge-red">
                {errors.name}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="company" className={labelClass}>
              Company name
            </label>
            <input
              id="company"
              name="company"
              type="text"
              autoComplete="organization"
              maxLength={FIELD_LIMITS.company}
              className={errors.company ? inputErrorClass : inputClass}
              aria-invalid={Boolean(errors.company)}
              aria-describedby={errors.company ? "company-error" : undefined}
            />
            {errors.company && (
              <p id="company-error" className="mt-1.5 text-sm text-northbridge-red">
                {errors.company}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            Email <span className="text-northbridge-red">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={FIELD_LIMITS.email}
            className={errors.email ? inputErrorClass : inputClass}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className="mt-1.5 text-sm text-northbridge-red">
              {errors.email}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={FIELD_LIMITS.phone}
            className={errors.phone ? inputErrorClass : inputClass}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "phone-error" : undefined}
          />
          {errors.phone && (
            <p id="phone-error" className="mt-1.5 text-sm text-northbridge-red">
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="projectType" className={labelClass}>
            Project type <span className="text-northbridge-red">*</span>
          </label>
          <select
            id="projectType"
            name="projectType"
            defaultValue=""
            className={errors.projectType ? inputErrorClass : inputClass}
            aria-invalid={Boolean(errors.projectType)}
            aria-describedby={errors.projectType ? "projectType-error" : undefined}
          >
            <option value="" disabled>
              Select project type
            </option>
            {PROJECT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.projectType && (
            <p id="projectType-error" className="mt-1.5 text-sm text-northbridge-red">
              {errors.projectType}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="budgetRange" className={labelClass}>
            Budget range
          </label>
          <select
            id="budgetRange"
            name="budgetRange"
            defaultValue=""
            className={errors.budgetRange ? inputErrorClass : inputClass}
            aria-invalid={Boolean(errors.budgetRange)}
            aria-describedby={errors.budgetRange ? "budgetRange-error" : undefined}
          >
            <option value="">Select budget range (optional)</option>
            {BUDGET_RANGES.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
          {errors.budgetRange && (
            <p id="budgetRange-error" className="mt-1.5 text-sm text-northbridge-red">
              {errors.budgetRange}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="message" className={labelClass}>
            Message <span className="text-northbridge-red">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            maxLength={FIELD_LIMITS.message}
            placeholder="What are you building? Where is the business today? What should the digital system do next?"
            className={errors.message ? inputErrorClass : inputClass}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "message-error" : undefined}
          />
          {errors.message && (
            <p id="message-error" className="mt-1.5 text-sm text-northbridge-red">
              {errors.message}
            </p>
          )}
        </div>
      </div>

      {status === "error" && serverError && (
        <p className="text-sm font-medium text-northbridge-red" role="alert">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full sm:w-auto btn-primary px-8"
      >
        {status === "sending" ? "Submitting…" : "Submit Project Inquiry"}
      </button>
    </form>
  );
}
