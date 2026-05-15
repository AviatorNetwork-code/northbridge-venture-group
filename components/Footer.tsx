import Link from "next/link";

const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/ventures", label: "Ventures" },
  { href: "/services", label: "Services" },
  { href: "/partner-with-us", label: "Partner With Us" },
  { href: "/clients", label: "Clients" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-black/10 bg-northbridge-black text-northbridge-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="font-bold text-lg">Northbridge Venture Group</p>
            <p className="mt-1 text-sm text-white/80">
              <a
                href="mailto:contact@northbridgeventuregroup.com"
                className="hover:text-northbridge-red transition-colors"
              >
                contact@northbridgeventuregroup.com
              </a>
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-white/90 hover:text-northbridge-red transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="mt-8 pt-6 border-t border-white/10 text-sm text-white/70">
          © {new Date().getFullYear()} Northbridge Venture Group LLC. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
