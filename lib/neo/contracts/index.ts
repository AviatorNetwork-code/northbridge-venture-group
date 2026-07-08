import type {
  ActivityItem,
  AIRecommendation,
  AnalyticsSnapshot,
  AnalyticsTimeSeries,
  AuditEntry,
  BusinessHealthSnapshot,
  CatCommandSuggestion,
  CatMessage,
  CatResponse,
  ConnectorApp,
  Conversation,
  ExecutiveKPIs,
  InboxMessage,
  OnboardingSnapshot,
  SystemHealthSnapshot,
  TeamNode,
  TimelineEvent,
  WorkItem,
  WorkflowStreamEvent,
  WorkforceMember,
} from "@/lib/neo/types";
import type { NeoEvent, NeoEventHandler } from "@/lib/neo/events";
import type { NeoPlatformState } from "@/lib/neo/state/seed";

export interface WorkforceService {
  listMembers(): Promise<WorkforceMember[]>;
  getTeamHierarchy(): Promise<TeamNode[]>;
}

export interface ConnectorPlatformService {
  listConnected(): Promise<ConnectorApp[]>;
  listAvailable(): Promise<ConnectorApp[]>;
  reconnect?(connectorId: string): Promise<void>;
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
  listWorkflowEvents?(): Promise<WorkflowStreamEvent[]>;
}

export interface MessagingService {
  listInbox(): Promise<InboxMessage[]>;
  listChannels(): Promise<string[]>;
  listConversations?(): Promise<Conversation[]>;
}

export interface InstitutionalLearningService {
  listRecommendations(): Promise<AIRecommendation[]>;
}

export interface CollaborationService {
  listTodayActivity(): Promise<ActivityItem[]>;
}

export interface ExecutiveDashboardService {
  getBusinessHealth(): Promise<BusinessHealthSnapshot>;
  getKPIs?(): Promise<ExecutiveKPIs>;
  getTodayActivity(): Promise<ActivityItem[]>;
  getRecommendations(): Promise<AIRecommendation[]>;
}

export interface AnalyticsService {
  getSnapshot(): Promise<AnalyticsSnapshot>;
  getTimeSeries?(): Promise<AnalyticsTimeSeries>;
}

export interface CommandCenterService {
  getSystemHealth(): Promise<SystemHealthSnapshot>;
  listCommandSuggestions(): Promise<CatCommandSuggestion[]>;
  askCat?(prompt: string, history: CatMessage[]): Promise<CatResponse>;
}

export interface NeoRealtimeService {
  subscribe(handler: NeoEventHandler): () => void;
  subscribeState(listener: (state: NeoPlatformState) => void): () => void;
  getState(): NeoPlatformState;
  getVersion(): number;
  start(): void;
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
  realtime: NeoRealtimeService;
}
