export type PublicNavLink = {
  href: string;
  label: string;
};

/** Primary public website navigation — no internal /operations routes. */
export const primaryPublicNavLinks: PublicNavLink[] = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Ventures" },
  { href: "/services#products", label: "Products" },
  { href: "/contact", label: "Contact" },
];

export const secondaryPublicNavLinks: PublicNavLink[] = [
  { href: "/privacy", label: "Privacy" },
  { href: "/privacy/settings", label: "Privacy Settings" },
  { href: "/help", label: "Help" },
];

export const publicWebsiteMenuLinks: PublicNavLink[] = [
  ...primaryPublicNavLinks,
  ...secondaryPublicNavLinks,
];
