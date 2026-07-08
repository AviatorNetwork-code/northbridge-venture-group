"use client";

import { useState, type FormEvent } from "react";

type ContactFormState = {
  name: string;
  email: string;
  topic: string;
  message: string;
};

const initialState: ContactFormState = {
  name: "",
  email: "",
  topic: "general",
  message: "",
};

export default function ContactForm() {
  const [form, setForm] = useState<ContactFormState>(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please complete all required fields.");
      return;
    }

    const recipient =
      form.topic === "partnerships"
        ? "partnerships@northbridgeventuregroup.com"
        : "contact@northbridgeventuregroup.com";

    const subject = encodeURIComponent(`Northbridge inquiry — ${form.topic}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nTopic: ${form.topic}\n\n${form.message}`,
    );

    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5">
        <p className="text-sm font-semibold text-emerald-300">Message ready to send</p>
        <p className="mt-2 text-sm text-silver">
          Your email app should open with your message. If it did not, email us at{" "}
          <a
            href="mailto:contact@northbridgeventuregroup.com"
            className="underline underline-offset-4 hover:text-white"
          >
            contact@northbridgeventuregroup.com
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setForm(initialState);
          }}
          className="mt-4 inline-flex min-h-11 items-center rounded-xl border border-white/15 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/5"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-white/10 bg-slate/40 p-5 sm:p-6">
      <div>
        <label htmlFor="contact-name" className="mb-2 block text-sm font-medium text-white">
          Name <span className="text-red">*</span>
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          className="w-full min-h-11 rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-base text-white placeholder:text-stone focus:border-red/50 focus:outline-none focus:ring-1 focus:ring-red/30"
          placeholder="Your name"
          required
        />
      </div>

      <div>
        <label htmlFor="contact-email" className="mb-2 block text-sm font-medium text-white">
          Email <span className="text-red">*</span>
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          className="w-full min-h-11 rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-base text-white placeholder:text-stone focus:border-red/50 focus:outline-none focus:ring-1 focus:ring-red/30"
          placeholder="you@company.com"
          required
        />
      </div>

      <div>
        <label htmlFor="contact-topic" className="mb-2 block text-sm font-medium text-white">
          Topic
        </label>
        <select
          id="contact-topic"
          name="topic"
          value={form.topic}
          onChange={(event) => setForm((current) => ({ ...current, topic: event.target.value }))}
          className="w-full min-h-11 rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-base text-white focus:border-red/50 focus:outline-none focus:ring-1 focus:ring-red/30"
        >
          <option value="general">General inquiry</option>
          <option value="partnerships">Partnership</option>
          <option value="digital">Website / digital project</option>
          <option value="operations">AI Operations Center</option>
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-2 block text-sm font-medium text-white">
          Message <span className="text-red">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          value={form.message}
          onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-base text-white placeholder:text-stone focus:border-red/50 focus:outline-none focus:ring-1 focus:ring-red/30"
          placeholder="Tell us about your project or question"
          required
        />
      </div>

      {error ? <p className="text-sm text-red">{error}</p> : null}

      <button
        type="submit"
        className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-red px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-red-hover sm:w-auto"
      >
        Send Message
      </button>
    </form>
  );
}
