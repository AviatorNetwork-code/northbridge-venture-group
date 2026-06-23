import Link from "next/link";
import type { Venture } from "@/lib/ventures";

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
    (isComingSoon ? "Coming Soon" : isExternal ? externalCta(venture.href) : "Learn More →");
  const className = `block ${isComingSoon ? "nb-card opacity-90" : "nb-card-interactive"} ${compact ? "p-6" : "p-8"}`;

  const body = (
    <>
      {venture.category && (
        <p className="text-sm font-semibold text-northbridge-red">{venture.category}</p>
      )}
      <h2
        className={`font-bold text-white ${venture.category ? "mt-2" : ""} ${
          compact ? "text-xl" : "text-2xl"
        }`}
      >
        {venture.name}
      </h2>
      {venture.positioning && !compact && (
        <p className="mt-2 text-sm text-white/60 italic">{venture.positioning}</p>
      )}
      <p className={`text-white/70 ${compact ? "mt-2 text-sm" : "mt-3"}`}>
        {venture.description}
      </p>
      {venture.capabilities && venture.capabilities.length > 0 && !compact && (
        <ul className="mt-5 flex flex-wrap gap-2 list-none">
          {venture.capabilities.map((cap) => (
            <li
              key={cap}
              className="rounded-md border border-white/10 bg-northbridge-black/40 px-2.5 py-1 text-xs font-medium text-white/80"
            >
              {cap}
            </li>
          ))}
        </ul>
      )}
      <span className={`inline-block text-northbridge-red font-semibold ${compact ? "mt-3 text-sm" : "mt-4"}`}>
        {cta}
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
