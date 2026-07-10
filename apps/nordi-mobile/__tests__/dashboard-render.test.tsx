import { render, screen } from "@testing-library/react-native";
import { AlertListView } from "@/components/dashboard/AlertListView";
import { DashboardContentView } from "@/components/dashboard/DashboardContentView";
import { RecommendationListView } from "@/components/dashboard/RecommendationListView";
import { StatePanel } from "@/components/ui/StatePanel";
import { getTheme } from "@/theme/tokens";
import { sampleDashboardResponse } from "@/test-fixtures/dashboard-response";

describe("dashboard rendering", () => {
  const theme = getTheme("light");

  it("renders server-provided sections without inventing additional sections", () => {
    render(
      <DashboardContentView
        dashboard={sampleDashboardResponse}
        theme={theme}
        onAction={jest.fn()}
      />,
    );

    expect(screen.getAllByText("Organization Overview").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Marketing").length).toBeGreaterThan(0);
    expect(screen.getByText("Sales")).toBeTruthy();
    expect(screen.queryByText("Financial")).toBeNull();
  });

  it("preserves alert attribution", () => {
    render(<AlertListView alerts={sampleDashboardResponse.alerts} theme={theme} />);
    expect(screen.getByText(/sales/)).toBeTruthy();
    expect(
      screen.getByText("Pipeline converting but follow-up bottleneck detected."),
    ).toBeTruthy();
  });

  it("preserves recommendation attribution", () => {
    render(
      <RecommendationListView recommendations={sampleDashboardResponse.recommendations} theme={theme} />,
    );
    expect(screen.getByText(/marketing/)).toBeTruthy();
    expect(
      screen.getByText("Increase campaign spend on high-performing channels."),
    ).toBeTruthy();
  });

  it("renders loading and empty states", () => {
    render(
      <StatePanel
        theme={theme}
        title="Loading dashboard"
        message="Fetching your latest organization overview."
        loading
        testID="dashboard-loading"
      />,
    );

    expect(screen.getByTestId("dashboard-loading")).toBeTruthy();
    expect(screen.getByText("Loading dashboard")).toBeTruthy();
  });

  it("does not render internal field values from card payloads", () => {
    render(
      <DashboardContentView
        dashboard={sampleDashboardResponse}
        theme={theme}
        onAction={jest.fn()}
      />,
    );

    expect(screen.queryByText(/specialistId/)).toBeNull();
    expect(screen.queryByText(/teamLeadId/)).toBeNull();
  });
});
