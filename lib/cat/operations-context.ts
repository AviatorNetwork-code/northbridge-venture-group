import {
  billingPlan,
  workforceManagers,
  workforceSpecialists,
  workforceTeams,
} from "@/components/operations/module-mock-data";
import {
  buildDefaultConnectorState,
  mergeConnectorInstances,
  summarizeConnectorHealth,
} from "@/lib/connectors/connector-health";
import { buildOnboardingConnectorSummary } from "@/lib/connectors/connector-recommendations";

export type OperationsSnapshot = {
  currentModule: string;
  onboarding: {
    readinessPercent: number;
    completed: number;
    total: number;
    canLaunch: boolean;
    items: { item: string; complete: boolean }[];
  };
  connectors: {
    name: string;
    status: string;
    connected: boolean;
  }[];
  workforce: {
    specialistCount: number;
    teamCount: number;
    managerCount: number;
    avgWorkload: number;
  };
  billing: {
    plan: string;
    price: string;
  };
};

const moduleLabels: Record<string, string> = {
  dashboard: "Dashboard",
  "digital-workforce": "Digital Workforce",
  workflows: "Workflows",
  communications: "Communications",
  connectors: "Connectors",
  onboarding: "Onboarding",
  analytics: "Analytics",
  billing: "Billing",
  settings: "Settings",
  hire: "Hire Workforce",
};

export function getModuleLabel(moduleId: string): string {
  return moduleLabels[moduleId] ?? "Operations Center";
}

export function buildOperationsSnapshot(currentModule: string): OperationsSnapshot {
  const instances = mergeConnectorInstances(buildDefaultConnectorState());
  const connectorHealth = summarizeConnectorHealth(instances);
  const connectorOnboarding = buildOnboardingConnectorSummary(instances, {});
  const readinessPercent = connectorOnboarding.launchReadinessPercent;
  const avgWorkload = Math.round(
    workforceSpecialists.reduce((sum, specialist) => sum + specialist.workload, 0) /
      workforceSpecialists.length,
  );

  return {
    currentModule,
    onboarding: {
      readinessPercent,
      completed: connectorOnboarding.connected,
      total: connectorOnboarding.recommended,
      canLaunch: connectorHealth.readyToLaunch,
      items: connectorOnboarding.items.map((item) => ({
        item: `Connect ${item.name}`,
        complete: item.level === "connected",
      })),
    },
    connectors: instances
      .filter((item) => item.status === "connected" || item.status === "syncing")
      .map((connector) => ({
        name: connector.name,
        status: connector.status,
        connected: connector.status === "connected" || connector.status === "syncing",
      })),
    workforce: {
      specialistCount: workforceSpecialists.length,
      teamCount: workforceTeams.length,
      managerCount: workforceManagers.length,
      avgWorkload,
    },
    billing: {
      plan: billingPlan.name,
      price: billingPlan.price,
    },
  };
}

export const moduleKnowledge: Record<
  string,
  { summary: string; catCanHelp: string[]; href: string }
> = {
  dashboard: {
    summary: "Your operational overview — system health, key metrics, and quick access to all modules.",
    catCanHelp: [
      "Explain what each metric means",
      "Guide you to the right module",
      "Summarize your current readiness",
    ],
    href: "/operations",
  },
  "digital-workforce": {
    summary: "Where Specialists, Teams, and Managers live. Specialists do the work; Managers oversee — I help you decide what you need.",
    catCanHelp: [
      "Recommend Specialists for your business",
      "Explain when a Team makes sense",
      "Advise against premature Manager hires",
    ],
    href: "/operations/workforce",
  },
  hire: {
    summary: "Interactive hiring experience — discover your needs, customize your workforce, and start onboarding.",
    catCanHelp: [
      "Guide you through hiring Specialists",
      "Recommend minimum viable workforce",
      "Transfer selections to onboarding",
    ],
    href: "/operations/hire",
  },
  workflows: {
    summary: "Automated processes, approvals, and escalations. Specialists execute workflows — I help you plan which ones to enable.",
    catCanHelp: [
      "Suggest starter workflows",
      "Explain the approval process",
      "Navigate you here when processes are needed",
    ],
    href: "/operations/workflows",
  },
  communications: {
    summary: "Unified inbox across WhatsApp, Email, SMS, and Instagram. I help you decide which channels to connect first.",
    catCanHelp: [
      "Recommend communication channels",
      "Match channels to your customer habits",
      "Guide connector setup",
    ],
    href: "/operations/communications",
  },
  connectors: {
    summary: "Integrations with Google, Gmail, Stripe, WhatsApp, HubSpot, Vercel, and GitHub.",
    catCanHelp: [
      "Recommend minimum connectors",
      "Explain what's missing from onboarding",
      "Advise against unnecessary integrations",
    ],
    href: "/operations/connectors",
  },
  onboarding: {
    summary: "Deployment readiness — connector checklist, workforce recommendations, and go-live progress.",
    catCanHelp: [
      "Report your readiness percentage",
      "Prioritize next setup steps",
      "Tell you what you can skip for now",
    ],
    href: "/operations/onboarding",
  },
  analytics: {
    summary: "Team tasks, time saved, utilization, and response time across your digital workforce.",
    catCanHelp: [
      "Explain ROI from your metrics",
      "Advise when to scale up",
      "Help interpret utilization data",
    ],
    href: "/operations/analytics",
  },
  billing: {
    summary: "Your plan, usage limits, and invoices. I explain pricing — I never approve charges or financial decisions.",
    catCanHelp: [
      "Explain your current plan",
      "Estimate ROI before upgrades",
      "Recommend waiting before scaling costs",
    ],
    href: "/operations/billing",
  },
  settings: {
    summary: "Organization, users, permissions, and CAT preferences.",
    catCanHelp: [
      "Explain permission levels",
      "Guide CAT preference setup",
      "Navigate you here for team access",
    ],
    href: "/operations/settings",
  },
};

export const navigationAliases: Record<string, string> = {
  dashboard: "dashboard",
  home: "dashboard",
  operations: "dashboard",
  hire: "hire",
  "hire workforce": "hire",
  workforce: "digital-workforce",
  "digital workforce": "digital-workforce",
  specialists: "digital-workforce",
  workflows: "workflows",
  workflow: "workflows",
  communications: "communications",
  communication: "communications",
  inbox: "communications",
  connectors: "connectors",
  connector: "connectors",
  integrations: "connectors",
  onboarding: "onboarding",
  analytics: "analytics",
  billing: "billing",
  pricing: "billing",
  settings: "settings",
};
