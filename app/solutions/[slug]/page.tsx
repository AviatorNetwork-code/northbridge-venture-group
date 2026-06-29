import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { CTABand } from "@/components/ui/CTABand";
import { DIAGNOSTIC_CTA } from "@/lib/digital/metadata";
import {
  businessSolutions,
  getSolutionBySlug,
  getSolutionSlugs,
  type BusinessSolution,
} from "@/lib/solutions";
import { siteMetadata } from "@/lib/site-metadata";

type PageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return getSolutionSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const solution = getSolutionBySlug(params.slug);
  if (!solution) {
    return { title: "Solution | Northbridge Venture Group" };
  }

  return siteMetadata({
    title: solution.seoTitle,
    description: solution.seoDescription,
    path: `/solutions/${solution.slug}`,
  });
}

function SolutionDetail({ solution }: { solution: BusinessSolution }) {
  const contactHref = `/contact?solution=${encodeURIComponent(solution.slug)}`;

  return (
    <div className="nb-page">
      <Section variant="hero" narrow>
        <nav className="text-sm text-white/50 mb-6" aria-label="Breadcrumb">
          <Link href="/solutions" className="hover:text-white transition-colors">
            Business Solutions
          </Link>
          <span className="mx-2" aria-hidden="true">
            /
          </span>
          <span className="text-white/80">{solution.name}</span>
        </nav>
        <h1 className="nb-h1 text-balance">{solution.name}</h1>
        <p className="mt-6 nb-lead max-w-2xl">{solution.summary}</p>
        <div className="mt-10 nb-cta-group">
          <ButtonLink href={contactHref}>Request this solution for your industry</ButtonLink>
          <ButtonLink href="/digital/assessment" variant="secondary">
            {DIAGNOSTIC_CTA}
          </ButtonLink>
        </div>
      </Section>

      <Section>
        <Container narrow>
          <div className="grid gap-12 lg:grid-cols-2">
            <article>
              <h2 className="nb-h3">The business problem</h2>
              <ul className="mt-5 space-y-3 text-sm text-white/70 leading-relaxed list-none">
                {solution.problem.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-northbridge-red"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
            <article>
              <h2 className="nb-h3">Who it helps</h2>
              <ul className="mt-5 space-y-3 text-sm text-white/70 leading-relaxed list-none">
                {solution.whoItHelps.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-northbridge-red"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </Container>
      </Section>

      <Section variant="band">
        <Container narrow>
          <h2 className="nb-h3">What Northbridge evaluates</h2>
          <ul className="mt-5 space-y-3 text-sm text-white/70 leading-relaxed list-none max-w-2xl">
            {solution.whatWeEvaluate.map((item) => (
              <li key={item} className="flex gap-3">
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-northbridge-red"
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section>
        <Container narrow>
          <h2 className="nb-h3">Example industries</h2>
          <p className="mt-3 text-sm text-white/55 max-w-2xl">
            This solution applies across sectors. Examples below—not an exhaustive list.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2 list-none">
            {solution.exampleIndustries.map((industry) => (
              <li
                key={industry}
                className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/70"
              >
                {industry}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section variant="tight">
        <CTABand
          title={`Request ${solution.name} for your business`}
          description="Tell us about your industry, team size, and what is not working today. We will respond with a clear next step."
          primaryHref={contactHref}
          primaryLabel="Request this solution for your industry"
          secondaryHref="/digital/assessment"
          secondaryLabel={DIAGNOSTIC_CTA}
        />
      </Section>

      <Section variant="tight">
        <Container narrow>
          <p className="text-sm text-white/45">
            Other solutions:{" "}
            {businessSolutions
              .filter((s) => s.slug !== solution.slug)
              .map((s, i, arr) => (
                <span key={s.slug}>
                  <Link
                    href={`/solutions/${s.slug}`}
                    className="text-white/60 hover:text-northbridge-red transition-colors"
                  >
                    {s.name}
                  </Link>
                  {i < arr.length - 1 ? " · " : ""}
                </span>
              ))}
          </p>
        </Container>
      </Section>
    </div>
  );
}

export default function SolutionSlugPage({ params }: PageProps) {
  const solution = getSolutionBySlug(params.slug);
  if (!solution) notFound();
  return <SolutionDetail solution={solution} />;
}
