import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/digital/Breadcrumbs";
import { DiagnosticCTA } from "@/components/digital/DiagnosticCTA";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { expertiseAreas } from "@/lib/digital/expertise";
import { digitalPageMetadata } from "@/lib/digital/metadata";

export const metadata: Metadata = digitalPageMetadata({
  title: "Areas of Expertise",
  description:
    "What Northbridge understands about customer acquisition, operations, business intelligence, CRM, automation, AI, and custom software.",
  path: "/services/expertise",
});

export default function ExpertisePage() {
  return (
    <div className="nb-page">
      <Section variant="hero" containerClassName="max-w-4xl">
        <Breadcrumbs
          items={[
            { label: "Knowledge", href: "/services" },
            { label: "Expertise" },
          ]}
        />
        <PageHeader
          eyebrow="Northbridge Digital"
          title="What we understand about growing businesses"
          description="These pages describe problem areas—not a menu of services. Each explains why businesses struggle, how Northbridge approaches improvement, and how to measure what changes."
        />
      </Section>

      <Section variant="tight">
        <h2 className="sr-only">Expertise areas</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {expertiseAreas.map((area, index) => (
            <Link
              key={area.slug}
              href={`/services/expertise/${area.slug}`}
              className="nb-hub-card group"
            >
              <span className="nb-hub-card-index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="nb-hub-card-title">{area.name}</h3>
              <p className="nb-hub-card-desc">{area.seoDescription}</p>
              <span className="nb-hub-card-cta">
                Learn more
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
          title="Map your situation to the right focus area"
          description="The Business Diagnostic helps connect your current challenges to the expertise areas most relevant to your business."
        />
      </Section>
    </div>
  );
}
