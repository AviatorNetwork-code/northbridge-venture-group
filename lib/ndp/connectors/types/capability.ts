export type ConnectorCategory =
  | "scheduling"
  | "crm"
  | "accounting"
  | "messaging"
  | "marketing"
  | "storage";

export interface ConnectorCapability {
  id: string;
  label: string;
  description: string;
  category: ConnectorCategory;
  requiredPermission?: string;
  tags?: string[];
}

export interface ConnectorCapabilityQuery {
  category?: ConnectorCategory;
  tag?: string;
}
