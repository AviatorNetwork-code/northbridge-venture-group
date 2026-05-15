"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
        }),
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="flex-1 max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-northbridge-black">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="mt-1 block w-full rounded-lg border border-black/20 px-4 py-2 text-northbridge-black focus:border-northbridge-red focus:ring-1 focus:ring-northbridge-red"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-northbridge-black">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 block w-full rounded-lg border border-black/20 px-4 py-2 text-northbridge-black focus:border-northbridge-red focus:ring-1 focus:ring-northbridge-red"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-northbridge-black">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            className="mt-1 block w-full rounded-lg border border-black/20 px-4 py-2 text-northbridge-black focus:border-northbridge-red focus:ring-1 focus:ring-northbridge-red"
          />
        </div>
        {status === "success" && (
          <p className="text-green-700 font-medium">Thank you. Your message has been sent.</p>
        )}
        {status === "error" && (
          <p className="text-red-700 font-medium">
            Something went wrong. Please try again or email us directly.
          </p>
        )}
        <button
          type="submit"
          disabled={status === "sending"}
          className="px-6 py-3 rounded-lg font-semibold text-white bg-northbridge-red hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
      </form>
    </div>
  );
}
