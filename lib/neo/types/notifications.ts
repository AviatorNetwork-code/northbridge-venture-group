export type ActivitySeverity = "info" | "success" | "warning" | "error";

export interface ActivityItem {
  id: string;
  message: string;
  domain: string;
  severity: ActivitySeverity;
  timestamp: string;
}

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  severity: ActivitySeverity;
  timestamp: string;
}
