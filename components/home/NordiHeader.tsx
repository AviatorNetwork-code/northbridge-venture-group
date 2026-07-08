"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { IconClose } from "@/components/operations/icons";

const menuItems = [
  { label: "About Northbridge", href: "/about" },
  { label: "Business Dashboard", href: "/operations" },
  { label: "Connected Services", href: "/operations/connectors" },
  { label: "Help", href: "/help" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
];

export default function NordiHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

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
      <div className="grid h-14 grid-cols-[3rem_1fr_3rem] items-center px-3 sm:h-16 sm:px-4">
        <div aria-hidden />

        <Link
          href="/"
          className="justify-self-center text-lg font-semibold uppercase tracking-[0.35em] text-white transition-opacity hover:opacity-80 sm:text-xl"
          aria-label="Nordi home"
        >
          NORDI
        </Link>

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          aria-expanded={menuOpen}
          className="inline-flex min-h-11 min-w-11 items-center justify-center justify-self-end rounded-md text-silver transition-colors hover:bg-white/5 hover:text-white"
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
        <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Menu">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 h-full w-full cursor-default bg-black/60 backdrop-blur-sm animate-fade-in"
          />

          <nav className="absolute right-0 top-0 flex h-full w-full max-w-xs flex-col border-l border-white/10 bg-charcoal shadow-2xl animate-fade-slide-up">
            <div className="flex h-14 items-center justify-between border-b border-white/10 px-4 sm:h-16">
              <span className="text-sm font-semibold uppercase tracking-[0.3em] text-white">
                NORDI
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
              {menuItems.map((item) => (
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

            <div className="mt-auto border-t border-white/10 px-5 py-4">
              <p className="text-xs leading-relaxed text-stone">
                Nordi is your business advisor from Northbridge Digital.
              </p>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
