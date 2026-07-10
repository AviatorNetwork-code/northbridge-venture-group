import { StyleSheet, Text, View } from "react-native";
import type { DashboardRecommendationDto } from "@/types/dashboard";
import type { AppTheme } from "@/theme/tokens";
import { spacing, typography } from "@/theme/tokens";
import { formatTeamLabel } from "./DashboardCardView";

export function RecommendationListView({
  recommendations,
  theme,
}: {
  recommendations: DashboardRecommendationDto[];
  theme: AppTheme;
}) {
  if (recommendations.length === 0) return null;

  return (
    <View
      style={styles.container}
      accessibilityRole="list"
      accessibilityLabel="Recommendations"
    >
      <Text style={[styles.title, { color: theme.colors.textPrimary }]} accessibilityRole="header">
        Recommendations
      </Text>
      {recommendations.map((entry) => (
        <View
          key={entry.id}
          style={[styles.item, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
          accessibilityRole="text"
          accessibilityLabel={`Recommendation from ${formatTeamLabel(entry.sourceTeamId)}`}
        >
          <Text style={[styles.message, { color: theme.colors.textPrimary }]}>
            {entry.recommendation}
          </Text>
          <Text style={[styles.meta, { color: theme.colors.textSecondary }]}>
            {formatTeamLabel(entry.sourceTeamId)} · {entry.confidence} confidence · {entry.priority}{" "}
            priority
          </Text>
          {entry.approvalRequired ? (
            <Text style={[styles.flag, { color: theme.colors.accent }]}>Approval required</Text>
          ) : null}
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
  message: { fontSize: typography.body, lineHeight: 22 },
  meta: { fontSize: typography.caption },
  flag: { fontSize: typography.caption, fontWeight: "600" },
});
