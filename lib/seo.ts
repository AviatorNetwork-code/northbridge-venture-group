import type { Metadata } from "next";

export const SITE_ORIGIN = "https://northbridgeventuregroup.com";

/** Build page metadata with a correct per-path canonical (never inherit homepage "/"). */
export function pageMetadata(input: {
  title: string;
  description: string;
  path: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
}): Metadata {
  const path = input.path === "/" ? "/" : input.path.startsWith("/") ? input.path : `/${input.path}`;
  const ogTitle = input.openGraphTitle ?? input.title;
  const ogDescription = input.openGraphDescription ?? input.description;

  return {
    title: input.title,
    description: input.description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: path,
      images: ["/og-image.png"],
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: ["/og-image.png"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
