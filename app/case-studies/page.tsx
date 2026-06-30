// Client projects document completed engagements. Full case studies are reserved for
// projects with documented measurable outcomes.

import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { CTABand } from "@/components/ui/CTABand";
import { DIAGNOSTIC_CTA } from "@/lib/digital/metadata";
import { siteMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = siteMetadata({
  title: "Client Projects",
  description:
    "Examples of how Northbridge has helped organizations strengthen operations, technology, and digital infrastructure.",
  path: "/case-studies",
});

const projects = [
  {
    href: "/case-studies/florida-air-mechanical",
    title: "Florida Air & Mechanical Contractors LLC",
    subtitle: "Website & Digital Infrastructure",
    description:
      "Northbridge designed and implemented the company's digital foundation, including branding, website architecture, search optimization, lead capture, and customer trust systems to support future growth.",
  },
];

export default function ClientProjectsPage() {
  return (
    <div className="nb-page">
      <Section variant="hero" containerClassName="max-w-3xl">
        <PageHeader
          eyebrow="Client Projects"
          title="Client Projects"
          description="Explore examples of how Northbridge has helped organizations strengthen their operations, technology, and digital infrastructure."
        />
      </Section>

      <Section variant="tight">
        <ul className="space-y-5">
          {projects.map((project) => (
            <li key={project.href}>
              <Link href={project.href} className="group block nb-card-interactive h-full">
                <h2 className="nb-h3 group-hover:text-northbridge-red transition-colors">
                  {project.title}
                </h2>
                <p className="mt-1 text-sm font-semibold text-northbridge-red">{project.subtitle}</p>
                <p className="mt-3 text-sm sm:text-base text-white/65 leading-relaxed max-w-prose">
                  {project.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-northbridge-red">
                  View client project
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section variant="tight">
        <CTABand
          eyebrow="Your situation"
          title="Every organization has different operational challenges"
          description="Let's discuss yours. The Business Diagnostic maps how your business operates today and identifies where improvement should start."
          primaryHref="/digital/assessment"
          primaryLabel={DIAGNOSTIC_CTA}
        />
      </Section>
    </div>
  );
}
