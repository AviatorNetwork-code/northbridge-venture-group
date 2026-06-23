import {
  DigitalPlaceholderPage,
  placeholderMetadata,
} from "@/components/digital/DigitalPlaceholderPage";

export const metadata = placeholderMetadata({
  title: "Case Studies",
  description: "Future home for Northbridge Digital case studies.",
  path: "/services/case-studies",
});

export default function CaseStudiesPlaceholderPage() {
  return (
    <DigitalPlaceholderPage
      title="Case Studies"
      description="Detailed stories of how businesses improved operations and growth—with real context, not invented examples."
      breadcrumbs={[
        { label: "Knowledge", href: "/services" },
        { label: "Case Studies" },
      ]}
    />
  );
}
