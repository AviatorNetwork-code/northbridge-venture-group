export type WorkforceStatus =
  | "idle"
  | "working"
  | "waiting"
  | "escalated"
  | "offline";

export type ConnectorStatus =
  | "connected"
  | "connecting"
  | "authorization_required"
  | "error"
  | "syncing"
  | "healthy";

export type ConversationChannel =
  | "whatsapp"
  | "email"
  | "sms"
  | "telegram"
  | "messenger"
  | "instagram"
  | "tiktok"
  | "web_chat";

export type ConversationStatus =
  | "open"
  | "pending"
  | "resolved"
  | "escalated"
  | "waiting";

export type Sentiment = "positive" | "neutral" | "negative" | "urgent";

export type WorkflowStatus =
  | "running"
  | "waiting_approval"
  | "blocked"
  | "completed"
  | "escalated";

export type SystemHealth = "healthy" | "degraded" | "critical";

export type SlaStatus = "on_track" | "at_risk" | "breached";

export interface Timestamped {
  updatedAt: string;
}
