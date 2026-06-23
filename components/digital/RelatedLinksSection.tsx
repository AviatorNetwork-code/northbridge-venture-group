import Link from "next/link";

type RelatedLink = {
  label: string;
  href: string;
};

type RelatedLinksSectionProps = {
  title: string;
  links: RelatedLink[];
};

export function RelatedLinksSection({ title, links }: RelatedLinksSectionProps) {
  if (links.length === 0) return null;

  return (
    <section className="mt-16 sm:mt-20">
      <h2 className="nb-h3">{title}</h2>
      <div className="mt-6 flex flex-wrap gap-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-md border border-white/10 px-4 py-2 text-sm font-medium text-white/75 transition-colors hover:border-northbridge-red/40 hover:text-white"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
