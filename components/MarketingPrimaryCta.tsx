import Link from "next/link";

type MarketingPrimaryCtaProps = {
  href?: string;
  label?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export default function MarketingPrimaryCta({
  href = "/contact",
  label = "Start a Conversation",
  secondaryHref,
  secondaryLabel,
}: MarketingPrimaryCtaProps) {
  return (
    <div className="mb-10 flex flex-col gap-3 sm:mb-12 sm:flex-row sm:flex-wrap">
      <Link
        href={href}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-red px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-red-hover sm:w-auto"
      >
        {label}
      </Link>
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
