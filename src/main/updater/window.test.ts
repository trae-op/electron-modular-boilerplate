import { describe, expect, it, vi } from "vitest";

vi.mock("@devisfuture/electron-modular", () => ({
  WindowManager: () => () => undefined,
}));

describe("UpdaterWindow", () => {
  it("calls checkForUpdates each time the load finishes", async () => {
    const { UpdaterWindow } = await import("./window.js");

    const checkForUpdatesService = {
      checkForUpdates: vi.fn(),
    } as any;

    const window = new UpdaterWindow(checkForUpdatesService);

    window.onWebContentsDidFinishLoad();
    window.onWebContentsDidFinishLoad();

    expect(checkForUpdatesService.checkForUpdates).toHaveBeenCalledTimes(2);
  });

  it("checks for updates when window is shown after first", async () => {
    const { UpdaterWindow } = await import("./window.js");

    const checkForUpdatesService = {
      checkForUpdates: vi.fn(),
    } as any;

    const window = new UpdaterWindow(checkForUpdatesService);
    window.onWebContentsDidFinishLoad();
    window.onShow();

    expect(checkForUpdatesService.checkForUpdates).toHaveBeenCalledTimes(2);
  });
});
