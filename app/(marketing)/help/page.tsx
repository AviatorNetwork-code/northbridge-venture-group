import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Help | Northbridge Digital",
  description:
    "Get help using Nordi, or reach our team directly.",
};

const topics = [
  {
    title: "Talking to Nordi",
    body: "Nordi is your business advisor. Describe your business in your own words on the homepage — there are no forms to fill out. Nordi asks questions, listens, and only suggests a digital workforce when it genuinely helps.",
  },
  {
    title: "Saving your conversation",
    body: "Use “Save Conversation” inside the chat to keep your discussion and pick up later. You can recognize yourself by phone, email, or both, and optionally protect it with a verification code.",
  },
  {
    title: "Conversation learning",
    body: "You can choose whether Northbridge analyzes your conversations to improve Nordi. Manage this anytime in Privacy Settings — declining does not affect your ability to use Nordi.",
  },
  {
    title: "Requesting a call",
    body: "Prefer to speak with a person? Use “Request a Call” inside the chat and share your name and preferred contact method. Someone from Northbridge will reach out.",
  },
  {
    title: "Operations support",
    body: "When Nordi recommends operational support, our team helps you configure the right next steps. Reach out through the chat or contact page if you want a person involved.",
  },
];

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-black px-4 pb-16 pt-24 sm:px-6 sm:pt-28 md:pt-32 md:pb-24">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-semibold tracking-tight text-white sm:mb-8 sm:text-4xl md:text-5xl">
          Help
        </h1>

        <p className="mb-10 max-w-2xl text-sm leading-relaxed text-silver sm:text-base">
          Northbridge Digital is built around a conversation. If you&apos;re not sure where to
          start, just talk to Nordi — everything else grows from there.
        </p>

        <div className="space-y-8">
          {topics.map((topic) => (
            <section key={topic.title}>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-red sm:text-sm">
                {topic.title}
              </h2>
              <p className="text-sm leading-relaxed text-silver sm:text-base">{topic.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-red px-6 text-sm font-semibold text-white transition-colors hover:bg-red-hover"
          >
            Talk to Nordi
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/15 px-6 text-sm font-medium text-white transition-colors hover:border-white/30 hover:bg-white/5"
          >
            Contact the team
          </Link>
        </div>
      </div>
    </main>
  );
}
