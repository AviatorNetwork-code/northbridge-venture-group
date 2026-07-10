import { StyleSheet, Text, View } from "react-native";
import type { ReportFreshnessDto, TeamSummaryDto } from "@/types/dashboard";
import type { AppTheme } from "@/theme/tokens";
import { spacing, typography } from "@/theme/tokens";
import { formatTeamLabel } from "./DashboardCardView";

export function TeamSummaryListView({
  teams,
  theme,
}: {
  teams: TeamSummaryDto[];
  theme: AppTheme;
}) {
  if (teams.length === 0) return null;

  return (
    <View style={styles.container} accessibilityRole="list" accessibilityLabel="Team summaries">
      <Text style={[styles.title, { color: theme.colors.textPrimary }]} accessibilityRole="header">
        Active Teams
      </Text>
      {teams.map((team) => (
        <View
          key={team.teamId}
          style={[styles.item, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
          accessibilityRole="summary"
          accessibilityLabel={`${team.teamName}, ${team.status}`}
        >
          <Text style={[styles.name, { color: theme.colors.textPrimary }]}>{team.teamName}</Text>
          <Text style={[styles.summary, { color: theme.colors.textSecondary }]}>{team.summary}</Text>
          <Text style={[styles.meta, { color: theme.colors.textSecondary }]}>
            Pending {team.pendingCount} · Escalations {team.escalationCount}
          </Text>
        </View>
      ))}
    </View>
  );
}

export function FreshnessBanner({
  freshness,
  theme,
  staleLabel,
}: {
  freshness: ReportFreshnessDto[];
  theme: AppTheme;
  staleLabel?: string;
}) {
  const staleTeams = freshness.filter((entry) => entry.status === "stale");
  if (staleTeams.length === 0 && !staleLabel) return null;

  const message =
    staleLabel ??
    `Some team reports may be stale: ${staleTeams.map((entry) => formatTeamLabel(entry.teamId)).join(", ")}`;

  return (
    <View
      style={[styles.banner, { backgroundColor: theme.colors.surface, borderColor: theme.colors.accent }]}
      accessibilityRole="text"
      accessibilityLabel={message}
    >
      <Text style={[styles.bannerText, { color: theme.colors.accent }]}>{message}</Text>
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
  name: { fontSize: typography.body, fontWeight: "600" },
  summary: { fontSize: typography.body, lineHeight: 22 },
  meta: { fontSize: typography.caption },
  banner: {
    borderWidth: 1,
    borderRadius: 12,
    padding: spacing.md,
  },
  bannerText: {
    fontSize: typography.caption,
    fontWeight: "600",
  },
});
