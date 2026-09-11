import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NordiFloatingButton from "@/components/home/NordiFloatingButton";
import { Suspense } from "react";
import NordyHost from "@/components/marketing/NordyHost";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <NordiFloatingButton />
      <Suspense fallback={null}>
        <NordyHost />
      </Suspense>
    </>
  );
}
