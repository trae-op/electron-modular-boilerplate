import { describe, expect, it, vi } from "vitest";

vi.mock("electron", () => ({
  app: {
    getAppPath: vi.fn(() => "/app"),
  },
}));

vi.mock("./utils.js", () => ({
  isDev: vi.fn(() => false),
}));

describe("@shared/path-resolver", () => {
  it("resolves preload path for production", async () => {
    vi.resetModules();
    const { getPreloadPath } = await import("./path-resolver.js");
    expect(getPreloadPath()).toBe("/dist-main/preload.cjs");
  });

  it("resolves UI path", async () => {
    vi.resetModules();
    const { getUIPath } = await import("./path-resolver.js");
    expect(getUIPath()).toBe("/app/dist-renderer/index.html");
  });

  it("resolves assets path for development", async () => {
    vi.resetModules();
    const { isDev } = await import("./utils.js");
    vi.mocked(isDev).mockReturnValue(true);

    const { getAssetsPath } = await import("./path-resolver.js");
    expect(getAssetsPath()).toBe("/app/src/assets");
  });
});
