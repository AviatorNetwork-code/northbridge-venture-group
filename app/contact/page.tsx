import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact | Northbridge Venture Group",
  description:
    "Contact Northbridge Venture Group by email at contact@northbridgeventuregroup.com or use our contact form.",
};

export default function Contact() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24">
      <h1 className="text-4xl font-bold text-northbridge-black">Contact</h1>
      <p className="mt-4 text-lg text-black/80 max-w-2xl">
        Reach us by email or use the form below. We will respond as soon as we can.
      </p>

      <div className="mt-10 flex flex-col sm:flex-row gap-10">
        <div>
          <p className="font-semibold text-northbridge-black">Email</p>
          <a
            href="mailto:contact@northbridgeventuregroup.com"
            className="mt-1 block text-northbridge-red font-medium hover:underline"
          >
            contact@northbridgeventuregroup.com
          </a>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
