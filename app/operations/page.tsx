import OpsTopBar from "@/components/operations/shell/OpsTopBar";
import Panel from "@/components/operations/ui/Panel";
import MetricCard from "@/components/operations/ui/MetricCard";
import SectionHeader from "@/components/operations/ui/SectionHeader";
import ActivityFeed from "@/components/operations/widgets/ActivityFeed";
import ConnectorGrid from "@/components/operations/widgets/ConnectorGrid";
import RecommendationsList from "@/components/operations/widgets/RecommendationsList";
import StatusBadge from "@/components/operations/ui/StatusBadge";
import WorkforceTable from "@/components/operations/widgets/WorkforceTable";
import { getNeoPlatform } from "@/lib/neo/platform";

export default async function ExecutiveDashboardPage() {
  const neo = getNeoPlatform();
  const [health, activity, recommendations, workforce, connectors, workItems] =
    await Promise.all([
      neo.executive.getBusinessHealth(),
      neo.executive.getTodayActivity(),
      neo.executive.getRecommendations(),
      neo.workforce.listMembers(),
      neo.connectors.listConnected(),
      neo.workItems.listActive(),
    ]);

  return (
    <>
      <OpsTopBar
        title="Executive Dashboard"
        subtitle="Business health, workforce status, and today's operational picture."
      />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Business health"
            value={`${health.score}%`}
            hint={health.summary}
          />
          <MetricCard
            label="Workforce online"
            value={workforce.filter((m) => m.status !== "offline").length}
            hint={`${workforce.length} total specialists`}
          />
          <MetricCard
            label="Connected systems"
            value={health.connectedSystems}
            hint="Active integrations"
          />
          <MetricCard
            label="Active workflows"
            value={health.activeWorkflows}
            hint={`${workItems.length} in progress`}
          />
        </section>

        <section>
          <SectionHeader
            title="Business health"
            description="Platform-level health from NEO executive services."
          />
          <div className="flex items-center gap-3">
            <StatusBadge label={health.level} level={health.level} />
            <p className="text-sm text-silver">{health.summary}</p>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <Panel title="Workforce status">
            <WorkforceTable members={workforce.slice(0, 4)} />
          </Panel>
          <Panel title="Connected systems">
            <ConnectorGrid apps={connectors} />
          </Panel>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Panel title="Today's activity">
            <ActivityFeed items={activity} />
          </Panel>
          <Panel title="AI recommendations">
            <RecommendationsList items={recommendations.slice(0, 3)} />
          </Panel>
        </div>
      </div>
    </>
  );
}
