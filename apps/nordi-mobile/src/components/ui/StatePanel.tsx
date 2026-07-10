import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import type { AppTheme } from "@/theme/tokens";
import { spacing, typography } from "@/theme/tokens";

interface StatePanelProps {
  theme: AppTheme;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  loading?: boolean;
  testID?: string;
}

export function StatePanel({
  theme,
  title,
  message,
  actionLabel,
  onAction,
  loading,
  testID,
}: StatePanelProps) {
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]} testID={testID}>
      {loading ? <ActivityIndicator color={theme.colors.accent} accessibilityLabel="Loading" /> : null}
      <Text
        style={[styles.title, { color: theme.colors.textPrimary }]}
        accessibilityRole="header"
      >
        {title}
      </Text>
      <Text style={[styles.message, { color: theme.colors.textSecondary }]}>{message}</Text>
      {actionLabel && onAction ? (
        <Text
          onPress={onAction}
          style={[styles.action, { color: theme.colors.accent }]}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
        >
          {actionLabel}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  title: {
    fontSize: typography.heading,
    fontWeight: "600",
  },
  message: {
    fontSize: typography.body,
    lineHeight: 22,
  },
  action: {
    marginTop: spacing.sm,
    fontSize: typography.body,
    fontWeight: "600",
  },
});
