"use client";

import { useMemo, useState } from "react";
import { useNeo } from "@/lib/neo/context/NeoProvider";
import type { ConversationChannel } from "@/lib/neo/types";
import { StatusBadge } from "../shared/StatusBadge";

const CHANNEL_LABELS: Record<ConversationChannel, string> = {
  whatsapp: "WhatsApp",
  email: "Email",
  sms: "SMS",
  telegram: "Telegram",
  messenger: "Messenger",
  instagram: "Instagram",
  tiktok: "TikTok",
  web_chat: "Web Chat",
};

const CHANNEL_ICONS: Record<ConversationChannel, string> = {
  whatsapp: "WA",
  email: "✉",
  sms: "SMS",
  telegram: "TG",
  messenger: "MSG",
  instagram: "IG",
  tiktok: "TT",
  web_chat: "WEB",
};

export default function CommunicationsView() {
  const { communications } = useNeo();
  const [channel, setChannel] = useState<ConversationChannel | "all">("all");

  const filtered = useMemo(() => {
    if (!communications) return [];
    if (channel === "all") return communications.conversations;
    return communications.conversations.filter((c) => c.channel === channel);
  }, [communications, channel]);

  if (!communications) return <div className="p-8 text-silver">Loading inbox…</div>;

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Unified Inbox</h1>
        <p className="text-sm text-silver mt-1">All customer conversations across channels</p>
      </header>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setChannel("all")}
          className={`px-3 py-1.5 text-xs border ${channel === "all" ? "border-red bg-red/10 text-white" : "border-white/10 text-silver"}`}
        >
          All ({communications.conversations.length})
        </button>
        {(Object.keys(CHANNEL_LABELS) as ConversationChannel[]).map((ch) => (
          <button
            key={ch}
            type="button"
            onClick={() => setChannel(ch)}
            className={`px-3 py-1.5 text-xs border ${channel === ch ? "border-red bg-red/10 text-white" : "border-white/10 text-silver"}`}
          >
            {CHANNEL_LABELS[ch]} ({communications.channelCounts[ch]})
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((conv) => (
          <div key={conv.id} className="border border-white/10 bg-slate/60 p-4 hover:border-white/20 transition-colors animate-slide-in">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex gap-3 min-w-0">
                <span className="shrink-0 w-10 h-10 flex items-center justify-center border border-white/10 bg-black/40 text-xs font-bold">
                  {CHANNEL_ICONS[conv.channel]}
                </span>
                <div className="min-w-0">
                  <h3 className="font-medium truncate">{conv.subject}</h3>
                  <p className="text-sm text-silver truncate">{conv.preview}</p>
                  <p className="text-xs text-silver mt-1">
                    {conv.customer.name}
                    {conv.customer.company ? ` · ${conv.customer.company}` : ""}
                    {" · "}{conv.customer.tier}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                <StatusBadge status={conv.status === "open" ? "working" : conv.status === "escalated" ? "escalated" : conv.status === "waiting" ? "waiting" : "idle"} variant="workforce" />
                <StatusBadge status={conv.sentiment} variant="sentiment" />
                <StatusBadge status={conv.sla} variant="sla" />
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-silver">
              <span>Specialist: <strong className="text-white/80">{conv.assignedSpecialist}</strong></span>
              <span>SLA: {conv.slaMinutesRemaining > 0 ? `${conv.slaMinutesRemaining}m left` : "Breached"}</span>
              {conv.linkedWorkflowName && <span>Workflow: {conv.linkedWorkflowName}</span>}
              {conv.unreadCount > 0 && <span className="text-red">{conv.unreadCount} unread</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
