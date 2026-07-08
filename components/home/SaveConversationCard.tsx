"use client";

import { useMemo, useState } from "react";
import { IconCat } from "@/components/operations/icons";

export type SavedIdentity = {
  method: "phone" | "email" | "both";
  phone?: string;
  email?: string;
  verified: boolean;
};

type SaveStep = "method" | "details" | "verifyPrompt" | "code";

type SaveConversationCardProps = {
  onComplete: (identity: SavedIdentity) => void;
  onCancel: () => void;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizePhone(value: string): string {
  return value.replace(/[^\d]/g, "");
}

function maskContact(identity: { method: SavedIdentity["method"]; phone: string; email: string }): string {
  if (identity.method === "both") return `${identity.email} and ${identity.phone}`;
  if (identity.method === "email") return identity.email;
  return identity.phone;
}

export default function SaveConversationCard({ onComplete, onCancel }: SaveConversationCardProps) {
  const [step, setStep] = useState<SaveStep>("method");
  const [method, setMethod] = useState<SavedIdentity["method"]>("email");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const generatedCode = useMemo(
    () => Math.floor(100000 + Math.random() * 900000).toString(),
    [],
  );

  const prompt = useMemo(() => {
    switch (step) {
      case "method":
        return "What's the best way to recognize you next time?";
      case "details":
        if (method === "both") return "Perfect. What are your email and phone number?";
        if (method === "email") return "Great. What email should I use to recognize you?";
        return "Great. What phone number should I use to recognize you?";
      case "verifyPrompt":
        return "Would you like to protect this conversation with a verification code?";
      case "code":
        return `I've sent a 6-digit code to ${maskContact({ method, phone, email })}. Enter it below to confirm it's you.`;
      default:
        return "";
    }
  }, [step, method, phone, email]);

  const chooseMethod = (next: SavedIdentity["method"]) => {
    setMethod(next);
    setError(null);
    setStep("details");
  };

  const submitDetails = () => {
    setError(null);
    const cleanEmail = email.trim();
    const cleanPhone = normalizePhone(phone);

    if (method !== "phone" && !emailPattern.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (method !== "email" && cleanPhone.length < 7) {
      setError("Please enter a valid phone number.");
      return;
    }

    setEmail(cleanEmail);
    setPhone(cleanPhone);
    setStep("verifyPrompt");
  };

  const finish = (verified: boolean) => {
    onComplete({
      method,
      phone: method !== "email" ? normalizePhone(phone) : undefined,
      email: method !== "phone" ? email.trim() : undefined,
      verified,
    });
  };

  const submitCode = () => {
    if (normalizePhone(code) !== generatedCode) {
      setError("That code doesn't match. Try again.");
      return;
    }
    finish(true);
  };

  return (
    <div className="flex items-start gap-3 animate-fade-slide-up">
      <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red text-white">
        <IconCat className="h-5 w-5" />
      </span>

      <div className="w-full max-w-[92%] rounded-2xl border border-white/10 bg-slate/50 px-4 py-4">
        <p className="text-sm leading-relaxed text-silver">{prompt}</p>

        {step === "method" ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {(
              [
                { id: "phone", label: "Phone" },
                { id: "email", label: "Email" },
                { id: "both", label: "Both" },
              ] as const
            ).map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => chooseMethod(option.id)}
                className="min-h-11 rounded-full border border-white/15 bg-black/30 px-5 text-sm text-white transition-colors hover:border-red/40 hover:bg-red/10"
              >
                {option.label}
              </button>
            ))}
          </div>
        ) : null}

        {step === "details" ? (
          <div className="mt-3 space-y-2">
            {method !== "phone" ? (
              <input
                type="email"
                inputMode="email"
                autoFocus
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && submitDetails()}
                placeholder="you@business.com"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-base text-white placeholder:text-stone focus:border-red/50 focus:outline-none focus:ring-1 focus:ring-red/30"
              />
            ) : null}
            {method !== "email" ? (
              <input
                type="tel"
                inputMode="tel"
                autoFocus={method === "phone"}
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && submitDetails()}
                placeholder="(555) 000-0000"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-base text-white placeholder:text-stone focus:border-red/50 focus:outline-none focus:ring-1 focus:ring-red/30"
              />
            ) : null}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={submitDetails}
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-red px-5 text-sm font-semibold text-white transition-colors hover:bg-red-hover"
              >
                Continue
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex min-h-11 items-center justify-center rounded-xl px-4 text-sm text-stone transition-colors hover:text-white"
              >
                Not now
              </button>
            </div>
          </div>
        ) : null}

        {step === "verifyPrompt" ? (
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setStep("code")}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-red px-5 text-sm font-semibold text-white transition-colors hover:bg-red-hover"
            >
              Yes, protect it
            </button>
            <button
              type="button"
              onClick={() => finish(false)}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/15 bg-black/30 px-5 text-sm text-white transition-colors hover:border-white/30 hover:bg-white/5"
            >
              No, just save it
            </button>
          </div>
        ) : null}

        {step === "code" ? (
          <div className="mt-3 space-y-2">
            <p className="text-xs text-stone">
              Demo verification — your code is{" "}
              <span className="font-semibold text-silver">{generatedCode}</span>.
            </p>
            <input
              type="text"
              inputMode="numeric"
              autoFocus
              maxLength={6}
              value={code}
              onChange={(event) => setCode(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && submitCode()}
              placeholder="Enter 6-digit code"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-base tracking-[0.4em] text-white placeholder:tracking-normal placeholder:text-stone focus:border-red/50 focus:outline-none focus:ring-1 focus:ring-red/30"
            />
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={submitCode}
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-red px-5 text-sm font-semibold text-white transition-colors hover:bg-red-hover"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => finish(false)}
                className="inline-flex min-h-11 items-center justify-center rounded-xl px-4 text-sm text-stone transition-colors hover:text-white"
              >
                Skip verification
              </button>
            </div>
          </div>
        ) : null}

        {error ? <p className="mt-2 text-xs text-red">{error}</p> : null}
      </div>
    </div>
  );
}
