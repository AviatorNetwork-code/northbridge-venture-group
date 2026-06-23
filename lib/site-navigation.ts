export type SiteNavItem = {
  href: string;
  label: string;
  /** Shown in footer or meta; Services = Northbridge Digital consulting arm */
  description?: string;
  /** Routes that mark this nav item active (prefix match) */
  activePrefixes?: string[];
};

export const primaryNav: SiteNavItem[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/ventures", label: "Ventures" },
  {
    href: "/services",
    label: "Services",
    description: "Northbridge Digital",
    activePrefixes: ["/services", "/digital"],
  },
  { href: "/clients", label: "Clients" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/contact", label: "Contact" },
];

export const secondaryNav: SiteNavItem[] = [
  { href: "/partner-with-us", label: "Partner With Us" },
];

export const footerNav: SiteNavItem[] = [...primaryNav, ...secondaryNav];

export function isNavActive(pathname: string, item: SiteNavItem): boolean {
  if (pathname === item.href) return true;
  if (item.activePrefixes) {
    return item.activePrefixes.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    );
  }
  return item.href !== "/" && pathname.startsWith(`${item.href}/`);
}
