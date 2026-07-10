import fs from "node:fs";
import path from "node:path";

describe("native app constraints", () => {
  it("does not depend on WebView or DOM rendering APIs", () => {
    const root = path.join(__dirname, "..");
    const sourceRoots = [path.join(root, "app"), path.join(root, "src")];
    const forbidden = ["react-native-webview", "WebView", "iframe", "document.", "window."];

    const violations: string[] = [];

    for (const sourceRoot of sourceRoots) {
      walk(sourceRoot, (filePath, content) => {
        for (const term of forbidden) {
          if (content.includes(term)) {
            violations.push(`${filePath} contains ${term}`);
          }
        }
      });
    }

    expect(violations).toEqual([]);
  });
});

function walk(dir: string, visit: (filePath: string, content: string) => void) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, visit);
      continue;
    }
    if (!/\.(tsx?|jsx?)$/.test(entry.name)) continue;
    visit(fullPath, fs.readFileSync(fullPath, "utf8"));
  }
}
