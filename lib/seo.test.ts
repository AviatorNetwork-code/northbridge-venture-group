import { describe, expect, it } from "vitest";
import { pageMetadata, SITE_ORIGIN } from "@/lib/seo";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";

describe("public SEO foundation", () => {
  it("uses the production canonical origin", () => {
    expect(SITE_ORIGIN).toBe("https://northbridgeventuregroup.com");
  });

  it("builds unique per-path canonicals (never forces homepage on child routes)", () => {
    const about = pageMetadata({
      title: "About",
      description: "About Northbridge Venture Group",
      path: "/about",
    });
    const home = pageMetadata({
      title: "Home",
      description: "Home",
      path: "/",
    });

    expect(about.alternates?.canonical).toBe("/about");
    expect(home.alternates?.canonical).toBe("/");
    expect(about.robots).toEqual({ index: true, follow: true });
  });

  it("allows crawlers on public routes and blocks operations/api", () => {
    const result = robots();
    expect(result.sitemap).toBe(`${SITE_ORIGIN}/sitemap.xml`);
    expect(result.rules).toMatchObject({
      userAgent: "*",
      allow: "/",
      disallow: ["/operations/", "/api/"],
    });
  });

  it("publishes core public URLs in the sitemap", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toContain(SITE_ORIGIN);
    expect(urls).toContain(`${SITE_ORIGIN}/about`);
    expect(urls).toContain(`${SITE_ORIGIN}/ventures`);
    expect(urls).toContain(`${SITE_ORIGIN}/engineering-ai`);
    expect(urls).toContain(`${SITE_ORIGIN}/digital`);
    expect(urls).toContain(`${SITE_ORIGIN}/capabilities`);
    expect(urls).toContain(`${SITE_ORIGIN}/contact`);
    expect(urls.every((url) => url.startsWith(SITE_ORIGIN))).toBe(true);
    expect(urls.some((url) => url.includes("/operations"))).toBe(false);
  });
});
