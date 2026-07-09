"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getNordiPublicCtaLabel,
  readStoredNordiConversation,
} from "@/lib/nordi/public-conversation-state";

type NordiPublicCtaVariant = "header" | "primary" | "secondary";

type NordiPublicCtaProps = {
  variant?: NordiPublicCtaVariant;
  href?: string;
  className?: string;
};

const variantClasses: Record<NordiPublicCtaVariant, string> = {
  header:
    "inline-flex min-h-11 items-center justify-center rounded-full border border-red/40 bg-red/10 px-4 text-sm font-semibold text-white transition-colors hover:border-red/60 hover:bg-red/20",
  primary:
    "inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-red px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-red-hover sm:w-auto",
  secondary:
    "inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/30 hover:bg-white/10 sm:w-auto",
};

export function useNordiPublicCtaLabel(fallback = "Talk to Nordi"): string {
  const [label, setLabel] = useState(fallback);

  useEffect(() => {
    setLabel(getNordiPublicCtaLabel(readStoredNordiConversation()));
  }, [fallback]);

  return label;
}

export default function NordiPublicCta({
  variant = "primary",
  href = "/",
  className = "",
}: NordiPublicCtaProps) {
  const label = useNordiPublicCtaLabel();

  return (
    <Link href={href} className={[variantClasses[variant], className].join(" ")}>
      {label}
    </Link>
  );
}
