import OpsTopBar from "@/components/operations/shell/OpsTopBar";
import MetricCard from "@/components/operations/ui/MetricCard";
import Panel from "@/components/operations/ui/Panel";
import SectionHeader from "@/components/operations/ui/SectionHeader";
import { getNeoPlatform } from "@/lib/neo/platform";

export default async function AnalyticsPage() {
  const neo = getNeoPlatform();
  const metrics = await neo.analytics.getSnapshot();

  return (
    <>
      <OpsTopBar
        title="Analytics"
        subtitle="Workforce, connector, automation, and customer metrics."
      />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <MetricCard
            label="Workforce utilization"
            value={`${metrics.workforceUtilization}%`}
            hint="Active capacity across digital workforce"
          />
          <MetricCard
            label="Connector uptime"
            value={`${metrics.connectorUptime}%`}
            hint="Rolling 30-day availability"
          />
          <MetricCard
            label="Automations run"
            value={metrics.automationsRun}
            hint="This billing period"
          />
          <MetricCard
            label="Customer satisfaction"
            value={metrics.customerSatisfaction}
            hint="Weighted CSAT score"
          />
          <MetricCard
            label="Cost savings"
            value={`$${metrics.costSavingsUsd.toLocaleString()}`}
            hint="Estimated operational savings"
          />
          <MetricCard
            label="Time saved"
            value={`${metrics.hoursSaved}h`}
            hint="Automation + workforce efficiency"
          />
        </section>

        <section>
          <SectionHeader
            title="NEO analytics aggregation"
            description="All metrics are sourced from @neos/analytics and institutional learning packages. The website renders snapshots only."
          />
          <Panel>
            <p className="text-sm text-silver">
              Live connector and workforce metrics will stream from NEO when platform
              bindings replace mock providers via{" "}
              <code className="text-white/80">setNeoPlatform()</code>.
            </p>
          </Panel>
        </section>
      </div>
    </>
  );
}
