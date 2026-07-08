"use client";

import type { ReactNode } from "react";

export const CAT_OPEN_EVENT = "cat:open";

export function openCat(topic?: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(CAT_OPEN_EVENT, { detail: { topic } }));
}

type CatButtonProps = {
  children: ReactNode;
  topic?: string;
  className?: string;
  "aria-label"?: string;
};

export default function CatButton({
  children,
  topic,
  className = "",
  ...rest
}: CatButtonProps) {
  return (
    <button type="button" onClick={() => openCat(topic)} className={className} {...rest}>
      {children}
    </button>
  );
}
