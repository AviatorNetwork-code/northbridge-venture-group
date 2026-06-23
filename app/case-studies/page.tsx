import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Case Studies | Northbridge Venture Group",
  description:
    "Selected Northbridge client engagements—digital infrastructure, operational systems, and growth infrastructure.",
};

const studies = [
  {
    href: "/case-studies/florida-air-mechanical",
    title: "Florida Air & Mechanical Contractors LLC",
    subtitle: "Digital Infrastructure Build",
    description:
      "HVAC contractor digital stack: brand foundation, website and service architecture, SEO, lead capture, and trust systems—Orlando, Florida.",
  },
];

export default function CaseStudiesIndex() {
  return (
    <div className="nb-page">
      <Section variant="hero" containerClassName="max-w-3xl">
        <PageHeader
          eyebrow="Case studies"
          title="Documented client work"
          description="Published engagements focused on digital infrastructure and operational systems—not placeholder marketing pages."
        />
      </Section>

      <Section variant="tight">
        <ul className="space-y-5">
          {studies.map((study) => (
            <li key={study.href}>
              <Link href={study.href} className="group block nb-card-interactive h-full">
                <h2 className="nb-h3 group-hover:text-northbridge-red transition-colors">
                  {study.title}
                </h2>
                <p className="mt-1 text-sm font-semibold text-northbridge-red">{study.subtitle}</p>
                <p className="mt-3 text-sm sm:text-base text-white/65 leading-relaxed max-w-prose">
                  {study.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-northbridge-red">
                  Read case study
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
