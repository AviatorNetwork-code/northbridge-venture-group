"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconCat, IconMenu, NavIcon } from "@/components/operations/icons";

type OperationsBottomNavProps = {
  onOpenNav: () => void;
  onOpenCat: () => void;
};

const primaryItems = [
  { id: "dashboard", label: "Home", href: "/operations" },
  { id: "digital-workforce", label: "Hire", href: "/operations/hire" },
  { id: "connectors", label: "Connect", href: "/operations/connectors" },
  { id: "onboarding", label: "Launch", href: "/operations/launch" },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === "/operations") return pathname === "/operations";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function OperationsBottomNav({ onOpenNav, onOpenCat }: OperationsBottomNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-charcoal/95 backdrop-blur-md lg:hidden"
      aria-label="Operations primary navigation"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="mx-auto grid max-w-lg grid-cols-5 items-stretch">
        {primaryItems.map((item) => {
          const active = isActive(pathname, item.href);

          return (
            <Link
              key={item.id}
              href={item.href}
              className={[
                "flex min-h-14 flex-col items-center justify-center gap-1 px-1 py-2 text-[10px] font-medium transition-colors",
                active ? "text-red" : "text-stone hover:text-white",
              ].join(" ")}
              aria-current={active ? "page" : undefined}
            >
              <NavIcon id={item.id} className="h-5 w-5 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}

        <button
          type="button"
          onClick={onOpenNav}
          className="flex min-h-14 flex-col items-center justify-center gap-1 px-1 py-2 text-[10px] font-medium text-stone transition-colors hover:text-white"
          aria-label="Open full navigation menu"
        >
          <IconMenu className="h-5 w-5 shrink-0" />
          <span>Menu</span>
        </button>
      </div>

      <button
        type="button"
        onClick={onOpenCat}
        aria-label="Open CAT Workforce Advisor"
        className="absolute -top-7 right-4 flex h-14 w-14 items-center justify-center rounded-full bg-red text-white shadow-lg transition-colors hover:bg-red-hover focus:outline-none focus:ring-2 focus:ring-red/50 sm:right-6"
      >
        <IconCat className="h-6 w-6" />
      </button>
    </nav>
  );
}
