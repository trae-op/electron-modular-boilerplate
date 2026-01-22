import { describe, expect, it, vi } from "vitest";

vi.mock("#shared/utils.js", () => ({
  isDev: vi.fn(() => false),
  isPlatform: vi.fn(() => true),
}));

vi.mock("#shared/store.js", () => ({
  setStore: vi.fn(),
}));

vi.mock("electron", () => ({
  dialog: {
    showMessageBox: vi.fn(),
  },
}));

vi.mock("electron-updater", () => ({
  default: {
    autoUpdater: {
      on: vi.fn(),
    },
  },
}));

describe("ControlUpdateWindowsPlatformService", () => {
  it("registers updater event handlers and reacts", async () => {
    const { setStore } = await import("#shared/store.js");
    const { dialog } = await import("electron");
    const updater = await import("electron-updater");

    const sendUpdateInfoService = {
      sendUpdateInfo: vi.fn(),
    } as any;

    const notificationProvider = {
      setNotification: vi.fn(() => ({ show: vi.fn() })),
    } as any;

    const { ControlUpdateWindowsPlatformService } =
      await import("./control-update.js");

    const service = new ControlUpdateWindowsPlatformService(
      sendUpdateInfoService,
      notificationProvider,
    );

    service.controlUpdate();

    const handlers = new Map<string, any>();
    vi.mocked(updater.default.autoUpdater.on).mock.calls.forEach(
      ([event, cb]) => {
        handlers.set(event, cb);
      },
    );

    handlers.get("checking-for-update")?.();
    handlers.get("update-not-available")?.();
    handlers.get("update-available")?.({ version: "2.0.0" });
    handlers.get("download-progress")?.({ percent: 50 });
    handlers.get("update-downloaded")?.({ version: "2.0.0" });
    handlers.get("error")?.(new Error("fail"));

    expect(setStore).toHaveBeenCalledWith("updateProcess", true);
    expect(setStore).toHaveBeenCalledWith("updateProcess", false);
    expect(sendUpdateInfoService.sendUpdateInfo).toHaveBeenCalled();
    expect(notificationProvider.setNotification).toHaveBeenCalled();
    expect(dialog.showMessageBox).toHaveBeenCalled();
  });
});
