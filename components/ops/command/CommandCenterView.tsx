"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { useNeo } from "@/lib/neo/context/NeoProvider";
import type { CatOpsResponse } from "@/lib/neo/contracts";

interface Message {
  id: string;
  role: "user" | "cat";
  text: string;
  response?: CatOpsResponse;
}

const SUGGESTIONS = [
  "Connect QuickBooks",
  "Hire Marketing Specialist",
  "Create onboarding workflow",
  "Show blocked tasks",
  "Explain why Finance is overloaded",
  "Why is Customer Service waiting?",
];

export default function CommandCenterView() {
  const { provider } = useNeo();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "cat",
      text: "CAT Operations online. I'm your AI operator — ask me to connect integrations, hire specialists, explain bottlenecks, or surface blocked work.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const sendCommand = useCallback(async (command: string) => {
    const trimmed = command.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      if (trimmed.startsWith("reconnect:")) {
        const connectorId = trimmed.replace("reconnect:", "");
        await provider.reconnectConnector(connectorId);
        const catMsg: Message = {
          id: `c-${Date.now()}`,
          role: "cat",
          text: "Initiating connector reconnect. You'll see status updates in the Connector Center.",
        };
        setMessages((prev) => [...prev, catMsg]);
      } else {
        const response = await provider.queryCat(trimmed);
        const catMsg: Message = {
          id: `c-${Date.now()}`,
          role: "cat",
          text: response.message,
          response,
        };
        setMessages((prev) => [...prev, catMsg]);
      }
    } finally {
      setLoading(false);
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [loading, provider]);

  return (
    <div className="p-6 lg:p-8 h-full flex flex-col">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">AI Command Center</h1>
        <p className="text-sm text-silver mt-1">CAT operates your AI company via NEO contracts</p>
      </header>

      <div className="flex flex-wrap gap-2 mb-4">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => void sendCommand(s)}
            className="px-3 py-1.5 text-xs border border-white/10 hover:border-red/40 hover:bg-red/5 transition-colors"
          >
            {s}
          </button>
        ))}
      </div>

      <div ref={listRef} className="flex-1 border border-white/10 bg-slate/40 overflow-y-auto p-4 space-y-4 min-h-[400px]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[85%] animate-slide-in ${msg.role === "user" ? "ml-auto text-right" : ""}`}
          >
            <div
              className={`inline-block px-4 py-3 text-sm ${
                msg.role === "user"
                  ? "bg-red/20 border border-red/30"
                  : "bg-black/40 border border-white/10"
              }`}
            >
              <p className="text-xs uppercase tracking-wider text-silver mb-1">{msg.role === "user" ? "You" : "CAT"}</p>
              <p>{msg.text}</p>
              {msg.response?.actions && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {msg.response.actions.map((action) =>
                    action.href ? (
                      <Link
                        key={action.label}
                        href={action.href}
                        className="text-xs px-2 py-1 border border-white/15 hover:border-white/30"
                      >
                        {action.label}
                      </Link>
                    ) : (
                      <button
                        key={action.label}
                        type="button"
                        onClick={() => void sendCommand(action.command ?? action.label)}
                        className="text-xs px-2 py-1 border border-white/15 hover:border-white/30"
                      >
                        {action.label}
                      </button>
                    ),
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && <p className="text-sm text-silver animate-pulse">CAT is analyzing operations…</p>}
      </div>

      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void sendCommand(input);
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Command CAT…"
          className="flex-1 bg-slate/80 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white/25"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-red hover:bg-red-hover font-medium text-sm disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
