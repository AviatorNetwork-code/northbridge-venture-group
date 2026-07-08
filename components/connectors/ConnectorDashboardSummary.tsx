"use client";

import Link from "next/link";
import { useCat } from "@/components/cat/CatProvider";
import { useConnectorsOptional } from "@/components/connectors/ConnectorProvider";
import { SectionPanel } from "@/components/operations/ModuleUI";
import { buildOnboardingConnectorSummary } from "@/lib/connectors/connector-recommendations";

export default function ConnectorDashboardSummary() {
  const connectors = useConnectorsOptional();
  const { businessProfile } = useCat();

  if (!connectors || connectors.instances.length === 0) return null;

  const { health, instances } = connectors;
  const onboarding = buildOnboardingConnectorSummary(instances, businessProfile);

  return (
    <SectionPanel title="Connector Center" subtitle="Connected services & launch readiness">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Connected" value={String(health.connected)} />
        <Stat label="Health" value={`${health.avgHealth}%`} />
        <Stat label="Last Sync" value={health.lastSyncLabel} />
        <Stat label="Launch Ready" value={`${onboarding.launchReadinessPercent}%`} />
      </div>
      <Link
        href="/operations/connectors"
        className="mt-4 inline-flex text-sm font-medium text-red hover:underline"
      >
        Open Connector Center →
      </Link>
    </SectionPanel>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/30 p-3">
      <p className="text-xs text-stone">{label}</p>
      <p className="mt-1 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}
