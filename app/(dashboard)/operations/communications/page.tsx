import type { Metadata } from "next";
import {
  MetricCard,
  ModuleContainer,
  ModuleHeader,
  SectionPanel,
  StatusPill,
} from "@/components/operations/ModuleUI";
import { communicationsInbox } from "@/components/operations/module-mock-data";

export const metadata: Metadata = {
  title: "Communications | AI Operations Center",
  robots: { index: false, follow: false },
};

const channelStyles: Record<string, string> = {
  WhatsApp: "bg-emerald-500/10 text-emerald-300",
  Email: "bg-blue-500/10 text-blue-300",
  SMS: "bg-purple-500/10 text-purple-300",
  Instagram: "bg-pink-500/10 text-pink-300",
};

const channelCounts = communicationsInbox.reduce(
  (acc, msg) => {
    acc[msg.channel] = (acc[msg.channel] ?? 0) + 1;
    return acc;
  },
  {} as Record<string, number>,
);

export default function CommunicationsPage() {
  const unreadCount = communicationsInbox.filter((m) => m.unread).length;

  return (
    <ModuleContainer>
      <ModuleHeader
        eyebrow="Communications"
        title="Unified Inbox"
        description="A single view across WhatsApp, Email, SMS, and Instagram. Mock unified inbox — no live OAuth or channel wiring."
      />

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Unread" value={String(unreadCount)} detail="Across all channels" trend="neutral" />
        <MetricCard label="WhatsApp" value={String(channelCounts.WhatsApp ?? 0)} detail="Business messages" trend="up" />
        <MetricCard label="Email" value={String(channelCounts.Email ?? 0)} detail="Inbound threads" trend="neutral" />
        <MetricCard label="SMS + Instagram" value={String((channelCounts.SMS ?? 0) + (channelCounts.Instagram ?? 0))} detail="Combined volume" trend="up" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <SectionPanel title="Channels" subtitle="Connected sources" className="lg:col-span-1">
          <ul className="space-y-2">
            {["WhatsApp", "Email", "SMS", "Instagram"].map((channel) => (
              <li
                key={channel}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-black/30 px-3 py-2.5"
              >
                <span className="text-sm text-white">{channel}</span>
                <StatusPill status="Mock" variant="info" />
              </li>
            ))}
          </ul>
        </SectionPanel>

        <SectionPanel title="Inbox" subtitle="All conversations" className="lg:col-span-3">
          <div className="space-y-2">
            {communicationsInbox.map((message) => (
              <button
                key={message.id}
                type="button"
                className={[
                  "w-full rounded-lg border px-4 py-3 text-left transition-colors",
                  message.unread
                    ? "border-red/20 bg-red/5 hover:border-red/30"
                    : "border-white/10 bg-black/30 hover:border-white/20",
                ].join(" ")}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span
                    className={[
                      "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                      channelStyles[message.channel],
                    ].join(" ")}
                  >
                    {message.channel}
                  </span>
                  <span className="text-[11px] text-stone">{message.time}</span>
                </div>
                <p className="mt-2 text-sm font-medium text-white">{message.from}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-silver">{message.preview}</p>
              </button>
            ))}
          </div>
        </SectionPanel>
      </div>
    </ModuleContainer>
  );
}
