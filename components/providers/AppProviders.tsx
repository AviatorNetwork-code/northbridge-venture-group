"use client";

import { usePathname } from "next/navigation";
import { CatProvider } from "@/components/cat/CatProvider";
import CatPanel from "@/components/cat/CatPanel";
import { NeoProvider } from "@/components/neo/NeoProvider";

function OperationsCatPanel() {
  const pathname = usePathname();
  if (!pathname.startsWith("/operations")) return null;
  return <CatPanel />;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <NeoProvider>
      <CatProvider>
        {children}
        <OperationsCatPanel />
      </CatProvider>
    </NeoProvider>
  );
}
