import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clients | Northbridge Venture Group",
  description:
    "Organizations we support with digital infrastructure, brand development, and strategic systems.",
};

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

export default function ClientsPage() {
  return (
    <main className="pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6 bg-black min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white mb-4">
          Clients
        </h1>
        <p className="text-base sm:text-lg text-silver mb-10 sm:mb-14 max-w-2xl leading-relaxed">
          Organizations we support with digital infrastructure, brand
          development, and strategic systems.
        </p>

        <section>
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-6 sm:mb-8">
            Selected Clients
          </h2>
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
                <h3 className="mt-2 text-xl sm:text-2xl font-semibold text-white">
                  {client.name}
                </h3>
                <p className="text-silver text-sm mt-1">{client.domain}</p>
                <p className="mt-4 text-silver text-sm leading-relaxed max-w-xl">
                  {client.description}
                </p>
                <span className="mt-6 inline-block text-sm font-medium text-red hover:text-red-hover transition-colors">
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
