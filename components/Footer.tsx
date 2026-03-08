import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-charcoal/10 bg-charcoal text-cream">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row justify-between gap-12">
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Northbridge Venture Group
            </h3>
            <p className="text-silver text-sm max-w-xs">
              Building and investing in ventures that shape the future of
              aviation and financial services.
            </p>
          </div>
          <div className="flex gap-12">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-silver mb-4">
                Navigation
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-sm hover:text-white transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-sm hover:text-white transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/portfolio"
                    className="text-sm hover:text-white transition-colors"
                  >
                    Portfolio
                  </Link>
                </li>
                <li>
                  <Link
                    href="/digital"
                    className="text-sm hover:text-white transition-colors"
                  >
                    Digital
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-sm hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-silver mb-4">
                Portfolio
              </h4>
              <ul className="space-y-2 text-sm text-silver">
                <li>Aviator Network</li>
                <li>AirTax Financial</li>
                <li>Royal Flight School</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-charcoal/30">
          <p className="text-xs text-silver">
            © {new Date().getFullYear()} Northbridge Venture Group. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
