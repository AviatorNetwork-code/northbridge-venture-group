import Link from "next/link";
import type { Client } from "@/lib/clients";

function websiteLabel(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function ClientCard({ client }: { client: Client }) {
  return (
    <article className="nb-card p-8">
      <h2 className="text-2xl font-bold text-white">{client.name}</h2>
      {client.location && (
        <p className="mt-2 text-sm font-medium text-white/60">{client.location}</p>
      )}
      {client.category && (
        <p className="mt-1 text-sm font-semibold text-northbridge-red">{client.category}</p>
      )}
      <p className="mt-3 text-white/70 leading-relaxed">{client.description}</p>
      {client.capabilities && client.capabilities.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-2 list-none">
          {client.capabilities.map((cap) => (
            <li
              key={cap}
              className="rounded-md border border-white/10 bg-northbridge-black/40 px-2.5 py-1 text-xs font-medium text-white/80"
            >
              {cap}
            </li>
          ))}
        </ul>
      )}
      {client.website && (
        <a
          href={client.website}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-sm font-semibold text-northbridge-red hover:underline"
        >
          {websiteLabel(client.website)} →
        </a>
      )}
      {client.caseStudyHref && (
        <Link
          href={client.caseStudyHref}
          className="mt-4 block text-sm font-semibold text-northbridge-red hover:underline"
        >
          View Case Study →
        </Link>
      )}
    </article>
  );
}
