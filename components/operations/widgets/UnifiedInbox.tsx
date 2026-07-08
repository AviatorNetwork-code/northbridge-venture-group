"use client";

import { useState } from "react";
import type { Conversation, ConversationChannel } from "@/lib/neo/types";
import StatusBadge from "@/components/operations/ui/StatusBadge";
import { useNeoSelector } from "@/lib/neo/hooks/useNeoState";

const channelOrder: ConversationChannel[] = [
  "whatsapp",
  "email",
  "sms",
  "telegram",
  "messenger",
  "instagram",
  "tiktok",
  "webchat",
];

const channelLabels: Record<ConversationChannel, string> = {
  whatsapp: "WhatsApp",
  email: "Email",
  sms: "SMS",
  telegram: "Telegram",
  messenger: "Messenger",
  instagram: "Instagram",
  tiktok: "TikTok",
  webchat: "Web Chat",
};

function sentimentLevel(s: Conversation["sentiment"]) {
  if (s === "positive") return "healthy" as const;
  if (s === "negative") return "critical" as const;
  return "degraded" as const;
}

export default function UnifiedInbox({
  conversations,
}: {
  conversations: Conversation[];
}) {
  const workforce = useNeoSelector((s) => s.workforce);
  const [expanded, setExpanded] = useState<ConversationChannel | "all">("all");

  const grouped = channelOrder.map((ch) => ({
    channel: ch,
    items: conversations.filter((c) => c.channel === ch),
  })).filter((g) => g.items.length > 0);

  const visible =
    expanded === "all"
      ? grouped
      : grouped.filter((g) => g.channel === expanded);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setExpanded("all")}
          className={`px-3 py-1 text-xs uppercase tracking-wider border transition-colors ${
            expanded === "all"
              ? "border-red bg-red/10 text-white"
              : "border-white/10 text-silver hover:text-white"
          }`}
        >
          All
        </button>
        {grouped.map((g) => (
          <button
            key={g.channel}
            type="button"
            onClick={() => setExpanded(g.channel)}
            className={`px-3 py-1 text-xs uppercase tracking-wider border transition-colors ${
              expanded === g.channel
                ? "border-red bg-red/10 text-white"
                : "border-white/10 text-silver hover:text-white"
            }`}
          >
            {channelLabels[g.channel]} ({g.items.length})
          </button>
        ))}
      </div>

      {visible.map((group) => (
        <section key={group.channel}>
          <h3 className="text-xs uppercase tracking-widest text-red mb-3">
            {channelLabels[group.channel]}
          </h3>
          <ul className="space-y-2">
            {group.items.map((conv) => {
              const specialist = workforce.find(
                (m) => m.id === conv.assignedSpecialistId
              );
              return (
                <li
                  key={conv.id}
                  className={`border border-white/10 p-4 transition-all duration-500 ${
                    conv.unread ? "bg-white/[0.03] animate-timeline-in" : "bg-slate/30"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-white">
                        {conv.subject}
                      </p>
                      <p className="text-xs text-silver mt-0.5">
                        {conv.customer.name} · {conv.customer.company} ·{" "}
                        {conv.customer.tier}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <StatusBadge
                        label={conv.status}
                        level={
                          conv.status === "escalated"
                            ? "critical"
                            : conv.status === "waiting"
                              ? "degraded"
                              : "healthy"
                        }
                      />
                      <StatusBadge
                        label={conv.sentiment}
                        level={sentimentLevel(conv.sentiment)}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-silver mt-2 line-clamp-2">
                    {conv.preview}
                  </p>
                  <dl className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div>
                      <dt className="text-silver">Specialist</dt>
                      <dd className="text-white">
                        {specialist?.name ?? "Unassigned"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-silver">SLA</dt>
                      <dd
                        className={
                          conv.slaBreached ? "text-red" : "text-white"
                        }
                      >
                        {conv.slaBreached
                          ? "Breached"
                          : `${conv.slaMinutesRemaining}m left`}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-silver">Workflow</dt>
                      <dd className="text-white truncate">
                        {conv.linkedWorkflowId ?? "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-silver">Received</dt>
                      <dd className="text-white">
                        {new Date(conv.receivedAt).toLocaleTimeString()}
                      </dd>
                    </div>
                  </dl>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
