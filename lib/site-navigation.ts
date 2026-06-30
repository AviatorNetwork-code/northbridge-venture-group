export type SiteNavItem = {
  href: string;
  label: string;
  description?: string;
  activePrefixes?: string[];
};

export const primaryNav: SiteNavItem[] = [
  { href: "/", label: "Home" },
  {
    href: "/solutions",
    label: "Business Solutions",
    activePrefixes: ["/solutions"],
  },
  {
    href: "/northbridge-digital",
    label: "Northbridge Digital",
    activePrefixes: ["/northbridge-digital", "/services", "/digital"],
  },
  {
    href: "/insights",
    label: "Insights",
    activePrefixes: ["/insights", "/services/insights", "/services/expertise"],
  },
  {
    href: "/about",
    label: "About Us",
    activePrefixes: ["/about", "/research"],
  },
  { href: "/contact", label: "Contact" },
];

export const secondaryNav: SiteNavItem[] = [
  { href: "/research", label: "Research" },
  { href: "/clients", label: "Clients" },
  { href: "/case-studies", label: "Client Projects" },
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
