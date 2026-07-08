import OpsTopBar from "@/components/operations/shell/OpsTopBar";
import Panel from "@/components/operations/ui/Panel";
import SectionHeader from "@/components/operations/ui/SectionHeader";
import InboxList from "@/components/operations/widgets/InboxList";
import { getNeoPlatform } from "@/lib/neo/platform";

const futureChannels = ["Voice", "Live chat", "Custom API"];

export default async function CommunicationsPage() {
  const neo = getNeoPlatform();
  const [inbox, channels] = await Promise.all([
    neo.messaging.listInbox(),
    neo.messaging.listChannels(),
  ]);

  return (
    <>
      <OpsTopBar
        title="Communications"
        subtitle="Unified inbox across email, SMS, WhatsApp, Telegram, and social."
      />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        <section>
          <SectionHeader
            title="Active channels"
            description="Messaging channels from @neos/messaging."
          />
          <div className="flex flex-wrap gap-2">
            {channels.map((ch) => (
              <span
                key={ch}
                className="px-3 py-1 text-xs uppercase tracking-wider border border-white/10 bg-slate text-white"
              >
                {ch}
              </span>
            ))}
            {futureChannels.map((ch) => (
              <span
                key={ch}
                className="px-3 py-1 text-xs uppercase tracking-wider border border-dashed border-white/10 text-silver"
              >
                {ch} (future)
              </span>
            ))}
          </div>
        </section>

        <Panel title="Unified inbox">
          <InboxList messages={inbox} />
        </Panel>
      </div>
    </>
  );
}
