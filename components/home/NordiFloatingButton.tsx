"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNordiPublicCtaLabel } from "@/components/home/NordiPublicCta";

export default function NordiFloatingButton() {
  const pathname = usePathname();
  const label = useNordiPublicCtaLabel();

  if (pathname === "/" || pathname.startsWith("/operations")) {
    return null;
  }

  return (
    <Link
      href="/"
      aria-label={label}
      className="fixed bottom-5 right-5 z-40 flex h-14 min-w-14 items-center justify-center gap-2 rounded-full bg-red px-4 text-white shadow-lg transition-colors hover:bg-red-hover focus:outline-none focus:ring-2 focus:ring-red/50 sm:bottom-6 sm:right-6 sm:px-5"
    >
      <span
        aria-hidden
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/20 text-xs font-bold uppercase tracking-wide"
      >
        N
      </span>
      <span className="hidden max-w-[9rem] truncate text-sm font-semibold sm:inline">{label}</span>
    </Link>
  );
}
