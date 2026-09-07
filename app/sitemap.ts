import type { MetadataRoute } from "next";

const site = "https://northbridgeventuregroup.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/ventures",
    "/engineering-ai",
    "/digital",
    "/mobile-apps",
    "/capabilities",
    "/contact",
    "/help",
    "/privacy",
    "/privacy/settings",
    "/partner",
    "/clients",
  ];

  return routes.map((route) => ({
    url: `${site}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.7,
  }));
}
