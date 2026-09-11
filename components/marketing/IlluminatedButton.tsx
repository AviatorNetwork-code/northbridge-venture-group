"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { IlluminationLevel } from "@/lib/brand/tokens";

type IlluminatedButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  variant?: "primary" | "secondary" | "tertiary";
  illumination?: IlluminationLevel;
  children: ReactNode;
};

const base =
  "group relative inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black";

function illuminationClass(level: IlluminationLevel, variant: string): string {
  if (level === 0 || variant === "tertiary") return "";
  if (level === 1) return "illum-l1";
  if (level === 2) return "illum-l2";
  return "illum-l3";
}

export default function IlluminatedButton({
  href,
  variant = "primary",
  illumination,
  className = "",
  children,
  ...props
}: IlluminatedButtonProps) {
  const level =
    illumination ?? (variant === "primary" ? 3 : variant === "secondary" ? 1 : 0);

  const variantClass =
    variant === "primary"
      ? "bg-red text-white hover:bg-red-hover shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
      : variant === "secondary"
        ? "border border-white/15 bg-white/[0.03] text-white hover:border-white/30 hover:bg-white/[0.06]"
        : "bg-transparent px-0 text-silver hover:text-white underline-offset-4 hover:underline";

  const classes = `${base} ${variantClass} ${illuminationClass(level, variant)} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} onClick={props.onClick as never}>
        <span className="relative z-10">{children}</span>
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      <span className="relative z-10">{children}</span>
    </button>
  );
}
