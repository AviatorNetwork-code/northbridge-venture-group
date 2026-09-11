export function OrganizationJsonLd() {
  const organizationId = "https://northbridgeventuregroup.com/#organization";
  const websiteId = "https://northbridgeventuregroup.com/#website";

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: "Northbridge Venture Group",
        url: "https://northbridgeventuregroup.com",
        logo: "https://northbridgeventuregroup.com/northbridge-logo.png",
        email: "contact@northbridgeventuregroup.com",
        areaServed: ["United States", "Florida", "Orlando"],
        description:
          "Northbridge Venture Group builds companies, software, and intelligent systems across ventures, Engineering & AI, and Digital.",
        sameAs: [],
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: "https://northbridgeventuregroup.com",
        name: "Northbridge Venture Group",
        description:
          "Official website for Northbridge Venture Group — ventures, Engineering & AI, and Digital products.",
        publisher: { "@id": organizationId },
        inLanguage: "en-US",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
