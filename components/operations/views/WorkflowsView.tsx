"use client";

import OpsTopBar from "@/components/operations/shell/OpsTopBar";
import WorkflowMonitor from "@/components/operations/widgets/WorkflowMonitor";
import { useNeoSelector } from "@/lib/neo/hooks/useNeoState";

export default function WorkflowsView() {
  const workItems = useNeoSelector((s) => s.workItems);
  const events = useNeoSelector((s) => s.workflowEvents);
  const audit = useNeoSelector((s) => s.audit);

  return (
    <>
      <OpsTopBar
        title="Workflow Center"
        subtitle="Live timeline, approvals, escalations, and event stream."
      />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <WorkflowMonitor
          workItems={workItems}
          events={events}
          audit={audit}
        />
      </div>
    </>
  );
}
