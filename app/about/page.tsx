import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Northbridge Venture Group",
  description:
    "Northbridge Venture Group is a Florida-based company building ventures in aviation and financial services.",
};

export default function About() {
  return (
    <div className="nb-page">
      <h1 className="nb-h1">About</h1>
      <p className="mt-6 nb-lead max-w-2xl">
        Northbridge Venture Group LLC is a Florida limited liability company that builds and
        operates ventures in aviation and financial services. Our portfolio includes Aviator
        Network—connecting student pilots with flight instructors—and AirTax Financial—providing
        tax and financial support for aviation professionals.
      </p>
      <p className="mt-4 nb-lead max-w-2xl">
        We focus on clarity, compliance, and long-term value in every venture we launch.
      </p>
    </div>
  );
}
