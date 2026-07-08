/**
 * NEO platform service contracts consumed by the Operations Center.
 * Implementations live in NEO packages; the website wires providers only.
 */

import type {
  ActivityItem,
  AIRecommendation,
  AnalyticsSnapshot,
  AuditEntry,
  BusinessHealthSnapshot,
  CatCommandSuggestion,
  ConnectorApp,
  InboxMessage,
  OnboardingSnapshot,
  SystemHealthSnapshot,
  TeamNode,
  TimelineEvent,
  WorkItem,
  WorkforceMember,
} from "@/lib/neo/types";

export interface WorkforceService {
  listMembers(): Promise<WorkforceMember[]>;
  getTeamHierarchy(): Promise<TeamNode[]>;
}

export interface ConnectorPlatformService {
  listConnected(): Promise<ConnectorApp[]>;
  listAvailable(): Promise<ConnectorApp[]>;
}

export interface CustomerOnboardingService {
  getSnapshot(): Promise<OnboardingSnapshot>;
}

export interface WorkItemsService {
  listActive(): Promise<WorkItem[]>;
  listWaitingApprovals(): Promise<WorkItem[]>;
  listEscalations(): Promise<WorkItem[]>;
  getTimeline(workItemId: string): Promise<TimelineEvent[]>;
  getAuditHistory(): Promise<AuditEntry[]>;
}

export interface MessagingService {
  listInbox(): Promise<InboxMessage[]>;
  listChannels(): Promise<string[]>;
}

export interface InstitutionalLearningService {
  listRecommendations(): Promise<AIRecommendation[]>;
}

export interface CollaborationService {
  listTodayActivity(): Promise<ActivityItem[]>;
}

export interface ExecutiveDashboardService {
  getBusinessHealth(): Promise<BusinessHealthSnapshot>;
  getTodayActivity(): Promise<ActivityItem[]>;
  getRecommendations(): Promise<AIRecommendation[]>;
}

export interface AnalyticsService {
  getSnapshot(): Promise<AnalyticsSnapshot>;
}

export interface CommandCenterService {
  getSystemHealth(): Promise<SystemHealthSnapshot>;
  listCommandSuggestions(): Promise<CatCommandSuggestion[]>;
}

export interface NeoPlatformServices {
  workforce: WorkforceService;
  collaboration: CollaborationService;
  workItems: WorkItemsService;
  connectors: ConnectorPlatformService;
  onboarding: CustomerOnboardingService;
  messaging: MessagingService;
  learning: InstitutionalLearningService;
  executive: ExecutiveDashboardService;
  analytics: AnalyticsService;
  command: CommandCenterService;
}
