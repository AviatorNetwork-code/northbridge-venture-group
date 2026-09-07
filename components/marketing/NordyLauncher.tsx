"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  createNordyEngineState,
  getNordyGreeting,
  processNordyTurn,
  trackAnalytics,
  type NordyEntryPath,
  type NordyEngineState,
} from "@/lib/nordy";

type NordyLauncherProps = {
  open: boolean;
  entryPath: NordyEntryPath;
  onClose: () => void;
};

type ChatLine = {
  id: string;
  role: "nordy" | "user";
  content: string;
};

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export default function NordyLauncher({ open, entryPath, onClose }: NordyLauncherProps) {
  const [state, setState] = useState<NordyEngineState>(() =>
    createNordyEngineState(entryPath),
  );
  const [lines, setLines] = useState<ChatLine[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const title = useMemo(() => {
    if (entryPath === "ENGINEERING_AI") return "Nordi · Engineering & AI";
    if (entryPath === "DIGITAL") return "Nordi · Digital";
    if (entryPath === "EXPLORE") return "Nordi · Explore Northbridge";
    return "Nordi";
  }, [entryPath]);

  useEffect(() => {
    if (!open) return;
    setState(createNordyEngineState(entryPath));
    setLines([
      {
        id: createId("nordy"),
        role: "nordy",
        content: getNordyGreeting(entryPath),
      },
    ]);
    setInput("");
    trackAnalytics("nordy_opened", { entryPath });
    if (entryPath === "ENGINEERING_AI") {
      trackAnalytics("nordy_engineering_started", { entryPath });
    }
    if (entryPath === "DIGITAL") {
      trackAnalytics("nordy_digital_started", { entryPath });
    }
    const timer = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => window.clearTimeout(timer);
  }, [open, entryPath]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [lines, busy]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    setBusy(true);
    setLines((prev) => [...prev, { id: createId("user"), role: "user", content: text }]);

    try {
      const { state: nextState, result } = await processNordyTurn(state, text);
      setState(nextState);
      setLines((prev) => [
        ...prev,
        { id: createId("nordy"), role: "nordy", content: result.reply },
      ]);
      if (result.usedAi) {
        trackAnalytics("nordy_ai_escalated", {
          entryPath,
          gapClass: result.aiGapClass,
        });
      }
      if (result.lead && result.lead.fit !== "UNKNOWN") {
        trackAnalytics("nordy_lead_qualified", {
          entryPath,
          fit: result.lead.fit,
          division: result.lead.recommendedDivision,
        });
      }
      if (result.handoffSuggested) {
        trackAnalytics("nordy_human_handoff", { entryPath });
      }
    } catch {
      setLines((prev) => [
        ...prev,
        {
          id: createId("nordy"),
          role: "nordy",
          content:
            "Something went wrong on my side. You can continue here, or reach the team at contact@northbridgeventuregroup.com.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }, [busy, entryPath, input, state]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close Nordi"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative z-10 flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-t-2xl border border-white/10 bg-[#090d13] shadow-2xl sm:rounded-2xl illum-l3"
      >
        <header className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-red">Nordi</p>
            <h2 className="text-sm font-semibold text-white sm:text-base">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-white/10 text-silver hover:text-white"
            aria-label="Close conversation"
          >
            ✕
          </button>
        </header>

        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-5">
          {lines.map((line) => (
            <div
              key={line.id}
              className={`max-w-[92%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                line.role === "user"
                  ? "ml-auto bg-red/90 text-white"
                  : "mr-auto border border-white/10 bg-white/[0.03] text-silver"
              }`}
            >
              {line.content}
            </div>
          ))}
          {busy ? (
            <p className="text-xs text-stone" aria-live="polite">
              Nordi is thinking…
            </p>
          ) : null}
          <div ref={bottomRef} />
        </div>

        <form
          className="border-t border-white/10 p-3 sm:p-4"
          onSubmit={(event) => {
            event.preventDefault();
            void send();
          }}
        >
          <label htmlFor="nordy-input" className="sr-only">
            Message Nordi
          </label>
          <div className="flex gap-2">
            <textarea
              id="nordy-input"
              ref={inputRef}
              rows={2}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void send();
                }
              }}
              placeholder="Ask about Northbridge or describe what you need…"
              className="min-h-11 w-full resize-none rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white placeholder:text-stone focus:border-red/50 focus:outline-none"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-xl bg-red px-4 text-sm font-semibold text-white hover:bg-red-hover disabled:opacity-40"
            >
              Send
            </button>
          </div>
          <p className="mt-2 text-[11px] text-stone">
            Verified company answers first. AI fallback only when needed. No invented pricing.
          </p>
        </form>
      </section>
    </div>
  );
}
