import type {
  ConnectorCenterSnapshot,
  CommunicationsSnapshot,
  ExecutiveDashboard,
  OnboardingSnapshot,
  WorkforceSnapshot,
  WorkflowCenterSnapshot,
} from "./index";
import type { AnalyticsSnapshot } from "./analytics";
import type { ActivityItem, ToastNotification } from "./notifications";

export type NeoDomain =
  | "dashboard"
  | "workforce"
  | "workflows"
  | "communications"
  | "connectors"
  | "onboarding"
  | "analytics"
  | "activity"
  | "notifications";

export type NeoEventType =
  | "dashboard.updated"
  | "workforce.updated"
  | "workforce.status_changed"
  | "workflows.updated"
  | "workflows.event"
  | "communications.updated"
  | "communications.message"
  | "connectors.updated"
  | "connectors.status_changed"
  | "onboarding.updated"
  | "analytics.updated"
  | "activity.new"
  | "notification.toast";

export interface NeoEventMap {
  "dashboard.updated": ExecutiveDashboard;
  "workforce.updated": WorkforceSnapshot;
  "workforce.status_changed": { memberId: string; status: string };
  "workflows.updated": WorkflowCenterSnapshot;
  "workflows.event": { eventId: string; workflowId: string };
  "communications.updated": CommunicationsSnapshot;
  "communications.message": { conversationId: string };
  "connectors.updated": ConnectorCenterSnapshot;
  "connectors.status_changed": { connectorId: string; status: string };
  "onboarding.updated": OnboardingSnapshot;
  "analytics.updated": AnalyticsSnapshot;
  "activity.new": ActivityItem;
  "notification.toast": ToastNotification;
}

export type NeoEvent<T extends NeoEventType = NeoEventType> = {
  type: T;
  payload: NeoEventMap[T];
  timestamp: string;
};

export type NeoEventHandler<T extends NeoEventType = NeoEventType> = (
  event: NeoEvent<T>,
) => void;
