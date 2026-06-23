import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { HubCard } from "@/components/ui/HubCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { digitalSolutions } from "@/lib/digital-solutions";
import { DIAGNOSTIC_CTA, digitalPageMetadata } from "@/lib/digital/metadata";

export const metadata: Metadata = digitalPageMetadata({
  title: "Northbridge Digital",
  description:
    "Northbridge Digital helps businesses find what is blocking growth—customer acquisition, operations, visibility, and custom systems.",
  path: "/digital",
});

export default function DigitalPage() {
  return (
    <div className="nb-page">
      <Section variant="hero">
        <PageHeader
          eyebrow="Northbridge Digital"
          title="Operational clarity for businesses that have outgrown informal systems"
          description="We help leadership teams understand how work flows, where opportunities stall, and what to measure when processes change."
        >
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <ButtonLink href="/digital/assessment">{DIAGNOSTIC_CTA}</ButtonLink>
            <ButtonLink href="/services" variant="secondary">
              Knowledge hub
            </ButtonLink>
          </div>
        </PageHeader>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Explore"
          title="Industries and expertise"
          description="Context for your sector and the problem areas most relevant to your business."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          <HubCard
            href="/services/industries"
            title="Industries"
            description="Aviation, HVAC, construction, professional services, and logistics."
            cta="View industries"
            index="01"
          />
          <HubCard
            href="/services/expertise"
            title="Expertise"
            description="Acquisition, operations, intelligence, CRM, automation, AI, and custom software."
            cta="View expertise"
            index="02"
          />
        </div>
      </Section>

      <Section variant="band">
        <SectionHeader
          eyebrow="Focus areas"
          title="What does your business need most?"
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

      <Section variant="tight">
        <div className="nb-cta-band">
          <p className="nb-eyebrow">Next step</p>
          <h2 className="mt-4 nb-h3">Understand your fit in minutes</h2>
          <p className="mt-4 nb-body max-w-2xl">
            The Business Diagnostic captures your profile, priorities, and constraints. Northbridge
            reviews your responses and recommends the best path forward.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 sm:gap-4">
            <ButtonLink href="/digital/assessment">{DIAGNOSTIC_CTA}</ButtonLink>
            <ButtonLink href="/contact" variant="secondary">
              Speak with Northbridge
            </ButtonLink>
          </div>
          <div className="mt-8">
            <ArrowLink href="/services">Full knowledge hub</ArrowLink>
          </div>
        </div>
      </Section>
    </div>
  );
}
