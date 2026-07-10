import { PlaceholderTabScreen } from "@/components/screens/PlaceholderTabScreen";
import { useAppTheme } from "@/hooks/useAppTheme";

export default function MoreScreen() {
  const theme = useAppTheme();
  return (
    <PlaceholderTabScreen
      title="More"
      description="Additional account and organization settings will appear here in a future phase."
      theme={theme}
    />
  );
}
