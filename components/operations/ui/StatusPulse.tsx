import type { LiveWorkforceStatus } from "@/lib/neo/types";

const styles: Record<LiveWorkforceStatus, string> = {
  idle: "bg-stone",
  working: "bg-emerald-500 animate-pulse-slow",
  waiting: "bg-amber-500 animate-pulse-slow",
  escalated: "bg-red animate-pulse",
  offline: "bg-white/20",
};

export default function StatusPulse({
  status,
  label,
}: {
  status: LiveWorkforceStatus;
  label?: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 text-xs capitalize text-silver">
      <span
        className={`h-2 w-2 rounded-full ${styles[status]}`}
        aria-hidden
      />
      {label ?? status}
    </span>
  );
}
