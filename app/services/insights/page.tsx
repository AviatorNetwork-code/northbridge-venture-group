import {
  DigitalPlaceholderPage,
  placeholderMetadata,
} from "@/components/digital/DigitalPlaceholderPage";

export const metadata = placeholderMetadata({
  title: "Insights",
  description: "Future home for Northbridge Digital insights on operations, growth, and systems.",
  path: "/services/insights",
});

export default function InsightsPlaceholderPage() {
  return (
    <DigitalPlaceholderPage
      title="Insights"
      description="Practical perspectives on how businesses improve operations, acquisition, and visibility."
      breadcrumbs={[
        { label: "Knowledge", href: "/services" },
        { label: "Insights" },
      ]}
    />
  );
}
