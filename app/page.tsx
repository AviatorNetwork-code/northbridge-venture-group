import Link from "next/link";
import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { HubCard } from "@/components/ui/HubCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { VentureCard } from "@/components/VentureCard";
import { DIAGNOSTIC_CTA } from "@/lib/digital/metadata";
import { platforms } from "@/lib/platforms";
import { businessSolutions } from "@/lib/solutions";
import { siteMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = siteMetadata({
  title: "Home",
  description:
    "Northbridge Venture Group delivers intelligent solutions for complex business problems—business solutions, custom systems through Northbridge Digital, and platforms that prove our capability.",
  path: "/",
  openGraphTitle: "Northbridge Venture Group",
});

const whyNorthbridge = [
  "We don't start with software.",
  "We start by understanding the business.",
  "Then we design the right combination of process, technology, automation, and software.",
];

export default function Home() {
  return (
    <div className="nb-page">
      <Section variant="hero">
        <PageHeader
          eyebrow="Northbridge Venture Group"
          title="Intelligent Solutions for Complex Business Problems"
          description="We help organizations understand, improve, and automate the systems that keep their business running."
        >
          <ButtonLink href="/solutions">Explore Business Solutions</ButtonLink>
          <ButtonLink href="/digital/assessment" variant="secondary">
            {DIAGNOSTIC_CTA}
          </ButtonLink>
        </PageHeader>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Business Solutions"
          title="Adaptable solutions for how your business actually operates"
          description="Northbridge sells and adapts business solutions—starting with the problem, not a product catalog. Choose the area closest to your situation."
        />
        <div className="nb-section-body nb-card-grid-3">
          {businessSolutions.map((solution) => (
            <HubCard
              key={solution.slug}
              href={`/solutions/${solution.slug}`}
              title={solution.name}
              description={solution.summary}
              cta="View solution"
            />
          ))}
        </div>
        <div className="mt-8 sm:mt-10">
          <ButtonLink href="/solutions" variant="secondary">
            All business solutions
          </ButtonLink>
        </div>
      </Section>

      <Section variant="band">
        <SectionHeader
          eyebrow="Our Platforms"
          title="Proof of what we can build"
          description="Northbridge builds and operates platforms in aviation, workforce operations, and adjacent markets. Platforms demonstrate capability—they are not the main sales offer. When your business needs something specific, we adapt solutions or build through Northbridge Digital."
        />
        <div className="nb-section-body nb-card-grid-2">
          {platforms.map((platform) => (
            <VentureCard key={platform.name} venture={platform} compact />
          ))}
        </div>
        <div className="mt-8 sm:mt-10">
          <ButtonLink href="/about#platforms" variant="secondary">
            Learn about our platforms
          </ButtonLink>
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="Why Northbridge" title="Business first. Technology second." />
        <ul className="nb-section-body max-w-2xl space-y-3 sm:space-y-4 list-none">
          {whyNorthbridge.map((line) => (
            <li key={line} className="nb-list-bullet text-base sm:text-lg text-white/80">
              <span className="nb-list-bullet-dot" aria-hidden="true" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-2xl nb-body">
          Need something built specifically for your business?{" "}
          <Link href="/northbridge-digital" className="nb-text-link">
            Northbridge Digital
          </Link>{" "}
          is our custom systems and build arm.
        </p>
      </Section>

      <Section variant="tight">
        <div className="nb-cta-band">
          <p className="nb-eyebrow">Business Diagnostic</p>
          <h2 className="mt-3 sm:mt-4 nb-h3 max-w-xl">Not sure where to start?</h2>
          <p className="mt-4 nb-body max-w-2xl">
            The Business Diagnostic maps how your business operates today and helps Northbridge
            recommend a practical path—whether that is a business solution, platform context, or
            custom build work.
          </p>
          <div className="mt-8 sm:mt-10 nb-cta-group">
            <ButtonLink href="/digital/assessment">{DIAGNOSTIC_CTA}</ButtonLink>
            <ButtonLink href="/contact" variant="secondary">
              Contact us
            </ButtonLink>
          </div>
        </div>
      </Section>
    </div>
  );
}
