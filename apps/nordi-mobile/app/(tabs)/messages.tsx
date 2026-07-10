import { PlaceholderTabScreen } from "@/components/screens/PlaceholderTabScreen";
import { useAppTheme } from "@/hooks/useAppTheme";

export default function MessagesScreen() {
  const theme = useAppTheme();
  return (
    <PlaceholderTabScreen
      title="Messages"
      description="Customer messaging with digital teams is not connected in this foundation phase."
      theme={theme}
    />
  );
}
