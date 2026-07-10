import { PlaceholderTabScreen } from "@/components/screens/PlaceholderTabScreen";
import { useAppTheme } from "@/hooks/useAppTheme";

export default function WorkforceScreen() {
  const theme = useAppTheme();
  return (
    <PlaceholderTabScreen
      title="Workforce"
      description="Workforce visibility and team coordination will appear here in a future phase."
      theme={theme}
    />
  );
}
