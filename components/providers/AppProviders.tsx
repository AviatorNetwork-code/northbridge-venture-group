"use client";

import { CatProvider } from "@/components/cat/CatProvider";
import CatPanel from "@/components/cat/CatPanel";
import { NeoProvider } from "@/components/neo/NeoProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <NeoProvider>
      <CatProvider>
        {children}
        <CatPanel />
      </CatProvider>
    </NeoProvider>
  );
}
