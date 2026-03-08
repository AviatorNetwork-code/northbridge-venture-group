import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Northbridge Venture Group",
  description:
    "A holding company developing and investing in aviation and financial technology ventures.",
  openGraph: {
    title: "Northbridge Venture Group",
    description:
      "A holding company developing and investing in aviation and financial technology ventures.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className="antialiased bg-cream text-charcoal">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
