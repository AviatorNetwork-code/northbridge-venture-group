import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | Northbridge Venture Group",
  description:
    "Northbridge Venture Group operates ventures that provide aviation training discovery and tax and financial services.",
};

export default function Services() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24">
      <h1 className="text-4xl font-bold text-northbridge-black">Services</h1>
      <p className="mt-6 text-lg text-black/80 max-w-2xl">
        Our ventures deliver services through their own brands. For aviation training and
        instructor matching, visit{" "}
        <a
          href="https://aviatornetwork.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-northbridge-red font-semibold hover:underline"
        >
          Aviator Network
        </a>
        . For tax and financial support for aviation professionals, visit{" "}
        <a
          href="https://airtaxfinancial.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-northbridge-red font-semibold hover:underline"
        >
          AirTax Financial
        </a>
        .
      </p>
      <p className="mt-4 text-lg text-black/80 max-w-2xl">
        For partnership or corporate inquiries, please{" "}
        <a href="/contact" className="text-northbridge-red font-semibold hover:underline">
          contact us
        </a>
        .
      </p>
    </div>
  );
}
