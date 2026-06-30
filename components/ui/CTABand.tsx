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
      <h2 className={`nb-h3 max-w-xl ${eyebrow ? "mt-3 sm:mt-4" : ""}`}>{title}</h2>
      <p className="mt-4 nb-body max-w-2xl">{description}</p>
      <div className="mt-8 sm:mt-10 nb-cta-group">
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
