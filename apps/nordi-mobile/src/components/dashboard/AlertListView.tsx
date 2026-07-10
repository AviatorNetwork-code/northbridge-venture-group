import { StyleSheet, Text, View } from "react-native";
import type { DashboardAlertDto } from "@/types/dashboard";
import type { AppTheme } from "@/theme/tokens";
import { spacing, typography } from "@/theme/tokens";
import { formatTeamLabel } from "./DashboardCardView";

export function AlertListView({
  alerts,
  theme,
}: {
  alerts: DashboardAlertDto[];
  theme: AppTheme;
}) {
  if (alerts.length === 0) return null;

  return (
    <View style={styles.container} accessibilityRole="list" accessibilityLabel="Alerts">
      <Text style={[styles.title, { color: theme.colors.textPrimary }]} accessibilityRole="header">
        Alerts
      </Text>
      {alerts.map((alert) => (
        <View
          key={alert.id}
          style={[styles.item, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
          accessibilityRole="text"
          accessibilityLabel={`${alert.severity} alert from ${formatTeamLabel(alert.sourceTeamId)}`}
        >
          <Text style={[styles.severity, { color: theme.colors.accent }]}>{alert.severity}</Text>
          <Text style={[styles.message, { color: theme.colors.textPrimary }]}>{alert.message}</Text>
          <Text style={[styles.meta, { color: theme.colors.textSecondary }]}>
            {formatTeamLabel(alert.sourceTeamId)} · {alert.category}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  title: { fontSize: typography.heading, fontWeight: "700" },
  item: {
    borderWidth: 1,
    borderRadius: 12,
    padding: spacing.md,
    gap: spacing.xs,
  },
  severity: {
    fontSize: typography.caption,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  message: { fontSize: typography.body, lineHeight: 22 },
  meta: { fontSize: typography.caption },
});
