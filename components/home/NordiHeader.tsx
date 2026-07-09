"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import NorthbridgeLogo from "@/components/NorthbridgeLogo";
import NordiPublicCta from "@/components/home/NordiPublicCta";
import PublicNavLinks from "@/components/PublicNavLinks";
import { useNordiActivity } from "@/components/home/NordiActivityContext";
import { IconClose } from "@/components/operations/icons";
import {
  primaryPublicNavLinks,
  publicWebsiteMenuLinks,
} from "@/lib/public-navigation";

export default function NordiHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isActive } = useNordiActivity();

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [menuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-black/90 backdrop-blur-md">
      <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center gap-3 px-3 sm:h-20 sm:px-4 lg:gap-6">
        <Link
          href="/"
          className="flex shrink-0 items-center transition-opacity hover:opacity-90"
          aria-label="Northbridge Venture Group home"
        >
          <NorthbridgeLogo className="h-16 sm:h-[4.5rem]" />
        </Link>

        <PublicNavLinks
          links={primaryPublicNavLinks}
          className="hidden min-w-0 flex-1 lg:block"
          linkClassName="inline-flex min-h-11 items-center whitespace-nowrap text-sm font-medium text-silver transition-colors hover:text-white"
        />

        <Link
          href="/"
          className="ml-auto inline-flex items-center gap-2.5 text-base font-semibold uppercase tracking-[0.3em] text-white transition-opacity hover:opacity-80 sm:text-lg lg:ml-0 lg:justify-self-center lg:tracking-[0.35em]"
          aria-label="Nordi home"
        >
          <span
            aria-hidden
            className={[
              "nordi-activity-orb shrink-0",
              isActive ? "nordi-activity-orb-active" : "",
            ].join(" ")}
          />
          NORDI
        </Link>

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open website menu"
          aria-expanded={menuOpen}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-silver transition-colors hover:bg-white/5 hover:text-white lg:hidden"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M4 7H20M4 12H20M4 17H20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {menuOpen ? (
        <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label="Website menu">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 h-full w-full cursor-default bg-black/60 backdrop-blur-sm animate-fade-in"
          />

          <nav className="absolute right-0 top-0 flex h-full w-full max-w-xs flex-col border-l border-white/10 bg-charcoal shadow-2xl animate-fade-slide-up">
            <div className="flex h-[4.5rem] items-center justify-between border-b border-white/10 px-4 sm:h-20">
              <span className="text-sm font-semibold uppercase tracking-[0.3em] text-white">
                Northbridge
              </span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-silver transition-colors hover:bg-white/5 hover:text-white"
              >
                <IconClose className="h-5 w-5" />
              </button>
            </div>

            <ul className="flex flex-col px-2 py-3">
              {publicWebsiteMenuLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex min-h-12 items-center rounded-lg px-4 text-sm font-medium text-silver transition-colors hover:bg-white/5 hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-auto space-y-3 border-t border-white/10 px-5 py-4">
              <NordiPublicCta variant="header" className="w-full" />
              <p className="text-xs leading-relaxed text-stone">
                Your conversation is saved locally while you browse. Use Resume Nordi on any page to pick up where you left off.
              </p>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
