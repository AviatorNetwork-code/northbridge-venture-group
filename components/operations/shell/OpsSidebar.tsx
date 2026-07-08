"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import NorthbridgeLogo from "@/components/NorthbridgeLogo";
import { OpsNavLink, operationsNav } from "@/components/operations/shell/ops-nav";

export default function OpsSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="lg:hidden fixed bottom-4 right-4 z-50 h-12 w-12 bg-red text-white shadow-lg flex items-center justify-center"
        aria-label="Toggle operations navigation"
        onClick={() => setOpen((v) => !v)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M4 7H20M4 12H20M4 17H14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 shrink-0 border-r border-white/10 bg-black flex flex-col transform transition-transform lg:transform-none ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="px-4 py-4 border-b border-white/10">
          <Link href="/operations" className="block" onClick={() => setOpen(false)}>
            <NorthbridgeLogo className="h-8" />
          </Link>
          <p className="mt-3 text-xs uppercase tracking-widest text-red">
            AI Operations Center
          </p>
          <p className="text-xs text-silver mt-1">Northbridge Digital</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-3">
          {operationsNav.map((item) => (
            <OpsNavLink
              key={item.href}
              href={item.href}
              label={item.label}
              active={
                item.href === "/operations"
                  ? pathname === "/operations"
                  : pathname.startsWith(item.href)
              }
            />
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 text-xs text-silver">
          <Link href="/digital" className="hover:text-white transition-colors">
            ← Marketing site
          </Link>
        </div>
      </aside>

      {open && (
        <button
          type="button"
          className="lg:hidden fixed inset-0 z-30 bg-black/60"
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
