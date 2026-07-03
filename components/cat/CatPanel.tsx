"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import CatMessage from "@/components/cat/CatMessage";
import { trackCatEvent, trackConversionEvent } from "@/lib/cat/analytics";
import type { ConsultantSessionState } from "@/lib/cat/consultantTypes";
import { hasStageProgressed, getStageLabel } from "@/lib/cat/conversationStages";
import { dispatchNeoExport } from "@/lib/cat/neoIntegration";
import { buildMetricsSnapshot } from "@/lib/cat/successMetrics";
import {
  askCatAssistant,
  getGreetingResponse,
} from "@/lib/cat/websiteAssistant";
import { CAT_QUICK_QUESTIONS } from "@/lib/cat/websiteKnowledge";
import type {
  CatAssistantResponse,
  CatCta,
  CatMessageRecord,
  CatQuickQuestion,
} from "@/lib/cat/websiteAssistantTypes";

interface CatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

function createMessageId(): string {
  return `cat-msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function mapResponseToMessage(response: CatAssistantResponse): CatMessageRecord {
  return {
    id: createMessageId(),
    role: "assistant",
    content: response.message,
    ctas: response.ctas,
    timestamp: Date.now(),
    stage: response.stage,
    stageLabel: response.stageLabel,
    followUpQuestion: response.followUpQuestion,
    productRecommendation: response.productRecommendation,
  };
}

export default function CatPanel({ isOpen, onClose }: CatPanelProps) {
  const panelId = useId();
  const titleId = `${panelId}-title`;
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionRef = useRef<ConsultantSessionState | undefined>(undefined);
  const previousStageRef = useRef<string | undefined>(undefined);

  const [messages, setMessages] = useState<CatMessageRecord[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const trackResponseAnalytics = useCallback((response: CatAssistantResponse) => {
    if (response.session) {
      sessionRef.current = response.session;
    }

    if (
      response.stage &&
      previousStageRef.current &&
      hasStageProgressed(
        previousStageRef.current as ConsultantSessionState["stage"],
        response.stage,
      )
    ) {
      trackCatEvent("cat_stage_transition", {
        from: previousStageRef.current,
        to: response.stage,
      });
    }
    if (response.stage) {
      previousStageRef.current = response.stage;
    }

    if (response.followUpQuestion) {
      trackCatEvent("cat_follow_up_asked", { stage: response.stage });
    }

    if (response.productRecommendation) {
      trackCatEvent("cat_product_recommended", {
        product_id: response.productRecommendation.productId,
        fit_score: response.productRecommendation.fitScore,
      });
    }

    if (response.primaryIntent) {
      trackCatEvent("cat_understanding_signal_captured", {
        intent: response.primaryIntent,
      });
    }

    if (response.sessionScoreDelta) {
      trackCatEvent("cat_session_scores_updated", {
        conversion_probability: response.sessionScoreDelta.after.conversionProbability,
        product_understanding: response.sessionScoreDelta.after.productUnderstanding,
        trust: response.sessionScoreDelta.after.trust,
      });
    }

    if (response.recommendation) {
      trackCatEvent("cat_recommendation_generated", {
        action: response.recommendation.action,
        topic: response.matchedTopic,
        stage: response.stage,
      });
    }

    if (response.qualifiedLead) {
      trackConversionEvent("qualified_lead", { stage: response.stage });
    }

    if (response.stage === "convert") {
      trackConversionEvent("consultation_intent", {
        conversion_probability: response.session?.scores.conversionProbability,
      });
    }
  }, []);

  const exportSessionOnClose = useCallback(() => {
    if (sessionRef.current) {
      const payload = dispatchNeoExport(sessionRef.current);
      trackCatEvent("cat_neo_export", {
        turn_count: sessionRef.current.turnCount,
        stage: sessionRef.current.stage,
      });
      trackConversionEvent("conversation_complete", {
        metrics: JSON.stringify(buildMetricsSnapshot(sessionRef.current)),
      });
      void payload;
    }
  }, []);

  useEffect(() => {
    if (isOpen && !initialized) {
      const greeting = getGreetingResponse();
      sessionRef.current = greeting.session;
      previousStageRef.current = greeting.stage;
      setMessages([mapResponseToMessage(greeting)]);
      setInitialized(true);
    }
  }, [isOpen, initialized]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      const timer = window.setTimeout(() => inputRef.current?.focus(), 150);
      return () => window.clearTimeout(timer);
    }
  }, [isOpen, messages, scrollToBottom]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        exportSessionOnClose();
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, exportSessionOnClose]);

  const appendAssistantResponse = useCallback(
    async (prompt: string, source: "typed" | "quick_question") => {
      const userMessage: CatMessageRecord = {
        id: createMessageId(),
        role: "user",
        content: prompt,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsThinking(true);

      trackCatEvent(
        source === "quick_question" ? "cat_question_selected" : "cat_message_sent",
        { prompt_length: prompt.length, stage: sessionRef.current?.stage },
      );

      try {
        const response = await askCatAssistant(prompt, {
          messageHistory: [...messages, userMessage],
          session: sessionRef.current,
        });

        trackResponseAnalytics(response);
        setMessages((prev) => [...prev, mapResponseToMessage(response)]);
      } finally {
        setIsThinking(false);
      }
    },
    [messages, trackResponseAnalytics],
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed || isThinking) return;

    setInputValue("");
    await appendAssistantResponse(trimmed, "typed");
  };

  const handleQuickQuestion = async (question: CatQuickQuestion) => {
    if (isThinking) return;
    await appendAssistantResponse(question.prompt, "quick_question");
  };

  const handleCtaClick = (cta: CatCta) => {
    if (sessionRef.current) {
      sessionRef.current = { ...sessionRef.current, ctaClicked: true };
    }
    trackConversionEvent("cta_click", {
      cta_id: cta.id,
      href: cta.href,
      action: cta.action,
      stage: sessionRef.current?.stage,
    });
  };

  const handleClose = () => {
    exportSessionOnClose();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      id={panelId}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed z-[60] inset-x-3 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] sm:inset-x-auto sm:right-6 sm:bottom-[calc(5.5rem+env(safe-area-inset-bottom))] sm:w-[min(100%,24rem)] md:w-[26rem] flex flex-col max-h-[min(72vh,34rem)] border border-white/15 bg-black shadow-2xl shadow-black/60"
    >
      <header className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/10 bg-slate/40 shrink-0">
        <div>
          <p id={titleId} className="text-sm font-semibold text-white tracking-wide">
            Northbridge Consultant
          </p>
          <p className="text-xs text-silver mt-0.5">
            Digital solutions guidance ·{" "}
            {sessionRef.current?.stage
              ? getStageLabel(sessionRef.current.stage)
              : "Getting started"}
          </p>
        </div>
        <button
          type="button"
          onClick={handleClose}
          className="inline-flex items-center justify-center h-8 w-8 border border-white/10 text-silver hover:text-white hover:border-white/25 transition-colors"
          aria-label="Close consultant"
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
      </header>

      <div
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        className="flex-1 overflow-y-auto px-3 py-3 sm:px-4 space-y-3"
      >
        <div role="list" className="space-y-3">
          {messages.map((message) => (
            <CatMessage key={message.id} message={message} onCtaClick={handleCtaClick} />
          ))}
        </div>
        {isThinking && (
          <p className="text-xs text-silver px-1" aria-live="polite">
            Thinking…
          </p>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="px-3 sm:px-4 py-2 border-t border-white/10 shrink-0">
        <p className="text-[10px] uppercase tracking-wider text-silver/80 mb-2">
          Conversation starters
        </p>
        <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
          {CAT_QUICK_QUESTIONS.map((question) => (
            <button
              key={question.id}
              type="button"
              disabled={isThinking}
              onClick={() => handleQuickQuestion(question)}
              className="text-left px-2.5 py-1 text-[11px] sm:text-xs border border-white/10 text-silver hover:border-white/25 hover:text-white transition-colors disabled:opacity-50"
            >
              {question.label}
            </button>
          ))}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex gap-2 px-3 sm:px-4 py-3 border-t border-white/10 shrink-0"
      >
        <label htmlFor={`${panelId}-input`} className="sr-only">
          Describe your needs
        </label>
        <input
          ref={inputRef}
          id={`${panelId}-input`}
          type="text"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder="Describe your situation…"
          disabled={isThinking}
          autoComplete="off"
          className="flex-1 min-w-0 px-3 py-2 text-sm bg-black border border-white/15 text-white placeholder:text-silver/60 focus:outline-none focus:border-white/30 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isThinking || !inputValue.trim()}
          className="shrink-0 px-4 py-2 text-sm font-medium bg-red text-white hover:bg-red-hover transition-colors disabled:opacity-50 disabled:hover:bg-red"
        >
          Send
        </button>
      </form>
    </div>
  );
}
