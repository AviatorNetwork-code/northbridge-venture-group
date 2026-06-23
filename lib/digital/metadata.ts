import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://northbridgeventuregroup.com";

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
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      type: "website",
      siteName: "Northbridge Digital",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}

export const DIAGNOSTIC_PATH = "/digital/assessment";
export const DIAGNOSTIC_LABEL = "Business Diagnostic";
export const DIAGNOSTIC_CTA = "Start Business Diagnostic";
