/**
 * Presentation-layer types consumed from NEO platform packages.
 * Replace with package re-exports when @neos/* bindings are live.
 */

export type HealthLevel = "healthy" | "degraded" | "critical" | "unknown";

export type WorkforceRole =
  | "specialist"
  | "manager"
  | "team_leader"
  | "coordinator";

/** Live operational status for workforce monitor */
export type LiveWorkforceStatus =
  | "idle"
  | "working"
  | "waiting"
  | "escalated"
  | "offline";

export type WorkforceStatus =
  | "active"
  | "idle"
  | "busy"
  | "offline"
  | "training";

export interface WorkforceMember {
  id: string;
  name: string;
  role: WorkforceRole;
  title: string;
  teamId: string;
  status: WorkforceStatus;
  liveStatus: LiveWorkforceStatus;
  currentTask?: string;
  currentAssignment?: string;
  queueSize: number;
  performanceScore: number;
  tasksCompletedToday: number;
  avgResponseMinutes: number;
  avatarInitials: string;
}

export interface TeamNode {
  id: string;
  name: string;
  leadId?: string;
  memberIds: string[];
  childTeamIds: string[];
}

export type ConnectorLifecycle =
  | "connected"
  | "connecting"
  | "authorization_required"
  | "error"
  | "syncing"
  | "healthy";

export interface ConnectorApp {
  id: string;
  name: string;
  category: string;
  connected: boolean;
  lifecycle: ConnectorLifecycle;
  health: HealthLevel;
  lastSyncAt?: string;
  permissions: string[];
  oauthStatus: "valid" | "expiring" | "expired" | "missing";
  refreshTokenAgeDays: number;
  usagePercent: number;
  errorMessage?: string;
}

export interface OnboardingChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  required: boolean;
}

export interface OnboardingSnapshot {
  readinessScore: number;
  targetScore: number;
  checklist: OnboardingChecklistItem[];
  recommendedConnectorIds: string[];
  recommendedSpecialistIds: string[];
  stage: string;
  businessDiscoveryComplete: boolean;
  launchReadiness: "not_ready" | "almost_ready" | "ready";
  missingRequirements: string[];
  estimatedSetupHours: number;
}

export interface WorkItem {
  id: string;
  title: string;
  status: "active" | "waiting_approval" | "escalated" | "completed" | "running";
  assigneeId?: string;
  priority: "low" | "medium" | "high" | "urgent";
  updatedAt: string;
  workflowId?: string;
}

export interface WorkflowStreamEvent {
  id: string;
  workItemId: string;
  label: string;
  timestamp: string;
  actor: string;
  kind: "started" | "progress" | "approval" | "escalation" | "completed";
}

export interface TimelineEvent {
  id: string;
  label: string;
  timestamp: string;
  actor: string;
}

export interface AuditEntry {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
  detail: string;
}

export type ConversationChannel =
  | "whatsapp"
  | "email"
  | "sms"
  | "telegram"
  | "messenger"
  | "instagram"
  | "tiktok"
  | "webchat";

export type ConversationStatus = "open" | "waiting" | "resolved" | "escalated";
export type Sentiment = "positive" | "neutral" | "negative";

export interface CustomerProfile {
  id: string;
  name: string;
  company: string;
  tier: string;
}

export interface Conversation {
  id: string;
  channel: ConversationChannel;
  customer: CustomerProfile;
  assignedSpecialistId?: string;
  status: ConversationStatus;
  sentiment: Sentiment;
  slaMinutesRemaining: number;
  slaBreached: boolean;
  linkedWorkflowId?: string;
  subject: string;
  preview: string;
  receivedAt: string;
  unread: boolean;
}

export interface InboxMessage {
  id: string;
  channel: ConversationChannel;
  from: string;
  subject: string;
  preview: string;
  receivedAt: string;
  unread: boolean;
}

export interface AIRecommendation {
  id: string;
  title: string;
  summary: string;
  priority: "low" | "medium" | "high";
  category: string;
}

export interface ActivityItem {
  id: string;
  label: string;
  timestamp: string;
  type: string;
}

export interface ExecutiveKPIs {
  businessHealthScore: number;
  level: HealthLevel;
  summary: string;
  activeSpecialists: number;
  activeManagers: number;
  runningWorkflows: number;
  waitingApprovals: number;
  connectedIntegrations: number;
  openConversations: number;
  revenueMtdUsd: number;
  revenueTrendPercent: number;
}

export interface BusinessHealthSnapshot {
  score: number;
  level: HealthLevel;
  summary: string;
  connectedSystems: number;
  activeWorkflows: number;
}

export interface AnalyticsSnapshot {
  workforceUtilization: number;
  connectorUptime: number;
  automationsRun: number;
  customerSatisfaction: number;
  costSavingsUsd: number;
  hoursSaved: number;
  workflowsPerDay: number;
  automationPercent: number;
  avgResponseMinutes: number;
  tasksCompleted: number;
  conversationVolume: number;
}

export interface AnalyticsDataPoint {
  label: string;
  value: number;
}

export interface AnalyticsTimeSeries {
  workflowsPerDay: AnalyticsDataPoint[];
  conversationVolume: AnalyticsDataPoint[];
  specialistUtilization: AnalyticsDataPoint[];
  connectorHealth: AnalyticsDataPoint[];
}

export interface SystemHealthSnapshot {
  platform: HealthLevel;
  connectors: HealthLevel;
  workforce: HealthLevel;
  messaging: HealthLevel;
  lastCheckedAt: string;
}

export interface CatCommandSuggestion {
  id: string;
  label: string;
  prompt: string;
}

export interface CatMessage {
  id: string;
  role: "user" | "cat";
  content: string;
  timestamp: string;
}

export interface CatResponse {
  message: string;
  suggestions?: string[];
}

export interface OpsNotification {
  id: string;
  title: string;
  message: string;
  level: "info" | "success" | "warning" | "critical";
  timestamp: string;
}
