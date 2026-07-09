import Link from "next/link";
import NordiPublicCta from "@/components/home/NordiPublicCta";

type MarketingPrimaryCtaProps = {
  href?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

const primaryLinkClassName =
  "inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-red px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-red-hover sm:w-auto";

export default function MarketingPrimaryCta({
  href = "/",
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: MarketingPrimaryCtaProps) {
  return (
    <div className="mb-10 flex flex-col gap-3 sm:mb-12 sm:flex-row sm:flex-wrap">
      {primaryLabel ? (
        <Link href={href} className={primaryLinkClassName}>
          {primaryLabel}
        </Link>
      ) : (
        <NordiPublicCta variant="primary" href={href} />
      )}
      {secondaryHref && secondaryLabel ? (
        <Link
          href={secondaryHref}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/30 hover:bg-white/10 sm:w-auto"
        >
          {secondaryLabel}
        </Link>
      ) : null}
    </div>
  );
}
