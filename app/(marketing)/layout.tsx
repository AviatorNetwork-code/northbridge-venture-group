import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NordiFloatingButton from "@/components/home/NordiFloatingButton";

export default function MarketingLayout({
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
    </>
  );
}
