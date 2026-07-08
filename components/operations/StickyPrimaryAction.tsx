"use client";

import type { ReactNode } from "react";

type StickyPrimaryActionProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Pins a primary CTA above the mobile bottom nav without overlapping panels.
 */
export default function StickyPrimaryAction({ children, className = "" }: StickyPrimaryActionProps) {
  return (
    <div
      className={[
        "fixed inset-x-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom,0px))] z-30 border-t border-white/10 bg-black/90 px-4 py-3 backdrop-blur-md lg:hidden",
        className,
      ].join(" ")}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:flex-wrap">{children}</div>
    </div>
  );
}
