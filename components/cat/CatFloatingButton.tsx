"use client";

import { usePathname } from "next/navigation";
import { IconCat } from "@/components/operations/icons";
import { useCat } from "@/components/cat/CatProvider";

export default function CatFloatingButton() {
  const pathname = usePathname();
  const { isOpen, toggleCat } = useCat();

  if (pathname === "/" || pathname.startsWith("/operations")) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={toggleCat}
      aria-label="Open CAT Workforce Advisor"
      aria-pressed={isOpen}
      className={[
        "fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red/50 sm:bottom-6 sm:right-6",
        isOpen ? "bg-red-hover ring-2 ring-red/40" : "bg-red hover:bg-red-hover",
      ].join(" ")}
    >
      <IconCat className="h-6 w-6" />
    </button>
  );
}
