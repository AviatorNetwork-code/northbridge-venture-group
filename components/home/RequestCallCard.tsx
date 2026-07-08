"use client";

import { useState } from "react";
import NordiAvatar from "@/components/home/NordiAvatar";

export type CallRequest = {
  name: string;
  contact: string;
  method: "phone" | "email";
  preferredTime?: string;
};

type RequestCallCardProps = {
  onComplete: (request: CallRequest) => void;
  onCancel: () => void;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RequestCallCard({ onComplete, onCancel }: RequestCallCardProps) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [method, setMethod] = useState<"phone" | "email">("phone");
  const [preferredTime, setPreferredTime] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    setError(null);
    const cleanName = name.trim();
    const cleanContact = contact.trim();

    if (!cleanName) {
      setError("Please share your name so we know who to call.");
      return;
    }

    if (method === "email" && !emailPattern.test(cleanContact)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (method === "phone" && cleanContact.replace(/[^\d]/g, "").length < 7) {
      setError("Please enter a valid phone number.");
      return;
    }

    onComplete({
      name: cleanName,
      contact: cleanContact,
      method,
      preferredTime: preferredTime.trim() || undefined,
    });
  };

  return (
    <div className="flex items-start gap-3 animate-fade-slide-up">
      <NordiAvatar />

      <div className="w-full max-w-[92%] rounded-2xl border border-white/10 bg-slate/50 px-4 py-4">
        <p className="text-sm leading-relaxed text-silver">
          I&apos;d be happy to arrange a call. What&apos;s the best way to reach you?
        </p>

        <div className="mt-3 space-y-2">
          <input
            type="text"
            autoFocus
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            className="w-full min-h-11 rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-base text-white placeholder:text-stone focus:border-red/50 focus:outline-none focus:ring-1 focus:ring-red/30"
          />

          <div className="flex flex-wrap gap-2">
            {(
              [
                { id: "phone", label: "Phone" },
                { id: "email", label: "Email" },
              ] as const
            ).map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setMethod(option.id)}
                className={[
                  "inline-flex min-h-11 items-center rounded-full px-4 py-2 text-sm transition-colors",
                  method === option.id
                    ? "bg-red/20 text-white ring-1 ring-red/40"
                    : "border border-white/15 text-silver hover:text-white",
                ].join(" ")}
              >
                {option.label}
              </button>
            ))}
          </div>

          <input
            type={method === "email" ? "email" : "tel"}
            inputMode={method === "email" ? "email" : "tel"}
            value={contact}
            onChange={(event) => setContact(event.target.value)}
            placeholder={method === "email" ? "you@business.com" : "(555) 000-0000"}
            className="w-full min-h-11 rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-base text-white placeholder:text-stone focus:border-red/50 focus:outline-none focus:ring-1 focus:ring-red/30"
          />

          <input
            type="text"
            value={preferredTime}
            onChange={(event) => setPreferredTime(event.target.value)}
            placeholder="Preferred time (optional)"
            className="w-full min-h-11 rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-base text-white placeholder:text-stone focus:border-red/50 focus:outline-none focus:ring-1 focus:ring-red/30"
          />

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={submit}
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-red px-5 text-sm font-semibold text-white transition-colors hover:bg-red-hover"
            >
              Request Call
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

        {error ? <p className="mt-2 text-xs text-red">{error}</p> : null}
      </div>
    </div>
  );
}
