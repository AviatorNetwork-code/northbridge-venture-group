"use client";

import { NeoProvider } from "@/lib/neo/context/NeoProvider";
import OpsNav from "./OpsShell";
import ToastStack from "./shared/ToastStack";

export default function OpsLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <NeoProvider>
      <div className="min-h-screen bg-black ops-grid-bg flex pt-14 lg:pt-0">
        <OpsNav />
        <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
        <ToastStack />
      </div>
    </NeoProvider>
  );
}
