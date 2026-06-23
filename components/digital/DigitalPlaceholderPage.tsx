import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/digital/Breadcrumbs";
import { digitalPageMetadata } from "@/lib/digital/metadata";

type PlaceholderPageProps = {
  title: string;
  description: string;
  breadcrumbs: BreadcrumbItem[];
};

export function DigitalPlaceholderPage({
  title,
  description,
  breadcrumbs,
}: PlaceholderPageProps) {
  return (
    <div className="nb-page">
      <Section variant="hero" containerClassName="max-w-2xl">
        <Breadcrumbs items={breadcrumbs} />
        <PageHeader
          eyebrow="Northbridge Digital"
          title={title}
          description={
            <>
              <p>{description}</p>
              <p className="mt-4 nb-body">
                This section is planned for future content. No articles or results are published here
                yet.
              </p>
            </>
          }
        >
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <ButtonLink href="/services">Knowledge hub</ButtonLink>
            <ButtonLink href="/digital/assessment" variant="secondary">
              Business Diagnostic
            </ButtonLink>
          </div>
        </PageHeader>
      </Section>
    </div>
  );
}

export function placeholderMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return digitalPageMetadata({ title, description, path });
}
