import type { Metadata } from "next";
import HomeMarketingPage from "@/components/marketing/HomeMarketingPage";

export const metadata: Metadata = {
  title: "Northbridge Venture Group | Companies, Software & Intelligent Systems",
  description:
    "Northbridge Venture Group builds companies, software, and intelligent systems — ventures, Engineering & AI, and Digital products. Talk to Nordi to start.",
  openGraph: {
    title: "Northbridge Venture Group",
    description:
      "Builds companies, software, and intelligent systems. Explore ventures, Engineering & AI, and Northbridge Digital.",
    images: ["/og-image.png"],
  },
};

export default function HomePage() {
  return <HomeMarketingPage />;
}
