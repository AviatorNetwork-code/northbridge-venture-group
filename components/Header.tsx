"use client";

import Link from "next/link";
import NorthbridgeLogo from "@/components/NorthbridgeLogo";
import NordiPublicCta from "@/components/home/NordiPublicCta";
import PublicNavLinks from "@/components/PublicNavLinks";
import { useState } from "react";
import {
  primaryPublicNavLinks,
  publicWebsiteMenuLinks,
} from "@/lib/public-navigation";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/95 backdrop-blur-md">
      <nav className="mx-auto max-w-6xl px-4 py-3 sm:px-6 sm:py-4 min-h-[52px] sm:min-h-[56px]">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            className="flex shrink-0 items-center transition-opacity hover:opacity-90"
            onClick={() => setMobileOpen(false)}
          >
            <NorthbridgeLogo className="h-10 sm:h-12" />
          </Link>

          <PublicNavLinks
            links={primaryPublicNavLinks}
            className="hidden lg:block"
            linkClassName="inline-flex min-h-11 items-center text-[13px] font-semibold tracking-wide text-silver transition-colors hover:text-white"
          />

          <NordiPublicCta variant="header" className="hidden md:inline-flex shrink-0" />

          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center border border-white/10 bg-black/50 transition-colors hover:border-white/20 hover:bg-white/5 lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M6 6L18 18M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
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

        {mobileOpen ? (
          <div className="mt-3 border border-white/10 bg-black/95 lg:hidden">
            <div className="border-b border-white/10 px-4 py-3">
              <NordiPublicCta variant="header" className="flex w-full" />
            </div>
            <ul className="flex flex-col">
              {publicWebsiteMenuLinks.map((link) => (
                <li key={link.href} className="border-t border-white/10 first:border-t-0">
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-4 text-sm font-semibold tracking-wide text-white/90 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </nav>
    </header>
  );
}
