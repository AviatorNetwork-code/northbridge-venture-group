"use client";

import { useMemo, useState } from "react";
import NordiAvatar from "@/components/home/NordiAvatar";
import {
  createIdentity,
  formatIdentityContact,
  mockVerificationProvider,
  normalizePhone,
  type IdentityMethod,
  type NordiIdentity,
} from "@/lib/nordi/identity";

type SaveStep = "method" | "details" | "verifyPrompt" | "code";

type SaveConversationCardProps = {
  onComplete: (identity: NordiIdentity) => void;
  onCancel: () => void;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SaveConversationCard({ onComplete, onCancel }: SaveConversationCardProps) {
  const [step, setStep] = useState<SaveStep>("method");
  const [method, setMethod] = useState<IdentityMethod>("email");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pendingCode, setPendingCode] = useState<string | null>(null);

  const prompt = useMemo(() => {
    switch (step) {
      case "method":
        return "How would you like me to recognize you next time?";
      case "details":
        return method === "email"
          ? "What email should I save this conversation under?"
          : "What phone number should I save this conversation under?";
      case "verifyPrompt":
        return "Would you like to secure future access with a verification code?";
      case "code": {
        const identity = createIdentity(method, method === "email" ? email : phone, false);
        return `I've sent a 6-digit code to ${formatIdentityContact(identity)}. Enter it below when you're ready.`;
      }
      default:
        return "";
    }
  }, [step, method, phone, email]);

  const chooseMethod = (next: IdentityMethod) => {
    setMethod(next);
    setError(null);
    setStep("details");
  };

  const submitDetails = () => {
    setError(null);
    const cleanEmail = email.trim();
    const cleanPhone = normalizePhone(phone);

    if (method === "email" && !emailPattern.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (method === "phone" && cleanPhone.length < 7) {
      setError("Please enter a valid phone number.");
      return;
    }

    setEmail(cleanEmail);
    setPhone(cleanPhone);
    setStep("verifyPrompt");
  };

  const finish = (verified: boolean) => {
    const contact = method === "email" ? email.trim() : phone;
    onComplete(createIdentity(method, contact, verified));
  };

  const sendCode = async () => {
    const identity = createIdentity(method, method === "email" ? email : phone, false);
    const { code: generated } = await mockVerificationProvider.sendCode(identity);
    setPendingCode(generated);
    setStep("code");
  };

  const submitCode = () => {
    if (!pendingCode || !mockVerificationProvider.verifyCode(code, pendingCode)) {
      setError("That code doesn't match. Try again.");
      return;
    }
    finish(true);
  };

  return (
    <div className="flex items-start gap-3 animate-fade-slide-up">
      <NordiAvatar />

      <div className="w-full max-w-[92%] rounded-2xl border border-white/10 bg-slate/50 px-4 py-4">
        <p className="text-sm leading-relaxed text-silver">{prompt}</p>

        {step === "method" ? (
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => chooseMethod("email")}
              className="min-h-11 rounded-full border border-white/15 bg-black/30 px-5 text-sm text-white transition-colors hover:border-red/40 hover:bg-red/10"
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => chooseMethod("phone")}
              className="min-h-11 rounded-full border border-white/15 bg-black/30 px-5 text-sm text-white transition-colors hover:border-red/40 hover:bg-red/10"
            >
              Phone Number
            </button>
          </div>
        ) : null}

        {step === "details" ? (
          <div className="mt-3 space-y-2">
            {method === "email" ? (
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
            ) : (
              <input
                type="tel"
                inputMode="tel"
                autoFocus
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && submitDetails()}
                placeholder="(555) 000-0000"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-base text-white placeholder:text-stone focus:border-red/50 focus:outline-none focus:ring-1 focus:ring-red/30"
              />
            )}
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
              onClick={() => void sendCode()}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-red px-5 text-sm font-semibold text-white transition-colors hover:bg-red-hover"
            >
              Send Code
            </button>
            <button
              type="button"
              onClick={() => finish(false)}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/15 bg-black/30 px-5 text-sm text-white transition-colors hover:border-white/30 hover:bg-white/5"
            >
              Skip for now
            </button>
          </div>
        ) : null}

        {step === "code" ? (
          <div className="mt-3 space-y-2">
            {pendingCode ? (
              <p className="text-xs text-stone">
                Demo verification — your code is{" "}
                <span className="font-semibold text-silver">{pendingCode}</span>.
              </p>
            ) : null}
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
                Skip for now
              </button>
            </div>
          </div>
        ) : null}

        {error ? <p className="mt-2 text-xs text-red">{error}</p> : null}
      </div>
    </div>
  );
}
