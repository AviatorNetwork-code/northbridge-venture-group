import type { Metadata } from "next";
import ConnectorCenter from "@/components/connectors/ConnectorCenter";

export const metadata: Metadata = {
  title: "Connector Center | AI Operations Center",
  robots: { index: false, follow: false },
};

export default function ConnectorsPage() {
  return <ConnectorCenter />;
}
