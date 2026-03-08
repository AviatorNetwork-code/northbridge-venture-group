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
    "Northbridge develops ventures, digital infrastructure, and strategic systems that generate demand, deliver insights, and support industry growth.",
  openGraph: {
    title: "Northbridge Venture Group",
    description:
      "Northbridge develops ventures, digital infrastructure, and strategic systems that generate demand, deliver insights, and support industry growth.",
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
      <body className="antialiased bg-black text-white">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
