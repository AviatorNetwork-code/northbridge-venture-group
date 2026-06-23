import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApproachSection } from "@/components/digital/ApproachSection";
import { Breadcrumbs } from "@/components/digital/Breadcrumbs";
import { DiagnosticCTA } from "@/components/digital/DiagnosticCTA";
import { ExpertiseHero } from "@/components/digital/ExpertiseHero";
import { MetricsSection } from "@/components/digital/MetricsSection";
import { ProblemSection } from "@/components/digital/ProblemSection";
import { RelatedLinksSection } from "@/components/digital/RelatedLinksSection";
import {
  getExpertiseBySlug,
  getExpertiseSlugs,
  type ExpertiseContent,
} from "@/lib/digital/expertise";
import { getIndustryBySlug } from "@/lib/digital/industries";
import { digitalPageMetadata } from "@/lib/digital/metadata";

type PageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return getExpertiseSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const expertise = getExpertiseBySlug(params.slug);
  if (!expertise) {
    return { title: "Expertise | Northbridge Digital" };
  }

  return digitalPageMetadata({
    title: expertise.seoTitle,
    description: expertise.seoDescription,
    path: `/services/expertise/${expertise.slug}`,
  });
}

function ExpertiseDetailPage({ expertise }: { expertise: ExpertiseContent }) {
  const relatedIndustryLinks = expertise.relatedIndustries
    .map((slug) => getIndustryBySlug(slug))
    .filter((industry): industry is NonNullable<typeof industry> => Boolean(industry))
    .map((industry) => ({
      label: industry.name,
      href: `/services/industries/${industry.slug}`,
    }));

  return (
    <div className="nb-page">
      <Breadcrumbs
        items={[
          { label: "Knowledge", href: "/services" },
          { label: "Expertise", href: "/services/expertise" },
          { label: expertise.name },
        ]}
      />

      <ExpertiseHero expertise={expertise} />
      <ProblemSection
        problemStatement={expertise.problemStatement}
        whyStruggle={expertise.whyStruggle}
      />
      <ApproachSection items={expertise.approach} />
      <MetricsSection items={expertise.successMetrics} />

      <RelatedLinksSection title="Related industries" links={relatedIndustryLinks} />
      <RelatedLinksSection title="Related solutions" links={expertise.relatedSolutions} />

      <DiagnosticCTA
        title={`See how ${expertise.name.toLowerCase()} applies to your business`}
        description="The Business Diagnostic captures your context and helps Northbridge recommend a practical path—not a generic proposal."
      />
    </div>
  );
}

export default function ExpertiseSlugPage({ params }: PageProps) {
  const expertise = getExpertiseBySlug(params.slug);
  if (!expertise) notFound();

  return <ExpertiseDetailPage expertise={expertise} />;
}
