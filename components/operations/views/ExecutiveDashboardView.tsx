"use client";

import OpsTopBar from "@/components/operations/shell/OpsTopBar";
import LiveMetricCard from "@/components/operations/ui/LiveMetricCard";
import Panel from "@/components/operations/ui/Panel";
import StatusBadge from "@/components/operations/ui/StatusBadge";
import ActivityFeed from "@/components/operations/widgets/ActivityFeed";
import LiveConnectorGrid from "@/components/operations/widgets/LiveConnectorGrid";
import RecommendationsList from "@/components/operations/widgets/RecommendationsList";
import StatusPulse from "@/components/operations/ui/StatusPulse";
import { useNeoSelector } from "@/lib/neo/hooks/useNeoState";

export default function ExecutiveDashboardView() {
  const executive = useNeoSelector((s) => s.executive);
  const activity = useNeoSelector((s) => s.activity);
  const recommendations = useNeoSelector((s) => s.recommendations);
  const workforce = useNeoSelector((s) => s.workforce);
  const connectors = useNeoSelector((s) => s.connectedConnectors);
  const systemHealth = useNeoSelector((s) => s.systemHealth);

  const specialists = workforce.filter((m) => m.role === "specialist").slice(0, 4);

  return (
    <>
      <OpsTopBar
        title="Executive Dashboard"
        subtitle="Real-time business health — your AI company at work."
      />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <LiveMetricCard
            label="Business health"
            value={`${executive.businessHealthScore}%`}
            hint={executive.summary}
            pulse
          />
          <LiveMetricCard
            label="Active specialists"
            value={executive.activeSpecialists}
            hint={`${workforce.filter((m) => m.role === "specialist").length} total`}
          />
          <LiveMetricCard
            label="Running workflows"
            value={executive.runningWorkflows}
            hint={`${executive.waitingApprovals} awaiting approval`}
          />
          <LiveMetricCard
            label="Revenue MTD"
            value={`$${(executive.revenueMtdUsd / 1000).toFixed(0)}k`}
            trend={`+${executive.revenueTrendPercent}%`}
            hint="Mock revenue metric"
          />
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <LiveMetricCard
            label="Active managers"
            value={executive.activeManagers}
          />
          <LiveMetricCard
            label="Connected integrations"
            value={executive.connectedIntegrations}
          />
          <LiveMetricCard
            label="Customer conversations"
            value={executive.openConversations}
          />
          <LiveMetricCard
            label="System health"
            value={systemHealth.platform}
          />
        </section>

        <section className="flex flex-wrap items-center gap-3">
          <StatusBadge label={executive.level} level={executive.level} />
          <p className="text-sm text-silver">{executive.summary}</p>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <Panel title="Active specialists">
            <ul className="space-y-2">
              {specialists.map((m) => (
                <li
                  key={m.id}
                  className="flex items-center justify-between border border-white/10 px-3 py-2 transition-all duration-500"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{m.name}</p>
                    <p className="text-xs text-silver truncate max-w-xs">
                      {m.currentTask ?? "No active task"}
                    </p>
                  </div>
                  <StatusPulse status={m.liveStatus} />
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Connected integrations">
            <LiveConnectorGrid connected={connectors} available={[]} />
          </Panel>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Panel title="Live activity feed">
            <ActivityFeed items={activity} live />
          </Panel>
          <Panel title="AI recommendations">
            <RecommendationsList items={recommendations.slice(0, 4)} />
          </Panel>
        </div>
      </div>
    </>
  );
}
