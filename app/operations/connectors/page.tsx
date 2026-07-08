import OpsTopBar from "@/components/operations/shell/OpsTopBar";
import Panel from "@/components/operations/ui/Panel";
import SectionHeader from "@/components/operations/ui/SectionHeader";
import ConnectorGrid from "@/components/operations/widgets/ConnectorGrid";
import { getNeoPlatform } from "@/lib/neo/platform";

export default async function ConnectorsPage() {
  const neo = getNeoPlatform();
  const [connected, available] = await Promise.all([
    neo.connectors.listConnected(),
    neo.connectors.listAvailable(),
  ]);

  return (
    <>
      <OpsTopBar
        title="Connector Center"
        subtitle="Connected apps, available integrations, health, and permissions."
      />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        <section>
          <SectionHeader
            title="Connected apps"
            description="Live connector status from @neos/connector-platform."
          />
          <ConnectorGrid apps={connected} />
        </section>

        <section>
          <SectionHeader
            title="Available apps"
            description="Integrations ready to connect."
          />
          <ConnectorGrid apps={available} showConnect />
        </section>

        <Panel title="Integration note">
          <p className="text-sm text-silver">
            Connect actions invoke NEO Connector Platform OAuth flows when live
            bindings are enabled. This shell displays platform state only — no
            connector logic is duplicated in the website.
          </p>
        </Panel>
      </div>
    </>
  );
}
