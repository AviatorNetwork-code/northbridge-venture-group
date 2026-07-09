"use client";

import { useEffect } from "react";
import Link from "next/link";
import NordiPublicCta from "@/components/home/NordiPublicCta";
import { IconClose } from "@/components/operations/icons";
import { publicWebsiteMenuLinks } from "@/lib/public-navigation";

type PublicWebsiteMenuProps = {
  open: boolean;
  onClose: () => void;
};

export default function PublicWebsiteMenu({ open, onClose }: PublicWebsiteMenuProps) {
  useEffect(() => {
    if (!open) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Explore Northbridge">
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-black/60 backdrop-blur-sm animate-fade-in"
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-xs flex-col border-l border-white/10 bg-charcoal shadow-2xl animate-fade-slide-up sm:max-w-sm">
        <header className="flex items-start justify-between gap-3 border-b border-white/10 px-5 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-red">
              Northbridge Venture Group
            </p>
            <h2 className="mt-1 text-lg font-semibold text-white">Explore the website</h2>
            <p className="mt-2 text-sm leading-relaxed text-silver">
              Nordi is your homepage. Browse company pages anytime — your chat stays open behind this menu.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-md text-silver transition-colors hover:bg-white/5 hover:text-white"
          >
            <IconClose className="h-5 w-5" />
          </button>
        </header>

        <nav aria-label="Public website pages" className="flex-1 overflow-y-auto px-2 py-3">
          <ul className="flex flex-col">
            {publicWebsiteMenuLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="flex min-h-12 items-center rounded-lg px-4 text-sm font-medium text-silver transition-colors hover:bg-white/5 hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <footer className="border-t border-white/10 px-5 py-4">
          <NordiPublicCta variant="header" href="/" className="w-full" />
        </footer>
      </aside>
    </div>
  );
}
