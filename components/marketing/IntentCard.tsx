"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { IlluminationLevel } from "@/lib/brand/tokens";

type IntentCardProps = {
  title: string;
  description: string;
  points: string[];
  ctaLabel: string;
  href: string;
  tone: "explore" | "engineering" | "digital";
  illumination?: IlluminationLevel;
  onSelect?: () => void;
};

const toneStyles = {
  explore:
    "intent-card-explore before:from-white/10 before:via-white/25 before:to-transparent",
  engineering:
    "intent-card-engineering before:from-red/20 before:via-cyan-200/20 before:to-transparent",
  digital:
    "intent-card-digital before:from-sky-200/25 before:via-white/20 before:to-transparent",
};

export default function IntentCard({
  title,
  description,
  points,
  ctaLabel,
  href,
  tone,
  illumination = 2,
  onSelect,
}: IntentCardProps) {
  return (
    <Link
      href={href}
      onClick={onSelect}
      className={`intent-card group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b1017]/95 p-6 sm:p-7 illum-l${illumination} ${toneStyles[tone]}`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-60 intent-card-grid" aria-hidden />
      <div className="relative z-10 flex h-full flex-col">
        <h3 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-silver sm:text-[15px]">{description}</p>
        <ul className="mt-5 space-y-2 text-sm text-mist/90">
          {points.map((point) => (
            <li key={point} className="flex gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-red" aria-hidden />
              <span>{point}</span>
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-6">
          <span className="inline-flex min-h-11 items-center text-sm font-semibold text-white transition group-hover:text-red">
            {ctaLabel}
            <span aria-hidden className="ml-2 transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
}) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-red">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-sm leading-relaxed text-silver sm:text-base">{description}</p>
      ) : null}
    </div>
  );
}
