"use client";

import type { WorkforceMember } from "@/lib/neo/types";
import StatusPulse from "@/components/operations/ui/StatusPulse";
import Panel from "@/components/operations/ui/Panel";

export default function SpecialistDrawer({
  member,
  onClose,
}: {
  member: WorkforceMember | null;
  onClose: () => void;
}) {
  if (!member) return null;

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-50 bg-black/60"
        aria-label="Close drawer"
        onClick={onClose}
      />
      <aside className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md border-l border-white/10 bg-charcoal shadow-xl animate-slide-in overflow-y-auto">
        <div className="p-5 border-b border-white/10 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center bg-red/20 text-sm font-semibold text-red">
              {member.avatarInitials}
            </span>
            <div>
              <h2 className="text-lg font-semibold text-white">{member.name}</h2>
              <p className="text-sm text-silver">{member.title}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-silver hover:text-white"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="p-5 space-y-4">
          <StatusPulse status={member.liveStatus} label={member.liveStatus} />
          <Panel>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-silver">Role</dt>
                <dd className="text-white capitalize">
                  {member.role.replace("_", " ")}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-silver">Queue size</dt>
                <dd className="text-white tabular-nums">{member.queueSize}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-silver">Performance</dt>
                <dd className="text-white tabular-nums">
                  {member.performanceScore}%
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-silver">Tasks today</dt>
                <dd className="text-white tabular-nums">
                  {member.tasksCompletedToday}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-silver">Avg response</dt>
                <dd className="text-white tabular-nums">
                  {member.avgResponseMinutes}m
                </dd>
              </div>
              <div>
                <dt className="text-silver mb-1">Current assignment</dt>
                <dd className="text-white">
                  {member.currentAssignment ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-silver mb-1">Current task</dt>
                <dd className="text-white">{member.currentTask ?? "—"}</dd>
              </div>
            </dl>
          </Panel>
        </div>
      </aside>
    </>
  );
}
