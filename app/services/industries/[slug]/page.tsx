import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/digital/Breadcrumbs";
import { ChallengesSection } from "@/components/digital/ChallengesSection";
import { DiagnosticCTA } from "@/components/digital/DiagnosticCTA";
import { EvaluationSection } from "@/components/digital/EvaluationSection";
import { IndustryHero } from "@/components/digital/IndustryHero";
import { IndustryOverview } from "@/components/digital/IndustryOverview";
import { RelatedLinksSection } from "@/components/digital/RelatedLinksSection";
import { SolutionsSection } from "@/components/digital/SolutionsSection";
import {
  getExpertiseBySlug,
} from "@/lib/digital/expertise";
import {
  getIndustryBySlug,
  getIndustrySlugs,
  type IndustryContent,
} from "@/lib/digital/industries";
import { digitalPageMetadata } from "@/lib/digital/metadata";

type PageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return getIndustrySlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const industry = getIndustryBySlug(params.slug);
  if (!industry) {
    return { title: "Industry | Northbridge Digital" };
  }

  return digitalPageMetadata({
    title: industry.seoTitle,
    description: industry.seoDescription,
    path: `/services/industries/${industry.slug}`,
  });
}

function IndustryDetailPage({ industry }: { industry: IndustryContent }) {
  const relatedExpertiseLinks = industry.relatedExpertise
    .map((slug) => getExpertiseBySlug(slug))
    .filter((area): area is NonNullable<typeof area> => Boolean(area))
    .map((area) => ({
      label: area.name,
      href: `/services/expertise/${area.slug}`,
    }));

  return (
    <div className="nb-page">
      <Breadcrumbs
        items={[
          { label: "Knowledge", href: "/services" },
          { label: "Industries", href: "/services/industries" },
          { label: industry.name },
        ]}
      />

      <IndustryHero industry={industry} />
      <IndustryOverview paragraphs={industry.overview} />
      <ChallengesSection challenges={industry.challenges} bottlenecks={industry.bottlenecks} />
      <EvaluationSection items={industry.evaluations} />
      <SolutionsSection improvements={industry.improvements} solutions={industry.solutions} />

      <RelatedLinksSection title="Related expertise" links={relatedExpertiseLinks} />

      <DiagnosticCTA
        title={`Start with a Business Diagnostic for ${industry.name}`}
        description="Answer a short set of questions about how your business operates. Northbridge reviews your responses and recommends where to focus first."
      />
    </div>
  );
}

export default function IndustryPage({ params }: PageProps) {
  const industry = getIndustryBySlug(params.slug);
  if (!industry) notFound();

  return <IndustryDetailPage industry={industry} />;
}
