export type ConnectorCategory =
  | "communication"
  | "scheduling"
  | "payments"
  | "crm"
  | "accounting"
  | "development"
  | "storage"
  | "social"
  | "future";

export type ConnectorStatus =
  | "available"
  | "connected"
  | "syncing"
  | "authorization_required"
  | "needs_attention"
  | "disconnected";

export type ConnectorRecommendationLevel = "connected" | "recommended" | "optional" | "missing";

export type ConnectorCatalogItem = {
  id: string;
  name: string;
  category: ConnectorCategory;
  description: string;
  capabilities: string[];
  permissions: string[];
  usedBySpecialists: string[];
  usedByTeams: string[];
  requiredFor: string[];
  relatedConnectors: string[];
  recommendedWorkflows: string[];
  provider: string;
  mockProvider: boolean;
  logoColor: string;
  logoInitials: string;
};

export type ConnectorSyncEvent = {
  id: string;
  timestamp: string;
  message: string;
  status: "success" | "warning" | "error";
};

export type ConnectorRuntimeState = {
  status: ConnectorStatus;
  health: number;
  lastSync: string | null;
  connectedWorkforce: string[];
  permissionStatus: "granted" | "pending" | "revoked" | "none";
  syncHistory: ConnectorSyncEvent[];
  connectedAt: string | null;
};

export type ConnectorInstance = ConnectorCatalogItem & ConnectorRuntimeState;

export type ConnectorHealthSummary = {
  total: number;
  connected: number;
  syncing: number;
  needsAttention: number;
  avgHealth: number;
  lastSyncLabel: string;
  readyToLaunch: boolean;
};

export type ConnectorOnboardingItem = {
  connectorId: string;
  name: string;
  level: ConnectorRecommendationLevel;
  reason: string;
};

export type ConnectorOnboardingSummary = {
  items: ConnectorOnboardingItem[];
  launchReadinessPercent: number;
  connected: number;
  recommended: number;
  optional: number;
  missing: number;
};

export const CONNECTOR_STORAGE_KEY = "northbridge-connector-state";

export const CATEGORY_LABELS: Record<ConnectorCategory, string> = {
  communication: "Communication",
  scheduling: "Scheduling",
  payments: "Payments",
  crm: "CRM",
  accounting: "Accounting",
  development: "Development",
  storage: "Storage",
  social: "Social",
  future: "Future",
};

export const STATUS_LABELS: Record<ConnectorStatus, string> = {
  available: "Available",
  connected: "Connected",
  syncing: "Syncing",
  authorization_required: "Authorization Required",
  needs_attention: "Needs Attention",
  disconnected: "Disconnected",
};
