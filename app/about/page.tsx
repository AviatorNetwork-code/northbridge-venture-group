import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Northbridge Venture Group",
  description:
    "Learn about Northbridge Venture Group, our approach to building and investing in aviation and financial technology ventures.",
};

export default function AboutPage() {
  return (
    <main className="pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-charcoal mb-8">
          About Us
        </h1>
        <div className="prose prose-lg text-stone space-y-6">
          <p>
            Northbridge Venture Group is a holding company focused on developing
            and investing in ventures across aviation and financial technology.
            We take a long-term view, combining strategic capital with
            operational expertise to build companies that serve their markets
            with excellence.
          </p>
          <p>
            Our portfolio spans aviation connectivity, financial services for
            aviation professionals, and flight training. Each company operates
            with the support of shared resources and a unified commitment to
            quality and integrity.
          </p>
          <p>
            We believe in building enduring businesses through discipline,
            transparency, and a focus on sustainable growth. Our approach is
            collaborative and hands-on, supporting our companies through every
            stage of development.
          </p>
        </div>
      </div>
    </main>
  );
}
