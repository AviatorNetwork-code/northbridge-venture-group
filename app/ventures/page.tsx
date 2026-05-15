import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ventures | Northbridge Venture Group",
  description:
    "Our ventures include Aviator Network and AirTax Financial—aviation and financial services brands operated by Northbridge Venture Group.",
};

const ventures = [
  {
    name: "Aviator Network",
    href: "https://aviatornetwork.com",
    description:
      "Connecting student pilots with flight instructors through private profiles, training requests, and verified connections.",
  },
  {
    name: "AirTax Financial",
    href: "https://airtaxfinancial.com",
    description:
      "Premium tax and financial services for pilots and aviation professionals—filing support, notices, and guidance.",
  },
];

export default function Ventures() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24">
      <h1 className="text-4xl font-bold text-northbridge-black">Ventures</h1>
      <p className="mt-4 text-lg text-black/80 max-w-2xl">
        We build and operate brands in aviation and financial services. Our ventures are listed
        below.
      </p>
      <div className="mt-12 space-y-8">
        {ventures.map((v) => (
          <a
            key={v.name}
            href={v.href}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-8 rounded-xl border border-black/10 hover:border-northbridge-red/40 hover:shadow-lg transition-all"
          >
            <h2 className="text-2xl font-bold text-northbridge-black">{v.name}</h2>
            <p className="mt-3 text-black/80">{v.description}</p>
            <span className="mt-4 inline-block text-northbridge-red font-semibold">
              {v.href.replace("https://", "")} →
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
