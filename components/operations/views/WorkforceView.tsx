"use client";

import { useState } from "react";
import OpsTopBar from "@/components/operations/shell/OpsTopBar";
import Panel from "@/components/operations/ui/Panel";
import OrgChart from "@/components/operations/widgets/OrgChart";
import SpecialistDrawer from "@/components/operations/widgets/SpecialistDrawer";
import StatusPulse from "@/components/operations/ui/StatusPulse";
import type { WorkforceMember } from "@/lib/neo/types";
import { useNeoSelector } from "@/lib/neo/hooks/useNeoState";

export default function WorkforceView() {
  const workforce = useNeoSelector((s) => s.workforce);
  const hierarchy = useNeoSelector((s) => s.teamHierarchy);
  const [selected, setSelected] = useState<WorkforceMember | null>(null);

  return (
    <>
      <OpsTopBar
        title="Digital Workforce"
        subtitle="Live organization chart, status, and performance."
      />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        <OrgChart
          hierarchy={hierarchy}
          workforce={workforce}
          onSelectMember={setSelected}
        />

        <Panel title="Live roster">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-silver border-b border-white/10">
                  <th className="py-2 pr-4">Member</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4 hidden md:table-cell">Assignment</th>
                  <th className="py-2 pr-4">Queue</th>
                  <th className="py-2 text-right">Performance</th>
                </tr>
              </thead>
              <tbody>
                {workforce.map((m) => (
                  <tr
                    key={m.id}
                    className="border-b border-white/5 cursor-pointer hover:bg-white/[0.02] transition-colors"
                    onClick={() => setSelected(m)}
                  >
                    <td className="py-3 pr-4">
                      <p className="font-medium text-white">{m.name}</p>
                      <p className="text-xs text-silver">{m.title}</p>
                    </td>
                    <td className="py-3 pr-4">
                      <StatusPulse status={m.liveStatus} />
                    </td>
                    <td className="py-3 pr-4 text-silver hidden md:table-cell max-w-xs truncate">
                      {m.currentTask ?? "—"}
                    </td>
                    <td className="py-3 pr-4 tabular-nums text-white">
                      {m.queueSize}
                    </td>
                    <td className="py-3 text-right tabular-nums text-white">
                      {m.performanceScore}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
      <SpecialistDrawer member={selected} onClose={() => setSelected(null)} />
    </>
  );
}
