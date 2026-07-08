import type {
  ConversationChannel,
  ConversationStatus,
  Sentiment,
  SlaStatus,
} from "./common";

export interface CustomerProfile {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  tier: "starter" | "growth" | "enterprise";
  lifetimeValue: number;
}

export interface Conversation {
  id: string;
  channel: ConversationChannel;
  subject: string;
  preview: string;
  assignedSpecialist: string;
  status: ConversationStatus;
  sentiment: Sentiment;
  sla: SlaStatus;
  slaMinutesRemaining: number;
  linkedWorkflowId?: string;
  linkedWorkflowName?: string;
  customer: CustomerProfile;
  lastMessageAt: string;
  unreadCount: number;
}

export interface CommunicationsSnapshot {
  conversations: Conversation[];
  channelCounts: Record<ConversationChannel, number>;
  lastUpdated: string;
}
