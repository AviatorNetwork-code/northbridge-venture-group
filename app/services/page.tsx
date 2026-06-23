import Link from "next/link";
import type { Metadata } from "next";
import { CTABand } from "@/components/ui/CTABand";
import { HubCard } from "@/components/ui/HubCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { digitalSolutions } from "@/lib/digital-solutions";
import { industries } from "@/lib/digital/industries";
import { expertiseAreas } from "@/lib/digital/expertise";
import { digitalPageMetadata, DIAGNOSTIC_CTA } from "@/lib/digital/metadata";

export const metadata: Metadata = digitalPageMetadata({
  title: "Knowledge Hub",
  description:
    "Northbridge Digital knowledge hub—industries, expertise, and practical guidance for businesses improving operations and growth.",
  path: "/services",
});

const hubCards = [
  {
    href: "/services",
    title: "Knowledge",
    description:
      "How businesses improve acquisition, operations, and visibility—written for operators, not technologists.",
    cta: "You are here",
    index: "01",
  },
  {
    href: "/services/industries",
    title: "Industries",
    description:
      "Sector context for aviation, HVAC, construction, professional services, and logistics.",
    cta: "View industries",
    index: "02",
  },
  {
    href: "/services/expertise",
    title: "Expertise",
    description:
      "Problem areas we understand deeply—from pipeline clarity to workflow design and reporting.",
    cta: "View expertise",
    index: "03",
  },
  {
    href: "/digital/assessment",
    title: "Business Diagnostic",
    description:
      "Map how your business operates today and identify where improvement should start.",
    cta: DIAGNOSTIC_CTA,
    index: "04",
  },
];

export default function Services() {
  return (
    <div className="nb-page">
      <Section variant="hero" containerClassName="max-w-4xl">
        <PageHeader
          eyebrow="Northbridge Digital"
          title="Knowledge for operators who need clarity"
          description="Find what is blocking growth. Understand how your business works. Design a better way to operate—and measure what changes."
        >
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <Link href="/digital/assessment" className="btn-primary">
              {DIAGNOSTIC_CTA}
            </Link>
            <Link href="/contact" className="btn-secondary">
              Speak with Northbridge
            </Link>
          </div>
        </PageHeader>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Navigate"
          title="Four ways to engage with Northbridge Digital"
          description="Start with context that matches your business—or go directly to the Business Diagnostic."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {hubCards.map((card) => (
            <HubCard key={card.title} {...card} />
          ))}
        </div>
      </Section>

      <Section variant="band">
        <SectionHeader
          eyebrow="Focus areas"
          title="What does your business need most?"
          description="Select the area closest to your situation. The Business Diagnostic maps your context to a practical starting point."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {digitalSolutions.map((solution) => (
            <Link
              key={solution.need}
              href={`/digital/assessment?need=${solution.need}`}
              className="nb-hub-card group"
            >
              <h3 className="nb-hub-card-title">{solution.title}</h3>
              <p className="nb-hub-card-desc">{solution.description}</p>
              <span className="nb-hub-card-cta">
                {DIAGNOSTIC_CTA}
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Index"
          title="Browse by industry and expertise"
        />
        <div className="mt-12 grid gap-12 lg:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-white/40">
              Industries
            </h3>
            <ul className="mt-5 divide-y divide-white/[0.06] border-y border-white/[0.06]">
              {industries.map((industry) => (
                <li key={industry.slug}>
                  <Link
                    href={`/services/industries/${industry.slug}`}
                    className="flex items-center justify-between py-4 text-white/70 transition-colors hover:text-white group"
                  >
                    <span className="font-medium">{industry.name}</span>
                    <span
                      className="text-northbridge-red opacity-0 transition-opacity group-hover:opacity-100"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-white/40">
              Expertise
            </h3>
            <ul className="mt-5 divide-y divide-white/[0.06] border-y border-white/[0.06]">
              {expertiseAreas.map((area) => (
                <li key={area.slug}>
                  <Link
                    href={`/services/expertise/${area.slug}`}
                    className="flex items-center justify-between py-4 text-white/70 transition-colors hover:text-white group"
                  >
                    <span className="font-medium">{area.name}</span>
                    <span
                      className="text-northbridge-red opacity-0 transition-opacity group-hover:opacity-100"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section variant="tight">
        <CTABand
          title="Understand your fit in minutes"
          description="The Business Diagnostic captures your profile, priorities, and constraints. Northbridge reviews your responses and recommends the best path forward."
          primaryHref="/digital/assessment"
          primaryLabel={DIAGNOSTIC_CTA}
          secondaryHref="/contact"
          secondaryLabel="Speak with Northbridge"
        />
      </Section>
    </div>
  );
}
