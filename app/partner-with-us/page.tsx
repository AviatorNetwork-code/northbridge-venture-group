import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partner With Us | Northbridge Venture Group",
  description:
    "Explore partnership opportunities with Northbridge Venture Group and our ventures in aviation and financial services.",
};

export default function PartnerWithUs() {
  return (
    <div className="nb-page">
      <h1 className="nb-h1">Partner With Us</h1>
      <p className="mt-6 nb-lead max-w-2xl">
        We work with flight schools, insurers, financiers, and other organizations that align
        with our ventures. If you are interested in partnering with Northbridge Venture Group
        or one of our brands, we would like to hear from you.
      </p>
      <div className="mt-10">
        <Link href="/contact" className="btn-primary">
          Get in Touch
        </Link>
      </div>
    </div>
  );
}
