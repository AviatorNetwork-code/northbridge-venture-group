import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  /** Icon + wordmark on larger breakpoints; icon-forward on very narrow screens. */
  showWordmark?: boolean;
};

/**
 * Logo slot for official Northbridge brand assets (`public/brand/`).
 * Swap `logo-icon.svg` / `logo-horizontal.svg` without layout changes.
 */
export function BrandLogo({ showWordmark = true }: BrandLogoProps) {
  return (
    <Link href="/" className="nb-logo-link group" aria-label="Northbridge Venture Group home">
      <Image
        src="/brand/logo-icon.svg"
        alt=""
        width={32}
        height={32}
        className="h-8 w-8 shrink-0"
        priority
      />
      {showWordmark ? (
        <span className="min-w-0 truncate text-base font-semibold tracking-tight sm:text-lg">
          <span className="text-white transition-colors group-hover:text-northbridge-red">
            Northbridge
          </span>
          <span className="hidden text-white/60 font-normal sm:inline"> Venture Group</span>
        </span>
      ) : (
        <span className="sr-only">Northbridge Venture Group</span>
      )}
    </Link>
  );
}
