import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Northbridge Digital | Northbridge Venture Group",
  description:
    "Professional digital systems, lead generation infrastructure, and brand development services designed to help businesses grow.",
};

const services = [
  "Website design and development",
  "Landing pages and conversion-focused experiences",
  "Lead capture and nurturing systems",
  "Brand presence setup and positioning",
  "Digital growth infrastructure",
];

export default function DigitalPage() {
  return (
    <main className="pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6 bg-black min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white mb-4">
          Northbridge Digital
        </h1>
        <p className="text-base sm:text-lg text-silver mb-12 sm:mb-16 leading-relaxed">
          Professional digital systems, lead generation infrastructure, and brand
          development services designed to help businesses grow.
        </p>

        {/* Overview */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-4">
            Overview
          </h2>
          <p className="text-silver leading-relaxed mb-4 text-sm sm:text-base">
            Northbridge Digital is the digital capability of Northbridge Venture
            Group. We help businesses and specialized service brands establish
            professional digital infrastructure—websites, landing pages, lead
            systems, and brand presence—with the same discipline and long-term
            orientation we bring to our portfolio companies.
          </p>
          <p className="text-silver leading-relaxed text-sm sm:text-base">
            This is not template work. We design and build digital assets that
            reflect your positioning and support scalable growth.
          </p>
        </section>

        {/* Who It Helps */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-4">
            Who It Helps
          </h2>
          <p className="text-silver leading-relaxed text-sm sm:text-base">
            Business owners, professional services firms, and specialized brands
            who need a credible digital presence and infrastructure that can
            evolve with their growth. Clients who value clarity, quality, and
            strategic alignment over quick fixes.
          </p>
        </section>

        {/* Services Offered */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-4">
            Services Offered
          </h2>
          <ul className="space-y-2">
            {services.map((service) => (
              <li
                key={service}
                className="flex gap-3 text-silver text-sm sm:text-base"
              >
                <span className="text-red shrink-0">—</span>
                <span>{service}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Why Northbridge */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-4">
            Why Northbridge
          </h2>
          <p className="text-silver leading-relaxed mb-4 text-sm sm:text-base">
            Northbridge Venture Group builds and operates businesses across
            aviation, financial services, and digital infrastructure. We
            understand what it takes to run a serious organization and to
            present it credibly. Northbridge Digital applies that same standard
            to digital infrastructure.
          </p>
          <p className="text-silver leading-relaxed text-sm sm:text-base">
            You work with a venture group that has operational skin in the
            game—not an agency. We prioritize clarity, maintainability, and
            long-term value.
          </p>
        </section>

        {/* Contact CTA */}
        <section className="pt-10 sm:pt-12 border-t border-white/10">
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-4">
            Get in Touch
          </h2>
          <p className="text-silver mb-6 sm:mb-8 text-sm sm:text-base">
            For website and digital infrastructure projects, reach out to discuss
            your needs.
          </p>
          <Link
            href="/contact"
            className="inline-flex w-full sm:w-auto items-center justify-center px-8 py-3.5 text-sm font-medium bg-red text-white hover:bg-red-hover transition-colors"
          >
            Contact Us
          </Link>
        </section>
      </div>
    </main>
  );
}
