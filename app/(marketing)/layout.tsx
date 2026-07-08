import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CatFloatingButton from "@/components/cat/CatFloatingButton";

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
      <CatFloatingButton />
    </>
  );
}
