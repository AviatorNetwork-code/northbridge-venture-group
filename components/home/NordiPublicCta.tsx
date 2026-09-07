"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { openNordyHref } from "@/lib/nordy/routes";

export function useNordiPublicCtaLabel(): string {
  return "Talk to Nordi";
}

type NordiPublicCtaProps = {
  variant?: "header" | "primary" | "footer";
  href?: string;
  className?: string;
};

export default function NordiPublicCta({
  variant = "primary",
  href = openNordyHref("GENERAL"),
  className = "",
}: NordiPublicCtaProps) {
  const label = useNordiPublicCtaLabel();
  const pathname = usePathname();
  const resolvedHref = href || openNordyHref("GENERAL");

  const classes =
    variant === "header"
      ? "inline-flex min-h-11 items-center justify-center rounded-xl bg-red px-4 text-sm font-semibold text-white transition hover:bg-red-hover"
      : "inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-red px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-red-hover sm:w-auto";

  return (
    <Link
      href={resolvedHref}
      className={`${classes} ${className}`}
      aria-current={pathname?.includes("nordy=open") ? "page" : undefined}
    >
      {label}
    </Link>
  );
}
