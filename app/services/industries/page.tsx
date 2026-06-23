import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/digital/Breadcrumbs";
import { DiagnosticCTA } from "@/components/digital/DiagnosticCTA";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { industries } from "@/lib/digital/industries";
import { digitalPageMetadata } from "@/lib/digital/metadata";

export const metadata: Metadata = digitalPageMetadata({
  title: "Industries We Serve",
  description:
    "Northbridge Digital works with aviation, HVAC, construction, professional services, and logistics businesses to find what is blocking growth.",
  path: "/services/industries",
});

export default function IndustriesPage() {
  return (
    <div className="nb-page">
      <Section variant="hero" containerClassName="max-w-4xl">
        <Breadcrumbs
          items={[
            { label: "Knowledge", href: "/services" },
            { label: "Industries" },
          ]}
        />
        <PageHeader
          eyebrow="Northbridge Digital"
          title="Industries we focus on"
          description="Each industry has different operational pressure points. These pages explain typical challenges, what we evaluate, and where improvement usually starts."
        />
      </Section>

      <Section variant="tight">
        <h2 className="sr-only">Industry list</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry, index) => (
            <Link
              key={industry.slug}
              href={`/services/industries/${industry.slug}`}
              className="nb-hub-card group"
            >
              <span className="nb-hub-card-index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="nb-hub-card-title">{industry.name}</h3>
              <p className="nb-hub-card-desc">{industry.seoDescription}</p>
              <span className="nb-hub-card-cta">
                View {industry.name}
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section variant="tight">
        <DiagnosticCTA
          title="Not sure which industry page fits?"
          description="The Business Diagnostic asks about your business context and priorities. Northbridge uses your answers to recommend a practical starting point."
        />
      </Section>
    </div>
  );
}
