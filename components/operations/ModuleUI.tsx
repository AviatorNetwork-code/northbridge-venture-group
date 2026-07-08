import type { ReactNode } from "react";

type ModuleContainerProps = {
  children: ReactNode;
};

export function ModuleContainer({ children }: ModuleContainerProps) {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl min-w-0">{children}</div>
    </div>
  );
}

type ModuleHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function ModuleHeader({ eyebrow, title, description }: ModuleHeaderProps) {
  return (
    <header className="mb-6 sm:mb-8">
      <p className="text-xs font-semibold uppercase tracking-wider text-red">{eyebrow}</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        {title}
      </h1>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-silver sm:text-base">
        {description}
      </p>
    </header>
  );
}

type MetricCardProps = {
  label: string;
  value: string;
  detail?: string;
  trend?: "up" | "down" | "neutral";
};

const trendStyles = {
  up: "text-emerald-400",
  down: "text-red",
  neutral: "text-silver",
} as const;

export function MetricCard({ label, value, detail, trend = "neutral" }: MetricCardProps) {
  return (
    <article className="min-w-0 rounded-xl border border-white/10 bg-slate/60 p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-stone">{label}</p>
      <p className="mt-2 break-words text-2xl font-semibold text-white sm:text-3xl">{value}</p>
      {detail ? (
        <p className={`mt-1 break-words text-xs ${trendStyles[trend]}`}>{detail}</p>
      ) : null}
    </article>
  );
}

type SectionPanelProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
};

export function SectionPanel({ title, subtitle, children, className = "" }: SectionPanelProps) {
  return (
    <section className={`rounded-xl border border-white/10 bg-slate/40 p-5 sm:p-6 ${className}`}>
      <h2 className="text-xs font-semibold uppercase tracking-wider text-red">{title}</h2>
      {subtitle ? <p className="mt-1 text-lg font-semibold text-white">{subtitle}</p> : null}
      <div className={subtitle ? "mt-5" : "mt-4"}>{children}</div>
    </section>
  );
}

type StatusPillProps = {
  status: string;
  variant?: "success" | "warning" | "danger" | "neutral" | "info";
};

const pillStyles = {
  success: "bg-emerald-500/10 text-emerald-300",
  warning: "bg-amber-500/10 text-amber-300",
  danger: "bg-red/10 text-red",
  neutral: "bg-white/5 text-silver",
  info: "bg-blue-500/10 text-blue-300",
} as const;

export function StatusPill({ status, variant = "neutral" }: StatusPillProps) {
  return (
    <span
      className={[
        "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        pillStyles[variant],
      ].join(" ")}
    >
      {status}
    </span>
  );
}

type DataRowProps = {
  primary: string;
  secondary?: string;
  meta?: string;
  status?: string;
  statusVariant?: StatusPillProps["variant"];
};

export function DataRow({
  primary,
  secondary,
  meta,
  status,
  statusVariant = "neutral",
}: DataRowProps) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-white/10 bg-black/30 px-3 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-3 sm:px-4">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-white">{primary}</p>
        {secondary ? (
          <p className="mt-0.5 break-words text-xs leading-relaxed text-silver">{secondary}</p>
        ) : null}
      </div>
      <div className="flex shrink-0 flex-row items-center gap-2 sm:flex-col sm:items-end">
        {status ? <StatusPill status={status} variant={statusVariant} /> : null}
        {meta ? <span className="text-[11px] text-stone">{meta}</span> : null}
      </div>
    </div>
  );
}

type ProgressBarProps = {
  value: number;
  label?: string;
};

export function ProgressBar({ value, label }: ProgressBarProps) {
  return (
    <div>
      {label ? (
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-silver">{label}</span>
          <span className="font-medium text-white">{value}%</span>
        </div>
      ) : null}
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-red transition-all"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}
