export type ReportType =
  | "daily_founder_brief"
  | "critical_alert"
  | "product_intelligence"
  | "cat_conversation_summary"
  | "engineering_session_summary"
  | "pending_founder_decisions"
  | "weekly_northbridge_report";

export type ReportPriority = "critical" | "high" | "normal" | "low";

export type ReportSourceId =
  | "aviator_network_neo"
  | "quadrix_neo"
  | "northbridge_website_neo"
  | "founder_dashboard"
  | "executive_intelligence"
  | "customer_experience_intelligence"
  | "cat_website_analytics"
  | "product_capability_broker"
  | "institutional_memory";

export interface ReportSourceInput {
  sourceId: ReportSourceId;
  productId?: string;
  summary: string;
  highlights: string[];
  risks?: string[];
  recommendations?: string[];
  pendingDecisions?: string[];
  metrics?: Record<string, string | number>;
  timestamp: number;
}

export interface FounderReport {
  reportId: string;
  reportType: ReportType;
  priority: ReportPriority;
  title: string;
  generatedAt: number;
  sections: FounderReportSection[];
  nextSuggestedAction: string;
  governanceNotice: string;
  sources: ReportSourceId[];
}

export interface FounderReportSection {
  heading: string;
  items: string[];
}

export interface SlackDeliveryResult {
  sent: boolean;
  dryRun: boolean;
  preview: boolean;
  channel?: string;
  payload: SlackMessagePayload;
  error?: string;
}

export interface SlackMessagePayload {
  text: string;
  blocks?: SlackBlock[];
}

export interface SlackBlock {
  type: string;
  text?: { type: string; text: string; emoji?: boolean };
  elements?: Array<{ type: string; text: string }>;
}
