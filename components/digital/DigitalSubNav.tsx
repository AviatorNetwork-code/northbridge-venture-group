"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { digitalNavItems, futureNavItems } from "@/lib/digital/navigation";

export function DigitalSubNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Northbridge Digital" className="nb-digital-nav">
      <div className="mx-auto flex max-w-6xl items-center gap-x-8 gap-y-0 overflow-x-auto px-5 sm:px-8">
        <p className="hidden shrink-0 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white/35 sm:block">
          Digital
        </p>
        <div className="flex min-w-0 flex-1 gap-x-6">
          {digitalNavItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === "/services"
                ? pathname === "/services"
                : pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nb-digital-nav-link shrink-0 whitespace-nowrap ${
                  isActive ? "nb-digital-nav-link-active" : ""
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
        <div className="hidden shrink-0 items-center gap-4 border-l border-white/[0.06] pl-6 md:flex">
          {futureNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="py-3 text-xs font-medium text-white/30 transition-colors hover:text-white/50"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
