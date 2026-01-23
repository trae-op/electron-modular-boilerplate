import { describe, expect, it, vi } from "vitest";

vi.mock("@devisfuture/electron-modular", () => ({
  Inject: () => () => undefined,
  IpcHandler: () => () => undefined,
  destroyWindows: vi.fn(),
}));

vi.mock("#shared/ipc/ipc.js", () => ({
  ipcMainOn: vi.fn(),
}));

vi.mock("electron", () => ({
  app: {
    quit: vi.fn(),
  },
}));

vi.mock("electron-updater", () => ({
  default: {
    autoUpdater: {
      quitAndInstall: vi.fn(),
    },
  },
}));

describe("UpdaterIpc", () => {
  it("configures tray click for update window", async () => {
    const { UpdaterIpc } = await import("./ipc.js");

    const trayProvider = {
      getMenu: vi.fn(() => [{ name: "check-update", click: undefined }]),
      collect: vi.fn(),
      destroy: vi.fn(),
    };

    const openLatestVersionService = {
      openLatestVersion: vi.fn(),
    };

    const setFeedUrlService = {
      setFeedURL: vi.fn(),
    };

    const controlUpdateWindowsPlatformService = {
      controlUpdate: vi.fn(),
    };

    const ipc = new UpdaterIpc(
      trayProvider as any,
      openLatestVersionService as any,
      setFeedUrlService as any,
      controlUpdateWindowsPlatformService as any,
    );

    const updateWindow = {
      create: vi.fn().mockResolvedValue({ show: vi.fn() }),
    };

    await ipc.onInit({ getWindow: () => updateWindow } as any);

    expect(trayProvider.collect).toHaveBeenCalled();

    const menu = vi.mocked(trayProvider.collect).mock.calls[0][0];
    const item = menu.find((i: any) => i.name === "check-update");
    expect(item.click).toBeTypeOf("function");
  });

  it("handles restart and openLatestVersion events", async () => {
    const { ipcMainOn } = await import("#shared/ipc/ipc.js");
    const { app } = await import("electron");
    const { destroyWindows } = await import("@devisfuture/electron-modular");
    const updater = await import("electron-updater");

    const trayProvider = {
      getMenu: vi.fn(() => []),
      collect: vi.fn(),
      destroy: vi.fn(),
    };

    const openLatestVersionService = {
      openLatestVersion: vi.fn(),
    };
    const setFeedUrlService = {
      setFeedURL: vi.fn(),
    };

    const controlUpdateWindowsPlatformService = {
      controlUpdate: vi.fn(),
    };

    const { UpdaterIpc } = await import("./ipc.js");
    const ipc = new UpdaterIpc(
      trayProvider as any,
      openLatestVersionService as any,
      setFeedUrlService as any,
      controlUpdateWindowsPlatformService as any,
    );

    await ipc.onInit({ getWindow: () => ({ create: vi.fn() }) } as any);

    const restartHandler = vi
      .mocked(ipcMainOn)
      .mock.calls.find((call) => call[0] === "restart")?.[1] as any;

    restartHandler();

    expect(updater.default.autoUpdater.quitAndInstall).toHaveBeenCalled();

    const openHandler = vi
      .mocked(ipcMainOn)
      .mock.calls.find((call) => call[0] === "openLatestVersion")?.[1] as any;

    openHandler(null, { updateFile: "app.dmg" });

    expect(openLatestVersionService.openLatestVersion).toHaveBeenCalledWith(
      "app.dmg",
    );
    expect(trayProvider.destroy).toHaveBeenCalled();
    expect(destroyWindows).toHaveBeenCalled();
    expect(app.quit).toHaveBeenCalled();
  });
});
