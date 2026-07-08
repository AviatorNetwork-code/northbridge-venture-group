import type { OnboardingSnapshot } from "@/lib/neo/types";

export default function OnboardingPanel({
  snapshot,
  specialistNames,
  connectorNames,
}: {
  snapshot: OnboardingSnapshot;
  specialistNames: Record<string, string>;
  connectorNames: Record<string, string>;
}) {
  const completed = snapshot.checklist.filter((c) => c.completed).length;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-end justify-between mb-2">
          <p className="text-sm text-silver">Readiness score</p>
          <p className="text-2xl font-semibold text-white tabular-nums">
            {snapshot.readinessScore}%
          </p>
        </div>
        <div className="h-2 bg-white/10">
          <div
            className="h-full bg-red transition-all"
            style={{ width: `${snapshot.readinessScore}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-silver">Stage: {snapshot.stage}</p>
      </div>

      <div>
        <p className="text-xs uppercase tracking-wider text-silver mb-3">
          Launch checklist ({completed}/{snapshot.checklist.length})
        </p>
        <ul className="space-y-2">
          {snapshot.checklist.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 text-sm border border-white/5 px-3 py-2"
            >
              <span
                className={`h-4 w-4 border flex items-center justify-center text-[10px] ${
                  item.completed
                    ? "bg-red border-red text-white"
                    : "border-white/20 text-transparent"
                }`}
                aria-hidden
              >
                ✓
              </span>
              <span className={item.completed ? "text-silver line-through" : "text-white"}>
                {item.label}
              </span>
              {item.required && !item.completed && (
                <span className="ml-auto text-[10px] uppercase text-red">Required</span>
              )}
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
