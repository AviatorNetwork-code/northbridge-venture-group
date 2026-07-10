import { PlaceholderTabScreen } from "@/components/screens/PlaceholderTabScreen";
import { useAppTheme } from "@/hooks/useAppTheme";

export default function ReportsScreen() {
  const theme = useAppTheme();
  return (
    <PlaceholderTabScreen
      title="Reports"
      description="Extended operational reports will be available here in a future phase."
      theme={theme}
    />
  );
}
