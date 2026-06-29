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
    "Northbridge Digital builds custom software, websites, mobile applications, dashboards, automation, and AI-powered business systems when your business needs something specific.",
  path: "/northbridge-digital",
  openGraphTitle: "Northbridge Digital",
});

export default function NorthbridgeDigitalPage() {
  return (
    <div className="nb-page">
      <Section variant="hero">
        <PageHeader
          eyebrow="Northbridge Digital"
          title="Need something built specifically for your business?"
          description={
            <>
              <p>
                Northbridge Digital creates custom software, websites, mobile applications,
                dashboards, automation, and AI-powered business systems.
              </p>
              <p className="mt-4">
                This is Northbridge&apos;s custom-build and service arm—engaged when a business
                solution requires tailored design and implementation, not only advisory work.
              </p>
            </>
          }
        >
          <div className="nb-cta-group">
            <ButtonLink href="/contact">Discuss a custom build</ButtonLink>
            <ButtonLink href="/digital/assessment" variant="secondary">
              {DIAGNOSTIC_CTA}
            </ButtonLink>
          </div>
        </PageHeader>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Services"
          title="What Northbridge Digital delivers"
          description="Each engagement is scoped to your workflow, team, and constraints—not a generic package."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {northbridgeDigitalServices.map((service) => (
            <article key={service.name} className="nb-card p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-white">{service.name}</h3>
              <p className="mt-3 text-sm text-white/65 leading-relaxed">{service.description}</p>
            </article>
          ))}
        </div>
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
          title="Ready to scope a custom system?"
          description="Share what your business needs built, who will use it, and what success looks like."
          primaryHref="/contact"
          primaryLabel="Contact Northbridge Digital"
          secondaryHref="/digital/assessment"
          secondaryLabel={DIAGNOSTIC_CTA}
        />
      </Section>
    </div>
  );
}
