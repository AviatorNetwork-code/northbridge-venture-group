import Link from "next/link";
import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CTABand } from "@/components/ui/CTABand";
import { DIAGNOSTIC_CTA } from "@/lib/digital/metadata";
import { northbridgeDigitalServices } from "@/lib/northbridge-digital-services";
import { siteMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = siteMetadata({
  title: "Northbridge Digital",
  description:
    "When the right solution does not exist off the shelf, Northbridge Digital designs and builds the systems your organization actually needs.",
  path: "/northbridge-digital",
  openGraphTitle: "Northbridge Digital",
});

export default function NorthbridgeDigitalPage() {
  return (
    <div className="nb-page">
      <Section variant="hero">
        <PageHeader
          eyebrow="Northbridge Digital"
          title="When the right solution doesn't exist"
          description={
            <>
              <p>
                Most operational challenges can be addressed with process improvement, adapted
                business solutions, and better use of existing tools. But sometimes the answer
                requires systems designed specifically for how your organization works.
              </p>
              <p className="mt-4">
                Northbridge Digital designs and builds what your business actually needs—engaged
                after the problem is understood, not as a default starting point.
              </p>
            </>
          }
        />
      </Section>

      <Section variant="band">
        <SectionHeader
          eyebrow="Relationship to Business Solutions"
          title="Solutions first. Custom build when required."
          description="Many businesses start with a Northbridge business solution. When the answer requires software built for your operations, Northbridge Digital carries the implementation."
        />
        <div className="mt-8">
          <ButtonLink href="/solutions" variant="secondary">
            Explore Business Solutions
          </ButtonLink>
        </div>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Implementation"
          title="What Northbridge Digital delivers"
          description="Each engagement is scoped to your workflow, team, and constraints—not a generic package. Capabilities below reflect how we build once the business case is clear."
        />
        <div className="nb-section-body nb-card-grid-2">
          {northbridgeDigitalServices.map((service) => (
            <article key={service.name} className="nb-card p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-white">{service.name}</h3>
              <p className="mt-3 nb-body">{service.description}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section variant="band">
        <SectionHeader
          eyebrow="Knowledge base"
          title="Deeper resources"
          description="Industry context, expertise articles, and the Business Diagnostic remain available for operators who want to explore before engaging."
        />
        <ul className="mt-8 space-y-3 text-sm list-none">
          <li>
            <Link href="/services" className="text-white/70 hover:text-northbridge-red transition-colors">
              Knowledge hub →
            </Link>
          </li>
          <li>
            <Link
              href="/services/expertise"
              className="text-white/70 hover:text-northbridge-red transition-colors"
            >
              Expertise library →
            </Link>
          </li>
          <li>
            <Link href="/insights" className="text-white/70 hover:text-northbridge-red transition-colors">
              Insights →
            </Link>
          </li>
        </ul>
      </Section>

      <Section variant="tight">
        <CTABand
          eyebrow="Next step"
          title="Ready to scope a custom system?"
          description="Start with the Business Diagnostic to map your operations—or contact us directly if you already know a custom build is required."
          primaryHref="/digital/assessment"
          primaryLabel={DIAGNOSTIC_CTA}
        />
      </Section>
    </div>
  );
}
