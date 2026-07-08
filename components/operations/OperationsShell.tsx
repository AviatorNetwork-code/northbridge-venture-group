"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ActivityPanel from "@/components/operations/ActivityPanel";
import CommandBar from "@/components/operations/CommandBar";
import SidebarNav from "@/components/operations/SidebarNav";
import { navigationItems } from "@/components/operations/mock-data";
import { CatProvider } from "@/components/cat/CatProvider";
import CatPanel from "@/components/cat/CatPanel";

type OperationsShellProps = {
  children: React.ReactNode;
};

function getActiveNavId(pathname: string): string {
  const match = navigationItems.find((item) => {
    if (item.href === "/operations") {
      return pathname === "/operations";
    }

    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  });

  return match?.id ?? "dashboard";
}

export default function OperationsShell({ children }: OperationsShellProps) {
  const pathname = usePathname();
  const activeNavId = getActiveNavId(pathname);
  const [navOpen, setNavOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1280px)");
    const syncActivityPanel = (event: MediaQueryList | MediaQueryListEvent) => {
      setActivityOpen(event.matches);
    };

    syncActivityPanel(mediaQuery);
    mediaQuery.addEventListener("change", syncActivityPanel);

    return () => mediaQuery.removeEventListener("change", syncActivityPanel);
  }, []);

  useEffect(() => {
    document.body.style.overflow = navOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [navOpen]);

  return (
    <CatProvider>
      <div className="flex min-h-screen bg-black text-white">
        <SidebarNav
          activeId={activeNavId}
          isOpen={navOpen}
          onClose={() => setNavOpen(false)}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <CommandBar
            onOpenNav={() => setNavOpen(true)}
            onToggleActivity={() => setActivityOpen((open) => !open)}
            activityOpen={activityOpen}
          />

          <div className="flex min-h-0 flex-1">
            <main className="min-w-0 flex-1 overflow-y-auto">{children}</main>
            <ActivityPanel isOpen={activityOpen} onClose={() => setActivityOpen(false)} />
          </div>
        </div>

        <CatPanel />
      </div>
    </CatProvider>
  );
}
