import type { Metadata } from "next";
import { Manrope, Source_Serif_4 } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";
import { OrganizationJsonLd } from "@/components/marketing/OrganizationJsonLd";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://northbridgeventuregroup.com"),
  title: {
    default: "Northbridge Venture Group",
    template: "%s | Northbridge Venture Group",
  },
  description:
    "Northbridge Venture Group builds companies, software, and intelligent systems — Engineering & AI, Digital products, and operating ventures. Serving nationally from Central Florida.",
  openGraph: {
    title: "Northbridge Venture Group",
    description:
      "Companies, software, and intelligent systems. Ventures, Engineering & AI, and Northbridge Digital.",
    images: ["/og-image.png"],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Northbridge Venture Group",
    description:
      "Builds companies, software, and intelligent systems. Talk to Nordi to start.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  // Per-page canonicals are set via lib/seo.ts — do not pin "/" here
  // (that incorrectly canonicalized every route to the homepage).
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${sourceSerif.variable}`}>
      <body className="antialiased bg-black text-white font-sans overflow-x-hidden">
        <OrganizationJsonLd />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
