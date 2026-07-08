"use client";

import type { TeamNode, WorkforceMember } from "@/lib/neo/types";
import StatusPulse from "@/components/operations/ui/StatusPulse";

function MemberNode({
  member,
  onSelect,
}: {
  member: WorkforceMember;
  onSelect: (m: WorkforceMember) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(member)}
      className="border border-white/10 bg-slate/50 p-3 text-left hover:border-red/40 transition-colors w-full"
    >
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center bg-red/20 text-xs font-semibold text-red">
          {member.avatarInitials}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-white truncate">{member.name}</p>
          <p className="text-xs text-silver truncate">{member.title}</p>
        </div>
      </div>
      <div className="mt-2">
        <StatusPulse status={member.liveStatus} />
      </div>
    </button>
  );
}

export default function OrgChart({
  hierarchy,
  workforce,
  onSelectMember,
}: {
  hierarchy: TeamNode[];
  workforce: WorkforceMember[];
  onSelectMember: (m: WorkforceMember) => void;
}) {
  const root = hierarchy.find((t) => t.id === "team-ops") ?? hierarchy[0];

  function membersFor(teamId: string) {
    const team = hierarchy.find((t) => t.id === teamId);
    if (!team) return [];
    return workforce.filter((m) => team.memberIds.includes(m.id));
  }

  function childTeams(parentId: string) {
    const parent = hierarchy.find((t) => t.id === parentId);
    if (!parent) return [];
    return hierarchy.filter((t) => parent.childTeamIds.includes(t.id));
  }

  return (
    <div className="space-y-6">
      {root && (
        <div>
          <h3 className="text-xs uppercase tracking-widest text-red mb-3">
            {root.name}
          </h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {membersFor(root.id).map((m) => (
              <MemberNode key={m.id} member={m} onSelect={onSelectMember} />
            ))}
          </div>
        </div>
      )}
      {root &&
        childTeams(root.id).map((team) => (
          <div key={team.id} className="pl-4 border-l border-white/10">
            <h3 className="text-xs uppercase tracking-widest text-silver mb-3">
              {team.name}
            </h3>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {membersFor(team.id).map((m) => (
                <MemberNode key={m.id} member={m} onSelect={onSelectMember} />
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
