"use client";

import Link from "next/link";
import NorthbridgeLogo from "@/components/NorthbridgeLogo";
import { navigationItems } from "@/components/operations/mock-data";
import { IconClose, NavIcon } from "@/components/operations/icons";

type SidebarNavProps = {
  activeId: string;
  isOpen: boolean;
  onClose: () => void;
};

export default function SidebarNav({ activeId, isOpen, onClose }: SidebarNavProps) {
  return (
    <>
      {isOpen ? (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      ) : null}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-charcoal transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="flex h-14 items-center justify-between border-b border-white/10 px-4 sm:h-16 sm:px-5">
          <Link href="/operations" className="min-w-0" onClick={onClose}>
            <NorthbridgeLogo className="h-7 sm:h-8" />
          </Link>
          <button
            type="button"
            aria-label="Close navigation"
            className="rounded-md p-2 text-silver hover:bg-white/5 hover:text-white lg:hidden"
            onClick={onClose}
          >
            <IconClose className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-white/10 px-4 py-4 sm:px-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-red">AI Operations Center</p>
          <p className="mt-1 text-sm text-silver">Customer application shell</p>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 sm:px-4" aria-label="Operations navigation">
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = item.id === activeId;

              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={[
                      "group flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors",
                      isActive
                        ? "bg-red/15 text-white ring-1 ring-red/30"
                        : "text-silver hover:bg-white/5 hover:text-white",
                    ].join(" ")}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <NavIcon
                      id={item.id}
                      className={[
                        "mt-0.5 h-5 w-5 shrink-0",
                        isActive ? "text-red" : "text-stone group-hover:text-silver",
                      ].join(" ")}
                    />
                    <span className="min-w-0">
                      <span className="block text-sm font-medium">{item.label}</span>
                      <span className="mt-0.5 block text-xs leading-snug text-stone group-hover:text-silver">
                        {item.description}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-white/10 p-4 sm:p-5">
          <div className="rounded-lg border border-white/10 bg-slate/60 p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-red">NEO Ready</p>
            <p className="mt-1 text-xs leading-relaxed text-silver">
              Integration point reserved for future NEO connection.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
