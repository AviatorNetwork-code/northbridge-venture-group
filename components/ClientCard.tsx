import type { Client } from "@/lib/clients";
import { Tag } from "@/components/ui/Tag";
import { ArrowLink } from "@/components/ui/ArrowLink";

function websiteLabel(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function ClientCard({ client }: { client: Client }) {
  return (
    <article className="nb-card h-full flex flex-col">
      {client.category && <p className="nb-eyebrow text-[0.65rem]">{client.category}</p>}
      <h2 className={`text-xl font-semibold text-white ${client.category ? "mt-3" : ""}`}>
        {client.name}
      </h2>
      {client.location && (
        <p className="mt-1.5 text-sm text-white/45">{client.location}</p>
      )}
      <p className="mt-3 flex-1 text-white/60 leading-relaxed text-sm sm:text-base">
        {client.description}
      </p>
      {client.capabilities && client.capabilities.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-2 list-none">
          {client.capabilities.map((cap) => (
            <li key={cap}>
              <Tag>{cap}</Tag>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-5 flex flex-col gap-2">
        {client.website && (
          <a
            href={client.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-northbridge-red-text underline-offset-2 hover:text-white hover:underline transition-colors"
          >
            {websiteLabel(client.website)} →
          </a>
        )}
        {client.caseStudyHref && (
          <ArrowLink href={client.caseStudyHref} className="text-sm">
            View client project
          </ArrowLink>
        )}
      </div>
    </article>
  );
}
