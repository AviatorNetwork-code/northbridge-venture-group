import Link from "next/link";

const ventures = [
  {
    name: "Aviator Network",
    role: "Northbridge Venture",
    description:
      "Marketplace platform connecting pilots and flight instructors through a structured digital ecosystem.",
    bullets: [
      "instructor and student profiles",
      "marketplace search and filtering",
      "messaging system",
      "digital logbook",
      "wallet and credit system",
      "admin dashboards",
    ],
    href: "https://aviatornetwork.com",
  },
  {
    name: "AirTax Financial",
    role: "Northbridge Venture",
    description:
      "Financial and tax services designed for aviation professionals and specialized service businesses.",
    href: "https://airtaxfinancial.com",
  },
  {
    name: "Northbridge Digital",
    role: "Service Line",
    description:
      "Digital infrastructure and platform development services for businesses, founders, and organizations.",
    href: "/services",
  },
];

const systemsWeBuild = [
  "marketplace platforms",
  "SaaS tools",
  "business websites",
  "automation systems",
  "analytics tools",
  "mobile applications",
  "client acquisition systems",
  "internal dashboards",
];

const industryFocus = [
  "Aviation",
  "Financial Services",
  "Transportation",
  "Professional Services",
];

const clients = [
  {
    name: "Royal International Flight School",
    description:
      "Website and digital presence support for an aviation training organization.",
    domain: "royalinternationalflightschool.com",
    href: "https://www.royalinternationalflightschool.com/",
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white max-w-4xl leading-[1.12]">
            Building Digital Platforms and Infrastructure for Modern Industries
          </h1>
          <p className="mt-4 sm:mt-5 text-base sm:text-lg md:text-xl text-silver max-w-2xl leading-relaxed">
            Northbridge Venture Group develops digital platforms, infrastructure
            systems, and new ventures designed to help industries operate more
            efficiently and unlock new opportunities.
          </p>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:max-w-none">
            <Link
              href="/portfolio"
              className="w-full sm:w-auto flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 text-sm font-medium bg-red text-white hover:bg-red-hover transition-colors"
            >
              Explore Ventures
            </Link>
            <Link
              href="/services"
              className="w-full sm:w-auto flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 text-sm font-medium border border-white/25 text-white hover:border-white/50 hover:bg-white/5 transition-colors"
            >
              View Services
            </Link>
          </div>
        </div>
      </section>

      {/* Ventures */}
      <section className="px-4 sm:px-6 py-14 sm:py-20 md:py-24 bg-black border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-12">
            <div>
              <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-1">
                Ventures
              </h2>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white">
                Platforms in the Northbridge Ecosystem
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
              <div
                key={venture.name}
                className="flex flex-col p-5 sm:p-6 border border-white/10 hover:border-white/20 transition-colors min-h-[190px] sm:min-h-[210px] bg-black"
              >
                <span className="text-xs font-medium uppercase tracking-wider text-red">
                  {venture.role}
                </span>
                <h4 className="mt-2 text-lg sm:text-xl font-semibold text-white">
                  {venture.name}
                </h4>
                <p className="mt-2 text-sm text-silver leading-relaxed flex-grow">
                  {venture.description}
                </p>
                <div className="mt-4">
                  <Link
                    href={venture.href}
                    className="text-xs font-medium text-red hover:text-red-hover transition-colors underline underline-offset-4"
                    target={venture.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      venture.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                  >
                    {venture.name === "Northbridge Digital"
                      ? "Explore services →"
                      : "Visit platform →"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Systems We Build */}
      <section className="px-4 sm:px-6 py-14 sm:py-20 md:py-24 bg-slate border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-2">
            Systems We Build
          </h2>
          <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-6 sm:mb-8 max-w-3xl">
            Northbridge develops digital systems designed to help organizations
            launch, operate, and grow.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {systemsWeBuild.map((item) => (
              <div
                key={item}
                className="px-4 py-3 sm:py-3.5 border border-white/10 bg-black/40 text-sm text-silver"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Focus */}
      <section className="px-4 sm:px-6 py-14 sm:py-20 md:py-24 bg-black border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-2">
            Industry Focus
          </h2>
          <p className="text-lg sm:text-xl text-white mb-6 sm:mb-8 max-w-3xl leading-relaxed">
            Northbridge has strong experience supporting organizations in
            industries where digital infrastructure plays a critical role.
          </p>
          <div className="flex flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8">
            {industryFocus.map((industry) => (
              <span
                key={industry}
                className="px-4 py-2 border border-white/15 text-sm text-silver"
              >
                {industry}
              </span>
            ))}
          </div>
          <p className="text-silver text-sm sm:text-base max-w-3xl leading-relaxed">
            While Northbridge has strong familiarity in these sectors, systems
            can also be adapted for other industries with clearly defined
            operational models and requirements.
          </p>
        </div>
      </section>

      {/* Example Platform – Aviator Network */}
      <section className="px-4 sm:px-6 py-14 sm:py-20 md:py-24 bg-slate border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-2">
            Example Platform
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 items-start">
            <div>
              <h3 className="text-2xl sm:text-3xl font-semibold text-white mb-2">
                Aviator Network
              </h3>
              <p className="text-silver text-sm sm:text-base mb-4">
                Aviator Network is a digital marketplace platform developed
                within the Northbridge ecosystem to connect pilots and flight
                instructors.
              </p>
              <p className="text-silver text-sm sm:text-base mb-4">
                The platform demonstrates Northbridge&apos;s ability to design,
                build, and operate software that goes beyond brochure
                websites—supporting real users, transactions, and operational
                workflows.
              </p>
              <Link
                href="https://aviatornetwork.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm font-medium text-red hover:text-red-hover transition-colors underline underline-offset-4"
              >
                Visit Aviator Network →
              </Link>
            </div>
            <div className="border border-white/10 bg-black/40 p-5 sm:p-6">
              <h4 className="text-sm font-semibold text-white mb-3">
                Selected Capabilities
              </h4>
              <ul className="space-y-2 text-sm text-silver">
                <li>• user profiles</li>
                <li>• marketplace search and filtering</li>
                <li>• messaging system</li>
                <li>• digital logbook</li>
                <li>• wallet and credit system</li>
                <li>• admin dashboards</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Clients */}
      <section className="px-4 sm:px-6 py-14 sm:py-20 md:py-24 bg-black border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-1.5">
            Clients
          </h2>
          <h3 className="text-2xl sm:text-3xl font-semibold text-white mb-3">
            Organizations We Support
          </h3>
          <p className="text-silver text-sm sm:text-base mb-6 max-w-2xl leading-relaxed">
            Organizations that have worked with Northbridge on digital
            infrastructure, online presence, and operational systems.
          </p>
          <div className="flex flex-col gap-4 sm:gap-5 max-w-2xl">
            {clients.map((client) => (
              <a
                key={client.name}
                href={client.href}
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

      {/* Services CTA */}
      <section className="px-4 sm:px-6 py-14 sm:py-20 md:py-24 bg-slate border-t border-white/5">
        <div className="max-w-3xl mx-auto text-left">
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-2">
            Services
          </h2>
          <h3 className="text-2xl sm:text-3xl font-semibold text-white mb-3">
            Digital Infrastructure Services
          </h3>
          <p className="text-silver text-sm sm:text-base mb-6 leading-relaxed">
            Northbridge supports businesses and organizations through professional
            digital infrastructure services, including website development,
            automation systems, online presence setup, and mobile application
            support.
          </p>
          <Link
            href="/services"
            className="inline-flex items-center px-8 py-3.5 text-sm font-medium bg-red text-white hover:bg-red-hover transition-colors"
          >
            Explore Services
          </Link>
        </div>
      </section>

      {/* Consultation CTA */}
      <section className="px-4 sm:px-6 py-14 sm:py-20 md:py-24 bg-black border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-3 sm:mb-4">
            Discuss Your Project
          </h3>
          <p className="text-silver text-sm sm:text-base mb-6 sm:mb-8 leading-relaxed">
            Organizations, operators, and founders interested in working with
            Northbridge can request an initial consultation to discuss their
            project requirements.
          </p>
          <Link
            href="/contact"
            className="inline-flex w-full sm:w-auto items-center justify-center px-8 py-3.5 sm:py-4 text-sm font-medium bg-red text-white hover:bg-red-hover transition-colors"
          >
            Request Consultation
          </Link>
        </div>
      </section>
    </main>
  );
}
