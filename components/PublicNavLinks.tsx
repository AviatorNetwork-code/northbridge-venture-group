"use client";

import Link from "next/link";
import type { PublicNavLink } from "@/lib/public-navigation";

type PublicNavLinksProps = {
  links: PublicNavLink[];
  onNavigate?: () => void;
  className?: string;
  linkClassName?: string;
  listClassName?: string;
};

export default function PublicNavLinks({
  links,
  onNavigate,
  className,
  linkClassName = "text-sm font-medium text-silver transition-colors hover:text-white",
  listClassName = "flex items-center gap-5 lg:gap-6",
}: PublicNavLinksProps) {
  return (
    <nav aria-label="Public website" className={className}>
      <ul className={listClassName}>
        {links.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            <Link href={link.href} onClick={onNavigate} className={linkClassName}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
