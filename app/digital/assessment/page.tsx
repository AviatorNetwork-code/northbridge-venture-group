import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { DigitalAssessment } from "@/components/DigitalAssessment";

export const metadata: Metadata = {
  title: "Business Assessment | Northbridge Digital",
  description:
    "Complete the Northbridge Digital business assessment to identify the right systems path for your organization.",
};

function AssessmentFallback() {
  return (
    <div className="max-w-2xl mx-auto nb-card p-8 animate-pulse">
      <div className="h-4 w-32 rounded bg-white/10" />
      <div className="mt-6 h-8 w-3/4 rounded bg-white/10" />
      <div className="mt-4 h-24 rounded bg-white/10" />
    </div>
  );
}

export default function DigitalAssessmentPage() {
  return (
    <div className="nb-page">
      <div className="max-w-2xl mx-auto mb-10">
        <Link
          href="/digital"
          className="text-sm font-semibold text-northbridge-red hover:underline"
        >
          ← Northbridge Digital
        </Link>
        <p className="mt-6 nb-eyebrow">Business Assessment</p>
        <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-white">
          Map your business to the right system
        </h1>
        <p className="mt-4 nb-body">
          A short, structured assessment. No pricing quotes—just clarity on fit and recommended
          next steps.
        </p>
      </div>

      <Suspense fallback={<AssessmentFallback />}>
        <DigitalAssessment />
      </Suspense>
    </div>
  );
}
