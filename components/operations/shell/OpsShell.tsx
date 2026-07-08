"use client";

import OpsSidebar from "@/components/operations/shell/OpsSidebar";
import { NeoLiveProvider } from "@/components/operations/providers/NeoLiveProvider";
import ToastStack from "@/components/operations/ui/ToastStack";
import LiveIndicator from "@/components/operations/ui/LiveIndicator";

export default function OpsShell({ children }: { children: React.ReactNode }) {
  return (
    <NeoLiveProvider>
      <div className="min-h-screen bg-black text-white flex">
        <OpsSidebar />
        <div className="flex-1 flex flex-col min-w-0 lg:ml-0 relative">
          <LiveIndicator />
          {children}
        </div>
        <ToastStack />
      </div>
    </NeoLiveProvider>
  );
}
