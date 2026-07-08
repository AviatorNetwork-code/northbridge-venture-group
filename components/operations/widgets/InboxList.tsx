import type { InboxMessage } from "@/lib/neo/types";

const channelLabels: Record<InboxMessage["channel"], string> = {
  email: "Email",
  sms: "SMS",
  whatsapp: "WhatsApp",
  telegram: "Telegram",
  social: "Social",
};

export default function InboxList({ messages }: { messages: InboxMessage[] }) {
  return (
    <ul className="divide-y divide-white/5">
      {messages.map((msg) => (
        <li
          key={msg.id}
          className={`py-3 px-1 ${msg.unread ? "bg-white/[0.02]" : ""}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-red">
                  {channelLabels[msg.channel]}
                </span>
                {msg.unread && (
                  <span className="h-1.5 w-1.5 rounded-full bg-red" aria-label="Unread" />
                )}
              </div>
              <p className="text-sm font-medium text-white mt-1 truncate">
                {msg.subject}
              </p>
              <p className="text-xs text-silver truncate">{msg.from}</p>
              <p className="text-xs text-silver mt-1 line-clamp-2">{msg.preview}</p>
            </div>
            <time className="text-[10px] text-silver shrink-0">
              {new Date(msg.receivedAt).toLocaleTimeString()}
            </time>
          </div>
        </li>
      ))}
    </ul>
  );
}
