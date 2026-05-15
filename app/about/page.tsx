import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Northbridge Venture Group",
  description:
    "Northbridge Venture Group is a Florida-based company building ventures in aviation and financial services.",
};

export default function About() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24">
      <h1 className="text-4xl font-bold text-northbridge-black">About</h1>
      <p className="mt-6 text-lg text-black/80 max-w-2xl">
        Northbridge Venture Group LLC is a Florida limited liability company that builds and
        operates ventures in aviation and financial services. Our portfolio includes Aviator
        Network—connecting student pilots with flight instructors—and AirTax Financial—providing
        tax and financial support for aviation professionals.
      </p>
      <p className="mt-4 text-lg text-black/80 max-w-2xl">
        We focus on clarity, compliance, and long-term value in every venture we launch.
      </p>
    </div>
  );
}
