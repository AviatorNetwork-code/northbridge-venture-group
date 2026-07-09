"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useNeo } from "@/components/neo/NeoProvider";
import { useNordiActivity } from "@/components/home/NordiActivityContext";
import NordiMessageBubble from "@/components/home/NordiMessageBubble";
import NordiThinkingIndicator from "@/components/home/NordiThinkingIndicator";
import PublicWebsiteMenu from "@/components/home/PublicWebsiteMenu";
import NordiActionBar from "@/components/home/NordiActionBar";
import ConversationLearningConsentCard from "@/components/home/ConversationLearningConsentCard";
import SaveConversationCard from "@/components/home/SaveConversationCard";
import BusinessSummaryCard from "@/components/home/BusinessSummaryCard";
import RequestCallCard, { type CallRequest } from "@/components/home/RequestCallCard";
import type { DiscoveryEngineResult, DiscoveryProfile, WebsiteAnalysisResult } from "@/lib/cat/discovery-types";
import { submitConversationForLearning } from "@/lib/cat/conversation-learning-bridge";
import { mergeProfile as mergeDiscoveryProfile } from "@/lib/cat/discovery-profile-state";
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
import {
  BROWSE_MESSAGE,
  detectHumanAssistanceRequest,
  HUMAN_CONNECT_MESSAGE,
  INTRO_MESSAGE,
  SAVE_PROMPT_MESSAGE,
  shouldOfferSavePrompt,
  shouldShowSaveButton,
} from "@/lib/nordi/home-conversation-flow";
import {
  appendConsentAudit,
  createDefaultFounderLearningSettings,
  isFounderIdentity,
  markConsentPromptShown,
  acceptLearningConsent,
  declineLearningConsent,
  resolveLearningEligible,
  shouldAskForConsent,
  type ConversationLearningConsent,
  type ConsentAuditEntry,
  type FounderLearningSettings,
} from "@/lib/nordi/conversation-learning-consent";
import type { NordiIdentity } from "@/lib/nordi/identity";
import {
  buildResumeMessage,
  buildSaveConfirmation,
  buildWelcomeBackMessage,
  enrichProfileForRelationship,
} from "@/lib/nordi/relationship";
import { getNordiStorage } from "@/lib/nordi/storage";

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function toChatMessage(message: NordiChatMessage): NordiChatMessage {
  return { ...message, animate: message.animate ?? false };
}

