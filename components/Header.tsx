"use client";

import Link from "next/link";
import NorthbridgeLogo from "@/components/NorthbridgeLogo";
import { useState } from "react";

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
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/98 backdrop-blur-sm border-b border-white/5">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 min-h-[52px] sm:min-h-[56px]">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center shrink-0 transition-opacity hover:opacity-90"
            onClick={() => setMobileOpen(false)}
          >
            <NorthbridgeLogo className="h-10 sm:h-12" />
          </Link>

          {/* Desktop nav (md+) */}
          <ul className="hidden md:flex items-center gap-8 shrink-0">
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

          {/* Mobile menu button (sm-) */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center h-10 w-10 border border-white/10 bg-black/50 hover:border-white/20 hover:bg-white/5 transition-colors"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M6 6L18 18M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M4 7H20M4 12H20M4 17H20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="md:hidden mt-3 border border-white/10 bg-black/95">
            <ul className="flex flex-col">
              {navLinks.map((link) => (
                <li key={link.href} className="border-t border-white/10 first:border-t-0">
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-4 text-sm font-semibold tracking-wide text-white/90 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
