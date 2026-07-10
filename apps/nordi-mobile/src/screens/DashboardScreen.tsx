import { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DashboardContentView } from "@/components/dashboard/DashboardContentView";
import { StatePanel } from "@/components/ui/StatePanel";
import { useAppTheme } from "@/hooks/useAppTheme";
import { mapDashboardError, useDashboardQuery } from "@/hooks/useDashboardQuery";
import { useAuth } from "@/auth/auth-context";
import { useDashboardUiStore } from "@/stores/ui-store";
import type { SupportedActionDto } from "@/types/dashboard";
import { spacing, touchTargetMin, typography } from "@/theme/tokens";
import { dashboardCache } from "@/cache/dashboard-cache";

export function DashboardScreen() {
  const theme = useAppTheme();
  const { authClient, signOut } = useAuth();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [cachedLabel, setCachedLabel] = useState<string | undefined>();
  const setActionMessage = useDashboardUiStore((state) => state.setActionMessage);
  const actionMessage = useDashboardUiStore((state) => state.actionMessage);

  useEffect(() => {
    void authClient.getSession().then((session) => {
      setAccessToken(session?.accessToken ?? null);
    });
  }, [authClient]);

  const { data, isLoading, isRefetching, error, refresh } = useDashboardQuery(accessToken);

  useEffect(() => {
    if (error) {
      void dashboardCache.get().then((cached) => {
        if (cached) {
          setCachedLabel("Showing cached dashboard data. Connection may be unavailable.");
        }
      });
    } else {
      setCachedLabel(undefined);
    }
  }, [error]);

  const onAction = useCallback(
    (action: SupportedActionDto) => {
      if (action.type === "refresh_dashboard") {
        void refresh();
        return;
      }
      setActionMessage(`${action.label} will be available in a future phase.`);
    },
    [refresh, setActionMessage],
  );

  const renderBody = () => {
    if (isLoading && !data) {
      return (
        <StatePanel
          theme={theme}
          title="Loading dashboard"
          message="Fetching your latest organization overview."
          loading
          testID="dashboard-loading"
        />
      );
    }

    if (error && !data) {
      const mapped = mapDashboardError(error);
      return (
        <StatePanel
          theme={theme}
          title={mapped.title}
          message={mapped.message}
          actionLabel="Try again"
          onAction={() => void refresh()}
          testID={`dashboard-error-${mapped.code ?? "unknown"}`}
        />
      );
    }

    if (data && data.metadata.availableTeams.length === 0) {
      return (
        <StatePanel
          theme={theme}
          title="No active teams"
          message="Your organization does not have any active digital teams yet."
          testID="dashboard-no-teams"
        />
      );
    }

    if (data) {
      return (
        <DashboardContentView
          dashboard={data}
          theme={theme}
          cachedLabel={cachedLabel}
          onAction={onAction}
          refreshing={isRefetching}
          onRefresh={() => void refresh()}
        />
      );
    }

    return (
      <StatePanel
        theme={theme}
        title="Dashboard empty"
        message="No dashboard data is available for this organization."
        testID="dashboard-empty"
      />
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <Pressable
          onPress={() => void signOut()}
          style={styles.headerButton}
          accessibilityRole="button"
          accessibilityLabel="Open account menu and sign out"
        >
          <Text style={[styles.headerButtonText, { color: theme.colors.textPrimary }]}>Menu</Text>
        </Pressable>
        <Text style={[styles.brand, { color: theme.colors.textPrimary }]} accessibilityRole="header">
          Nordi
        </Text>
        <Pressable
          onPress={() => setActionMessage("Notifications will be available in a future phase.")}
          style={styles.headerButton}
          accessibilityRole="button"
          accessibilityLabel="Notifications"
        >
          <Text style={[styles.headerButtonText, { color: theme.colors.textPrimary }]}>Alerts</Text>
        </Pressable>
      </View>

      {actionMessage ? (
        <Text style={[styles.actionMessage, { color: theme.colors.textSecondary }]}>
          {actionMessage}
        </Text>
      ) : null}

      <View style={styles.body}>{renderBody()}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    minHeight: touchTargetMin,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
  },
  headerButton: {
    minWidth: touchTargetMin,
    minHeight: touchTargetMin,
    justifyContent: "center",
  },
  headerButtonText: {
    fontSize: typography.caption,
    fontWeight: "600",
  },
  brand: {
    fontSize: typography.heading,
    fontWeight: "700",
  },
  actionMessage: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    fontSize: typography.caption,
  },
  body: { flex: 1 },
});
