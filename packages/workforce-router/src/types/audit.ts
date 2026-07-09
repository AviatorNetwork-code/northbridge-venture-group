import type { RequestOwner } from "@northbridge/workforce-contracts";

export interface RouteAudit {
  auditId: string;
  requestId: string;
  orgId: string;
  routerVersion: 1;
  strategyIds: string[];
  timestamp: string;
  traceId?: string;
  dedupKey?: string;
  previousOwner?: RequestOwner;
}

export const WORKFORCE_ROUTER_VERSION = 1 as const;
