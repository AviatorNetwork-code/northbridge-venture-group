import { DigitalSubNav } from "@/components/digital/DigitalSubNav";

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DigitalSubNav />
      {children}
    </>
  );
}
