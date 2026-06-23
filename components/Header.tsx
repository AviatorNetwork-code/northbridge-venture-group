"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { isNavActive, primaryNav } from "@/lib/site-navigation";

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="nb-header">
      <a href="#main-content" className="nb-skip-link">
        Skip to content
      </a>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-white transition-colors hover:text-northbridge-red sm:text-lg"
        >
          Northbridge
          <span className="hidden text-white/50 font-normal sm:inline"> Venture Group</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7" aria-label="Primary">
          {primaryNav.map((item) => {
            const active = isNavActive(pathname, item);
            const isConsulting = item.href === "/services";
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nb-nav-link ${active ? "nb-nav-link-active" : ""} ${
                  isConsulting ? "nb-nav-link-consulting" : ""
                }`}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
                {isConsulting && (
                  <span className="ml-1.5 hidden xl:inline text-[0.65rem] font-semibold uppercase tracking-wider text-northbridge-red/80">
                    Digital
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <Link href="/digital/assessment" className="btn-primary text-sm px-5">
            Business Diagnostic
          </Link>
        </div>

        <button
          type="button"
          className="lg:hidden inline-flex items-center justify-center rounded-md border border-white/15 p-2.5 text-white"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
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
          className="lg:hidden border-t border-white/[0.06] bg-northbridge-black px-5 py-6"
          aria-label="Mobile primary"
        >
          <ul className="space-y-1">
            {primaryNav.map((item) => {
              const active = isNavActive(pathname, item);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block rounded-md px-3 py-3 text-base font-medium transition-colors ${
                      active ? "bg-white/[0.06] text-white" : "text-white/70 hover:text-white"
                    }`}
                    aria-current={active ? "page" : undefined}
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
            <Link href="/digital/assessment" className="btn-primary w-full">
              Business Diagnostic
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
