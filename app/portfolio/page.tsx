import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ventures | Northbridge Venture Group",
  description:
    "Our ventures: Aviator Network, AirTax Financial, and Northbridge Digital.",
};

const ventures = [
  {
    id: "aviator-network",
    name: "Aviator Network",
    category: "Aviation Technology",
    description:
      "Aviation technology platform connecting student pilots, flight instructors, and training opportunities.",
    domain: "aviatornetwork.com",
    href: "https://aviatornetwork.com",
    external: true,
  },
  {
    id: "airtax-financial",
    name: "AirTax Financial",
    category: "Financial Services",
    description:
      "Financial and tax services built for aviation professionals and specialized operators.",
    domain: "airtaxfinancial.com",
    href: "https://airtaxfinancial.com",
    external: true,
  },
  {
    id: "northbridge-digital",
    name: "Northbridge Digital",
    category: "Digital Infrastructure",
    description:
      "Professional digital systems, lead generation infrastructure, and brand development services designed to help businesses grow.",
    href: "/digital",
    external: false,
  },
];

const clients = [
  {
    id: "royal-international-flight-school",
    name: "Royal International Flight School",
    description:
      "Website and digital presence support for an aviation training organization.",
    domain: "royalinternationalflightschool.com",
    href: "https://www.royalinternationalflightschool.com/",
  },
];

export default function PortfolioPage() {
  return (
    <main className="pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6 bg-black min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white mb-4">
          Ventures
        </h1>
        <p className="text-base sm:text-lg text-silver mb-10 sm:mb-14 max-w-2xl leading-relaxed">
          Our portfolio of companies and digital capabilities across aviation,
          financial services, and digital infrastructure.
        </p>

        <section className="mb-14 sm:mb-20">
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-6 sm:mb-8">
            Our Companies
          </h2>
          <div className="space-y-6 sm:space-y-8">
            {ventures.map((venture) => (
              <article
                key={venture.id}
                id={venture.id}
                className="pb-8 sm:pb-10 border-b border-white/10 last:border-0 last:pb-0"
              >
                <span className="text-xs font-medium uppercase tracking-wider text-red">
                  {venture.category}
                </span>
                <div className="mt-2">
                  {venture.external ? (
                    <a
                      href={venture.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xl sm:text-2xl font-semibold text-white hover:text-red transition-colors"
                    >
                      {venture.name}
                    </a>
                  ) : (
                    <Link
                      href={venture.href}
                      className="text-xl sm:text-2xl font-semibold text-white hover:text-red transition-colors"
                    >
                      {venture.name}
                    </Link>
                  )}
                </div>
                {venture.domain && (
                  <p className="text-silver text-sm mt-1">{venture.domain}</p>
                )}
                <p className="mt-4 text-silver max-w-2xl leading-relaxed">
                  {venture.description}
                </p>
                {venture.external ? (
                  <a
                    href={venture.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-5 text-sm font-medium text-red hover:text-red-hover transition-colors"
                  >
                    Visit site →
                  </a>
                ) : (
                  <Link
                    href={venture.href}
                    className="inline-block mt-5 text-sm font-medium text-red hover:text-red-hover transition-colors"
                  >
                    Learn more →
                  </Link>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="pt-2">
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-4">
            Clients
          </h2>
          <p className="text-silver text-sm sm:text-base mb-6 max-w-2xl leading-relaxed">
            Organizations we support with digital infrastructure, brand
            development, and strategic systems.
          </p>
          <div className="flex flex-col gap-6 max-w-2xl">
            {clients.map((client) => (
              <a
                key={client.id}
                href={client.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-6 sm:p-8 border border-white/5 bg-slate/50 hover:border-white/10 transition-colors"
              >
                <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-silver/70">
                  Selected Client
                </span>
                <h3 className="mt-2 text-xl font-semibold text-white">
                  {client.name}
                </h3>
                <p className="text-silver text-sm mt-1">{client.domain}</p>
                <p className="mt-4 text-silver text-sm leading-relaxed">
                  {client.description}
                </p>
                <span className="mt-5 inline-block text-sm font-medium text-red hover:text-red-hover transition-colors">
                  Visit site →
                </span>
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
