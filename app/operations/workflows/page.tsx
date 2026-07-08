import OpsTopBar from "@/components/operations/shell/OpsTopBar";
import Panel from "@/components/operations/ui/Panel";
import SectionHeader from "@/components/operations/ui/SectionHeader";
import WorkItemsList from "@/components/operations/widgets/WorkItemsList";
import ActivityFeed from "@/components/operations/widgets/ActivityFeed";
import { getNeoPlatform } from "@/lib/neo/platform";

export default async function WorkflowsPage() {
  const neo = getNeoPlatform();
  const [active, approvals, escalations, timeline, audit] = await Promise.all([
    neo.workItems.listActive(),
    neo.workItems.listWaitingApprovals(),
    neo.workItems.listEscalations(),
    neo.workItems.getTimeline("wi-101"),
    neo.workItems.getAuditHistory(),
  ]);

  const timelineActivity = timeline.map((e) => ({
    id: e.id,
    label: e.label,
    timestamp: e.timestamp,
    type: "workflow",
  }));

  return (
    <>
      <OpsTopBar
        title="Workflow Center"
        subtitle="Active work items, approvals, escalations, and audit history."
      />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <Panel title="Active work items">
            <WorkItemsList items={active} />
          </Panel>
          <Panel title="Waiting approvals">
            <WorkItemsList items={approvals} />
          </Panel>
          <Panel title="Escalations">
            <WorkItemsList items={escalations} />
          </Panel>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section>
            <SectionHeader title="Timeline" />
            <Panel>
              <ActivityFeed items={timelineActivity} />
            </Panel>
          </section>
          <section>
            <SectionHeader title="Audit history" />
            <Panel>
              <ul className="space-y-2 text-sm">
                {audit.map((entry) => (
                  <li
                    key={entry.id}
                    className="border-b border-white/5 pb-2 last:border-0"
                  >
                    <p className="text-white font-medium">{entry.action}</p>
                    <p className="text-xs text-silver mt-0.5">
                      {entry.actor} · {new Date(entry.timestamp).toLocaleString()}
                    </p>
                    <p className="text-xs text-silver mt-1">{entry.detail}</p>
                  </li>
                ))}
              </ul>
            </Panel>
          </section>
        </div>
      </div>
    </>
  );
}
