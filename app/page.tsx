import type { Metadata } from "next";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { HubCard } from "@/components/ui/HubCard";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ClientCard } from "@/components/ClientCard";
import { VentureCard } from "@/components/VentureCard";
import { clients } from "@/lib/clients";
import { DIAGNOSTIC_CTA } from "@/lib/digital/metadata";
import { ventures } from "@/lib/ventures";

export const metadata: Metadata = {
  title: "Home | Northbridge Venture Group",
  description:
    "Northbridge Venture Group builds ventures in aviation and financial services. Northbridge Digital advises operators on growth, operations, and business systems.",
  openGraph: {
    title: "Northbridge Venture Group",
    description:
      "Venture building and operational advisory for aviation, financial services, and growth-stage businesses.",
    type: "website",
  },
};

const trustPillars = [
  { label: "Focus", value: "Clarity, compliance, and long-term value" },
  { label: "Ventures", value: "Aviation and financial services platforms" },
  { label: "Advisory", value: "Northbridge Digital consulting arm" },
];

const digitalHub = [
  {
    href: "/services",
    title: "Knowledge",
    description:
      "Practical perspectives on how businesses improve acquisition, operations, and visibility.",
    cta: "Explore knowledge",
    index: "01",
  },
  {
    href: "/services/industries",
    title: "Industries",
    description:
      "Aviation, HVAC, construction, professional services, and logistics—context for where improvement starts.",
    cta: "View industries",
    index: "02",
  },
  {
    href: "/services/expertise",
    title: "Expertise",
    description:
      "What we understand about growth, operations, intelligence, CRM, automation, and custom systems.",
    cta: "View expertise",
    index: "03",
  },
  {
    href: "/digital/assessment",
    title: "Business Diagnostic",
    description:
      "A structured review of how your business operates—and what to improve first.",
    cta: DIAGNOSTIC_CTA,
    index: "04",
  },
];

export default function Home() {
  return (
    <div className="nb-page">
      <Section variant="hero">
        <div className="max-w-3xl nb-animate-in">
          <p className="nb-eyebrow">Northbridge Venture Group</p>
          <h1 className="mt-4 nb-h1 text-balance">
            Build ventures. Advise operators. Deliver clarity.
          </h1>
          <p className="mt-6 nb-lead max-w-2xl">
            We build and operate platforms in aviation and financial services—and help growth-stage
            businesses understand how they work, find what blocks progress, and design better ways to
            operate.
          </p>
          <div className="mt-10 nb-cta-group">
            <ButtonLink href="/services">Northbridge Digital</ButtonLink>
            <ButtonLink href="/ventures" variant="secondary">
              Our ventures
            </ButtonLink>
          </div>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-3 nb-animate-in nb-stagger-2">
          {trustPillars.map((pillar) => (
            <div key={pillar.label} className="nb-trust-item">
              <span className="nb-trust-label">{pillar.label}</span>
              <span className="nb-trust-value">{pillar.value}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Ventures"
          title="Northbridge-owned platforms"
          description="Products and platforms we build, operate, and scale—not client engagements."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ventures.map((venture) => (
            <VentureCard key={venture.name} venture={venture} compact />
          ))}
        </div>
        <div className="mt-10">
          <ArrowLink href="/ventures">View all ventures</ArrowLink>
        </div>
      </Section>

      <Section variant="band">
        <SectionHeader
          eyebrow="Northbridge Digital"
          title="Operational advisory for businesses that need clarity"
          description="Not a software agency. Not an AI shop. We help leadership teams understand how work flows, where margin leaks, and what to measure when things change."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {digitalHub.map((item) => (
            <HubCard
              key={item.href}
              href={item.href}
              title={item.title}
              description={item.description}
              cta={item.cta}
              index={item.index}
            />
          ))}
        </div>
        <div className="mt-10 nb-cta-group sm:items-center">
          <ButtonLink href="/digital/assessment">{DIAGNOSTIC_CTA}</ButtonLink>
          <ArrowLink href="/services" className="sm:min-h-[2.75rem] sm:inline-flex sm:items-center">
            Full knowledge hub
          </ArrowLink>
        </div>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Clients"
          title="Organizations we support"
          description="Businesses that have worked with Northbridge on operational systems, online presence, and growth infrastructure."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {clients.map((client) => (
            <ClientCard key={client.name} client={client} />
          ))}
        </div>
        <div className="mt-10">
          <ArrowLink href="/clients">View all clients</ArrowLink>
        </div>
      </Section>

      <Section variant="tight">
        <div className="nb-cta-band">
          <p className="nb-eyebrow">Work with Northbridge</p>
          <h2 className="mt-4 nb-h3 max-w-xl">Ready to understand what is blocking growth?</h2>
          <p className="mt-4 nb-body max-w-2xl">
            Start with the Business Diagnostic or contact us to discuss venture partnerships and
            advisory engagements.
          </p>
          <div className="mt-8 nb-cta-group">
            <ButtonLink href="/digital/assessment">{DIAGNOSTIC_CTA}</ButtonLink>
            <ButtonLink href="/contact" variant="secondary">
              Contact us
            </ButtonLink>
          </div>
        </div>
      </Section>
    </div>
  );
}
