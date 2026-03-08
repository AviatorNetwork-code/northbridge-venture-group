import Link from "next/link";

const industries = [
  "Aviation",
  "Financial Services",
  "Digital Infrastructure",
];

const whatWeBuild = [
  {
    title: "Customer Acquisition Systems",
    description: "Lead generation, demand capture, and customer connection systems.",
  },
  {
    title: "Market Intelligence & Analytics",
    description: "Data-driven insight for decisions, visibility, and strategic growth.",
  },
  {
    title: "Digital Infrastructure",
    description: "Platforms and operational systems that modernize industries.",
  },
  {
    title: "Financial Strategy & Advisory",
    description: "Financial planning, tax strategy, structuring, and operational clarity.",
  },
  {
    title: "Venture Development & Investments",
    description: "Launch, support, and scale ventures with strong positioning.",
  },
];

const ventures = [
  {
    name: "Aviator Network",
    category: "Aviation Technology",
    description:
      "Connecting student pilots, flight instructors, and training opportunities.",
    domain: "aviatornetwork.com",
    href: "https://aviatornetwork.com",
    cta: "Visit site",
    external: true,
  },
  {
    name: "AirTax Financial",
    category: "Financial Services",
    description:
      "Financial and tax services for aviation professionals and specialized operators.",
    domain: "airtaxfinancial.com",
    href: "https://airtaxfinancial.com",
    cta: "Visit site",
    external: true,
  },
  {
    name: "Northbridge Digital",
    category: "Digital Infrastructure",
    description:
      "Professional digital systems, lead generation infrastructure, and brand development for business growth.",
    domain: null,
    href: "/digital",
    cta: "Learn more",
    external: false,
  },
];

