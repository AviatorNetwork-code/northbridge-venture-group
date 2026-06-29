export type Venture = {
  name: string;
  href: string;
  description: string;
  category?: string;
  positioning?: string;
  audience?: string[];
  capabilities?: string[];
  ctaLabel?: string;
  external?: boolean;
  comingSoon?: boolean;
};

export { platforms as ventures } from "@/lib/platforms";
