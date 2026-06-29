import type { Metadata } from "next";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://northbridgeventuregroup.com";

export const SITE_NAME = "Northbridge Venture Group";

export const DEFAULT_DESCRIPTION =
  "Northbridge Venture Group delivers intelligent solutions for complex business problems—platforms, adaptable business solutions, and custom systems through Northbridge Digital.";

const OG_IMAGE = {
  url: "/brand/og-image.png",
  width: 1200,
  height: 630,
  alt: SITE_NAME,
};

export const siteIcons: Metadata["icons"] = {
  icon: [
    { url: "/brand/favicon.svg", type: "image/svg+xml" },
    { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
    { url: "/brand/favicon-16.png", sizes: "16x16", type: "image/png" },
  ],
  apple: [{ url: "/brand/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
};

type SiteMetadataOptions = {
  title: Metadata["title"];
  description?: string;
  path?: string;
  openGraphTitle?: string;
};

/** Shared metadata for Northbridge Venture Group public pages. */
export function siteMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "",
  openGraphTitle,
}: SiteMetadataOptions): Metadata {
  const canonical = `${SITE_URL}${path}`;
  const ogTitle =
    openGraphTitle ??
    (typeof title === "string"
      ? title
      : title && typeof title === "object" && "default" in title
        ? String(title.default)
        : SITE_NAME);

  return {
    title,
    description,
    alternates: { canonical },
    icons: siteIcons,
    openGraph: {
      title: ogTitle,
      description,
      url: canonical,
      type: "website",
      siteName: SITE_NAME,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
