import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | Northbridge Venture Group",
  description:
    "Digital infrastructure and platform development services from Northbridge Venture Group, including websites, mobile applications, lead systems, and integrations.",
};

export default function ServicesPage() {
  return (
    <main className="pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 bg-black min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Intro */}
        <section className="mb-12 sm:mb-14">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white mb-4">
            Services
          </h1>
          <p className="text-silver text-sm sm:text-base leading-relaxed max-w-3xl">
            Northbridge provides digital infrastructure services to help
            organizations build reliable online systems, strengthen their digital
            presence, and launch technology-enabled products. Services are
            delivered as structured development engagements rather than automated
            purchases.
          </p>
        </section>

        {/* Website Development */}
        <section className="mb-12 sm:mb-14">
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-3">
            Website Development
          </h2>
          <div className="space-y-8">
            {/* Starter Website */}
            <div className="border border-white/10 p-5 sm:p-6 bg-slate/60">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">
                Starter Website
              </h3>
              <p className="text-silver text-sm mb-2">
                Estimated price: $300–$500
              </p>
              <p className="text-silver text-sm mb-4">
                Estimated timeline: 1–3 business days after all required content
                is received.
              </p>
              <div className="grid gap-4 sm:grid-cols-2 text-sm text-silver">
                <div>
                  <p className="font-semibold text-white mb-1.5">Included</p>
                  <ul className="space-y-1.5">
                    <li>• up to 3 pages</li>
                    <li>• mobile responsive layout</li>
                    <li>• template-based design</li>
                    <li>• contact form</li>
                    <li>• Google Maps integration if applicable</li>
                    <li>• domain connection</li>
                    <li>• SSL certificate configuration</li>
                    <li>• basic SEO metadata</li>
                    <li>• basic analytics setup</li>
                    <li>• optimization of up to 5 client-provided images</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-white mb-1.5">
                    Revisions & Scope
                  </p>
                  <p className="mb-2">• 1 revision round included.</p>
                  <p className="font-semibold text-white mb-1.5">
                    Client responsibilities
                  </p>
                  <ul className="space-y-1.5 mb-2">
                    <li>• provide text</li>
                    <li>• provide images</li>
                    <li>• provide logo if available</li>
                    <li>• provide domain access if domain already exists</li>
                  </ul>
                  <p className="font-semibold text-white mb-1.5">Not included</p>
                  <p className="text-xs">
                    copywriting, custom graphics, blog setup, booking systems,
                    payment systems, SEO campaigns, ongoing updates.
                  </p>
                </div>
              </div>
            </div>

            {/* Business Website */}
            <div className="border border-white/10 p-5 sm:p-6 bg-slate/60">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">
                Business Website
              </h3>
              <p className="text-silver text-sm mb-2">
                Estimated price: $900–$1,800
              </p>
              <p className="text-silver text-sm mb-4">
                Estimated timeline: 1–2 weeks.
              </p>
              <div className="grid gap-4 sm:grid-cols-2 text-sm text-silver">
                <div>
                  <p className="font-semibold text-white mb-1.5">Included</p>
                  <ul className="space-y-1.5">
                    <li>• everything in Starter Website, as applicable</li>
                    <li>• up to 8 pages</li>
                    <li>• service detail pages</li>
                    <li>• lead capture forms</li>
                    <li>• blog or insights structure</li>
                    <li>• expanded SEO structure</li>
                    <li>• analytics / visitor tracking</li>
                    <li>• image optimization</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-white mb-1.5">Revisions</p>
                  <p className="mb-2">• 2 revision rounds included.</p>
                  <p className="font-semibold text-white mb-1.5">Not included</p>
                  <p className="text-xs">
                    ongoing SEO campaigns, ad management, complex software
                    features, marketplace functionality.
                  </p>
                </div>
              </div>
            </div>

            {/* Professional Website */}
            <div className="border border-white/10 p-5 sm:p-6 bg-slate/60">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">
                Professional Website
              </h3>
              <p className="text-silver text-sm mb-2">
                Estimated price: $2,500–$5,000
              </p>
              <p className="text-silver text-sm mb-4">
                Estimated timeline: 3–5 weeks.
              </p>
              <div className="grid gap-4 sm:grid-cols-2 text-sm text-silver">
                <div>
                  <p className="font-semibold text-white mb-1.5">Included</p>
                  <ul className="space-y-1.5">
                    <li>• up to 15 pages</li>
                    <li>• custom layout sections</li>
                    <li>• advanced contact forms</li>
                    <li>• CRM integration</li>
                    <li>• appointment booking integration</li>
                    <li>• conversion-focused structure</li>
                    <li>• performance optimization</li>
                    <li>• structured SEO setup</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-white mb-1.5">Revisions</p>
                  <p className="mb-2">• up to 3 revision rounds included.</p>
                  <p className="font-semibold text-white mb-1.5">Not included</p>
                  <p className="text-xs">
                    SaaS platform development, large marketplace systems,
                    enterprise software.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Applications */}
        <section className="mb-12 sm:mb-14">
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-3">
            Mobile Applications
          </h2>
          <div className="space-y-6 text-sm text-silver">
            <div className="border border-white/10 p-5 sm:p-6 bg-slate/60">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">
                iOS App Development
              </h3>
              <p className="mb-2">Estimated price: $3,000–$12,000+</p>
              <p className="mb-4">Estimated timeline: 4–10 weeks.</p>
              <p className="mb-3">
                Suitable for businesses that require a dedicated mobile
                experience or platform extension.
              </p>
              <p className="font-semibold text-white mb-1.5">
                Possible features
              </p>
              <ul className="space-y-1.5 mb-3">
                <li>• user login</li>
                <li>• backend integration</li>
                <li>• dashboards</li>
                <li>• push notifications</li>
                <li>• App Store deployment</li>
              </ul>
              <p className="text-xs">
                Actual scope and cost depend on feature complexity, backend
                requirements, and testing needs.
              </p>
            </div>

            <div className="border border-white/10 p-5 sm:p-6 bg-slate/60">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">
                iOS App Publishing
              </h3>
              <p className="mb-2">Estimated price: $400–$900</p>
              <p className="mb-4">Estimated timeline: 1–2 weeks.</p>
              <p className="font-semibold text-white mb-1.5">Included</p>
              <ul className="space-y-1.5 mb-3">
                <li>• App Store listing preparation</li>
                <li>• TestFlight configuration</li>
                <li>• screenshot guidance or preparation</li>
                <li>• submission to Apple review</li>
              </ul>
              <p className="font-semibold text-white mb-1.5">Not included</p>
              <p className="text-xs">
                application development, bug fixing, and feature additions unless
                separately scoped.
              </p>
            </div>
          </div>
        </section>

        {/* Online Presence */}
        <section className="mb-12 sm:mb-14">
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-3">
            Online Presence
          </h2>
          <div className="space-y-6 text-sm text-silver">
            <div className="border border-white/10 p-5 sm:p-6 bg-slate/60">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">
                Local SEO Setup
              </h3>
              <p className="mb-2">Estimated price: $250–$600</p>
              <p className="mb-4">Estimated timeline: 3–5 business days.</p>
              <p className="font-semibold text-white mb-1.5">Included</p>
              <ul className="space-y-1.5 mb-3">
                <li>• Google Business Profile setup or optimization</li>
                <li>• map listing optimization</li>
                <li>• category / service area configuration</li>
                <li>• basic business citations</li>
              </ul>
              <p className="font-semibold text-white mb-1.5">Not included</p>
              <p className="text-xs">
                monthly SEO campaigns, backlink campaigns, advertising management.
              </p>
            </div>

            <div className="border border-white/10 p-5 sm:p-6 bg-slate/60">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">
                Social Media Setup
              </h3>
              <p className="mb-2">Estimated price: $200–$400</p>
              <p className="font-semibold text-white mb-1.5 mt-3">Included</p>
              <ul className="space-y-1.5 mb-3">
                <li>• Instagram Business setup</li>
                <li>• Facebook Business Page setup</li>
                <li>• LinkedIn Company Page setup</li>
                <li>• profile optimization</li>
                <li>• business info / link setup</li>
              </ul>
              <p className="font-semibold text-white mb-1.5">Not included</p>
              <p className="text-xs">
                monthly posting, growth management, ad management.
              </p>
            </div>
          </div>
        </section>

        {/* Lead Systems & Automation */}
        <section className="mb-12 sm:mb-14">
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-3">
            Lead Systems & Automation
          </h2>
          <div className="space-y-6 text-sm text-silver">
            <div className="border border-white/10 p-5 sm:p-6 bg-slate/60">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">
                Lead Capture Landing Page
              </h3>
              <p className="mb-2">Estimated price: $350–$700</p>
              <p className="mb-4">Estimated timeline: 3–5 business days.</p>
              <p className="font-semibold text-white mb-1.5">Included</p>
              <ul className="space-y-1.5 mb-3">
                <li>• single landing page</li>
                <li>• lead capture form</li>
                <li>• email notification setup</li>
                <li>• analytics setup</li>
                <li>• mobile responsive layout</li>
              </ul>
              <p className="font-semibold text-white mb-1.5">Not included</p>
              <p className="text-xs">
                ad management, advanced CRM automation unless separately scoped.
              </p>
            </div>

            <div className="border border-white/10 p-5 sm:p-6 bg-slate/60">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">
                CRM / Lead Funnel Setup
              </h3>
              <p className="mb-2">Estimated price: $900–$1,800</p>
              <p className="font-semibold text-white mb-1.5 mt-3">Included</p>
              <ul className="space-y-1.5 mb-3">
                <li>• CRM configuration</li>
                <li>• lead pipeline setup</li>
                <li>• automated email response setup</li>
                <li>• lead tracking structure</li>
              </ul>
              <p className="font-semibold text-white mb-1.5">Not included</p>
              <p className="text-xs">
                sales team management, paid ad campaign management.
              </p>
            </div>
          </div>
        </section>

        {/* Infrastructure & Integrations */}
        <section className="mb-12 sm:mb-14">
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-3">
            Infrastructure & Integrations
          </h2>
          <div className="space-y-6 text-sm text-silver">
            <div className="border border-white/10 p-5 sm:p-6 bg-slate/60">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">
                Domain & URL Setup
              </h3>
              <p className="mt-3">
                Northbridge can connect a custom domain and configure DNS so
                businesses operate through a professional web address.
              </p>
              <p className="font-semibold text-white mb-1.5 mt-3">Included</p>
              <ul className="space-y-1.5 mb-3">
                <li>• domain connection</li>
                <li>• DNS configuration</li>
                <li>• SSL certificate setup</li>
                <li>• redirect setup if needed</li>
              </ul>
              <p className="text-xs mb-2">
                DNS propagation may take up to 24 hours.
              </p>
              <p className="text-xs">
                If the client does not yet own a domain, Northbridge can assist
                with selection and registration guidance, but the domain should
                be owned by the client.
              </p>
            </div>

            <div className="border border-white/10 p-5 sm:p-6 bg-slate/60">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">
                Payment Integration
              </h3>
              <p className="mb-2">Estimated price: $250–$600</p>
              <p className="font-semibold text-white mb-1.5 mt-3">Included</p>
              <ul className="space-y-1.5 mb-3">
                <li>• Stripe configuration</li>
                <li>• payment page setup</li>
                <li>• basic transaction testing</li>
              </ul>
              <p className="font-semibold text-white mb-1.5">Not included</p>
              <p className="text-xs">
                accounting integration, financial compliance consulting.
              </p>
            </div>

            <div className="border border-white/10 p-5 sm:p-6 bg-slate/60">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">
                Booking System Setup
              </h3>
              <p className="mb-2">Estimated price: $250–$600</p>
              <p className="font-semibold text-white mb-1.5 mt-3">Included</p>
              <ul className="space-y-1.5 mb-3">
                <li>• booking page setup</li>
                <li>• calendar integration</li>
                <li>• confirmation emails</li>
              </ul>
              <p className="font-semibold text-white mb-1.5">Not included</p>
              <p className="text-xs">
                custom booking software, marketplace-level booking systems.
              </p>
            </div>
          </div>
        </section>

        {/* Industry Focus */}
        <section className="mb-12 sm:mb-14">
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-3">
            Industry Focus
          </h2>
          <p className="text-silver text-sm sm:text-base leading-relaxed mb-4 max-w-3xl">
            Northbridge has particular familiarity with digital infrastructure
            needs in the following industries.
          </p>
          <div className="flex flex-wrap gap-3 mb-4">
            <span className="px-4 py-2 border border-white/15 text-sm text-silver">
              Aviation
            </span>
            <span className="px-4 py-2 border border-white/15 text-sm text-silver">
              Financial & Professional Services
            </span>
            <span className="px-4 py-2 border border-white/15 text-sm text-silver">
              Transportation & Logistics
            </span>
            <span className="px-4 py-2 border border-white/15 text-sm text-silver">
              Service-Based Businesses
            </span>
          </div>
          <p className="text-silver text-sm sm:text-base leading-relaxed max-w-3xl">
            While Northbridge has strong specialty in these areas, projects in
            other industries may also be considered when operational
            requirements are clear and the project aligns with our development
            capabilities.
          </p>
        </section>

        {/* Example Platforms / References */}
        <section className="mb-12 sm:mb-14">
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-3">
            Example Platforms
          </h2>
          <div className="border border-white/10 p-5 sm:p-6 bg-slate/60 text-sm text-silver">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-1.5">
              Aviator Network
            </h3>
            <p className="mb-3">
              A digital marketplace platform developed within the Northbridge
              ecosystem to connect pilots and flight instructors.
            </p>
            <p className="mb-3">
              The platform demonstrates Northbridge&apos;s ability to build more
              than simple websites, including user accounts, transactional
              systems, and administrative tooling.
            </p>
            <ul className="space-y-1.5 mb-3">
              <li>• user profiles</li>
              <li>• marketplace search and filtering</li>
              <li>• messaging system</li>
              <li>• digital logbook</li>
              <li>• wallet and credit system</li>
              <li>• admin dashboards</li>
            </ul>
            <a
              href="https://aviatornetwork.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm font-medium text-red hover:text-red-hover transition-colors underline underline-offset-4"
            >
              Visit Aviator Network →
            </a>
          </div>
        </section>

        {/* How Projects Work */}
        <section className="mb-12 sm:mb-14">
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red mb-3">
            How Projects Work
          </h2>
          <div className="space-y-4 text-sm sm:text-base text-silver leading-relaxed">
            <div>
              <p className="font-semibold text-white mb-1.5">
                1. Initial Consultation
              </p>
              <p>
                Discussion of goals, scope, and technical requirements to
                understand what needs to be built.
              </p>
            </div>
            <div>
              <p className="font-semibold text-white mb-1.5">
                2. Scope & Proposal
              </p>
              <p>
                Northbridge defines the recommended scope, timeline, and
                estimated cost for the engagement.
              </p>
            </div>
            <div>
              <p className="font-semibold text-white mb-1.5">3. Development</p>
              <p>
                Implementation begins according to the approved scope, with
                structured checkpoints where appropriate.
              </p>
            </div>
            <div>
              <p className="font-semibold text-white mb-1.5">
                4. Review & Revisions
              </p>
              <p>
                Client feedback is collected and revisions are applied according
                to the agreed revision structure.
              </p>
            </div>
            <div>
              <p className="font-semibold text-white mb-1.5">5. Launch</p>
              <p>
                The project is deployed and handed off with basic operational
                guidance and documentation as appropriate.
              </p>
            </div>
            <p className="text-xs">
              Estimated timelines begin after all required content, assets, and
              account access have been provided.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-white/10 pt-8 sm:pt-10 mt-4">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">
            Discuss Your Project
          </h2>
          <p className="text-silver text-sm sm:text-base leading-relaxed mb-4 max-w-3xl">
            If you are planning a digital infrastructure project, platform, or
            website initiative, you can request an initial consultation with
            Northbridge to explore scope and fit.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-8 py-3.5 text-sm font-medium bg-red text-white hover:bg-red-hover transition-colors"
          >
            Request Consultation
          </a>
        </section>
      </div>
    </main>
  );
}

