import Link from "next/link";

type ArrowLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export function ArrowLink({ href, children, className = "" }: ArrowLinkProps) {
  return (
    <Link href={href} className={`nb-arrow-link ${className}`}>
      {children}
      <span aria-hidden="true" className="nb-arrow-link-icon">
        →
      </span>
    </Link>
  );
}
