import Link from "next/link";
import { PRIMARY_CONTACT_EMAIL } from "@/lib/contact";
import { footerNav, primaryNav } from "@/lib/site-navigation";
import { DIAGNOSTIC_PATH } from "@/lib/digital/metadata";
import { businessSolutions } from "@/lib/solutions";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-northbridge-charcoal">
      <div className="mx-auto max-w-6xl min-w-0 px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="text-lg font-semibold tracking-tight text-white">
              Northbridge Venture Group
            </p>
            <p className="mt-3 max-w-md text-sm text-white/55 leading-relaxed">
              We build platforms, deliver business solutions, and create custom systems through
              Northbridge Digital when your business needs something specific.
            </p>
            <a
              href={`mailto:${PRIMARY_CONTACT_EMAIL}`}
              className="mt-5 inline-block text-sm font-medium text-white/70 transition-colors hover:text-northbridge-red"
            >
              {PRIMARY_CONTACT_EMAIL}
            </a>
          </div>

          <div>
            <p className="nb-eyebrow">Navigate</p>
            <nav className="mt-4 flex flex-col gap-2.5" aria-label="Footer">
              {primaryNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-white/55 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="nb-eyebrow">Business Solutions</p>
            <nav className="mt-4 flex flex-col gap-2.5" aria-label="Business Solutions">
              {businessSolutions.map((solution) => (
                <Link
                  key={solution.slug}
                  href={`/solutions/${solution.slug}`}
                  className="text-sm text-white/55 hover:text-white transition-colors"
                >
                  {solution.name}
                </Link>
              ))}
            </nav>
            <p className="nb-eyebrow mt-8">Tools</p>
            <nav className="mt-4 flex flex-col gap-2.5" aria-label="Tools">
              <Link
                href={DIAGNOSTIC_PATH}
                className="text-sm text-white/55 hover:text-white transition-colors"
              >
                Business Diagnostic
              </Link>
              <Link
                href="/northbridge-digital"
                className="text-sm text-white/55 hover:text-white transition-colors"
              >
                Northbridge Digital
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/[0.06] pt-8">
          {footerNav
            .filter((item) => !primaryNav.some((p) => p.href === item.href))
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs text-white/40 hover:text-white/70 transition-colors"
              >
                {item.label}
              </Link>
            ))}
        </div>

        <p className="mt-6 text-sm text-northbridge-muted">
          © {new Date().getFullYear()} Northbridge Venture Group LLC. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
