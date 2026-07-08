"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useCat } from "@/components/cat/CatProvider";
import { useConnectorsOptional } from "@/components/connectors/ConnectorProvider";
import { SectionPanel, StatusPill } from "@/components/operations/ModuleUI";
import { buildLaunchAssessment, getDefaultWorkforceIfEmpty } from "@/lib/launch/launch-engine";
import { loadLaunchState } from "@/lib/launch/launch-storage";
import { statusColor } from "@/lib/launch/launch-score";
import { LAUNCH_STATUS_LABELS } from "@/lib/launch/launch-types";
import { loadHireSelection } from "@/lib/workforce/storage";

export default function LaunchStatusBanner() {
  const connectors = useConnectorsOptional();
  const { businessProfile } = useCat();
  const [launchState, setLaunchState] = useState(loadLaunchState);

  useEffect(() => {
    setLaunchState(loadLaunchState());
  }, []);

  const assessment = useMemo(() => {
    if (!connectors?.instances.length) return null;
    const hireSelection = getDefaultWorkforceIfEmpty(loadHireSelection(), businessProfile);
    return buildLaunchAssessment({
      profile: businessProfile,
      hireSelection,
      connectorInstances: connectors.instances,
    });
  }, [connectors?.instances, businessProfile]);

  if (!assessment) return null;

  const variant =
    assessment.status === "ready"
      ? "success"
      : assessment.status === "blocked"
        ? "danger"
        : "warning";

  return (
    <SectionPanel title="Launch Readiness" subtitle="Business activation status">
      {launchState.launched ? (
        <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
          <p className="text-sm font-medium text-emerald-300">AI Workforce Active</p>
          <p className="text-xs text-silver">Launched and operational</p>
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Launch Score" value={`${assessment.scores.overall}%`} highlight />
        <Stat label="Status" value={LAUNCH_STATUS_LABELS[assessment.status]} />
        <Stat label="Workforce" value={String(assessment.workforce.specialists.length)} />
        <Stat label="Connected" value={String(assessment.connectors.connected.length)} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <StatusPill status={LAUNCH_STATUS_LABELS[assessment.status]} variant={variant} />
        <p className={`text-sm ${statusColor(assessment.status)}`}>{assessment.launchMessage}</p>
      </div>

      <Link
        href="/operations/launch"
        className="mt-4 inline-flex text-sm font-medium text-red hover:underline"
      >
        Open Launch Command Center →
      </Link>
    </SectionPanel>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/30 p-3">
      <p className="text-xs text-stone">{label}</p>
      <p className={`mt-1 text-lg font-semibold ${highlight ? "text-red" : "text-white"}`}>
        {value}
      </p>
    </div>
  );
}
