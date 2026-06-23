import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { VentureCard } from "@/components/VentureCard";
import { ventures } from "@/lib/ventures";

export const metadata: Metadata = {
  title: "Ventures | Northbridge Venture Group",
  description:
    "Northbridge-owned ventures include Aviator Network, Quadrix, AirTax Financial, and future platforms in development.",
};

export default function Ventures() {
  return (
    <div className="nb-page">
      <Section variant="hero">
        <PageHeader
          eyebrow="Portfolio"
          title="Ventures we build and operate"
          description={
            <>
              Ventures are Northbridge-owned products and platforms. Client advisory is delivered
              through{" "}
              <Link href="/services" className="text-northbridge-red font-medium hover:text-white transition-colors">
                Northbridge Digital
              </Link>
              .
            </>
          }
        />
      </Section>

      <Section variant="tight">
        <div className="space-y-5">
          {ventures.map((venture) => (
            <VentureCard key={venture.name} venture={venture} />
          ))}
        </div>
      </Section>
    </div>
  );
}
