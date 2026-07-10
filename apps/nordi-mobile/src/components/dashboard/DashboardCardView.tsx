import { Pressable, StyleSheet, Text, View } from "react-native";
import type { DashboardCardDto } from "@/types/dashboard";
import type { AppTheme } from "@/theme/tokens";
import { spacing, typography } from "@/theme/tokens";

function statusColor(status: DashboardCardDto["status"], theme: AppTheme): string {
  switch (status) {
    case "critical":
      return theme.mode === "dark" ? "#F87171" : "#C8102E";
    case "warning":
      return theme.mode === "dark" ? "#FACC15" : "#CA8A04";
    case "healthy":
      return theme.mode === "dark" ? "#4ADE80" : "#15803D";
    default:
      return theme.colors.textSecondary;
  }
}

function formatPayload(payload: Record<string, unknown>): string {
  const entries = Object.entries(payload).filter(
    ([key]) => !["specialistId", "teamLeadId", "operationsContextRef"].includes(key),
  );

  if (entries.length === 0) return "No additional details";

  return entries
    .slice(0, 4)
    .map(([key, value]) => {
      if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
        return `${key}: ${String(value)}`;
      }
      if (Array.isArray(value)) {
        return `${key}: ${value.length} item${value.length === 1 ? "" : "s"}`;
      }
      return `${key}: details available`;
    })
    .join("\n");
}

export function DashboardCardView({
  card,
  theme,
}: {
  card: DashboardCardDto;
  theme: AppTheme;
}) {
  return (
    <View
      style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
      accessibilityRole="summary"
      accessibilityLabel={`${card.title}, status ${card.status}`}
    >
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{card.title}</Text>
        <View style={[styles.badge, { backgroundColor: statusColor(card.status, theme) }]}>
          <Text style={styles.badgeText}>{card.status}</Text>
        </View>
      </View>
      {card.sourceTeamId ? (
        <Text style={[styles.meta, { color: theme.colors.textSecondary }]}>
          Team: {formatTeamLabel(card.sourceTeamId)}
        </Text>
      ) : null}
      <Text style={[styles.body, { color: theme.colors.textSecondary }]}>
        {formatPayload(card.payload)}
      </Text>
    </View>
  );
}

export function formatTeamLabel(teamId: string): string {
  return teamId.replace(/^team-/, "").replace(/-/g, " ");
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: spacing.md,
    gap: spacing.sm,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.sm,
  },
  title: {
    flex: 1,
    fontSize: typography.body,
    fontWeight: "600",
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: typography.caption,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  meta: {
    fontSize: typography.caption,
  },
  body: {
    fontSize: typography.caption,
    lineHeight: 18,
  },
});
