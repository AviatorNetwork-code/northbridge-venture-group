import type { Metadata } from "next";
import HomeShell from "@/components/home/HomeShell";

export const metadata: Metadata = {
  title: "Nordi | Northbridge Digital",
  description:
    "Talk to Nordi, your business advisor from Northbridge Digital. Understand your business first — no browsing, no sales pressure.",
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <HomeShell>{children}</HomeShell>;
}
