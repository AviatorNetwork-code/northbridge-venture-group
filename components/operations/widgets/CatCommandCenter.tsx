"use client";

import { useCallback, useRef, useState } from "react";
import type { CatMessage } from "@/lib/neo/types";
import { getNeoPlatform } from "@/lib/neo/platform";
import SystemHealthPanel from "@/components/operations/widgets/SystemHealthPanel";
import Panel from "@/components/operations/ui/Panel";
import { useNeoSelector } from "@/lib/neo/hooks/useNeoState";

export default function CatCommandCenter() {
  const health = useNeoSelector((s) => s.systemHealth);
  const [messages, setMessages] = useState<CatMessage[]>([
    {
      id: "cat-0",
      role: "cat",
      content:
        "I'm CAT, your operations operator. Ask me to connect apps, hire specialists, explain bottlenecks, or create workflows.",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const commands = [
    "Connect QuickBooks",
    "Hire Marketing Specialist",
    "Create onboarding workflow",
    "Show blocked tasks",
    "Explain why Finance is overloaded",
    "Why is Customer Service waiting?",
  ];

  const send = useCallback(
    async (prompt: string) => {
      if (!prompt.trim() || loading) return;
      const userMsg: CatMessage = {
        id: `u-${Date.now()}`,
        role: "user",
        content: prompt.trim(),
        timestamp: new Date().toISOString(),
      };
      setMessages((m) => [...m, userMsg]);
      setInput("");
      setLoading(true);

      const neo = getNeoPlatform();
      const response = await neo.command.askCat?.(prompt, messages);

      const catMsg: CatMessage = {
        id: `c-${Date.now()}`,
        role: "cat",
        content: response?.message ?? "NEO command service unavailable.",
        timestamp: new Date().toISOString(),
      };
      setMessages((m) => [...m, catMsg]);
      setLoading(false);
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    },
    [loading, messages]
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {commands.map((cmd) => (
          <button
            key={cmd}
            type="button"
            onClick={() => send(cmd)}
            className="text-left border border-white/10 bg-slate/50 p-4 hover:border-red/40 transition-colors"
          >
            <p className="text-sm font-medium text-white">{cmd}</p>
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Panel title="CAT operator">
            <div
              ref={listRef}
              className="h-72 overflow-y-auto space-y-3 mb-4 pr-1"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`text-sm animate-timeline-in ${
                    msg.role === "user" ? "text-right" : ""
                  }`}
                >
                  <span
                    className={`inline-block max-w-[90%] px-3 py-2 ${
                      msg.role === "user"
                        ? "bg-red text-white"
                        : "bg-slate border border-white/10 text-silver"
                    }`}
                  >
                    {msg.content}
                  </span>
                </div>
              ))}
              {loading && (
                <p className="text-xs text-silver animate-pulse">
                  CAT is analyzing operations…
                </p>
              )}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask CAT anything about your operations…"
                className="flex-1 bg-black border border-white/10 px-3 py-2 text-sm text-white placeholder:text-stone focus:outline-none focus:border-red/50"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium bg-red text-white hover:bg-red-hover transition-colors disabled:opacity-50"
              >
                Ask
              </button>
            </form>
          </Panel>
        </div>
        <Panel title="System health">
          <SystemHealthPanel health={health} />
        </Panel>
      </div>
    </div>
  );
}
