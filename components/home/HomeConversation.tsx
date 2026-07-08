"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useNeo } from "@/components/neo/NeoProvider";
import NordiMessageBubble from "@/components/home/NordiMessageBubble";
import NordiThinkingIndicator from "@/components/home/NordiThinkingIndicator";
import AboutPanel from "@/components/home/AboutPanel";
import SaveConversationCard from "@/components/home/SaveConversationCard";
import BusinessSummaryCard from "@/components/home/BusinessSummaryCard";
import RequestCallCard, { type CallRequest } from "@/components/home/RequestCallCard";
import type { DiscoveryEngineResult, DiscoveryProfile, WebsiteAnalysisResult } from "@/lib/cat/discovery-types";
import type { NordiMessageCard } from "@/lib/nordi/cards";
import {
  createEmptyMemory,
  deriveMilestones,
  hasRelationship,
  touchMemory,
  type NordiChatMessage,
} from "@/lib/nordi/conversation-memory";
import {
  buildPresenterSequence,
  buildSimpleSequence,
  buildWebsiteAnalysisSequence,
  deliverPresenterSequence,
} from "@/lib/nordi/conversation-presenter";
import type { NordiIdentity } from "@/lib/nordi/identity";
import {
  buildResumeMessage,
  buildSaveConfirmation,
  buildSaveConversationPrompt,
  buildWelcomeBackMessage,
  enrichProfileForRelationship,
} from "@/lib/nordi/relationship";
import { getNordiStorage } from "@/lib/nordi/storage";

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

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function toChatMessage(message: NordiChatMessage): NordiChatMessage {
  return { ...message, animate: message.animate ?? false };
}

