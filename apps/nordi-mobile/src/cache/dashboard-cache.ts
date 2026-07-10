import type { DashboardResponse } from "@/types/dashboard";

export interface CachedDashboardEntry {
  response: DashboardResponse;
  cachedAt: string;
}

export interface DashboardCache {
  get(): Promise<CachedDashboardEntry | null>;
  set(response: DashboardResponse): Promise<void>;
  clear(): Promise<void>;
}

export class InMemoryDashboardCache implements DashboardCache {
  private entry: CachedDashboardEntry | null = null;

  async get(): Promise<CachedDashboardEntry | null> {
    return this.entry;
  }

  async set(response: DashboardResponse): Promise<void> {
    this.entry = {
      response,
      cachedAt: new Date().toISOString(),
    };
  }

  async clear(): Promise<void> {
    this.entry = null;
  }
}

export const dashboardCache = new InMemoryDashboardCache();
