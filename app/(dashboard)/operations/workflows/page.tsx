import type { Metadata } from "next";
import {
  DataRow,
  MetricCard,
  ModuleContainer,
  ModuleHeader,
  SectionPanel,
  StatusPill,
} from "@/components/operations/ModuleUI";
import {
  workflowApprovals,
  workflowItems,
  workflowTimeline,
} from "@/components/operations/module-mock-data";

export const metadata: Metadata = {
  title: "Workflows | AI Operations Center",
  robots: { index: false, follow: false },
};

function priorityVariant(priority: string) {
  if (priority === "High") return "danger" as const;
  if (priority === "Medium") return "warning" as const;
  return "neutral" as const;
}

function statusVariant(status: string) {
  if (status === "Escalated") return "danger" as const;
  if (status === "Awaiting Approval") return "warning" as const;
  if (status === "In Progress") return "info" as const;
  if (status === "Scheduled") return "neutral" as const;
  return "success" as const;
}

export default function WorkflowsPage() {
  return (
    <ModuleContainer>
      <ModuleHeader
        eyebrow="Workflows"
        title="Active Work Items & Pipeline"
        description="Track running workflows, pending approvals, escalations, and recent timeline events across your operations."
      />

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Active Items" value="8" detail="3 high priority" trend="neutral" />
        <MetricCard label="Awaiting Approval" value="2" detail="Oldest: 1 hr ago" trend="neutral" />
        <MetricCard label="Escalations" value="1" detail="Assigned to Manager Echo" trend="down" />
        <MetricCard label="Completed Today" value="14" detail="+3 vs yesterday" trend="up" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <SectionPanel title="Work Items" subtitle="Active pipeline" className="lg:col-span-2">
          <div className="space-y-3">
            {workflowItems.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-white/10 bg-black/30 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-white">{item.title}</p>
                    <p className="mt-0.5 text-xs text-silver">Owner: {item.owner}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <StatusPill status={item.priority} variant={priorityVariant(item.priority)} />
                    <StatusPill status={item.status} variant={statusVariant(item.status)} />
                  </div>
                </div>
                <p className="mt-2 text-[11px] text-stone">Due {item.due}</p>
              </div>
            ))}
          </div>
        </SectionPanel>

        <div className="space-y-6">
          <SectionPanel title="Approvals" subtitle="Pending sign-off">
            <div className="space-y-3">
              {workflowApprovals.map((approval) => (
                <DataRow
                  key={approval.id}
                  primary={approval.request}
                  secondary={`Requested by ${approval.requester}`}
                  meta={approval.age}
                  status="Pending"
                  statusVariant="warning"
                />
              ))}
            </div>
          </SectionPanel>

          <SectionPanel title="Timeline" subtitle="Recent events">
            <ul className="space-y-3">
              {workflowTimeline.map((event) => (
                <li key={event.id} className="border-l-2 border-red/40 pl-3">
                  <p className="text-[11px] font-medium text-stone">{event.time}</p>
                  <p className="mt-0.5 text-sm text-silver">{event.event}</p>
                </li>
              ))}
            </ul>
          </SectionPanel>
        </div>
      </div>
    </ModuleContainer>
  );
}
