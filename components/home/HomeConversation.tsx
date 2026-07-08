"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useNeo } from "@/components/neo/NeoProvider";
import { IconCat } from "@/components/operations/icons";
import CatTypewriter from "@/components/home/CatTypewriter";
import AboutPanel from "@/components/home/AboutPanel";
import SaveConversationCard, { type SavedIdentity } from "@/components/home/SaveConversationCard";
import type { BusinessProfile } from "@/lib/cat/types";

const INTRO_MESSAGE = [
  "Hi, I'm CAT.",
  "I'm your personal business advisor at Northbridge Digital.",
  "My role is to understand your business, recommend only the AI workforce you actually need, and stay with you as your business grows.",
  "I'll always recommend the smallest solution that makes sense, and if I don't think we're the right fit, I'll tell you honestly.",
].join("\n");

const INVITE_MESSAGE = ["Now I'd love to learn a little about you.", "Tell me about your business."].join(
  "\n",
);

const STORAGE_KEY = "northbridge-home-cat";

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
  businessProfile: BusinessProfile;
  identity: SavedIdentity | null;
  saved: boolean;
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
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>({});
  const [isThinking, setIsThinking] = useState(false);
  const [input, setInput] = useState("");
  const [showButtons, setShowButtons] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [introReady, setIntroReady] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [saveActive, setSaveActive] = useState(false);
  const [saved, setSaved] = useState(false);
  const [identity, setIdentity] = useState<SavedIdentity | null>(null);

  const sessionIdRef = useRef<string>(createId("home"));
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, []);

  useEffect(() => {
    const stored = loadStoredState();

    if (stored) {
      sessionIdRef.current = stored.sessionId;
      setMessages(stored.messages.map((message) => ({ ...message, animate: false })));
      setBusinessProfile(stored.businessProfile ?? {});
      setIdentity(stored.identity ?? null);
      setSaved(Boolean(stored.saved));
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
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Ignore storage write failures (private mode, quota, etc.).
    }
  }, [introReady, messages, businessProfile, identity, saved]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking, showButtons, showInput, saveActive, scrollToBottom]);

  const handleCatMessageDone = useCallback((id: string) => {
    if (id === "intro") {
      window.setTimeout(() => setShowButtons(true), 700);
      window.setTimeout(() => {
        setMessages((prev) =>
          prev.some((message) => message.id === "invite")
            ? prev
            : [...prev, { id: "invite", role: "cat", content: INVITE_MESSAGE, animate: true }],
        );
      }, 1500);
      return;
    }

    if (id === "invite") {
      window.setTimeout(() => {
        setShowInput(true);
        setIntroReady(true);
        inputRef.current?.focus();
      }, 400);
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

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsThinking(true);

      try {
        const operationsSnapshot = await client.getOperationsSnapshot("dashboard");
        const response = await client.cat.send(
          {
            sessionId: sessionIdRef.current,
            message: text,
            context: {
              currentModule: "dashboard",
              businessProfile,
              operationsSnapshot,
            },
          },
          {
            session: {
              id: sessionIdRef.current,
              messages: [...messages, userMessage],
              businessProfile,
            },
            currentModule: "dashboard",
          },
        );

        setBusinessProfile((prev) => ({
          ...prev,
          ...((response.profileUpdates as BusinessProfile | undefined) ?? {}),
        }));

        setMessages((prev) => [
          ...prev,
          { id: createId("cat"), role: "cat", content: response.reply, animate: true },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: createId("cat"),
            role: "cat",
            content:
              "I'm having trouble reaching my systems right now. Give me a moment and try that again.",
            animate: true,
          },
        ]);
      } finally {
        setIsThinking(false);
      }
    },
    [businessProfile, client, isThinking, messages],
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

    setMessages((prev) => [
      ...prev,
      {
        id: createId("cat"),
        role: "cat",
        content: `You're all set — I'll recognize you as **${contact}** next time.${protectedNote}\nWe can pick up right where we left off whenever you come back.`,
        animate: true,
      },
    ]);
  };

  return (
    <section className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-black">
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern bg-grid opacity-[0.5]" aria-hidden />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-red/10 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 pb-4 pt-20 sm:px-6 sm:pt-28">
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
              {saved ? "Conversation saved" : "Save This Conversation"}
            </button>
          </div>
        ) : null}

        <div ref={scrollRef} className="flex-1 overflow-y-auto pr-1">
          <div className="space-y-5 py-2">
            {messages.map((message) =>
              message.role === "cat" ? (
                <div key={message.id} className="flex items-start gap-3 animate-fade-in">
                  <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red text-white">
                    <IconCat className="h-5 w-5" />
                  </span>
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
                <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red text-white">
                  <IconCat className="h-5 w-5" />
                </span>
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

            <div ref={bottomRef} />
          </div>
        </div>

        {showInput ? (
          <form onSubmit={handleSubmit} className="mt-3 animate-fade-slide-up">
            <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-black/50 p-2 backdrop-blur focus-within:border-red/40">
              <label className="flex-1">
                <span className="sr-only">Tell CAT about your business</span>
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
                  placeholder="Tell me about your business…"
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
