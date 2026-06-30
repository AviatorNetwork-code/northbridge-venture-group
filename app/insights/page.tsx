import Link from "next/link";
import type { Metadata } from "next";
import { HubCard } from "@/components/ui/HubCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CTABand } from "@/components/ui/CTABand";
import { expertiseAreas } from "@/lib/digital/expertise";
import { DIAGNOSTIC_CTA } from "@/lib/digital/metadata";
import { siteMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = siteMetadata({
  title: "Insights",
  description:
    "Practical perspectives from Northbridge on operations, acquisition, systems, and how businesses improve the way they work.",
  path: "/insights",
});

export default function InsightsPage() {
  return (
    <div className="nb-page">
      <Section variant="hero">
        <PageHeader
          eyebrow="Insights"
          title="Practical perspectives for operators"
          description="Articles and expertise on how businesses improve acquisition, operations, visibility, and systems—written for decision-makers, not technologists."
        />
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Expertise library"
          title="Browse by problem area"
          description="Each area explains common business problems, what to evaluate, and how Northbridge approaches improvement."
        />
        <div className="nb-section-body nb-card-grid-2">
          {expertiseAreas.map((area, index) => (
            <HubCard
              key={area.slug}
              href={`/services/expertise/${area.slug}`}
              title={area.name}
              description={area.heroSubtitle}
              cta="Read more"
              index={String(index + 1).padStart(2, "0")}
            />
          ))}
        </div>
      </Section>

      <Section variant="band">
        <SectionHeader
          eyebrow="More resources"
          title="Knowledge hub and industries"
          description="Sector context and structured guidance live in the Northbridge Digital knowledge base."
        />
        <ul className="mt-8 flex flex-wrap gap-4 text-sm list-none">
          <li>
            <Link href="/services" className="text-northbridge-red font-medium hover:text-white transition-colors">
              Knowledge hub →
            </Link>
          </li>
          <li>
            <Link
              href="/services/industries"
              className="text-white/70 hover:text-northbridge-red transition-colors"
            >
              Industries →
            </Link>
          </li>
          <li>
            <Link
              href="/northbridge-digital"
              className="text-white/70 hover:text-northbridge-red transition-colors"
            >
              Northbridge Digital →
            </Link>
          </li>
        </ul>
      </Section>

      <Section variant="tight">
        <CTABand
          eyebrow="Apply what you've read"
          title="Ready to apply these ideas to your organization?"
          description="Start with a Business Diagnostic. It maps how your business operates today and helps identify where improvement should begin—without a sales pitch."
          primaryHref="/digital/assessment"
          primaryLabel={DIAGNOSTIC_CTA}
        />
      </Section>
    </div>
  );
}
