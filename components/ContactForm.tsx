"use client";

import { useState } from "react";

const PROJECT_TYPES = [
  "Website / Digital Infrastructure",
  "SEO / Local Growth",
  "Automation Systems",
  "Client Portal / Web App",
  "Business Consulting",
  "Other",
] as const;

const BUDGET_RANGES = [
  "Under $2,500",
  "$2,500 – $5,000",
  "$5,000 – $10,000",
  "$10,000 – $25,000",
  "$25,000+",
] as const;

const inputClass =
  "mt-1 block w-full rounded-lg border border-black/20 bg-white px-4 py-2.5 text-northbridge-black placeholder:text-black/40 focus:border-northbridge-red focus:outline-none focus:ring-1 focus:ring-northbridge-red";
const inputErrorClass =
  "mt-1 block w-full rounded-lg border border-northbridge-red bg-white px-4 py-2.5 text-northbridge-black placeholder:text-black/40 focus:border-northbridge-red focus:outline-none focus:ring-1 focus:ring-northbridge-red";
const labelClass = "block text-sm font-medium text-northbridge-black";

type FieldErrors = {
  name?: string;
  email?: string;
  projectType?: string;
  message?: string;
};

function validateForm(data: FormData): FieldErrors {
  const errors: FieldErrors = {};
  const name = String(data.get("name") ?? "").trim();
  const email = String(data.get("email") ?? "").trim();
  const projectType = String(data.get("projectType") ?? "").trim();
  const message = String(data.get("message") ?? "").trim();

  if (!name) errors.name = "Full name is required.";
  if (!email) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!projectType) errors.projectType = "Select a project type.";
  if (!message) errors.message = "Message is required.";

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
      <div
        className="rounded-xl border border-black/10 bg-white p-8 sm:p-10"
        role="status"
        aria-live="polite"
      >
        <p className="text-sm font-semibold uppercase tracking-wider text-northbridge-red">
          Inquiry captured
        </p>
        <h2 className="mt-3 text-2xl font-bold text-northbridge-black">Your project inquiry is in.</h2>
        <p className="mt-4 text-black/80 leading-relaxed max-w-lg">
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
      className="rounded-xl border border-black/10 bg-white p-6 sm:p-8 lg:p-10 space-y-6"
      aria-labelledby="inquiry-form-heading"
    >
      <div className="border-b border-black/10 pb-6">
        <h2 id="inquiry-form-heading" className="text-xl font-bold text-northbridge-black">
          Project inquiry
        </h2>
        <p className="mt-2 text-sm text-black/70 leading-relaxed max-w-xl">
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
              className={inputClass}
            />
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
            className={inputClass}
          />
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
          <select id="budgetRange" name="budgetRange" defaultValue="" className={inputClass}>
            <option value="">Select budget range (optional)</option>
            {BUDGET_RANGES.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="message" className={labelClass}>
            Message <span className="text-northbridge-red">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
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
        className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 rounded-lg font-semibold text-white bg-northbridge-red hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        {status === "sending" ? "Submitting…" : "Submit Project Inquiry"}
      </button>
    </form>
  );
}
