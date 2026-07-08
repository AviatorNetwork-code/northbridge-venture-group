"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useCat } from "@/components/cat/CatProvider";
import { useConnectors } from "@/components/connectors/ConnectorProvider";
import CatRecommendationPanel from "@/components/hire/CatRecommendationPanel";
import {
  ModuleContainer,
  ModuleHeader,
  ProgressBar,
  SectionPanel,
  StatusPill,
} from "@/components/operations/ModuleUI";
import {
  buildLaunchAssessment,
  getCoverageMap,
  getDefaultWorkforceIfEmpty,
} from "@/lib/launch/launch-engine";
import { loadLaunchState, saveLaunchProgress } from "@/lib/launch/launch-storage";
import { statusColor } from "@/lib/launch/launch-score";
import { LAUNCH_STATUS_LABELS } from "@/lib/launch/launch-types";
import type { LaunchStatus } from "@/lib/launch/launch-types";
import { useNeo } from "@/components/neo/NeoProvider";
import { loadHireSelection } from "@/lib/workforce/storage";

function statusVariant(status: LaunchStatus) {
  if (status === "ready") return "success" as const;
  if (status === "nearly-ready") return "info" as const;
  if (status === "needs-attention") return "warning" as const;
  return "danger" as const;
}

export default function LaunchExperience() {
  const { client: neoClient } = useNeo();
  const { businessProfile } = useCat();
  const { instances, refresh: refreshConnectors } = useConnectors();
  const [launchState, setLaunchState] = useState(loadLaunchState);
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchSuccess, setLaunchSuccess] = useState<string | null>(null);

  const hireSelection = useMemo(() => {
    const stored = loadHireSelection();
    return getDefaultWorkforceIfEmpty(stored, businessProfile);
  }, [businessProfile]);

  const assessment = useMemo(
    () =>
      buildLaunchAssessment({
        profile: businessProfile,
        hireSelection,
        connectorInstances: instances,
      }),
    [businessProfile, hireSelection, instances],
  );

  const coverageMap = useMemo(
    () => getCoverageMap(assessment.workforce.specialists.map((s) => s.name)),
    [assessment.workforce.specialists],
  );

  const handleLaunch = async () => {
    setIsLaunching(true);
    try {
      const result = await neoClient.launch.launchWorkforce({
        profile: businessProfile,
        hireSelection,
        connectorInstances: instances,
      });
      setLaunchState(result.state);
      setLaunchSuccess(result.message);
      refreshConnectors();
    } finally {
      setIsLaunching(false);
    }
  };

  const handleSave = () => {
    const state = saveLaunchProgress();
    setLaunchState(state);
  };

  return (
    <ModuleContainer>
      <ModuleHeader
        eyebrow="Launch Readiness"
        title="Can My AI Workforce Begin Working Today?"
        description="Your command center for business activation. Workforce, connectors, and business discovery merged into one launch decision."
      />

      {launchSuccess || launchState.launched ? (
        <div className="mb-8 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5">
          <p className="text-sm font-semibold text-emerald-300">
            {launchSuccess ?? "Your AI Workforce is now active."}
          </p>
          <p className="mt-1 text-xs text-silver">
            Operations Center status updated. Launched{" "}
            {launchState.launchedAt
              ? new Date(launchState.launchedAt).toLocaleString()
              : "just now"}
            .
          </p>
        </div>
      ) : null}

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="rounded-xl border border-white/10 bg-slate/60 p-6 lg:col-span-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-red">Launch Score</p>
          <p className={`mt-2 text-5xl font-semibold ${statusColor(assessment.status)}`}>
            {assessment.scores.overall}%
          </p>
          <StatusPill
            status={LAUNCH_STATUS_LABELS[assessment.status]}
            variant={statusVariant(assessment.status)}
          />
          <p className="mt-3 text-sm text-silver">{assessment.launchMessage}</p>
          <p className="mt-2 text-xs text-stone">Est. go-live: {assessment.estimatedGoLive}</p>

          <div className="mt-6 space-y-3">
            <ProgressBar value={assessment.scores.business} label="Business Readiness" />
            <ProgressBar value={assessment.scores.connectors} label="Connector Readiness" />
            <ProgressBar value={assessment.scores.workforce} label="Workforce Readiness" />
          </div>
        </section>

        <div className="lg:col-span-2">
          <CatRecommendationPanel summary={assessment.catSummary} />
        </div>
      </div>

      {(assessment.blockers.length > 0 || assessment.warnings.length > 0) && (
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {assessment.blockers.length > 0 ? (
            <SectionPanel title="Critical Blockers" subtitle="Must resolve before launch">
              <ul className="space-y-2">
                {assessment.blockers.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-lg border border-red/20 bg-red/5 px-3 py-2.5 text-sm text-silver"
                  >
                    <span className="font-medium text-white">{item.label}</span>
                    <p className="mt-0.5 text-xs">{item.reason}</p>
                  </li>
                ))}
              </ul>
            </SectionPanel>
          ) : null}

          {assessment.warnings.length > 0 ? (
            <SectionPanel title="Warnings" subtitle="Can wait — launch with limitations">
              <ul className="space-y-2">
                {assessment.warnings.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2.5 text-sm text-silver"
                  >
                    <span className="font-medium text-white">{item.label}</span>
                    <p className="mt-0.5 text-xs">{item.reason}</p>
                  </li>
                ))}
              </ul>
            </SectionPanel>
          ) : null}
        </div>
      )}

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <SectionPanel title="Business" subtitle="Discovery profile">
          <dl className="space-y-2 text-sm">
            <Row label="Industry" value={assessment.business.industry ?? "Not set"} />
            <Row label="Employees" value={assessment.business.employees?.toString() ?? "Not set"} />
            <Row label="Locations" value={String(assessment.business.locations ?? 1)} />
            <Row
              label="Channels"
              value={assessment.business.communicationChannels.join(", ") || "Not set"}
            />
            <Row
              label="Software"
              value={assessment.business.currentSoftware.join(", ") || "Not set"}
            />
          </dl>
          <Link href="/operations/hire" className="mt-3 inline-flex text-xs text-red hover:underline">
            Update via hiring flow →
          </Link>
        </SectionPanel>

        <SectionPanel title="Digital Workforce" subtitle="Selected hires">
          <p className="text-xs text-stone">Coverage: {assessment.workforce.coveragePercent}%</p>
          <ul className="mt-3 space-y-1 text-sm text-silver">
            {assessment.workforce.specialists.map((s) => (
              <li key={s.name}>✓ {s.name} ({s.tier})</li>
            ))}
            {assessment.workforce.teams.map((t) => (
              <li key={t}>✓ Team: {t}</li>
            ))}
            {assessment.workforce.managers.map((m) => (
              <li key={m}>✓ {m}</li>
            ))}
          </ul>
          {assessment.workforce.missingCapabilities.length > 0 ? (
            <p className="mt-3 text-xs text-amber-300">
              Missing: {assessment.workforce.missingCapabilities.join(", ")}
            </p>
          ) : null}
          <div className="mt-3 flex flex-wrap gap-1">
            {coverageMap.slice(0, 4).map((item) => (
              <span
                key={item.name}
                className={[
                  "rounded-full px-2 py-0.5 text-[10px]",
                  item.covered ? "bg-emerald-500/10 text-emerald-300" : "bg-white/5 text-stone",
                ].join(" ")}
              >
                {item.name.split(" ")[0]}
              </span>
            ))}
          </div>
        </SectionPanel>

        <SectionPanel title="Connectors" subtitle="Integration readiness">
          <p className="text-xs text-silver">{assessment.connectors.launchImpact}</p>
          <p className="mt-2 text-xs text-stone">
            Health {assessment.connectors.health}% · Last sync {assessment.connectors.lastSync}
          </p>
          <ul className="mt-3 space-y-1 text-sm">
            {assessment.connectors.connected.map((name) => (
              <li key={name} className="text-emerald-300">✓ {name}</li>
            ))}
            {assessment.connectors.missing.map((name) => (
              <li key={name} className="text-amber-300">✗ {name}</li>
            ))}
          </ul>
          <Link
            href="/operations/connectors"
            className="mt-3 inline-flex text-xs text-red hover:underline"
          >
            Open Connector Center →
          </Link>
        </SectionPanel>
      </div>

      <SectionPanel title="Launch Checklist" subtitle={assessment.launchMessage}>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {assessment.checklist.map((item) => (
            <li
              key={item.id}
              className={[
                "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm",
                item.complete
                  ? "border-emerald-500/20 bg-emerald-500/5 text-silver"
                  : "border-white/10 bg-black/30 text-stone",
              ].join(" ")}
            >
              <span className={item.complete ? "text-emerald-400" : "text-stone"}>
                {item.complete ? "✓" : "✗"}
              </span>
              {item.label}
            </li>
          ))}
        </ul>
      </SectionPanel>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleLaunch}
          disabled={isLaunching || assessment.status === "blocked"}
          className="rounded-xl bg-red px-6 py-3 text-sm font-semibold text-white hover:bg-red-hover disabled:opacity-50"
        >
          {isLaunching ? "Launching..." : "Launch Workforce"}
        </button>
        <Link
          href="/operations/connectors"
          className="rounded-xl border border-white/15 px-5 py-3 text-sm text-silver hover:text-white"
        >
          Continue Setup
        </Link>
        <button
          type="button"
          onClick={handleSave}
          className="rounded-xl border border-white/15 px-5 py-3 text-sm text-silver hover:text-white"
        >
          Save Progress
        </button>
        <Link
          href="/operations"
          className="rounded-xl border border-white/15 px-5 py-3 text-sm text-silver hover:text-white"
        >
          View Operations Center
        </Link>
      </div>
    </ModuleContainer>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 rounded-lg border border-white/10 bg-black/30 px-3 py-2">
      <dt className="text-stone">{label}</dt>
      <dd className="font-medium text-white">{value}</dd>
    </div>
  );
}
