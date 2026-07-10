import fs from "node:fs";
import path from "node:path";

describe("native navigation shell", () => {
  it("defines the five primary bottom tabs", () => {
    const layoutPath = path.join(__dirname, "..", "app", "(tabs)", "_layout.tsx");
    const content = fs.readFileSync(layoutPath, "utf8");

    expect(content).toContain('name="dashboard"');
    expect(content).toContain('name="workforce"');
    expect(content).toContain('name="messages"');
    expect(content).toContain('name="reports"');
    expect(content).toContain('name="more"');
  });
});
