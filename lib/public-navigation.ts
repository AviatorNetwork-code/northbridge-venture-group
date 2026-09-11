export type PublicNavLink = {
  href: string;
  label: string;
};

/** Primary public website navigation — premium, not overloaded. */
export const primaryPublicNavLinks: PublicNavLink[] = [
  { href: "/about", label: "About" },
  { href: "/ventures", label: "Ventures" },
  { href: "/engineering-ai", label: "Engineering & AI" },
  { href: "/digital", label: "Digital" },
  { href: "/capabilities", label: "Capabilities" },
  { href: "/contact", label: "Contact" },
];

export const secondaryPublicNavLinks: PublicNavLink[] = [
  { href: "/mobile-apps", label: "Mobile Apps" },
  { href: "/privacy", label: "Privacy" },
  { href: "/privacy/settings", label: "Privacy Settings" },
  { href: "/help", label: "Help" },
];

export const publicWebsiteMenuLinks: PublicNavLink[] = [
  ...primaryPublicNavLinks,
  ...secondaryPublicNavLinks,
];
