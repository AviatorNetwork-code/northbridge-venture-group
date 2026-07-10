import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/auth/auth-context";
import { useAppTheme } from "@/hooks/useAppTheme";
import { spacing, touchTargetMin, typography } from "@/theme/tokens";

export default function SignInScreen() {
  const theme = useAppTheme();
  const { signInWithDevToken, status } = useAuth();
  const [token, setToken] = useState("token-customer-1");

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.brand, { color: theme.colors.textPrimary }]} accessibilityRole="header">
        Nordi
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        Development sign-in uses Phase 22 bearer tokens.
      </Text>
      <TextInput
        value={token}
        onChangeText={setToken}
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="Bearer token"
        placeholderTextColor={theme.colors.textSecondary}
        style={[
          styles.input,
          {
            color: theme.colors.textPrimary,
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.surface,
          },
        ]}
        accessibilityLabel="Development bearer token"
      />
      <Pressable
        onPress={() => void signInWithDevToken(token.trim())}
        style={[styles.button, { backgroundColor: theme.colors.accent, minHeight: touchTargetMin }]}
        accessibilityRole="button"
        accessibilityLabel="Sign in"
      >
        <Text style={styles.buttonText}>{status === "signing_in" ? "Signing in..." : "Sign in"}</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.md,
    justifyContent: "center",
  },
  brand: {
    fontSize: typography.title,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    fontSize: typography.body,
    lineHeight: 22,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.body,
    minHeight: touchTargetMin,
  },
  button: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: typography.body,
    fontWeight: "700",
  },
});
