"use client";

import OpsTopBar from "@/components/operations/shell/OpsTopBar";
import LiveMetricCard from "@/components/operations/ui/LiveMetricCard";
import BarChart from "@/components/operations/ui/BarChart";
import Panel from "@/components/operations/ui/Panel";
import { useNeoSelector } from "@/lib/neo/hooks/useNeoState";

export default function AnalyticsView() {
  const analytics = useNeoSelector((s) => s.analytics);
  const series = useNeoSelector((s) => s.analyticsSeries);

  return (
    <>
      <OpsTopBar
        title="Analytics"
        subtitle="Interactive operational metrics — updating live."
      />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <LiveMetricCard
            label="Workflows / day"
            value={analytics.workflowsPerDay}
            pulse
          />
          <LiveMetricCard
            label="Automation"
            value={`${analytics.automationPercent}%`}
          />
          <LiveMetricCard
            label="Avg response time"
            value={`${analytics.avgResponseMinutes}m`}
          />
          <LiveMetricCard
            label="Tasks completed"
            value={analytics.tasksCompleted}
          />
          <LiveMetricCard
            label="Specialist utilization"
            value={`${analytics.workforceUtilization}%`}
          />
          <LiveMetricCard
            label="Customer satisfaction"
            value={analytics.customerSatisfaction}
          />
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <Panel title="Workflows per day">
            <BarChart data={series.workflowsPerDay} />
          </Panel>
          <Panel title="Conversation volume">
            <BarChart data={series.conversationVolume} color="bg-white/40" />
          </Panel>
          <Panel title="Specialist utilization">
            <BarChart data={series.specialistUtilization} color="bg-emerald-600" />
          </Panel>
          <Panel title="Connector health">
            <BarChart data={series.connectorHealth} color="bg-amber-600" />
          </Panel>
        </div>

        <section className="grid gap-3 sm:grid-cols-2">
          <LiveMetricCard
            label="Connector uptime"
            value={`${analytics.connectorUptime}%`}
          />
          <LiveMetricCard
            label="Cost savings"
            value={`$${analytics.costSavingsUsd.toLocaleString()}`}
            hint={`${analytics.hoursSaved}h saved`}
          />
        </section>
      </div>
    </>
  );
}
