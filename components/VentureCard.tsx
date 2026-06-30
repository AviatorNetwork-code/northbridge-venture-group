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
    isComingSoon ? "nb-card opacity-85" : "nb-card-interactive group"
  }`;

  const body = (
    <>
      {venture.category && <p className="nb-eyebrow">{venture.category}</p>}
      <h3
        className={`font-semibold text-white transition-colors group-hover:text-northbridge-red-text ${
          venture.category ? "mt-3" : ""
        } ${compact ? "text-lg" : "text-xl"}`}
      >
        {venture.name}
      </h3>
      {venture.positioning && (
        <p
          className={`font-medium text-white/88 leading-snug ${
            compact ? "mt-2 text-sm" : "mt-3 text-base"
          }`}
        >
          {venture.positioning}
        </p>
      )}
      <p className={`text-white/65 leading-[1.6] ${compact ? "mt-2 text-sm" : "mt-3 text-sm sm:text-[0.9375rem]"}`}>
        {venture.description}
      </p>
      {venture.audience && venture.audience.length > 0 && !compact && (
        <div className="mt-5">
          <p className="nb-eyebrow text-[0.625rem] tracking-[0.16em] text-white/48">Built for</p>
          <p className="mt-2 text-sm text-white/65 leading-relaxed">
            {venture.audience.join(" · ")}
          </p>
        </div>
      )}
      {venture.capabilities && venture.capabilities.length > 0 && !compact && (
        <div className="mt-5">
          <p className="nb-eyebrow text-[0.625rem] tracking-[0.16em] text-white/48">
            Ecosystem includes
          </p>
          <ul className="mt-3 flex flex-wrap gap-2 list-none" aria-label="Platform capabilities">
            {venture.capabilities.map((cap) => (
              <li key={cap}>
                <Tag>{cap}</Tag>
              </li>
            ))}
          </ul>
          <p className="mt-3 nb-caption">
            Capabilities are rolling out over time—designed to support a connected aviation
            ecosystem.
          </p>
        </div>
      )}
      <span
        className={`inline-flex items-center gap-1 text-northbridge-red-text font-semibold ${
          compact ? "mt-5 text-sm" : "mt-6 text-sm"
        }`}
        aria-hidden={isComingSoon ? undefined : true}
      >
        {cta}
        {!isComingSoon && (
          <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
        )}
      </span>
    </>
  );

  if (isComingSoon) {
    return <div className={className}>{body}</div>;
  }

  const ariaLabel = `${venture.name}. ${venture.positioning ?? venture.description}`;

  if (isExternal) {
    return (
      <a
        href={venture.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        aria-label={ariaLabel}
      >
        {body}
      </a>
    );
  }

  return (
    <Link href={venture.href} className={className} aria-label={ariaLabel}>
      {body}
    </Link>
  );
}
