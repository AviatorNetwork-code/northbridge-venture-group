"use client";

import { activityFeed } from "@/components/operations/mock-data";
import { IconClose } from "@/components/operations/icons";

type ActivityPanelProps = {
  isOpen: boolean;
  onClose: () => void;
};

const typeStyles = {
  workflow: "bg-blue-500/10 text-blue-300",
  agent: "bg-red/10 text-red",
  connector: "bg-emerald-500/10 text-emerald-300",
  alert: "bg-amber-500/10 text-amber-300",
  billing: "bg-purple-500/10 text-purple-300",
} as const;

export default function ActivityPanel({ isOpen, onClose }: ActivityPanelProps) {
  return (
    <>
      {isOpen ? (
        <button
          type="button"
          aria-label="Close activity panel"
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm xl:hidden"
          onClick={onClose}
        />
      ) : null}

      <aside
        className={[
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-white/10 bg-charcoal transition-transform duration-300 xl:static xl:z-auto xl:max-w-xs xl:translate-x-0 2xl:max-w-sm",
          isOpen ? "translate-x-0" : "translate-x-full xl:hidden",
        ].join(" ")}
        aria-hidden={!isOpen}
      >
        <div className="flex h-14 items-center justify-between border-b border-white/10 px-4 sm:h-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-red">Activity</p>
            <h2 className="text-sm font-semibold text-white">Live Feed</h2>
          </div>
          <button
            type="button"
            aria-label="Close activity panel"
            className="rounded-md p-2 text-silver hover:bg-white/5 hover:text-white xl:hidden"
            onClick={onClose}
          >
            <IconClose className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-white/10 px-4 py-3">
          <p className="text-xs text-silver">
            Mock activity stream for shell preview. NEO integration pending.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-3">
            {activityFeed.map((item) => (
              <li
                key={item.id}
                className="rounded-lg border border-white/10 bg-slate/40 p-3 transition-colors hover:border-white/20"
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={[
                      "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                      typeStyles[item.type],
                    ].join(" ")}
                  >
                    {item.type}
                  </span>
                  <time className="text-[11px] text-stone">{item.timestamp}</time>
                </div>
                <h3 className="mt-2 text-sm font-medium text-white">{item.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-silver">{item.description}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-white/10 p-4">
          <button
            type="button"
            className="w-full rounded-lg border border-white/15 bg-black/40 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:border-white/30 hover:bg-white/5"
          >
            View All Activity
          </button>
        </div>
      </aside>
    </>
  );
}
