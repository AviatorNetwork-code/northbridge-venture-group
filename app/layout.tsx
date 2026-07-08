import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Nordi | Northbridge Digital",
  description:
    "Northbridge Digital is a software company. Nordi is our flagship platform for business operating intelligence. We also build custom digital solutions.",
  openGraph: {
    title: "Nordi | Northbridge Digital",
    description:
      "Northbridge Digital builds Nordi — software that learns your business. We also deliver custom digital solutions for organizations with unique operational needs.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased bg-black text-white font-sans overflow-x-hidden">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
