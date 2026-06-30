import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { CTABand } from "@/components/ui/CTABand";
import { siteMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = siteMetadata({
  title: "Partner With Us",
  description:
    "Explore partnership opportunities with Northbridge Venture Group and our platforms in aviation and financial services.",
  path: "/partner-with-us",
});

export default function PartnerWithUs() {
  return (
    <div className="nb-page">
      <Section variant="hero" narrow>
        <PageHeader
          eyebrow="Partner With Us"
          title="Partnerships that align with how we operate"
          description="Northbridge partners with flight schools, insurers, financiers, and organizations whose goals align with our platforms and client work. If you see a fit, we would like to hear from you."
        />
      </Section>

      <Section variant="tight">
        <CTABand
          eyebrow="Next step"
          title="Discuss a partnership opportunity"
          description="Tell us about your organization, what you are building, and how you see Northbridge fitting in. We review every inquiry and respond with a clear next step."
          primaryHref="/contact"
          primaryLabel="Contact Northbridge"
        />
      </Section>
    </div>
  );
}
