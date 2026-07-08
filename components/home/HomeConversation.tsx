"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useNeo } from "@/components/neo/NeoProvider";
import NordiAvatar from "@/components/home/NordiAvatar";
import CatTypewriter from "@/components/home/CatTypewriter";
import AboutPanel from "@/components/home/AboutPanel";
import SaveConversationCard, { type SavedIdentity } from "@/components/home/SaveConversationCard";
import RequestCallCard, { type CallRequest } from "@/components/home/RequestCallCard";
import type { DiscoveryProfile, WebsiteAnalysisResult } from "@/lib/cat/discovery-types";
import { generateFirstInsight } from "@/lib/cat/website-analysis";

const INTRO_MESSAGE = [
  "Hello.",
  "",
  "I'm Nordi.",
  "",
  "I was created by Northbridge Digital to help business owners understand their business, organize their operations, and build a digital workforce only when it truly makes sense.",
  "",
  "My job is not to sell you software.",
  "",
  "My job is to understand your business first.",
  "",
  "If I believe we can help, I'll explain why.",
  "",
  "If I don't believe we're the right fit, I'll tell you honestly.",
  "",
  "Tell me about your business in your own words.",
].join("\n");

const STORAGE_KEY = "northbridge-home-cat";
const INSIGHT_DELAY_MS = 9000;

type ChatRole = "cat" | "user";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  animate: boolean;
};

type StoredState = {
  sessionId: string;
  messages: ChatMessage[];
  businessProfile: DiscoveryProfile;
  identity: SavedIdentity | null;
  saved: boolean;
  callRequested: boolean;
};

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function loadStoredState(): StoredState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredState;
    if (!parsed.messages?.length) return null;
    return parsed;
  } catch {
    return null;
  }
}

