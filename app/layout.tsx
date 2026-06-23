import type { Metadata } from "next";
import { GoogleTagManager } from "@next/third-parties/google";
import { Inter } from "next/font/google";
import "./globals.css";
import { GtmNoScript } from "@/components/analytics/GtmNoScript";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getPublicGtmId } from "@/lib/gtm";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://northbridgeventuregroup.com"
  ),
  title: "Northbridge Venture Group",
  description:
    "Northbridge Venture Group builds and operates ventures in aviation and financial services, including Aviator Network and AirTax Financial.",
  openGraph: {
    title: "Northbridge Venture Group",
    description:
      "Northbridge Venture Group builds and operates ventures in aviation and financial services.",
    type: "website",
    // Dynamic OG image from app/opengraph-image.tsx. Replace with /og-image.png when you have a final asset.
  },
  twitter: {
    card: "summary_large_image",
    title: "Northbridge Venture Group",
    description: "Northbridge Venture Group builds and operates ventures in aviation and financial services.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = getPublicGtmId();

  return (
    <html lang="en">
      {gtmId ? <GoogleTagManager gtmId={gtmId} /> : null}
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
