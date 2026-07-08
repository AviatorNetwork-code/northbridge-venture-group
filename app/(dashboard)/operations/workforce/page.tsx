import type { Metadata } from "next";
import {
  DataRow,
  MetricCard,
  ModuleContainer,
  ModuleHeader,
  ProgressBar,
  SectionPanel,
  StatusPill,
} from "@/components/operations/ModuleUI";
import {
  workforceManagers,
  workforceSpecialists,
  workforceTeams,
} from "@/components/operations/module-mock-data";

export const metadata: Metadata = {
  title: "Digital Workforce | AI Operations Center",
  robots: { index: false, follow: false },
};

function statusVariant(status: string) {
  if (status === "Active" || status === "Monitoring") return "success" as const;
  if (status === "At Capacity" || status === "Escalated") return "warning" as const;
  if (status === "Idle") return "neutral" as const;
  return "info" as const;
}

export default function WorkforcePage() {
  const activeCount = workforceSpecialists.filter((s) => s.status === "Active").length;
  const avgWorkload = Math.round(
    workforceSpecialists.reduce((sum, s) => sum + s.workload, 0) / workforceSpecialists.length,
  );

  return (
    <ModuleContainer>
      <ModuleHeader
        eyebrow="Digital Workforce"
        title="Specialists, Teams & Managers"
        description="Monitor agent capacity, team health, and manager oversight across your digital workforce. Mock data only — NEO integration pending."
      />

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Active Specialists" value={String(activeCount)} detail="of 4 deployed" trend="up" />
        <MetricCard label="Teams Online" value="4" detail="All teams reporting" trend="neutral" />
        <MetricCard label="Avg Workload" value={`${avgWorkload}%`} detail="Automation team highest" trend="neutral" />
        <MetricCard label="Open Escalations" value="3" detail="2 assigned to managers" trend="neutral" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <SectionPanel title="Specialists" subtitle="Agent roster & workload" className="lg:col-span-2">
          <div className="space-y-3">
            {workforceSpecialists.map((specialist) => (
              <div
                key={specialist.id}
                className="rounded-lg border border-white/10 bg-black/30 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-white">{specialist.name}</p>
                    <p className="mt-0.5 text-xs text-silver">{specialist.role}</p>
                  </div>
                  <StatusPill status={specialist.status} variant={statusVariant(specialist.status)} />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-xs sm:grid-cols-3">
                  <div>
                    <p className="text-stone">Team</p>
                    <p className="mt-0.5 font-medium text-white">{specialist.team}</p>
                  </div>
                  <div>
                    <p className="text-stone">Active Tasks</p>
                    <p className="mt-0.5 font-medium text-white">{specialist.tasks}</p>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <ProgressBar value={specialist.workload} label="Workload" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionPanel>

        <SectionPanel title="Managers" subtitle="Oversight layer">
          <div className="space-y-3">
            {workforceManagers.map((manager) => (
              <DataRow
                key={manager.id}
                primary={manager.name}
                secondary={manager.scope}
                meta={`${manager.specialists} specialists · ${manager.escalations} escalations`}
                status={manager.status}
                statusVariant={statusVariant(manager.status)}
              />
            ))}
          </div>
        </SectionPanel>
      </div>

      <SectionPanel title="Teams" subtitle="Capacity by function" className="mt-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {workforceTeams.map((team) => (
            <DataRow
              key={team.id}
              primary={team.name}
              secondary={`${team.members} members · ${team.activeTasks} active tasks`}
              status={team.health}
              statusVariant={team.health === "At Capacity" ? "warning" : "success"}
            />
          ))}
        </div>
      </SectionPanel>
    </ModuleContainer>
  );
}