const clients = [
  {
    name: "International Flight School",
    description:
      "Website and digital presence support for an aviation training organization.",
    domain: "internationalflightschool.com",
  },
];

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative min-h-[78vh] sm:min-h-[85vh] flex flex-col justify-center px-4 sm:px-6 pt-24 sm:pt-28 md:pt-32 pb-14 sm:pb-20 md:pb-24 bg-black overflow-hidden">
        <div
          className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.6]"
          aria-hidden
        />
        <div className="relative max-w-6xl mx-auto w-full">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white max-w-3xl leading-[1.12]">
            Building Intelligent Systems for Modern Industries
          </h1>
          <p className="mt-4 sm:mt-5 text-base sm:text-lg md:text-xl text-silver max-w-xl leading-relaxed">
            Northbridge develops ventures, digital infrastructure, and strategic
            systems that generate demand, deliver insights, and support industry
            growth.
          </p>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:max-w-none">
            <Link
              href="/portfolio"
              className="w-full sm:w-auto flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 text-sm font-medium bg-red text-white hover:bg-red-hover transition-colors"
            >
              Explore Ventures
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 text-sm font-medium border border-white/25 text-white hover:border-white/50 hover:bg-white/5 transition-colors"
            >
              Partner With Northbridge
            </Link>
          </div>
        </div>
      </section>

      {/* Industries strip */}
      <section className="px-4 sm:px-6 py-6 sm:py-8 border-y border-white/10 bg-slate">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-10 md:gap-x-14 gap-y-2">
            {industries.map((industry) => (
              <span
                key={industry}
                className="text-xs sm:text-sm font-medium uppercase tracking-wider text-silver"
              >
                {industry}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="px-4 sm:px-6 py-14 sm:py-20 md:py-24 bg-black">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-4 sm:mb-5">
            About
          </h2>
          <p className="text-lg sm:text-xl text-white leading-relaxed mb-4">
            Northbridge Venture Group builds and supports businesses that create
            practical value across modern industries.
          </p>
          <p className="text-silver leading-relaxed text-sm sm:text-base">
            We focus on intelligent systems that improve how organizations
            generate leads, understand markets, operate financially, and scale
            through digital infrastructure. Our model combines venture
            development, analytics, customer acquisition systems, and strategic
            advisory to build companies positioned for long-term growth.
          </p>
        </div>
      </section>

      {/* What We Build */}
      <section className="px-4 sm:px-6 py-14 sm:py-20 md:py-24 bg-slate border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-1.5">
            What We Build
          </h2>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-8 sm:mb-12">
            Core Activity Pillars
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {whatWeBuild.map((item) => (
              <div
                key={item.title}
                className="relative pt-5 sm:pt-6 pb-5 sm:pb-6 px-5 sm:px-6 bg-black/50 border border-white/10 hover:border-white/15 transition-colors"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-px bg-red/80"
                  aria-hidden
                />
                <h4 className="text-base sm:text-lg font-semibold text-white mb-1.5 sm:mb-2">
                  {item.title}
                </h4>
                <p className="text-silver text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ventures */}
      <section className="px-4 sm:px-6 py-14 sm:py-20 md:py-24 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-12">
            <div>
              <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-1">
                Ventures
              </h2>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white">
                Our Companies
              </h3>
            </div>
            <Link
              href="/portfolio"
              className="text-sm font-medium text-red hover:text-red-hover transition-colors underline underline-offset-4 w-fit"
            >
              View all ventures →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {ventures.map((venture) => (
              <Link
                key={venture.name}
                href={venture.href}
                {...(venture.external && {
                  target: "_blank",
                  rel: "noopener noreferrer",
                })}
                className="group flex flex-col p-5 sm:p-6 border border-white/10 hover:border-white/20 transition-colors min-h-[180px] sm:min-h-[200px]"
              >
                <span className="text-xs font-medium uppercase tracking-wider text-red">
                  {venture.category}
                </span>
                <h4 className="mt-2 text-lg sm:text-xl font-semibold text-white group-hover:text-red transition-colors">
                  {venture.name}
                </h4>
                <p className="mt-2 text-sm text-silver leading-relaxed flex-grow">
                  {venture.description}
                </p>
                {venture.domain && (
                  <p className="mt-2 text-xs text-silver/70">{venture.domain}</p>
                )}
                <span className="mt-4 text-xs font-medium text-red group-hover:text-red-hover transition-colors">
                  {venture.cta} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Clients */}
      <section className="px-4 sm:px-6 py-14 sm:py-20 md:py-24 bg-slate border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-1.5">
            Clients
          </h2>
          <h3 className="text-2xl sm:text-3xl font-semibold text-white mb-6 sm:mb-8">
            Organizations We Support
          </h3>
          <div className="flex flex-col gap-4 sm:gap-5 max-w-2xl">
            {clients.map((client) => (
              <a
                key={client.name}
                href={`https://${client.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block p-5 sm:p-6 border border-white/5 bg-black/40 hover:border-white/10 transition-colors"
              >
                <span className="absolute top-4 right-4 text-[10px] sm:text-xs font-medium uppercase tracking-wider text-silver/70">
                  Selected Client
                </span>
                <h4 className="text-lg font-semibold text-white pr-24 group-hover:text-red transition-colors">
                  {client.name}
                </h4>
                <p className="mt-1.5 text-sm text-silver leading-relaxed">
                  {client.description}
                </p>
                <p className="mt-2 text-xs text-silver/70">{client.domain}</p>
                <span className="mt-4 inline-block text-xs font-medium text-red group-hover:text-red-hover transition-colors">
                  Visit site →
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="px-4 sm:px-6 py-14 sm:py-20 md:py-24 bg-black">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-4">
            Vision
          </h2>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-4 sm:mb-5">
            Built for Growth Across Industries
          </h3>
          <p className="text-silver leading-relaxed text-sm sm:text-base">
            We believe strong industries are built on better systems. Northbridge
            exists to develop ventures and infrastructure that improve demand
            generation, decision-making, and operational efficiency. By combining
            digital platforms, analytics, financial strategy, and execution, we
            help create businesses positioned for durable growth.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 py-14 sm:py-20 md:py-24 bg-red">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-3 sm:mb-4">
            Work With Northbridge
          </h3>
          <p className="text-white/90 text-sm sm:text-base mb-6 sm:mb-8 leading-relaxed">
            Northbridge partners with founders, operators, and organizations
            building stronger businesses through systems, data, and execution.
          </p>
          <Link
            href="/contact"
            className="inline-flex w-full sm:w-auto items-center justify-center px-8 py-3.5 sm:py-4 text-sm font-medium bg-white text-black hover:bg-white/90 transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </main>
  );
}
