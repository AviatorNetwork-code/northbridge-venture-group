import { Pressable, StyleSheet, Text, View } from "react-native";
import type { SupportedActionDto } from "@/types/dashboard";
import type { AppTheme } from "@/theme/tokens";
import { spacing, touchTargetMin, typography } from "@/theme/tokens";

const PLACEHOLDER_ACTIONS = new Set<SupportedActionDto["type"]>([
  "view_recommendation_evidence",
  "acknowledge_alert",
  "view_team_section",
  "refresh_dashboard",
]);

export function SupportedActionsView({
  actions,
  theme,
  onAction,
}: {
  actions: SupportedActionDto[];
  theme: AppTheme;
  onAction: (action: SupportedActionDto) => void;
}) {
  const visibleActions = actions.filter((action) => PLACEHOLDER_ACTIONS.has(action.type));

  if (visibleActions.length === 0) return null;

  return (
    <View style={styles.container} accessibilityRole="menu" accessibilityLabel="Supported actions">
      <Text style={[styles.title, { color: theme.colors.textPrimary }]} accessibilityRole="header">
        Actions
      </Text>
      {visibleActions.map((action) => (
        <Pressable
          key={action.id}
          onPress={() => onAction(action)}
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              opacity: pressed ? 0.85 : 1,
              minHeight: touchTargetMin,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel={action.label}
        >
          <Text style={[styles.label, { color: theme.colors.textPrimary }]}>{action.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  title: { fontSize: typography.heading, fontWeight: "700" },
  button: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    justifyContent: "center",
  },
  label: {
    fontSize: typography.body,
    fontWeight: "600",
  },
});
