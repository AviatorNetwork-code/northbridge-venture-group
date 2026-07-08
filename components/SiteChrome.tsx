"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CatWebsiteAssistant from "@/components/cat/CatWebsiteAssistant";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isOps = pathname?.startsWith("/ops");

  if (isOps) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
      <CatWebsiteAssistant />
    </>
  );
}
