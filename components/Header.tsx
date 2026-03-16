import Link from "next/link";
import NorthbridgeLogo from "@/components/NorthbridgeLogo";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/portfolio", label: "Ventures" },
  { href: "/services", label: "Services" },
  { href: "/partner", label: "Partner With Us" },
  { href: "/clients", label: "Clients" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/98 backdrop-blur-sm border-b border-white/5">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between min-h-[52px] sm:min-h-[56px]">
        <Link
          href="/"
          className="flex items-center shrink-0 transition-opacity hover:opacity-90"
        >
          <NorthbridgeLogo className="h-10 sm:h-12" />
        </Link>
        <ul className="flex items-center gap-4 sm:gap-6 md:gap-8 shrink-0">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-semibold tracking-wide text-silver hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
