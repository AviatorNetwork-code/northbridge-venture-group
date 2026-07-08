"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CAT_OPEN_EVENT } from "@/components/CatButton";
import { catIntro } from "@/lib/workforce";
import type {
  AdvisorInput,
  AdvisorRecommendation,
  Region,
} from "@/lib/workforceAdvisor";

type QuickReply = { label: string; input: AdvisorInput };

const QUICK_REPLIES: QuickReply[] = [
  { label: "How do I start?", input: { message: "how do I start" } },
  {
    label: "I run a dental clinic",
    input: {
      industry: "dental clinic",
      requestedPlan: "Team",
      message: "we handle appointments and billing",
    },
  },
  {
    label: "I run a restaurant",
    input: { industry: "restaurant", message: "we take reservations and orders" },
  },
  { label: "Drug testing facility", input: { industry: "drug testing facility" } },
  { label: "Flight school", input: { industry: "flight school" } },
  {
    label: "Should I add a Manager?",
    input: {
      requestedPlan: "Manager",
      message: "one specialist is keeping up with our workload",
    },
  },
];

type PanelMessage =
  | { from: "you"; text: string }
  | { from: "cat"; text: string }
  | { from: "cat"; recommendation: AdvisorRecommendation };

function CatMark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-red text-white font-semibold tracking-tight shrink-0 ${className}`}
      aria-hidden
    >
      CAT
    </span>
  );
}

function RecommendationCard({ rec }: { rec: AdvisorRecommendation }) {
  return (
    <div className="max-w-[92%] rounded-2xl rounded-bl-sm bg-black/50 border border-white/10 px-4 py-3.5 text-sm leading-relaxed space-y-3">
      <div className="flex items-baseline justify-between gap-3 border-b border-white/10 pb-2.5">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-red font-semibold">
            Recommended
          </p>
          <p className="text-white font-semibold text-base">{rec.recommendedPlan}</p>
        </div>
        <div className="text-right">
          <p className="text-white font-semibold">{rec.pricing.startingPrice}</p>
          <p className="text-[10px] text-silver/80">
            {rec.pricing.region} · {rec.pricing.note}
          </p>
        </div>
      </div>

      <p className="text-silver">{rec.why}</p>

      <div className="rounded-lg bg-white/[0.04] border border-white/10 px-3 py-2">
        <p className="text-[11px] uppercase tracking-wider text-silver/70 mb-0.5">
          CAT won&apos;t oversell
        </p>
        <p className="text-silver text-[13px]">{rec.notRecommended}</p>
      </div>

      {rec.scopeNote && (
        <div className="rounded-lg bg-white/[0.04] border border-white/10 px-3 py-2">
          <p className="text-[11px] uppercase tracking-wider text-silver/70 mb-0.5">
            Scope
          </p>
          <p className="text-silver text-[13px]">{rec.scopeNote}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[13px]">
        <span className="text-silver">
          <span className="text-silver/60">Capacity:</span> {rec.estimatedTeamTasks}
        </span>
      </div>

      <div className="pt-1">
        <p className="text-[11px] uppercase tracking-wider text-silver/70 mb-0.5">
          Next step
        </p>
        <p className="text-white text-[13px]">{rec.nextStep}</p>
      </div>

      <p className="text-[10px] text-silver/50 pt-1 border-t border-white/10">
        {rec.disclaimer}
      </p>
    </div>
  );
}

export default function CatAdvisor() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<PanelMessage[]>(() =>
    catIntro.map((m) => ({ from: "cat", text: m.text })),
  );
  const [region, setRegion] = useState<Region>("US");
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const ask = useCallback(
    async (input: AdvisorInput, youLabel: string) => {
      setMessages((prev) => [...prev, { from: "you", text: youLabel }]);
      setLoading(true);
      try {
        const res = await fetch("/api/cat/workforce-advisor", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ ...input, region }),
        });
        if (!res.ok) throw new Error(`status ${res.status}`);
        const data = (await res.json()) as { recommendation: AdvisorRecommendation };
        setMessages((prev) => [
          ...prev,
          { from: "cat", recommendation: data.recommendation },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            from: "cat",
            text: "I couldn't reach the advisor service just now. Please try again in a moment, or talk to our team.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [region],
  );

  // Open (optionally with a topic → industry) from CatButton events.
  useEffect(() => {
    function onOpen(e: Event) {
      const topic = (e as CustomEvent<{ topic?: string }>).detail?.topic;
      setOpen(true);
      if (topic) {
        const preset = QUICK_REPLIES.find(
          (q) => q.input.industry?.toLowerCase() === topic.toLowerCase(),
        );
        if (preset) ask(preset.input, preset.label);
        else ask({ industry: topic, message: topic }, `I run a ${topic}`);
      }
    }
    window.addEventListener(CAT_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(CAT_OPEN_EVENT, onOpen);
  }, [ask]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open, loading]);

  function submitDraft(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text || loading) return;
    setDraft("");
    ask({ message: text }, text);
  }

  return (
    <>
      {/* Persistent launcher — top-center on desktop, bottom-center on mobile */}
      {!open && (
        <>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="hidden md:flex fixed top-[68px] left-1/2 -translate-x-1/2 z-40 items-center gap-3 pl-2 pr-5 py-2 rounded-full bg-black/85 backdrop-blur border border-white/15 shadow-lg shadow-black/40 hover:border-red/60 transition-colors group"
          >
            <CatMark className="h-9 w-9 text-xs group-hover:bg-red-hover" />
            <span className="flex flex-col items-start leading-tight">
              <span className="text-sm font-semibold text-white">Talk to CAT</span>
              <span className="text-[11px] text-silver">Your Workforce Advisor</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2.5 pl-2 pr-5 py-2 rounded-full bg-red text-white shadow-lg shadow-black/50 active:scale-[0.98] transition-transform"
            aria-label="Talk to CAT, your Workforce Advisor"
          >
            <CatMark className="h-8 w-8 text-[11px] bg-black/25" />
            <span className="flex flex-col items-start leading-tight">
              <span className="text-sm font-semibold">Talk to CAT</span>
              <span className="text-[10px] text-white/80">Your Workforce Advisor</span>
            </span>
          </button>
        </>
      )}

      {/* Advisor panel */}
      {open && (
        <div
          className="fixed inset-0 z-[60] flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="CAT — Northbridge Workforce Advisor"
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="relative w-full sm:max-w-md h-full bg-slate border-l border-white/10 flex flex-col animate-in">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 sm:px-5 py-4 border-b border-white/10 bg-black/40">
              <CatMark className="h-10 w-10 text-xs" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white leading-tight">CAT</p>
                <p className="text-xs text-silver leading-tight">Your Workforce Advisor</p>
              </div>
              {/* Region toggle drives pricing in recommendations */}
              <div
                className="flex rounded-full border border-white/15 overflow-hidden text-xs"
                role="group"
                aria-label="Pricing region"
              >
                {(["CO", "US"] as Region[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRegion(r)}
                    aria-pressed={region === r}
                    className={`px-2.5 py-1 font-medium transition-colors ${
                      region === r
                        ? "bg-red text-white"
                        : "text-silver hover:text-white"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close advisor"
                className="inline-flex h-9 w-9 items-center justify-center border border-white/10 text-silver hover:text-white hover:border-white/25 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M6 6L18 18M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 sm:px-5 py-5 space-y-4">
              {messages.map((m, i) =>
                "recommendation" in m ? (
                  <div key={i} className="flex justify-start">
                    <RecommendationCard rec={m.recommendation} />
                  </div>
                ) : (
                  <div
                    key={i}
                    className={m.from === "you" ? "flex justify-end" : "flex justify-start"}
                  >
                    <div
                      className={
                        m.from === "you"
                          ? "max-w-[85%] rounded-2xl rounded-br-sm bg-red text-white px-4 py-2.5 text-sm leading-relaxed"
                          : "max-w-[88%] rounded-2xl rounded-bl-sm bg-black/50 border border-white/10 text-silver px-4 py-2.5 text-sm leading-relaxed"
                      }
                    >
                      {m.text}
                    </div>
                  </div>
                ),
              )}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-sm bg-black/50 border border-white/10 text-silver px-4 py-2.5 text-sm">
                    CAT is thinking…
                  </div>
                </div>
              )}
            </div>

            {/* Quick replies */}
            <div className="px-4 sm:px-5 pt-3 border-t border-white/10">
              <p className="text-[11px] uppercase tracking-wider text-silver/70 mb-2">
                Ask CAT
              </p>
              <div className="flex flex-wrap gap-2">
                {QUICK_REPLIES.map((q) => (
                  <button
                    key={q.label}
                    type="button"
                    disabled={loading}
                    onClick={() => ask(q.input, q.label)}
                    className="px-3 py-1.5 text-xs font-medium text-white border border-white/15 rounded-full hover:border-red/60 hover:bg-white/5 transition-colors disabled:opacity-50"
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Composer */}
            <form onSubmit={submitDraft} className="px-4 sm:px-5 py-4 flex items-center gap-2">
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Describe your business…"
                aria-label="Describe your business"
                className="flex-1 bg-black/50 border border-white/15 rounded-full px-4 py-2.5 text-sm text-white placeholder:text-silver/50 focus:outline-none focus:border-red/60"
              />
              <button
                type="submit"
                disabled={loading || !draft.trim()}
                className="inline-flex h-10 px-4 items-center justify-center rounded-full bg-red text-white text-sm font-medium hover:bg-red-hover transition-colors disabled:opacity-50"
              >
                Send
              </button>
            </form>

            <p className="px-4 sm:px-5 pb-4 -mt-2 text-[11px] text-silver/70 leading-relaxed">
              Recommendations come from Northbridge workforce logic (NEO light
              bridge). No billing is connected yet.{" "}
              <Link
                href="/contact"
                className="text-red hover:text-red-hover underline underline-offset-2"
              >
                Talk to our team
              </Link>
              .
            </p>
          </div>
        </div>
      )}
    </>
  );
}