export default function HomeConversation() {
  const { client } = useNeo();
  const { setIsActive } = useNordiActivity();
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
  const [showExploreButton, setShowExploreButton] = useState(false);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [showCallButton, setShowCallButton] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [introReady, setIntroReady] = useState(false);
  const [websiteMenuOpen, setWebsiteMenuOpen] = useState(false);
  const [saveActive, setSaveActive] = useState(false);
  const [savePromptShown, setSavePromptShown] = useState(false);
  const [callActive, setCallActive] = useState(false);
  const [saved, setSaved] = useState(false);
  const [callRequested, setCallRequested] = useState(false);
  const [identity, setIdentity] = useState<NordiIdentity | null>(null);
  const [isReturning, setIsReturning] = useState(false);
  const [showConsentCard, setShowConsentCard] = useState(false);
  const [conversationLearningConsent, setConversationLearningConsent] =
    useState<ConversationLearningConsent | null>(null);
  const [learningEligible, setLearningEligible] = useState(false);
  const [founderSession, setFounderSession] = useState(false);
  const [founderLearningSettings, setFounderLearningSettings] =
    useState<FounderLearningSettings | null>(null);
  const [consentAuditLog, setConsentAuditLog] = useState<ConsentAuditEntry[]>([]);
  const [learningSubmitted, setLearningSubmitted] = useState(false);

  const sessionIdRef = useRef<string>(createId("home"));
  const messageIndexRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const analysisInFlightRef = useRef<string | null>(null);
  const welcomeBackShownRef = useRef(false);
  const consentPromptShownRef = useRef(false);
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

  const maybeSubmitForLearning = useCallback(
    (memory: ReturnType<typeof touchMemory>) => {
      if (learningSubmitted) return;
      const result = submitConversationForLearning(memory);
      if (result.submitted) {
        setLearningSubmitted(true);
      }
    },
    [learningSubmitted],
  );

  const applyConsentUpdate = useCallback(
    (
      nextConsent: ConversationLearningConsent,
      audit: ConsentAuditEntry | null,
      nextFounderSettings?: FounderLearningSettings | null,
    ) => {
      setConversationLearningConsent(nextConsent);
      const settings = nextFounderSettings ?? founderLearningSettings;
      setLearningEligible(resolveLearningEligible(nextConsent, settings));
      if (audit) {
        setConsentAuditLog((prev) => appendConsentAudit(prev, audit));
      }
      setShowConsentCard(false);
    },
    [founderLearningSettings],
  );

  const handleAllowLearning = useCallback(() => {
    const { consent, audit } = acceptLearningConsent(
      conversationLearningConsent,
      "conversation_prompt",
    );
    const nextFounderSettings = founderSession
      ? founderLearningSettings ?? createDefaultFounderLearningSettings()
      : founderLearningSettings;
    applyConsentUpdate(consent, audit, nextFounderSettings);
  }, [applyConsentUpdate, conversationLearningConsent, founderLearningSettings, founderSession]);

  const handleDeclineLearning = useCallback(() => {
    const { consent, audit } = declineLearningConsent(
      conversationLearningConsent,
      "conversation_prompt",
    );
    applyConsentUpdate(consent, audit);
  }, [applyConsentUpdate, conversationLearningConsent]);

  const showLearningConsentIfNeeded = useCallback(() => {
    if (consentPromptShownRef.current) return;
    if (!shouldAskForConsent(conversationLearningConsent)) return;

    consentPromptShownRef.current = true;
    const { consent } = markConsentPromptShown(conversationLearningConsent);
    setConversationLearningConsent(consent);
    setShowConsentCard(true);
    window.setTimeout(scrollToBottom, 60);
  }, [conversationLearningConsent, scrollToBottom]);

  const maybeOfferSavePrompt = useCallback(
    async (profile: DiscoveryProfile) => {
      if (savePromptShown || saved || !shouldOfferSavePrompt(profile)) return;

      setSavePromptShown(true);
      setShowSaveButton(true);
      await deliverSequence(buildSimpleSequence(SAVE_PROMPT_MESSAGE, { animate: true }));
    },
    [deliverSequence, savePromptShown, saved],
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
      setConversationLearningConsent(stored.conversationLearningConsent ?? null);
      setLearningEligible(
        resolveLearningEligible(
          stored.conversationLearningConsent,
          stored.founderLearningSettings,
        ),
      );
      setFounderSession(Boolean(stored.founderSession));
      setFounderLearningSettings(stored.founderLearningSettings ?? null);
      setConsentAuditLog(stored.consentAuditLog ?? []);
      setLearningSubmitted(Boolean(stored.learningSubmitted));
      consentPromptShownRef.current = Boolean(stored.conversationLearningConsent?.askedAt);
      setIsReturning(true);
      setShowExploreButton(true);
      setShowInput(true);
      setIntroReady(true);
      setSavePromptShown(shouldShowSaveButton(stored.profile, Boolean(stored.saved)));
      setShowSaveButton(shouldShowSaveButton(stored.profile, Boolean(stored.saved)));
      setShowCallButton(Boolean(stored.callRequested));

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
      conversationLearningConsent,
      learningEligible,
      consentAuditLog,
      founderSession,
      founderLearningSettings,
      learningSubmitted,
    });

    storage.save(memory);
    setLastUpdated(memory.lastUpdated);
    maybeSubmitForLearning(memory);
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
    conversationLearningConsent,
    learningEligible,
    consentAuditLog,
    founderSession,
    founderLearningSettings,
    learningSubmitted,
    maybeSubmitForLearning,
  ]);

  useEffect(() => {
    scrollToBottom();
  }, [
    messages,
    thinkingLabel,
    showInput,
    saveActive,
    callActive,
    showConsentCard,
    isDelivering,
    scrollToBottom,
  ]);

  const handleCatMessageDone = useCallback((id: string) => {
    const resolve = pendingDoneRef.current.get(id);
    if (resolve) {
      pendingDoneRef.current.delete(id);
      resolve();
    }

    if (id === "intro") {
      window.setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: "browse-intro",
            role: "cat",
            content: BROWSE_MESSAGE,
            animate: true,
            timestamp: new Date().toISOString(),
          },
        ]);
      }, 400);
    }

    if (id === "browse-intro") {
      window.setTimeout(() => {
        setShowExploreButton(true);
        setShowInput(true);
        setIntroReady(true);
        showLearningConsentIfNeeded();
        inputRef.current?.focus();
      }, 500);
    }
  }, [showLearningConsentIfNeeded]);

  const sendMessage = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || isDelivering || thinkingLabel) return;

      const wantsHuman = detectHumanAssistanceRequest(text);

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
        const nextProfile = mergeDiscoveryProfile(businessProfile, {
          ...updates,
          isReturningVisitor: isReturning,
        });
        setBusinessProfile(nextProfile);

        if (wantsHuman) {
          await deliverSequence(
            buildSimpleSequence(HUMAN_CONNECT_MESSAGE, {
              thinkingContext: "general",
              sessionId: sessionIdRef.current,
              messageIndex,
            }),
          );
          setShowCallButton(true);
        } else {
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
        }

        await maybeOfferSavePrompt(nextProfile);

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
      maybeOfferSavePrompt,
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

    const founder = isFounderIdentity(savedIdentity);
    if (founder) {
      setFounderSession(true);
      setFounderLearningSettings((prev) => prev ?? createDefaultFounderLearningSettings());
      setLearningEligible((current) =>
        current || resolveLearningEligible(conversationLearningConsent, createDefaultFounderLearningSettings()),
      );
    }

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

  useEffect(() => {
    setIsActive(busy);
    return () => setIsActive(false);
  }, [busy, setIsActive]);

  return (
    <section className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-black">
      <div className="relative mx-auto flex w-full max-w-3xl min-h-0 flex-1 flex-col px-4 pb-4 pt-20 sm:px-6 sm:pt-[5.25rem]">
        <BusinessSummaryCard
          profile={businessProfile}
          knownSince={knownSince}
          lastUpdated={lastUpdated}
        />

        <div className="relative mt-3 flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-black/20">
          <div className="nordi-chat-grid hidden md:block" aria-hidden />
          <div
            ref={scrollRef}
            className={[
              "relative min-h-0 flex-1 overflow-y-auto pr-1 scroll-smooth",
              busy ? "nordi-chat-scan" : "",
            ].join(" ")}
          >
            <div className="relative z-[1] space-y-6 px-1 py-3">
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

              {showConsentCard ? (
                <ConversationLearningConsentCard
                  onAllow={handleAllowLearning}
                  onDecline={handleDeclineLearning}
                />
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
        </div>

        {showInput ? (
          <div className="sticky bottom-0 z-10 mt-3 shrink-0 bg-black pb-[max(0.25rem,env(safe-area-inset-bottom))]">
            <NordiActionBar
              showExploreButton={showExploreButton}
              showSaveButton={showSaveButton}
              showCallButton={showCallButton}
              saved={saved}
              callRequested={callRequested}
              onExplore={() => setWebsiteMenuOpen(true)}
              onSave={handleSaveClick}
              onCall={handleCallClick}
            />
            <form onSubmit={handleSubmit} className="animate-fade-slide-up">
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
          </div>
        ) : null}
      </div>

      <PublicWebsiteMenu open={websiteMenuOpen} onClose={() => setWebsiteMenuOpen(false)} />
    </section>
  );
}
