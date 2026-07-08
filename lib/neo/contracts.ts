import type {
  ActivityItem,
  AnalyticsSnapshot,
  CommunicationsSnapshot,
  ConnectorCenterSnapshot,
  ExecutiveDashboard,
  NeoEventHandler,
  OnboardingSnapshot,
  WorkforceSnapshot,
  WorkflowCenterSnapshot,
} from "./types";

export interface CatOpsResponse {
  message: string;
  actions?: Array<{ label: string; href?: string; command?: string }>;
  data?: Record<string, unknown>;
}

export interface NeoOperationsProvider {
  readonly mode: "mock" | "live";

  getDashboard(): Promise<ExecutiveDashboard>;
  getWorkforce(): Promise<WorkforceSnapshot>;
  getWorkflows(): Promise<WorkflowCenterSnapshot>;
  getCommunications(): Promise<CommunicationsSnapshot>;
  getConnectors(): Promise<ConnectorCenterSnapshot>;
  getOnboarding(): Promise<OnboardingSnapshot>;
  getAnalytics(): Promise<AnalyticsSnapshot>;
  getActivityFeed(): Promise<ActivityItem[]>;

  subscribe(handler: NeoEventHandler): () => void;

  reconnectConnector(connectorId: string): Promise<void>;
  approveWorkflow(approvalId: string): Promise<void>;
  queryCat(command: string): Promise<CatOpsResponse>;

  /** Start realtime transport (mock timers, WebSocket, or SSE). */
  connectTransport?(): () => void;
  /** Stop realtime transport without destroying read accessors. */
  disconnectTransport?(): void;
}

export type NeoProviderFactory = () => NeoOperationsProvider;
