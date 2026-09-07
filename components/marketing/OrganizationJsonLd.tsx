export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Northbridge Venture Group",
    url: "https://northbridgeventuregroup.com",
    logo: "https://northbridgeventuregroup.com/northbridge-logo.png",
    email: "contact@northbridgeventuregroup.com",
    areaServed: ["United States", "Florida", "Orlando"],
    description:
      "Northbridge Venture Group builds companies, software, and intelligent systems across ventures, Engineering & AI, and Digital.",
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
