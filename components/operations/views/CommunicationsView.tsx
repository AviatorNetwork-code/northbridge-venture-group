"use client";

import OpsTopBar from "@/components/operations/shell/OpsTopBar";
import Panel from "@/components/operations/ui/Panel";
import UnifiedInbox from "@/components/operations/widgets/UnifiedInbox";
import { useNeoSelector } from "@/lib/neo/hooks/useNeoState";

export default function CommunicationsView() {
  const conversations = useNeoSelector((s) => s.conversations);

  return (
    <>
      <OpsTopBar
        title="Communications"
        subtitle="Unified inbox — all channels, live updates."
      />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <Panel title="Unified inbox">
          <UnifiedInbox conversations={conversations} />
        </Panel>
      </div>
    </>
  );
}
