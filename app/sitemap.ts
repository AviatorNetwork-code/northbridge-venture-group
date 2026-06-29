import type { MetadataRoute } from "next";
import { expertiseAreas } from "@/lib/digital/expertise";
import { industries } from "@/lib/digital/industries";
import { getSolutionSlugs } from "@/lib/solutions";
import { SITE_URL } from "@/lib/site-metadata";

const staticPaths = [
  "",
  "/about",
  "/solutions",
  "/northbridge-digital",
  "/insights",
  "/clients",
  "/case-studies",
  "/case-studies/florida-air-mechanical",
  "/contact",
  "/partner-with-us",
  "/research",
  "/digital",
  "/digital/assessment",
  "/services",
  "/services/industries",
  "/services/expertise",
  "/services/case-studies",
  "/services/insights",
  "/services/results",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const staticEntries = staticPaths.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const industryEntries = industries.map((industry) => ({
    url: `${SITE_URL}/services/industries/${industry.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const expertiseEntries = expertiseAreas.map((area) => ({
    url: `${SITE_URL}/services/expertise/${area.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const solutionEntries = getSolutionSlugs().map((slug) => ({
    url: `${SITE_URL}/solutions/${slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  return [...staticEntries, ...solutionEntries, ...industryEntries, ...expertiseEntries];
}
