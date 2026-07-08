"use client";

import OpsTopBar from "@/components/operations/shell/OpsTopBar";
import LiveConnectorGrid from "@/components/operations/widgets/LiveConnectorGrid";
import Panel from "@/components/operations/ui/Panel";
import { useNeoSelector } from "@/lib/neo/hooks/useNeoState";

export default function ConnectorsView() {
  const connected = useNeoSelector((s) => s.connectedConnectors);
  const available = useNeoSelector((s) => s.availableConnectors);

  return (
    <>
      <OpsTopBar
        title="Connector Center"
        subtitle="Live connector health, OAuth status, and sync activity."
      />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        <section>
          <h2 className="text-sm font-semibold text-white mb-4">Connected</h2>
          <LiveConnectorGrid connected={connected} available={[]} />
        </section>
        <section>
          <h2 className="text-sm font-semibold text-white mb-4">Available</h2>
          <LiveConnectorGrid connected={[]} available={available} />
        </section>
        <Panel title="Integration note">
          <p className="text-sm text-silver">
            Connect and reconnect actions route through NEO Connector Platform.
            OAuth, permissions, and sync logic remain in NEO — not duplicated here.
          </p>
        </Panel>
      </div>
    </>
  );
}
