import Link from "next/link";

type HubCardProps = {
  href: string;
  title: string;
  description: string;
  cta?: string;
  index?: string;
};

export function HubCard({ href, title, description, cta = "Explore", index }: HubCardProps) {
  return (
    <Link
      href={href}
      className="nb-hub-card group"
      aria-label={`${title}: ${cta}`}
    >
      {index && (
        <span className="nb-hub-card-index" aria-hidden="true">
          {index}
        </span>
      )}
      <h3 className="nb-hub-card-title">{title}</h3>
      <p className="nb-hub-card-desc">{description}</p>
      <span className="nb-hub-card-cta" aria-hidden="true">
        {cta}
        <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
      </span>
    </Link>
  );
}
