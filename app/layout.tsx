import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

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
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
