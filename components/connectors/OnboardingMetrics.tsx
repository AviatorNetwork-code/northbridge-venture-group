"use client";

import { useCat } from "@/components/cat/CatProvider";
import { useConnectorsOptional } from "@/components/connectors/ConnectorProvider";
import { MetricCard } from "@/components/operations/ModuleUI";
import { buildOnboardingConnectorSummary } from "@/lib/connectors/connector-recommendations";
import { loadHireSelection } from "@/lib/workforce/storage";

export default function OnboardingMetrics() {
  const connectors = useConnectorsOptional();
  const { businessProfile } = useCat();

  if (!connectors) {
    return null;
  }

  const summary = buildOnboardingConnectorSummary(connectors.instances, businessProfile);
  const hireSelection = typeof window !== "undefined" ? loadHireSelection() : null;
  const workforceCount = hireSelection?.specialists.length ?? 0;

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        label="Readiness Score"
        value={`${summary.launchReadinessPercent}%`}
        detail={`${summary.connected} of ${summary.recommended} recommended`}
        trend="up"
      />
      <MetricCard
        label="Connectors"
        value={`${summary.connected}/${summary.recommended}`}
        detail={`${summary.missing} missing`}
        trend="neutral"
      />
      <MetricCard
        label="Workforce"
        value={workforceCount > 0 ? String(workforceCount) : "—"}
        detail={workforceCount > 0 ? "From hiring session" : "Hire workforce to begin"}
        trend="neutral"
      />
      <MetricCard
        label="Ready To Launch"
        value={connectors.health.readyToLaunch ? "Yes" : "Not yet"}
        detail={connectors.health.readyToLaunch ? "Core services connected" : "Connect core services"}
        trend={connectors.health.readyToLaunch ? "up" : "neutral"}
      />
    </div>
  );
}
