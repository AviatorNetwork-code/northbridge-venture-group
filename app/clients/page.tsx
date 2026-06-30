import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CTABand } from "@/components/ui/CTABand";
import { ClientCard } from "@/components/ClientCard";
import { clients } from "@/lib/clients";
import { DIAGNOSTIC_CTA } from "@/lib/digital/metadata";
import { siteMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = siteMetadata({
  title: "Clients",
  description:
    "Organizations Northbridge Venture Group has supported on digital infrastructure, operational systems, and growth.",
  path: "/clients",
});

const relationshipTypes = [
  {
    title: "Clients",
    description:
      "Organizations we serve directly—engaged on business solutions, digital infrastructure, and operational improvement tailored to how they operate.",
  },
  {
    title: "Platforms",
    description:
      "Products Northbridge builds and operates to demonstrate engineering capability. Platforms inform our client work; they are not the primary offer.",
  },
  {
    title: "Research",
    description:
      "Applied R&D that improves how Northbridge designs systems for regulated, workforce-driven environments—with findings that strengthen both platforms and client engagements.",
  },
];

export default function Clients() {
  return (
    <div className="nb-page">
      <Section variant="hero">
        <PageHeader
          eyebrow="Clients"
          title="Organizations we support"
          description="Northbridge works with businesses that need operational clarity, better systems, and practical improvement—not generic software packages. Below are selected organizations we have supported."
        />
      </Section>

      <Section>
        <SectionHeader
          eyebrow="How we work"
          title="Clients, platforms, and research"
          description="Northbridge engages organizations in three distinct ways. Understanding the difference helps set the right expectations."
        />
        <div className="nb-section-body nb-card-grid-3">
          {relationshipTypes.map((item) => (
            <article key={item.title} className="nb-card">
              <h3 className="nb-h3 text-base sm:text-lg">{item.title}</h3>
              <p className="mt-3 nb-body">{item.description}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section variant="tight">
        <div className="grid gap-5 md:grid-cols-2">
          {clients.map((client) => (
            <ClientCard key={client.name} client={client} />
          ))}
        </div>
      </Section>

      <Section variant="tight">
        <CTABand
          eyebrow="Next step"
          title="Considering a similar engagement?"
          description="The Business Diagnostic helps Northbridge understand your operations and recommend whether a business solution, custom build, or advisory path fits best."
          primaryHref="/digital/assessment"
          primaryLabel={DIAGNOSTIC_CTA}
        />
      </Section>
    </div>
  );
}
