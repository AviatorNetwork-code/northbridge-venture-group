import Link from "next/link";
import type { Venture } from "@/lib/ventures";
import { Tag } from "@/components/ui/Tag";

function externalCta(href: string): string {
  try {
    return `${new URL(href).hostname.replace(/^www\./, "")} →`;
  } catch {
    return `${href} →`;
  }
}

type VentureCardProps = {
  venture: Venture;
  compact?: boolean;
};

export function VentureCard({ venture, compact = false }: VentureCardProps) {
  const isComingSoon = venture.comingSoon === true;
  const isExternal = !isComingSoon && (venture.external ?? venture.href.startsWith("http"));
  const cta =
    venture.ctaLabel ??
    (isComingSoon ? "Coming soon" : isExternal ? externalCta(venture.href) : "Learn more");
  const className = `block h-full ${
    isComingSoon ? "nb-card opacity-80" : "nb-card-interactive group"
  } ${compact ? "p-6" : "p-8"}`;

  const body = (
    <>
      {venture.category && <p className="nb-eyebrow text-[0.65rem]">{venture.category}</p>}
      <h2
        className={`font-semibold text-white transition-colors group-hover:text-northbridge-red ${
          venture.category ? "mt-3" : ""
        } ${compact ? "text-lg" : "text-xl"}`}
      >
        {venture.name}
      </h2>
      {venture.positioning && (
        <p
          className={`font-medium text-white/85 leading-snug ${
            compact ? "mt-2 text-sm" : "mt-3 text-base"
          }`}
        >
          {venture.positioning}
        </p>
      )}
      <p className={`text-white/60 leading-relaxed ${compact ? "mt-2 text-sm" : "mt-3"}`}>
        {venture.description}
      </p>
      {venture.audience && venture.audience.length > 0 && !compact && (
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/45">Built for</p>
          <p className="mt-2 text-sm text-white/65 leading-relaxed">
            {venture.audience.join(" · ")}
          </p>
        </div>
      )}
      {venture.capabilities && venture.capabilities.length > 0 && !compact && (
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/45">
            Ecosystem includes
          </p>
          <ul className="mt-3 flex flex-wrap gap-2 list-none">
            {venture.capabilities.map((cap) => (
              <li key={cap}>
                <Tag>{cap}</Tag>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-white/40 leading-relaxed">
            Capabilities are rolling out over time—designed to support a connected aviation
            ecosystem.
          </p>
        </div>
      )}
      <span
        className={`inline-flex items-center gap-1 text-northbridge-red-text font-semibold ${
          compact ? "mt-4 text-sm" : "mt-6 text-sm"
        }`}
      >
        {cta}
        {!isComingSoon && (
          <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">
            →
          </span>
        )}
      </span>
    </>
  );

  if (isComingSoon) {
    return <div className={className}>{body}</div>;
  }

  if (isExternal) {
    return (
      <a href={venture.href} target="_blank" rel="noopener noreferrer" className={className}>
        {body}
      </a>
    );
  }

  return (
    <Link href={venture.href} className={className}>
      {body}
    </Link>
  );
}
