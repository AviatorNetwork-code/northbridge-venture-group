import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import type { DashboardResponse } from "@/types/dashboard";
import type { AppTheme } from "@/theme/tokens";
import { spacing, typography } from "@/theme/tokens";
import { AlertListView } from "./AlertListView";
import { DashboardSectionView } from "./DashboardSectionView";
import { FreshnessBanner, TeamSummaryListView } from "./TeamSummaryListView";
import { RecommendationListView } from "./RecommendationListView";
import { SupportedActionsView } from "./SupportedActionsView";

export function DashboardContentView({
  dashboard,
  theme,
  cachedLabel,
  onAction,
  refreshing,
  onRefresh,
}: {
  dashboard: DashboardResponse;
  theme: AppTheme;
  cachedLabel?: string;
  onAction: (action: DashboardResponse["supportedActions"][number]) => void;
  refreshing?: boolean;
  onRefresh?: () => void;
}) {
  const visibleSections = dashboard.sections.filter(
    (section) => section.available && !section.placeholder,
  );

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      accessibilityLabel="Dashboard content"
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={Boolean(refreshing)} onRefresh={onRefresh} tintColor={theme.colors.accent} />
        ) : undefined
      }
    >
      <View style={styles.headerBlock}>
        <Text style={[styles.orgName, { color: theme.colors.textPrimary }]} accessibilityRole="header">
          {dashboard.metadata.organizationPublicName ?? "Your Organization"}
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          {dashboard.metadata.availableTeams.length} active team
          {dashboard.metadata.availableTeams.length === 1 ? "" : "s"}
        </Text>
      </View>

      {cachedLabel ? (
        <FreshnessBanner freshness={dashboard.freshness} theme={theme} staleLabel={cachedLabel} />
      ) : (
        <FreshnessBanner freshness={dashboard.freshness} theme={theme} />
      )}

      <TeamSummaryListView teams={dashboard.teamSummaries} theme={theme} />

      {visibleSections.map((section) => (
        <DashboardSectionView key={section.id} section={section} theme={theme} />
      ))}

      <AlertListView alerts={dashboard.alerts} theme={theme} />
      <RecommendationListView recommendations={dashboard.recommendations} theme={theme} />
      <SupportedActionsView actions={dashboard.supportedActions} theme={theme} onAction={onAction} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.md,
    gap: spacing.lg,
    paddingBottom: spacing.xl,
  },
  headerBlock: {
    gap: spacing.xs,
  },
  orgName: {
    fontSize: typography.title,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: typography.body,
  },
});
