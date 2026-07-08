"use client";

import type { OnboardingSnapshot } from "@/lib/neo/types";

export default function LiveOnboardingPanel({
  snapshot,
  specialistNames,
  connectorNames,
}: {
  snapshot: OnboardingSnapshot;
  specialistNames: Record<string, string>;
  connectorNames: Record<string, string>;
}) {
  const completed = snapshot.checklist.filter((c) => c.completed).length;
  const readinessLabel = {
    not_ready: "Not ready",
    almost_ready: "Almost ready",
    ready: "Ready to launch",
  }[snapshot.launchReadiness];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-end justify-between mb-2">
          <p className="text-sm text-silver">Readiness score</p>
          <p className="text-3xl font-semibold text-white tabular-nums transition-all duration-700">
            {snapshot.readinessScore}%
          </p>
        </div>
        <div className="h-3 bg-white/10 overflow-hidden">
          <div
            className="h-full bg-red transition-all duration-1000 ease-out"
            style={{ width: `${snapshot.readinessScore}%` }}
          />
        </div>
        <div className="mt-2 flex flex-wrap gap-3 text-xs text-silver">
          <span>Stage: {snapshot.stage}</span>
          <span>·</span>
          <span>{readinessLabel}</span>
          <span>·</span>
          <span>~{snapshot.estimatedSetupHours}h remaining</span>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="border border-white/10 p-4">
          <p className="text-xs uppercase tracking-wider text-red mb-2">
            Business discovery
          </p>
          <p className="text-sm text-white">
            {snapshot.businessDiscoveryComplete ? "Complete" : "In progress"}
          </p>
        </div>
        <div className="border border-white/10 p-4">
          <p className="text-xs uppercase tracking-wider text-red mb-2">
            Launch readiness
          </p>
          <p className="text-sm text-white">{readinessLabel}</p>
        </div>
      </div>

      {snapshot.missingRequirements.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-wider text-silver mb-2">
            Missing requirements
          </p>
          <ul className="space-y-1">
            {snapshot.missingRequirements.map((req) => (
              <li key={req} className="text-sm text-red flex gap-2">
                <span>—</span>
                {req}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <p className="text-xs uppercase tracking-wider text-silver mb-3">
          Launch checklist ({completed}/{snapshot.checklist.length})
        </p>
        <ul className="space-y-2">
          {snapshot.checklist.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 text-sm border border-white/5 px-3 py-2 transition-colors"
            >
              <span
                className={`h-4 w-4 border flex items-center justify-center text-[10px] transition-colors ${
                  item.completed
                    ? "bg-red border-red text-white"
                    : "border-white/20 text-transparent"
                }`}
              >
                ✓
              </span>
              <span
                className={
                  item.completed ? "text-silver line-through" : "text-white"
                }
              >
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-silver mb-2">
            Recommended connectors
          </p>
          <ul className="text-sm text-white space-y-1">
            {snapshot.recommendedConnectorIds.map((id) => (
              <li key={id}>— {connectorNames[id] ?? id}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-silver mb-2">
            Recommended specialists
          </p>
          <ul className="text-sm text-white space-y-1">
            {snapshot.recommendedSpecialistIds.map((id) => (
              <li key={id}>— {specialistNames[id] ?? id}</li>
            ))}
          </ul>
        </div>
      </div>

      <button
        type="button"
        className="w-full sm:w-auto px-6 py-3 text-sm font-medium bg-red text-white hover:bg-red-hover transition-colors"
      >
        Continue onboarding
      </button>
    </div>
  );
}
