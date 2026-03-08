import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Portfolio | Northbridge Venture Group",
  description:
    "Our portfolio companies and capabilities: Aviator Network, AirTax Financial, Royal Flight School, and Northbridge Digital.",
};

const portfolioCompanies = [
  {
    id: "aviator-network",
    name: "Aviator Network",
    tagline: "Aviation connectivity and services platform",
    description:
      "Aviator Network provides connectivity solutions and services for the aviation industry, enabling smoother operations and better communication across the ecosystem.",
  },
  {
    id: "airtax-financial",
    name: "AirTax Financial",
    tagline: "Financial solutions for aviation professionals",
    description:
      "AirTax Financial delivers specialized financial products and services tailored to the unique needs of aviation professionals and businesses.",
  },
  {
    id: "royal-flight-school",
    name: "Royal Flight School",
    tagline: "Premium flight training and certification",
    description:
      "Royal Flight School offers comprehensive flight training programs, certification, and education for aspiring and experienced aviators.",
  },
];

export default function PortfolioPage() {
  return (
    <main className="pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-charcoal mb-4">
          Portfolio
        </h1>
        <p className="text-xl text-stone max-w-2xl mb-20">
          Our portfolio of companies across aviation and financial technology,
          and our business capabilities.
        </p>
        <div className="space-y-16">
          {portfolioCompanies.map((company) => (
            <article
              key={company.id}
              id={company.id}
              className="border-b border-charcoal/10 pb-16"
            >
              <h2 className="text-2xl font-semibold text-charcoal mb-2">
                {company.name}
              </h2>
              <p className="text-silver text-sm mb-4">{company.tagline}</p>
              <p className="text-stone max-w-2xl">{company.description}</p>
            </article>
          ))}
        </div>
        <Link
          href="/digital"
          className="block pt-16 border-t border-charcoal/10 group"
        >
          <article id="northbridge-digital">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-silver mb-2">
              Business Capability
            </h3>
            <h2 className="text-2xl font-semibold text-charcoal mb-4 group-hover:text-stone transition-colors">
              Northbridge Digital
            </h2>
            <p className="text-stone max-w-2xl">
              Digital infrastructure and website development for businesses and
              specialized service brands.
            </p>
          </article>
        </Link>
      </div>
    </main>
  );
}
