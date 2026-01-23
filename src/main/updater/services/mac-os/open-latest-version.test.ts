import { describe, expect, it, vi } from "vitest";

vi.mock("electron", () => ({
  app: {
    getPath: vi.fn(() => "/downloads"),
  },
  shell: {
    openPath: vi.fn(),
  },
}));

vi.mock("#main/config.js", () => ({
  folders: {
    downloadLatestVersion: {
      macos: {
        root: "downloads",
        app: "app-update",
      },
    },
  },
  messages: {
    autoUpdater: {
      errorOpenFolder: "cannot open folder",
    },
  },
}));

describe("OpenLatestVersionService", () => {
  it("opens latest version file", async () => {
    const { shell } = await import("electron");
    const { OpenLatestVersionService } =
      await import("./open-latest-version.js");

    const service = new OpenLatestVersionService();
    service.openLatestVersion("app.dmg");

    expect(shell.openPath).toHaveBeenCalledWith(
      "/downloads/app-update/app.dmg",
    );
  });
});
