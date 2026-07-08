"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import NorthbridgeLogo from "@/components/NorthbridgeLogo";
import { PulseDot } from "./shared/StatusBadge";

const NAV_ITEMS = [
  { href: "/ops", label: "Executive Dashboard", icon: "◈" },
  { href: "/ops/workforce", label: "Digital Workforce", icon: "◎" },
  { href: "/ops/workflows", label: "Workflow Center", icon: "⟐" },
  { href: "/ops/communications", label: "Communications", icon: "✉" },
  { href: "/ops/connectors", label: "Connector Center", icon: "⬡" },
  { href: "/ops/onboarding", label: "Customer Onboarding", icon: "◐" },
  { href: "/ops/command", label: "AI Command Center", icon: "▣" },
  { href: "/ops/analytics", label: "Analytics", icon: "◫" },
];

export default function OpsNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-charcoal border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <Link href="/ops" className="flex items-center gap-2">
          <NorthbridgeLogo className="h-7" />
          <PulseDot color="emerald" />
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="text-sm border border-white/10 px-3 py-1.5"
        >
          Menu
        </button>
      </div>

      <aside className={`w-64 shrink-0 border-r border-white/10 bg-charcoal flex flex-col fixed lg:static inset-y-0 left-0 z-30 transform transition-transform lg:translate-x-0 pt-14 lg:pt-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="p-4 border-b border-white/10">
        <Link href="/ops" className="flex items-center gap-3">
          <NorthbridgeLogo className="h-8" />
        </Link>
        <div className="mt-3 flex items-center gap-2">
          <PulseDot color="emerald" />
          <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">Live Operations</span>
        </div>
      </div>
      <nav className="flex-1 p-3 overflow-y-auto">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || (item.href !== "/ops" && pathname?.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                    active
                      ? "bg-red/10 text-white border-l-2 border-red"
                      : "text-silver hover:text-white hover:bg-white/5 border-l-2 border-transparent"
                  }`}
                >
                  <span className="text-base opacity-70">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-white/10 text-xs text-silver">
        <p>NEO Provider: Mock</p>
        <p className="mt-1">Event-driven · SSE ready</p>
      </div>
      </aside>
      {mobileOpen && (
        <button
          type="button"
          className="lg:hidden fixed inset-0 z-20 bg-black/60"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        />
      )}
    </>
  );
}
