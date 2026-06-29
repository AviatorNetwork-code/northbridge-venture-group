import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { VentureCard } from "@/components/VentureCard";
import { additionalPlatforms, platforms } from "@/lib/platforms";
import { siteMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = siteMetadata({
  title: "About Us",
  description:
    "Northbridge Venture Group builds platforms, delivers business solutions, and creates custom systems through Northbridge Digital—starting with understanding how your business works.",
  path: "/about",
});

const coreValues = [
  {
    title: "Clarity",
    description: "We name problems precisely before proposing solutions.",
  },
  {
    title: "Operational honesty",
    description: "We design for how work actually happens—not idealized process diagrams.",
  },
  {
    title: "Long-term value",
    description: "We favor durable systems over quick fixes that create new debt.",
  },
  {
    title: "Disciplined build",
    description: "Custom software is scoped deliberately through Northbridge Digital.",
  },
];

const howWeWork = [
  "Understand the business problem and who it affects.",
  "Evaluate operations, data, and constraints—not just software gaps.",
  "Recommend a business solution, platform context, or custom build path.",
  "Implement with Northbridge Digital when tailored systems are required.",
  "Measure whether the change improved how the business runs.",
];

export default function About() {
  return (
    <div className="nb-page">
      <Section variant="hero" narrow>
        <PageHeader
          eyebrow="About Us"
          title="Northbridge Venture Group"
          description="We build platforms, deliver adaptable business solutions, and create custom systems when a business needs something specific."
        />
      </Section>

      <Section>
        <SectionHeader eyebrow="Who We Are" title="Three ways we help" />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <article className="nb-card p-6">
            <h3 className="font-semibold text-white">Platforms</h3>
            <p className="mt-3 text-sm text-white/65 leading-relaxed">
              Northbridge builds and operates platforms that demonstrate engineering and product
              capability—starting with aviation.
            </p>
          </article>
          <article className="nb-card p-6">
            <h3 className="font-semibold text-white">Business Solutions</h3>
            <p className="mt-3 text-sm text-white/65 leading-relaxed">
              We sell and adapt solutions for workforce operations, acquisition, intelligence,
              automation, applications, and custom engagements.
            </p>
          </article>
          <article className="nb-card p-6">
            <h3 className="font-semibold text-white">Northbridge Digital</h3>
            <p className="mt-3 text-sm text-white/65 leading-relaxed">
              Our custom-build arm for software, websites, mobile apps, dashboards, automation, and
              AI integration when off-the-shelf is not enough.
            </p>
          </article>
        </div>
      </Section>

      <Section variant="band">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeader eyebrow="Mission" title="Make complex operations understandable" />
            <p className="mt-4 text-sm text-white/65 leading-relaxed max-w-xl">
              Northbridge exists to help organizations see how their business works, fix what blocks
              progress, and apply technology where it earns its place.
            </p>
          </div>
          <div>
            <SectionHeader eyebrow="Vision" title="Connected systems for workforce-driven industries" />
            <p className="mt-4 text-sm text-white/65 leading-relaxed max-w-xl">
              We are building toward an ecosystem where platforms, applied intelligence, and
              practical services support aviation and adjacent industries—without forcing businesses
              into one-size-fits-all software.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="Core Values" title="How we make decisions" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {coreValues.map((value) => (
            <article key={value.title} className="nb-card p-6">
              <h3 className="font-semibold text-white">{value.title}</h3>
              <p className="mt-2 text-sm text-white/65 leading-relaxed">{value.description}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section variant="band">
        <SectionHeader eyebrow="How We Work" title="Business first. Technology when it fits." />
        <ol className="mt-8 max-w-2xl space-y-4 list-none counter-reset-none">
          {howWeWork.map((step, index) => (
            <li key={step} className="flex gap-4 text-sm text-white/70 leading-relaxed">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 text-xs font-semibold text-white/80">
                {index + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="platforms">
        <SectionHeader
          eyebrow="Our Platforms"
          title="Proof of capability"
          description="Platforms are products Northbridge builds and operates. They inform our solutions work—they are not a substitute for understanding your business."
        />
        <div className="mt-12 space-y-5">
          {platforms.map((platform) => (
            <VentureCard key={platform.name} venture={platform} />
          ))}
        </div>
        {additionalPlatforms.length > 0 && (
          <div className="mt-8">
            <p className="nb-eyebrow text-[0.65rem]">Also in portfolio</p>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              {additionalPlatforms.map((platform) => (
                <VentureCard key={platform.name} venture={platform} compact />
              ))}
            </div>
          </div>
        )}
        <div className="mt-10 nb-cta-group">
          <ButtonLink href="/solutions">Explore Business Solutions</ButtonLink>
          <ButtonLink href="/research" variant="secondary">
            Northbridge Research
          </ButtonLink>
        </div>
      </Section>
    </div>
  );
}
