import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="flex flex-col gap-10 sm:gap-14">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10 md:gap-20">
            <div className="flex flex-col gap-3">
              <Link href="/" className="inline-block w-fit">
                <Image
                  src="/northbridge-logo.png"
                  alt="Northbridge Venture Group"
                  width={200}
                  height={60}
                  className="h-8 sm:h-9 w-auto"
                />
              </Link>
              <p className="text-silver text-sm max-w-[240px] leading-relaxed">
                Intelligent Systems for Growing Industries
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-10 sm:gap-16">
              <div>
                <h4 className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-silver/80 mb-3">
                  Navigation
                </h4>
                <ul className="space-y-2.5">
                  <li>
                    <Link
                      href="/"
                      className="text-sm text-white/75 hover:text-white transition-colors"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about"
                      className="text-sm text-white/75 hover:text-white transition-colors"
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/portfolio"
                      className="text-sm text-white/75 hover:text-white transition-colors"
                    >
                      Ventures
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/clients"
                      className="text-sm text-white/75 hover:text-white transition-colors"
                    >
                      Clients
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="text-sm text-white/75 hover:text-white transition-colors"
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-silver/80 mb-3">
                  Ventures
                </h4>
                <ul className="space-y-2.5 text-sm text-white/60">
                  <li>Aviator Network</li>
                  <li>AirTax Financial</li>
                  <li>Northbridge Digital</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-6 sm:pt-8 border-t border-white/10">
            <p className="text-[11px] sm:text-xs text-silver/60">
              © {new Date().getFullYear()} Northbridge Venture Group. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
