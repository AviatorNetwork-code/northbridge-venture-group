import { CTABand } from "@/components/ui/CTABand";
import { DIAGNOSTIC_CTA, DIAGNOSTIC_PATH } from "@/lib/digital/metadata";

type DiagnosticCTAProps = {
  title?: string;
  description?: string;
  className?: string;
};

export function DiagnosticCTA({
  title = "Find what is blocking growth",
  description = "The Business Diagnostic maps how your business operates today and surfaces practical next steps—no sales pitch required to start.",
  className = "",
}: DiagnosticCTAProps) {
  return (
    <div className={className}>
      <CTABand
        title={title}
        description={description}
        primaryHref={DIAGNOSTIC_PATH}
        primaryLabel={DIAGNOSTIC_CTA}
        secondaryHref="/services"
        secondaryLabel="Knowledge hub"
      />
    </div>
  );
}
