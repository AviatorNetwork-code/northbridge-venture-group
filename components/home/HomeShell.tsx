"use client";

import NordiHeader from "@/components/home/NordiHeader";
import { NordiActivityProvider } from "@/components/home/NordiActivityContext";

export default function HomeShell({ children }: { children: React.ReactNode }) {
  return (
    <NordiActivityProvider>
      <NordiHeader />
      {children}
    </NordiActivityProvider>
  );
}
