import { StyleSheet, Text, View } from "react-native";
import type { AppTheme } from "@/theme/tokens";
import { spacing, typography } from "@/theme/tokens";

export function PlaceholderTabScreen({
  title,
  description,
  theme,
}: {
  title: string;
  description: string;
  theme: AppTheme;
}) {
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.textPrimary }]} accessibilityRole="header">
        {title}
      </Text>
      <Text style={[styles.description, { color: theme.colors.textSecondary }]}>{description}</Text>
      <Text style={[styles.status, { color: theme.colors.accent }]}>Coming in a future phase</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.md,
    justifyContent: "center",
  },
  title: {
    fontSize: typography.title,
    fontWeight: "700",
  },
  description: {
    fontSize: typography.body,
    lineHeight: 22,
  },
  status: {
    fontSize: typography.caption,
    fontWeight: "600",
  },
});
