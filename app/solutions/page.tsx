import type { Metadata } from "next";
import { HubCard } from "@/components/ui/HubCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CTABand } from "@/components/ui/CTABand";
import { DIAGNOSTIC_CTA } from "@/lib/digital/metadata";
import { businessSolutions } from "@/lib/solutions";
import { siteMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = siteMetadata({
  title: "Business Solutions",
  description:
    "Northbridge business solutions for workforce operations, customer acquisition, business intelligence, automation, applications, and custom engagements—led by the problem, not the industry.",
  path: "/solutions",
});

export default function SolutionsPage() {
  return (
    <div className="nb-page">
      <Section variant="hero">
        <PageHeader
          eyebrow="Business Solutions"
          title="Solutions built around your business problem"
          description="Northbridge adapts proven solution areas to how your organization works. We evaluate your operations first—then recommend the right combination of process, systems, and build work."
        />
      </Section>

      <Section>
        <div className="nb-section-body nb-card-grid-3">
          {businessSolutions.map((solution, index) => (
            <HubCard
              key={solution.slug}
              href={`/solutions/${solution.slug}`}
              title={solution.name}
              description={solution.summary}
              cta="View solution"
              index={String(index + 1).padStart(2, "0")}
            />
          ))}
        </div>
      </Section>

      <Section variant="band">
        <SectionHeader
          eyebrow="How it works"
          title="Evaluate first. Recommend second. Build when needed."
          description="Most engagements start with understanding—through the Business Diagnostic or a scoped discovery conversation. Custom software is delivered through Northbridge Digital when your situation requires it."
        />
      </Section>

      <Section variant="tight">
        <CTABand
          title="Start with clarity"
          description="The Business Diagnostic helps Northbridge understand your context and recommend the right solution path."
          primaryHref="/digital/assessment"
          primaryLabel={DIAGNOSTIC_CTA}
          secondaryHref="/contact"
          secondaryLabel="Request a solution conversation"
        />
      </Section>
    </div>
  );
}
