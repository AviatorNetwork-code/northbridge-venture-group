import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { VentureCard } from "@/components/VentureCard";
import { ventures } from "@/lib/ventures";

export const metadata: Metadata = {
  title: "Northbridge-Owned Platforms | Northbridge Venture Group",
  description:
    "Northbridge-owned platforms include Aviator Network—an aviation platform for pilot training, instructor connections, flight school tools, and aviation AI assistance—plus AirTax Financial and ventures in development.",
};

export default function Ventures() {
  return (
    <div className="nb-page">
      <Section variant="hero">
        <PageHeader
          eyebrow="Northbridge-owned platforms"
          title="Products we build and operate"
          description={
            <>
              These are Northbridge-owned platforms—not client engagements. Aviator Network is our
              flagship aviation ecosystem for pilot training, instructor connections, and flight
              school tools. Client advisory is delivered through{" "}
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
