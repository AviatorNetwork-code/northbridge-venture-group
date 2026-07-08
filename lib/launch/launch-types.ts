import type { BusinessProfile } from "@/lib/cat/types";

export type LaunchStatus = "ready" | "nearly-ready" | "needs-attention" | "blocked";

export type LaunchChecklistItem = {
  id: string;
  label: string;
  complete: boolean;
  category: "connector" | "workforce" | "business";
  impact: "critical" | "recommended" | "optional";
};

export type LaunchBlocker = {
  id: string;
  label: string;
  reason: string;
  severity: "critical" | "warning";
};

export type LaunchRecommendation = {
  id: string;
  label: string;
  reason: string;
  canWait: boolean;
};

export type LaunchScoreBreakdown = {
  business: number;
  connectors: number;
  workforce: number;
  overall: number;
};

export type LaunchWorkforceSummary = {
  specialists: Array<{ name: string; tier: string }>;
  teams: string[];
  managers: string[];
  missingCapabilities: string[];
  futureHires: string[];
  coveragePercent: number;
};

export type LaunchConnectorSummary = {
  connected: string[];
  recommended: string[];
  optional: string[];
  missing: string[];
  health: number;
  lastSync: string;
  launchImpact: string;
};

export type LaunchBusinessSummary = {
  industry?: string;
  employees?: number;
  locations?: number;
  communicationChannels: string[];
  currentSoftware: string[];
  profileComplete: boolean;
};

export type LaunchAssessment = {
  status: LaunchStatus;
  scores: LaunchScoreBreakdown;
  estimatedGoLive: string;
  blockers: LaunchBlocker[];
  warnings: LaunchBlocker[];
  recommendations: LaunchRecommendation[];
  checklist: LaunchChecklistItem[];
  business: LaunchBusinessSummary;
  workforce: LaunchWorkforceSummary;
  connectors: LaunchConnectorSummary;
  catSummary: string;
  launchMessage: string;
};

export type LaunchState = {
  launched: boolean;
  launchedAt: string | null;
  savedAt: string | null;
};

export const LAUNCH_STORAGE_KEY = "northbridge-launch-state";

export const LAUNCH_STATUS_LABELS: Record<LaunchStatus, string> = {
  ready: "Ready",
  "nearly-ready": "Nearly Ready",
  "needs-attention": "Needs Attention",
  blocked: "Blocked",
};
