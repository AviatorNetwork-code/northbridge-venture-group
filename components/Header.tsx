"use client";

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

export function Header() {
  return (
    <header className="border-b border-black/10 bg-northbridge-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link
          href="/"
          className="text-xl font-bold text-northbridge-black hover:text-northbridge-red transition-colors"
        >
          Northbridge Venture Group
        </Link>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-northbridge-black hover:text-northbridge-red transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
