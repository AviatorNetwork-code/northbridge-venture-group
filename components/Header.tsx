"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { isNavActive, primaryNav } from "@/lib/site-navigation";

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeMenu();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen, closeMenu]);

  return (
    <header className="nb-header">
      <a href="#main-content" className="nb-skip-link">
        Skip to content
      </a>
      <div className="mx-auto flex max-w-6xl min-w-0 items-center justify-between gap-3 px-4 py-3.5 sm:px-6 lg:px-8 sm:py-4">
        <Link
          href="/"
          className="min-w-0 text-base font-semibold tracking-tight text-white transition-colors hover:text-northbridge-red sm:text-lg"
        >
          Northbridge
          <span className="hidden text-white/60 font-normal sm:inline"> Venture Group</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6 xl:gap-7" aria-label="Primary">
          {primaryNav.map((item) => {
            const active = isNavActive(pathname, item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nb-nav-link ${active ? "nb-nav-link-active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block shrink-0">
          <Link href="/digital/assessment" className="btn-primary whitespace-nowrap text-sm px-5">
            Business Diagnostic
          </Link>
        </div>

        <button
          type="button"
          className="lg:hidden inline-flex min-h-[2.75rem] min-w-[2.75rem] shrink-0 items-center justify-center rounded-md border border-white/15 p-2.5 text-white"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
            className="text-white"
          >
            {menuOpen ? (
              <path
                d="M5 5l10 10M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M3 6h14M3 10h14M3 14h14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <nav
          id="mobile-nav"
          className="lg:hidden border-t border-white/[0.06] bg-northbridge-black px-4 py-6 sm:px-6"
          aria-label="Mobile primary"
        >
          <ul className="space-y-1">
            {primaryNav.map((item) => {
              const active = isNavActive(pathname, item);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block min-h-[2.75rem] rounded-md px-3 py-3 text-base font-medium transition-colors ${
                      active ? "bg-white/[0.06] text-white" : "text-white/70 hover:text-white"
                    }`}
                    aria-current={active ? "page" : undefined}
                    onClick={closeMenu}
                  >
                    {item.label}
                    {item.description && (
                      <span className="mt-0.5 block text-xs font-normal text-northbridge-red/80">
                        {item.description}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-6 pt-6 border-t border-white/[0.06]">
            <Link href="/digital/assessment" className="btn-primary w-full" onClick={closeMenu}>
              Business Diagnostic
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
