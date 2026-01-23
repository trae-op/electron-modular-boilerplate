import { describe, expect, it, vi } from "vitest";

vi.mock("@devisfuture/electron-modular", () => ({
  WindowManager: () => () => undefined,
}));

describe("UpdaterWindow", () => {
  it("checks for updates on first load only once", async () => {
    const { UpdaterWindow } = await import("./window.js");

    const checkForUpdatesService = {
      checkForUpdates: vi.fn(),
      setFeedUrlService: vi.fn(),
      controlUpdateWindowsPlatformService: vi.fn(),
    } as any;

    const setFeedUrlService = {
      setFeedURL: vi.fn(),
    } as any;

    const controlUpdateWindowsPlatformService = {
      controlUpdate: vi.fn(),
    } as any;
    const window = new UpdaterWindow(
      checkForUpdatesService,
      setFeedUrlService,
      controlUpdateWindowsPlatformService,
    );

    window.onWebContentsDidFinishLoad();
    window.onWebContentsDidFinishLoad();

    expect(checkForUpdatesService.checkForUpdates).toHaveBeenCalledTimes(1);
  });

  it("checks for updates when window is shown after first", async () => {
    const { UpdaterWindow } = await import("./window.js");

    const checkForUpdatesService = {
      checkForUpdates: vi.fn(),
    } as any;

    const setFeedUrlService = {
      setFeedURL: vi.fn(),
    } as any;

    const controlUpdateWindowsPlatformService = {
      controlUpdate: vi.fn(),
    } as any;

    const window = new UpdaterWindow(
      checkForUpdatesService,
      setFeedUrlService,
      controlUpdateWindowsPlatformService,
    );
    window.onWebContentsDidFinishLoad();
    window.onShow();

    expect(checkForUpdatesService.checkForUpdates).toHaveBeenCalledTimes(2);
  });
});
