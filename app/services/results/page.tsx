import {
  DigitalPlaceholderPage,
  placeholderMetadata,
} from "@/components/digital/DigitalPlaceholderPage";

export const metadata = placeholderMetadata({
  title: "Results",
  description: "Future home for Northbridge Digital client outcomes and measurable improvements.",
  path: "/services/results",
});

export default function ResultsPlaceholderPage() {
  return (
    <DigitalPlaceholderPage
      title="Results"
      description="A future collection of measurable outcomes from Northbridge Digital engagements."
      breadcrumbs={[
        { label: "Knowledge", href: "/services" },
        { label: "Results" },
      ]}
    />
  );
}
