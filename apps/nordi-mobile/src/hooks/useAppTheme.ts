import { useMemo } from "react";
import { useColorScheme } from "react-native";
import { getTheme, type AppTheme } from "@/theme/tokens";

export function useAppTheme(): AppTheme {
  const scheme = useColorScheme();
  return useMemo(() => getTheme(scheme === "dark" ? "dark" : "light"), [scheme]);
}
