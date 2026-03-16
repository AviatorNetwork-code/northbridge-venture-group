import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ventures | Northbridge Venture Group",
  description:
    "Ventures within the Northbridge ecosystem, including Aviator Network and AirTax Financial.",
};

const ventures = [
  {
    id: "aviator-network",
    name: "Aviator Network",
    category: "Northbridge Venture · Aviation Technology",
    description:
      "Digital marketplace connecting pilots and flight instructors through structured profiles, messaging, and operational tools.",
    domain: "aviatornetwork.com",
    href: "https://aviatornetwork.com",
  },
  {
    id: "airtax-financial",
    name: "AirTax Financial",
    category: "Northbridge Venture · Financial Services",
    description:
      "Financial and tax services built for aviation professionals and specialized service businesses.",
    domain: "airtaxfinancial.com",
    href: "https://airtaxfinancial.com",
  },
  {
    id: "northbridge-digital",
    name: "Northbridge Digital",
    category: "Service Line · Digital Infrastructure",
    description:
      "Digital infrastructure and platform development services offered by Northbridge for organizations, founders, and operators.",
    href: "/services",
  },
];

export default function VenturesPage() {
  return (
    <main className="pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6 bg-black min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white mb-4">
          Ventures
        </h1>
        <p className="text-base sm:text-lg text-silver mb-10 sm:mb-14 max-w-2xl leading-relaxed">
          Ventures and service lines developed within the Northbridge ecosystem
          across aviation and financial services.
        </p>

        <section>
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-6 sm:mb-8">
            Our Ventures
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
                <h3 className="mt-2 text-xl sm:text-2xl font-semibold text-white">
                  {venture.name}
                </h3>
                {venture.domain && (
                  <p className="text-silver text-sm mt-1">{venture.domain}</p>
                )}
                <p className="mt-4 text-silver max-w-2xl leading-relaxed">
                  {venture.description}
                </p>
                <a
                  href={venture.href}
                  target={venture.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    venture.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="inline-block mt-5 text-sm font-medium text-red hover:text-red-hover transition-colors"
                >
                  {venture.href.startsWith("http")
                    ? "Visit site →"
                    : "Explore services →"}
                </a>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
