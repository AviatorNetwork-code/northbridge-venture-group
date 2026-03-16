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
  title: "Northbridge Venture Group | Venture Studio & Digital Infrastructure",
  description:
    "Northbridge Venture Group develops ventures, digital platforms, and digital infrastructure systems for modern industries.",
  openGraph: {
    title: "Northbridge Venture Group | Venture Studio & Digital Infrastructure",
    description:
      "Northbridge Venture Group develops ventures, digital platforms, and infrastructure systems that help modern industries operate more efficiently and unlock new opportunities.",
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
