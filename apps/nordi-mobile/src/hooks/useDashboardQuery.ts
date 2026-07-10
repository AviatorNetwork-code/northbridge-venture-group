import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DashboardApiError } from "@/api/errors";
import { MobileDashboardApiClient } from "@/api/dashboard-client";
import { dashboardCache } from "@/cache/dashboard-cache";
import { getAppEnvironment } from "@/config/env";
import { useAuthStore } from "@/stores/ui-store";
import type { DashboardResponse } from "@/types/dashboard";
import { createDefaultAuthenticationClient } from "@/auth/auth-client";

const dashboardClient = new MobileDashboardApiClient();

export function useDashboardQuery(accessToken: string | null) {
  const env = getAppEnvironment();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["mobile-dashboard", env.organizationId],
    enabled: Boolean(accessToken),
    queryFn: async (): Promise<DashboardResponse> => {
      if (!accessToken) {
        throw new DashboardApiError({
          code: "unauthenticated",
          message: "Authentication required.",
          status: 401,
          correlationId: "missing-token",
        });
      }

      try {
        const response = await dashboardClient.fetchDashboard({
          organizationId: env.organizationId,
          accessToken,
        });
        await dashboardCache.set(response);
        return response;
      } catch (error) {
        if (error instanceof DashboardApiError && error.code === "network_unavailable") {
          const cached = await dashboardCache.get();
          if (cached) {
            return cached.response;
          }
        }
        throw error;
      }
    },
  });

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["mobile-dashboard", env.organizationId] });
    return query.refetch();
  }, [env.organizationId, query, queryClient]);

  return { ...query, refresh };
}

export async function getAccessTokenForDashboard(): Promise<string | null> {
  const session = await createDefaultAuthenticationClient().getSession();
  return session?.accessToken ?? null;
}

export function mapDashboardError(error: unknown): {
  title: string;
  message: string;
  code?: string;
} {
  if (error instanceof DashboardApiError) {
    switch (error.code) {
      case "unauthenticated":
        useAuthStore.getState().setStatus("expired_session");
        return {
          title: "Sign in required",
          message: error.message,
          code: error.code,
        };
      case "organization_access_denied":
        return {
          title: "Access denied",
          message: error.message,
          code: error.code,
        };
      case "unsupported_dashboard_version":
        return {
          title: "Update required",
          message: error.message,
          code: error.code,
        };
      case "network_unavailable":
        return {
          title: "Network unavailable",
          message: error.message,
          code: error.code,
        };
      default:
        return {
          title: "Dashboard unavailable",
          message: error.message,
          code: error.code,
        };
    }
  }

  return {
    title: "Dashboard unavailable",
    message: "Unable to load dashboard at this time.",
  };
}
