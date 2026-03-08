import Link from "next/link";

const portfolioCompanies = [
  {
    name: "Aviator Network",
    description:
      "Aviation connectivity and integrated services for operators, enabling reliable infrastructure and streamlined operations at scale.",
    href: "/portfolio#aviator-network",
  },
  {
    name: "AirTax Financial",
    description:
      "Specialized financial services and solutions for aviation professionals, built for clarity and long-term planning.",
    href: "/portfolio#airtax-financial",
  },
  {
    name: "Royal Flight School",
    description:
      "Flight training and certification delivered with precision, preparing aviators for careers built on rigor and excellence.",
    href: "/portfolio#royal-flight-school",
  },
];

export default function HomePage() {
  return (
    <main>
        {/* Hero Section */}
        <section className="min-h-[85vh] flex flex-col justify-center px-6 pt-32 pb-24">
          <div className="max-w-6xl mx-auto w-full">
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-charcoal max-w-3xl leading-[1.1]">
              Northbridge Venture Group
            </h1>
            <p className="mt-8 text-xl md:text-2xl text-stone max-w-2xl leading-relaxed">
              Northbridge Venture Group builds and supports focused ventures
              across aviation, financial services, and specialized business
              infrastructure.
            </p>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="px-6 py-24 bg-white/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-silver mb-4">
              Our Mission
            </h2>
            <p className="text-2xl md:text-3xl font-medium text-charcoal max-w-3xl leading-relaxed">
              We create and support businesses designed for long-term utility,
              operational clarity, and scalable value.
            </p>
          </div>
        </section>

        {/* Portfolio & Offerings */}
        <section className="px-6 py-24">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-silver mb-2">
                  Portfolio
                </h2>
                <h3 className="text-3xl md:text-4xl font-semibold text-charcoal">
                  Our Companies
                </h3>
              </div>
              <Link
                href="/portfolio"
                className="text-sm font-medium text-charcoal hover:text-stone transition-colors underline underline-offset-4"
              >
                View full portfolio →
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {portfolioCompanies.map((company) => (
                <Link
                  key={company.name}
                  href={company.href}
                  className="group block p-8 border border-charcoal/10 hover:border-charcoal/20 transition-colors"
                >
                  <h4 className="text-lg font-semibold text-charcoal group-hover:text-stone transition-colors">
                    {company.name}
                  </h4>
                  <p className="mt-2 text-sm text-silver">
                    {company.description}
                  </p>
                </Link>
              ))}
            </div>

            <Link
              href="/digital"
              className="mt-20 pt-20 border-t border-charcoal/10 block group"
            >
              <h3 className="text-sm font-semibold uppercase tracking-wider text-silver mb-2">
                Business Capability
              </h3>
              <h4 className="text-2xl md:text-3xl font-semibold text-charcoal mb-4 group-hover:text-stone transition-colors">
                Northbridge Digital
              </h4>
              <p className="text-stone max-w-2xl">
                Digital infrastructure and website development for businesses
                and specialized service brands.
              </p>
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-24 bg-charcoal text-cream">
          <div className="max-w-6xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-semibold mb-4">
              Get in touch
            </h3>
            <p className="text-silver max-w-xl mx-auto mb-8">
              We welcome partnership opportunities, strategic conversations, and
              inquiries. Reach out to begin a dialogue.
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-3 text-sm font-medium bg-cream text-charcoal hover:bg-white transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </main>
  );
}
