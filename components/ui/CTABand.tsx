import { ButtonLink } from "./ButtonLink";

type CTABandProps = {
  eyebrow?: string;
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function CTABand({
  eyebrow = "Next step",
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: CTABandProps) {
  return (
    <div className="nb-cta-band">
      {eyebrow && <p className="nb-eyebrow">{eyebrow}</p>}
      <h2 className={`nb-h3 ${eyebrow ? "mt-4" : ""}`}>{title}</h2>
      <p className="mt-4 nb-body max-w-2xl">{description}</p>
      <div className="mt-8 flex flex-wrap gap-3 sm:gap-4">
        <ButtonLink href={primaryHref}>{primaryLabel}</ButtonLink>
        {secondaryHref && secondaryLabel && (
          <ButtonLink href={secondaryHref} variant="secondary">
            {secondaryLabel}
          </ButtonLink>
        )}
      </div>
    </div>
  );
}
