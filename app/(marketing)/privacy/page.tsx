import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy | Northbridge Digital",
  description:
    "How Northbridge Digital and Nordi handle your business information, conversations, and privacy.",
};

const sections = [
  {
    title: "What you share",
    body: "You decide what to tell Nordi, and when. Nordi only asks for what is needed to understand your business and recommend the right approach. You are never required to complete a form.",
  },
  {
    title: "How it's used",
    body: "The details you share are used to advise you — to understand your operations and, when appropriate, recommend a digital workforce. Nothing you share is sold, and it is never used to train external models.",
  },
  {
    title: "Website analysis",
    body: "If you choose to share your website, Nordi reviews only the public pages to better understand your business. It does not access private systems or anything behind a login.",
  },
  {
    title: "Your control",
    body: "You can save a conversation to your identity or discard it entirely at any time. Sensitive actions always require your explicit authorization. You can also manage conversation learning in Privacy Settings.",
  },
  {
    title: "Security",
    body: "Your conversations and business details are handled with strict access controls, consistent with Northbridge Digital's security practices.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black px-4 pb-16 pt-24 sm:px-6 sm:pt-28 md:pt-32 md:pb-24">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-semibold tracking-tight text-white sm:mb-8 sm:text-4xl md:text-5xl">
          Privacy
        </h1>

        <p className="mb-10 max-w-2xl text-sm leading-relaxed text-silver sm:text-base">
          Trust comes before anything else. Here&apos;s how we handle the information you share
          with Nordi and Northbridge Digital.
        </p>

        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-red sm:text-sm">
                {section.title}
              </h2>
              <p className="text-sm leading-relaxed text-silver sm:text-base">{section.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-12">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-red px-6 text-sm font-semibold text-white transition-colors hover:bg-red-hover"
          >
            Talk to Nordi
          </Link>
        </div>
      </div>
    </main>
  );
}
