import { StyleSheet, Text, View } from "react-native";
import type { DashboardSectionDto } from "@/types/dashboard";
import type { AppTheme } from "@/theme/tokens";
import { spacing, typography } from "@/theme/tokens";
import { DashboardCardView } from "./DashboardCardView";

export function DashboardSectionView({
  section,
  theme,
}: {
  section: DashboardSectionDto;
  theme: AppTheme;
}) {
  if (!section.available || section.placeholder) {
    return null;
  }

  return (
    <View style={styles.section} accessibilityRole="summary" accessibilityLabel={section.title}>
      <Text style={[styles.title, { color: theme.colors.textPrimary }]} accessibilityRole="header">
        {section.title}
      </Text>
      {section.cards.length === 0 ? (
        <Text style={[styles.empty, { color: theme.colors.textSecondary }]}>
          No items in this section.
        </Text>
      ) : (
        section.cards.map((card) => (
          <DashboardCardView key={card.id} card={card} theme={theme} />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.sm,
  },
  title: {
    fontSize: typography.heading,
    fontWeight: "700",
  },
  empty: {
    fontSize: typography.body,
  },
});
