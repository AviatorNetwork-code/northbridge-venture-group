import type { Metadata } from "next";
import { siteIcons, SITE_URL } from "@/lib/site-metadata";

const OG_IMAGE = {
  url: "/brand/og-image.png",
  width: 1200,
  height: 630,
  alt: "Northbridge Digital",
};

export function digitalPageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const canonical = `${SITE_URL}${path}`;
  const fullTitle = `${title} | Northbridge Digital`;

  return {
    title: fullTitle,
    description,
    alternates: { canonical },
    icons: siteIcons,
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      type: "website",
      siteName: "Northbridge Digital",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [OG_IMAGE.url],
    },
  };
}

export const DIAGNOSTIC_PATH = "/digital/assessment";
export const DIAGNOSTIC_LABEL = "Business Diagnostic";
export const DIAGNOSTIC_CTA = "Start Business Diagnostic";
