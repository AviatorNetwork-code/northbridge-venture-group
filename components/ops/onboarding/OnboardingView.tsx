"use client";

import { useNeo } from "@/lib/neo/context/NeoProvider";

export default function OnboardingView() {
  const { onboarding } = useNeo();

  if (!onboarding) return <div className="p-8 text-silver">Loading onboarding…</div>;

  const completed = onboarding.requirements.filter((r) => r.completed).length;

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Customer Onboarding</h1>
        <p className="text-sm text-silver mt-1">Launch readiness and setup progress</p>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 border border-white/10 bg-slate/60 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-silver">Readiness Progress</h2>
            <span className="text-2xl font-bold text-emerald-400">{onboarding.readinessPercent}%</span>
          </div>
          <div className="h-3 bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red to-emerald-500 animate-progress"
              style={{ width: `${onboarding.readinessPercent}%` }}
            />
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mt-6">
            <div className="border border-white/10 p-4 text-center">
              <p className="text-xs text-silver">Business Discovery</p>
              <p className="text-xl font-semibold mt-1">{onboarding.discoveryProgress}%</p>
              {onboarding.discoveryComplete && <p className="text-xs text-emerald-400 mt-1">Complete</p>}
            </div>
            <div className="border border-white/10 p-4 text-center">
              <p className="text-xs text-silver">Launch Readiness</p>
              <p className="text-xl font-semibold mt-1">{onboarding.launchReadiness}%</p>
            </div>
            <div className="border border-white/10 p-4 text-center">
              <p className="text-xs text-silver">Est. Setup Time</p>
              <p className="text-xl font-semibold mt-1">{onboarding.estimatedSetupMinutes}m</p>
            </div>
          </div>
        </div>

        <div className="border border-white/10 bg-slate/60 p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-silver mb-3">Requirements</h2>
          <p className="text-xs text-silver mb-3">{completed}/{onboarding.requirements.length} complete</p>
          <ul className="space-y-2">
            {onboarding.requirements.map((req) => (
              <li key={req.id} className="flex items-center gap-2 text-sm">
                <span className={req.completed ? "text-emerald-400" : "text-silver"}>
                  {req.completed ? "✓" : "○"}
                </span>
                <span className={req.completed ? "text-white/70 line-through" : ""}>{req.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="border border-white/10 bg-slate/40 p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-silver mb-4">Connector Recommendations</h2>
          <ul className="space-y-3">
            {onboarding.connectorRecommendations.map((rec) => (
              <li key={rec.id} className="border border-white/10 p-3 animate-slide-in">
                <div className="flex justify-between">
                  <p className="font-medium">{rec.title}</p>
                  <span className={`text-xs uppercase ${rec.impact === "high" ? "text-red" : "text-amber-400"}`}>{rec.impact}</span>
                </div>
                <p className="text-sm text-silver mt-1">{rec.description}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="border border-white/10 bg-slate/40 p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-silver mb-4">Workforce Recommendations</h2>
          <ul className="space-y-3">
            {onboarding.workforceRecommendations.map((rec) => (
              <li key={rec.id} className="border border-white/10 p-3 animate-slide-in">
                <div className="flex justify-between">
                  <p className="font-medium">{rec.title}</p>
                  <span className={`text-xs uppercase ${rec.impact === "high" ? "text-red" : "text-amber-400"}`}>{rec.impact}</span>
                </div>
                <p className="text-sm text-silver mt-1">{rec.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
