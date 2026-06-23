import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { DigitalAssessment } from "@/components/DigitalAssessment";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { digitalPageMetadata } from "@/lib/digital/metadata";

export const metadata: Metadata = digitalPageMetadata({
  title: "Business Diagnostic",
  description:
    "Complete the Northbridge Digital Business Diagnostic to understand how your business operates and identify practical improvement paths.",
  path: "/digital/assessment",
});

function AssessmentFallback() {
  return (
    <div className="max-w-2xl mx-auto nb-card p-8 animate-pulse">
      <div className="h-3 w-28 rounded bg-white/10" />
      <div className="mt-6 h-8 w-3/4 rounded bg-white/10" />
      <div className="mt-4 h-24 rounded bg-white/10" />
    </div>
  );
}

export default function DigitalAssessmentPage() {
  return (
    <div className="nb-page">
      <Section variant="hero" containerClassName="max-w-3xl">
        <Link
          href="/services"
          className="text-sm font-medium text-northbridge-red transition-colors hover:text-white"
        >
          ← Knowledge hub
        </Link>
        <div className="mt-8">
          <PageHeader
            eyebrow="Business Diagnostic"
            title="Map your business to the right focus"
            description="A short, structured review of how your business works. No pricing quotes—just clarity on fit and recommended next steps."
          />
        </div>
      </Section>

      <Section variant="tight">
        <Suspense fallback={<AssessmentFallback />}>
          <DigitalAssessment />
        </Suspense>
      </Section>
    </div>
  );
}
