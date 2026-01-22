import { describe, expect, it, vi } from "vitest";

vi.mock("#shared/utils.js", () => ({
  isDev: vi.fn(() => false),
  isPlatform: vi.fn(() => true),
}));

vi.mock("electron-updater", () => ({
  default: {
    autoUpdater: {
      setFeedURL: vi.fn(),
      disableDifferentialDownload: false,
    },
  },
}));

describe("SetFeedUrlService", () => {
  it("sets feed URL on Windows in production", async () => {
    process.env.GH_TOKEN = "token";

    const updater = await import("electron-updater");
    const { SetFeedUrlService } = await import("./set-feed-url.js");

    const service = new SetFeedUrlService();
    service.setFeedURL();

    expect(updater.default.autoUpdater.disableDifferentialDownload).toBe(true);
    expect(updater.default.autoUpdater.setFeedURL).toHaveBeenCalledWith(
      expect.objectContaining({
        provider: "github",
        repo: "electron-modular-boilerplate",
        owner: "trae-op",
        private: true,
        token: "token",
      }),
    );
  });
});
