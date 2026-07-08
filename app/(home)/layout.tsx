import type { Metadata } from "next";
import NordiHeader from "@/components/home/NordiHeader";

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
  return (
    <>
      <NordiHeader />
      {children}
    </>
  );
}
