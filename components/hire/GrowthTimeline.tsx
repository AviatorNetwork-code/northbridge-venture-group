"use client";

import type { GrowthStage } from "@/lib/workforce/types";
import { growthStages } from "@/lib/workforce/catalog";

type GrowthTimelineProps = {
  currentStage: GrowthStage;
};

const stageOrder: GrowthStage[] = [
  "start",
  "specialists",
  "team",
  "manager",
  "regional-manager",
  "executive",
];

export default function GrowthTimeline({ currentStage }: GrowthTimelineProps) {
  const currentIndex = stageOrder.indexOf(currentStage);

  return (
    <>
      <ol className="space-y-3 md:hidden">
        {growthStages.map((stage, index) => {
          const isActive = stage.id === currentStage;
          const isComplete = index < currentIndex;

          return (
            <li
              key={stage.id}
              className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/20 p-3"
            >
              <div
                className={[
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                  isActive
                    ? "border-red bg-red/20 text-white"
                    : isComplete
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                      : "border-white/10 bg-black/30 text-stone",
                ].join(" ")}
              >
                {isComplete ? "✓" : index + 1}
              </div>
              <div>
                <p className={["text-sm font-medium", isActive ? "text-white" : "text-silver"].join(" ")}>
                  {stage.label}
                </p>
                <p className="mt-0.5 text-xs leading-snug text-stone">{stage.description}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="hidden overflow-x-auto pb-2 md:block">
        <div className="flex min-w-[640px] items-start gap-2">
          {growthStages.map((stage, index) => {
            const isActive = stage.id === currentStage;
            const isComplete = index < currentIndex;

            return (
              <div key={stage.id} className="flex flex-1 items-start">
                <div className="flex flex-1 flex-col items-center text-center">
                  <div
                    className={[
                      "flex h-9 w-9 items-center justify-center rounded-full border text-xs font-semibold transition-all",
                      isActive
                        ? "border-red bg-red/20 text-white scale-110"
                        : isComplete
                          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                          : "border-white/10 bg-black/30 text-stone",
                    ].join(" ")}
                  >
                    {isComplete ? "✓" : index + 1}
                  </div>
                  <p
                    className={[
                      "mt-2 text-xs font-medium",
                      isActive ? "text-white" : isComplete ? "text-silver" : "text-stone",
                    ].join(" ")}
                  >
                    {stage.label}
                  </p>
                  <p className="mt-0.5 hidden text-[10px] leading-snug text-stone lg:block">
                    {stage.description}
                  </p>
                </div>
                {index < growthStages.length - 1 ? (
                  <div
                    className={[
                      "mx-1 mt-4 h-0.5 flex-1",
                      index < currentIndex ? "bg-emerald-500/40" : "bg-white/10",
                    ].join(" ")}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
