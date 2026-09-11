import { pageMetadata } from "@/lib/seo";
import HomeMarketingPage from "@/components/marketing/HomeMarketingPage";

export const metadata = pageMetadata({
  title: "Northbridge Venture Group | Companies, Software & Intelligent Systems",
  description:
    "Northbridge Venture Group builds companies, software, and intelligent systems — ventures, Engineering & AI, and Digital products. Talk to Nordi to start.",
  path: "/",
  openGraphTitle: "Northbridge Venture Group",
  openGraphDescription:
    "Builds companies, software, and intelligent systems. Explore ventures, Engineering & AI, and Northbridge Digital.",
});

export default function HomePage() {
  return <HomeMarketingPage />;
}
