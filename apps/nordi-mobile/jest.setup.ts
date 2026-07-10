import "@testing-library/jest-native/extend-expect";

jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(async () => null),
  setItemAsync: jest.fn(async () => undefined),
  deleteItemAsync: jest.fn(async () => undefined),
}));

jest.mock("expo-localization", () => ({
  getLocales: () => [{ languageTag: "en-US" }],
}));

jest.mock("expo-constants", () => ({
  expoConfig: {
    version: "1.0.0",
    extra: {},
  },
}));

jest.mock("expo-router", () => ({
  router: {
    replace: jest.fn(),
  },
  Stack: ({ children }: { children: React.ReactNode }) => children,
  Tabs: ({ children }: { children: React.ReactNode }) => children,
}));
