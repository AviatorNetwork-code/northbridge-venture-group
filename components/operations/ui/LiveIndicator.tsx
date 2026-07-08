"use client";

import { useNeoLive } from "@/components/operations/providers/NeoLiveProvider";

export default function LiveIndicator() {
  const { live } = useNeoLive();

  if (!live) return null;

  return (
    <div className="absolute top-3 right-4 z-30 flex items-center gap-2 text-[10px] uppercase tracking-widest text-silver">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red opacity-60" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-red" />
      </span>
      Live
    </div>
  );
}