export default function HomeConversation() {
  const { client } = useNeo();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [businessProfile, setBusinessProfile] = useState<DiscoveryProfile>({
    discoveryPhase: "learning",
    userMessageCount: 0,
  });
  const [isThinking, setIsThinking] = useState(false);
  const [input, setInput] = useState("");
  const [showButtons, setShowButtons] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [introReady, setIntroReady] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [saveActive, setSaveActive] = useState(false);
  const [callActive, setCallActive] = useState(false);
  const [saved, setSaved] = useState(false);
  const [callRequested, setCallRequested] = useState(false);
  const [identity, setIdentity] = useState<SavedIdentity | null>(null);

  const sessionIdRef = useRef<string>(createId("home"));
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const insightDeliveredRef = useRef(false);
  const analysisInFlightRef = useRef<string | null>(null);
  const profileRef = useRef(businessProfile);

  profileRef.current = businessProfile;

  const appendCatMessage = useCallback((content: string, animate = true) => {
    setMessages((prev) => [
      ...prev,
      { id: createId("cat"), role: "cat", content, animate },
    ]);
  }, []);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, []);

  const scheduleInsight = useCallback(
    (analysis: WebsiteAnalysisResult, url: string) => {
      window.setTimeout(() => {
        if (insightDeliveredRef.current) return;

        const insight = generateFirstInsight(analysis, profileRef.current);
        if (!insight) return;

        insightDeliveredRef.current = true;
        appendCatMessage(insight);
        setBusinessProfile((prev) => ({
          ...prev,
          website: url,
          websiteAnalysis: analysis,
          websiteAnalysisPending: false,
          insightDelivered: true,
          discoveryPhase: "insight_delivered",
          industry: prev.industry ?? analysis.category,
        }));
      }, INSIGHT_DELAY_MS);
    },
    [appendCatMessage],
  );

  const analyzeWebsiteInBackground = useCallback(
    async (url: string) => {
      if (analysisInFlightRef.current === url) return;
      analysisInFlightRef.current = url;

      try {
        const response = await fetch("/api/website-analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });

        if (!response.ok) return;

        const analysis = (await response.json()) as WebsiteAnalysisResult;
        setBusinessProfile((prev) => ({
          ...prev,
          website: url,
          websiteAnalysis: analysis,
          industry: prev.industry ?? analysis.category,
        }));

        scheduleInsight(analysis, url);
      } catch {
        // Discovery continues without blocking the customer.
      }
    },
    [scheduleInsight],
  );

  useEffect(() => {
    const stored = loadStoredState();

    if (stored) {
      sessionIdRef.current = stored.sessionId;
      setMessages(stored.messages.map((message) => ({ ...message, animate: false })));
      setBusinessProfile(stored.businessProfile ?? { discoveryPhase: "learning" });
      insightDeliveredRef.current = Boolean(stored.businessProfile?.insightDelivered);
      setIdentity(stored.identity ?? null);
      setSaved(Boolean(stored.saved));
      setCallRequested(Boolean(stored.callRequested));
      setShowButtons(true);
      setShowInput(true);
      setIntroReady(true);
      return;
    }

    const timer = window.setTimeout(() => {
      setMessages((prev) =>
        prev.length
          ? prev
          : [{ id: "intro", role: "cat", content: INTRO_MESSAGE, animate: true }],
      );
    }, 450);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!introReady) return;
    const data: StoredState = {
      sessionId: sessionIdRef.current,
      messages,
      businessProfile,
      identity,
      saved,
      callRequested,
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Ignore storage write failures.
    }
  }, [introReady, messages, businessProfile, identity, saved, callRequested]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking, showButtons, showInput, saveActive, callActive, scrollToBottom]);

  const handleCatMessageDone = useCallback((id: string) => {
    if (id === "intro") {
      window.setTimeout(() => setShowButtons(true), 600);
      window.setTimeout(() => {
        setShowInput(true);
        setIntroReady(true);
        inputRef.current?.focus();
      }, 1200);
    }
  }, []);

  const sendMessage = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || isThinking) return;

      const userMessage: ChatMessage = {
        id: createId("user"),
        role: "user",
        content: text,
        animate: false,
      };

      const nextMessages = [...messages, userMessage];
      setMessages(nextMessages);
      setInput("");
      setIsThinking(true);

      try {
        const response = await client.cat.send(
          {
            sessionId: sessionIdRef.current,
            message: text,
            context: {
              currentModule: "homepage",
              businessProfile: businessProfile as Record<string, unknown>,
              operationsSnapshot: {},
            },
          },
          {
            session: {
              id: sessionIdRef.current,
              messages: nextMessages,
              businessProfile: businessProfile as Record<string, unknown>,
            },
            currentModule: "homepage",
          },
        );

        const updates = (response.profileUpdates ?? {}) as DiscoveryProfile;
        setBusinessProfile((prev) => ({ ...prev, ...updates }));

        appendCatMessage(response.reply);

        const analysisUrl =
          typeof response.metadata?.triggerWebsiteAnalysis === "string"
            ? response.metadata.triggerWebsiteAnalysis
            : undefined;

        if (analysisUrl) {
          void analyzeWebsiteInBackground(analysisUrl);
        }
      } catch {
        appendCatMessage(
          "I'm having a brief connection issue. Please try again — I'm still here.",
        );
      } finally {
        setIsThinking(false);
      }
    },
    [analyzeWebsiteInBackground, appendCatMessage, businessProfile, client, isThinking, messages],
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    void sendMessage(input);
  };

  const handleSaveClick = () => {
    if (saved) {
      scrollToBottom();
      return;
    }
    setSaveActive(true);
    setCallActive(false);
    window.setTimeout(scrollToBottom, 60);
  };

  const handleCallClick = () => {
    if (callRequested) {
      scrollToBottom();
      return;
    }
    setCallActive(true);
    setSaveActive(false);
    window.setTimeout(scrollToBottom, 60);
  };

  const handleSaved = (savedIdentity: SavedIdentity) => {
    setIdentity(savedIdentity);
    setSaved(true);
    setSaveActive(false);

    const contact =
      savedIdentity.method === "both"
        ? `${savedIdentity.email} and ${savedIdentity.phone}`
        : savedIdentity.email ?? savedIdentity.phone ?? "you";

    const protectedNote = savedIdentity.verified
      ? " This conversation is now protected with your verification code."
      : "";

    appendCatMessage(
      `You're all set — I'll recognize you as **${contact}** next time.${protectedNote}\nWe can pick up right where we left off whenever you come back.`,
    );
  };

  const handleCallRequested = (request: CallRequest) => {
    setCallRequested(true);
    setCallActive(false);

    const contactLabel =
      request.method === "email" ? request.contact : request.contact;
    const timeNote = request.preferredTime ? ` around ${request.preferredTime}` : "";

    appendCatMessage(
      `Thank you, ${request.name}. Someone from Northbridge will reach out at **${contactLabel}**${timeNote}.\n\nWe'll continue our conversation here in the meantime.`,
    );
  };

  return (
    <section className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-black">
      <div className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 pb-4 pt-[4.5rem] sm:px-6 sm:pt-[4.75rem]">
        {showButtons ? (
          <div className="mb-3 flex flex-wrap items-center gap-2 animate-fade-slide-up">
            <button
              type="button"
              onClick={() => setAboutOpen(true)}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/15 bg-black/40 px-5 text-sm font-medium text-white backdrop-blur transition-colors hover:border-white/30 hover:bg-white/5"
            >
              About Northbridge
            </button>
            <button
              type="button"
              onClick={handleSaveClick}
              aria-pressed={saved}
              className={[
                "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium backdrop-blur transition-colors",
                saved
                  ? "border border-red/40 bg-red/15 text-white"
                  : "border border-white/15 bg-black/40 text-white hover:border-white/30 hover:bg-white/5",
              ].join(" ")}
            >
              {saved ? "Conversation saved" : "Save Conversation"}
            </button>
            <button
              type="button"
              onClick={handleCallClick}
              aria-pressed={callRequested}
              className={[
                "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium backdrop-blur transition-colors",
                callRequested
                  ? "border border-red/40 bg-red/15 text-white"
                  : "border border-white/15 bg-black/40 text-white hover:border-white/30 hover:bg-white/5",
              ].join(" ")}
            >
              {callRequested ? "Call requested" : "Request a Call"}
            </button>
          </div>
        ) : null}

        <div ref={scrollRef} className="flex-1 overflow-y-auto pr-1">
          <div className="space-y-5 py-2">
            {messages.map((message) =>
              message.role === "cat" ? (
                <div key={message.id} className="flex items-start gap-3 animate-fade-in">
                  <NordiAvatar />
                  <div className="max-w-[92%] rounded-2xl border border-white/10 bg-slate/50 px-4 py-3">
                    <CatTypewriter
                      text={message.content}
                      animate={message.animate}
                      onDone={() => handleCatMessageDone(message.id)}
                      onProgress={scrollToBottom}
                    />
                  </div>
                </div>
              ) : (
                <div key={message.id} className="flex justify-end animate-fade-in">
                  <div className="max-w-[92%] rounded-2xl bg-red/20 px-4 py-3">
                    <p className="text-sm leading-relaxed text-white">{message.content}</p>
                  </div>
                </div>
              ),
            )}

            {isThinking ? (
              <div className="flex items-start gap-3 animate-fade-in">
                <NordiAvatar />
                <div className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-slate/50 px-4 py-4">
                  <span className="cat-typing-dot" style={{ animationDelay: "0ms" }} />
                  <span className="cat-typing-dot" style={{ animationDelay: "160ms" }} />
                  <span className="cat-typing-dot" style={{ animationDelay: "320ms" }} />
                </div>
              </div>
            ) : null}

            {saveActive && !saved ? (
              <SaveConversationCard onComplete={handleSaved} onCancel={() => setSaveActive(false)} />
            ) : null}

            {callActive && !callRequested ? (
              <RequestCallCard
                onComplete={handleCallRequested}
                onCancel={() => setCallActive(false)}
              />
            ) : null}

            <div ref={bottomRef} />
          </div>
        </div>

        {showInput ? (
          <form onSubmit={handleSubmit} className="mt-3 animate-fade-slide-up">
            <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-black/50 p-2 backdrop-blur focus-within:border-red/40">
              <label className="flex-1">
                <span className="sr-only">Tell Nordi about your business</span>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      void sendMessage(input);
                    }
                  }}
                  rows={2}
                  placeholder="Tell me about your business in your own words…"
                  className="w-full resize-none bg-transparent px-3 py-2.5 text-base text-white placeholder:text-stone focus:outline-none"
                />
              </label>
              <button
                type="submit"
                disabled={!input.trim() || isThinking}
                className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-red px-5 text-sm font-semibold text-white transition-colors hover:bg-red-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </form>
        ) : null}
      </div>

      <AboutPanel open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </section>
  );
}
