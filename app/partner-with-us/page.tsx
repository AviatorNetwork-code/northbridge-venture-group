import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partner With Us | Northbridge Venture Group",
  description:
    "Explore partnership opportunities with Northbridge Venture Group and our ventures in aviation and financial services.",
};

export default function PartnerWithUs() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24">
      <h1 className="text-4xl font-bold text-northbridge-black">Partner With Us</h1>
      <p className="mt-6 text-lg text-black/80 max-w-2xl">
        We work with flight schools, insurers, financiers, and other organizations that align
        with our ventures. If you are interested in partnering with Northbridge Venture Group
        or one of our brands, we would like to hear from you.
      </p>
      <div className="mt-10">
        <Link
          href="/contact"
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-white bg-northbridge-red hover:opacity-90 transition-opacity"
        >
          Get in Touch
        </Link>
      </div>
    </div>
  );
}
