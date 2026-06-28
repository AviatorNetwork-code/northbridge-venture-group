import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { siteMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = siteMetadata({
  title: "About",
  description:
    "Northbridge Venture Group is a Florida-based company building ventures in aviation and financial services, with operational advisory through Northbridge Digital.",
  path: "/about",
});

export default function About() {
  return (
    <div className="nb-page">
      <Section variant="hero" narrow>
        <PageHeader
          eyebrow="Northbridge Venture Group"
          title="Built for clarity in complex industries"
          description={
            <>
              <p>
                Northbridge Venture Group LLC is a Florida limited liability company that builds and
                operates platforms in aviation and financial services. Our portfolio includes Aviator
                Network—the operating system for modern aviation, bringing pilot training, instructor
                connections, flight school tools, and aviation AI assistance into one connected
                platform—and AirTax Financial, tax and financial support for aviation professionals.
              </p>
              <p className="mt-4">
                We focus on clarity, compliance, and long-term value in every venture we launch.
                Growth-stage businesses work with our consulting arm,{" "}
                <span className="text-white/80">Northbridge Digital</span>, to improve operations and
                acquisition systems.
              </p>
            </>
          }
        />
      </Section>
    </div>
  );
}
