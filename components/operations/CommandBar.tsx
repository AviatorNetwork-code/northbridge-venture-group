"use client";

import { IconBell, IconCat, IconMenu, IconPanel, IconSearch } from "@/components/operations/icons";
import { useCat } from "@/components/cat/CatProvider";

type CommandBarProps = {
  onOpenNav: () => void;
  onToggleActivity: () => void;
  activityOpen: boolean;
};

export default function CommandBar({
  onOpenNav,
  onToggleActivity,
  activityOpen,
}: CommandBarProps) {
  const { isOpen: catOpen, toggleCat } = useCat();

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-black/95 backdrop-blur-sm">
      <div className="grid h-14 grid-cols-[auto_1fr_auto] items-center gap-2 px-3 sm:h-16 sm:gap-4 sm:px-4 lg:px-6">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Open navigation"
            className="rounded-md p-2 text-silver hover:bg-white/5 hover:text-white lg:hidden"
            onClick={onOpenNav}
          >
            <IconMenu className="h-5 w-5" />
          </button>

          <div className="hidden items-center gap-2 sm:flex">
            <label className="relative">
              <span className="sr-only">Search operations</span>
              <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone" />
              <input
                type="search"
                placeholder="Search operations..."
                className="w-44 rounded-lg border border-white/10 bg-slate/60 py-2 pl-9 pr-3 text-sm text-white placeholder:text-stone focus:border-red/50 focus:outline-none focus:ring-1 focus:ring-red/30 lg:w-56 xl:w-72"
                readOnly
                aria-readonly="true"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={toggleCat}
            aria-label="Open CAT Workforce Advisor"
            aria-pressed={catOpen}
            className={[
              "group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-red/40 sm:px-5",
              catOpen
                ? "border-red bg-red/25 ring-2 ring-red/30"
                : "border-red/40 bg-red/10 hover:border-red hover:bg-red/20",
            ].join(" ")}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red text-white">
              <IconCat className="h-4 w-4" />
            </span>
            <span className="hidden sm:inline">CAT</span>
            <span className="hidden text-xs font-normal text-silver md:inline">
              Workforce Advisor
            </span>
          </button>
        </div>

        <div className="flex items-center justify-end gap-1 sm:gap-2">
          <button
            type="button"
            aria-label="Notifications"
            className="relative rounded-md p-2 text-silver hover:bg-white/5 hover:text-white"
          >
            <IconBell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red" />
          </button>

          <button
            type="button"
            aria-label={activityOpen ? "Hide activity panel" : "Show activity panel"}
            aria-pressed={activityOpen}
            className={[
              "rounded-md p-2 transition-colors",
              activityOpen
                ? "bg-red/15 text-white"
                : "text-silver hover:bg-white/5 hover:text-white",
            ].join(" ")}
            onClick={onToggleActivity}
          >
            <IconPanel className="h-5 w-5" />
          </button>

          <div className="ml-1 hidden items-center gap-2 rounded-lg border border-white/10 bg-slate/60 px-2 py-1.5 sm:flex">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red/20 text-xs font-semibold text-red">
              NB
            </span>
            <div className="hidden md:block">
              <p className="text-xs font-medium text-white">Northbridge Ops</p>
              <p className="text-[11px] text-stone">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
