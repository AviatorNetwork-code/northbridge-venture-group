import type { Metadata } from "next";
import { GoogleTagManager } from "@next/third-parties/google";
import { Inter } from "next/font/google";
import "./globals.css";
import { GtmNoScript } from "@/components/analytics/GtmNoScript";
import { MicrosoftClarity } from "@/components/analytics/MicrosoftClarity";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getPublicClarityId } from "@/lib/clarity";
import { getPublicGtmId } from "@/lib/gtm";
import { siteMetadata } from "@/lib/site-metadata";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  ...siteMetadata({
    title: {
      default: "Northbridge Venture Group",
      template: "%s | Northbridge Venture Group",
    },
    description:
      "Northbridge Venture Group delivers intelligent solutions for complex business problems—platforms, business solutions, and custom systems through Northbridge Digital.",
    path: "/",
  }),
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://northbridgeventuregroup.com"
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = getPublicGtmId();
  const clarityId = getPublicClarityId();

  return (
    <html lang="en">
      {gtmId ? <GoogleTagManager gtmId={gtmId} /> : null}
      {clarityId ? <MicrosoftClarity projectId={clarityId} /> : null}
      <body
        className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col bg-background text-foreground`}
      >
        {gtmId ? <GtmNoScript gtmId={gtmId} /> : null}
        <Header />
        <main id="main-content" className="nb-main">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
