"use client";

import Link from "next/link";
import { useCat } from "@/components/cat/CatProvider";
import { useConnectorsOptional } from "@/components/connectors/ConnectorProvider";
import { ProgressBar, SectionPanel, StatusPill } from "@/components/operations/ModuleUI";
import { buildOnboardingConnectorSummary } from "@/lib/connectors/connector-recommendations";

export default function OnboardingConnectorChecklist() {
  const connectors = useConnectorsOptional();
  const { businessProfile } = useCat();

  if (!connectors || connectors.instances.length === 0) return null;

  const summary = buildOnboardingConnectorSummary(connectors.instances, businessProfile);

  const levelVariant = (level: string) => {
    if (level === "connected") return "success" as const;
    if (level === "missing" || level === "recommended") return "warning" as const;
    return "neutral" as const;
  };

  return (
    <SectionPanel title="Connector Checklist" subtitle="Updates automatically from Connector Center">
      <div className="mb-5">
        <ProgressBar value={summary.launchReadinessPercent} label="Launch Readiness" />
      </div>

      <ul className="space-y-2">
        {summary.items.map((item) => (
          <li
            key={item.connectorId}
            className="flex items-start justify-between gap-3 rounded-lg border border-white/10 bg-black/30 px-3 py-2.5"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-white">{item.name}</p>
              <p className="mt-0.5 text-xs text-silver">{item.reason}</p>
            </div>
            <StatusPill
              status={item.level.charAt(0).toUpperCase() + item.level.slice(1)}
              variant={levelVariant(item.level)}
            />
          </li>
        ))}
      </ul>

      <Link
        href="/operations/connectors"
        className="mt-4 inline-flex text-sm font-medium text-red hover:underline"
      >
        Connect services →
      </Link>
    </SectionPanel>
  );
}
