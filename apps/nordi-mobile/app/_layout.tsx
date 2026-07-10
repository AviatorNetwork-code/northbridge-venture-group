import { Stack, router } from "expo-router";
import { useEffect } from "react";
import { AppProviders } from "@/providers/AppProviders";
import { useAuthStore } from "@/stores/ui-store";

function RootNavigator() {
  const status = useAuthStore((state) => state.status);

  useEffect(() => {
    if (status === "signed_out" || status === "expired_session") {
      router.replace("/sign-in");
      return;
    }
    if (status === "authenticated") {
      router.replace("/(tabs)/dashboard");
    }
  }, [status]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
}
