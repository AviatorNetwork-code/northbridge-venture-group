"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { NeoOperationsProvider } from "../contracts";
import { getNeoProvider } from "../providers";
import type {
  ActivityItem,
  AnalyticsSnapshot,
  CommunicationsSnapshot,
  ConnectorCenterSnapshot,
  ExecutiveDashboard,
  NeoEvent,
  OnboardingSnapshot,
  ToastNotification,
  WorkforceSnapshot,
  WorkflowCenterSnapshot,
} from "../types";

interface NeoContextValue {
  provider: NeoOperationsProvider;
  dashboard: ExecutiveDashboard | null;
  workforce: WorkforceSnapshot | null;
  workflows: WorkflowCenterSnapshot | null;
  communications: CommunicationsSnapshot | null;
  connectors: ConnectorCenterSnapshot | null;
  onboarding: OnboardingSnapshot | null;
  analytics: AnalyticsSnapshot | null;
  activity: ActivityItem[];
  toasts: ToastNotification[];
  dismissToast: (id: string) => void;
  refreshAll: () => Promise<void>;
}

const NeoContext = createContext<NeoContextValue | null>(null);

export function NeoProvider({ children }: { children: ReactNode }) {
  const provider = useMemo(() => getNeoProvider(), []);
  const [dashboard, setDashboard] = useState<ExecutiveDashboard | null>(null);
  const [workforce, setWorkforce] = useState<WorkforceSnapshot | null>(null);
  const [workflows, setWorkflows] = useState<WorkflowCenterSnapshot | null>(null);
  const [communications, setCommunications] = useState<CommunicationsSnapshot | null>(null);
  const [connectors, setConnectors] = useState<ConnectorCenterSnapshot | null>(null);
  const [onboarding, setOnboarding] = useState<OnboardingSnapshot | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsSnapshot | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const refreshAll = useCallback(async () => {
    const [d, w, wf, c, cn, o, a, act] = await Promise.all([
      provider.getDashboard(),
      provider.getWorkforce(),
      provider.getWorkflows(),
      provider.getCommunications(),
      provider.getConnectors(),
      provider.getOnboarding(),
      provider.getAnalytics(),
      provider.getActivityFeed(),
    ]);
    setDashboard(d);
    setWorkforce(w);
    setWorkflows(wf);
    setCommunications(c);
    setConnectors(cn);
    setOnboarding(o);
    setAnalytics(a);
    setActivity(act);
  }, [provider]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    void refreshAll();
  }, [refreshAll]);

  useEffect(() => {
    const handler = (event: NeoEvent) => {
      switch (event.type) {
        case "dashboard.updated":
          setDashboard(event.payload as ExecutiveDashboard);
          break;
        case "workforce.updated":
          setWorkforce(event.payload as WorkforceSnapshot);
          break;
        case "workflows.updated":
          setWorkflows(event.payload as WorkflowCenterSnapshot);
          break;
        case "communications.updated":
          setCommunications(event.payload as CommunicationsSnapshot);
          break;
        case "connectors.updated":
          setConnectors(event.payload as ConnectorCenterSnapshot);
          break;
        case "onboarding.updated":
          setOnboarding(event.payload as OnboardingSnapshot);
          break;
        case "analytics.updated":
          setAnalytics(event.payload as AnalyticsSnapshot);
          break;
        case "activity.new":
          setActivity((prev) => [event.payload as ActivityItem, ...prev].slice(0, 50));
          break;
        case "notification.toast": {
          const toast = event.payload as ToastNotification;
          setToasts((prev) => [toast, ...prev].slice(0, 5));
          setTimeout(() => dismissToast(toast.id), 5000);
          break;
        }
        default:
          break;
      }
    };

    return provider.subscribe(handler);
  }, [provider, dismissToast]);

  const value = useMemo(
    () => ({
      provider,
      dashboard,
      workforce,
      workflows,
      communications,
      connectors,
      onboarding,
      analytics,
      activity,
      toasts,
      dismissToast,
      refreshAll,
    }),
    [
      provider,
      dashboard,
      workforce,
      workflows,
      communications,
      connectors,
      onboarding,
      analytics,
      activity,
      toasts,
      dismissToast,
      refreshAll,
    ],
  );

  return <NeoContext.Provider value={value}>{children}</NeoContext.Provider>;
}

export function useNeo(): NeoContextValue {
  const ctx = useContext(NeoContext);
  if (!ctx) throw new Error("useNeo must be used within NeoProvider");
  return ctx;
}
