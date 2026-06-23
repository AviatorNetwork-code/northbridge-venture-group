import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { ClientCard } from "@/components/ClientCard";
import { clients } from "@/lib/clients";

export const metadata: Metadata = {
  title: "Clients | Northbridge Venture Group",
  description:
    "Organizations Northbridge Venture Group has supported on digital infrastructure, operational systems, and growth.",
};

export default function Clients() {
  return (
    <div className="nb-page">
      <Section variant="hero">
        <PageHeader
          eyebrow="Relationships"
          title="Organizations we support"
          description="Clients are organizations we serve. Ventures are platforms we own and operate—the two are distinct."
        />
      </Section>

      <Section variant="tight">
        <div className="grid gap-5 md:grid-cols-2">
          {clients.map((client) => (
            <ClientCard key={client.name} client={client} />
          ))}
        </div>
      </Section>
    </div>
  );
}
