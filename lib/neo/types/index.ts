/**
 * Presentation-layer type imports from NEO platform packages.
 * When @neos/* packages are linked via neo install manifest, replace this
 * module with re-exports: export type * from '@neos/workforce', etc.
 */

export type HealthLevel = "healthy" | "degraded" | "critical" | "unknown";

export type WorkforceRole =
  | "specialist"
  | "manager"
  | "team_leader"
  | "coordinator";

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
  currentTask?: string;
  performanceScore: number;
  avatarInitials: string;
}

export interface TeamNode {
  id: string;
  name: string;
  leadId?: string;
  memberIds: string[];
  childTeamIds: string[];
}

export interface ConnectorApp {
  id: string;
  name: string;
  category: string;
  connected: boolean;
  health: HealthLevel;
  lastSyncAt?: string;
  permissions: string[];
}

export interface OnboardingChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  required: boolean;
}

export interface OnboardingSnapshot {
  readinessScore: number;
  checklist: OnboardingChecklistItem[];
  recommendedConnectorIds: string[];
  recommendedSpecialistIds: string[];
  stage: string;
}

export interface WorkItem {
  id: string;
  title: string;
  status: "active" | "waiting_approval" | "escalated" | "completed";
  assigneeId?: string;
  priority: "low" | "medium" | "high" | "urgent";
  updatedAt: string;
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

export interface InboxMessage {
  id: string;
  channel: "email" | "sms" | "whatsapp" | "telegram" | "social";
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
