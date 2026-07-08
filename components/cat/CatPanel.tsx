"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { IconCat, IconClose } from "@/components/operations/icons";
import CatMessageContent from "@/components/cat/CatMessageContent";
import CatRecommendations from "@/components/cat/CatRecommendations";
import { useCat } from "@/components/cat/CatProvider";

export default function CatPanel() {
  const router = useRouter();
  const {
    isOpen,
    isThinking,
    messages,
    quickReplies,
    suggestedActions,
    closeCat,
    sendMessage,
    clearConversation,
  } = useCat();

  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [isOpen, messages, isThinking]);

  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const value = input.trim();
    if (!value || isThinking) return;

    setInput("");
    await sendMessage(value);
  };

  const handleQuickReply = async (reply: string) => {
    if (isThinking) return;
    await sendMessage(reply);
  };

  const handleAction = (href?: string) => {
    if (!href) return;
    router.push(href);
    closeCat();
  };

  return (
    <>
      <button
        type="button"
        aria-label="Close CAT"
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={closeCat}
      />

      <section
        role="dialog"
        aria-label="CAT Workforce Advisor"
        aria-modal="true"
        className="fixed inset-x-0 bottom-0 z-50 flex max-h-[92vh] flex-col rounded-t-2xl border border-white/10 bg-charcoal shadow-2xl sm:inset-x-auto sm:bottom-4 sm:right-4 sm:left-auto sm:w-full sm:max-w-md sm:rounded-2xl lg:max-w-lg"
      >
        <header className="flex items-start justify-between gap-3 border-b border-white/10 px-4 py-4 sm:px-5">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red text-white">
              <IconCat className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-red">
                Northbridge Digital
              </p>
              <h2 className="text-base font-semibold text-white">CAT Workforce Advisor</h2>
              <p className="mt-0.5 text-xs text-silver">
                Trusted advisor — not a Specialist or Manager
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={clearConversation}
              className="rounded-md px-2 py-1 text-[11px] text-stone hover:bg-white/5 hover:text-white"
            >
              Clear
            </button>
            <button
              type="button"
              aria-label="Close CAT panel"
              onClick={closeCat}
              className="rounded-md p-2 text-silver hover:bg-white/5 hover:text-white"
            >
              <IconClose className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={[
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start",
                ].join(" ")}
              >
                <div
                  className={[
                    "max-w-[92%] rounded-2xl px-4 py-3",
                    message.role === "user"
                      ? "bg-red/20 text-white"
                      : "border border-white/10 bg-slate/50",
                  ].join(" ")}
                >
                  {message.role === "cat" ? (
                    <>
                      <CatMessageContent content={message.content} />
                      {message.recommendations ? (
                        <CatRecommendations recommendations={message.recommendations} />
                      ) : null}
                    </>
                  ) : (
                    <p className="text-sm text-white">{message.content}</p>
                  )}
                </div>
              </div>
            ))}

            {isThinking ? (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-white/10 bg-slate/50 px-4 py-3">
                  <p className="text-sm text-silver">CAT is thinking...</p>
                </div>
              </div>
            ) : null}

            <div ref={bottomRef} />
          </div>
        </div>

        {suggestedActions.length > 0 ? (
          <div className="border-t border-white/10 px-4 py-3 sm:px-5">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-stone">
              Suggested Actions
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedActions.map((action) => (
                <button
                  key={`${action.type}-${action.label}`}
                  type="button"
                  onClick={() => handleAction(action.href)}
                  className="rounded-full border border-red/30 bg-red/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-red/20"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {quickReplies.length > 0 ? (
          <div className="border-t border-white/10 px-4 py-3 sm:px-5">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-stone">
              Quick Replies
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  type="button"
                  onClick={() => handleQuickReply(reply)}
                  disabled={isThinking}
                  className="shrink-0 rounded-full border border-white/15 bg-black/30 px-3 py-1.5 text-xs text-silver transition-colors hover:border-white/30 hover:text-white disabled:opacity-50"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <form
          onSubmit={handleSubmit}
          className="border-t border-white/10 p-4 sm:p-5"
        >
          <div className="flex items-end gap-2">
            <label className="flex-1">
              <span className="sr-only">Message CAT</span>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void handleSubmit(event);
                  }
                }}
                rows={2}
                placeholder="Ask CAT about your business, onboarding, or the Operations Center..."
                className="w-full resize-none rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white placeholder:text-stone focus:border-red/50 focus:outline-none focus:ring-1 focus:ring-red/30"
              />
            </label>
            <button
              type="submit"
              disabled={!input.trim() || isThinking}
              className="shrink-0 rounded-xl bg-red px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
