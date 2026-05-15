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
    <article className="p-8 rounded-xl border border-black/10 bg-white">
      <h2 className="text-2xl font-bold text-northbridge-black">{client.name}</h2>
      {client.location && (
        <p className="mt-2 text-sm font-medium text-black/70">{client.location}</p>
      )}
      {client.category && (
        <p className="mt-1 text-sm font-semibold text-northbridge-red">{client.category}</p>
      )}
      <p className="mt-3 text-black/80 leading-relaxed">{client.description}</p>
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
