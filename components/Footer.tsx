import Link from "next/link";
import { PRIMARY_CONTACT_EMAIL } from "@/lib/contact";
import { footerNav } from "@/lib/site-navigation";
import { DIAGNOSTIC_PATH } from "@/lib/digital/metadata";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-northbridge-charcoal">
      <div className="mx-auto max-w-6xl min-w-0 px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="text-lg font-semibold tracking-tight text-white">
              Northbridge Venture Group
            </p>
            <p className="mt-3 max-w-md text-sm text-white/55 leading-relaxed">
              We build and operate ventures in aviation and financial services. Client advisory and
              operational improvement are delivered through Northbridge Digital.
            </p>
            <a
              href={`mailto:${PRIMARY_CONTACT_EMAIL}`}
              className="mt-5 inline-block text-sm font-medium text-white/70 transition-colors hover:text-northbridge-red"
            >
              {PRIMARY_CONTACT_EMAIL}
            </a>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <p className="nb-eyebrow">Navigate</p>
              <nav className="mt-4 flex flex-col gap-2.5" aria-label="Footer">
                {footerNav.map((item) => (
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
              <p className="nb-eyebrow">Northbridge Digital</p>
              <nav className="mt-4 flex flex-col gap-2.5" aria-label="Northbridge Digital">
                <Link href="/services" className="text-sm text-white/55 hover:text-white transition-colors">
                  Knowledge
                </Link>
                <Link
                  href="/services/industries"
                  className="text-sm text-white/55 hover:text-white transition-colors"
                >
                  Industries
                </Link>
                <Link
                  href="/services/expertise"
                  className="text-sm text-white/55 hover:text-white transition-colors"
                >
                  Expertise
                </Link>
                <Link
                  href={DIAGNOSTIC_PATH}
                  className="text-sm text-white/55 hover:text-white transition-colors"
                >
                  Business Diagnostic
                </Link>
              </nav>
            </div>
          </div>
        </div>

        <p className="mt-12 border-t border-white/[0.06] pt-8 text-sm text-white/40">
          © {new Date().getFullYear()} Northbridge Venture Group LLC. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
