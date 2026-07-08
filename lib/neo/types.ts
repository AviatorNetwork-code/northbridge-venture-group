export type NeoConnectionStatus = "disconnected" | "standby" | "connected";

export type NeoRequest = {
  sessionId: string;
  message: string;
  context: NeoContextPayload;
};

export type NeoContextPayload = {
  currentModule: string;
  businessProfile: Record<string, unknown>;
  operationsSnapshot: Record<string, unknown>;
};

export type NeoSendOptions = {
  session: {
    id: string;
    messages: unknown[];
    businessProfile: Record<string, unknown>;
  };
  currentModule: string;
};

export type NeoResponse = {
  reply: string;
  quickReplies?: string[];
  actions?: NeoAction[];
  recommendations?: NeoRecommendation[];
  profileUpdates?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
};

export type NeoAction = {
  type: "navigate" | "highlight" | "dismiss";
  label: string;
  href?: string;
  payload?: Record<string, unknown>;
};

export type NeoRecommendation = {
  tier: "specialist" | "team" | "manager" | "regional-manager" | "connector";
  name: string;
  status: "recommended" | "optional" | "not-recommended";
  reason: string;
};

export interface NeoClient {
  readonly status: NeoConnectionStatus;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  send(request: NeoRequest, options: NeoSendOptions): Promise<NeoResponse>;
}
