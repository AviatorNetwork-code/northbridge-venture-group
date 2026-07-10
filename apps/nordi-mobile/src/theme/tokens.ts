export const colors = {
  northbridgeBlack: "#0A0A0A",
  northbridgeWhite: "#FFFFFF",
  northbridgeRed: "#C8102E",
  surfaceLight: "#F5F5F5",
  surfaceDark: "#141414",
  borderLight: "#E5E5E5",
  borderDark: "#2A2A2A",
  textPrimaryLight: "#0A0A0A",
  textPrimaryDark: "#F5F5F5",
  textSecondaryLight: "#525252",
  textSecondaryDark: "#A3A3A3",
  healthy: "#15803D",
  warning: "#CA8A04",
  critical: "#C8102E",
  info: "#2563EB",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const touchTargetMin = 44;

export const typography = {
  title: 22,
  heading: 18,
  body: 16,
  caption: 13,
} as const;

export type ThemeMode = "light" | "dark";

export function getTheme(mode: ThemeMode) {
  const isDark = mode === "dark";
  return {
    mode,
    colors: {
      background: isDark ? colors.northbridgeBlack : colors.northbridgeWhite,
      surface: isDark ? colors.surfaceDark : colors.surfaceLight,
      textPrimary: isDark ? colors.textPrimaryDark : colors.textPrimaryLight,
      textSecondary: isDark ? colors.textSecondaryDark : colors.textSecondaryLight,
      border: isDark ? colors.borderDark : colors.borderLight,
      accent: colors.northbridgeRed,
      header: isDark ? colors.northbridgeBlack : colors.northbridgeWhite,
    },
  };
}

export type AppTheme = ReturnType<typeof getTheme>;