export default function HomeConversation() {
  const { client } = useNeo();
  const storage = getNordiStorage();

  const [messages, setMessages] = useState<NordiChatMessage[]>([]);
  const [businessProfile, setBusinessProfile] = useState<DiscoveryProfile>({
    discoveryPhase: "learning",
    userMessageCount: 0,
  });
  const [knownSince, setKnownSince] = useState(() => new Date().toISOString());
  const [lastUpdated, setLastUpdated] = useState(() => new Date().toISOString());
  const [thinkingLabel, setThinkingLabel] = useState<string | null>(null);
  const [isDelivering, setIsDelivering] = useState(false);
  const [input, setInput] = useState("");
  const [showButtons, setShowButtons] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [introReady, setIntroReady] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [saveActive, setSaveActive] = useState(false);
  const [savePromptShown, setSavePromptShown] = useState(false);
  const [callActive, setCallActive] = useState(false);
  const [saved, setSaved] = useState(false);
  const [callRequested, setCallRequested] = useState(false);
  const [identity, setIdentity] = useState<NordiIdentity | null>(null);
  const [isReturning, setIsReturning] = useState(false);

  const sessionIdRef = useRef<string>(createId("home"));
  const messageIndexRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const analysisInFlightRef = useRef<string | null>(null);
  const welcomeBackShownRef = useRef(false);
  const pendingDoneRef = useRef<Map<string, () => void>>(new Map());
  const deliveryLockRef = useRef(false);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, []);

  const appendCatMessage = useCallback(
    (content: string, animate = true, card?: NordiMessageCard): Promise<void> => {
      const id = createId("cat");
      const timestamp = new Date().toISOString();

      return new Promise((resolve) => {
        if (!animate) {
          setMessages((prev) => [...prev, { id, role: "cat", content, card, animate: false, timestamp }]);
          resolve();
          return;
        }

        pendingDoneRef.current.set(id, resolve);
        setMessages((prev) => [...prev, { id, role: "cat", content, card, animate: true, timestamp }]);
      });
    },
    [],
  );

  const deliverSequence = useCallback(
    async (steps: ReturnType<typeof buildPresenterSequence>) => {
      if (deliveryLockRef.current) return;
      deliveryLockRef.current = true;
      setIsDelivering(true);

      try {
        await deliverPresenterSequence(steps, {
          onThink: (label) => setThinkingLabel(label),
          onThinkEnd: () => setThinkingLabel(null),
          onMessage: appendCatMessage,
        });
      } finally {
        deliveryLockRef.current = false;
        setIsDelivering(false);
        setThinkingLabel(null);
      }
    },
    [appendCatMessage],
  );

  const analyzeWebsiteInBackground = useCallback(
    async (url: string, profile: DiscoveryProfile) => {
      if (analysisInFlightRef.current === url) return;
      analysisInFlightRef.current = url;

      const messageIndex = messageIndexRef.current;
      messageIndexRef.current += 1;

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
          websiteAnalysisPending: false,
          insightDelivered: true,
          discoveryPhase: "insight_delivered",
          industry: prev.industry ?? analysis.category,
        }));

        const sequence = buildWebsiteAnalysisSequence(
          analysis,
          profile,
          sessionIdRef.current,
          messageIndex,
        );
        await deliverSequence(sequence);
      } catch {
        await deliverSequence(
          buildSimpleSequence(
            "I couldn't reach that website just now. We can keep going — feel free to paste the URL again later.",
            { animate: true },
          ),
        );
      }
    },
    [deliverSequence],
  );

  useEffect(() => {
    const stored = storage.load();

    if (stored && hasRelationship(stored)) {
      sessionIdRef.current = stored.sessionId;
      messageIndexRef.current = stored.messages.length;
      setMessages(stored.messages.map(toChatMessage));
      setBusinessProfile(enrichProfileForRelationship(stored.profile));
      setIdentity(stored.identity);
      setSaved(Boolean(stored.saved));
      setCallRequested(Boolean(stored.callRequested));
      setKnownSince(stored.knownSince);
      setLastUpdated(stored.lastUpdated);
      setIsReturning(true);
      setShowButtons(true);
      setShowInput(true);
      setIntroReady(true);

      if (!stored.welcomeBackShown) {
        welcomeBackShownRef.current = true;
        const welcomeMessage = stored.identity
          ? buildWelcomeBackMessage(stored)
          : buildResumeMessage(stored);

        window.setTimeout(() => {
          void deliverSequence(
            buildSimpleSequence(welcomeMessage, {
              thinkingContext: "reviewing-business",
              sessionId: stored.sessionId,
              messageIndex: stored.messages.length,
            }),
          );
        }, 500);
      } else {
        welcomeBackShownRef.current = true;
      }
      return;
    }

    sessionIdRef.current = createEmptyMemory(createId("home")).sessionId;

    const timer = window.setTimeout(() => {
      setMessages((prev) =>
        prev.length
          ? prev
          : [
              {
                id: "intro",
                role: "cat",
                content: INTRO_MESSAGE,
                animate: true,
                timestamp: new Date().toISOString(),
              },
            ],
      );
    }, 450);

    return () => window.clearTimeout(timer);
  }, [deliverSequence, storage]);

  useEffect(() => {
    if (!introReady) return;

    const profileWithRelationship = {
      ...businessProfile,
      isReturningVisitor: isReturning,
    };
    const nextMilestones = deriveMilestones(profileWithRelationship, []);
    if (saved) nextMilestones.push("conversation_saved");

    const memory = touchMemory({
      version: 1,
      sessionId: sessionIdRef.current,
      messages,
      profile: profileWithRelationship,
      identity,
      saved,
      callRequested,
      milestones: Array.from(new Set(nextMilestones)),
      knownSince,
      lastUpdated: new Date().toISOString(),
      welcomeBackShown: welcomeBackShownRef.current,
    });

    storage.save(memory);
    setLastUpdated(memory.lastUpdated);
  }, [
    introReady,
    messages,
    businessProfile,
    identity,
    saved,
    callRequested,
    isReturning,
    knownSince,
    storage,
  ]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, thinkingLabel, showButtons, showInput, saveActive, callActive, isDelivering, scrollToBottom]);

  const handleCatMessageDone = useCallback((id: string) => {
    const resolve = pendingDoneRef.current.get(id);
    if (resolve) {
      pendingDoneRef.current.delete(id);
      resolve();
    }

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
      if (!text || isDelivering || thinkingLabel) return;

      const userMessage: NordiChatMessage = {
        id: createId("user"),
        role: "user",
        content: text,
        animate: false,
        timestamp: new Date().toISOString(),
      };

      const nextMessages = [...messages, userMessage];
      setMessages(nextMessages);
      setInput("");

      const messageIndex = messageIndexRef.current;
      messageIndexRef.current += 1;

      const profileForRequest = {
        ...businessProfile,
        isReturningVisitor: isReturning,
      };

      try {
        const response = await client.cat.send(
          {
            sessionId: sessionIdRef.current,
            message: text,
            context: {
              currentModule: "homepage",
              businessProfile: profileForRequest as Record<string, unknown>,
              operationsSnapshot: {},
            },
          },
          {
            session: {
              id: sessionIdRef.current,
              messages: nextMessages,
              businessProfile: profileForRequest as Record<string, unknown>,
            },
            currentModule: "homepage",
          },
        );

        const updates = (response.profileUpdates ?? {}) as DiscoveryProfile;
        const nextProfile = { ...businessProfile, ...updates, isReturningVisitor: isReturning };
        setBusinessProfile(nextProfile);

        const engineResult: DiscoveryEngineResult = {
          reply: response.reply,
          progressiveReply: response.metadata?.progressiveReply as string[] | undefined,
          thinkingContext: response.metadata?.thinkingContext as DiscoveryEngineResult["thinkingContext"],
          cards: response.metadata?.cards as DiscoveryEngineResult["cards"],
        };

        const sequence = buildPresenterSequence({
          result: engineResult,
          sessionId: sessionIdRef.current,
          messageIndex,
        });

        await deliverSequence(sequence);

        const analysisUrl =
          typeof response.metadata?.triggerWebsiteAnalysis === "string"
            ? response.metadata.triggerWebsiteAnalysis
            : undefined;

        if (analysisUrl) {
          setBusinessProfile((prev) => ({ ...prev, websiteAnalysisPending: true }));
          void analyzeWebsiteInBackground(analysisUrl, nextProfile);
        }
      } catch {
        await deliverSequence(
          buildSimpleSequence(
            "I'm having a brief connection issue. Please try again — I'm still here.",
            { thinkingContext: "general", sessionId: sessionIdRef.current, messageIndex },
          ),
        );
      }
    },
    [
      analyzeWebsiteInBackground,
      businessProfile,
      client,
      deliverSequence,
      isDelivering,
      isReturning,
      messages,
      thinkingLabel,
    ],
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

    setCallActive(false);

    if (!savePromptShown) {
      void deliverSequence(buildSimpleSequence(buildSaveConversationPrompt()));
      setSavePromptShown(true);
    }

    setSaveActive(true);
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

  const handleSaved = (savedIdentity: NordiIdentity) => {
    setIdentity(savedIdentity);
    setSaved(true);
    setSaveActive(false);
    void appendCatMessage(buildSaveConfirmation(savedIdentity));
  };

  const handleCallRequested = (request: CallRequest) => {
    setCallRequested(true);
    setCallActive(false);

    const timeNote = request.preferredTime ? ` around ${request.preferredTime}` : "";

    void appendCatMessage(
      `Thank you, ${request.name}. Someone from Northbridge will reach out at **${request.contact}**${timeNote}.\n\nWe'll continue our conversation here in the meantime.`,
    );
  };

  const busy = isDelivering || Boolean(thinkingLabel);

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

        <BusinessSummaryCard
          profile={businessProfile}
          knownSince={knownSince}
          lastUpdated={lastUpdated}
        />

        <div ref={scrollRef} className="flex-1 overflow-y-auto pr-1 scroll-smooth">
          <div className="space-y-6 py-3">
            {messages.map((message) =>
              message.role === "cat" ? (
                <NordiMessageBubble
                  key={message.id}
                  messageId={message.id}
                  content={message.content}
                  animate={message.animate ?? false}
                  card={message.card}
                  onDone={() => handleCatMessageDone(message.id)}
                  onProgress={scrollToBottom}
                />
              ) : (
                <div key={message.id} className="flex justify-end animate-fade-in">
                  <div className="max-w-[92%] rounded-2xl bg-red/20 px-4 py-3 shadow-sm shadow-black/10">
                    <p className="text-sm leading-relaxed text-white">{message.content}</p>
                  </div>
                </div>
              ),
            )}

            {thinkingLabel ? <NordiThinkingIndicator label={thinkingLabel} /> : null}

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
                disabled={!input.trim() || busy}
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
