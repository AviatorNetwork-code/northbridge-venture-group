import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Northbridge Digital | Northbridge Venture Group",
  description:
    "Premium website design and digital infrastructure for businesses and specialized service brands.",
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
    <main className="pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-charcoal mb-4">
          Northbridge Digital
        </h1>
        <p className="text-xl text-stone mb-20">
          Website and digital infrastructure for businesses built to last.
        </p>

        {/* Overview */}
        <section className="mb-20">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-silver mb-4">
            Overview
          </h2>
          <p className="text-stone leading-relaxed mb-4">
            Northbridge Digital is the digital capability of Northbridge Venture
            Group. We help businesses and specialized service brands establish
            professional digital infrastructure—websites, landing pages, lead
            systems, and brand presence—with the same discipline and
            long-term orientation we bring to our portfolio companies.
          </p>
          <p className="text-stone leading-relaxed">
            This is not template work. We design and build digital assets that
            reflect your positioning and support scalable growth.
          </p>
        </section>

        {/* Who It Helps */}
        <section className="mb-20">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-silver mb-4">
            Who It Helps
          </h2>
          <p className="text-stone leading-relaxed">
            Business owners, professional services firms, and specialized brands
            who need a credible digital presence and infrastructure that can
            evolve with their growth. Clients who value clarity, quality, and
            strategic alignment over quick fixes.
          </p>
        </section>

        {/* Services Offered */}
        <section className="mb-20">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-silver mb-4">
            Services Offered
          </h2>
          <ul className="space-y-2">
            {services.map((service) => (
              <li key={service} className="flex gap-3 text-stone">
                <span className="text-silver">—</span>
                <span>{service}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Why Northbridge */}
        <section className="mb-20">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-silver mb-4">
            Why Northbridge
          </h2>
          <p className="text-stone leading-relaxed mb-4">
            Northbridge Venture Group builds and operates businesses across
            aviation and financial services. We understand what it takes to run
            a serious organization and to present it credibly. Northbridge
            Digital applies that same standard to digital infrastructure.
          </p>
          <p className="text-stone leading-relaxed">
            You work with a holding company that has operational skin in the
            game—not an agency. We prioritize clarity, maintainability, and
            long-term value.
          </p>
        </section>

        {/* Contact CTA */}
        <section className="pt-12 border-t border-charcoal/10">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-silver mb-4">
            Get in Touch
          </h2>
          <p className="text-stone mb-8">
            For website and digital infrastructure projects, reach out to discuss
            your needs.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 text-sm font-medium bg-charcoal text-cream hover:bg-slate transition-colors"
          >
            Contact Us
          </Link>
        </section>
      </div>
    </main>
  );
