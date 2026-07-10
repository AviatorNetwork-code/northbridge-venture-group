import fs from "node:fs";
import path from "node:path";

describe("secure token storage", () => {
  it("uses Expo SecureStore rather than AsyncStorage for tokens", () => {
    const storePath = path.join(__dirname, "..", "src", "auth", "secure-token-store.ts");
    const content = fs.readFileSync(storePath, "utf8");

    expect(content).toContain("expo-secure-store");
    expect(content).not.toContain("@react-native-async-storage/async-storage");
  });
});
