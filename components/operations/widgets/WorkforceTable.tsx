import StatusBadge from "@/components/operations/ui/StatusBadge";
import type { WorkforceMember, WorkforceStatus } from "@/lib/neo/types";

const statusLevel: Record<WorkforceStatus, "healthy" | "degraded" | "critical" | "unknown"> = {
  active: "healthy",
  idle: "unknown",
  busy: "degraded",
  offline: "unknown",
  training: "healthy",
};

export default function WorkforceTable({
  members,
}: {
  members: WorkforceMember[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wider text-silver border-b border-white/10">
            <th className="py-2 pr-4 font-medium">Member</th>
            <th className="py-2 pr-4 font-medium hidden sm:table-cell">Role</th>
            <th className="py-2 pr-4 font-medium">Status</th>
            <th className="py-2 pr-4 font-medium hidden md:table-cell">Current task</th>
            <th className="py-2 font-medium text-right">Performance</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id} className="border-b border-white/5">
              <td className="py-3 pr-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center bg-red/20 text-xs font-semibold text-red">
                    {member.avatarInitials}
                  </span>
                  <div>
                    <p className="font-medium text-white">{member.name}</p>
                    <p className="text-xs text-silver sm:hidden">{member.title}</p>
                  </div>
                </div>
              </td>
              <td className="py-3 pr-4 text-silver hidden sm:table-cell capitalize">
                {member.role.replace("_", " ")}
              </td>
              <td className="py-3 pr-4">
                <StatusBadge label={member.status} level={statusLevel[member.status]} />
              </td>
              <td className="py-3 pr-4 text-silver hidden md:table-cell max-w-xs truncate">
                {member.currentTask ?? "—"}
              </td>
              <td className="py-3 text-right tabular-nums text-white">
                {member.performanceScore}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
